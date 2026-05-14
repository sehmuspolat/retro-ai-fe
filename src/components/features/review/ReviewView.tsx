'use client';

import React, { useState } from 'react';
import { useRetroStore } from '@/store/useRetroStore';
import { useCardStore } from '@/store/useCardStore';
import { ArrowRight, Plus, X, FileCheck, Handshake, ThumbsUp } from 'lucide-react';

export const ReviewView: React.FC = () => {
  const { nextStep, agreements, addAgreement, removeAgreement } = useRetroStore();
  const { cards, groups, persons, actions } = useCardStore();
  const [newAction, setNewAction] = useState('');
  const [newAgreement, setNewAgreement] = useState('');

  const totalVotes = cards.reduce((sum, c) => sum + c.votes, 0);
  const aiGroups = groups.filter(g => g.category === 'ai-group');

  const topCards = [...cards].sort((a, b) => b.votes - a.votes).slice(0, 5);

  const handleAddAgreement = () => {
    if (!newAgreement.trim()) return;
    addAgreement(newAgreement.trim());
    setNewAgreement('');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-turkcell-navy dark:text-white">İnceleme</h2>
        <p className="text-slate-500 dark:text-slate-400">Aksiyonları ve takım anlaşmalarını gözden geçirin</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { label: 'Fikir Eklendi', value: cards.length, sub: `${persons.length} katılımcı`, color: 'text-turkcell-blue' },
          { label: 'Oy Kullanıldı', value: totalVotes, sub: `${aiGroups.length} grup`, color: 'text-emerald-500' },
          { label: 'Yeni Aksiyon', value: actions.length, sub: 'açık aksiyon', color: 'text-amber-500' },
          { label: 'Anlaşma', value: agreements.length, sub: 'takım anlaşması', color: 'text-purple-500' },
          { label: 'Katılım', value: `${Math.round((persons.length / persons.length) * 100)}%`, sub: `${persons.length}/${persons.length}`, color: 'text-turkcell-yellow' },
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-turkcell-navy rounded-xl border border-slate-200 dark:border-slate-700 p-4 text-center">
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-xs font-semibold text-turkcell-navy dark:text-white mt-1">{stat.label}</p>
            <p className="text-[11px] text-slate-400">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Top voted */}
      <div className="bg-white dark:bg-turkcell-navy rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm">
        <h3 className="font-bold text-turkcell-navy dark:text-white mb-3 flex items-center gap-2">
          <ThumbsUp size={16} className="text-turkcell-blue" />
          En Çok Oylanan Fikirler
        </h3>
        <div className="space-y-2">
          {topCards.map((card, i) => (
            <div key={card.id} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-turkcell-navy-light rounded-xl">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0
                ${i === 0 ? 'bg-turkcell-yellow text-turkcell-navy' : 'bg-slate-200 dark:bg-slate-600 text-slate-600 dark:text-slate-300'}`}>
                {i + 1}
              </div>
              <p className="flex-1 text-sm text-slate-700 dark:text-slate-300">{card.content}</p>
              <div className="flex items-center gap-1 text-turkcell-blue text-sm font-bold flex-shrink-0">
                <ThumbsUp size={12} /> {card.votes}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Team Agreements */}
      <div className="bg-white dark:bg-turkcell-navy rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm">
        <h3 className="font-bold text-turkcell-navy dark:text-white mb-3 flex items-center gap-2">
          <Handshake size={16} className="text-purple-500" />
          Takım Anlaşmaları
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">Takım olarak üzerinde anlaştığınız kuralları ekleyin</p>

        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={newAgreement}
            onChange={(e) => setNewAgreement(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddAgreement()}
            placeholder="Yeni anlaşma ekle..."
            className="flex-1 px-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-turkcell-navy-light text-turkcell-navy dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
          <button
            onClick={handleAddAgreement}
            disabled={!newAgreement.trim()}
            className="px-4 py-2.5 rounded-xl bg-purple-500 text-white font-bold text-sm hover:bg-purple-600 transition-colors disabled:opacity-40"
          >
            <Plus size={18} />
          </button>
        </div>

        {agreements.length > 0 ? (
          <div className="space-y-2">
            {agreements.map(agr => (
              <div key={agr.id} className="flex items-center gap-3 p-3 bg-purple-50 dark:bg-purple-950/20 rounded-xl border border-purple-200 dark:border-purple-800/40">
                <Handshake size={14} className="text-purple-500 flex-shrink-0" />
                <p className="flex-1 text-sm text-turkcell-navy dark:text-white">{agr.description}</p>
                <button onClick={() => removeAgreement(agr.id)} className="text-slate-400 hover:text-red-500 transition-colors">
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-xs text-slate-400 py-6 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl">
            Henüz anlaşma eklenmedi
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <button
          onClick={nextStep}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-turkcell-navy text-turkcell-yellow font-bold text-sm hover:bg-turkcell-navy-light transition-colors shadow-lg"
        >
          Kapanışa Geç <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
};
