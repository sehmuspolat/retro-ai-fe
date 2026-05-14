import { Card, Action } from '@/types';

const aiDelay = () => new Promise(resolve => setTimeout(resolve, Math.random() * 1500 + 1500));

export const AiService = {
  simulateSemanticGrouping: async (cards: Card[]): Promise<Record<string, string>> => {
    await aiDelay();
    const cardGroupMapping: Record<string, string> = {};
    const mockGroups = ['g_ai_surec', 'g_ai_teknik', 'g_ai_iletisim']; 

    cards.forEach((card, index) => {
      if (!card.groupId) {
        // Rastgele mantıklı bir eşleşme simülasyonu
        const assignedGroup = mockGroups[index % mockGroups.length];
        cardGroupMapping[card.id] = assignedGroup;
      }
    });
    return cardGroupMapping;
  },

  generateActionSuggestion: async (card: Card): Promise<Omit<Action, 'id' | 'createdAt'>> => {
    await aiDelay();
    return {
      description: `AI Önerisi: "${card.content.substring(0, 15)}..." konusu için haftalık toplantıda 15 dk ayrılmalı.`,
      assigneeId: 'p1',
      cardId: card.id,
      isCompleted: false,
    };
  }
};
