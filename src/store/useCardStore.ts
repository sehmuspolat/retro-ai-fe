import { create } from 'zustand';
import { Card, Group, Person, Action } from '@/types';
import { api } from '@/services/api';

interface CardState {
  cards: Card[];
  groups: Group[];
  persons: Person[];
  actions: Action[];
  isFetchingData: boolean;
  isMutating: boolean;
  error: string | null;

  fetchInitialData: () => Promise<void>;
  addCard: (content: string, authorId: string, audioUrl?: string) => Promise<void>;
  updateCardsGroup: (mapping: Record<string, string>) => void;
  setGroups: (groups: Group[]) => void;
}

export const useCardStore = create<CardState>((set) => ({
  cards: [],
  groups: [],
  persons: [],
  actions: [],
  isFetchingData: false,
  isMutating: false,
  error: null,

  fetchInitialData: async () => {
    set({ isFetchingData: true, error: null });
    try {
      const [personsRes, cardsRes, groupsRes, actionsRes] = await Promise.all([
        api.getPersons(),
        api.getCards(),
        api.getGroups(),
        api.getActions()
      ]);

      set({
        persons: personsRes.data || [],
        cards: cardsRes.data || [],
        groups: groupsRes.data || [],
        actions: actionsRes.data || [],
        isFetchingData: false
      });
    } catch (err) {
      set({ error: 'Veriler yüklenirken bir hata oluştu.', isFetchingData: false });
    }
  },

  addCard: async (content, authorId, audioUrl) => {
    set({ isMutating: true });
    const response = await api.createCard({ content, authorId, groupId: null, audioUrl });
    
    if (response.data) {
      set((state) => ({ 
        cards: [...state.cards, response.data!],
        isMutating: false 
      }));
    } else {
      set({ error: 'Kart oluşturulamadı', isMutating: false });
    }
  },

  updateCardsGroup: (mapping) => {
    set((state) => ({
      cards: state.cards.map(card => 
        mapping[card.id] ? { ...card, groupId: mapping[card.id] } : card
      )
    }));
  },

  setGroups: (groups) => set({ groups }),
}));
