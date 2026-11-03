import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TextInputProps,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { THEME } from '../../config/theme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  showError?: boolean;
  helperText?: string;
  containerStyle?: StyleProp<ViewStyle>;
  showCharCount?: boolean;
  leftIcon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  showError = true,
  helperText,
  containerStyle,
  showCharCount = false,
  maxLength,
  value,
  style,
  leftIcon,
  ...rest
}) => {
  const hasError = !!error && showError;

  return (
    <View style={[styles.container, containerStyle]}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={[styles.inputWrapper, hasError && styles.inputWrapperError]}>
        {leftIcon ? <View style={styles.iconBox}>{leftIcon}</View> : null}
        <TextInput
          style={[styles.input, style]}
          placeholderTextColor={THEME.textMuted}
          value={value}
          maxLength={maxLength}
          {...rest}
        />
      </View>
      <View style={styles.footerRow}>
        {hasError ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : helperText ? (
          <Text style={styles.helperText}>{helperText}</Text>
        ) : (
          <View style={{ flex: 1 }} />
        )}

        {showCharCount && maxLength ? (
          <Text style={styles.charCount}>
            {(value || '').length}/{maxLength}
          </Text>
        ) : null}
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
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: THEME.borderStrong,
    borderRadius: 6,
    backgroundColor: THEME.card,
    paddingHorizontal: 10,
  },
  inputWrapperError: {
    borderColor: THEME.danger,
    backgroundColor: THEME.dangerBg,
  },
  iconBox: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 7,
    fontSize: 13,
    color: THEME.textPrimary,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: 3,
    minHeight: 14,
  },
  errorText: {
    flex: 1,
    fontSize: 11,
    color: THEME.danger,
    fontWeight: '500',
  },
  helperText: {
    flex: 1,
    fontSize: 11,
    color: THEME.textSecondary,
  },
  charCount: {
    fontSize: 11,
    color: THEME.textMuted,
    marginLeft: 8,
  },
});
