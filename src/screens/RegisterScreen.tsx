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
    ? 'Confirm password is required'
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
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="arrow-back" size={18} color={THEME.primary} />
              <Text style={styles.backBtnText}>Home</Text>
            </TouchableOpacity>
          </View>

          <Card style={styles.card}>
            <View style={styles.headerBox}>
              <View style={styles.logoBadge}>
                <Ionicons name="film" size={24} color="#FFFFFF" />
              </View>
              <Text style={styles.appName}>{ENTITY_CONFIG.appName}</Text>
              <Text style={styles.title}>Create Account</Text>
              <Text style={styles.subtitle}>Sign up to curate your cinema watchlist</Text>
            </View>

            {/* Requirement: form-success */}
            {successMessage ? (
              <View testID="form-success" accessibilityLabel="form-success" style={styles.successBox}>
                <Ionicons name="checkmark-circle" size={18} color={THEME.success} style={{ marginRight: 8 }} />
                <Text style={styles.successText}>{successMessage}</Text>
              </View>
            ) : null}

            {/* Requirement: error-auth */}
            {authError || contextError ? (
              <View testID="error-auth" accessibilityLabel="error-auth" style={styles.errorAuthBox}>
                <Ionicons name="alert-circle" size={18} color={THEME.danger} style={{ marginRight: 8 }} />
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
              leftIcon={<Ionicons name="mail-outline" size={18} color={THEME.primary} />}
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
              leftIcon={<Ionicons name="lock-closed-outline" size={18} color={THEME.primary} />}
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
              leftIcon={<Ionicons name="shield-checkmark-outline" size={18} color={THEME.primary} />}
            />

            <Button
              title="Create Account"
              onPress={handleRegister}
              loading={submitting || loading}
              variant="primary"
              size="md"
              icon={<Ionicons name="person-add-outline" size={18} color="#FFFFFF" />}
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
    padding: 18,
    paddingTop: 10,
  },
  topNavRow: {
    marginBottom: 10,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    paddingVertical: 4,
  },
  backBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: THEME.primary,
  },
  card: {
    padding: 20,
    borderRadius: 14,
  },
  headerBox: {
    alignItems: 'center',
    marginBottom: 16,
  },
  logoBadge: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: THEME.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    shadowColor: THEME.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  appName: {
    fontSize: 13,
    fontWeight: '800',
    color: THEME.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    color: THEME.textPrimary,
    marginTop: 2,
  },
  subtitle: {
    fontSize: 13,
    color: THEME.textSecondary,
    marginTop: 3,
    textAlign: 'center',
  },
  successBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    borderColor: '#10B981',
    borderWidth: 1.5,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  successText: {
    color: '#065F46',
    fontWeight: '800',
    fontSize: 15,
  },
  errorAuthBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.dangerBg,
    borderWidth: 1,
    borderColor: THEME.dangerBorder,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 14,
  },
  errorAuthText: {
    flex: 1,
    color: THEME.danger,
    fontSize: 13,
    fontWeight: '600',
  },
  submitBtn: {
    marginTop: 8,
    width: '100%',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  switchText: {
    fontSize: 14,
    color: THEME.textSecondary,
  },
  linkText: {
    fontSize: 14,
    color: THEME.primary,
    fontWeight: '800',
  },
});
