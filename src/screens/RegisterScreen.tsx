import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { NavigationProp } from '../navigation/types';
import { useAuth } from '../context/AuthContext';
import { Card, Button, Input } from '../components/ui';
import { ENTITY_CONFIG } from '../config/entityConfig';
import { THEME } from '../config/theme';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const RegisterScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<'Register'>>();
  const { register, loading, error: contextError, clearError } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Field validations (exact exam messages)
  const trimmedEmail = email.trim();
  const emailError = !trimmedEmail
    ? 'Email is required'
    : !EMAIL_REGEX.test(trimmedEmail)
    ? 'Please enter a valid email address'
    : '';

  const passwordError = !password
    ? 'Password is required'
    : password.length < 6
    ? 'Password must be at least 6 characters'
    : '';

  const confirmError = !confirmPassword
    ? 'Confirm Password is required'
    : confirmPassword !== password
    ? 'Passwords do not match'
    : '';

  const isFormValid = !emailError && !passwordError && !confirmError;

  const handleRegister = async () => {
    setSubmitted(true);
    setAuthError(null);
    setSuccessMessage(null);
    if (contextError) clearError();

    if (!isFormValid) {
      return;
    }

    setSubmitting(true);
    try {
      await register(trimmedEmail, password);
      setSuccessMessage('Registration successful');
      setSubmitted(false);
    } catch (err: any) {
      let message = err.message || 'Registration failed.';
      if (err.code === 'auth/email-already-in-use') {
        message = 'This email address is already in use.';
      } else if (err.code === 'auth/invalid-email') {
        message = 'The email address is badly formatted.';
      } else if (err.code === 'auth/weak-password') {
        message = 'Password is too weak.';
      }
      setAuthError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <View style={styles.topNavRow}>
            <TouchableOpacity
              onPress={() => navigation.navigate('Home')}
              style={styles.backBtn}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name="arrow-back" size={16} color={THEME.primary} />
              <Text style={styles.backBtnText}>Home</Text>
            </TouchableOpacity>
          </View>

          <Card style={styles.card}>
            <View style={styles.headerBox}>
              <View style={styles.logoBadge}>
                <Ionicons name="film" size={20} color={THEME.accent} />
              </View>
              <Text style={styles.appName}>{ENTITY_CONFIG.appName}</Text>
              <Text style={styles.title}>Create Account</Text>
              <Text style={styles.subtitle}>Sign up to curate your cinema watchlist</Text>
            </View>

            {/* Requirement: form-success */}
            {successMessage ? (
              <View testID="form-success" accessibilityLabel="form-success" style={styles.successBox}>
                <Ionicons name="checkmark-circle" size={14} color={THEME.accentDark} style={{ marginRight: 6 }} />
                <Text style={styles.successText}>{successMessage}</Text>
              </View>
            ) : null}

            {/* Requirement: error-auth */}
            {authError || contextError ? (
              <View testID="error-auth" accessibilityLabel="error-auth" style={styles.errorAuthBox}>
                <Ionicons name="alert-circle" size={14} color={THEME.danger} style={{ marginRight: 6 }} />
                <Text style={styles.errorAuthText}>{authError || contextError}</Text>
              </View>
            ) : null}

            {/* Input Email */}
            <Input
              label="Email"
              placeholder="example@domain.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              spellCheck={false}
              value={email}
              onChangeText={(val) => {
                setEmail(val);
                setAuthError(null);
                setSuccessMessage(null);
                if (contextError) clearError();
              }}
              error={emailError}
              showError={submitted}
              leftIcon={<Ionicons name="mail-outline" size={14} color={THEME.accentDark} />}
            />

            {/* Input Password */}
            <Input
              label="Password"
              placeholder="At least 6 characters"
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              spellCheck={false}
              value={password}
              onChangeText={(val) => {
                setPassword(val);
                setAuthError(null);
                setSuccessMessage(null);
                if (contextError) clearError();
              }}
              error={passwordError}
              showError={submitted}
              showCharCount
              maxLength={32}
              helperText={`Character count: ${password.length}`}
              leftIcon={<Ionicons name="lock-closed-outline" size={14} color={THEME.accentDark} />}
            />

            {/* Input Confirm Password */}
            <Input
              label="Confirm Password"
              placeholder="Re-enter password"
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              spellCheck={false}
              value={confirmPassword}
              onChangeText={(val) => {
                setConfirmPassword(val);
                setAuthError(null);
                setSuccessMessage(null);
                if (contextError) clearError();
              }}
              error={confirmError}
              showError={submitted}
              leftIcon={<Ionicons name="shield-checkmark-outline" size={14} color={THEME.accentDark} />}
            />

            <Button
              title="Create Account"
              onPress={handleRegister}
              loading={submitting || loading}
              variant="primary"
              size="md"
              icon={<Ionicons name="person-add-outline" size={15} color={THEME.accent} />}
              style={styles.submitBtn}
            />

            <View style={styles.switchRow}>
              <Text style={styles.switchText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.linkText}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: THEME.background,
  },
  container: {
    padding: 16,
    paddingTop: 8,
  },
  topNavRow: {
    marginBottom: 8,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    paddingVertical: 4,
  },
  backBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: THEME.primary,
  },
  card: {
    padding: 14,
    borderColor: THEME.border,
  },
  headerBox: {
    alignItems: 'center',
    marginBottom: 12,
  },
  logoBadge: {
    width: 38,
    height: 38,
    borderRadius: 8,
    backgroundColor: THEME.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: THEME.accent,
    marginBottom: 6,
  },
  appName: {
    fontSize: 12,
    fontWeight: '800',
    color: THEME.accentText,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: THEME.primary,
    marginTop: 2,
  },
  subtitle: {
    fontSize: 12,
    color: THEME.textSecondary,
    marginTop: 2,
    textAlign: 'center',
  },
  successBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.accentLight,
    borderColor: THEME.accent,
    borderWidth: 1,
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderRadius: 6,
    marginBottom: 10,
  },
  successText: {
    color: THEME.accentText,
    fontWeight: '700',
    fontSize: 12,
  },
  errorAuthBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.dangerBg,
    borderWidth: 1,
    borderColor: THEME.dangerBorder,
    borderRadius: 6,
    paddingVertical: 7,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  errorAuthText: {
    flex: 1,
    color: THEME.danger,
    fontSize: 12,
    fontWeight: '600',
  },
  submitBtn: {
    marginTop: 6,
    width: '100%',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 12,
  },
  switchText: {
    fontSize: 12,
    color: THEME.textSecondary,
  },
  linkText: {
    fontSize: 12,
    color: THEME.accentDark,
    fontWeight: '700',
  },
});
