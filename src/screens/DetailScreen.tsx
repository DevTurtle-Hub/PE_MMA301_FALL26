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
import { Ionicons } from '@expo/vector-icons';
import { ScreenRouteProp, NavigationProp } from '../navigation/types';
import { useBooks } from '../context/BookContext';
import { Card, Badge, Button, BadgeVariant } from '../components/ui';
import { BookForm } from '../components/BookForm';
import { BookFormData } from '../types';
import { ENTITY_CONFIG } from '../config/entityConfig';

export const DetailScreen: React.FC = () => {
  const cfg = ENTITY_CONFIG;
  const route = useRoute<ScreenRouteProp<'Detail'>>();
  const navigation = useNavigation<NavigationProp<'Detail'>>();
  const { bookId } = route.params;
  const { books, updateBook, toggleFavorite, deleteBook } = useBooks();

  const [isEditing, setIsEditing] = useState(false);

  const book = books.find((b) => b.id === bookId);

  const getStatusBadge = (status: string): { label: string; variant: BadgeVariant } => {
    switch (status) {
      case 'Completed':
        return { label: 'Completed', variant: 'green' };
      case 'Watching':
        return { label: 'Watching', variant: 'blue' };
      case 'Plan to Watch':
        return { label: 'Plan to Watch', variant: 'yellow' };
      default:
        return { label: status, variant: 'gray' };
    }
  };

  const handleDelete = () => {
    if (!book) return;
    Alert.alert(
      `Delete ${cfg.entitySingular}`,
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
              Alert.alert('Error', err.message || `Failed to delete ${cfg.entitySingular}`);
            }
          },
        },
      ]
    );
  };

  const handleEditSubmit = async (data: BookFormData) => {
    await updateBook(bookId, data);
    setIsEditing(false);
  };

  if (!book) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centerContainer}>
          <Ionicons name="alert-circle-outline" size={32} color="#64748B" style={{ marginBottom: 8 }} />
          <Text style={styles.notFoundText}>{cfg.entitySingular} not found or deleted.</Text>
          <Button
            title="Go Back"
            onPress={() => navigation.goBack()}
            variant="outline"
            size="sm"
            style={{ marginTop: 12 }}
          />
        </View>
      </SafeAreaView>
    );
  }

  const badgeInfo = getStatusBadge(book.status);

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Compact Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="arrow-back" size={18} color="#0F172A" />
          <Text style={styles.backBtnText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {isEditing ? `Edit ${cfg.entitySingular}` : `${cfg.entitySingular} Details`}
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        {isEditing ? (
          <BookForm
            initialValues={{
              title: book.title,
              director: book.director || book.author,
              author: book.director || book.author,
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
          <>
            <Card style={styles.mainCard}>
              <View style={styles.titleRow}>
                <View style={{ flex: 1, marginRight: 8 }}>
                  <Text style={styles.title}>{book.title}</Text>
                  <View style={styles.directorRow}>
                    <Ionicons name="person-outline" size={12} color="#64748B" style={{ marginRight: 4 }} />
                    <Text style={styles.author}>{book.director || book.author}</Text>
                  </View>
                </View>

                <View style={styles.rightActionRow}>
                  <Badge label={badgeInfo.label} variant={badgeInfo.variant} />
                  {/* Favorite Toggle Button */}
                  <TouchableOpacity
                    style={styles.starBtn}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    onPress={() => book.id && toggleFavorite(book.id)}
                  >
                    <Ionicons
                      name={book.favorite ? 'star' : 'star-outline'}
                      size={20}
                      color={book.favorite ? '#0F172A' : '#94A3B8'}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.detailRow}>
                <View style={styles.labelCol}>
                  <Ionicons name="pricetag-outline" size={12} color="#64748B" style={{ marginRight: 4 }} />
                  <Text style={styles.label}>{cfg.category.label}:</Text>
                </View>
                <Text style={styles.value}>{book.genre}</Text>
              </View>

              <View style={styles.detailRow}>
                <View style={styles.labelCol}>
                  <Ionicons name="time-outline" size={12} color="#64748B" style={{ marginRight: 4 }} />
                  <Text style={styles.label}>{cfg.status.label}:</Text>
                </View>
                <Text style={styles.value}>{book.status}</Text>
              </View>

              {book.rating !== undefined ? (
                <View style={styles.detailRow}>
                  <View style={styles.labelCol}>
                    <Ionicons name="star-outline" size={12} color="#64748B" style={{ marginRight: 4 }} />
                    <Text style={styles.label}>Rating:</Text>
                  </View>
                  <View style={styles.ratingValueRow}>
                    {Array.from({ length: 5 }, (_, i) => (
                      <Ionicons
                        key={i}
                        name={i < (book.rating || 0) ? 'star' : 'star-outline'}
                        size={12}
                        color="#0F172A"
                      />
                    ))}
                    <Text style={styles.value}> ({book.rating}/5)</Text>
                  </View>
                </View>
              ) : null}

              <View style={styles.detailRow}>
                <View style={styles.labelCol}>
                  <Ionicons name="star" size={12} color="#64748B" style={{ marginRight: 4 }} />
                  <Text style={styles.label}>Favorite:</Text>
                </View>
                <Text style={styles.value}>{book.favorite ? 'Yes' : 'No'}</Text>
              </View>

              {book.notes ? (
                <View style={styles.notesSection}>
                  <View style={styles.labelCol}>
                    <Ionicons name="document-text-outline" size={12} color="#64748B" style={{ marginRight: 4 }} />
                    <Text style={styles.notesLabel}>Notes:</Text>
                  </View>
                  <Text style={styles.notesText}>{book.notes}</Text>
                </View>
              ) : null}
            </Card>

            <View style={styles.actionRow}>
              <Button
                title={`Edit`}
                onPress={() => setIsEditing(true)}
                variant="primary"
                size="sm"
                icon={<Ionicons name="create-outline" size={14} color="#FFFFFF" />}
                style={styles.actionBtn}
              />
              <Button
                title={`Delete`}
                onPress={handleDelete}
                variant="danger"
                size="sm"
                icon={<Ionicons name="trash-outline" size={14} color="#FFFFFF" />}
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
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  backBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0F172A',
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  container: {
    padding: 12,
    paddingBottom: 32,
  },
  mainCard: {
    padding: 14,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.2,
  },
  directorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
  },
  author: {
    fontSize: 12,
    color: '#64748B',
  },
  rightActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  starBtn: {
    padding: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  labelCol: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  value: {
    fontSize: 12,
    color: '#0F172A',
    fontWeight: '500',
  },
  ratingValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  notesSection: {
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  notesLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  notesText: {
    fontSize: 12,
    color: '#334155',
    lineHeight: 18,
    marginTop: 4,
    backgroundColor: '#F8FAFC',
    padding: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
  },
  actionBtn: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  notFoundText: {
    fontSize: 13,
    color: '#64748B',
  },
});
