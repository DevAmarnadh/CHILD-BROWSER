import React, { useState, useEffect } from 'react';
import { websites } from './data/websites';
import { Website } from './types';
import { WebsiteCard } from './components/WebsiteCard';
import { SearchBar } from './components/SearchBar';
import { Sun, Moon, LogOut, BookOpen, Star, Compass, Shield } from 'lucide-react';
import { AuthContainer } from './components/AuthContainer';
import { verifyToken } from './services/auth';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [selectedWebsite, setSelectedWebsite] = useState<Website | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('auth_token');
      if (token) {
        try {
          await verifyToken(token);
          setIsAuthenticated(true);
        } catch (error) {
          localStorage.removeItem('auth_token');
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const handleWebsiteSelect = (website: Website) => {
    setSelectedWebsite(website);
    window.open(website.url, '_blank', 'noopener,noreferrer');
  };

  const handleSearchResultSelect = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    setIsAuthenticated(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="flex flex-col items-center space-y-4">
          <BookOpen className="w-12 h-12 text-indigo-600 animate-pulse" />
          <div className="text-xl text-gray-600 dark:text-gray-300">Loading your learning space...</div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthContainer onAuthenticated={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md dark:bg-gray-800/80 sticky top-0 z-50 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="bg-indigo-100 dark:bg-indigo-900/50 p-2 rounded-lg">
                <BookOpen className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                KidsLearn Explorer
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                aria-label="Toggle dark mode"
              >
                {darkMode ? (
                  <Sun className="w-6 h-6 text-yellow-400" />
                ) : (
                  <Moon className="w-6 h-6 text-gray-600" />
                )}
              </button>
              <button
                onClick={handleLogout}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                aria-label="Log out"
              >
                <LogOut className="w-6 h-6 text-gray-600 dark:text-gray-300" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg p-8 text-white">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-bold mb-4 flex items-center gap-3">
              Welcome to Your Learning Adventure! 
              <span className="inline-block animate-bounce">🚀</span>
            </h2>
            <p className="text-lg opacity-90">
              Explore amazing educational content, learn new things, and have fun while staying safe online!
            </p>
          </div>
        </div>

        {/* Search Section */}
        <section className="space-y-4">
          <div className="flex items-center space-x-2">
            <Compass className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              Discover Knowledge
            </h2>
          </div>
          <SearchBar onResultSelect={handleSearchResultSelect} />
        </section>
        
        {/* Featured Websites Section */}
        <section className="space-y-6">
          <div className="flex items-center space-x-2">
            <Star className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              Featured Learning Websites
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {websites.map((website) => (
              <WebsiteCard
                key={website.id}
                website={website}
                onSelect={handleWebsiteSelect}
              />
            ))}
          </div>
        </section>

        {/* Safety Tips Section */}
        <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="bg-green-100 dark:bg-green-900/50 p-2 rounded-lg">
              <Shield className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Stay Safe Online
            </h3>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900 dark:text-white">Safety Guidelines</h4>
              <ul className="space-y-3">
                <li className="flex items-start space-x-3">
                  <span className="text-green-500 dark:text-green-400">•</span>
                  <span className="text-gray-600 dark:text-gray-300">Only visit websites that your parents or teachers approve</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-green-500 dark:text-green-400">•</span>
                  <span className="text-gray-600 dark:text-gray-300">Never share personal information online</span>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900 dark:text-white">Health Tips</h4>
              <ul className="space-y-3">
                <li className="flex items-start space-x-3">
                  <span className="text-green-500 dark:text-green-400">•</span>
                  <span className="text-gray-600 dark:text-gray-300">Take regular breaks to rest your eyes</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-green-500 dark:text-green-400">•</span>
                  <span className="text-gray-600 dark:text-gray-300">Ask for help if you see something confusing</span>
                </li>
              </ul>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;