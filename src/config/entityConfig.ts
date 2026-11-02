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

  // TestID names
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

  // Fields
  field1: FieldRule;
  field2: FieldRule;
  category: EnumRule;
  status: EnumRule;
  numeric?: NumericRule;
  notes?: NotesRule;

  // Feature cards for Home screen
  featureCards: { title: string; desc: string }[];
}

export const ENTITY_CONFIG: EntityConfig = {
  collectionName: 'books',
  entitySingular: 'book',
  entityPlural: 'books',
  appName: 'BookShelf',

  homeTitleTestId: 'home-title',
  formTestId: 'book-form',
  formSuccessTestId: 'book-success',
  formSuccessText: 'Book added',
  errorFormTestId: 'error-book',
  itemTestId: 'book-item',
  emptyListTestId: 'books-empty',
  emptyListText: 'No books found',
  countTestId: 'book-count',
  favoriteCountTestId: 'favorite-count',

  field1: {
    key: 'title',
    label: 'Title',
    placeholder: 'Enter title',
    requiredMessage: 'Title is required',
    maxLength: 100,
    maxMessage: 'Title must be at most 100 characters',
  },
  field2: {
    key: 'author',
    label: 'Author',
    placeholder: 'Enter author',
    requiredMessage: 'Author is required',
    maxLength: 60,
    maxMessage: 'Author must be at most 60 characters',
  },
  category: {
    key: 'genre',
    label: 'Genre',
    chooseLabel: 'Choose genre',
    emptyMessage: 'Please choose a genre',
    options: ['Fiction', 'Non-Fiction', 'Academic', 'Other'],
  },
  status: {
    key: 'status',
    label: 'Status',
    chooseLabel: 'Choose status',
    emptyMessage: 'Please choose a status',
    options: ['To Read', 'Reading', 'Finished'],
    priorities: {
      'To Read': 1,
      Reading: 2,
      Finished: 3,
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
      title: '📚 Track your books',
      desc: 'Add and manage books in your private reading collection with custom notes and star ratings.',
    },
    {
      title: '🏷️ Sort by status',
      desc: 'Organize books seamlessly into To Read, Reading, and Finished states with instant filtering.',
    },
    {
      title: '⭐ Rate your favorites',
      desc: 'Star your favorite reads with one tap and filter favorite titles instantly.',
    },
  ],
};
