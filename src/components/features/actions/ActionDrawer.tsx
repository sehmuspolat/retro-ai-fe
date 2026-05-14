'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, CheckCircle, UserCircle } from 'lucide-react';
import { useUiStore } from '@/store/useUiStore';
import { useCardStore } from '@/store/useCardStore';
import { useAiStore } from '@/store/useAiStore';
import { api } from '@/services/api';

export const ActionDrawer: React.FC = () => {
  const { isActionDrawerOpen, selectedCardForAction, closeActionDrawer } = useUiStore();
  const { persons } = useCardStore();
  const { analyzeCardAndSuggest, isAnalyzingCardId } = useAiStore();

  const [suggestion, setSuggestion] = useState<string | null>(null);
  const [assigneeId, setAssigneeId] = useState('p1');
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const isAnalyzing = selectedCardForAction ? isAnalyzingCardId === selectedCardForAction.id : false;

  const handleGenerateSuggestion = async () => {
    if (!selectedCardForAction) return;
    setSuggestion(null);
    setSaved(false);

    const { AiService } = await import('@/lib/ai-mock');
    const result = await AiService.generateActionSuggestion(selectedCardForAction);
    setSuggestion(result.description);
    setAssigneeId(result.assigneeId);
  };

  const handleSaveAction = async () => {
    if (!suggestion || !selectedCardForAction) return;
    setIsSaving(true);
    await api.createAction({
      description: suggestion,
      assigneeId,
      cardId: selectedCardForAction.id,
      isCompleted: false,
    });
    setIsSaving(false);
    setSaved(true);
  };

  const handleClose = () => {
    closeActionDrawer();
    setSuggestion(null);
    setSaved(false);
  };

  return (
    <AnimatePresence>
      {isActionDrawerOpen && selectedCardForAction && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white dark:bg-turkcell-navy shadow-2xl z-50 flex flex-col"
          >
            <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-700">
              <h2 className="text-lg font-bold text-turkcell-navy dark:text-turkcell-yellow">AI Aksiyon Önerisi</h2>
              <button onClick={handleClose} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-turkcell-navy-light transition-colors">
                <X size={20} className="text-slate-500" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-1 font-medium">Seçilen Kart</p>
                <p className="text-sm text-slate-700 dark:text-slate-300">{selectedCardForAction.content}</p>
              </div>

              {!suggestion && !saved && (
                <button
                  onClick={handleGenerateSuggestion}
                  disabled={isAnalyzing}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold text-sm bg-turkcell-navy text-turkcell-yellow hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Sparkles size={16} />
                  {isAnalyzing ? 'Analiz Ediliyor...' : 'AI ile Aksiyon Üret'}
                </button>
              )}

              {suggestion && !saved && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <div className="p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-xl">
                    <p className="text-xs text-purple-500 dark:text-purple-400 mb-1 font-medium flex items-center gap-1">
                      <Sparkles size={12} /> AI Önerisi
                    </p>
                    <p className="text-sm text-purple-700 dark:text-purple-300">{suggestion}</p>
                  </div>

                  <div>
                    <label className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-1 block">Atanan Kişi</label>
                    <div className="flex items-center gap-2">
                      <UserCircle size={18} className="text-slate-400" />
                      <select
                        value={assigneeId}
                        onChange={(e) => setAssigneeId(e.target.value)}
                        className="flex-1 px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        {persons.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name} {p.surname}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <button
                    onClick={handleSaveAction}
                    disabled={isSaving}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold text-sm bg-green-600 text-white hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSaving ? 'Kaydediliyor...' : 'Aksiyonu Kaydet'}
                  </button>
                </motion.div>
              )}

              {saved && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center gap-3 p-6 text-center"
                >
                  <CheckCircle size={48} className="text-green-500" />
                  <p className="font-semibold text-slate-700 dark:text-slate-300">Aksiyon başarıyla kaydedildi!</p>
                  <button
                    onClick={handleClose}
                    className="mt-2 px-4 py-2 text-sm rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                  >
                    Kapat
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
