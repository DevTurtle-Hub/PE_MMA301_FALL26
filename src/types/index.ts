export type Genre = 'Fiction' | 'Non-Fiction' | 'Academic' | 'Other';
export const GENRES: Genre[] = ['Fiction', 'Non-Fiction', 'Academic', 'Other'];

export type Status = 'To Read' | 'Reading' | 'Finished';
export const STATUSES: Status[] = ['To Read', 'Reading', 'Finished'];

export interface Book {
  id?: string;
  userId: string;
  title: string;
  author: string;
  genre: Genre;
  status: Status;
  rating?: number; // 0..5
  notes?: string;  // <= 300 characters
  createdAt?: any;
}

export interface BookFormData {
  title: string;
  author: string;
  genre: Genre;
  status: Status;
  rating?: number;
  notes?: string;
}

