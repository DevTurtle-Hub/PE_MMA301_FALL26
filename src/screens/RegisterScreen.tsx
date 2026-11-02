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

export const RegisterScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<'Register'>>();
  const { register, loading, error, clearError } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
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

  const confirmError = !confirmPassword
    ? 'Please confirm your password'
    : confirmPassword !== password
    ? 'Passwords do not match'
    : '';

  const isFormValid = !emailError && !passwordError && !confirmError;

  const handleRegister = async () => {
    setSubmitted(true);
    if (!isFormValid) {
      return;
    }

    setSubmitting(true);
    try {
      await register(trimmedEmail, password);
      Alert.alert('Registration Successful', 'Welcome to BookShelf App!');
    } catch (err: any) {
      Alert.alert('Registration Error', err.message || 'Failed to create account.');
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
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Sign up to manage and track your library</Text>

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
              placeholder="At least 6 characters"
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
              helperText={`Character count: ${password.length} (minimum 6)`}
            />

            <Input
              label="Confirm Password"
              placeholder="Re-enter your password"
              secureTextEntry
              value={confirmPassword}
              onChangeText={(val) => {
                setConfirmPassword(val);
                if (error) clearError();
              }}
              error={confirmError}
              showError={submitted}
            />

            <Button
              title="Sign Up"
              onPress={handleRegister}
              loading={submitting || loading}
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

