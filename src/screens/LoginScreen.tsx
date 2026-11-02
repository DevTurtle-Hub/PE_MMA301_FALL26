import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from '../navigation/types';
import { useAuth } from '../context/AuthContext';
import { Card, Button, Input } from '../components/ui';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const LoginScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<'Login'>>();
  const { login, loading, error, clearError } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Validations
  const trimmedEmail = email.trim();
  const emailError = !trimmedEmail
    ? 'Email is required'
    : !EMAIL_REGEX.test(trimmedEmail)
    ? 'Invalid email format (e.g. user@example.com)'
    : '';

  const passwordError = !password
    ? 'Password is required'
    : password.length < 6
    ? 'Password must be at least 6 characters'
    : '';

  const isFormValid = !emailError && !passwordError;

  const handleLogin = async () => {
    setSubmitted(true);
    if (!isFormValid) {
      return;
    }

    setSubmitting(true);
    try {
      await login(trimmedEmail, password);
      // Auth listener automatically switches stacks
    } catch (err: any) {
      Alert.alert('Sign In Failed', err.message || 'Please check your credentials.');
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
          <Card style={styles.card}>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in with your email and password</Text>

            {error ? <Text style={styles.apiErrorText}>{error}</Text> : null}

            <Input
              label="Email Address"
              placeholder="name@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={(val) => {
                setEmail(val);
                if (error) clearError();
              }}
              error={emailError}
              showError={submitted}
            />

            <Input
              label="Password"
              placeholder="••••••••"
              secureTextEntry
              value={password}
              onChangeText={(val) => {
                setPassword(val);
                if (error) clearError();
              }}
              error={passwordError}
              showError={submitted}
              showCharCount
              maxLength={32}
              helperText={`Character count: ${password.length}`}
            />

            <Button
              title="Sign In"
              onPress={handleLogin}
              loading={submitting || loading}
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
    backgroundColor: '#F9FAFB',
  },
  container: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
  },
  card: {
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 20,
  },
  apiErrorText: {
    color: '#DC2626',
    backgroundColor: '#FEE2E2',
    padding: 10,
    borderRadius: 8,
    marginBottom: 16,
    textAlign: 'center',
    fontSize: 13,
  },
  submitBtn: {
    marginTop: 8,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  switchText: {
    color: '#6B7280',
    fontSize: 14,
  },
  linkText: {
    color: '#2563EB',
    fontWeight: '700',
    fontSize: 14,
  },
});

