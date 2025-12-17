export interface User {
  id: string;
  name: string;
  color: string;
  avatar?: string;
  status?: 'active' | 'typing' | 'idle';
  cursorChat?: {
    isActive: boolean;
    message: string;
    x: number;
    y: number;
  };
}

export interface Room {
  id: string;
  name: string;
  isActive: boolean;
}

export interface DocumentData {
  title: string;
  content: string;
  lastUpdated: Date;
}