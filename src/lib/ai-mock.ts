import { Card, Action } from '@/types';

const aiDelay = () => new Promise(resolve => setTimeout(resolve, Math.random() * 1500 + 1000));

export const AiService = {
  simulateSemanticGrouping: async (cards: Card[]): Promise<Record<string, string>> => {
    await aiDelay();
    const cardGroupMapping: Record<string, string> = {};

    cards.forEach((card) => {
      const lower = card.content.toLowerCase();
      if (lower.includes('test') || lower.includes('bug') || lower.includes('qa') || lower.includes('coverage') || lower.includes('otomasyon')) {
        cardGroupMapping[card.id] = 'g_ai_kalite';
      } else if (lower.includes('meeting') || lower.includes('daily') || lower.includes('iletişim') || lower.includes('toplantı') || lower.includes('async') || lower.includes('standup')) {
        cardGroupMapping[card.id] = 'g_ai_iletisim';
      } else if (lower.includes('ci/cd') || lower.includes('pipeline') || lower.includes('deployment') || lower.includes('review') || lower.includes('pr') || lower.includes('code review')) {
        cardGroupMapping[card.id] = 'g_ai_surec';
      } else if (lower.includes('sprint') || lower.includes('planlama') || lower.includes('hedef') || lower.includes('scope') || lower.includes('velocity') || lower.includes('refinement') || lower.includes('hotfix')) {
        cardGroupMapping[card.id] = 'g_ai_planlama';
      } else {
        cardGroupMapping[card.id] = 'g_ai_teknik';
      }
    });

    return cardGroupMapping;
  },

  generateActionSuggestion: async (card: Card): Promise<Omit<Action, 'id' | 'createdAt'>> => {
    await aiDelay();
    return {
      description: `AI Önerisi: "${card.content.substring(0, 20)}..." konusu için haftalık toplantıda 15 dk ayrılmalı.`,
      assigneeId: 'p1',
      cardId: card.id,
      isCompleted: false,
    };
  },

  simulateTranscription: async (_audioUrl: string): Promise<string> => {
    await aiDelay();
    const transcripts = [
      "Takım olarak bu konuyu detaylıca tartıştık. CI/CD süreçlerindeki iyileştirmeler herkesin takdirini kazandı. Özellikle deployment süresinin düşmesi büyük bir başarı. Jenkins pipeline'larının düzenli bakımını yapmalıyız ve monitoring eklemelyiz.",
      "Daily meeting'lerin uzaması konusunda herkes hemfikir. 15 dakikayı aşan tartışmaları ayrı toplantıya taşıma kararı aldık. Parking lot yöntemi kullanılacak. Scrum Master bunu takip edecek.",
      "Test otomasyonu konusunda kapasitemizi artırmalıyız. Her sprint'te en az 2 kritik flow'un otomatik test edilmesi hedeflenmeli. QA takımıyla pair testing seansları planlanacak. E2E testlere öncelik verilecek.",
      "Code review süreçlerinin yavaş kalması herkesin ortak sorunu. PR boyutlarını küçültme ve reviewer rotation sistemi önerildi. Günlük 30 dakikalık review slot'ları oluşturulacak.",
    ];
    return transcripts[Math.floor(Math.random() * transcripts.length)];
  },

  analyzeDiscussion: async (transcript: string, _cards: Card[]): Promise<string> => {
    await aiDelay();
    const suggestions = [
      "📋 Analiz Özeti:\n\nTartışmada belirtilen konular kritik öncelikli olarak değerlendirilmektedir.\n\n🎯 Önerilen Aksiyonlar:\n1. Haftalık 30 dakikalık dedicated toplantı açılmalı\n2. Sorumlu kişi (Champion) atanmalı\n3. İlerleme metrikleri belirlenmeli ve dashboard oluşturulmalı\n4. 2 haftalık checkpoint'lerde gözden geçirilmeli\n\n⏱️ Tahmini etki süresi: 2-3 sprint",
      "📋 Analiz Özeti:\n\nBu konu takımın verimliliğini doğrudan etkiliyor.\n\n🎯 Önerilen Aksiyonlar:\n1. Mevcut süreç haritasını çıkarın (Value Stream Mapping)\n2. Darboğaz noktalarını tespit edin\n3. Otomasyon fırsatlarını belirleyin\n4. Pilot uygulama ile 1 sprint deneyin\n\n⏱️ Tahmini etki süresi: 1-2 sprint",
      "📋 Analiz Özeti:\n\nTakımın farkındalığı yüksek, uygulama planı netleştirilmeli.\n\n🎯 Önerilen Aksiyonlar:\n1. Definition of Done güncellenmeli\n2. Her sprint'te %20 kapasite teknik borç için ayrılmalı\n3. Pair programming seansları artırılmalı\n4. Takım sözleşmesi (Working Agreement) güncelleştirilmeli\n\n⏱️ Tahmini etki süresi: 1 sprint",
    ];
    return suggestions[Math.floor(Math.random() * suggestions.length)];
  },
};
