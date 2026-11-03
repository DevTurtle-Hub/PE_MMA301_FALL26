export type Genre = 'Action' | 'Comedy' | 'Drama' | 'Horror' | string;
export const GENRES = ['Action', 'Comedy', 'Drama', 'Horror'];

export type Status = 'Plan to Watch' | 'Watching' | 'Watched' | string;
export const STATUSES = ['Plan to Watch', 'Watching', 'Watched'];

export interface Movie {
  id?: string;
  userId: string;
  title: string;
  director: string;
  author?: string; // alias for compatibility
  genre: Genre;
  status: Status;
  rating?: number; // 0..5
  favorite?: boolean; // false by default
  notes?: string;  // <= 300 characters
  createdAt?: any;
}

export interface MovieFormData {
  title: string;
  director?: string;
  author?: string; // alias for compatibility
  genre: Genre;
  status: Status;
  rating?: number;
  favorite?: boolean;
  notes?: string;
}

// Aliases for compatibility
export type Book = Movie;
export type BookFormData = MovieFormData;
export type Item = Movie;
export type ItemFormData = MovieFormData;
