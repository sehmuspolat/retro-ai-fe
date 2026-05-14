'use client';

import React, { useState } from 'react';
import { Send, Mic, Square, X } from 'lucide-react';
import { useCardStore } from '@/store/useCardStore';
import { useAudioRecorder } from '@/hooks/useAudioRecorder';

export const CardForm: React.FC = () => {
  const { persons, groups, addCard, isMutating } = useCardStore();
  const [content, setContent] = useState('');
  const [authorId, setAuthorId] = useState(persons[0]?.id || '');
  const [groupId, setGroupId] = useState('g_well');
  const { isRecording, audioUrl, startRecording, stopRecording, clearAudio } = useAudioRecorder();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !authorId) return;

    await addCard(content.trim(), authorId, groupId, false, audioUrl || undefined);
    setContent('');
    clearAudio();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 p-4 bg-white dark:bg-turkcell-navy rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
      <div className="flex items-center gap-3">
        <select
          value={authorId}
          onChange={(e) => setAuthorId(e.target.value)}
          className="px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-turkcell-yellow"
        >
          {persons.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} {p.surname}
            </option>
          ))}
        </select>

        <select
          value={groupId}
          onChange={(e) => setGroupId(e.target.value)}
          className="px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-turkcell-yellow"
        >
          {groups.map((g) => (
            <option key={g.id} value={g.id}>
              {g.title}
            </option>
          ))}
        </select>

        <div className="flex items-center gap-1">
          {isRecording ? (
            <button
              type="button"
              onClick={stopRecording}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 transition-colors"
            >
              <Square size={14} fill="currentColor" />
              Durdur
            </button>
          ) : (
            <button
              type="button"
              onClick={startRecording}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 transition-colors"
            >
              <Mic size={14} />
              Ses Kaydet
            </button>
          )}

          {audioUrl && !isRecording && (
            <button
              type="button"
              onClick={clearAudio}
              className="flex items-center gap-1 px-2 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-red-500 transition-colors"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {audioUrl && !isRecording && (
        <div className="flex items-center gap-2 text-xs text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-3 py-2 rounded-lg">
          <Mic size={12} />
          Ses kaydı eklendi
        </div>
      )}

      <div className="flex gap-2">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Fikrinizi yazın..."
          rows={2}
          className="flex-1 px-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-turkcell-yellow resize-none"
        />
        <button
          type="submit"
          disabled={isMutating || !content.trim()}
          className="self-end flex items-center justify-center w-10 h-10 rounded-xl bg-turkcell-navy text-turkcell-yellow shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
        >
          <Send size={16} />
        </button>
      </div>
    </form>
  );
};
