import React from 'react';
import { StyleSheet, Text, View, ViewStyle, StyleProp } from 'react-native';

export type BadgeVariant = 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'gray';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  style?: StyleProp<ViewStyle>;
}

export const Badge: React.FC<BadgeProps> = ({ label, variant = 'blue', style }) => {
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
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
  },
  blue: {
    backgroundColor: '#DBEAFE',
  },
  blueText: {
    color: '#1D4ED8',
  },
  green: {
    backgroundColor: '#D1FAE5',
  },
  greenText: {
    color: '#047857',
  },
  yellow: {
    backgroundColor: '#FEF3C7',
  },
  yellowText: {
    color: '#B45309',
  },
  red: {
    backgroundColor: '#FEE2E2',
  },
  redText: {
    color: '#B91C1C',
  },
  purple: {
    backgroundColor: '#EDE9FE',
  },
  purpleText: {
    color: '#6D28D9',
  },
  gray: {
    backgroundColor: '#F3F4F6',
  },
  grayText: {
    color: '#4B5563',
  },
});

