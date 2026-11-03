import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  StyleProp,
  View,
} from 'react-native';
import { THEME } from '../../config/theme';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost' | 'accent';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  loading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  icon?: React.ReactNode;
  size?: 'sm' | 'md';
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  style,
  textStyle,
  icon,
  size = 'md',
}) => {
  const isActionDisabled = disabled || loading;

  const getLoaderColor = () => {
    if (variant === 'accent') return THEME.primary;
    if (variant === 'outline' || variant === 'ghost') return THEME.primary;
    return THEME.textInverse;
  };

  return (
    <TouchableOpacity
      activeOpacity={0.75}
      style={[
        styles.base,
        size === 'sm' ? styles.sizeSm : styles.sizeMd,
        styles[variant],
        isActionDisabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={isActionDisabled}
    >
      {loading ? (
        <ActivityIndicator size="small" color={getLoaderColor()} />
      ) : (
        <View style={styles.contentRow}>
          {icon ? <View style={styles.iconContainer}>{icon}</View> : null}
          <Text
            style={[
              styles.baseText,
              size === 'sm' && styles.textSm,
              styles[`${variant}Text`],
              textStyle,
            ]}
          >
            {title}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sizeSm: {
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  sizeMd: {
    paddingVertical: 9,
    paddingHorizontal: 14,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    marginRight: 6,
  },
  // Color 1: Midnight Slate
  primary: {
    backgroundColor: THEME.primary,
    borderWidth: 1,
    borderColor: THEME.primary,
  },
  // Color 2: Cinematic Amber Gold
  accent: {
    backgroundColor: THEME.accent,
    borderWidth: 1,
    borderColor: THEME.accentDark,
  },
  secondary: {
    backgroundColor: THEME.primaryLight,
    borderWidth: 1,
    borderColor: THEME.primaryLight,
  },
  danger: {
    backgroundColor: THEME.danger,
    borderWidth: 1,
    borderColor: THEME.danger,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.2,
    borderColor: THEME.primary,
  },
  ghost: {
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
  disabled: {
    opacity: 0.45,
  },
  baseText: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  textSm: {
    fontSize: 12,
  },
  primaryText: {
    color: THEME.textInverse,
  },
  accentText: {
    color: THEME.primary,
  },
  secondaryText: {
    color: THEME.textInverse,
  },
  dangerText: {
    color: THEME.textInverse,
  },
  outlineText: {
    color: THEME.primary,
  },
  ghostText: {
    color: THEME.textPrimary,
  },
});
