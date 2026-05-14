'use client';

import React, { useState, useEffect } from 'react';
import { useRetroStore } from '@/store/useRetroStore';
import { useCardStore } from '@/store/useCardStore';
import { ArrowRight, Smile, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ICEBREAKER_QUESTIONS = [
  'Bu sprintte seni en çok gülümseten şey ne oldu?',
  'Takımdaki süper gücün nedir?',
  'Bu hafta öğrendiğin en değerli şey ne?',
  'Bir emoji ile bu sprinti nasıl özetlersin?',
  'Takımda en çok kimin yardımını aldın?',
];

export const IcebreakerView: React.FC = () => {
  const { nextStep, icebreakerAnswers, setIcebreakerAnswer, currentPersonId } = useRetroStore();
  const { persons } = useCardStore();
  const [input, setInput] = useState('');
  const [question, setQuestion] = useState(ICEBREAKER_QUESTIONS[0]);

  useEffect(() => {
    setQuestion(ICEBREAKER_QUESTIONS[Math.floor(Math.random() * ICEBREAKER_QUESTIONS.length)]);
  }, []);

  const handleSubmit = () => {
    if (!input.trim()) return;
    setIcebreakerAnswer(currentPersonId, input.trim());
    setInput('');
  };

  const answeredPersons = persons.filter(p => icebreakerAnswers[p.id]);

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-turkcell-yellow/20">
          <Smile className="w-8 h-8 text-turkcell-yellow" />
        </div>
        <h2 className="text-2xl font-bold text-turkcell-navy dark:text-white">Icebreaker</h2>
        <p className="text-slate-500 dark:text-slate-400">Takım ruhunu canlandırmak için hızlı bir soru</p>
      </div>

      <div className="bg-white dark:bg-turkcell-navy rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
        <h3 className="text-lg font-bold text-turkcell-navy dark:text-white mb-4">{question}</h3>

        {!icebreakerAnswers[currentPersonId] ? (
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              placeholder="Cevabını yaz..."
              className="flex-1 px-4 py-3 text-sm rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-turkcell-navy-light text-turkcell-navy dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-turkcell-yellow"
            />
            <button
              onClick={handleSubmit}
              disabled={!input.trim()}
              className="px-4 py-3 rounded-xl bg-turkcell-navy text-turkcell-yellow font-bold text-sm hover:bg-turkcell-navy-light transition-colors disabled:opacity-40"
            >
              <Send size={18} />
            </button>
          </div>
        ) : (
          <div className="px-4 py-3 bg-turkcell-yellow/10 rounded-xl border border-turkcell-yellow/30">
            <p className="text-sm text-turkcell-navy dark:text-white font-medium">{icebreakerAnswers[currentPersonId]}</p>
            <p className="text-xs text-slate-400 mt-1">Cevabın kaydedildi!</p>
          </div>
        )}
      </div>

      {answeredPersons.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Cevaplar ({answeredPersons.length}/{persons.length})</h4>
          <AnimatePresence>
            {answeredPersons.map(person => (
              <motion.div
                key={person.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-3 p-3 bg-white dark:bg-turkcell-navy rounded-xl border border-slate-100 dark:border-slate-700"
              >
                <div className="w-8 h-8 rounded-full bg-turkcell-blue/10 text-turkcell-blue flex items-center justify-center text-sm font-bold flex-shrink-0">
                  {person.name.charAt(0)}
                </div>
                <div>
                  <p className="text-xs font-bold text-turkcell-navy dark:text-white">{person.name} {person.surname}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mt-0.5">{icebreakerAnswers[person.id]}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      <div className="flex justify-end">
        <button
          onClick={nextStep}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-turkcell-navy text-turkcell-yellow font-bold text-sm hover:bg-turkcell-navy-light transition-colors shadow-lg"
        >
          Hoşgeldin Ekranına Geç <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
};
