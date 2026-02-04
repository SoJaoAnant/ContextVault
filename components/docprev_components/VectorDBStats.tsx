'use client';

import React, { useCallback, useEffect, useState } from 'react';

type VectorDBStatsResponse = {
  collection_name: string;
  total_documents: number;
  embedding_model: string;
  llm_model: string;
};

const BACKEND_BASE_URL = 'http://127.0.0.1:8000';

export const VectorDBStats = () => {
  const [stats, setStats] = useState<VectorDBStatsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [clearing, setClearing] = useState(false);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`${BACKEND_BASE_URL}/stats`);
      if (!res.ok) {
        throw new Error(`Failed to fetch stats: ${res.status}`);
      }

      const data: VectorDBStatsResponse = await res.json();
      setStats(data);
    } catch (err) {
      console.error('Error fetching vector DB stats:', err);
      setError(
        err instanceof Error ? err.message : 'Unknown error while fetching stats.'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const handleRefresh = () => {
    fetchStats();
  };

  const handleClearDatabase = async () => {
    if (!confirm('Are you sure you want to clear the entire vector database?')) {
      return;
    }

    try {
      setClearing(true);
      setError(null);

      const res = await fetch(`${BACKEND_BASE_URL}/clear`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        const detail =
          data && typeof data.error === 'string'
            ? data.error
            : `Failed to clear database: ${res.status}`;
        throw new Error(detail);
      }

      // After clearing, refresh stats
      await fetchStats();
    } catch (err) {
      console.error('Error clearing vector DB:', err);
      setError(
        err instanceof Error ? err.message : 'Unknown error while clearing database.'
      );
    } finally {
      setClearing(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return (
    <div className="w-full h-full py-4 pr-4 pl-2">
      <div
        className="
          bg-white
          w-full h-full 
          rounded-2xl 
          border-2 border-gray-400
          shadow-md
          flex flex-col
          overflow-hidden
        "
      >
        {/* Header / Controls */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div>
            <h2 className="text-m font-semibold text-gray-800">
              Vector Database Stats
            </h2>
            <p className="text-s text-gray-500">
              Live statistics from the backend Chroma collection.
            </p>
          </div>

          <div className="flex items-center gap-5">
            <button
              type="button"
              onClick={handleRefresh}
              disabled={loading || clearing}
              className={`
                inline-flex items-center px-3 py-1.5 text-s font-medium
                rounded-md border border-gray-300
                ${loading ? 'bg-gray-100 text-gray-400' : 'bg-white text-gray-700 hover:bg-gray-50'}
              `}
            >
              {loading ? 'Refreshing…' : 'Refresh'}
            </button>
            <button
              type="button"
              onClick={handleClearDatabase}
              disabled={clearing || loading}
              className={`
                inline-flex items-center px-3 py-1.5 text-s font-medium
                rounded-md border
                ${
                  clearing
                    ? 'bg-red-100 border-red-200 text-red-400'
                    : 'bg-red-500 border-red-600 text-white hover:bg-red-600'
                }
              `}
            >
              {clearing ? 'Clearing…' : 'Delete database'}
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 px-6 py-4">
          {error && (
            <div className="mb-3 rounded-md bg-red-50 border border-red-200 px-3 py-2 text-s text-red-700">
              {error}
            </div>
          )}

          {!stats && !loading && !error && (
            <div className="h-full flex items-center justify-center text-gray-400 text-m">
              No stats available. Try refreshing.
            </div>
          )}

          {stats && (
            <div className="space-y-3 text-m">
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Collection name</span>
                <span className="font-mono text-gray-800">
                  {stats.collection_name}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Total documents</span>
                <span className="font-semibold text-gray-900">
                  {stats.total_documents}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Embedding model</span>
                <span className="font-mono text-gray-800">
                  {stats.embedding_model}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">LLM model</span>
                <span className="font-mono text-gray-800">{stats.llm_model}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
