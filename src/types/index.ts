export interface Person {
  id: string;
  name: string;
  surname: string;
}

export interface Card {
  id: string;
  content: string;
  authorId: string;
  groupId: string | null;
  audioUrl?: string;
  createdAt: string;
}

export interface Group {
  id: string;
  title: string;
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

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
}
