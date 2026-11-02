import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from '../navigation/types';
import { Button, Card } from '../components/ui';

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<'Home'>>();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.heroSection}>
          <Text style={styles.badgeText}>PE MMA301 Boilerplate</Text>
          <Text style={styles.heroTitle}>BookShelf Manager</Text>
          <Text style={styles.heroSubtitle}>
            A complete Expo + React Native + Firebase Boilerplate ready for practical exam tasks.
          </Text>
        </View>

        <Card style={styles.infoCard}>
          <Text style={styles.infoTitle}>🚀 Key Features Included</Text>
          <Text style={styles.infoItem}>• Firebase Authentication (Email/Password)</Text>
          <Text style={styles.infoItem}>• AsyncStorage Auth Persistence</Text>
          <Text style={styles.infoItem}>• Cloud Firestore Realtime Sync</Text>
          <Text style={styles.infoItem}>• Complete Client-side & Security Rule Validation</Text>
          <Text style={styles.infoItem}>• Pre-styled Reusable UI Components</Text>
        </Card>

        <View style={styles.buttonGroup}>
          <Button
            title="Sign In with Existing Account"
            onPress={() => navigation.navigate('Login')}
            variant="primary"
            style={styles.btn}
          />
          <Button
            title="Create New Account"
            onPress={() => navigation.navigate('Register')}
            variant="outline"
            style={styles.btn}
          />
        </View>
      </ScrollView>
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
  heroSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  badgeText: {
    backgroundColor: '#EEF2FF',
    color: '#4F46E5',
    fontWeight: '700',
    fontSize: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 12,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111827',
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
    paddingHorizontal: 16,
  },
  infoCard: {
    marginBottom: 24,
    backgroundColor: '#FFFFFF',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 10,
  },
  infoItem: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 22,
  },
  buttonGroup: {
    gap: 12,
  },
  btn: {
    width: '100%',
  },
});

