'use client';

import React from 'react';
import { useCardStore } from '@/store/useCardStore';
import { useRetroStore } from '@/store/useRetroStore';
import { TimerBar } from '../workflow/TimerBar';
import { ThumbsUp, ArrowRight, Sparkles, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';

const CATEGORY_STYLES: Record<string, { icon: string; accent: string; bg: string }> = {
  'went-well': { icon: '😊', accent: 'border-t-emerald-500', bg: 'bg-emerald-50/50 dark:bg-emerald-950/10' },
  'went-wrong': { icon: '😟', accent: 'border-t-red-500', bg: 'bg-red-50/50 dark:bg-red-950/10' },
  'improve': { icon: '💡', accent: 'border-t-sky-500', bg: 'bg-sky-50/50 dark:bg-sky-950/10' },
  'puzzles': { icon: '🤔', accent: 'border-t-amber-400', bg: 'bg-amber-50/50 dark:bg-amber-950/10' },
  'ai-group': { icon: '✨', accent: 'border-t-turkcell-blue', bg: 'bg-turkcell-blue/5 dark:bg-turkcell-blue/5' },
};

export const VoteView: React.FC = () => {
  const { cards, persons, groups, voteCard, unvoteCard } = useCardStore();
  const { currentPersonId, maxVotesPerPerson, nextStep } = useRetroStore();

  const votesUsed = cards.reduce((count, card) => count + (card.voters.includes(currentPersonId) ? 1 : 0), 0);
  const votesRemaining = maxVotesPerPerson - votesUsed;
  const currentPerson = persons.find(p => p.id === currentPersonId);

  const handleVote = (cardId: string) => {
    const card = cards.find(c => c.id === cardId);
    if (!card) return;
    if (card.voters.includes(currentPersonId)) {
      unvoteCard(cardId, currentPersonId);
    } else if (votesRemaining > 0) {
      voteCard(cardId, currentPersonId);
    }
  };

  // Use AI groups if they exist, otherwise fall back to category groups
  const aiGroups = groups.filter(g => g.category === 'ai-group');
  const categoryGroups = groups.filter(g => ['went-well', 'went-wrong', 'improve', 'puzzles'].includes(g.category));
  const displayGroups = aiGroups.length > 0 ? aiGroups : categoryGroups;

  return (
    <div className="space-y-4">
      <TimerBar skipLabel="Tartışmaya Geç" onSkip={nextStep} />

      <div className="flex items-center justify-between px-4 py-3 bg-turkcell-yellow/10 border border-turkcell-yellow/30 rounded-xl">
        <div className="flex items-center gap-2">
          <ThumbsUp size={18} className="text-turkcell-navy" />
          <span className="text-sm font-semibold text-turkcell-navy dark:text-white">
            Oylama — <span className="text-turkcell-blue">{currentPerson?.name}</span> için kalan oy: <span className="font-bold text-turkcell-blue">{votesRemaining}</span>/{maxVotesPerPerson}
          </span>
        </div>
        <button
          onClick={nextStep}
          className="flex items-center gap-1.5 px-4 py-2 text-sm font-bold rounded-lg bg-turkcell-navy text-turkcell-yellow hover:bg-turkcell-navy-light transition-colors"
        >
          Tartışmaya Geç <ArrowRight size={16} />
        </button>
      </div>

      <div className={`grid grid-cols-1 gap-4 ${displayGroups.length <= 4 ? 'md:grid-cols-2 xl:grid-cols-4' : 'md:grid-cols-2 xl:grid-cols-3'}`}>
        {displayGroups.map(group => {
          const style = CATEGORY_STYLES[group.category] || CATEGORY_STYLES['ai-group'];
          const groupCards = cards.filter(c => c.groupId === group.id).sort((a, b) => b.votes - a.votes);

          return (
            <div key={group.id} className={`rounded-2xl border-t-4 ${style.accent} ${style.bg} border border-slate-200 dark:border-slate-700 p-3`}>
              <div className="flex items-center gap-1.5 mb-3 px-1">
                <span className="text-lg">{style.icon}</span>
                <h3 className="font-bold text-sm text-turkcell-navy dark:text-slate-200">{group.title}</h3>
                {group.category === 'ai-group' && (
                  <Sparkles size={12} className="text-turkcell-blue" />
                )}
                <span className="ml-auto text-xs font-bold bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-full">
                  {groupCards.length}
                </span>
              </div>

              <div className="flex flex-col gap-2">
                {groupCards.map(card => {
                  const hasVoted = card.voters.includes(currentPersonId);
                  return (
                    <motion.div
                      key={card.id}
                      whileTap={{ scale: 0.98 }}
                      className="relative bg-white dark:bg-turkcell-navy rounded-xl p-3 shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md transition-shadow"
                    >
                      <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed pr-14">{card.content}</p>

                      <button
                        onClick={() => handleVote(card.id)}
                        className={`absolute top-2 right-2 flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-bold transition-all
                          ${hasVoted
                            ? 'bg-turkcell-blue text-white shadow-md scale-110'
                            : votesRemaining > 0
                              ? 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 hover:bg-turkcell-blue/10 hover:text-turkcell-blue'
                              : 'bg-slate-50 dark:bg-slate-800 text-slate-300 dark:text-slate-600 cursor-not-allowed'
                          }`}
                      >
                        <ThumbsUp size={12} />
                        {card.votes > 0 && <span>{card.votes}</span>}
                      </button>

                      <div className="mt-2 flex items-center gap-1.5">
                        {card.isAnonymous ? (
                          <>
                            <div className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-600 flex items-center justify-center">
                              <EyeOff size={10} className="text-slate-500 dark:text-slate-400" />
                            </div>
                            <span className="text-[11px] text-slate-400 italic">Anonim</span>
                          </>
                        ) : (
                          <>
                            <div className="w-5 h-5 rounded-full bg-turkcell-yellow/20 text-turkcell-navy dark:text-turkcell-yellow flex items-center justify-center text-[10px] font-bold">
                              {persons.find(p => p.id === card.authorId)?.name?.charAt(0) || '?'}
                            </div>
                            <span className="text-[11px] text-slate-400">{persons.find(p => p.id === card.authorId)?.name}</span>
                          </>
                        )}
                        {card.votes > 0 && (
                          <span className="ml-auto text-[11px] font-bold text-turkcell-blue">{card.votes} oy</span>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
                {groupCards.length === 0 && (
                  <div className="text-center text-xs text-slate-400 py-6 border-2 border-dashed border-slate-200/50 dark:border-slate-700/50 rounded-xl">
                    Kart yok
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
