export type Genre = string;
export const GENRES: Genre[] = ['Fiction', 'Non-Fiction', 'Academic', 'Other'];

export type Status = string;
export const STATUSES: Status[] = ['To Read', 'Reading', 'Finished'];

export interface Book {
  id?: string;
  userId: string;
  title: string;
  author: string;
  genre: string;
  status: string;
  rating?: number; // 0..5
  favorite?: boolean; // false by default
  notes?: string;  // <= 300 characters
  createdAt?: any;
}

export interface BookFormData {
  title: string;
  author: string;
  genre: string;
  status: string;
  rating?: number;
  favorite?: boolean;
  notes?: string;
}

// Generic Aliases for fast multi-topic exams
export type Item = Book;
export type ItemFormData = BookFormData;
