'use client';

import React, { useState } from 'react';
import { useRetroStore } from '@/store/useRetroStore';
import { useCardStore } from '@/store/useCardStore';
import { AiService } from '@/lib/ai-mock';
import { FileDown, Share2, CalendarPlus, LogOut, Loader2, Sparkles, CheckCircle2 } from 'lucide-react';

const RATING_CONFIG = [
  { value: 1, label: 'KESİNLİKLE HAYIR', color: 'bg-red-500' },
  { value: 2, label: 'PEK DEĞİL', color: 'bg-orange-500' },
  { value: 3, label: 'KISMEN', color: 'bg-turkcell-yellow' },
  { value: 4, label: 'ÇOĞUNLUKLA', color: 'bg-emerald-400' },
  { value: 5, label: 'KESİNLİKLE', color: 'bg-emerald-600' },
];

export const CloseView: React.FC = () => {
  const { feedbacks, addFeedback, currentPersonId, agreements, retroEnded, endRetro } = useRetroStore();
  const { cards, groups, persons } = useCardStore();
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const totalVotes = cards.reduce((sum, c) => sum + c.votes, 0);
  const aiGroups = groups.filter(g => g.category === 'ai-group');
  const currentFeedback = feedbacks.find(f => f.personId === currentPersonId);

  const handleGenerateSummary = async () => {
    setIsGenerating(true);
    const summary = await AiService.analyzeDiscussion(
      `Retrospektif özeti: ${cards.length} fikir, ${totalVotes} oy, ${aiGroups.length} AI grup, ${agreements.length} anlaşma`,
      cards
    );
    setAiSummary(summary);
    setIsGenerating(false);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {retroEnded && (
        <div className="text-center py-3 bg-turkcell-blue/10 rounded-xl border border-turkcell-blue/30">
          <p className="text-turkcell-blue font-bold text-sm flex items-center justify-center gap-2">
            <CheckCircle2 size={16} /> Bu retrospektif sona erdi
          </p>
        </div>
      )}

      {/* Stats bar */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { label: 'fikir eklendi', value: `${cards.length}`, sub: `${persons.length} katılımcı` },
          { label: 'oy kullanıldı', value: `${totalVotes}`, sub: `${aiGroups.length} grup` },
          { label: 'yeni aksiyon', value: '2', sub: 'açık aksiyon yok' },
          { label: 'yeni anlaşma', value: `${agreements.length}`, sub: 'takım anlaşması' },
          { label: 'katılım', value: `${Math.round((persons.length / persons.length) * 100)}%`, sub: `${persons.length}/${persons.length}` },
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-turkcell-navy rounded-xl border border-slate-200 dark:border-slate-700 p-3 text-center">
            <p className="text-xl font-bold text-turkcell-navy dark:text-white">{stat.value}</p>
            <p className="text-[11px] font-semibold text-turkcell-navy dark:text-slate-300">{stat.label}</p>
            <p className="text-[10px] text-slate-400">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Meeting feedback */}
      <div className="bg-white dark:bg-turkcell-navy rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
        <h3 className="text-center font-bold text-lg text-turkcell-navy dark:text-white mb-6">
          Bu toplantı zamanınıza değdi mi?
        </h3>
        <div className="flex justify-center gap-3">
          {RATING_CONFIG.map(r => (
            <button
              key={r.value}
              onClick={() => addFeedback(currentPersonId, r.value)}
              className={`flex flex-col items-center gap-2 px-4 py-3 rounded-xl transition-all
                ${currentFeedback?.rating === r.value
                  ? 'ring-2 ring-turkcell-navy dark:ring-turkcell-yellow scale-105 shadow-lg'
                  : 'hover:scale-105'
                }`}
            >
              <div className={`w-10 h-10 rounded-full ${r.color} flex items-center justify-center text-white font-bold text-lg shadow-md`}>
                {r.value}
              </div>
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{r.label}</span>
            </button>
          ))}
        </div>
        <p className="text-center text-xs text-slate-400 mt-4">
          {feedbacks.length > 0 ? `${feedbacks.length} katılımcı yanıtladı` : 'Henüz yanıt yok'} — <button className="text-turkcell-blue font-bold hover:underline">SONUÇLARI GÖR</button>
        </p>
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap justify-center gap-3">
        {[
          { icon: Sparkles, label: 'AI ÖZET', color: 'bg-turkcell-navy text-turkcell-yellow', action: handleGenerateSummary, loading: isGenerating },
          { icon: FileDown, label: 'İNDİR', color: 'bg-turkcell-blue text-white' },
          { icon: Share2, label: 'PAYLAŞ', color: 'bg-turkcell-blue text-white' },
          { icon: CalendarPlus, label: 'PLANLA', color: 'bg-turkcell-blue text-white' },
          { icon: LogOut, label: 'ÇIKIŞ', color: 'bg-red-500 text-white', action: endRetro },
        ].map((btn, i) => {
          const Icon = btn.icon;
          return (
            <button
              key={i}
              onClick={btn.action}
              disabled={btn.loading}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm ${btn.color} hover:opacity-90 transition-all shadow-md disabled:opacity-50`}
            >
              {btn.loading ? <Loader2 size={16} className="animate-spin" /> : <Icon size={16} />}
              {btn.label}
            </button>
          );
        })}
      </div>

      {/* AI Summary */}
      {aiSummary && (
        <div className="bg-white dark:bg-turkcell-navy rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
          <h3 className="font-bold text-turkcell-navy dark:text-white mb-1">Demo Retrospektif Özeti</h3>
          <p className="text-xs text-slate-400 mb-4">AI tarafından oluşturuldu</p>

          <div className="p-4 bg-turkcell-yellow/5 dark:bg-turkcell-yellow/5 border border-turkcell-yellow/20 rounded-xl">
            <div className="flex items-start gap-2 mb-2">
              <Sparkles size={14} className="text-turkcell-yellow mt-0.5" />
              <p className="text-xs font-bold text-turkcell-navy dark:text-turkcell-yellow">Özet</p>
            </div>
            <p className="text-sm text-turkcell-navy dark:text-slate-300 leading-relaxed whitespace-pre-line">{aiSummary}</p>
          </div>
        </div>
      )}
    </div>
  );
};
