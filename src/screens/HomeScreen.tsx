import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { NavigationProp } from '../navigation/types';
import { Button, Card } from '../components/ui';
import { ENTITY_CONFIG } from '../config/entityConfig';

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<'Home'>>();

  const featureIcons: (keyof typeof Ionicons.glyphMap)[] = [
    'film-outline',
    'options-outline',
    'star-outline',
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Compact Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Ionicons name="film-outline" size={20} color="#0F172A" style={{ marginRight: 6 }} />
          <Text style={styles.headerAppName}>{ENTITY_CONFIG.appName}</Text>
        </View>
        <View style={styles.headerBtnGroup}>
          <Button
            title="Login"
            onPress={() => navigation.navigate('Login')}
            variant="outline"
            size="sm"
          />
          <Button
            title="Register"
            onPress={() => navigation.navigate('Register')}
            variant="primary"
            size="sm"
          />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {/* Cinema Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.iconCircle}>
            <Ionicons name="film" size={28} color="#0F172A" />
          </View>
          <Text
            testID={ENTITY_CONFIG.homeTitleTestId}
            accessibilityLabel={ENTITY_CONFIG.homeTitleTestId}
            style={styles.title}
          >
            {ENTITY_CONFIG.appName}
          </Text>
          <Text style={styles.subtitle}>Movie Watchlist & Tracking</Text>
          <Text style={styles.description}>
            A compact, private cinema collection tracker to organize, filter, rate, and curate your {ENTITY_CONFIG.entityPlural.toLowerCase()} watchlist.
          </Text>
        </View>

        {/* Feature Cards */}
        <View style={styles.featuresSection}>
          {ENTITY_CONFIG.featureCards.map((feat, index) => (
            <Card key={index} style={styles.featureCard}>
              <View style={styles.featureHeaderRow}>
                <Ionicons
                  name={featureIcons[index % featureIcons.length]}
                  size={16}
                  color="#0F172A"
                  style={{ marginRight: 8 }}
                />
                <Text style={styles.featureTitle}>{feat.title}</Text>
              </View>
              <Text style={styles.featureDesc}>{feat.desc}</Text>
            </Card>
          ))}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionSection}>
          <Button
            title="Get Started - Sign In"
            onPress={() => navigation.navigate('Login')}
            variant="primary"
            icon={<Ionicons name="log-in-outline" size={16} color="#FFFFFF" />}
            style={styles.actionBtn}
          />
          <Button
            title="Create an Account"
            onPress={() => navigation.navigate('Register')}
            variant="outline"
            icon={<Ionicons name="person-add-outline" size={16} color="#0F172A" />}
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
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerAppName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.2,
  },
  headerBtnGroup: {
    flexDirection: 'row',
    gap: 6,
  },
  container: {
    padding: 16,
    paddingBottom: 32,
  },
  heroSection: {
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 8,
  },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
    textAlign: 'center',
    marginTop: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  description: {
    fontSize: 13,
    color: '#475569',
    textAlign: 'center',
    lineHeight: 18,
    marginTop: 8,
    paddingHorizontal: 12,
  },
  featuresSection: {
    marginTop: 10,
  },
  featureCard: {
    padding: 12,
    marginBottom: 8,
  },
  featureHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  featureTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  featureDesc: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 17,
    paddingLeft: 24,
  },
  actionSection: {
    marginTop: 14,
    gap: 8,
  },
  actionBtn: {
    width: '100%',
  },
});
