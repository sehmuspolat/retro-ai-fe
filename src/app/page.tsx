'use client';

import React, { useEffect } from 'react';
import { useCardStore } from '@/store/useCardStore';
import { useRetroStore } from '@/store/useRetroStore';
import { StepIndicator } from '@/components/features/workflow/StepIndicator';
import { LoginView } from '@/components/features/auth/LoginView';
import { IcebreakerView } from '@/components/features/icebreaker/IcebreakerView';
import { WelcomeView } from '@/components/features/welcome/WelcomeView';
import { OpenActionsView } from '@/components/features/open-actions/OpenActionsView';
import { BrainstormView } from '@/components/features/brainstorm/BrainstormView';
import { GroupView } from '@/components/features/group/GroupView';
import { VoteView } from '@/components/features/vote/VoteView';
import { DiscussView } from '@/components/features/discuss/DiscussView';
import { ReviewView } from '@/components/features/review/ReviewView';
import { CloseView } from '@/components/features/close/CloseView';
import { Loader2, Layout, LogOut } from 'lucide-react';

export default function RetroPage() {
  const { fetchInitialData, isFetchingData, error, persons } = useCardStore();
  const { currentStep, currentPersonId, isLoggedIn, logout } = useRetroStore();

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  const currentPerson = persons.find(p => p.id === currentPersonId);

  if (isFetchingData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-turkcell-gray dark:bg-turkcell-navy-dark">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-turkcell-yellow flex items-center justify-center shadow-lg">
            <Loader2 className="w-6 h-6 animate-spin text-turkcell-navy" />
          </div>
          <p className="text-sm text-turkcell-gray-medium">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center p-8">{error}</div>;
  }

  // Show login screen if not logged in
  if (!isLoggedIn) {
    return <LoginView />;
  }

  const STEP_DESCRIPTIONS: Record<string, string> = {
    'icebreaker': 'Takım ısınma sorusu — herkes katılabilir!',
    'welcome': 'Toplantı bilgileri ve katılımcılar',
    'open-actions': 'Önceki retrospektiflerden kalan aksiyonlar',
    'brainstorm': 'Her konu altına fikirlerinizi ekleyin. Süre dolunca gruplama başlayacak.',
    'group': 'Benzer fikirleri AI ile gruplayın.',
    'vote': 'En önemli konulara oy verin.',
    'discuss': 'Gruplanmış konuları en çok oylanan sırasıyla tartışın.',
    'review': 'Aksiyonları ve takım anlaşmalarını gözden geçirin.',
    'close': 'Retrospektif özeti ve geri bildirim.',
  };

  return (
    <main className="min-h-screen bg-turkcell-gray dark:bg-turkcell-navy-dark text-turkcell-navy dark:text-slate-100 font-sans">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-turkcell-navy shadow-lg">
        <div className="flex items-center justify-between px-4">
          <div className="flex items-center gap-3 py-3">
            <div className="p-1.5 bg-turkcell-yellow rounded-lg">
              <Layout className="text-turkcell-navy w-5 h-5" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-white tracking-tight">Sprint Retrospektifi</h1>
              <p className="text-[11px] text-turkcell-gray-medium">TeamRetro • AI Destekli</p>
            </div>
          </div>

          <div className="flex-1 overflow-x-auto mx-4 scrollbar-thin">
            <StepIndicator />
          </div>

          <div className="flex items-center gap-2 py-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-turkcell-navy-light border border-slate-600">
              <div className="w-6 h-6 rounded-full bg-turkcell-yellow flex items-center justify-center text-[11px] font-bold text-turkcell-navy">
                {currentPerson?.name?.charAt(0) || '?'}
              </div>
              <span className="text-xs text-white font-medium">{currentPerson?.name} {currentPerson?.surname}</span>
            </div>
            <button
              onClick={logout}
              title="Çıkış yap"
              className="p-1.5 rounded-lg bg-turkcell-navy-light border border-slate-600 text-slate-400 hover:text-white hover:border-slate-400 transition-all"
            >
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </header>

      {/* Step description bar */}
      <div className="bg-turkcell-navy/5 dark:bg-turkcell-navy-light border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 py-2">
          <p className="text-xs text-slate-500 dark:text-slate-400">{STEP_DESCRIPTIONS[currentStep]}</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {currentStep === 'icebreaker' && <IcebreakerView />}
        {currentStep === 'welcome' && <WelcomeView />}
        {currentStep === 'open-actions' && <OpenActionsView />}
        {currentStep === 'brainstorm' && <BrainstormView />}
        {currentStep === 'group' && <GroupView />}
        {currentStep === 'vote' && <VoteView />}
        {currentStep === 'discuss' && <DiscussView />}
        {currentStep === 'review' && <ReviewView />}
        {currentStep === 'close' && <CloseView />}
      </div>
    </main>
  );
}
