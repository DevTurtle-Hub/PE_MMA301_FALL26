import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

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
                color={isSelected ? '#0F172A' : '#64748B'}
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
    color: '#334155',
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
    borderColor: '#CBD5E1',
    backgroundColor: '#FFFFFF',
    gap: 4,
  },
  starBtnSelected: {
    backgroundColor: '#F1F5F9',
    borderColor: '#0F172A',
  },
  starText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  starTextSelected: {
    color: '#0F172A',
    fontWeight: '700',
  },
});
