'use client';

import React, { useState } from 'react';
import { useCardStore } from '@/store/useCardStore';
import { useRetroStore } from '@/store/useRetroStore';
import { Layout, ArrowRight, Users } from 'lucide-react';

export const LoginView: React.FC = () => {
  const { persons, addPerson } = useCardStore();
  const { login } = useRetroStore();
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleJoin = async () => {
    const trimmedName = name.trim();
    const trimmedSurname = surname.trim();
    if (!trimmedName) return;

    setIsSubmitting(true);

    // Check if this person already exists (case-insensitive match)
    const existing = persons.find(
      p => p.name.toLowerCase() === trimmedName.toLowerCase() &&
           p.surname.toLowerCase() === (trimmedSurname || '').toLowerCase()
    );

    if (existing) {
      login(existing.id);
    } else {
      const newId = await addPerson(trimmedName, trimmedSurname || '');
      if (newId) {
        login(newId);
      }
    }
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-turkcell-navy flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex p-3 bg-turkcell-yellow rounded-2xl shadow-lg mb-4">
            <Layout className="text-turkcell-navy w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-white">Sprint Retrospektifi</h1>
          <p className="text-sm text-turkcell-gray-medium mt-1">TeamRetro &bull; AI Destekli</p>
        </div>

        {/* Login Card */}
        <div className="bg-white dark:bg-turkcell-navy-light rounded-2xl shadow-2xl p-6 border border-slate-200 dark:border-slate-700">
          <h2 className="text-lg font-bold text-turkcell-navy dark:text-white mb-1">Toplantıya Katıl</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Adınızı yazarak retrospektife katılın.</p>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Ad *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleJoin()}
                placeholder="Adınız"
                autoFocus
                className="w-full px-4 py-3 text-sm rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-turkcell-navy text-turkcell-navy dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-turkcell-yellow focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Soyad</label>
              <input
                type="text"
                value={surname}
                onChange={(e) => setSurname(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleJoin()}
                placeholder="Soyadınız (opsiyonel)"
                className="w-full px-4 py-3 text-sm rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-turkcell-navy text-turkcell-navy dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-turkcell-yellow focus:border-transparent"
              />
            </div>

            <button
              onClick={handleJoin}
              disabled={!name.trim() || isSubmitting}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 mt-2 text-sm font-bold rounded-xl bg-turkcell-yellow text-turkcell-navy hover:bg-turkcell-yellow-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-md"
            >
              {isSubmitting ? 'Katılınıyor...' : 'Katıl'}
              <ArrowRight size={16} />
            </button>
          </div>

          {/* Already joined participants */}
          {persons.length > 0 && (
            <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-1.5 mb-2">
                <Users size={14} className="text-slate-400" />
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Katılımcılar ({persons.length})</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {persons.map(p => (
                  <span
                    key={p.id}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-full bg-slate-100 dark:bg-turkcell-navy text-slate-600 dark:text-slate-300"
                  >
                    <span className="w-5 h-5 rounded-full bg-turkcell-yellow/20 text-turkcell-navy dark:text-turkcell-yellow flex items-center justify-center text-[10px] font-bold">
                      {p.name.charAt(0)}
                    </span>
                    {p.name} {p.surname}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
