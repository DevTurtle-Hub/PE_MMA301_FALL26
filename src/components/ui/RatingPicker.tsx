import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

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
  const stars = Array.from({ length: maxStars + 1 }, (_, i) => i);

  return (
    <View style={styles.container}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={styles.row}>
        {stars.map((star) => {
          const isSelected = rating === star;
          return (
            <TouchableOpacity
              key={star}
              style={[styles.starBtn, isSelected && styles.starBtnSelected]}
              onPress={() => onRatingChange(isSelected ? undefined : star)}
            >
              <Text style={[styles.starText, isSelected && styles.starTextSelected]}>
                {star} ★
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
    fontWeight: '600',
    color: '#374151',
    marginBottom: 6,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  starBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#F9FAFB',
  },
  starBtnSelected: {
    backgroundColor: '#F59E0B',
    borderColor: '#F59E0B',
  },
  starText: {
    fontSize: 13,
    color: '#4B5563',
    fontWeight: '500',
  },
  starTextSelected: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});

