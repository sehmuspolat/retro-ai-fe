'use client';

import React from 'react';
import { useRetroStore } from '@/store/useRetroStore';
import { useCardStore } from '@/store/useCardStore';
import { ArrowRight, CheckCircle2, Circle, AlertTriangle } from 'lucide-react';

const PREVIOUS_ACTIONS = [
  { id: 'pa_1', description: 'Code review SLA\'sını 24 saate düşür', assignee: 'Ahmet Yılmaz', isCompleted: true, sprint: 'Sprint 23' },
  { id: 'pa_2', description: 'E2E test framework kurulumunu tamamla', assignee: 'Mehmet Demir', isCompleted: true, sprint: 'Sprint 23' },
  { id: 'pa_3', description: 'Daily standup formatını güncelle (parking lot ekle)', assignee: 'Zeynep Çelik', isCompleted: false, sprint: 'Sprint 23' },
  { id: 'pa_4', description: 'API dokümantasyon CI check\'i ekle', assignee: 'Ahmet Yılmaz', isCompleted: false, sprint: 'Sprint 22' },
  { id: 'pa_5', description: 'Sprint refinement için template oluştur', assignee: 'Ayşe Kaya', isCompleted: true, sprint: 'Sprint 22' },
];

export const OpenActionsView: React.FC = () => {
  const { nextStep } = useRetroStore();
  const completedCount = PREVIOUS_ACTIONS.filter(a => a.isCompleted).length;
  const openCount = PREVIOUS_ACTIONS.filter(a => !a.isCompleted).length;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-turkcell-navy dark:text-white">Açık Aksiyonlar</h2>
        <p className="text-slate-500 dark:text-slate-400">Önceki retrospektiflerden kalan aksiyon maddeleri</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white dark:bg-turkcell-navy rounded-xl border border-slate-200 dark:border-slate-700 p-4 text-center">
          <p className="text-2xl font-bold text-turkcell-navy dark:text-white">{PREVIOUS_ACTIONS.length}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Toplam Aksiyon</p>
        </div>
        <div className="bg-emerald-50 dark:bg-emerald-950/20 rounded-xl border border-emerald-200 dark:border-emerald-800/40 p-4 text-center">
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{completedCount}</p>
          <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">Tamamlandı</p>
        </div>
        <div className="bg-amber-50 dark:bg-amber-950/20 rounded-xl border border-amber-200 dark:border-amber-800/40 p-4 text-center">
          <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{openCount}</p>
          <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">Açık</p>
        </div>
      </div>

      <div className="bg-white dark:bg-turkcell-navy rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
        <div className="px-5 py-3 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-turkcell-navy-light">
          <div className="grid grid-cols-12 gap-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            <div className="col-span-1">Durum</div>
            <div className="col-span-5">Aksiyon</div>
            <div className="col-span-3">Sorumlu</div>
            <div className="col-span-3">Sprint</div>
          </div>
        </div>
        {PREVIOUS_ACTIONS.map(action => (
          <div key={action.id} className="px-5 py-3 border-b border-slate-50 dark:border-slate-800 last:border-0 hover:bg-slate-50/50 dark:hover:bg-turkcell-navy-light/50 transition-colors">
            <div className="grid grid-cols-12 gap-4 items-center">
              <div className="col-span-1">
                {action.isCompleted ? (
                  <CheckCircle2 size={20} className="text-emerald-500" />
                ) : (
                  <AlertTriangle size={20} className="text-amber-500" />
                )}
              </div>
              <div className="col-span-5">
                <p className={`text-sm ${action.isCompleted ? 'line-through text-slate-400 dark:text-slate-500' : 'text-turkcell-navy dark:text-white font-medium'}`}>
                  {action.description}
                </p>
              </div>
              <div className="col-span-3">
                <span className="text-sm text-slate-600 dark:text-slate-300">{action.assignee}</span>
              </div>
              <div className="col-span-3">
                <span className="text-xs px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400">
                  {action.sprint}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {openCount > 0 && (
        <div className="flex items-center gap-2 px-4 py-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 rounded-xl">
          <AlertTriangle size={16} className="text-amber-500" />
          <p className="text-sm text-amber-700 dark:text-amber-400">
            <span className="font-bold">{openCount} aksiyon</span> hâlâ açık durumda. Bu sprint&apos;te ilerleme yapıldı mı?
          </p>
        </div>
      )}

      <div className="flex justify-end">
        <button
          onClick={nextStep}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-turkcell-navy text-turkcell-yellow font-bold text-sm hover:bg-turkcell-navy-light transition-colors shadow-lg"
        >
          Beyin Fırtınasına Geç <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
};
