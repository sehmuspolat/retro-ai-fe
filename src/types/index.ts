export type ColumnCategory = 'went-well' | 'went-wrong' | 'improve' | 'puzzles' | 'ungrouped' | 'ai-group';
export type RetroStep = 'icebreaker' | 'welcome' | 'open-actions' | 'brainstorm' | 'group' | 'vote' | 'discuss' | 'review' | 'close';

export interface Person {
  id: string;
  name: string;
  surname: string;
  avatar?: string;
}

export interface Card {
  id: string;
  content: string;
  authorId: string;
  groupId: string | null;
  audioUrl?: string;
  votes: number;
  voters: string[];
  isAnonymous: boolean;
  createdAt: string;
}

export interface Group {
  id: string;
  title: string;
  category: ColumnCategory;
  createdAt: string;
}

export interface Action {
  id: string;
  description: string;
  assigneeId: string;
  cardId: string;
  isCompleted: boolean;
  createdAt: string;
}

export interface Agreement {
  id: string;
  description: string;
  createdAt: string;
}

export interface Discussion {
  id: string;
  groupId: string;
  audioUrl?: string;
  transcript?: string;
  aiSuggestion?: string;
  authorId: string;
  createdAt: string;
}

export interface MeetingFeedback {
  personId: string;
  rating: number; // 1-5
}

export interface RetroSummary {
  totalIdeas: number;
  totalVotes: number;
  totalActions: number;
  totalAgreements: number;
  participation: number; // percentage
  aiSummary?: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
}
