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

export const LoginScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<'Login'>>();
  const { login, loading, error: contextError, clearError } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Field validations (exact exam messages)
  const trimmedEmail = email.trim();
  const emailError = !trimmedEmail
    ? 'Email is required'
    : !EMAIL_REGEX.test(trimmedEmail)
    ? 'Please enter a valid email address'
    : '';

  const passwordError = !password ? 'Password is required' : '';

  const isFormValid = !emailError && !passwordError;

  const handleLogin = async () => {
    setSubmitted(true);
    setAuthError(null);
    if (contextError) clearError();

    if (!isFormValid) {
      return;
    }

    setSubmitting(true);
    try {
      await login(trimmedEmail, password);
      // Navigation to 'List' screen is handled automatically by the auth state listener in AppNavigator
    } catch (err: any) {
      let message = err.message || 'Login failed.';
      if (
        err.code === 'auth/wrong-password' ||
        err.code === 'auth/user-not-found' ||
        err.code === 'auth/invalid-credential'
      ) {
        message = 'Invalid email or password.';
      } else if (err.code === 'auth/too-many-requests') {
        message = 'Too many attempts. Please try again later.';
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
              <Text style={styles.title}>Sign In</Text>
              <Text style={styles.subtitle}>Enter your credentials to access your watchlist</Text>
            </View>

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
              placeholder="name@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              spellCheck={false}
              value={email}
              onChangeText={(val) => {
                setEmail(val);
                setAuthError(null);
                if (contextError) clearError();
              }}
              error={emailError}
              showError={submitted}
              leftIcon={<Ionicons name="mail-outline" size={14} color={THEME.accentDark} />}
            />

            {/* Input Password */}
            <Input
              label="Password"
              placeholder="••••••••"
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              spellCheck={false}
              value={password}
              onChangeText={(val) => {
                setPassword(val);
                setAuthError(null);
                if (contextError) clearError();
              }}
              error={passwordError}
              showError={submitted}
              showCharCount
              maxLength={32}
              helperText={`Character count: ${password.length}`}
              leftIcon={<Ionicons name="lock-closed-outline" size={14} color={THEME.accentDark} />}
            />

            <Button
              title="Sign In"
              onPress={handleLogin}
              loading={submitting || loading}
              variant="primary"
              size="md"
              icon={<Ionicons name="log-in-outline" size={15} color={THEME.accent} />}
              style={styles.submitBtn}
            />

            <View style={styles.switchRow}>
              <Text style={styles.switchText}>Don&apos;t have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={styles.linkText}>Sign Up</Text>
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
