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
    if (variant === 'outline' || variant === 'ghost') return THEME.primary;
    if (variant === 'accent') return THEME.textInverse;
    return THEME.textInverse;
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
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
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sizeSm: {
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  sizeMd: {
    paddingVertical: 12,
    paddingHorizontal: 18,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    marginRight: 8,
  },
  // Color 1: Royal Blue
  primary: {
    backgroundColor: THEME.primary,
    borderWidth: 1,
    borderColor: THEME.primaryDark,
    shadowColor: THEME.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  // Color 2: Sky Blue
  secondary: {
    backgroundColor: THEME.secondary,
    borderWidth: 1,
    borderColor: THEME.secondaryDark,
  },
  accent: {
    backgroundColor: THEME.accent,
    borderWidth: 1,
    borderColor: THEME.accentDark,
    shadowColor: THEME.accent,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  danger: {
    backgroundColor: THEME.danger,
    borderWidth: 1,
    borderColor: THEME.danger,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: THEME.primary,
  },
  ghost: {
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
  disabled: {
    opacity: 0.5,
    elevation: 0,
    shadowOpacity: 0,
  },
  baseText: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  textSm: {
    fontSize: 13,
  },
  primaryText: {
    color: THEME.textInverse,
  },
  secondaryText: {
    color: THEME.textInverse,
  },
  accentText: {
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
