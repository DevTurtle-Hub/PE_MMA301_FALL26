import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  SafeAreaView,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useBooks } from '../context/BookContext';
import { Book, BookFormData } from '../types';
import { BookModal } from './BookModal';

export const BookListScreen: React.FC = () => {
  const { user, signOut } = useAuth();
  const { books, loading, error, addBook, updateBook, deleteBook, clearError } = useBooks();

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  const handleOpenAdd = () => {
    setSelectedBook(null);
    setModalVisible(true);
  };

  const handleOpenEdit = (book: Book) => {
    setSelectedBook(book);
    setModalVisible(true);
  };

  const handleDelete = (book: Book) => {
    if (!book.id) return;
    Alert.alert(
      'Confirm Delete',
      `Are you sure you want to delete "${book.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteBook(book.id!);
            } catch (err: any) {
              Alert.alert('Error', err.message || 'Failed to delete book');
            }
          },
        },
      ]
    );
  };

  const handleModalSubmit = async (data: BookFormData) => {
    if (selectedBook && selectedBook.id) {
      await updateBook(selectedBook.id, data);
    } else {
      await addBook(data);
    }
  };

  const renderBookItem = ({ item }: { item: Book }) => {
    const getStatusColor = (status: string) => {
      switch (status) {
        case 'Finished':
          return '#10B981';
        case 'Reading':
          return '#3B82F6';
        default:
          return '#F59E0B';
      }
    };

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={{ flex: 1 }}>
            <Text style={styles.bookTitle}>{item.title}</Text>
            <Text style={styles.bookAuthor}>by {item.author}</Text>
          </View>
          <View style={[styles.badge, { backgroundColor: getStatusColor(item.status) }]}>
            <Text style={styles.badgeText}>{item.status}</Text>
          </View>
        </View>

        <View style={styles.metaRow}>
          <Text style={styles.genreText}>Genre: {item.genre}</Text>
          {item.rating !== undefined ? (
            <Text style={styles.ratingText}>{'★'.repeat(item.rating)} ({item.rating}/5)</Text>
          ) : null}
        </View>

        {item.notes ? (
          <View style={styles.notesContainer}>
            <Text style={styles.notesText}>{item.notes}</Text>
          </View>
        ) : null}

        <View style={styles.cardActions}>
          <TouchableOpacity
            style={[styles.actionBtn, styles.editBtn]}
            onPress={() => handleOpenEdit(item)}
          >
            <Text style={styles.editBtnText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionBtn, styles.deleteBtn]}
            onPress={() => handleDelete(item)}
          >
            <Text style={styles.deleteBtnText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>My Books</Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
        </View>
        <TouchableOpacity style={styles.signOutBtn} onPress={signOut}>
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>

      {error ? (
        <TouchableOpacity style={styles.errorBanner} onPress={clearError}>
          <Text style={styles.errorBannerText}>{error} (Tap to dismiss)</Text>
        </TouchableOpacity>
      ) : null}

      {loading && books.length === 0 ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#3B82F6" />
        </View>
      ) : (
        <FlatList
          data={books}
          keyExtractor={(item) => item.id || Math.random().toString()}
          renderItem={renderBookItem}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyTitle}>No books added yet!</Text>
              <Text style={styles.emptySubtitle}>Tap the &quot;+ Add Book&quot; button below to start.</Text>
            </View>
          }
        />
      )}

      <View style={styles.footer}>
        <TouchableOpacity style={styles.addBookButton} onPress={handleOpenAdd}>
          <Text style={styles.addBookButtonText}>+ Add Book</Text>
        </TouchableOpacity>
      </View>

      <BookModal
        visible={modalVisible}
        bookToEdit={selectedBook}
        onClose={() => setModalVisible(false)}
        onSubmit={handleModalSubmit}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  userEmail: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  signOutBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#FEE2E2',
  },
  signOutText: {
    color: '#DC2626',
    fontWeight: '600',
    fontSize: 13,
  },
  errorBanner: {
    backgroundColor: '#FEE2E2',
    padding: 10,
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 6,
  },
  errorBannerText: {
    color: '#B91C1C',
    fontSize: 13,
    textAlign: 'center',
  },
  listContent: {
    padding: 16,
    paddingBottom: 80,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  bookTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1F2937',
  },
  bookAuthor: {
    fontSize: 14,
    color: '#4B5563',
    marginTop: 2,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  genreText: {
    fontSize: 13,
    color: '#6B7280',
    fontStyle: 'italic',
  },
  ratingText: {
    fontSize: 13,
    color: '#D97706',
    fontWeight: '600',
  },
  notesContainer: {
    marginTop: 10,
    padding: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 6,
  },
  notesText: {
    fontSize: 13,
    color: '#374151',
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 10,
  },
  actionBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  editBtn: {
    backgroundColor: '#EFF6FF',
  },
  editBtnText: {
    color: '#2563EB',
    fontSize: 13,
    fontWeight: '600',
  },
  deleteBtn: {
    backgroundColor: '#FEE2E2',
  },
  deleteBtnText: {
    color: '#DC2626',
    fontSize: 13,
    fontWeight: '600',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4B5563',
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 6,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  addBookButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  addBookButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});

