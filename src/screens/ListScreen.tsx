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
import { Ionicons } from '@expo/vector-icons';
import { NavigationProp } from '../navigation/types';
import { useAuth } from '../context/AuthContext';
import { useBooks } from '../context/BookContext';
import { Card, Badge, Button, BadgeVariant } from '../components/ui';
import { BookFormData, Status } from '../types';
import { BookForm } from '../components/BookForm';
import { ENTITY_CONFIG } from '../config/entityConfig';
import { THEME } from '../config/theme';

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
        (b.director || b.author || '').toLowerCase().includes(cleanSearch);

      const matchCategory = selectedCategory === 'All' || b.genre === selectedCategory;
      const matchStatus = selectedStatus === 'All' || b.status === selectedStatus;
      const matchFavorite = !favoritesOnly || b.favorite === true;

      return matchSearch && matchCategory && matchStatus && matchFavorite;
    });
  }, [books, searchQuery, selectedCategory, selectedStatus, favoritesOnly]);

  // Summary counts (plain integers required)
  const totalCount = filteredBooks.length;
  const favoriteCount = filteredBooks.filter((b) => b.favorite).length;

  // Status breakdown:
  // "one row per status that appears, the status with the most movies first"
  const statusBreakdown = useMemo(() => {
    const defaultPriority: Record<string, number> = cfg.status.priorities || {
      'Plan to Watch': 1,
      Watching: 2,
      Watched: 3,
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

  const handleAddSubmit = async (data: BookFormData) => {
    await addBook(data);
  };

  return (
    <SafeAreaView testID="list-screen" accessibilityLabel="list-screen" style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.logoBadge}>
            <Ionicons name="film" size={20} color="#FFFFFF" />
          </View>
          <View style={{ marginLeft: 10, flex: 1 }}>
            <Text style={styles.headerTitle}>{cfg.appName}</Text>
            <Text style={styles.userEmail} numberOfLines={1}>
              {user?.email}
            </Text>
          </View>
        </View>
        <Button
          title="Logout"
          onPress={logout}
          variant="outline"
          size="sm"
          icon={<Ionicons name="log-out-outline" size={16} color={THEME.primary} />}
        />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        {/* Toggle Form Row */}
        <View style={styles.formToggleRow}>
          <Text style={styles.sectionHeaderTitle}>Watchlist</Text>
          <Button
            title={showAddForm ? 'Hide Form' : `+ Add ${cfg.entitySingular}`}
            onPress={() => setShowAddForm(!showAddForm)}
            variant={showAddForm ? 'outline' : 'primary'}
            size="sm"
            icon={
              <Ionicons
                name={showAddForm ? 'close-outline' : 'add-outline'}
                size={16}
                color={showAddForm ? THEME.primary : '#FFFFFF'}
              />
            }
          />
        </View>

        {/* Section A: Add form */}
        {showAddForm ? <BookForm onSubmit={handleAddSubmit} /> : null}

        {/* Section C: Filter, search and summary */}
        <Card style={styles.filterCard}>
          <View style={styles.filterCardHeader}>
            <Ionicons name="options-outline" size={18} color={THEME.primary} style={{ marginRight: 8 }} />
            <Text style={styles.filterCardTitle}>Filters & Search</Text>
          </View>

          {/* Search box with Icon */}
          <View style={styles.searchBox}>
            <Ionicons name="search-outline" size={18} color={THEME.primary} style={{ marginRight: 8 }} />
            <TextInput
              style={styles.searchInput}
              placeholder={`Search title or director...`}
              placeholderTextColor={THEME.textMuted}
              value={searchQuery}
              autoCapitalize="none"
              autoCorrect={false}
              onChangeText={setSearchQuery}
            />
            {searchQuery ? (
              <TouchableOpacity onPress={() => setSearchQuery('')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <Ionicons name="close-circle" size={18} color={THEME.textMuted} />
              </TouchableOpacity>
            ) : null}
          </View>

          {/* Genre filter chips */}
          <Text style={styles.filterLabel}>{cfg.category.label}:</Text>
          <View style={styles.chipsRow}>
            {['All', ...cfg.category.options].map((g) => {
              const isActive = selectedCategory === g;
              return (
                <TouchableOpacity
                  key={g}
                  activeOpacity={0.75}
                  style={[styles.filterChip, isActive && styles.filterChipActive]}
                  onPress={() => setSelectedCategory(g)}
                >
                  <Text style={[styles.filterChipText, isActive && styles.filterChipTextActive]}>
                    {g}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Status filter chips */}
          <Text style={styles.filterLabel}>{cfg.status.label}:</Text>
          <View style={styles.chipsRow}>
            {['All', ...cfg.status.options].map((s) => {
              const isActive = selectedStatus === s;
              return (
                <TouchableOpacity
                  key={s}
                  activeOpacity={0.75}
                  style={[styles.filterChip, isActive && styles.filterChipActive]}
                  onPress={() => setSelectedStatus(s)}
                >
                  <Text style={[styles.filterChipText, isActive && styles.filterChipTextActive]}>
                    {s}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Favorites switch & Clear button */}
          <View style={styles.switchRow}>
            <View style={styles.switchContainer}>
              <Ionicons
                name={favoritesOnly ? 'star' : 'star-outline'}
                size={18}
                color={favoritesOnly ? THEME.accentDark : THEME.textSecondary}
                style={{ marginRight: 8 }}
              />
              <Switch
                value={favoritesOnly}
                onValueChange={setFavoritesOnly}
                trackColor={{ false: THEME.border, true: THEME.primaryBorder }}
                thumbColor={favoritesOnly ? THEME.primary : '#FFFFFF'}
              />
              <Text style={styles.switchLabel}>Favorites only</Text>
            </View>

            <TouchableOpacity style={styles.clearBtn} onPress={handleClearFilters}>
              <Ionicons name="refresh-outline" size={14} color={THEME.primary} style={{ marginRight: 4 }} />
              <Text style={styles.clearBtnText}>Clear Filters</Text>
            </TouchableOpacity>
          </View>
        </Card>

        {/* Summary Card */}
        <Card style={styles.summaryCard}>
          <View style={styles.summaryStatsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Total {cfg.entityPlural}</Text>
              {/* Requirement: countTestId, MUST be plain integer text */}
              <Text
                testID={cfg.countTestId}
                accessibilityLabel={cfg.countTestId}
                style={styles.statNumber}
              >
                {totalCount}
              </Text>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.statBox}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name="star" size={15} color={THEME.accent} style={{ marginRight: 5 }} />
                <Text style={styles.statLabel}>Favorites</Text>
              </View>
              {/* Requirement: favoriteCountTestId, MUST be plain integer text */}
              <Text
                testID={cfg.favoriteCountTestId}
                accessibilityLabel={cfg.favoriteCountTestId}
                style={[styles.statNumber, styles.favoriteStatNumber]}
              >
                {favoriteCount}
              </Text>
            </View>
          </View>

          {/* Status breakdown */}
          {statusBreakdown.length > 0 ? (
            <View style={styles.breakdownContainer}>
              <Text style={styles.breakdownTitle}>Status Breakdown:</Text>
              <View style={styles.breakdownChips}>
                {statusBreakdown.map((item) => (
                  <View key={item.status} style={styles.breakdownChip}>
                    <Text style={styles.breakdownStatusName}>{item.status}:</Text>
                    <Text style={styles.breakdownStatusCount}>{item.count}</Text>
                  </View>
                ))}
              </View>
            </View>
          ) : null}
        </Card>

        {/* Section B: The List */}
        <View style={styles.listHeaderRow}>
          <Text style={styles.listHeaderTitle}>Movies</Text>
          <Text style={styles.listHeaderCount}>Showing {totalCount}</Text>
        </View>

        {loading && books.length === 0 ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color={THEME.primary} />
          </View>
        ) : filteredBooks.length === 0 ? (
          // Requirement: emptyListTestId with emptyListText
          <View
            testID={cfg.emptyListTestId}
            accessibilityLabel={cfg.emptyListTestId}
            style={styles.emptyContainer}
          >
            <Ionicons name="film-outline" size={40} color={THEME.primary} style={{ marginBottom: 10 }} />
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
                style={styles.movieCard}
                onPress={() => item.id && navigation.navigate('Detail', { bookId: item.id })}
              >
                <View style={styles.cardHeader}>
                  <View style={{ flex: 1, marginRight: 10 }}>
                    <Text style={styles.movieTitle} numberOfLines={1}>
                      {item.title}
                    </Text>
                    <View style={styles.directorRow}>
                      <Ionicons name="person-outline" size={13} color={THEME.textSecondary} style={{ marginRight: 5 }} />
                      <Text style={styles.movieDirector} numberOfLines={1}>
                        {item.director || item.author}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.actionHeaderRight}>
                    <Badge label={badgeInfo.label} variant={badgeInfo.variant} />
                    {/* Favorite Star Toggle with Glowing Amber Star */}
                    <TouchableOpacity
                      style={styles.starBtn}
                      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                      onPress={(e) => {
                        e.stopPropagation();
                        if (item.id) toggleFavorite(item.id);
                      }}
                    >
                      <Ionicons
                        name={item.favorite ? 'star' : 'star-outline'}
                        size={22}
                        color={item.favorite ? THEME.accent : THEME.textMuted}
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.cardFooter}>
                  <View style={styles.genreTag}>
                    <Ionicons name="pricetag-outline" size={12} color={THEME.secondary} style={{ marginRight: 4 }} />
                    <Text style={styles.genreText}>{item.genre}</Text>
                  </View>
                  {item.rating !== undefined ? (
                    <View style={styles.ratingRow}>
                      {Array.from({ length: 5 }, (_, i) => (
                        <Ionicons
                          key={i}
                          name={i < (item.rating || 0) ? 'star' : 'star-outline'}
                          size={14}
                          color={i < (item.rating || 0) ? THEME.accent : THEME.borderStrong}
                        />
                      ))}
                      <Text style={styles.ratingText}>{item.rating}/5</Text>
                    </View>
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
    backgroundColor: THEME.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: THEME.card,
    borderBottomWidth: 1,
    borderBottomColor: THEME.border,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  logoBadge: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: THEME.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: THEME.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: THEME.textPrimary,
    letterSpacing: -0.3,
  },
  userEmail: {
    fontSize: 12,
    color: THEME.textSecondary,
    marginTop: 2,
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
    color: THEME.textPrimary,
  },
  filterCard: {
    padding: 16,
    marginBottom: 14,
  },
  filterCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  filterCardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: THEME.textPrimary,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.2,
    borderColor: THEME.borderStrong,
    borderRadius: 8,
    backgroundColor: THEME.card,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 9,
    fontSize: 14,
    color: THEME.textPrimary,
  },
  filterLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: THEME.textSecondary,
    marginTop: 4,
    marginBottom: 6,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 10,
  },
  filterChip: {
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1.2,
    borderColor: THEME.borderStrong,
    backgroundColor: THEME.card,
  },
  filterChipActive: {
    backgroundColor: THEME.primary,
    borderColor: THEME.primaryDark,
  },
  filterChipText: {
    fontSize: 13,
    color: THEME.textSecondary,
    fontWeight: '600',
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
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: THEME.surfaceSubtle,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  switchLabel: {
    fontSize: 13,
    color: THEME.textPrimary,
    marginLeft: 8,
    fontWeight: '600',
  },
  clearBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    backgroundColor: THEME.primaryLight,
  },
  clearBtnText: {
    fontSize: 12,
    color: THEME.primary,
    fontWeight: '700',
  },
  summaryCard: {
    padding: 16,
    marginBottom: 14,
  },
  summaryStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 6,
  },
  statBox: {
    alignItems: 'center',
    flex: 1,
  },
  statDivider: {
    width: 1,
    height: 36,
    backgroundColor: THEME.border,
  },
  statLabel: {
    fontSize: 13,
    color: THEME.textSecondary,
    fontWeight: '600',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '900',
    color: THEME.primary,
    marginTop: 2,
  },
  favoriteStatNumber: {
    color: THEME.accentDark,
  },
  breakdownContainer: {
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: THEME.surfaceSubtle,
  },
  breakdownTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: THEME.textSecondary,
    marginBottom: 6,
  },
  breakdownChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  breakdownChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: THEME.surfaceSubtle,
    borderWidth: 1,
    borderColor: THEME.border,
  },
  breakdownStatusName: {
    fontSize: 12,
    color: THEME.textSecondary,
    fontWeight: '600',
  },
  breakdownStatusCount: {
    fontSize: 12,
    fontWeight: '800',
    color: THEME.primary,
    marginLeft: 5,
  },
  listHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  listHeaderTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: THEME.textPrimary,
  },
  listHeaderCount: {
    fontSize: 13,
    color: THEME.textSecondary,
  },
  centerContainer: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyContainer: {
    padding: 36,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: THEME.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: THEME.border,
  },
  emptyText: {
    fontSize: 15,
    color: THEME.textSecondary,
    fontWeight: '600',
  },
  movieCard: {
    padding: 14,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: THEME.primary,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  movieTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: THEME.textPrimary,
  },
  directorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  movieDirector: {
    fontSize: 13,
    color: THEME.textSecondary,
  },
  actionHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  starBtn: {
    padding: 2,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: THEME.surfaceSubtle,
  },
  genreTag: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  genreText: {
    fontSize: 12,
    color: THEME.textSecondary,
    fontWeight: '600',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '700',
    color: THEME.accentDark,
    marginLeft: 4,
  },
  noRatingText: {
    fontSize: 12,
    color: THEME.textMuted,
    fontStyle: 'italic',
  },
});
