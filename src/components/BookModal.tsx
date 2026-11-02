import React, { useState } from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Book, BookFormData, GENRES, Genre, STATUSES, Status } from '../types';

interface BookFormContentProps {
  bookToEdit?: Book | null;
  onClose: () => void;
  onSubmit: (data: BookFormData) => Promise<void>;
}

const BookFormContent: React.FC<BookFormContentProps> = ({
  bookToEdit,
  onClose,
  onSubmit,
}) => {
  const [title, setTitle] = useState(bookToEdit?.title || '');
  const [author, setAuthor] = useState(bookToEdit?.author || '');
  const [genre, setGenre] = useState<Genre>(bookToEdit?.genre || 'Fiction');
  const [status, setStatus] = useState<Status>(bookToEdit?.status || 'To Read');
  const [rating, setRating] = useState<number | undefined>(bookToEdit?.rating);
  const [notes, setNotes] = useState(bookToEdit?.notes || '');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    const trimmedTitle = title.trim();
    const trimmedAuthor = author.trim();

    if (!trimmedTitle || trimmedTitle.length > 100) {
      Alert.alert('Validation Error', 'Title is required and must be 1-100 characters.');
      return;
    }

    if (!trimmedAuthor || trimmedAuthor.length > 60) {
      Alert.alert('Validation Error', 'Author is required and must be 1-60 characters.');
      return;
    }

    if (rating !== undefined && (!Number.isInteger(rating) || rating < 0 || rating > 5)) {
      Alert.alert('Validation Error', 'Rating must be an integer between 0 and 5.');
      return;
    }

    if (notes.trim().length > 300) {
      Alert.alert('Validation Error', 'Notes cannot exceed 300 characters.');
      return;
    }

    const formData: BookFormData = {
      title: trimmedTitle,
      author: trimmedAuthor,
      genre,
      status,
      ...(rating !== undefined ? { rating } : {}),
      ...(notes.trim() ? { notes: notes.trim() } : {}),
    };

    setLoading(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to save book.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.modalContent}>
      <Text style={styles.modalTitle}>{bookToEdit ? 'Edit Book' : 'Add New Book'}</Text>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Title */}
        <View style={styles.field}>
          <Text style={styles.label}>Title (max 100 chars) *</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            maxLength={100}
            placeholder="Book title..."
          />
        </View>

        {/* Author */}
        <View style={styles.field}>
          <Text style={styles.label}>Author (max 60 chars) *</Text>
          <TextInput
            style={styles.input}
            value={author}
            onChangeText={setAuthor}
            maxLength={60}
            placeholder="Author name..."
          />
        </View>

        {/* Genre */}
        <View style={styles.field}>
          <Text style={styles.label}>Genre *</Text>
          <View style={styles.tagGroup}>
            {GENRES.map((g) => (
              <TouchableOpacity
                key={g}
                style={[styles.tag, genre === g && styles.tagSelected]}
                onPress={() => setGenre(g)}
              >
                <Text style={[styles.tagText, genre === g && styles.tagTextSelected]}>
                  {g}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Status */}
        <View style={styles.field}>
          <Text style={styles.label}>Status *</Text>
          <View style={styles.tagGroup}>
            {STATUSES.map((s) => (
              <TouchableOpacity
                key={s}
                style={[styles.tag, status === s && styles.tagSelected]}
                onPress={() => setStatus(s)}
              >
                <Text style={[styles.tagText, status === s && styles.tagTextSelected]}>
                  {s}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Rating */}
        <View style={styles.field}>
          <Text style={styles.label}>Rating (0 - 5 stars, optional)</Text>
          <View style={styles.tagGroup}>
            {[0, 1, 2, 3, 4, 5].map((r) => (
              <TouchableOpacity
                key={r}
                style={[styles.tag, rating === r && styles.tagSelected]}
                onPress={() => setRating(rating === r ? undefined : r)}
              >
                <Text style={[styles.tagText, rating === r && styles.tagTextSelected]}>
                  {r} ★
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Notes */}
        <View style={styles.field}>
          <Text style={styles.label}>Notes (max 300 chars, optional)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={notes}
            onChangeText={setNotes}
            maxLength={300}
            multiline
            numberOfLines={3}
            placeholder="Personal notes..."
          />
          <Text style={styles.charCount}>{notes.length}/300</Text>
        </View>
      </ScrollView>

      <View style={styles.actionRow}>
        <TouchableOpacity style={styles.cancelButton} onPress={onClose} disabled={loading}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.saveButton, loading && styles.buttonDisabled]}
          onPress={handleSave}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.saveButtonText}>{bookToEdit ? 'Save Changes' : 'Create'}</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

interface BookModalProps {
  visible: boolean;
  bookToEdit?: Book | null;
  onClose: () => void;
  onSubmit: (data: BookFormData) => Promise<void>;
}

export const BookModal: React.FC<BookModalProps> = ({
  visible,
  bookToEdit,
  onClose,
  onSubmit,
}) => {
  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        {visible ? (
          <BookFormContent
            key={bookToEdit ? bookToEdit.id || 'edit' : 'create'}
            bookToEdit={bookToEdit}
            onClose={onClose}
            onSubmit={onSubmit}
          />
        ) : null}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 16,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    maxHeight: '85%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  field: {
    marginBottom: 14,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    color: '#111827',
  },
  textArea: {
    height: 70,
    textAlignVertical: 'top',
  },
  charCount: {
    fontSize: 11,
    color: '#9CA3AF',
    textAlign: 'right',
    marginTop: 2,
  },
  tagGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#F9FAFB',
  },
  tagSelected: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  tagText: {
    fontSize: 13,
    color: '#4B5563',
  },
  tagTextSelected: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 12,
  },
  cancelButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  cancelButtonText: {
    color: '#4B5563',
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 8,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});
