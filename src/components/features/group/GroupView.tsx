'use client';

import React from 'react';
import { useCardStore } from '@/store/useCardStore';
import { useAiStore } from '@/store/useAiStore';
import { useRetroStore } from '@/store/useRetroStore';
import { Sparkles, Loader2, ArrowRight, ThumbsUp, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';

const CATEGORY_COLORS: Record<string, string> = {
  'went-well': 'border-t-emerald-500 bg-emerald-50/30 dark:bg-emerald-950/10',
  'went-wrong': 'border-t-red-500 bg-red-50/30 dark:bg-red-950/10',
  'improve': 'border-t-sky-500 bg-sky-50/30 dark:bg-sky-950/10',
  'puzzles': 'border-t-amber-400 bg-amber-50/30 dark:bg-amber-950/10',
};

export const GroupView: React.FC = () => {
  const { cards, groups, persons } = useCardStore();
  const { triggerAutoGroup, isGrouping } = useAiStore();
  const { nextStep } = useRetroStore();

  const aiGroups = groups.filter(g => g.category === 'ai-group');
  const hasAiGroups = aiGroups.length > 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between px-4 py-3 bg-white dark:bg-turkcell-navy rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <p className="text-sm text-slate-600 dark:text-slate-300">
          {hasAiGroups
            ? `AI ${aiGroups.length} grup önerdi. Grupları inceleyip oylamaya geçebilirsiniz.`
            : 'Benzer fikirleri AI ile otomatik gruplayın.'}
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={triggerAutoGroup}
            disabled={isGrouping}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all
              ${isGrouping
                ? 'bg-slate-200 dark:bg-slate-700 text-slate-500 cursor-not-allowed'
                : 'bg-turkcell-navy text-turkcell-yellow hover:bg-turkcell-navy-light'
              }`}
          >
            {isGrouping ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
            {isGrouping ? 'Grupluyor...' : 'AI ile Grupla'}
          </button>
          {hasAiGroups && (
            <button
              onClick={nextStep}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-bold rounded-lg bg-turkcell-yellow text-turkcell-navy hover:bg-turkcell-yellow-dark transition-colors"
            >
              Oylamaya Geç <ArrowRight size={16} />
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {hasAiGroups ? (
          aiGroups.map(group => {
            const groupCards = cards.filter(c => c.groupId === group.id).sort((a, b) => b.votes - a.votes);
            const totalVotes = groupCards.reduce((sum, c) => sum + c.votes, 0);

            return (
              <motion.div
                key={group.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white dark:bg-turkcell-navy rounded-2xl border border-turkcell-blue/30 dark:border-turkcell-blue/20 p-4 shadow-sm"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-turkcell-blue bg-turkcell-blue/10 px-2 py-0.5 rounded">AI ÖNERİSİ</span>
                    <h3 className="font-bold text-sm text-turkcell-navy dark:text-white">{group.title}</h3>
                  </div>
                  {totalVotes > 0 && (
                    <span className="flex items-center gap-1 bg-turkcell-yellow text-turkcell-navy text-xs font-bold px-2 py-0.5 rounded-full">
                      <ThumbsUp size={10} /> {totalVotes}
                    </span>
                  )}
                </div>
                <div className="space-y-2">
                  {groupCards.map(card => (
                    <div key={card.id} className="p-2.5 bg-slate-50 dark:bg-turkcell-navy-light rounded-lg">
                      <p className="text-sm text-slate-700 dark:text-slate-300">{card.content}</p>
                      <div className="flex items-center justify-between mt-1.5">
                        <span className="text-[11px] text-slate-400">
                          {card.isAnonymous ? (
                            <span className="flex items-center gap-1 italic">
                              <EyeOff size={10} /> Anonim
                            </span>
                          ) : (
                            persons.find(p => p.id === card.authorId)?.name
                          )}
                        </span>
                        {card.votes > 0 && (
                          <span className="text-[11px] font-bold text-turkcell-blue">{card.votes} oy</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })
        ) : (
          ['g_well', 'g_bad', 'g_improve', 'g_puzzles'].map(gId => {
            const group = groups.find(g => g.id === gId);
            const groupCards = cards.filter(c => c.groupId === gId).sort((a, b) => b.votes - a.votes);
            if (groupCards.length === 0 || !group) return null;

            return (
              <div key={gId} className={`rounded-2xl border-t-4 border border-slate-200 dark:border-slate-700 p-4 ${CATEGORY_COLORS[group.category] || ''}`}>
                <h3 className="font-bold text-sm text-turkcell-navy dark:text-slate-200 mb-3">{group.title}</h3>
                <div className="space-y-2">
                  {groupCards.map(card => (
                    <div key={card.id} className="p-2.5 bg-white dark:bg-turkcell-navy rounded-lg shadow-sm border border-slate-100 dark:border-slate-700">
                      <p className="text-sm text-slate-700 dark:text-slate-300">{card.content}</p>
                      {card.votes > 0 && (
                        <span className="inline-flex items-center gap-1 mt-1 text-[11px] font-bold text-turkcell-blue">
                          <ThumbsUp size={10} /> {card.votes}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
