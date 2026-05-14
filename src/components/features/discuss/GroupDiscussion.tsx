'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Mic, Square, Sparkles, Loader2, MessageSquare, ThumbsUp } from 'lucide-react';
import { Card, Person, Group } from '@/types';
import { useAudioRecorder } from '@/hooks/useAudioRecorder';
import { AiService } from '@/lib/ai-mock';
import { AudioPlayer } from '../media/AudioPlayer';

interface DiscussionNote {
  id: string;
  audioUrl?: string;
  transcript?: string;
  aiSuggestion?: string;
  authorId: string;
}

interface GroupDiscussionProps {
  group: Group;
  cards: Card[];
  persons: Person[];
  rank: number;
  currentPersonId: string;
}

export const GroupDiscussion: React.FC<GroupDiscussionProps> = ({ group, cards, persons, rank, currentPersonId }) => {
  const [isExpanded, setIsExpanded] = useState(rank <= 2);
  const [notes, setNotes] = useState<DiscussionNote[]>([]);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [analyzingNoteId, setAnalyzingNoteId] = useState<string | null>(null);
  const { isRecording, audioUrl, startRecording, stopRecording, clearAudio } = useAudioRecorder();

  const totalVotes = cards.reduce((sum, c) => sum + c.votes, 0);

  const handleSaveRecording = async () => {
    if (!audioUrl) return;
    const noteId = `note_${Date.now()}`;
    setNotes(prev => [...prev, { id: noteId, audioUrl, authorId: currentPersonId }]);

    setIsTranscribing(true);
    const transcript = await AiService.simulateTranscription(audioUrl);
    setNotes(prev => prev.map(n => n.id === noteId ? { ...n, transcript } : n));
    setIsTranscribing(false);
    clearAudio();
  };

  const handleAiAnalyze = async (noteId: string) => {
    const note = notes.find(n => n.id === noteId);
    if (!note?.transcript) return;

    setAnalyzingNoteId(noteId);
    const suggestion = await AiService.analyzeDiscussion(note.transcript, cards);
    setNotes(prev => prev.map(n => n.id === noteId ? { ...n, aiSuggestion: suggestion } : n));
    setAnalyzingNoteId(null);
  };

  return (
    <motion.div
      layout
      className="bg-white dark:bg-turkcell-navy rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden"
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-turkcell-navy-light transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
            ${rank === 1 ? 'bg-turkcell-yellow text-turkcell-navy' : rank === 2 ? 'bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-200' : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'}
          `}>
            {rank}
          </div>
          <div className="text-left">
            <h3 className="font-bold text-turkcell-navy dark:text-white">{group.title}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">{cards.length} fikir</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {totalVotes > 0 && (
            <div className="flex items-center gap-1 text-turkcell-blue">
              <ThumbsUp size={14} />
              <span className="text-sm font-bold">{totalVotes}</span>
            </div>
          )}
          {notes.length > 0 && (
            <span className="text-xs font-bold bg-turkcell-blue/10 text-turkcell-blue px-2 py-0.5 rounded-full">
              {notes.length} not
            </span>
          )}
          {isExpanded ? <ChevronUp size={20} className="text-slate-400" /> : <ChevronDown size={20} className="text-slate-400" />}
        </div>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t border-slate-100 dark:border-slate-700"
          >
            <div className="p-4 space-y-4">
              {/* Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {cards.map(card => (
                  <div key={card.id} className="p-3 bg-slate-50 dark:bg-turkcell-navy-light rounded-xl border border-slate-100 dark:border-slate-600">
                    <p className="text-sm text-slate-700 dark:text-slate-300">{card.content}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-[11px] text-slate-400">
                        {persons.find(p => p.id === card.authorId)?.name}
                      </span>
                      {card.votes > 0 && (
                        <span className="flex items-center gap-1 text-[11px] font-bold text-turkcell-blue">
                          <ThumbsUp size={10} /> {card.votes}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Recording section */}
              <div className="bg-slate-50 dark:bg-turkcell-navy-light rounded-xl p-4 border border-slate-200 dark:border-slate-600">
                <div className="flex items-center gap-2 mb-3">
                  <MessageSquare size={16} className="text-turkcell-navy dark:text-turkcell-yellow" />
                  <h4 className="font-semibold text-sm text-turkcell-navy dark:text-white">Tartışma Notları</h4>
                </div>

                <div className="flex items-center gap-2 mb-3">
                  {isRecording ? (
                    <button
                      onClick={stopRecording}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold bg-red-500 text-white hover:bg-red-600 transition-colors animate-pulse"
                    >
                      <Square size={14} fill="currentColor" />
                      Kaydı Durdur
                    </button>
                  ) : (
                    <button
                      onClick={startRecording}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold bg-turkcell-navy text-turkcell-yellow hover:bg-turkcell-navy-light transition-colors"
                    >
                      <Mic size={14} />
                      Tartışmayı Kaydet
                    </button>
                  )}

                  {audioUrl && !isRecording && (
                    <button
                      onClick={handleSaveRecording}
                      disabled={isTranscribing}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold bg-turkcell-blue text-white hover:bg-turkcell-blue/90 transition-colors disabled:opacity-50"
                    >
                      {isTranscribing ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                      Kaydet & Transkript Al
                    </button>
                  )}
                </div>

                {notes.map(note => (
                  <div key={note.id} className="mt-3 space-y-2">
                    {note.audioUrl && (
                      <div onPointerDown={(e) => e.stopPropagation()}>
                        <AudioPlayer audioUrl={note.audioUrl} />
                      </div>
                    )}

                    {isTranscribing && !note.transcript && (
                      <div className="flex items-center gap-2 text-sm text-turkcell-blue">
                        <Loader2 size={14} className="animate-spin" />
                        Transkript hazırlanıyor...
                      </div>
                    )}

                    {note.transcript && (
                      <div className="p-3 bg-white dark:bg-turkcell-navy rounded-lg border border-slate-200 dark:border-slate-600">
                        <p className="text-xs font-semibold text-turkcell-blue mb-1">📝 Transkript</p>
                        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{note.transcript}</p>
                      </div>
                    )}

                    {note.transcript && !note.aiSuggestion && (
                      <button
                        onClick={() => handleAiAnalyze(note.id)}
                        disabled={analyzingNoteId === note.id}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-turkcell-yellow text-turkcell-navy hover:bg-turkcell-yellow-dark transition-colors disabled:opacity-50"
                      >
                        {analyzingNoteId === note.id ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                        AI Çözüm Önerisi Al
                      </button>
                    )}

                    {note.aiSuggestion && (
                      <div className="p-3 bg-turkcell-yellow/10 dark:bg-turkcell-yellow/5 rounded-lg border border-turkcell-yellow/30">
                        <p className="text-xs font-semibold text-turkcell-navy dark:text-turkcell-yellow mb-1">✨ AI Çözüm Önerisi</p>
                        <p className="text-sm text-turkcell-navy dark:text-slate-300 leading-relaxed whitespace-pre-line">{note.aiSuggestion}</p>
                      </div>
                    )}
                  </div>
                ))}

                {notes.length === 0 && !isRecording && (
                  <p className="text-xs text-slate-400 dark:text-slate-500">Henüz tartışma notu eklenmedi. Konuyu tartışıp ses kaydı yapabilirsiniz.</p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
