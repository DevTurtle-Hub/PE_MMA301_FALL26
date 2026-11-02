import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from '../navigation/types';
import { Button, Card } from '../components/ui';
import { ENTITY_CONFIG } from '../config/entityConfig';

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<'Home'>>();

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header with App Name and Login / Register buttons */}
      <View style={styles.header}>
        <Text style={styles.headerAppName}>{ENTITY_CONFIG.appName}</Text>
        <View style={styles.headerBtnGroup}>
          <Button
            title="Login"
            onPress={() => navigation.navigate('Login')}
            variant="outline"
            style={styles.headerBtn}
            textStyle={{ fontSize: 13 }}
          />
          <Button
            title="Register"
            onPress={() => navigation.navigate('Register')}
            variant="primary"
            style={styles.headerBtn}
            textStyle={{ fontSize: 13 }}
          />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {/* Title with exact testID and text */}
        <Text
          testID={ENTITY_CONFIG.homeTitleTestId}
          accessibilityLabel={ENTITY_CONFIG.homeTitleTestId}
          style={styles.title}
        >
          {ENTITY_CONFIG.appName}
        </Text>

        <Text style={styles.description}>
          A private collection management app to organize, sort, rate, and track your {ENTITY_CONFIG.entityPlural} effortlessly.
        </Text>

        {/* Feature cards from ENTITY_CONFIG */}
        {ENTITY_CONFIG.featureCards.map((feat, index) => (
          <Card key={index} style={styles.featureCard}>
            <Text style={styles.featureTitle}>{feat.title}</Text>
            <Text style={styles.featureDesc}>{feat.desc}</Text>
          </Card>
        ))}

        <View style={styles.actionSection}>
          <Button
            title="Get Started - Sign In"
            onPress={() => navigation.navigate('Login')}
            variant="primary"
            style={styles.actionBtn}
          />
          <Button
            title="Create an Account"
            onPress={() => navigation.navigate('Register')}
            variant="outline"
            style={styles.actionBtn}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerAppName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#2563EB',
  },
  headerBtnGroup: {
    flexDirection: 'row',
    gap: 8,
  },
  headerBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: '#111827',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 8,
  },
  description: {
    fontSize: 15,
    color: '#4B5563',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
    paddingHorizontal: 10,
  },
  featureCard: {
    marginBottom: 14,
  },
  featureTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 6,
  },
  featureDesc: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  actionSection: {
    marginTop: 16,
    gap: 12,
  },
  actionBtn: {
    width: '100%',
  },
});
