'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';

interface SearchResult {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
}

export function SearchBox() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const handleSearch = useCallback(async (searchQuery: string) => {
    setQuery(searchQuery);

    if (searchQuery.length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
      if (response.ok) {
        const data = await response.json();
        setResults(data);
        setIsOpen(true);
      }
    } catch (error) {
      console.error('Search error:', error);
    }
  }, []);

  return (
    <div className="relative">
      <div className="relative">
        <input
          type="search"
          placeholder="Buscar artigos..."
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => query.length > 1 && setIsOpen(true)}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg z-10">
          {results.map((result) => (
            <Link
              key={result.id}
              href={`/blog/${result.slug}`}
              className="block px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 border-b border-gray-200 dark:border-gray-800 last:border-0 transition"
              onClick={() => {
                setIsOpen(false);
                setQuery('');
              }}
            >
              <div className="font-medium text-gray-900 dark:text-white">{result.title}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1">{result.excerpt}</div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
