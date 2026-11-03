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
      {/* Duo-tone Cinema Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.logoBadge}>
            <Ionicons name="film" size={16} color={THEME.accent} />
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
            <Ionicons name="film" size={26} color={THEME.accent} />
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
            <Ionicons name="star" size={10} color={THEME.accent} style={{ marginRight: 4 }} />
            <Text style={styles.taglineText}>Curated Cinema Watchlist</Text>
          </View>
          <Text style={styles.description}>
            A compact, private cinema collection tracker to organize, filter, rate, and curate your {ENTITY_CONFIG.entityPlural.toLowerCase()} watchlist.
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
                    size={14}
                    color={THEME.accentDark}
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
            icon={<Ionicons name="log-in-outline" size={16} color={THEME.accent} />}
            style={styles.actionBtn}
          />
          <Button
            title="Create an Account"
            onPress={() => navigation.navigate('Register')}
            variant="outline"
            icon={<Ionicons name="person-add-outline" size={16} color={THEME.primary} />}
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
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: THEME.card,
    borderBottomWidth: 1,
    borderBottomColor: THEME.border,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoBadge: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: THEME.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  headerAppName: {
    fontSize: 16,
    fontWeight: '800',
    color: THEME.primary,
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
    paddingVertical: 14,
    paddingHorizontal: 8,
  },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: THEME.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: THEME.accent,
    marginBottom: 10,
    shadowColor: THEME.accent,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    color: THEME.primary,
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  taglineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.surfaceSubtle,
    borderColor: THEME.borderStrong,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 2.5,
    borderRadius: 12,
    marginTop: 4,
  },
  taglineText: {
    fontSize: 11,
    fontWeight: '700',
    color: THEME.accentText,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  description: {
    fontSize: 13,
    color: THEME.textSecondary,
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
    borderColor: THEME.border,
  },
  featureHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  featureIconBox: {
    width: 22,
    height: 22,
    borderRadius: 4,
    backgroundColor: THEME.accentLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  featureTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: THEME.primary,
  },
  featureDesc: {
    fontSize: 12,
    color: THEME.textSecondary,
    lineHeight: 17,
    paddingLeft: 30,
  },
  actionSection: {
    marginTop: 14,
    gap: 8,
  },
  actionBtn: {
    width: '100%',
  },
});
