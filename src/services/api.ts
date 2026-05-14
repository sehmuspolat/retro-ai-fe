import { Person, Card, Group, Action, ApiResponse } from '@/types';

const delay = () => new Promise(resolve => setTimeout(resolve, Math.random() * 500 + 500));

const mockPersons: Person[] = [
  { id: 'p1', name: 'Ahmet', surname: 'Yılmaz' },
  { id: 'p2', name: 'Ayşe', surname: 'Kaya' },
  { id: 'p3', name: 'Mehmet', surname: 'Demir' }
];

let mockCards: Card[] = [
  { id: 'c_1', content: 'Geçen sprint CI/CD süreçleri harikaydı, hiç takılmadık.', authorId: 'p1', groupId: null, createdAt: new Date().toISOString() },
  { id: 'c_2', content: 'Daily meetingler çok uzun sürüyor, odak dağılıyor.', authorId: 'p2', groupId: null, createdAt: new Date().toISOString() },
  { id: 'c_3', content: 'Test süreçlerinde otomasyon oranımızı artırmalıyız.', authorId: 'p3', groupId: null, createdAt: new Date().toISOString() }
];

let mockGroups: Group[] = [];
let mockActions: Action[] = [];

export const api = {
  getPersons: async (): Promise<ApiResponse<Person[]>> => {
    await delay();
    return { data: mockPersons, status: 200 };
  },
  getCards: async (): Promise<ApiResponse<Card[]>> => {
    await delay();
    return { data: mockCards, status: 200 };
  },
  createCard: async (card: Omit<Card, 'id' | 'createdAt'>): Promise<ApiResponse<Card>> => {
    await delay();
    const newCard: Card = { ...card, id: `c_${Date.now()}`, createdAt: new Date().toISOString() };
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
