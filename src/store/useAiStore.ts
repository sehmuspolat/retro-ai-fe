import { create } from 'zustand';
import { AiService } from '@/lib/ai-mock';
import { useCardStore } from './useCardStore';
import { Card } from '@/types';

interface AiState {
  isGrouping: boolean;
  isAnalyzingCardId: string | null;
  
  triggerAutoGroup: () => Promise<void>;
  analyzeCardAndSuggest: (card: Card) => Promise<void>;
}

export const useAiStore = create<AiState>((set) => ({
  isGrouping: false,
  isAnalyzingCardId: null,

  triggerAutoGroup: async () => {
    const { cards, updateCardsGroup, setGroups, groups } = useCardStore.getState();
    set({ isGrouping: true });
    
    try {
      const mapping = await AiService.simulateSemanticGrouping(cards);
      
      // Ensure AI groups exist in the store
      const uniqueGroupIds = Array.from(new Set(Object.values(mapping)));
      const newGroups = [...groups];
      uniqueGroupIds.forEach(id => {
        if (!newGroups.find(g => g.id === id)) {
          let title = "Yeni Grup";
          if (id === 'g_ai_surec') title = "Süreç & Yöntem";
          else if (id === 'g_ai_teknik') title = "Teknik Borç";
          else if (id === 'g_ai_iletisim') title = "İletişim & İşbirliği";
          else if (id === 'g_ai_kalite') title = "Kalite & Test";
          else if (id === 'g_ai_planlama') title = "Planlama & Tahminleme";
          
          newGroups.push({ id, title, category: 'ai-group', createdAt: new Date().toISOString() });
        }
      });
      setGroups(newGroups);
      
      updateCardsGroup(mapping);
    } finally {
      set({ isGrouping: false });
    }
  },

  analyzeCardAndSuggest: async (card) => {
    set({ isAnalyzingCardId: card.id });
    try {
      const suggestion = await AiService.generateActionSuggestion(card);
      console.log('AI Action Suggestion:', suggestion);
      // In a real app, this would open a modal/drawer with the suggestion
      alert(suggestion.description);
    } finally {
      set({ isAnalyzingCardId: null });
    }
  }
}));
