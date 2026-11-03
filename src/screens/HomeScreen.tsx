import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { NavigationProp } from '../navigation/types';
import { Button, Card } from '../components/ui';
import { ENTITY_CONFIG } from '../config/entityConfig';
import { THEME } from '../config/theme';

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<'Home'>>();

  const featureIcons: (keyof typeof Ionicons.glyphMap)[] = [
    'film-outline',
    'options-outline',
    'star-outline',
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.logoBadge}>
            <Ionicons name="film" size={20} color="#FFFFFF" />
          </View>
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
            <Ionicons name="film" size={34} color="#FFFFFF" />
          </View>
          {/* Requirement: homeTitleTestId with exact appName text */}
          <Text
            testID={ENTITY_CONFIG.homeTitleTestId}
            accessibilityLabel={ENTITY_CONFIG.homeTitleTestId}
            style={styles.title}
          >
            {ENTITY_CONFIG.appName}
          </Text>
          <View style={styles.taglineBadge}>
            <Ionicons name="sparkles" size={13} color={THEME.primary} style={{ marginRight: 6 }} />
            <Text style={styles.taglineText}>Curated Cinema Watchlist</Text>
          </View>
          <Text style={styles.description}>
            A modern, beautifully crafted cinema watchlist app to track, rate, and organize your favorite movies effortlessly.
          </Text>
        </View>

        {/* Feature Cards */}
        <View style={styles.featuresSection}>
          {ENTITY_CONFIG.featureCards.map((feat, index) => (
            <Card key={index} style={styles.featureCard}>
              <View style={styles.featureHeaderRow}>
                <View style={styles.featureIconBox}>
                  <Ionicons
                    name={featureIcons[index % featureIcons.length]}
                    size={18}
                    color={THEME.primary}
                  />
                </View>
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
            size="md"
            icon={<Ionicons name="log-in-outline" size={20} color="#FFFFFF" />}
            style={styles.actionBtn}
          />
          <Button
            title="Create an Account"
            onPress={() => navigation.navigate('Register')}
            variant="outline"
            size="md"
            icon={<Ionicons name="person-add-outline" size={18} color={THEME.primary} />}
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
    backgroundColor: THEME.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: THEME.card,
    borderBottomWidth: 1,
    borderBottomColor: THEME.border,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoBadge: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: THEME.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    shadowColor: THEME.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  headerAppName: {
    fontSize: 18,
    fontWeight: '800',
    color: THEME.textPrimary,
    letterSpacing: -0.3,
  },
  headerBtnGroup: {
    flexDirection: 'row',
    gap: 8,
  },
  container: {
    padding: 18,
    paddingBottom: 40,
  },
  heroSection: {
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 10,
  },
  iconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: THEME.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    marginBottom: 12,
    shadowColor: THEME.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    fontSize: 30,
    fontWeight: '900',
    color: THEME.textPrimary,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  taglineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.primaryLight,
    borderColor: THEME.primaryBorder,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    marginTop: 6,
  },
  taglineText: {
    fontSize: 12,
    fontWeight: '700',
    color: THEME.primaryDark,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  description: {
    fontSize: 14,
    color: THEME.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginTop: 10,
    paddingHorizontal: 14,
  },
  featuresSection: {
    marginTop: 14,
  },
  featureCard: {
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
  },
  featureHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  featureIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: THEME.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  featureTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: THEME.textPrimary,
  },
  featureDesc: {
    fontSize: 13,
    color: THEME.textSecondary,
    lineHeight: 19,
    paddingLeft: 42,
  },
  actionSection: {
    marginTop: 16,
    gap: 10,
  },
  actionBtn: {
    width: '100%',
  },
});
