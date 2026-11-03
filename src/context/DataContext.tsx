import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  collection,
  query,
  where,
  onSnapshot,
  setDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../config/firebaseConfig';
import { Movie, MovieFormData } from '../types';
import { useAuth } from './AuthContext';
import { ENTITY_CONFIG } from '../config/entityConfig';

export interface DataContextType {
  items: Movie[];
  movies: Movie[];
  books: Movie[];
  loading: boolean;
  error: string | null;
  addItem: (data: MovieFormData) => Promise<void>;
  addMovie: (data: MovieFormData) => Promise<void>;
  addBook: (data: MovieFormData) => Promise<void>;
  updateItem: (id: string, data: Partial<MovieFormData>) => Promise<void>;
  updateMovie: (id: string, data: Partial<MovieFormData>) => Promise<void>;
  updateBook: (id: string, data: Partial<MovieFormData>) => Promise<void>;
  toggleFavorite: (id: string) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  deleteMovie: (id: string) => Promise<void>;
  deleteBook: (id: string) => Promise<void>;
  clearError: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const cfg = ENTITY_CONFIG;
  const { user } = useAuth();
  const [items, setItems] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      return;
    }

    const itemsQuery = query(
      collection(db, cfg.collectionName),
      where('userId', '==', user.uid)
    );

    const unsubscribe = onSnapshot(
      itemsQuery,
      (snapshot) => {
        const loadedData: Movie[] = snapshot.docs.map((d) => {
          const raw = d.data();
          const directorVal = raw.director || raw.author || '';
          return {
            id: d.id,
            userId: raw.userId || user.uid,
            favorite: false,
            title: raw.title || '',
            director: directorVal,
            author: directorVal,
            genre: raw.genre || '',
            status: raw.status || '',
            rating: raw.rating,
            notes: raw.notes,
            createdAt: raw.createdAt,
            ...raw,
          };
        });

        // Alphabetical order by title (not case-sensitive; equal titles ordered by director)
        loadedData.sort((a, b) => {
          const titleComparison = a.title.localeCompare(b.title, undefined, { sensitivity: 'base' });
          if (titleComparison !== 0) return titleComparison;
          const secA = a.director || a.author || '';
          const secB = b.director || b.author || '';
          return secA.localeCompare(secB, undefined, { sensitivity: 'base' });
        });

        setItems(loadedData);
        setLoading(false);
      },
      (err) => {
        console.error('Firestore snapshot error:', err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [user, cfg.collectionName]);

  const validateData = (data: Partial<MovieFormData>) => {
    if (data.title !== undefined) {
      const trimmed = data.title.trim();
      if (!trimmed) {
        throw new Error(cfg.field1.requiredMessage);
      }
      if (trimmed.length > cfg.field1.maxLength) {
        throw new Error(cfg.field1.maxMessage);
      }
    }
    const secVal = data.director !== undefined ? data.director : data.author;
    if (secVal !== undefined) {
      const trimmed = secVal.trim();
      if (!trimmed) {
        throw new Error(cfg.field2.requiredMessage);
      }
      if (trimmed.length > cfg.field2.maxLength) {
        throw new Error(cfg.field2.maxMessage);
      }
    }
    if (data.genre !== undefined && (!data.genre || data.genre === cfg.category.chooseLabel)) {
      throw new Error(cfg.category.emptyMessage);
    }
    if (data.status !== undefined && (!data.status || data.status === cfg.status.chooseLabel)) {
      throw new Error(cfg.status.emptyMessage);
    }
    if (data.rating !== undefined && data.rating !== null && cfg.numeric) {
      if (!Number.isInteger(data.rating) || data.rating < cfg.numeric.min || data.rating > cfg.numeric.max) {
        throw new Error(cfg.numeric.errorMessage);
      }
    }
    if (data.notes !== undefined && data.notes !== null && cfg.notes) {
      if (data.notes.length > cfg.notes.maxLength) {
        throw new Error(cfg.notes.maxMessage);
      }
    }
  };

  const addItem = async (data: MovieFormData) => {
    if (!user) throw new Error('You must be signed in');
    validateData(data);
    setError(null);

    const clean1 = data.title.trim();
    const clean2 = (data.director !== undefined ? data.director : data.author || '').trim();

    // Deterministic docId preventing case-insensitive duplicates per user
    // "the same person cannot save the same title + director twice, even if the letter case differs; two different people may save the same movie."
    const docId = `${user.uid}_${clean1.toLowerCase()}_${clean2.toLowerCase()}`.replace(/[\/\s]/g, '_');

    // 1. Client-side duplicate check
    const isDuplicate = items.some(
      (b) =>
        b.title.trim().toLowerCase() === clean1.toLowerCase() &&
        (b.director || b.author || '').trim().toLowerCase() === clean2.toLowerCase()
    );
    if (isDuplicate) {
      const msg = `Duplicate: "${clean1}" by "${clean2}" is already in your ${cfg.entityPlural}.`;
      setError(msg);
      throw new Error(msg);
    }

    // 2. Server-side check
    const docRef = doc(db, cfg.collectionName, docId);
    const existingSnap = await getDoc(docRef);
    if (existingSnap.exists()) {
      const msg = `Duplicate: A ${cfg.entitySingular} with this ${cfg.field1.label.toLowerCase()} and ${cfg.field2.label.toLowerCase()} already exists.`;
      setError(msg);
      throw new Error(msg);
    }

    const newPayload: Record<string, any> = {
      id: docId,
      userId: user.uid,
      [cfg.field1.key]: clean1,
      [cfg.field2.key]: clean2,
      [cfg.category.key]: data.genre,
      status: data.status,
      favorite: data.favorite ?? false,
      createdAt: serverTimestamp(),
    };

    if (data.rating !== undefined && data.rating !== null && cfg.numeric) {
      newPayload[cfg.numeric.key] = data.rating;
    }
    if (data.notes !== undefined && data.notes.trim() !== '' && cfg.notes) {
      newPayload[cfg.notes.key] = data.notes.trim();
    }

    try {
      await setDoc(docRef, newPayload, { merge: false });
    } catch (err: any) {
      setError(err.message || `Failed to add ${cfg.entitySingular}`);
      throw err;
    }
  };

  const updateItem = async (id: string, data: Partial<MovieFormData>) => {
    if (!user) throw new Error('You must be signed in');
    validateData(data);
    setError(null);

    const secVal = data.director !== undefined ? data.director : data.author;
    if (data.title !== undefined || secVal !== undefined) {
      const target = items.find((b) => b.id === id);
      const new1 = (data.title !== undefined ? data.title : target?.title || '').trim().toLowerCase();
      const new2 = (secVal !== undefined ? secVal : target?.director || target?.author || '').trim().toLowerCase();

      const duplicate = items.find(
        (b) =>
          b.id !== id &&
          b.title.trim().toLowerCase() === new1 &&
          (b.director || b.author || '').trim().toLowerCase() === new2
      );

      if (duplicate) {
        const msg = `Duplicate: Another ${cfg.entitySingular} already exists with these details.`;
        setError(msg);
        throw new Error(msg);
      }
    }

    const updatePayload: Record<string, any> = {
      userId: user.uid,
    };

    if (data.title !== undefined) updatePayload[cfg.field1.key] = data.title.trim();
    if (secVal !== undefined) updatePayload[cfg.field2.key] = secVal.trim();
    if (data.genre !== undefined) updatePayload[cfg.category.key] = data.genre;
    if (data.status !== undefined) updatePayload.status = data.status;
    if (data.favorite !== undefined) updatePayload.favorite = data.favorite;
    if (data.rating !== undefined && cfg.numeric) updatePayload[cfg.numeric.key] = data.rating;
    if (data.notes !== undefined && cfg.notes) updatePayload[cfg.notes.key] = data.notes.trim();

    try {
      const docRef = doc(db, cfg.collectionName, id);
      await updateDoc(docRef, updatePayload);
    } catch (err: any) {
      setError(err.message || `Failed to update ${cfg.entitySingular}`);
      throw err;
    }
  };

  const toggleFavorite = async (id: string) => {
    if (!user) throw new Error('You must be signed in');
    const item = items.find((b) => b.id === id);
    if (!item) return;

    const newFavorite = !item.favorite;
    try {
      const docRef = doc(db, cfg.collectionName, id);
      await updateDoc(docRef, {
        userId: user.uid,
        favorite: newFavorite,
      });
    } catch (err: any) {
      setError(err.message || 'Failed to toggle favorite');
      throw err;
    }
  };

  const deleteItem = async (id: string) => {
    if (!user) throw new Error('You must be signed in');
    setError(null);
    try {
      await deleteDoc(doc(db, cfg.collectionName, id));
    } catch (err: any) {
      setError(err.message || `Failed to delete ${cfg.entitySingular}`);
      throw err;
    }
  };

  const clearError = () => setError(null);

  const contextValue: DataContextType = {
    items: user ? items : [],
    movies: user ? items : [],
    books: user ? items : [],
    loading,
    error,
    addItem,
    addMovie: addItem,
    addBook: addItem,
    updateItem,
    updateMovie: updateItem,
    updateBook: updateItem,
    toggleFavorite,
    deleteItem,
    deleteMovie: deleteItem,
    deleteBook: deleteItem,
    clearError,
  };

  return (
    <DataContext.Provider value={contextValue}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

// Backward compatibility aliases
export const BookProvider = DataProvider;
export const useBooks = useData;
export const MovieProvider = DataProvider;
export const useMovies = useData;
