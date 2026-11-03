export interface FieldRule {
  key: string;
  label: string;
  placeholder?: string;
  requiredMessage: string;
  maxLength: number;
  maxMessage: string;
}

export interface EnumRule {
  key: string;
  label: string;
  chooseLabel: string;
  emptyMessage: string;
  options: string[];
  priorities?: Record<string, number>;
}

export interface NumericRule {
  key: string;
  label: string;
  min: number;
  max: number;
  errorMessage: string;
}

export interface NotesRule {
  key: string;
  label: string;
  maxLength: number;
  maxMessage: string;
}

export interface EntityConfig {
  collectionName: string;
  entitySingular: string;
  entityPlural: string;
  appName: string;

  homeTitleTestId: string;
  formTestId: string;
  formSuccessTestId: string;
  formSuccessText: string;
  errorFormTestId: string;
  itemTestId: string;
  emptyListTestId: string;
  emptyListText: string;
  countTestId: string;
  favoriteCountTestId: string;

  field1: FieldRule;
  field2: FieldRule;
  category: EnumRule;
  status: EnumRule;
  numeric?: NumericRule;
  notes?: NotesRule;

  featureCards: { title: string; desc: string }[];
}

export const ENTITY_CONFIG: EntityConfig = {
  collectionName: 'movies',
  entitySingular: 'movie',
  entityPlural: 'movies',
  appName: 'CineList',

  homeTitleTestId: 'home-title',
  formTestId: 'movie-form',
  formSuccessTestId: 'movie-success',
  formSuccessText: 'Movie added',
  errorFormTestId: 'error-movie',
  itemTestId: 'movie-item',
  emptyListTestId: 'movies-empty',
  emptyListText: 'No movies found',
  countTestId: 'movie-count',
  favoriteCountTestId: 'favorite-count',

  field1: {
    key: 'title',
    label: 'Title',
    placeholder: 'Enter movie title',
    requiredMessage: 'Title is required',
    maxLength: 100,
    maxMessage: 'Title must be at most 100 characters',
  },
  field2: {
    key: 'director',
    label: 'Director',
    placeholder: 'Enter director name',
    requiredMessage: 'Director is required',
    maxLength: 60,
    maxMessage: 'Director must be at most 60 characters',
  },
  category: {
    key: 'genre',
    label: 'Genre',
    chooseLabel: 'Choose genre',
    emptyMessage: 'Please choose a genre',
    options: ['Action', 'Comedy', 'Drama', 'Horror'],
  },
  status: {
    key: 'status',
    label: 'Status',
    chooseLabel: 'Choose status',
    emptyMessage: 'Please choose a status',
    options: ['Plan to Watch', 'Watching', 'Watched'],
    priorities: {
      'Plan to Watch': 1,
      Watching: 2,
      Watched: 3,
    },
  },
  numeric: {
    key: 'rating',
    label: 'Rating (0 - 5, optional)',
    min: 0,
    max: 5,
    errorMessage: 'Rating must be a whole number from 0 to 5',
  },
  notes: {
    key: 'notes',
    label: 'Notes (max 300 characters, optional)',
    maxLength: 300,
    maxMessage: 'Notes must be at most 300 characters',
  },
  featureCards: [
    {
      title: '🎬 Track what you watch',
      desc: 'Add and organize movies in your private watchlist with custom director, ratings, and notes.',
    },
    {
      title: '🏷️ Sort by status',
      desc: 'Easily organize movies into Plan to Watch, Watching, and Watched with instant filtering.',
    },
    {
      title: '⭐ Rate your favorites',
      desc: 'Star your favorite movies with one tap and filter favorite titles instantly.',
    },
  ],
};
