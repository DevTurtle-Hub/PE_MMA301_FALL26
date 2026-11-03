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
import { THEME } from '../config/theme';

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
      case 'Watched':
        return { label: 'Watched', variant: 'green' };
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
          <Ionicons name="alert-circle-outline" size={40} color={THEME.textSecondary} style={{ marginBottom: 10 }} />
          <Text style={styles.notFoundText}>{cfg.entitySingular} not found or deleted.</Text>
          <Button
            title="Go Back"
            onPress={() => navigation.goBack()}
            variant="outline"
            size="md"
            style={{ marginTop: 16 }}
          />
        </View>
      </SafeAreaView>
    );
  }

  const badgeInfo = getStatusBadge(book.status);

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="arrow-back" size={20} color={THEME.primary} />
          <Text style={styles.backBtnText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {isEditing ? `Edit ${cfg.entitySingular}` : `${cfg.entitySingular} Details`}
        </Text>
        <View style={{ width: 44 }} />
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
                <View style={{ flex: 1, marginRight: 12 }}>
                  <Text style={styles.title}>{book.title}</Text>
                  <View style={styles.directorRow}>
                    <Ionicons name="person-outline" size={14} color={THEME.primary} style={{ marginRight: 6 }} />
                    <Text style={styles.author}>{book.director || book.author}</Text>
                  </View>
                </View>

                <View style={styles.rightActionRow}>
                  <Badge label={badgeInfo.label} variant={badgeInfo.variant} />
                  {/* Favorite Toggle Button */}
                  <TouchableOpacity
                    style={styles.starBtn}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    onPress={() => book.id && toggleFavorite(book.id)}
                  >
                    <Ionicons
                      name={book.favorite ? 'star' : 'star-outline'}
                      size={24}
                      color={book.favorite ? THEME.accent : THEME.textMuted}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.detailRow}>
                <View style={styles.labelCol}>
                  <Ionicons name="pricetag-outline" size={15} color={THEME.primary} style={{ marginRight: 6 }} />
                  <Text style={styles.label}>{cfg.category.label}:</Text>
                </View>
                <Text style={styles.value}>{book.genre}</Text>
              </View>

              <View style={styles.detailRow}>
                <View style={styles.labelCol}>
                  <Ionicons name="time-outline" size={15} color={THEME.primary} style={{ marginRight: 6 }} />
                  <Text style={styles.label}>{cfg.status.label}:</Text>
                </View>
                <Text style={styles.value}>{book.status}</Text>
              </View>

              {book.rating !== undefined ? (
                <View style={styles.detailRow}>
                  <View style={styles.labelCol}>
                    <Ionicons name="star" size={15} color={THEME.accent} style={{ marginRight: 6 }} />
                    <Text style={styles.label}>Rating:</Text>
                  </View>
                  <View style={styles.ratingValueRow}>
                    {Array.from({ length: 5 }, (_, i) => (
                      <Ionicons
                        key={i}
                        name={i < (book.rating || 0) ? 'star' : 'star-outline'}
                        size={15}
                        color={i < (book.rating || 0) ? THEME.accent : THEME.borderStrong}
                      />
                    ))}
                    <Text style={styles.ratingNumber}> ({book.rating}/5)</Text>
                  </View>
                </View>
              ) : null}

              <View style={styles.detailRow}>
                <View style={styles.labelCol}>
                  <Ionicons name="star" size={15} color={THEME.accent} style={{ marginRight: 6 }} />
                  <Text style={styles.label}>Favorite:</Text>
                </View>
                <Text style={styles.value}>{book.favorite ? 'Yes ⭐' : 'No'}</Text>
              </View>

              {book.notes ? (
                <View style={styles.notesSection}>
                  <View style={styles.labelCol}>
                    <Ionicons name="document-text-outline" size={15} color={THEME.primary} style={{ marginRight: 6 }} />
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
                size="md"
                icon={<Ionicons name="create-outline" size={18} color="#FFFFFF" />}
                style={styles.actionBtn}
              />
              <Button
                title={`Delete`}
                onPress={handleDelete}
                variant="danger"
                size="md"
                icon={<Ionicons name="trash-outline" size={18} color="#FFFFFF" />}
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
    backgroundColor: THEME.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: THEME.card,
    borderBottomWidth: 1,
    borderBottomColor: THEME.border,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  backBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: THEME.primary,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: THEME.textPrimary,
  },
  container: {
    padding: 16,
    paddingBottom: 40,
  },
  mainCard: {
    padding: 18,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: THEME.primary,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    color: THEME.textPrimary,
    letterSpacing: -0.3,
  },
  directorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  author: {
    fontSize: 14,
    color: THEME.textSecondary,
    fontWeight: '500',
  },
  rightActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  starBtn: {
    padding: 2,
  },
  divider: {
    height: 1,
    backgroundColor: THEME.surfaceSubtle,
    marginVertical: 14,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: THEME.surfaceSubtle,
  },
  labelCol: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: THEME.textSecondary,
  },
  value: {
    fontSize: 14,
    color: THEME.textPrimary,
    fontWeight: '700',
  },
  ratingValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  ratingNumber: {
    fontSize: 13,
    color: THEME.accentDark,
    fontWeight: '800',
  },
  notesSection: {
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: THEME.surfaceSubtle,
  },
  notesLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: THEME.textSecondary,
  },
  notesText: {
    fontSize: 13,
    color: THEME.textPrimary,
    lineHeight: 20,
    marginTop: 6,
    backgroundColor: THEME.surfaceSubtle,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: THEME.border,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 14,
  },
  actionBtn: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  notFoundText: {
    fontSize: 15,
    color: THEME.textSecondary,
    fontWeight: '500',
  },
});
