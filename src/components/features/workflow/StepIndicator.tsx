'use client';

import React from 'react';
import { useRetroStore, STEP_ORDER } from '@/store/useRetroStore';
import type { RetroStep } from '@/types';

const STEP_LABELS: Record<RetroStep, string> = {
  'icebreaker': 'ICEBREAKER',
  'welcome': 'HOŞGELDİN',
  'open-actions': 'AÇIK AKSİYONLAR',
  'brainstorm': 'BEYİN FIRTINASI',
  'group': 'GRUPLAMA',
  'vote': 'OYLAMA',
  'discuss': 'TARTIŞMA',
  'review': 'İNCELEME',
  'close': 'KAPANIŞ',
};

export const StepIndicator: React.FC = () => {
  const { currentStep, setStep } = useRetroStore();
  const currentIndex = STEP_ORDER.indexOf(currentStep);

  return (
    <nav className="flex items-center gap-0">
      {STEP_ORDER.map((step, index) => {
        const isActive = step === currentStep;
        const isCompleted = index < currentIndex;
        const isClickable = index <= currentIndex;

        return (
          <button
            key={step}
            onClick={() => isClickable && setStep(step)}
            disabled={!isClickable}
            className={`
              relative px-2 lg:px-3 py-2 text-[10px] lg:text-[11px] font-bold uppercase tracking-wider transition-all whitespace-nowrap
              ${isActive
                ? 'text-turkcell-yellow border-b-2 border-turkcell-yellow'
                : isCompleted
                  ? 'text-turkcell-yellow/70 hover:text-turkcell-yellow cursor-pointer'
                  : 'text-slate-500 cursor-default'
              }
            `}
          >
            {STEP_LABELS[step]}
          </button>
        );
      })}
    </nav>
  );
};
