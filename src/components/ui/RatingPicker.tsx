import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../../config/theme';

interface RatingPickerProps {
  rating?: number;
  onRatingChange: (rating: number | undefined) => void;
  maxStars?: number;
  label?: string;
}

export const RatingPicker: React.FC<RatingPickerProps> = ({
  rating,
  onRatingChange,
  maxStars = 5,
  label,
}) => {
  const stars = Array.from({ length: maxStars }, (_, i) => i + 1);

  return (
    <View style={styles.container}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={styles.row}>
        {stars.map((star) => {
          const isSelected = rating !== undefined && star <= rating;
          return (
            <TouchableOpacity
              key={star}
              activeOpacity={0.75}
              style={[styles.starBtn, isSelected && styles.starBtnSelected]}
              onPress={() => onRatingChange(rating === star ? undefined : star)}
            >
              <Ionicons
                name={isSelected ? 'star' : 'star-outline'}
                size={16}
                color={isSelected ? THEME.accentDark : THEME.textMuted}
              />
              <Text style={[styles.starText, isSelected && styles.starTextSelected]}>
                {star}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 14,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: THEME.textPrimary,
    marginBottom: 6,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  starBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1.2,
    borderColor: THEME.borderStrong,
    backgroundColor: THEME.card,
    gap: 6,
  },
  starBtnSelected: {
    backgroundColor: THEME.accentLight,
    borderColor: THEME.accent,
  },
  starText: {
    fontSize: 13,
    color: THEME.textSecondary,
    fontWeight: '600',
  },
  starTextSelected: {
    color: THEME.accentText,
    fontWeight: '800',
  },
});
