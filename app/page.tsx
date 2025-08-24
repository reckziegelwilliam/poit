'use client';

import { useEffect, useState } from 'react';

interface Poem {
  url: string;
  uploadedAt: string;
  pathname?: string;
  contentType?: string;
  size?: number;
}

export default function PoetryGallery() {
  const [poems, setPoems] = useState<Poem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPoem, setSelectedPoem] = useState<string | null>(null);

  useEffect(() => {
    fetchPoems();
    // Refresh every 30 seconds to see new uploads
    const interval = setInterval(fetchPoems, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchPoems = async () => {
    try {
      const response = await fetch('/api/list');
      if (!response.ok) {
        throw new Error('Failed to fetch poems');
      }
      const data = await response.json();
      setPoems(data.blobs || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load poems');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }).format(date);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse text-2xl font-serif text-gray-600 dark:text-gray-400">
            Loading poetry...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <button 
            onClick={fetchPoems}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-700 backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl sm:text-4xl font-serif text-gray-900 dark:text-white">
              My Poetry Collection
            </h1>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {poems.length} {poems.length === 1 ? 'poem' : 'poems'}
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {poems.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-block p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
              <svg className="w-24 h-24 mx-auto mb-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <h2 className="text-2xl font-serif text-gray-900 dark:text-white mb-3">
                No poems yet
              </h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-md">
                Share your first screenshot from your Notes app to begin your collection
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Gallery Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {poems.map((poem) => (
                <article 
                  key={poem.url} 
                  className="group relative bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer"
                  onClick={() => setSelectedPoem(poem.url)}
                >
                  <div className="aspect-[3/4] relative overflow-hidden bg-gray-100 dark:bg-gray-700">
                    <img 
                      src={poem.url} 
                      alt="Poetry screenshot"
                      loading="lazy"
                      className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <div className="p-3 border-t border-gray-100 dark:border-gray-700">
                    <time className="text-xs text-gray-500 dark:text-gray-400">
                      {formatDate(poem.uploadedAt)}
                    </time>
                  </div>
                </article>
              ))}
            </div>

            {/* Lightbox Modal */}
            {selectedPoem && (
              <div 
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
                onClick={() => setSelectedPoem(null)}
              >
                <div className="relative max-w-5xl max-h-[90vh] w-full h-full flex items-center justify-center">
                  <img 
                    src={selectedPoem} 
                    alt="Poetry screenshot expanded"
                    className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <button
                    onClick={() => setSelectedPoem(null)}
                    className="absolute top-4 right-4 p-2 bg-white/10 backdrop-blur-sm rounded-full text-white hover:bg-white/20 transition-colors"
                    aria-label="Close"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
