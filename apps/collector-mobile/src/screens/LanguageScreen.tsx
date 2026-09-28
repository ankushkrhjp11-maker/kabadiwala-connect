import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import type {
  AppLanguage,
  AppRoute,
} from '../navigation/types';

import { Button, Card } from '../components/UI';
import {
  colors,
  spacing,
  typography,
} from '../theme';

const languages: Array<{
  id: AppLanguage;
  native: string;
  english: string;
  icon: string;
}> = [
  {
    id: 'hi',
    native: 'हिन्दी',
    english: 'Hindi',
    icon: 'अ',
  },
  {
    id: 'mr',
    native: 'मराठी',
    english: 'Marathi',
    icon: 'म',
  },
  {
    id: 'en',
    native: 'English',
    english: 'English',
    icon: 'A',
  },
];

export function LanguageScreen({
  onSelect,
}: {
  onSelect: (
    language: AppLanguage,
    route: AppRoute,
  ) => void;
}) {
  return (
    <View style={styles.container}>
      {/* =================================================
          TOP BRAND
         ================================================= */}

      <View style={styles.topSection}>
        <View style={styles.logo}>
          <Text style={styles.logoText}>
            ♻
          </Text>
        </View>

        <View>
          <Text style={styles.brandName}>
            Kabadiwala Connect
          </Text>

          <Text style={styles.brandTagline}>
            Smart recycling. Better earnings.
          </Text>
        </View>
      </View>

      {/* =================================================
          HERO
         ================================================= */}

      <View style={styles.hero}>
        <Text style={styles.heroEmoji}>
          🌱
        </Text>

        <Text style={styles.title}>
          Choose your language
        </Text>

        <Text style={styles.subtitle}>
          अपनी भाषा चुनें · तुमची भाषा निवडा
        </Text>

        <Text style={styles.description}>
          Select the language you are most comfortable
          with. You can change it anytime from your
          profile.
        </Text>
      </View>

      {/* =================================================
          LANGUAGE LIST
         ================================================= */}

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>
          Select language
        </Text>

        <View style={styles.languageCount}>
          <Text style={styles.languageCountText}>
            3
          </Text>
        </View>
      </View>

      <View style={styles.list}>
        {languages.map((language) => (
          <Card
            key={language.id}
            onPress={() =>
              onSelect(
                language.id,
                'login',
              )
            }
          >
            <View style={styles.languageRow}>
              {/* Icon */}
              <View style={styles.languageIcon}>
                <Text style={styles.languageIconText}>
                  {language.icon}
                </Text>
              </View>

              {/* Text */}
              <View style={styles.languageText}>
                <Text style={styles.native}>
                  {language.native}
                </Text>

                <Text style={styles.english}>
                  {language.english}
                </Text>
              </View>

              {/* Arrow */}
              <View style={styles.arrowBox}>
                <Text style={styles.arrow}>
                  →
                </Text>
              </View>
            </View>
          </Card>
        ))}
      </View>

      {/* =================================================
          INFO
         ================================================= */}

      <View style={styles.infoBox}>
        <View style={styles.infoIcon}>
          <Text style={styles.infoIconText}>
            ✓
          </Text>
        </View>

        <View style={styles.infoContent}>
          <Text style={styles.infoTitle}>
            Easy to change
          </Text>

          <Text style={styles.infoText}>
            You can change your preferred language later
            from Profile.
          </Text>
        </View>
      </View>

      {/* =================================================
          CONTINUE
         ================================================= */}

      <View style={styles.bottomSection}>
        <Button
          label="Continue in English"
          onPress={() =>
            onSelect('en', 'login')
          }
        />

        <Text style={styles.bottomText}>
          Built for collectors, recyclers and the
          circular economy.
        </Text>
      </View>
    </View>
  );
}

/* =====================================================
   STYLES
   ===================================================== */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.canvas,
    paddingHorizontal: spacing.lg,
    paddingTop: 58,
    paddingBottom: spacing.lg,
  },

  /* -----------------------------------------------------
     BRAND
     ----------------------------------------------------- */

  topSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },

  logo: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: colors.brand,
    alignItems: 'center',
    justifyContent: 'center',
  },

  logoText: {
    fontSize: 29,
    color: '#FFFFFF',
    fontWeight: '800',
  },

  brandName: {
    fontSize: 15,
    fontWeight: '900',
    color: colors.ink,
    marginLeft: spacing.sm,
  },

  brandTagline: {
    fontSize: 9,
    color: colors.muted,
    marginLeft: spacing.sm,
    marginTop: 2,
  },

  /* -----------------------------------------------------
     HERO
     ----------------------------------------------------- */

  hero: {
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    marginBottom: spacing.lg,
  },

  heroEmoji: {
    fontSize: 42,
    marginBottom: spacing.sm,
  },

  title: {
    ...typography.title,
    textAlign: 'center',
    color: colors.ink,
  },

  subtitle: {
    ...typography.body,
    color: colors.brand,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: spacing.xs,
  },

  description: {
    fontSize: 11,
    lineHeight: 17,
    color: colors.muted,
    textAlign: 'center',
    marginTop: spacing.sm,
    maxWidth: 320,
  },

  /* -----------------------------------------------------
     SECTION
     ----------------------------------------------------- */

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },

  sectionTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: colors.ink,
  },

  languageCount: {
    width: 28,
    height: 28,
    borderRadius: 10,
    backgroundColor: colors.brandSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },

  languageCountText: {
    fontSize: 11,
    fontWeight: '900',
    color: colors.brand,
  },

  /* -----------------------------------------------------
     LANGUAGE CARDS
     ----------------------------------------------------- */

  list: {
    gap: spacing.sm,
  },

  languageRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  languageIcon: {
    width: 48,
    height: 48,
    borderRadius: 15,
    backgroundColor: colors.brandSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },

  languageIconText: {
    fontSize: 21,
    fontWeight: '900',
    color: colors.brand,
  },

  languageText: {
    flex: 1,
    marginLeft: spacing.sm,
  },

  native: {
    ...typography.heading,
    fontSize: 17,
    color: colors.ink,
  },

  english: {
    ...typography.body,
    fontSize: 11,
    color: colors.muted,
    marginTop: 2,
  },

  arrowBox: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: colors.canvas,
    alignItems: 'center',
    justifyContent: 'center',
  },

  arrow: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.brand,
  },

  /* -----------------------------------------------------
     INFO
     ----------------------------------------------------- */

  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.brandSoft,
    borderRadius: 17,
    padding: spacing.md,
    marginTop: spacing.lg,
  },

  infoIcon: {
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: colors.brand,
    alignItems: 'center',
    justifyContent: 'center',
  },

  infoIconText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
  },

  infoContent: {
    flex: 1,
    marginLeft: spacing.sm,
  },

  infoTitle: {
    fontSize: 11,
    fontWeight: '900',
    color: colors.ink,
  },

  infoText: {
    fontSize: 9,
    lineHeight: 14,
    color: colors.muted,
    marginTop: 2,
  },

  /* -----------------------------------------------------
     BOTTOM
     ----------------------------------------------------- */

  bottomSection: {
    marginTop: 'auto',
    alignItems: 'center',
  },

  bottomText: {
    fontSize: 9,
    lineHeight: 14,
    color: colors.muted,
    textAlign: 'center',
    marginTop: spacing.sm,
    paddingHorizontal: spacing.md,
  },
});