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

interface BookContextType {
  books: Book[];
  loading: boolean;
  error: string | null;
  addBook: (data: BookFormData) => Promise<void>;
  updateBook: (id: string, data: Partial<BookFormData>) => Promise<void>;
  deleteBook: (id: string) => Promise<void>;
  clearError: () => void;
}

const BookContext = createContext<BookContextType | undefined>(undefined);

export const BookProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      return;
    }

    const booksQuery = query(
      collection(db, 'books'),
      where('userId', '==', user.uid)
    );

    const unsubscribe = onSnapshot(
      booksQuery,
      (snapshot) => {
        const booksData: Book[] = snapshot.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<Book, 'id'>),
        }));
        setBooks(booksData);
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
  }, [user]);

  const validateBookData = (data: Partial<BookFormData>) => {
    if (data.title !== undefined) {
      const trimmed = data.title.trim();
      if (!trimmed || trimmed.length > 100) {
        throw new Error('Title must be between 1 and 100 characters');
      }
    }
    if (data.author !== undefined) {
      const trimmed = data.author.trim();
      if (!trimmed || trimmed.length > 60) {
        throw new Error('Author must be between 1 and 60 characters');
      }
    }
    if (data.rating !== undefined && data.rating !== null) {
      if (!Number.isInteger(data.rating) || data.rating < 0 || data.rating > 5) {
        throw new Error('Rating must be an integer between 0 and 5');
      }
    }
    if (data.notes !== undefined && data.notes !== null && data.notes.length > 300) {
      throw new Error('Notes must not exceed 300 characters');
    }
  };

  const addBook = async (data: BookFormData) => {
    if (!user) throw new Error('You must be signed in to add a book');
    validateBookData(data);
    setError(null);

    const cleanTitle = data.title.trim();
    const cleanAuthor = data.author.trim();

    // "Bẫy" Trùng lặp (Duplicate Rule):
    // Case-insensitive duplicate prevention:
    // docId = `${title.trim().toLowerCase()}_${author.trim().toLowerCase()}`
    const docId = `${cleanTitle.toLowerCase()}_${cleanAuthor.toLowerCase()}`.replace(/\//g, '_');

    // 1. Client-side duplicate check
    const isDuplicate = books.some(
      (b) =>
        b.title.trim().toLowerCase() === cleanTitle.toLowerCase() &&
        b.author.trim().toLowerCase() === cleanAuthor.toLowerCase()
    );
    if (isDuplicate) {
      const msg = `Duplicate entry: You already have "${cleanTitle}" by "${cleanAuthor}" in your library (case-insensitive).`;
      setError(msg);
      throw new Error(msg);
    }

    // 2. Server-side / Firestore check on the deterministic docId
    const bookRef = doc(db, 'books', docId);
    const existingSnap = await getDoc(bookRef);
    if (existingSnap.exists()) {
      const msg = `Duplicate entry: A book with this title and author already exists in Firestore.`;
      setError(msg);
      throw new Error(msg);
    }

    const newBookPayload: Record<string, any> = {
      userId: user.uid,
      title: cleanTitle,
      author: cleanAuthor,
      genre: data.genre,
      status: data.status,
      createdAt: serverTimestamp(),
    };

    if (data.rating !== undefined && data.rating !== null) {
      newBookPayload.rating = data.rating;
    }
    if (data.notes !== undefined && data.notes.trim() !== '') {
      newBookPayload.notes = data.notes.trim();
    }

    try {
      await setDoc(bookRef, newBookPayload, { merge: false });
    } catch (err: any) {
      setError(err.message || 'Failed to add book');
      throw err;
    }
  };

  const updateBook = async (id: string, data: Partial<BookFormData>) => {
    if (!user) throw new Error('You must be signed in to update a book');
    validateBookData(data);
    setError(null);

    // If title or author is changed, check for duplicates with other books
    if (data.title !== undefined || data.author !== undefined) {
      const targetBook = books.find((b) => b.id === id);
      const newTitle = (data.title !== undefined ? data.title : targetBook?.title || '').trim().toLowerCase();
      const newAuthor = (data.author !== undefined ? data.author : targetBook?.author || '').trim().toLowerCase();

      const duplicate = books.find(
        (b) =>
          b.id !== id &&
          b.title.trim().toLowerCase() === newTitle &&
          b.author.trim().toLowerCase() === newAuthor
      );

      if (duplicate) {
        const msg = `Duplicate entry: Another book with this title and author already exists (case-insensitive).`;
        setError(msg);
        throw new Error(msg);
      }
    }

    const updatePayload: Record<string, any> = {
      userId: user.uid,
    };

    if (data.title !== undefined) updatePayload.title = data.title.trim();
    if (data.author !== undefined) updatePayload.author = data.author.trim();
    if (data.genre !== undefined) updatePayload.genre = data.genre;
    if (data.status !== undefined) updatePayload.status = data.status;
    if (data.rating !== undefined) updatePayload.rating = data.rating;
    if (data.notes !== undefined) updatePayload.notes = data.notes.trim();

    try {
      const bookRef = doc(db, 'books', id);
      await updateDoc(bookRef, updatePayload);
    } catch (err: any) {
      setError(err.message || 'Failed to update book');
      throw err;
    }
  };

  const deleteBook = async (id: string) => {
    if (!user) throw new Error('You must be signed in to delete a book');
    setError(null);
    try {
      await deleteDoc(doc(db, 'books', id));
    } catch (err: any) {
      setError(err.message || 'Failed to delete book');
      throw err;
    }
  };

  const clearError = () => setError(null);

  return (
    <BookContext.Provider
      value={{
        books: user ? books : [],
        loading,
        error,
        addBook,
        updateBook,
        deleteBook,
        clearError,
      }}
    >
      {children}
    </BookContext.Provider>
  );
};

export const useBooks = (): BookContextType => {
  const context = useContext(BookContext);
  if (!context) {
    throw new Error('useBooks must be used within a BookProvider');
  }
  return context;
};
