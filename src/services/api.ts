import { Person, Card, Group, Action, ApiResponse } from '@/types';

const delay = () => new Promise(resolve => setTimeout(resolve, Math.random() * 200 + 100));

const mockPersons: Person[] = [
  { id: 'p1', name: 'Ahmet', surname: 'Yılmaz' },
  { id: 'p2', name: 'Ayşe', surname: 'Kaya' },
  { id: 'p3', name: 'Mehmet', surname: 'Demir' },
  { id: 'p4', name: 'Zeynep', surname: 'Çelik' },
  { id: 'p5', name: 'Can', surname: 'Öztürk' }
];

let mockGroups: Group[] = [
  { id: 'g_well', title: 'Neyi İyi Yaptık?', category: 'went-well', createdAt: new Date().toISOString() },
  { id: 'g_bad', title: 'Neyi Kötü Yaptık?', category: 'went-wrong', createdAt: new Date().toISOString() },
  { id: 'g_improve', title: 'Ne Yapmalıyız?', category: 'improve', createdAt: new Date().toISOString() },
  { id: 'g_puzzles', title: 'Kafamızı Karıştıran?', category: 'puzzles', createdAt: new Date().toISOString() },
];

let mockCards: Card[] = [
  // İyi yaptıklar
  { id: 'c_1', content: 'CI/CD pipeline tamamen otomatize edildi, deployment süresi 45dk\'dan 8dk\'ya düştü.', authorId: 'p1', groupId: 'g_well', votes: 0, voters: [], isAnonymous: false, createdAt: new Date().toISOString() },
  { id: 'c_2', content: 'Sprint hedeflerinin %95\'ini tamamladık. Takım odağı mükemmeldi.', authorId: 'p2', groupId: 'g_well', votes: 0, voters: [], isAnonymous: false, createdAt: new Date().toISOString() },
  { id: 'c_3', content: 'Pair programming seansları kod kalitesini gözle görülür artırdı.', authorId: 'p3', groupId: 'g_well', votes: 0, voters: [], isAnonymous: false, createdAt: new Date().toISOString() },
  { id: 'c_4', content: 'Demo çok olumlu geçti, müşteriden doğrudan feedback almak motivasyonu yükseltti.', authorId: 'p5', groupId: 'g_well', votes: 0, voters: [], isAnonymous: false, createdAt: new Date().toISOString() },

  // Kötü gidenler
  { id: 'c_5', content: 'Daily standup\'lar 15 dakikayı aşıyor, tartışmalar toplantı dışına taşınmalı.', authorId: 'p2', groupId: 'g_bad', votes: 0, voters: [], isAnonymous: false, createdAt: new Date().toISOString() },
  { id: 'c_6', content: 'Hotfix\'ler sprint planlamasını sürekli bozdu, 3 kez scope değişikliği yaşandı.', authorId: 'p4', groupId: 'g_bad', votes: 0, voters: [], isAnonymous: false, createdAt: new Date().toISOString() },
  { id: 'c_7', content: 'API dokümantasyonu güncellenmedi, frontend takımı 2 gün bloke oldu.', authorId: 'p1', groupId: 'g_bad', votes: 0, voters: [], isAnonymous: false, createdAt: new Date().toISOString() },
  { id: 'c_8', content: 'Production\'da 2 kritik bug çıktı, test coverage yetersizdi.', authorId: 'p3', groupId: 'g_bad', votes: 0, voters: [], isAnonymous: false, createdAt: new Date().toISOString() },

  // İyileştirmeler
  { id: 'c_9', content: 'Code review süreçleri hızlanmalı — PR\'lar 2 günden fazla bekliyor.', authorId: 'p3', groupId: 'g_improve', votes: 0, voters: [], isAnonymous: false, createdAt: new Date().toISOString() },
  { id: 'c_10', content: 'Test otomasyon oranını %40\'tan %70\'e çıkarmalıyız.', authorId: 'p1', groupId: 'g_improve', votes: 0, voters: [], isAnonymous: false, createdAt: new Date().toISOString() },
  { id: 'c_11', content: 'Sprint refinement\'a daha fazla zaman ayırmalıyız, story\'ler yeterince detaylı değil.', authorId: 'p4', groupId: 'g_improve', votes: 0, voters: [], isAnonymous: false, createdAt: new Date().toISOString() },
  { id: 'c_12', content: 'Async iletişimi artırmalıyız — kısa Loom videoları veya Slack güncellemeleri.', authorId: 'p5', groupId: 'g_improve', votes: 0, voters: [], isAnonymous: false, createdAt: new Date().toISOString() },

  // Kafamızı karıştıranlar
  { id: 'c_13', content: 'Velocity neden benzer kapasiteye rağmen sprintten sprinte bu kadar dalgalanıyor?', authorId: 'p4', groupId: 'g_puzzles', votes: 0, voters: [], isAnonymous: false, createdAt: new Date().toISOString() },
  { id: 'c_14', content: 'İnovasyon task\'ları ile delivery task\'larını dengelemenin en iyi yolu ne?', authorId: 'p5', groupId: 'g_puzzles', votes: 0, voters: [], isAnonymous: false, createdAt: new Date().toISOString() },
  { id: 'c_15', content: 'Düşük etkili alanları mı fazla test ediyoruz, kritik olanları mı kaçırıyoruz?', authorId: 'p2', groupId: 'g_puzzles', votes: 0, voters: [], isAnonymous: false, createdAt: new Date().toISOString() },
];

let mockActions: Action[] = [];

export const api = {
  getPersons: async (): Promise<ApiResponse<Person[]>> => {
    await delay();
    return { data: mockPersons, status: 200 };
  },
  addPerson: async (name: string, surname: string): Promise<ApiResponse<Person>> => {
    await delay();
    const newPerson: Person = { id: `p_${Date.now()}`, name, surname };
    mockPersons.push(newPerson);
    return { data: newPerson, status: 201 };
  },
  getCards: async (): Promise<ApiResponse<Card[]>> => {
    await delay();
    return { data: mockCards, status: 200 };
  },
  createCard: async (card: Omit<Card, 'id' | 'createdAt' | 'votes' | 'voters'>): Promise<ApiResponse<Card>> => {
    await delay();
    const newCard: Card = { ...card, id: `c_${Date.now()}`, votes: 0, voters: [], isAnonymous: card.isAnonymous ?? false, createdAt: new Date().toISOString() };
    mockCards.push(newCard);
    return { data: newCard, status: 201 };
  },
  getGroups: async (): Promise<ApiResponse<Group[]>> => {
    await delay();
    return { data: mockGroups, status: 200 };
  },
  createGroup: async (group: Omit<Group, 'id' | 'createdAt'>): Promise<ApiResponse<Group>> => {
    await delay();
    const newGroup: Group = { ...group, id: `g_${Date.now()}`, createdAt: new Date().toISOString() };
    mockGroups.push(newGroup);
    return { data: newGroup, status: 201 };
  },
  getActions: async (): Promise<ApiResponse<Action[]>> => {
    await delay();
    return { data: mockActions, status: 200 };
  },
  createAction: async (action: Omit<Action, 'id' | 'createdAt'>): Promise<ApiResponse<Action>> => {
    await delay();
    const newAction: Action = { ...action, id: `a_${Date.now()}`, createdAt: new Date().toISOString() };
    mockActions.push(newAction);
    return { data: newAction, status: 201 };
  }
};
