import { create } from 'zustand';
import type { RetroStep, MeetingFeedback, Agreement } from '@/types';

const STEP_ORDER: RetroStep[] = [
  'icebreaker', 'welcome', 'open-actions', 'brainstorm', 'group', 'vote', 'discuss', 'review', 'close'
];

interface RetroState {
  currentStep: RetroStep;
  timerSeconds: number;
  timerInitial: number;
  timerRunning: boolean;
  currentPersonId: string;
  isLoggedIn: boolean;
  maxVotesPerPerson: number;
  icebreakerAnswer: string;
  icebreakerAnswers: Record<string, string>;
  agreements: Agreement[];
  feedbacks: MeetingFeedback[];
  retroEnded: boolean;

  setStep: (step: RetroStep) => void;
  startTimer: (seconds: number) => void;
  tick: () => void;
  stopTimer: () => void;
  nextStep: () => void;
  prevStep: () => void;
  setCurrentPerson: (id: string) => void;
  login: (personId: string) => void;
  logout: () => void;
  setIcebreakerAnswer: (personId: string, answer: string) => void;
  addAgreement: (description: string) => void;
  removeAgreement: (id: string) => void;
  addFeedback: (personId: string, rating: number) => void;
  endRetro: () => void;
}

export const useRetroStore = create<RetroState>((set, get) => ({
  currentStep: 'icebreaker',
  timerSeconds: 300,
  timerInitial: 300,
  timerRunning: false,
  currentPersonId: '',
  isLoggedIn: false,
  maxVotesPerPerson: 6,
  icebreakerAnswer: '',
  icebreakerAnswers: {},
  agreements: [],
  feedbacks: [],
  retroEnded: false,

  setStep: (step) => set({ currentStep: step }),

  startTimer: (seconds) => set({
    timerSeconds: seconds,
    timerInitial: seconds,
    timerRunning: true,
  }),

  tick: () => {
    const { timerSeconds, timerRunning } = get();
    if (!timerRunning || timerSeconds <= 0) return;
    const next = timerSeconds - 1;
    if (next <= 0) {
      set({ timerSeconds: 0, timerRunning: false });
    } else {
      set({ timerSeconds: next });
    }
  },

  stopTimer: () => set({ timerRunning: false }),

  nextStep: () => {
    const { currentStep } = get();
    const idx = STEP_ORDER.indexOf(currentStep);
    if (idx < STEP_ORDER.length - 1) {
      const next = STEP_ORDER[idx + 1];
      const updates: Partial<RetroState> = { currentStep: next };
      if (next === 'brainstorm') {
        updates.timerSeconds = 300;
        updates.timerInitial = 300;
        updates.timerRunning = true;
      }
      if (next === 'vote') {
        updates.timerSeconds = 120;
        updates.timerInitial = 120;
        updates.timerRunning = true;
      }
      set(updates as RetroState);
    }
  },

  prevStep: () => {
    const { currentStep } = get();
    const idx = STEP_ORDER.indexOf(currentStep);
    if (idx > 0) {
      set({ currentStep: STEP_ORDER[idx - 1], timerRunning: false });
    }
  },

  setCurrentPerson: (id) => set({ currentPersonId: id }),

  login: (personId) => set({ currentPersonId: personId, isLoggedIn: true }),

  logout: () => set({ currentPersonId: '', isLoggedIn: false }),

  setIcebreakerAnswer: (personId, answer) =>
    set((state) => ({
      icebreakerAnswers: { ...state.icebreakerAnswers, [personId]: answer },
    })),

  addAgreement: (description) =>
    set((state) => ({
      agreements: [
        ...state.agreements,
        { id: `agr_${Date.now()}`, description, createdAt: new Date().toISOString() },
      ],
    })),

  removeAgreement: (id) =>
    set((state) => ({
      agreements: state.agreements.filter((a) => a.id !== id),
    })),

  addFeedback: (personId, rating) =>
    set((state) => ({
      feedbacks: [
        ...state.feedbacks.filter((f) => f.personId !== personId),
        { personId, rating },
      ],
    })),

  endRetro: () => set({ retroEnded: true }),
}));

export { STEP_ORDER };
