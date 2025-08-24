'use client';

import { useEffect, useState } from 'react';

export default function DebugPage() {
  const [apiData, setApiData] = useState<any>(null);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/list')
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(data => {
        setApiData(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Debug Page</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          Error: {error}
        </div>
      )}

      <div className="bg-gray-100 p-4 rounded mb-4">
        <h2 className="font-bold mb-2">API Response:</h2>
        <pre className="text-xs overflow-auto">
          {JSON.stringify(apiData, null, 2)}
        </pre>
      </div>

      {apiData?.blobs && apiData.blobs.length > 0 && (
        <div>
          <h2 className="font-bold mb-4">Images ({apiData.blobs.length}):</h2>
          <div className="space-y-4">
            {apiData.blobs.map((blob: any, index: number) => (
              <div key={index} className="border p-4 rounded">
                <p className="text-sm mb-2">URL: {blob.url}</p>
                <p className="text-sm mb-2">Uploaded: {blob.uploadedAt}</p>
                <div className="bg-gray-200 p-2 rounded">
                  <img 
                    src={blob.url} 
                    alt={`Test ${index}`}
                    className="max-w-full"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.parentElement?.insertAdjacentHTML('afterbegin', 
                        '<div class="text-red-500">Failed to load image</div>'
                      );
                    }}
                    onLoad={() => console.log(`Image ${index} loaded successfully`)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
