import React from 'react';
import { StyleSheet, Text, View, ViewStyle, StyleProp } from 'react-native';

export type BadgeVariant = 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'gray';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  style?: StyleProp<ViewStyle>;
}

export const Badge: React.FC<BadgeProps> = ({ label, variant = 'gray', style }) => {
  return (
    <View style={[styles.badge, styles[variant], style]}>
      <Text style={[styles.text, styles[`${variant}Text`]]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  // Sleek minimalist neutral monochrome styling
  blue: {
    backgroundColor: '#F1F5F9',
    borderColor: '#CBD5E1',
  },
  blueText: {
    color: '#1E293B',
  },
  green: {
    backgroundColor: '#F8FAFC',
    borderColor: '#0F172A',
  },
  greenText: {
    color: '#0F172A',
  },
  yellow: {
    backgroundColor: '#F8FAFC',
    borderColor: '#CBD5E1',
  },
  yellowText: {
    color: '#334155',
  },
  red: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
  },
  redText: {
    color: '#991B1B',
  },
  purple: {
    backgroundColor: '#F1F5F9',
    borderColor: '#CBD5E1',
  },
  purpleText: {
    color: '#334155',
  },
  gray: {
    backgroundColor: '#F1F5F9',
    borderColor: '#E2E8F0',
  },
  grayText: {
    color: '#475569',
  },
});
