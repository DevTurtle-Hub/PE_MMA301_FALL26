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

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  showError?: boolean;
  helperText?: string;
  containerStyle?: StyleProp<ViewStyle>;
  showCharCount?: boolean;
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
  ...rest
}) => {
  const hasError = !!error && showError;

  return (
    <View style={[styles.container, containerStyle]}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput
        style={[styles.input, hasError && styles.inputError, style]}
        placeholderTextColor="#9CA3AF"
        value={value}
        maxLength={maxLength}
        {...rest}
      />
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
    marginBottom: 14,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.2,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    color: '#111827',
  },
  inputError: {
    borderColor: '#EF4444',
    backgroundColor: '#FEF2F2',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
    minHeight: 18,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    fontWeight: '500',
    flex: 1,
  },
  helperText: {
    color: '#6B7280',
    fontSize: 12,
    flex: 1,
  },
  charCount: {
    fontSize: 11,
    color: '#9CA3AF',
    marginLeft: 8,
  },
});

