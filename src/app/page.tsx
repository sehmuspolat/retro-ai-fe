'use client';

import React, { useEffect } from 'react';
import { useCardStore } from '@/store/useCardStore';
import { useAiStore } from '@/store/useAiStore';
import { Board } from '@/components/features/board/Board';
import { Sparkles, Loader2, Layout } from 'lucide-react';

export default function RetroPage() {
  const { fetchInitialData, isFetchingData, error } = useCardStore();
  const { triggerAutoGroup, isGrouping } = useAiStore();

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  if (isFetchingData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center p-8">{error}</div>;
  }

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 p-6 md:p-10 font-sans">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg shadow-blue-500/20">
            <Layout className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Sprint Retrospektifi</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">TeamRetro • AI Destekli Analiz</p>
          </div>
        </div>

        <button
          onClick={triggerAutoGroup}
          disabled={isGrouping}
          className={`
            group relative flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all shadow-md
            ${isGrouping 
              ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:shadow-lg hover:shadow-purple-500/30 hover:-translate-y-0.5'
            }
          `}
        >
          {isGrouping ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Sparkles className="w-5 h-5 group-hover:animate-pulse" />
          )}
          <span>{isGrouping ? 'AI Grupluyor...' : 'AI Otomatik Grupla'}</span>
        </button>
      </header>

      <section className="max-w-7xl mx-auto h-full">
        <Board />
      </section>
    </main>
  );
}
