'use client';

import React from 'react';
import { useRetroStore } from '@/store/useRetroStore';
import { useCardStore } from '@/store/useCardStore';
import { ArrowRight, Users, Calendar, Target, Clock } from 'lucide-react';

export const WelcomeView: React.FC = () => {
  const { nextStep } = useRetroStore();
  const { persons } = useCardStore();

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="text-center space-y-3">
        <h2 className="text-3xl font-bold text-turkcell-navy dark:text-white">Sprint Retrospektifi</h2>
        <p className="text-lg text-slate-500 dark:text-slate-400">
          Office Team &gt; Sprint 24 Retrospektifi
        </p>
      </div>

      <div className="bg-white dark:bg-turkcell-navy rounded-2xl border border-slate-200 dark:border-slate-700 p-8 shadow-sm">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="space-y-2">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-turkcell-blue/10">
              <Calendar className="w-6 h-6 text-turkcell-blue" />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">Tarih</p>
            <p className="text-sm font-bold text-turkcell-navy dark:text-white">14 Mayıs 2026</p>
          </div>
          <div className="space-y-2">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30">
              <Users className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">Katılımcılar</p>
            <p className="text-sm font-bold text-turkcell-navy dark:text-white">{persons.length} kişi</p>
          </div>
          <div className="space-y-2">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/30">
              <Target className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">Format</p>
            <p className="text-sm font-bold text-turkcell-navy dark:text-white">4 Kategori</p>
          </div>
          <div className="space-y-2">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30">
              <Clock className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">Süre</p>
            <p className="text-sm font-bold text-turkcell-navy dark:text-white">~45 dk</p>
          </div>
        </div>

        <div className="mt-8 border-t border-slate-100 dark:border-slate-700 pt-6">
          <h3 className="font-bold text-turkcell-navy dark:text-white mb-3">Katılımcılar</h3>
          <div className="flex flex-wrap gap-2">
            {persons.map(p => (
              <div key={p.id} className="flex items-center gap-2 px-3 py-2 rounded-full bg-slate-50 dark:bg-turkcell-navy-light border border-slate-200 dark:border-slate-600">
                <div className="w-6 h-6 rounded-full bg-turkcell-blue/10 text-turkcell-blue flex items-center justify-center text-xs font-bold">
                  {p.name.charAt(0)}
                </div>
                <span className="text-sm font-medium text-turkcell-navy dark:text-white">{p.name} {p.surname}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 border-t border-slate-100 dark:border-slate-700 pt-6">
          <h3 className="font-bold text-turkcell-navy dark:text-white mb-2">Akış</h3>
          <div className="grid grid-cols-3 md:grid-cols-4 gap-2 text-xs">
            {[
              { step: '1', label: 'Beyin Fırtınası', desc: 'Fikirlerinizi yazın' },
              { step: '2', label: 'Gruplama', desc: 'AI ile grupla' },
              { step: '3', label: 'Oylama', desc: 'En önemlileri seçin' },
              { step: '4', label: 'Tartışma', desc: 'Konuşun ve kayıt alın' },
            ].map(item => (
              <div key={item.step} className="p-3 rounded-xl bg-turkcell-gray dark:bg-turkcell-navy-light text-center">
                <div className="w-6 h-6 rounded-full bg-turkcell-yellow text-turkcell-navy text-xs font-bold flex items-center justify-center mx-auto mb-1.5">
                  {item.step}
                </div>
                <p className="font-bold text-turkcell-navy dark:text-white">{item.label}</p>
                <p className="text-slate-500 dark:text-slate-400 mt-0.5">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={nextStep}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-turkcell-navy text-turkcell-yellow font-bold text-sm hover:bg-turkcell-navy-light transition-colors shadow-lg"
        >
          Açık Aksiyonlara Geç <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
};
