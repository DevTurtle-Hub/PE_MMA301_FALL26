import React, { useState, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Switch,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from '../navigation/types';
import { useAuth } from '../context/AuthContext';
import { useBooks } from '../context/BookContext';
import { Card, Badge, Button, BadgeVariant } from '../components/ui';
import { BookFormData, Status } from '../types';
import { BookForm } from '../components/BookForm';
import { ENTITY_CONFIG } from '../config/entityConfig';

export const ListScreen: React.FC = () => {
  const cfg = ENTITY_CONFIG;
  const navigation = useNavigation<NavigationProp<'List'>>();
  const { user, logout } = useAuth();
  const { books, loading, addBook, toggleFavorite } = useBooks();

  // Filters & Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [favoritesOnly, setFavoritesOnly] = useState<boolean>(false);
  const [showAddForm, setShowAddForm] = useState<boolean>(false);

  // Clear all filters
  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedStatus('All');
    setFavoritesOnly(false);
  };

  // Filter books in real-time
  const filteredBooks = useMemo(() => {
    const cleanSearch = searchQuery.trim().toLowerCase();
    return books.filter((b) => {
      const matchSearch =
        !cleanSearch ||
        b.title.toLowerCase().includes(cleanSearch) ||
        b.author.toLowerCase().includes(cleanSearch);

      const matchCategory = selectedCategory === 'All' || b.genre === selectedCategory;
      const matchStatus = selectedStatus === 'All' || b.status === selectedStatus;
      const matchFavorite = !favoritesOnly || b.favorite === true;

      return matchSearch && matchCategory && matchStatus && matchFavorite;
    });
  }, [books, searchQuery, selectedCategory, selectedStatus, favoritesOnly]);

  // Summary counts
  const totalCount = filteredBooks.length;
  const favoriteCount = filteredBooks.filter((b) => b.favorite).length;

  // Status breakdown:
  // "one row per status that appears, the status with the most books first (equal counts: To Read, then Reading, then Finished)"
  const statusBreakdown = useMemo(() => {
    const defaultPriority: Record<string, number> = cfg.status.priorities || {
      'To Read': 1,
      Reading: 2,
      Finished: 3,
    };

    const counts: Record<string, number> = {};
    filteredBooks.forEach((b) => {
      counts[b.status] = (counts[b.status] || 0) + 1;
    });

    const entries = Object.keys(counts).map((status) => ({
      status: status as Status,
      count: counts[status],
    }));

    entries.sort((a, b) => {
      if (b.count !== a.count) {
        return b.count - a.count; // most items first
      }
      return (defaultPriority[a.status] || 99) - (defaultPriority[b.status] || 99);
    });

    return entries;
  }, [filteredBooks, cfg.status.priorities]);

  const getStatusBadge = (status: string): { label: string; variant: BadgeVariant } => {
    switch (status) {
      case 'Finished':
        return { label: 'Finished', variant: 'green' };
      case 'Reading':
        return { label: 'Reading', variant: 'blue' };
      default:
        return { label: status, variant: 'yellow' };
    }
  };

  const handleAddSubmit = async (data: BookFormData) => {
    await addBook(data);
  };

  return (
    <SafeAreaView testID="list-screen" accessibilityLabel="list-screen" style={styles.safeArea}>
      {/* Header: User Email and Logout button */}
      <View style={styles.header}>
        <View style={{ flex: 1, marginRight: 8 }}>
          <Text style={styles.headerTitle}>{cfg.appName}</Text>
          <Text style={styles.userEmail} numberOfLines={1}>
            {user?.email}
          </Text>
        </View>
        <Button
          title="Logout"
          onPress={logout}
          variant="danger"
          style={styles.logoutBtn}
          textStyle={{ fontSize: 13 }}
        />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        {/* Toggle / Add Section */}
        <View style={styles.formToggleRow}>
          <Text style={styles.sectionHeaderTitle}>Manage {cfg.entityPlural}</Text>
          <Button
            title={showAddForm ? 'Hide Form' : `+ Add a ${cfg.entitySingular}`}
            onPress={() => setShowAddForm(!showAddForm)}
            variant={showAddForm ? 'outline' : 'primary'}
            style={styles.toggleFormBtn}
            textStyle={{ fontSize: 13 }}
          />
        </View>

        {/* Section A: Add form */}
        {showAddForm ? <BookForm onSubmit={handleAddSubmit} /> : null}

        {/* Section C: Filter, search and summary */}
        <Card style={styles.filterCard}>
          <Text style={styles.filterCardTitle}>Filters & Search</Text>

          {/* Search box */}
          <TextInput
            style={styles.searchInput}
            placeholder={`Search by ${cfg.field1.label.toLowerCase()} or ${cfg.field2.label.toLowerCase()}...`}
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            autoCapitalize="none"
            autoCorrect={false}
            onChangeText={setSearchQuery}
          />

          {/* Category filter */}
          <Text style={styles.filterLabel}>{cfg.category.label}:</Text>
          <View style={styles.chipsRow}>
            {['All', ...cfg.category.options].map((g) => (
              <TouchableOpacity
                key={g}
                style={[styles.filterChip, selectedCategory === g && styles.filterChipActive]}
                onPress={() => setSelectedCategory(g)}
              >
                <Text style={[styles.filterChipText, selectedCategory === g && styles.filterChipTextActive]}>
                  {g}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Status filter */}
          <Text style={styles.filterLabel}>{cfg.status.label}:</Text>
          <View style={styles.chipsRow}>
            {['All', ...cfg.status.options].map((s) => (
              <TouchableOpacity
                key={s}
                style={[styles.filterChip, selectedStatus === s && styles.filterChipActive]}
                onPress={() => setSelectedStatus(s)}
              >
                <Text style={[styles.filterChipText, selectedStatus === s && styles.filterChipTextActive]}>
                  {s}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Favorites only switch & Clear button */}
          <View style={styles.switchRow}>
            <View style={styles.switchContainer}>
              <Switch
                value={favoritesOnly}
                onValueChange={setFavoritesOnly}
                trackColor={{ false: '#D1D5DB', true: '#93C5FD' }}
                thumbColor={favoritesOnly ? '#2563EB' : '#F3F4F6'}
              />
              <Text style={styles.switchLabel}>Favorites only</Text>
            </View>

            <TouchableOpacity style={styles.clearBtn} onPress={handleClearFilters}>
              <Text style={styles.clearBtnText}>Clear Filters</Text>
            </TouchableOpacity>
          </View>
        </Card>

        {/* Summary Card */}
        <Card style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Collection Summary</Text>
          <View style={styles.summaryStatsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Total {cfg.entityPlural}</Text>
              {/* Requirement: countTestId, plain integer */}
              <Text
                testID={cfg.countTestId}
                accessibilityLabel={cfg.countTestId}
                style={styles.statNumber}
              >
                {totalCount}
              </Text>
            </View>

            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Favorites</Text>
              {/* Requirement: favoriteCountTestId, plain integer */}
              <Text
                testID={cfg.favoriteCountTestId}
                accessibilityLabel={cfg.favoriteCountTestId}
                style={styles.statNumber}
              >
                {favoriteCount}
              </Text>
            </View>
          </View>

          {/* Status breakdown */}
          {statusBreakdown.length > 0 ? (
            <View style={styles.breakdownContainer}>
              <Text style={styles.breakdownTitle}>Status Breakdown:</Text>
              {statusBreakdown.map((item) => (
                <View key={item.status} style={styles.breakdownRow}>
                  <Text style={styles.breakdownStatusName}>{item.status}</Text>
                  <Text style={styles.breakdownStatusCount}>{item.count} items</Text>
                </View>
              ))}
            </View>
          ) : null}
        </Card>

        {/* Section B: The List */}
        <Text style={styles.sectionHeaderTitle}>{cfg.entityPlural} List</Text>

        {loading && books.length === 0 ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color="#2563EB" />
          </View>
        ) : filteredBooks.length === 0 ? (
          // Requirement: emptyListTestId with emptyListText
          <View
            testID={cfg.emptyListTestId}
            accessibilityLabel={cfg.emptyListTestId}
            style={styles.emptyContainer}
          >
            <Text style={styles.emptyText}>{cfg.emptyListText}</Text>
          </View>
        ) : (
          filteredBooks.map((item) => {
            const badgeInfo = getStatusBadge(item.status);
            return (
              <Card
                key={item.id}
                testID={cfg.itemTestId}
                accessibilityLabel={cfg.itemTestId}
                style={styles.bookCard}
                onPress={() => item.id && navigation.navigate('Detail', { bookId: item.id })}
              >
                <View style={styles.cardHeader}>
                  <View style={{ flex: 1, marginRight: 8 }}>
                    <Text style={styles.bookTitle} numberOfLines={1}>
                      {item.title}
                    </Text>
                    <Text style={styles.bookAuthor} numberOfLines={1}>
                      by {item.author}
                    </Text>
                  </View>

                  <View style={styles.actionHeaderRight}>
                    <Badge label={badgeInfo.label} variant={badgeInfo.variant} />
                    {/* Favorite Star Toggle */}
                    <TouchableOpacity
                      style={styles.starBtn}
                      onPress={(e) => {
                        e.stopPropagation();
                        if (item.id) toggleFavorite(item.id);
                      }}
                    >
                      <Text style={[styles.starIcon, item.favorite && styles.starIconActive]}>
                        {item.favorite ? '★' : '☆'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.cardFooter}>
                  <Text style={styles.genreText}>{cfg.category.label}: {item.genre}</Text>
                  {item.rating !== undefined ? (
                    <Text style={styles.ratingText}>
                      {'★'.repeat(item.rating)} ({item.rating}/5)
                    </Text>
                  ) : (
                    <Text style={styles.noRatingText}>No rating</Text>
                  )}
                </View>
              </Card>
            );
          })
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
  scrollContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  formToggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionHeaderTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
  },
  toggleFormBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  filterCard: {
    padding: 16,
    marginBottom: 16,
  },
  filterCardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 10,
  },
  searchInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.2,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    color: '#111827',
    marginBottom: 12,
  },
  filterLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4B5563',
    marginBottom: 4,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 10,
  },
  filterChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
    backgroundColor: '#E5E7EB',
  },
  filterChipActive: {
    backgroundColor: '#2563EB',
  },
  filterChipText: {
    fontSize: 12,
    color: '#4B5563',
    fontWeight: '500',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 10,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  switchLabel: {
    fontSize: 13,
    color: '#374151',
    fontWeight: '500',
  },
  clearBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#F3F4F6',
  },
  clearBtnText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
  },
  summaryCard: {
    padding: 16,
    marginBottom: 20,
    backgroundColor: '#EEF2FF',
    borderColor: '#C7D2FE',
  },
  summaryTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#312E81',
    marginBottom: 10,
  },
  summaryStatsRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E7FF',
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '800',
    color: '#2563EB',
    marginTop: 2,
  },
  breakdownContainer: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E7FF',
  },
  breakdownTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4B5563',
    marginBottom: 6,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 3,
  },
  breakdownStatusName: {
    fontSize: 13,
    color: '#374151',
    fontWeight: '500',
  },
  breakdownStatusCount: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1F2937',
  },
  bookCard: {
    marginBottom: 12,
  },
  cardHeader: {
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
  actionHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  starBtn: {
    padding: 4,
  },
  starIcon: {
    fontSize: 22,
    color: '#9CA3AF',
  },
  starIconActive: {
    color: '#F59E0B',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 8,
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
  centerContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyContainer: {
    padding: 30,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginTop: 10,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#6B7280',
  },
});
