import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BookFormData, Genre, Status } from '../types';
import { Card, Button, Input } from './ui';
import { ENTITY_CONFIG } from '../config/entityConfig';
import { THEME } from '../config/theme';

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
  const [author, setAuthor] = useState(
    initialValues?.director || initialValues?.author || ''
  );
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
        director: trimmed2,
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
      <View style={styles.cardHeaderRow}>
        <View style={styles.iconBox}>
          <Ionicons
            name={isEdit ? 'create' : 'film'}
            size={14}
            color={THEME.accent}
          />
        </View>
        <Text style={styles.formHeaderTitle}>
          {isEdit ? `Edit ${cfg.entitySingular}` : `Add a ${cfg.entitySingular}`}
        </Text>
      </View>

      {/* Success Banner */}
      {successMessage ? (
        <View
          testID={cfg.formSuccessTestId}
          accessibilityLabel={cfg.formSuccessTestId}
          style={styles.successBox}
        >
          <Ionicons name="checkmark-circle" size={15} color={THEME.accentDark} style={{ marginRight: 6 }} />
          <Text style={styles.successText}>{successMessage}</Text>
        </View>
      ) : null}

      {/* Error Banner */}
      {formError ? (
        <View
          testID={cfg.errorFormTestId}
          accessibilityLabel={cfg.errorFormTestId}
          style={styles.errorBox}
        >
          <Ionicons name="alert-circle" size={15} color={THEME.danger} style={{ marginRight: 6 }} />
          <Text style={styles.errorText}>{formError}</Text>
        </View>
      ) : null}

      {/* Field 1: Title */}
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
        leftIcon={<Ionicons name="film-outline" size={14} color={THEME.accentDark} />}
      />

      {/* Field 2: Director */}
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
        leftIcon={<Ionicons name="person-outline" size={14} color={THEME.accentDark} />}
      />

      {/* Category / Genre Picker */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>{cfg.category.label} *</Text>
        <View style={styles.optionsRow}>
          {[cfg.category.chooseLabel, ...cfg.category.options].map((g) => {
            const isSelected = genre === g || (!genre && g === cfg.category.chooseLabel);
            return (
              <TouchableOpacity
                key={g}
                activeOpacity={0.7}
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
                activeOpacity={0.7}
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

      {/* Rating (1-5) */}
      {cfg.numeric ? (
        <Input
          label={cfg.numeric.label}
          placeholder={`e.g. 1 to ${cfg.numeric.max}`}
          keyboardType="numeric"
          value={rating}
          onChangeText={(val) => {
            setRating(val);
            setFormError(null);
            setSuccessMessage(null);
          }}
          error={numError}
          showError={submitted}
          leftIcon={<Ionicons name="star" size={14} color={THEME.accent} />}
        />
      ) : null}

      {/* Notes Field */}
      {cfg.notes ? (
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>{cfg.notes.label}</Text>
          <TextInput
            style={[styles.textArea, submitted && !!notesError && styles.textAreaError]}
            placeholder="Movie thoughts, review, or watchlist notes..."
            placeholderTextColor={THEME.textMuted}
            multiline
            numberOfLines={2}
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
            size="sm"
            style={styles.cancelBtn}
            disabled={submitting}
          />
        ) : null}
        <Button
          title={defaultBtnText}
          onPress={handleSubmit}
          loading={submitting}
          variant="primary"
          size="sm"
          icon={<Ionicons name="checkmark" size={14} color={THEME.accent} />}
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
    padding: 12,
    marginBottom: 12,
    borderColor: THEME.border,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  iconBox: {
    width: 22,
    height: 22,
    borderRadius: 4,
    backgroundColor: THEME.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  formHeaderTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: THEME.primary,
  },
  successBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.accentLight,
    borderColor: THEME.accent,
    borderWidth: 1,
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderRadius: 6,
    marginBottom: 10,
  },
  successText: {
    color: THEME.accentText,
    fontWeight: '700',
    fontSize: 12,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.dangerBg,
    borderColor: THEME.dangerBorder,
    borderWidth: 1,
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderRadius: 6,
    marginBottom: 10,
  },
  errorText: {
    color: THEME.danger,
    fontWeight: '600',
    fontSize: 12,
  },
  fieldContainer: {
    marginBottom: 10,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: THEME.textPrimary,
    marginBottom: 4,
  },
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
  },
  optionChip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: THEME.borderStrong,
    backgroundColor: THEME.card,
  },
  optionChipSelected: {
    backgroundColor: THEME.primary,
    borderColor: THEME.accent,
  },
  optionChipEmpty: {
    borderStyle: 'dashed',
  },
  optionText: {
    fontSize: 11,
    color: THEME.textSecondary,
    fontWeight: '500',
  },
  optionTextSelected: {
    color: THEME.accent,
    fontWeight: '700',
  },
  optionTextEmpty: {
    color: THEME.textMuted,
  },
  inlineError: {
    fontSize: 11,
    color: THEME.danger,
    marginTop: 3,
  },
  textArea: {
    borderWidth: 1,
    borderColor: THEME.borderStrong,
    borderRadius: 6,
    backgroundColor: THEME.card,
    paddingHorizontal: 10,
    paddingVertical: 6,
    fontSize: 13,
    color: THEME.textPrimary,
    minHeight: 52,
    textAlignVertical: 'top',
  },
  textAreaError: {
    borderColor: THEME.danger,
    backgroundColor: THEME.dangerBg,
  },
  notesFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  charCount: {
    fontSize: 10,
    color: THEME.textMuted,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 4,
  },
  cancelBtn: {
    minWidth: 80,
  },
  submitBtn: {
    minWidth: 100,
  },
});
