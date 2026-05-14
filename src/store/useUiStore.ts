import { create } from 'zustand';
import { Card } from '@/types';

interface UiState {
  isActionDrawerOpen: boolean;
  selectedCardForAction: Card | null;
  activeDragCardId: string | null;

  openActionDrawer: (card: Card) => void;
  closeActionDrawer: () => void;
  setActiveDragCard: (id: string | null) => void;
}

export const useUiStore = create<UiState>((set) => ({
  isActionDrawerOpen: false,
  selectedCardForAction: null,
  activeDragCardId: null,

  openActionDrawer: (card) => set({ isActionDrawerOpen: true, selectedCardForAction: card }),
  closeActionDrawer: () => set({ isActionDrawerOpen: false, selectedCardForAction: null }),
  setActiveDragCard: (id) => set({ activeDragCardId: id }),
}));
