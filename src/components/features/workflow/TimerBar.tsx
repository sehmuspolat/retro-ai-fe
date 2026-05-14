'use client';

import React, { useEffect } from 'react';
import { Clock, Play, Pause, SkipForward } from 'lucide-react';
import { useRetroStore } from '@/store/useRetroStore';

interface TimerBarProps {
  onTimerEnd?: () => void;
  skipLabel?: string;
  onSkip?: () => void;
}

export const TimerBar: React.FC<TimerBarProps> = ({ onTimerEnd, skipLabel = 'Sonraki Adım', onSkip }) => {
  const {
    timerSeconds, timerInitial, timerRunning,
    startTimer, tick, stopTimer, nextStep,
  } = useRetroStore();

  useEffect(() => {
    if (!timerRunning) return;
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [timerRunning, tick]);

  useEffect(() => {
    if (timerSeconds === 0 && !timerRunning && onTimerEnd) {
      onTimerEnd();
    }
  }, [timerSeconds, timerRunning, onTimerEnd]);

  const minutes = Math.floor(timerSeconds / 60);
  const seconds = timerSeconds % 60;
  const progress = timerInitial > 0 ? (timerSeconds / timerInitial) * 100 : 0;
  const isLow = timerSeconds < 60 && timerSeconds > 0;

  return (
    <div className="flex items-center gap-4 px-4 py-2.5 bg-white dark:bg-turkcell-navy rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
      <div className="flex items-center gap-2">
        <Clock size={16} className={isLow ? 'text-red-500 animate-pulse' : 'text-turkcell-blue'} />
        <span className={`font-mono font-bold text-lg tabular-nums ${isLow ? 'text-red-500' : 'text-turkcell-navy dark:text-white'}`}>
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </span>
      </div>

      <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 ${isLow ? 'bg-red-500' : 'bg-turkcell-blue'}`}
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex items-center gap-1.5">
        {timerRunning ? (
          <button onClick={stopTimer} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" title="Duraklat">
            <Pause size={16} className="text-turkcell-navy dark:text-white" />
          </button>
        ) : timerSeconds > 0 ? (
          <button onClick={() => startTimer(timerSeconds)} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" title="Devam Et">
            <Play size={16} className="text-turkcell-navy dark:text-white" />
          </button>
        ) : null}
        <button
          onClick={onSkip || nextStep}
          className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-lg bg-turkcell-yellow text-turkcell-navy hover:bg-turkcell-yellow-dark transition-colors"
        >
          <SkipForward size={14} />
          {skipLabel}
        </button>
      </div>
    </div>
  );
};
