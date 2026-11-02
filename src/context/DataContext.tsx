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
import { Book, BookFormData } from '../types';
import { useAuth } from './AuthContext';
import { ENTITY_CONFIG } from '../config/entityConfig';

export interface DataContextType {
  items: Book[];
  books: Book[]; // alias for compatibility
  loading: boolean;
  error: string | null;
  addItem: (data: BookFormData) => Promise<void>;
  addBook: (data: BookFormData) => Promise<void>;
  updateItem: (id: string, data: Partial<BookFormData>) => Promise<void>;
  updateBook: (id: string, data: Partial<BookFormData>) => Promise<void>;
  toggleFavorite: (id: string) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  deleteBook: (id: string) => Promise<void>;
  clearError: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const cfg = ENTITY_CONFIG;
  const { user } = useAuth();
  const [items, setItems] = useState<Book[]>([]);
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
        const loadedData: Book[] = snapshot.docs.map((d) => ({
          id: d.id,
          favorite: false,
          ...(d.data() as Omit<Book, 'id'>),
        }));

        // Sort alphabetically by primary field (title/name), then secondary field (author/category)
        loadedData.sort((a, b) => {
          const titleComparison = a.title.localeCompare(b.title, undefined, { sensitivity: 'base' });
          if (titleComparison !== 0) return titleComparison;
          return a.author.localeCompare(b.author, undefined, { sensitivity: 'base' });
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

  const validateData = (data: Partial<BookFormData>) => {
    if (data.title !== undefined) {
      const trimmed = data.title.trim();
      if (!trimmed) {
        throw new Error(cfg.field1.requiredMessage);
      }
      if (trimmed.length > cfg.field1.maxLength) {
        throw new Error(cfg.field1.maxMessage);
      }
    }
    if (data.author !== undefined) {
      const trimmed = data.author.trim();
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

  const addItem = async (data: BookFormData) => {
    if (!user) throw new Error('You must be signed in');
    validateData(data);
    setError(null);

    const clean1 = data.title.trim();
    const clean2 = data.author.trim();

    // Deterministic docId preventing case-insensitive duplicates
    const docId = `${clean1.toLowerCase()}_${clean2.toLowerCase()}`.replace(/\//g, '_');

    // 1. Client-side duplicate check
    const isDuplicate = items.some(
      (b) =>
        b.title.trim().toLowerCase() === clean1.toLowerCase() &&
        b.author.trim().toLowerCase() === clean2.toLowerCase()
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

  const updateItem = async (id: string, data: Partial<BookFormData>) => {
    if (!user) throw new Error('You must be signed in');
    validateData(data);
    setError(null);

    // If primary or secondary fields changed, check duplicate with other items
    if (data.title !== undefined || data.author !== undefined) {
      const target = items.find((b) => b.id === id);
      const new1 = (data.title !== undefined ? data.title : target?.title || '').trim().toLowerCase();
      const new2 = (data.author !== undefined ? data.author : target?.author || '').trim().toLowerCase();

      const duplicate = items.find(
        (b) =>
          b.id !== id &&
          b.title.trim().toLowerCase() === new1 &&
          b.author.trim().toLowerCase() === new2
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
    if (data.author !== undefined) updatePayload[cfg.field2.key] = data.author.trim();
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
    books: user ? items : [], // alias
    loading,
    error,
    addItem,
    addBook: addItem, // alias
    updateItem,
    updateBook: updateItem, // alias
    toggleFavorite,
    deleteItem,
    deleteBook: deleteItem, // alias
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

// Aliases for backward compatibility
export const BookProvider = DataProvider;
export const useBooks = useData;

