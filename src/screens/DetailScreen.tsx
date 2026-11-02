import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import { ScreenRouteProp, NavigationProp } from '../navigation/types';
import { useBooks } from '../context/BookContext';
import { Card, Badge, Button, BadgeVariant } from '../components/ui';
import { BookForm } from '../components/BookForm';
import { BookFormData } from '../types';

export const DetailScreen: React.FC = () => {
  const route = useRoute<ScreenRouteProp<'Detail'>>();
  const navigation = useNavigation<NavigationProp<'Detail'>>();
  const { bookId } = route.params;
  const { books, updateBook, toggleFavorite, deleteBook } = useBooks();

  const [isEditing, setIsEditing] = useState(false);

  const book = books.find((b) => b.id === bookId);

  const getStatusBadge = (status: string): { label: string; variant: BadgeVariant } => {
    switch (status) {
      case 'Finished':
        return { label: 'Finished', variant: 'green' };
      case 'Reading':
        return { label: 'Reading', variant: 'blue' };
      default:
        return { label: 'To Read', variant: 'yellow' };
    }
  };

  const handleDelete = () => {
    if (!book) return;
    Alert.alert(
      'Delete Book',
      `Are you sure you want to delete "${book.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteBook(bookId);
              navigation.goBack();
            } catch (err: any) {
              Alert.alert('Error', err.message || 'Failed to delete book');
            }
          },
        },
      ]
    );
  };

  const handleEditSubmit = async (data: BookFormData) => {
    await updateBook(bookId, data);
    setIsEditing(false); // Requirement: "Save updates the book in Firestore and returns to view mode"
  };

  if (!book) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centerContainer}>
          <Text style={styles.notFoundText}>Book not found or deleted.</Text>
          <Button
            title="Go Back"
            onPress={() => navigation.goBack()}
            variant="outline"
            style={{ marginTop: 16 }}
          />
        </View>
      </SafeAreaView>
    );
  }

  const badgeInfo = getStatusBadge(book.status);

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top Bar */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{isEditing ? 'Edit Book' : 'Book Details'}</Text>
        <View style={{ width: 50 }} />
      </View>

      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        {isEditing ? (
          // Requirement: "An Edit action switches the same fields into editable inputs with Save and Cancel buttons"
          <BookForm
            initialValues={{
              title: book.title,
              author: book.author,
              genre: book.genre,
              status: book.status,
              rating: book.rating,
              notes: book.notes,
            }}
            onSubmit={handleEditSubmit}
            onCancel={() => setIsEditing(false)}
            submitButtonText="Save Changes"
            isEdit={true}
          />
        ) : (
          // View Mode: title, author, genre, status, rating, notes and favorite toggle
          <>
            <Card style={styles.mainCard}>
              <View style={styles.titleRow}>
                <View style={{ flex: 1, marginRight: 8 }}>
                  <Text style={styles.title}>{book.title}</Text>
                  <Text style={styles.author}>by {book.author}</Text>
                </View>

                <View style={styles.rightActionRow}>
                  <Badge label={badgeInfo.label} variant={badgeInfo.variant} />
                  {/* Favorite Toggle Button */}
                  <TouchableOpacity
                    style={styles.starBtn}
                    onPress={() => book.id && toggleFavorite(book.id)}
                  >
                    <Text style={[styles.starIcon, book.favorite && styles.starIconActive]}>
                      {book.favorite ? '★' : '☆'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.detailRow}>
                <Text style={styles.label}>Genre:</Text>
                <Text style={styles.value}>{book.genre}</Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.label}>Status:</Text>
                <Text style={styles.value}>{book.status}</Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.label}>Rating:</Text>
                <Text style={styles.value}>
                  {book.rating !== undefined ? `${'★'.repeat(book.rating)} (${book.rating}/5)` : 'Not rated yet'}
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.label}>Favorite:</Text>
                <Text style={styles.value}>{book.favorite ? 'Yes ⭐' : 'No'}</Text>
              </View>

              {book.notes ? (
                <View style={styles.notesSection}>
                  <Text style={styles.notesLabel}>Notes:</Text>
                  <Text style={styles.notesText}>{book.notes}</Text>
                </View>
              ) : null}
            </Card>

            <View style={styles.actionRow}>
              <Button
                title="Edit Book"
                onPress={() => setIsEditing(true)}
                variant="primary"
                style={styles.actionBtn}
              />
              <Button
                title="Delete Book"
                onPress={handleDelete}
                variant="danger"
                style={styles.actionBtn}
              />
            </View>
          </>
        )}
      </ScrollView>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backBtn: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  backBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2563EB',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  container: {
    padding: 16,
    paddingBottom: 40,
  },
  mainCard: {
    padding: 20,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
  },
  author: {
    fontSize: 15,
    color: '#4B5563',
    marginTop: 4,
  },
  rightActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  starBtn: {
    padding: 4,
  },
  starIcon: {
    fontSize: 24,
    color: '#9CA3AF',
  },
  starIconActive: {
    color: '#F59E0B',
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginVertical: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  value: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  notesSection: {
    marginTop: 16,
    backgroundColor: '#F3F4F6',
    padding: 12,
    borderRadius: 8,
  },
  notesLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4B5563',
    marginBottom: 4,
  },
  notesText: {
    fontSize: 14,
    color: '#1F2937',
    lineHeight: 20,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  actionBtn: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  notFoundText: {
    fontSize: 16,
    color: '#6B7280',
  },
});
