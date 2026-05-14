'use client';

import React, { useState } from 'react';
import { useCardStore } from '@/store/useCardStore';
import { useRetroStore } from '@/store/useRetroStore';
import { TimerBar } from '../workflow/TimerBar';
import { Plus, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const COLUMNS = [
  { groupId: 'g_well', title: 'Neyi İyi Yaptık?', subtitle: 'Mutlu olduğumuz şeyler', icon: '😊', bg: 'bg-emerald-50 dark:bg-emerald-950/20', border: 'border-emerald-200 dark:border-emerald-800/40', accent: 'border-t-emerald-500', badgeBg: 'bg-emerald-100 dark:bg-emerald-900/40', badgeText: 'text-emerald-700 dark:text-emerald-300', inputRing: 'focus:ring-emerald-400' },
  { groupId: 'g_bad', title: 'Neyi Kötü Yaptık?', subtitle: 'İyileştirmemiz gerekenler', icon: '😟', bg: 'bg-red-50 dark:bg-red-950/20', border: 'border-red-200 dark:border-red-800/40', accent: 'border-t-red-500', badgeBg: 'bg-red-100 dark:bg-red-900/40', badgeText: 'text-red-700 dark:text-red-300', inputRing: 'focus:ring-red-400' },
  { groupId: 'g_improve', title: 'Ne Yapmalıyız?', subtitle: 'Farklı yapmamız gerekenler', icon: '💡', bg: 'bg-sky-50 dark:bg-sky-950/20', border: 'border-sky-200 dark:border-sky-800/40', accent: 'border-t-sky-500', badgeBg: 'bg-sky-100 dark:bg-sky-900/40', badgeText: 'text-sky-700 dark:text-sky-300', inputRing: 'focus:ring-sky-400' },
  { groupId: 'g_puzzles', title: 'Kafamızı Karıştıran?', subtitle: 'Cevaplanmamış sorularımız', icon: '🤔', bg: 'bg-amber-50 dark:bg-amber-950/20', border: 'border-amber-200 dark:border-amber-800/40', accent: 'border-t-amber-400', badgeBg: 'bg-amber-100 dark:bg-amber-900/40', badgeText: 'text-amber-700 dark:text-amber-300', inputRing: 'focus:ring-amber-400' },
];

export const BrainstormView: React.FC = () => {
  const { cards, persons, addCard } = useCardStore();
  const { currentPersonId, nextStep } = useRetroStore();
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [anonFlags, setAnonFlags] = useState<Record<string, boolean>>({});
  const [addingTo, setAddingTo] = useState<string | null>(null);

  const handleAddCard = async (groupId: string) => {
    const content = inputs[groupId]?.trim();
    if (!content) return;
    setAddingTo(groupId);
    await addCard(content, currentPersonId, groupId, anonFlags[groupId] ?? false);
    setInputs(prev => ({ ...prev, [groupId]: '' }));
    setAddingTo(null);
  };

  return (
    <div className="space-y-4">
      <TimerBar skipLabel="Gruplamaya Geç" onSkip={nextStep} />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {COLUMNS.map(col => {
          const columnCards = cards.filter(c => c.groupId === col.groupId);
          return (
            <div key={col.groupId} className={`flex flex-col rounded-2xl border-t-4 ${col.accent} ${col.bg} border ${col.border} p-3`}>
              <div className="flex items-center justify-between mb-3 px-1">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-lg">{col.icon}</span>
                    <h3 className="font-bold text-sm text-turkcell-navy dark:text-slate-200">{col.title}</h3>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{col.subtitle}</p>
                </div>
                <span className={`${col.badgeBg} ${col.badgeText} text-xs font-bold px-2 py-0.5 rounded-full`}>
                  {columnCards.length}
                </span>
              </div>

              <div className="mb-3">
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    value={inputs[col.groupId] || ''}
                    onChange={(e) => setInputs(prev => ({ ...prev, [col.groupId]: e.target.value }))}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddCard(col.groupId)}
                    placeholder="+ Fikir ekle..."
                    className={`flex-1 px-3 py-2 text-sm rounded-lg border border-transparent bg-white/70 dark:bg-slate-800/50 text-turkcell-navy dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 ${col.inputRing}`}
                  />
                  <button
                    onClick={() => handleAddCard(col.groupId)}
                    disabled={!inputs[col.groupId]?.trim() || addingTo === col.groupId}
                    className="px-2.5 py-2 rounded-lg bg-white/80 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-600 text-turkcell-navy dark:text-slate-300 hover:bg-white transition-colors disabled:opacity-40"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <label className="flex items-center gap-1.5 mt-1.5 ml-1 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={anonFlags[col.groupId] ?? false}
                    onChange={(e) => setAnonFlags(prev => ({ ...prev, [col.groupId]: e.target.checked }))}
                    className="w-3.5 h-3.5 rounded border-slate-300 text-turkcell-blue focus:ring-turkcell-blue accent-turkcell-blue"
                  />
                  <EyeOff size={11} className="text-slate-400" />
                  <span className="text-[11px] text-slate-400">Anonim gönder</span>
                </label>
              </div>

              <div className="flex flex-col gap-2 min-h-[80px]">
                <AnimatePresence>
                  {columnCards.map(card => (
                    <motion.div
                      key={card.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="relative bg-white dark:bg-turkcell-navy rounded-xl p-3 shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md transition-shadow"
                    >
                      <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{card.content}</p>
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
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {columnCards.length === 0 && (
                  <div className="text-center text-xs text-slate-400 dark:text-slate-500 py-8 border-2 border-dashed border-slate-200/50 dark:border-slate-700/50 rounded-xl">
                    Henüz fikir eklenmedi
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
