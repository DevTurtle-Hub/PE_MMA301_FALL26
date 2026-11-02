import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { BookFormData, GENRES, Genre, STATUSES, Status } from '../types';
import { Card, Button, Input } from './ui';

interface BookFormProps {
  initialValues?: Partial<BookFormData>;
  onSubmit: (data: BookFormData) => Promise<void>;
  onCancel?: () => void;
  submitButtonText?: string;
  isEdit?: boolean;
}

export const BookForm: React.FC<BookFormProps> = ({
  initialValues,
  onSubmit,
  onCancel,
  submitButtonText = 'Add Book',
  isEdit = false,
}) => {
  const [title, setTitle] = useState(initialValues?.title || '');
  const [author, setAuthor] = useState(initialValues?.author || '');
  const [genre, setGenre] = useState<string>(initialValues?.genre || '');
  const [status, setStatus] = useState<string>(initialValues?.status || '');
  const [rating, setRating] = useState<string>(
    initialValues?.rating !== undefined ? String(initialValues.rating) : ''
  );
  const [notes, setNotes] = useState(initialValues?.notes || '');

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  // Exact validation rules from exam document:
  // Title: empty or spaces only / longer than 100
  const trimmedTitle = title.trim();
  const titleError = !trimmedTitle
    ? 'Title is required'
    : trimmedTitle.length > 100
    ? 'Title must be at most 100 characters'
    : '';

  // Author: empty or spaces only / longer than 60
  const trimmedAuthor = author.trim();
  const authorError = !trimmedAuthor
    ? 'Author is required'
    : trimmedAuthor.length > 60
    ? 'Author must be at most 60 characters'
    : '';

  // Genre: nothing chosen
  const genreError = !genre || genre === 'Choose genre' ? 'Please choose a genre' : '';

  // Status: nothing chosen
  const statusError = !status || status === 'Choose status' ? 'Please choose a status' : '';

  // Rating: only if filled in: not a whole number from 0 to 5
  let ratingError = '';
  if (rating.trim() !== '') {
    const num = Number(rating.trim());
    if (!Number.isInteger(num) || num < 0 || num > 5 || isNaN(num)) {
      ratingError = 'Rating must be a whole number from 0 to 5';
    }
  }

  // Notes: longer than 300
  const notesError = notes.length > 300 ? 'Notes must be at most 300 characters' : '';

  const isFormValid =
    !titleError && !authorError && !genreError && !statusError && !ratingError && !notesError;

  const handleSubmit = async () => {
    setSubmitted(true);
    setSuccessMessage(null);
    setFormError(null);

    if (!isFormValid) {
      return;
    }

    setSubmitting(true);
    try {
      const payload: BookFormData = {
        title: trimmedTitle,
        author: trimmedAuthor,
        genre: genre as Genre,
        status: status as Status,
        ...(rating.trim() !== '' ? { rating: Number(rating.trim()) } : {}),
        ...(notes.trim() ? { notes: notes.trim() } : {}),
      };

      await onSubmit(payload);

      if (!isEdit) {
        // Requirement: "the form is cleared, and book-success shows Book added"
        setTitle('');
        setAuthor('');
        setGenre('');
        setStatus('');
        setRating('');
        setNotes('');
        setSubmitted(false);
        setSuccessMessage('Book added');
      }
    } catch (err: any) {
      setFormError(err.message || 'Failed to save book');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card testID="book-form" accessibilityLabel="book-form" style={styles.card}>
      <Text style={styles.formHeaderTitle}>{isEdit ? 'Edit Book' : 'Add a Book'}</Text>

      {/* Requirement: "and book-success shows Book added" */}
      {successMessage ? (
        <View testID="book-success" accessibilityLabel="book-success" style={styles.successBox}>
          <Text style={styles.successText}>{successMessage}</Text>
        </View>
      ) : null}

      {/* Requirement: "If Firestore returns an error ... show it in error-book" */}
      {formError ? (
        <View testID="error-book" accessibilityLabel="error-book" style={styles.errorBox}>
          <Text style={styles.errorText}>{formError}</Text>
        </View>
      ) : null}

      {/* Title */}
      <Input
        label="Title *"
        placeholder="Enter title"
        value={title}
        autoCapitalize="none"
        autoCorrect={false}
        onChangeText={(val) => {
          setTitle(val);
          setFormError(null);
          setSuccessMessage(null);
        }}
        error={titleError}
        showError={submitted}
        maxLength={110}
      />

      {/* Author */}
      <Input
        label="Author *"
        placeholder="Enter author"
        value={author}
        autoCapitalize="none"
        autoCorrect={false}
        onChangeText={(val) => {
          setAuthor(val);
          setFormError(null);
          setSuccessMessage(null);
        }}
        error={authorError}
        showError={submitted}
        maxLength={70}
      />

      {/* Genre Picker (first choice "Choose genre", then Fiction, Non-Fiction, Academic, Other) */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Genre *</Text>
        <View style={styles.optionsRow}>
          {['Choose genre', ...GENRES].map((g) => {
            const isSelected = genre === g || (!genre && g === 'Choose genre');
            return (
              <TouchableOpacity
                key={g}
                style={[
                  styles.optionChip,
                  isSelected && styles.optionChipSelected,
                  g === 'Choose genre' && styles.optionChipEmpty,
                ]}
                onPress={() => {
                  setGenre(g === 'Choose genre' ? '' : g);
                  setFormError(null);
                  setSuccessMessage(null);
                }}
              >
                <Text
                  style={[
                    styles.optionText,
                    isSelected && styles.optionTextSelected,
                    g === 'Choose genre' && styles.optionTextEmpty,
                  ]}
                >
                  {g}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
        {submitted && genreError ? <Text style={styles.inlineError}>{genreError}</Text> : null}
      </View>

      {/* Status Picker (first choice "Choose status", then To Read, Reading, Finished) */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Status *</Text>
        <View style={styles.optionsRow}>
          {['Choose status', ...STATUSES].map((s) => {
            const isSelected = status === s || (!status && s === 'Choose status');
            return (
              <TouchableOpacity
                key={s}
                style={[
                  styles.optionChip,
                  isSelected && styles.optionChipSelected,
                  s === 'Choose status' && styles.optionChipEmpty,
                ]}
                onPress={() => {
                  setStatus(s === 'Choose status' ? '' : s);
                  setFormError(null);
                  setSuccessMessage(null);
                }}
              >
                <Text
                  style={[
                    styles.optionText,
                    isSelected && styles.optionTextSelected,
                    s === 'Choose status' && styles.optionTextEmpty,
                  ]}
                >
                  {s}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
        {submitted && statusError ? <Text style={styles.inlineError}>{statusError}</Text> : null}
      </View>

      {/* Rating (optional 0-5) */}
      <Input
        label="Rating (0 - 5, optional)"
        placeholder="e.g. 5"
        keyboardType="numeric"
        value={rating}
        onChangeText={(val) => {
          setRating(val);
          setFormError(null);
          setSuccessMessage(null);
        }}
        error={ratingError}
        showError={submitted}
      />

      {/* Notes (optional, max 300) */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Notes (max 300 characters, optional)</Text>
        <TextInput
          style={[styles.textArea, submitted && !!notesError && styles.textAreaError]}
          placeholder="Personal notes..."
          placeholderTextColor="#9CA3AF"
          multiline
          numberOfLines={3}
          value={notes}
          onChangeText={(val) => {
            setNotes(val);
            setFormError(null);
            setSuccessMessage(null);
          }}
          maxLength={350}
        />
        <View style={styles.notesFooter}>
          {submitted && notesError ? (
            <Text style={styles.inlineError}>{notesError}</Text>
          ) : (
            <View style={{ flex: 1 }} />
          )}
          <Text style={styles.charCount}>{notes.length}/300</Text>
        </View>
      </View>

      <View style={styles.buttonRow}>
        {onCancel ? (
          <Button
            title="Cancel"
            onPress={onCancel}
            variant="outline"
            style={styles.cancelBtn}
            disabled={submitting}
          />
        ) : null}
        <Button
          title={submitButtonText}
          onPress={handleSubmit}
          loading={submitting}
          variant="primary"
          style={styles.submitBtn}
        />
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 18,
    marginBottom: 16,
  },
  formHeaderTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 14,
  },
  successBox: {
    backgroundColor: '#DEF7EC',
    borderColor: '#31C48D',
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    marginBottom: 14,
  },
  successText: {
    color: '#03543F',
    fontWeight: '700',
    fontSize: 14,
    textAlign: 'center',
  },
  errorBox: {
    backgroundColor: '#FDE8E8',
    borderColor: '#F98080',
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    marginBottom: 14,
  },
  errorText: {
    color: '#9B1C1C',
    fontWeight: '600',
    fontSize: 13,
    textAlign: 'center',
  },
  fieldContainer: {
    marginBottom: 14,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 6,
  },
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  optionChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#F9FAFB',
  },
  optionChipSelected: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  optionChipEmpty: {
    borderStyle: 'dashed',
  },
  optionText: {
    fontSize: 12,
    color: '#4B5563',
    fontWeight: '500',
  },
  optionTextSelected: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  optionTextEmpty: {
    color: '#6B7280',
    fontStyle: 'italic',
  },
  inlineError: {
    color: '#EF4444',
    fontSize: 12,
    fontWeight: '500',
    marginTop: 4,
  },
  textArea: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.2,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    color: '#111827',
    minHeight: 65,
    textAlignVertical: 'top',
  },
  textAreaError: {
    borderColor: '#EF4444',
    backgroundColor: '#FEF2F2',
  },
  notesFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  charCount: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
  },
  cancelBtn: {
    flex: 1,
  },
  submitBtn: {
    flex: 2,
  },
});
