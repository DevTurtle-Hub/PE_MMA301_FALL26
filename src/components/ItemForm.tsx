import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { BookFormData, Genre, Status } from '../types';
import { Card, Button, Input } from './ui';
import { ENTITY_CONFIG } from '../config/entityConfig';

export interface ItemFormProps {
  initialValues?: Partial<BookFormData>;
  onSubmit: (data: BookFormData) => Promise<void>;
  onCancel?: () => void;
  submitButtonText?: string;
  isEdit?: boolean;
}

export const ItemForm: React.FC<ItemFormProps> = ({
  initialValues,
  onSubmit,
  onCancel,
  submitButtonText,
  isEdit = false,
}) => {
  const cfg = ENTITY_CONFIG;
  const defaultBtnText = submitButtonText || (isEdit ? 'Save Changes' : `Add ${cfg.entitySingular}`);

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

  // Field 1 validation
  const trimmed1 = title.trim();
  const error1 = !trimmed1
    ? cfg.field1.requiredMessage
    : trimmed1.length > cfg.field1.maxLength
    ? cfg.field1.maxMessage
    : '';

  // Field 2 validation
  const trimmed2 = author.trim();
  const error2 = !trimmed2
    ? cfg.field2.requiredMessage
    : trimmed2.length > cfg.field2.maxLength
    ? cfg.field2.maxMessage
    : '';

  // Category validation
  const catError = !genre || genre === cfg.category.chooseLabel ? cfg.category.emptyMessage : '';

  // Status validation
  const statError = !status || status === cfg.status.chooseLabel ? cfg.status.emptyMessage : '';

  // Numeric validation
  let numError = '';
  if (cfg.numeric && rating.trim() !== '') {
    const num = Number(rating.trim());
    if (!Number.isInteger(num) || num < cfg.numeric.min || num > cfg.numeric.max || isNaN(num)) {
      numError = cfg.numeric.errorMessage;
    }
  }

  // Notes validation
  const notesError =
    cfg.notes && notes.length > cfg.notes.maxLength ? cfg.notes.maxMessage : '';

  const isFormValid =
    !error1 && !error2 && !catError && !statError && !numError && !notesError;

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
        title: trimmed1,
        author: trimmed2,
        genre: genre as Genre,
        status: status as Status,
        ...(rating.trim() !== '' ? { rating: Number(rating.trim()) } : {}),
        ...(notes.trim() ? { notes: notes.trim() } : {}),
      };

      await onSubmit(payload);

      if (!isEdit) {
        setTitle('');
        setAuthor('');
        setGenre('');
        setStatus('');
        setRating('');
        setNotes('');
        setSubmitted(false);
        setSuccessMessage(cfg.formSuccessText);
      }
    } catch (err: any) {
      setFormError(err.message || `Failed to save ${cfg.entitySingular}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card testID={cfg.formTestId} accessibilityLabel={cfg.formTestId} style={styles.card}>
      <Text style={styles.formHeaderTitle}>
        {isEdit ? `Edit ${cfg.entitySingular}` : `Add a ${cfg.entitySingular}`}
      </Text>

      {/* Success Banner */}
      {successMessage ? (
        <View testID={cfg.formSuccessTestId} accessibilityLabel={cfg.formSuccessTestId} style={styles.successBox}>
          <Text style={styles.successText}>{successMessage}</Text>
        </View>
      ) : null}

      {/* Error Banner */}
      {formError ? (
        <View testID={cfg.errorFormTestId} accessibilityLabel={cfg.errorFormTestId} style={styles.errorBox}>
          <Text style={styles.errorText}>{formError}</Text>
        </View>
      ) : null}

      {/* Field 1 */}
      <Input
        label={`${cfg.field1.label} *`}
        placeholder={cfg.field1.placeholder}
        value={title}
        autoCapitalize="none"
        autoCorrect={false}
        onChangeText={(val) => {
          setTitle(val);
          setFormError(null);
          setSuccessMessage(null);
        }}
        error={error1}
        showError={submitted}
        maxLength={cfg.field1.maxLength + 10}
      />

      {/* Field 2 */}
      <Input
        label={`${cfg.field2.label} *`}
        placeholder={cfg.field2.placeholder}
        value={author}
        autoCapitalize="none"
        autoCorrect={false}
        onChangeText={(val) => {
          setAuthor(val);
          setFormError(null);
          setSuccessMessage(null);
        }}
        error={error2}
        showError={submitted}
        maxLength={cfg.field2.maxLength + 10}
      />

      {/* Category Picker */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>{cfg.category.label} *</Text>
        <View style={styles.optionsRow}>
          {[cfg.category.chooseLabel, ...cfg.category.options].map((g) => {
            const isSelected = genre === g || (!genre && g === cfg.category.chooseLabel);
            return (
              <TouchableOpacity
                key={g}
                style={[
                  styles.optionChip,
                  isSelected && styles.optionChipSelected,
                  g === cfg.category.chooseLabel && styles.optionChipEmpty,
                ]}
                onPress={() => {
                  setGenre(g === cfg.category.chooseLabel ? '' : g);
                  setFormError(null);
                  setSuccessMessage(null);
                }}
              >
                <Text
                  style={[
                    styles.optionText,
                    isSelected && styles.optionTextSelected,
                    g === cfg.category.chooseLabel && styles.optionTextEmpty,
                  ]}
                >
                  {g}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
        {submitted && catError ? <Text style={styles.inlineError}>{catError}</Text> : null}
      </View>

      {/* Status Picker */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>{cfg.status.label} *</Text>
        <View style={styles.optionsRow}>
          {[cfg.status.chooseLabel, ...cfg.status.options].map((s) => {
            const isSelected = status === s || (!status && s === cfg.status.chooseLabel);
            return (
              <TouchableOpacity
                key={s}
                style={[
                  styles.optionChip,
                  isSelected && styles.optionChipSelected,
                  s === cfg.status.chooseLabel && styles.optionChipEmpty,
                ]}
                onPress={() => {
                  setStatus(s === cfg.status.chooseLabel ? '' : s);
                  setFormError(null);
                  setSuccessMessage(null);
                }}
              >
                <Text
                  style={[
                    styles.optionText,
                    isSelected && styles.optionTextSelected,
                    s === cfg.status.chooseLabel && styles.optionTextEmpty,
                  ]}
                >
                  {s}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
        {submitted && statError ? <Text style={styles.inlineError}>{statError}</Text> : null}
      </View>

      {/* Numeric Field */}
      {cfg.numeric ? (
        <Input
          label={cfg.numeric.label}
          placeholder={`e.g. ${cfg.numeric.max}`}
          keyboardType="numeric"
          value={rating}
          onChangeText={(val) => {
            setRating(val);
            setFormError(null);
            setSuccessMessage(null);
          }}
          error={numError}
          showError={submitted}
        />
      ) : null}

      {/* Notes Field */}
      {cfg.notes ? (
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>{cfg.notes.label}</Text>
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
            maxLength={cfg.notes.maxLength + 50}
          />
          <View style={styles.notesFooter}>
            {submitted && notesError ? (
              <Text style={styles.inlineError}>{notesError}</Text>
            ) : (
              <View style={{ flex: 1 }} />
            )}
            <Text style={styles.charCount}>
              {notes.length}/{cfg.notes.maxLength}
            </Text>
          </View>
        </View>
      ) : null}

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
          title={defaultBtnText}
          onPress={handleSubmit}
          loading={submitting}
          variant="primary"
          style={styles.submitBtn}
        />
      </View>
    </Card>
  );
};

// Alias for backward compatibility
export const BookForm = ItemForm;

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

