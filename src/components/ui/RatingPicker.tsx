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
              activeOpacity={0.7}
              style={[styles.starBtn, isSelected && styles.starBtnSelected]}
              onPress={() => onRatingChange(rating === star ? undefined : star)}
            >
              <Ionicons
                name={isSelected ? 'star' : 'star-outline'}
                size={14}
                color={isSelected ? THEME.primary : THEME.textMuted}
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
    marginBottom: 10,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: THEME.textPrimary,
    marginBottom: 4,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  starBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: THEME.borderStrong,
    backgroundColor: THEME.card,
    gap: 4,
  },
  starBtnSelected: {
    backgroundColor: THEME.accent,
    borderColor: THEME.accentDark,
  },
  starText: {
    fontSize: 12,
    color: THEME.textSecondary,
    fontWeight: '600',
  },
  starTextSelected: {
    color: THEME.primary,
    fontWeight: '800',
  },
});
