import axios from 'axios';
import * as https from 'https';
import { IncomingMessage } from 'http';

// Comprehensive list of educational domains
const SAFE_DOMAINS = [
  'edu',
  'khanacademy.org',
  'nationalgeographic.com',
  'nasa.gov',
  'scholastic.com',
  'britannica.com',
  'brainpop.com',
  'pbs.org',
  'discoveryeducation.com'
];

const EDUCATIONAL_KEYWORDS = [
  'education', 'learning', 'study', 'school', 'academic',
  'science', 'math', 'history', 'geography', 'literature',
  'tutorial', 'lesson', 'course', 'educational', 'kids',
  'children', 'student', 'homework', 'practice', 'learn',
  'teach', 'classroom', 'elementary', 'middle school',
  'knowledge', 'facts', 'research', 'library'
];

const BLOCKED_KEYWORDS = [
  'game', 'gaming', 'social', 'chat', 'dating',
  'violence', 'adult', 'gambling', 'betting', 'mature',
  'weapon', 'drug', 'alcohol', 'inappropriate', 'nsfw',
  'casino', 'poker', 'violent', 'gore', 'explicit'
];

interface SearchResult {
  title: string;
  link: string;
  description: string;
  isEducational: boolean;
}

export async function performSafeSearch(query: string): Promise<SearchResult[]> {
  try {
    // Append educational terms to ensure safer results
    const safeQuery = encodeURIComponent(`${query} (education OR learning OR students OR kids)`);
    
    const options = {
      method: 'GET',
      url: `https://google-search72.p.rapidapi.com/search`,
      params: {
        q: safeQuery,
        lr: 'en-US',
        num: '10'
      },
      headers: {
        'x-rapidapi-key': '904922e3cbmsh9f93e45ab5c1ea0p1778e7jsna43a51752189',
        'x-rapidapi-host': 'google-search72.p.rapidapi.com'
      }
    };

    console.log('Sending request with query:', safeQuery);
    const response = await axios.request(options);
    
    // Log the response structure
    console.log('API Response structure:', {
      status: response.status,
      hasData: !!response.data,
      dataKeys: response.data ? Object.keys(response.data) : [],
      itemsLength: response.data?.items?.length || 0
    });

    // Ensure we have data before processing
    if (!response.data) {
      console.warn('API response is missing data property');
      throw new Error('Invalid API response: missing data');
    }

    if (!response.data.items || !Array.isArray(response.data.items)) {
      console.warn('API response is missing items array:', response.data);
      throw new Error('Invalid API response: missing items array');
    }

    if (response.data.items.length === 0) {
      console.warn('API returned empty items array');
      return [];
    }

    const items = response.data.items;

    // Process and filter results
    const processedResults = items
      .map((item: any) => ({
        title: item.title,
        link: item.link,
        description: item.description || item.snippet || '',
        isEducational: isEducationalContent(item)
      }))
      .filter((result: SearchResult) => result.isEducational);

    console.log(`Found ${items.length} total results, ${processedResults.length} educational results`);
    return processedResults;

  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('API request failed:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message
      });
      throw new Error(`API request failed: ${error.message}`);
    }
    console.error('Search error:', error);
    throw new Error(`Search failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

function isEducationalContent(result: any): boolean {
  try {
    const content = (result.title + ' ' + (result.description || result.snippet || '')).toLowerCase();
    const domain = new URL(result.link).hostname.toLowerCase();
    
    // Check for blocked content first
    if (BLOCKED_KEYWORDS.some(keyword => content.includes(keyword))) {
      return false;
    }
    
    // Check if the domain is in our safe list
    if (SAFE_DOMAINS.some(safeDomain => domain.includes(safeDomain))) {
      return true;
    }
    
    // Must contain at least two educational keywords for non-safe-listed domains
    const educationalKeywordCount = EDUCATIONAL_KEYWORDS.filter(keyword => 
      content.includes(keyword)
    ).length;
    
    return educationalKeywordCount >= 2;
  } catch (error) {
    console.error('Error processing search result:', error);
    return false;
  }
}

export function performDirectSearch(query: string): Promise<any> {
  return new Promise((resolve, reject) => {
    const encodedQuery = encodeURIComponent(query);
    const options = {
      method: 'GET',
      hostname: 'google-search72.p.rapidapi.com',
      port: null,
      path: `/search?q=${encodedQuery}&lr=en-US&num=10`,
      headers: {
        'x-rapidapi-key': '904922e3cbmsh9f93e45ab5c1ea0p1778e7jsna43a51752189',
        'x-rapidapi-host': 'google-search72.p.rapidapi.com'
      }
    };

    const req = https.request(options, (res: IncomingMessage) => {
      const chunks: Uint8Array[] = [];

      res.on('data', (chunk: Uint8Array) => {
        chunks.push(chunk);
      });

      res.on('end', () => {
        const body = Buffer.concat(chunks);
        try {
          const data = JSON.parse(body.toString());
          resolve(data);
        } catch (error) {
          reject(new Error('Failed to parse response data'));
        }
      });
    });

    req.on('error', (error: Error) => {
      reject(error);
    });

    req.end();
  });
}

// Example usage with async/await:
export async function searchExample() {
  try {
    const results = await performDirectSearch('world cup');
    console.log(results);
  } catch (error) {
    console.error('Search failed:', error);
  }
}