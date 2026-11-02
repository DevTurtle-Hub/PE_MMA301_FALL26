import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from '../navigation/types';
import { useAuth } from '../context/AuthContext';
import { useBooks } from '../context/BookContext';
import { Card, Badge, BadgeVariant, Button } from '../components/ui';
import { Book, BookFormData, GENRES } from '../types';
import { BookModal } from '../components/BookModal';

export const ListScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<'List'>>();
  const { user, logout } = useAuth();
  const { books, loading, error, addBook, clearError } = useBooks();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string>('All');
  const [modalVisible, setModalVisible] = useState(false);

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

  const filteredBooks = books.filter((b) => {
    const matchesSearch =
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGenre = selectedGenre === 'All' || b.genre === selectedGenre;
    return matchesSearch && matchesGenre;
  });

  const handleAddSubmit = async (data: BookFormData) => {
    await addBook(data);
  };

  const renderBookItem = ({ item }: { item: Book }) => {
    const badgeInfo = getStatusBadge(item.status);

    return (
      <Card
        onPress={() => item.id && navigation.navigate('Detail', { bookId: item.id })}
        style={styles.bookCard}
      >
        <View style={styles.cardTopRow}>
          <View style={{ flex: 1, marginRight: 8 }}>
            <Text style={styles.bookTitle} numberOfLines={1}>
              {item.title}
            </Text>
            <Text style={styles.bookAuthor} numberOfLines={1}>
              by {item.author}
            </Text>
          </View>
          <Badge label={badgeInfo.label} variant={badgeInfo.variant} />
        </View>

        <View style={styles.cardBottomRow}>
          <Text style={styles.genreText}>{item.genre}</Text>
          {item.rating !== undefined ? (
            <Text style={styles.ratingText}>{'★'.repeat(item.rating)} ({item.rating}/5)</Text>
          ) : (
            <Text style={styles.noRatingText}>No rating</Text>
          )}
        </View>
      </Card>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>My BookShelf</Text>
          <Text style={styles.userEmail} numberOfLines={1}>
            {user?.email}
          </Text>
        </View>
        <Button
          title="Sign Out"
          onPress={logout}
          variant="danger"
          style={styles.logoutBtn}
          textStyle={{ fontSize: 12 }}
        />
      </View>

      {/* Search Input */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by title or author..."
          placeholderTextColor="#9CA3AF"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Genre Filter Chips */}
      <View style={styles.chipsContainer}>
        <TouchableOpacity
          style={[styles.chip, selectedGenre === 'All' && styles.chipActive]}
          onPress={() => setSelectedGenre('All')}
        >
          <Text style={[styles.chipText, selectedGenre === 'All' && styles.chipTextActive]}>
            All ({books.length})
          </Text>
        </TouchableOpacity>
        {GENRES.map((g) => {
          const count = books.filter((b) => b.genre === g).length;
          return (
            <TouchableOpacity
              key={g}
              style={[styles.chip, selectedGenre === g && styles.chipActive]}
              onPress={() => setSelectedGenre(g)}
            >
              <Text style={[styles.chipText, selectedGenre === g && styles.chipTextActive]}>
                {g} ({count})
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {error ? (
        <TouchableOpacity style={styles.errorBanner} onPress={clearError}>
          <Text style={styles.errorBannerText}>{error} (Tap to dismiss)</Text>
        </TouchableOpacity>
      ) : null}

      {/* Main List */}
      {loading && books.length === 0 ? (
        <View style={styles.centerBox}>
          <ActivityIndicator size="large" color="#2563EB" />
        </View>
      ) : (
        <FlatList
          data={filteredBooks}
          keyExtractor={(item) => item.id || Math.random().toString()}
          renderItem={renderBookItem}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyBox}>
              <Text style={styles.emptyTitle}>No matching books found</Text>
              <Text style={styles.emptyDesc}>
                {books.length === 0
                  ? 'Your collection is empty. Tap "+ Add Book" below to get started!'
                  : 'Try adjusting your search query or genre filter.'}
              </Text>
            </View>
          }
        />
      )}

      {/* Bottom Floating Bar */}
      <View style={styles.floatingBar}>
        <Button
          title="+ Add Book"
          onPress={() => setModalVisible(true)}
          variant="primary"
          style={styles.addBtn}
        />
      </View>

      <BookModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={handleAddSubmit}
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
    fontWeight: '800',
    color: '#111827',
  },
  userEmail: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  logoutBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  searchInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: '#111827',
  },
  chipsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
    flexWrap: 'wrap',
  },
  chip: {
    backgroundColor: '#E5E7EB',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
  },
  chipActive: {
    backgroundColor: '#2563EB',
  },
  chipText: {
    fontSize: 12,
    color: '#4B5563',
    fontWeight: '500',
  },
  chipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  errorBanner: {
    backgroundColor: '#FEE2E2',
    padding: 10,
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 8,
  },
  errorBannerText: {
    color: '#B91C1C',
    fontSize: 12,
    textAlign: 'center',
  },
  listContent: {
    padding: 16,
    paddingBottom: 90,
  },
  bookCard: {
    marginBottom: 12,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  bookTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
  },
  bookAuthor: {
    fontSize: 14,
    color: '#4B5563',
    marginTop: 2,
  },
  cardBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  genreText: {
    fontSize: 13,
    color: '#6B7280',
    fontStyle: 'italic',
  },
  ratingText: {
    fontSize: 13,
    color: '#D97706',
    fontWeight: '700',
  },
  noRatingText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  centerBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyBox: {
    alignItems: 'center',
    marginTop: 60,
    paddingHorizontal: 30,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#4B5563',
  },
  emptyDesc: {
    fontSize: 13,
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
  },
  floatingBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  addBtn: {
    width: '100%',
  },
});

