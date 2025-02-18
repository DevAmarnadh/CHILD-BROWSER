import React, { useState, useRef, useEffect } from 'react';
import { Search, Loader2, AlertCircle } from 'lucide-react';
import { performSafeSearch } from '../services/search';

interface SearchResult {
  title: string;
  link: string;
  description: string;
  isEducational: boolean;
}

interface SearchBarProps {
  onResultSelect: (url: string) => void;
}

export function SearchBar({ onResultSelect }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setError(null);
    setShowResults(true);
    
    try {
      const searchResults = await performSafeSearch(query);
      setResults(searchResults);
      if (searchResults.length === 0) {
        setError('No educational results found. Try using more specific educational terms.');
      }
    } catch (error) {
      console.error('Search failed:', error);
      setError('Something went wrong with the search. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-2xl mx-auto mb-8">
      <form onSubmit={handleSearch} className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for educational content..."
          className="w-full px-4 py-3 pl-12 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
        />
        <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
        <button
          type="submit"
          disabled={isLoading || !query.trim()}
          className="absolute right-3 top-2 px-4 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            'Search'
          )}
        </button>
      </form>

      {showResults && (
        <div className="absolute w-full mt-2 bg-white rounded-lg shadow-lg border border-gray-200 max-h-96 overflow-y-auto z-50">
          {error ? (
            <div className="p-4 text-center">
              <AlertCircle className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
              <p className="text-gray-600">{error}</p>
            </div>
          ) : results.length > 0 ? (
            results.map((result, index) => (
              <button
                key={index}
                onClick={() => {
                  onResultSelect(result.link);
                  setShowResults(false);
                  setQuery('');
                }}
                className="w-full p-4 text-left hover:bg-gray-50 border-b border-gray-100 last:border-0 transition-colors"
              >
                <h3 className="text-lg font-semibold text-blue-600 mb-1">
                  {result.title}
                </h3>
                <p className="text-sm text-gray-600 line-clamp-2">{result.description}</p>
              </button>
            ))
          ) : (
            <div className="p-4 text-center text-gray-500">
              {isLoading ? 'Searching for educational content...' : 'Start typing to search'}
            </div>
          )}
        </div>
      )}
    </div>
  );
}