import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { Pool } from 'pg';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_5cPLhMDaQN8E@ep-shy-dust-a550o82b-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require'
});

// Initialize database tables
async function initializeDatabase() {
  const createTablesQuery = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      full_name VARCHAR(255),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      last_login TIMESTAMP WITH TIME ZONE
    );

    CREATE TABLE IF NOT EXISTS search_history (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id),
      query TEXT NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    await pool.query(createTablesQuery);
    console.log('Database tables initialized successfully');
  } catch (error) {
    console.error('Error initializing database tables:', error);
    throw error;
  }
}

// Test database connection and initialize tables
pool.connect(async (err, client, release) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    process.exit(1);
  } else {
    console.log('Successfully connected to database');
    try {
      await initializeDatabase();
      release();
    } catch (error) {
      console.error('Database initialization failed:', error);
      release();
      process.exit(1);
    }
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ message: 'Internal server error', error: err.message });
});

// JWT secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Middleware to verify token and attach user to request
interface AuthRequest extends Request {
  user?: { userId: number; email: string };
}

async function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number; email: string };
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
}

// Routes
app.post('/auth/register', async (req: Request, res: Response) => {
  try {
    const { email, password, fullName } = req.body;
    console.log('Registration attempt for:', email);

    // Validate input
    if (!email || !password || !fullName) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if user exists
    const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Insert user
    const result = await pool.query(
      'INSERT INTO users (email, password_hash, full_name) VALUES ($1, $2, $3) RETURNING id, email, full_name',
      [email, passwordHash, fullName]
    );

    console.log('User registered successfully:', email);
    res.json({ user: result.rows[0] });
  } catch (error) {
    console.error('Registration error:', error);
    if (error instanceof Error) {
      res.status(500).json({ message: 'Registration failed', error: error.message });
    } else {
      res.status(500).json({ message: 'Registration failed', error: 'Unknown error' });
    }
  }
});

app.post('/auth/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt for:', email);

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = result.rows[0];

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Update last login
    await pool.query('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1', [user.id]);

    // Generate token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    console.log('User logged in successfully:', email);
    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    if (error instanceof Error) {
      res.status(500).json({ message: 'Login failed', error: error.message });
    } else {
      res.status(500).json({ message: 'Login failed', error: 'Unknown error' });
    }
  }
});

app.get('/auth/verify', async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
    const result = await pool.query(
      'SELECT id, email, full_name FROM users WHERE id = $1',
      [decoded.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user: result.rows[0] });
  } catch (error) {
    console.error('Token verification error:', error);
    if (error instanceof Error) {
      res.status(401).json({ message: 'Invalid token', error: error.message });
    } else {
      res.status(401).json({ message: 'Invalid token', error: 'Unknown error' });
    }
  }
});

// Search history routes
app.post('/search/save', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { query } = req.body;
    const userId = req.user?.userId;

    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const result = await pool.query(
      'INSERT INTO search_history (user_id, query) VALUES ($1, $2) RETURNING id, query, created_at',
      [userId, query]
    );

    res.json({ search: result.rows[0] });
  } catch (error) {
    console.error('Error saving search history:', error);
    res.status(500).json({ message: 'Failed to save search history' });
  }
});

app.get('/search/history', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const result = await pool.query(
      `SELECT 
        id,
        query,
        created_at
      FROM search_history 
      WHERE user_id = $1 
      ORDER BY created_at DESC 
      LIMIT 50`,
      [userId]
    );

    res.json({
      count: result.rows.length,
      searches: result.rows
    });
  } catch (error) {
    console.error('Error fetching search history:', error);
    res.status(500).json({ message: 'Failed to fetch search history' });
  }
});

// Development routes
app.get('/dev/search-history', async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`
      SELECT 
        sh.id,
        sh.query,
        sh.created_at,
        u.email,
        u.full_name
      FROM search_history sh
      JOIN users u ON sh.user_id = u.id
      ORDER BY sh.created_at DESC
      LIMIT 100
    `);
    
    res.json({
      count: result.rows.length,
      searches: result.rows
    });
  } catch (error) {
    console.error('Error fetching all search history:', error);
    res.status(500).json({ message: 'Failed to fetch search history' });
  }
});

// Development routes (Remove in production)
app.get('/dev/users', async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`
      SELECT 
        id,
        email,
        full_name,
        created_at,
        last_login
      FROM users
      ORDER BY created_at DESC
    `);
    
    res.json({
      count: result.rows.length,
      users: result.rows
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
});

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 