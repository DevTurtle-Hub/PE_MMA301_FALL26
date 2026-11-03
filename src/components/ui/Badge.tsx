import React from 'react';
import { StyleSheet, Text, View, ViewStyle, StyleProp } from 'react-native';
import { THEME } from '../../config/theme';

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
    paddingVertical: 2.5,
    borderRadius: 4,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  // Duo-tone Cinema Palette variants
  // Completed / Green: Slate base with Amber Gold accent
  green: {
    backgroundColor: THEME.primary,
    borderColor: THEME.accent,
  },
  greenText: {
    color: THEME.accent,
  },
  // Watching / Blue: Warm amber tint with amber text
  blue: {
    backgroundColor: THEME.accentLight,
    borderColor: THEME.accent,
  },
  blueText: {
    color: THEME.accentText,
  },
  // Plan to Watch / Yellow: Subtle slate with slate text
  yellow: {
    backgroundColor: THEME.surfaceSubtle,
    borderColor: THEME.borderStrong,
  },
  yellowText: {
    color: THEME.primary,
  },
  red: {
    backgroundColor: THEME.dangerBg,
    borderColor: THEME.dangerBorder,
  },
  redText: {
    color: THEME.danger,
  },
  purple: {
    backgroundColor: THEME.accentLight,
    borderColor: THEME.borderStrong,
  },
  purpleText: {
    color: THEME.accentText,
  },
  gray: {
    backgroundColor: THEME.surfaceSubtle,
    borderColor: THEME.border,
  },
  grayText: {
    color: THEME.textSecondary,
  },
});
