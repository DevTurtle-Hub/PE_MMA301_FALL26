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
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  // Watching: Royal Blue blend
  blue: {
    backgroundColor: '#EFF6FF',
    borderColor: '#BFDBFE',
  },
  blueText: {
    color: '#1D4ED8',
  },
  // Watched: Fresh Emerald
  green: {
    backgroundColor: '#ECFDF5',
    borderColor: '#A7F3D0',
  },
  greenText: {
    color: '#047857',
  },
  // Plan to Watch: Soft Amber
  yellow: {
    backgroundColor: '#FEF3C7',
    borderColor: '#FDE68A',
  },
  yellowText: {
    color: '#B45309',
  },
  red: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
  },
  redText: {
    color: '#DC2626',
  },
  purple: {
    backgroundColor: '#F0F9FF',
    borderColor: '#BAE6FD',
  },
  purpleText: {
    color: '#0284C7',
  },
  gray: {
    backgroundColor: '#F1F5F9',
    borderColor: '#E2E8F0',
  },
  grayText: {
    color: '#475569',
  },
});
