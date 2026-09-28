import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Screen } from '../components/Screen';
import { Button, Card } from '../components/UI';

import type {
  AppLanguage,
  AppRoute,
} from '../navigation/types';

import {
  colors,
  spacing,
} from '../theme';

import { clearSession } from '../services/authStorage';

export function ProfileScreen({
  language,
  onNavigate,
  onBack,
}: {
  language: AppLanguage;
  onNavigate: (route: AppRoute) => void;
  onBack: () => void;
}) {
  const languageName =
    language === 'hi'
      ? 'हिन्दी'
      : language === 'mr'
        ? 'मराठी'
        : 'English';

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await clearSession();

              onNavigate('login');
            } catch (error) {
              console.error(
                'Logout failed:',
                error,
              );

              Alert.alert(
                'Logout failed',
                'Unable to logout. Please try again.',
              );
            }
          },
        },
      ],
    );
  };

  return (
    <Screen
      title="My profile"
      subtitle="Your account and app settings."
      showBack
      onBack={onBack}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* PROFILE HERO */}

        <View style={styles.profileHero}>
          <View style={styles.profileTop}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                C
              </Text>

              <View style={styles.onlineDot} />
            </View>

            <View style={styles.profileInfo}>
              <Text style={styles.accountLabel}>
                COLLECTOR ACCOUNT
              </Text>

              <Text style={styles.name}>
                Collector account
              </Text>

              <View style={styles.roleBadge}>
                <Text style={styles.roleBadgeText}>
                  ♻ Collector
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.profileDivider} />

          <View style={styles.profileFooter}>
            <View style={styles.mobileInfo}>
              <Text style={styles.profileFooterLabel}>
                MOBILE
              </Text>

              <Text style={styles.profileFooterValue}>
                Mobile number will appear after login
              </Text>
            </View>

            <View style={styles.verifiedBadge}>
              <Text style={styles.verifiedBadgeText}>
                ✓ Active
              </Text>
            </View>
          </View>
        </View>

        {/* ACCOUNT OVERVIEW */}

        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>
              Account overview
            </Text>

            <Text style={styles.sectionSubtitle}>
              Your account preferences
            </Text>
          </View>
        </View>

        <View style={styles.overviewRow}>
          <OverviewItem
            icon="♻️"
            title="Role"
            value="Collector"
          />

          <OverviewItem
            icon="🌐"
            title="Language"
            value={languageName}
          />
        </View>

        {/* APP LANGUAGE */}

        <Card>
          <View style={styles.cardHeader}>
            <View style={styles.cardIcon}>
              <Text style={styles.cardIconText}>
                🌐
              </Text>
            </View>

            <View style={styles.cardHeaderContent}>
              <Text style={styles.cardTitle}>
                App language
              </Text>

              <Text style={styles.cardSubtitle}>
                Choose your preferred language
              </Text>
            </View>

            <View style={styles.languageBadge}>
              <Text style={styles.languageBadgeText}>
                {languageName}
              </Text>
            </View>
          </View>

          <View style={styles.cardDivider} />

          <Button
            label="Change language"
            variant="secondary"
            onPress={() =>
              onNavigate('language')
            }
          />
        </Card>

        {/* HELP & TRUST */}

        <Card>
          <View style={styles.cardHeader}>
            <View style={styles.cardIcon}>
              <Text style={styles.cardIconText}>
                🛡️
              </Text>
            </View>

            <View style={styles.cardHeaderContent}>
              <Text style={styles.cardTitle}>
                Help & trust
              </Text>

              <Text style={styles.cardSubtitle}>
                Support and important information
              </Text>
            </View>
          </View>

          <View style={styles.helpList}>
            <HelpItem
              icon="🦺"
              title="Safety guidance"
              subtitle="Safe e-waste handling practices"
            />

            <HelpItem
              icon="🔒"
              title="Privacy & support"
              subtitle="Your account and data protection"
            />

            <HelpItem
              icon="ℹ️"
              title="App version"
              subtitle="Kabadiwala Connect • v0.1.0"
              last
            />
          </View>
        </Card>

        {/* LOGOUT */}

        <View style={styles.logoutCard}>
          <View style={styles.logoutHeader}>
            <View style={styles.logoutIcon}>
              <Text style={styles.logoutIconText}>
                ↪
              </Text>
            </View>

            <View style={styles.logoutHeaderContent}>
              <Text style={styles.logoutTitle}>
                Sign out
              </Text>

              <Text style={styles.logoutSubtitle}>
                End your current session on this device.
              </Text>
            </View>
          </View>

          <Text style={styles.logoutDescription}>
            Your registration and saved role will
            remain saved in your account.
          </Text>

          <View style={styles.logoutButton}>
            <Button
              label="Logout"
              variant="secondary"
              onPress={handleLogout}
            />
          </View>
        </View>

        {/* FOOTER */}

        <View style={styles.footer}>
          <Text style={styles.footerLogo}>
            ♻
          </Text>

          <Text style={styles.footerTitle}>
            Kabadiwala Connect
          </Text>

          <Text style={styles.footerText}>
            RECYCLE • CONNECT • GROW
          </Text>
        </View>
      </ScrollView>
    </Screen>
  );
}

/* ACCOUNT OVERVIEW ITEM */

function OverviewItem({
  icon,
  title,
  value,
}: {
  icon: string;
  title: string;
  value: string;
}) {
  return (
    <View style={styles.overviewItem}>
      <View style={styles.overviewIcon}>
        <Text style={styles.overviewIconText}>
          {icon}
        </Text>
      </View>

      <View style={styles.overviewContent}>
        <Text style={styles.overviewTitle}>
          {title}
        </Text>

        <Text style={styles.overviewValue}>
          {value}
        </Text>
      </View>
    </View>
  );
}

/* HELP ITEM */

function HelpItem({
  icon,
  title,
  subtitle,
  last = false,
}: {
  icon: string;
  title: string;
  subtitle: string;
  last?: boolean;
}) {
  return (
    <Pressable
      style={[
        styles.helpItem,
        !last && styles.helpItemBorder,
      ]}
    >
      <View style={styles.helpIcon}>
        <Text style={styles.helpIconText}>
          {icon}
        </Text>
      </View>

      <View style={styles.helpContent}>
        <Text style={styles.helpTitle}>
          {title}
        </Text>

        <Text style={styles.helpSubtitle}>
          {subtitle}
        </Text>
      </View>

      <Text style={styles.helpArrow}>
        ›
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: spacing.xl,
  },

  /* PROFILE HERO */

  profileHero: {
    backgroundColor: colors.brand,
    borderRadius: 24,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },

  profileTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  avatar: {
    width: 72,
    height: 72,
    borderRadius: 24,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },

  avatarText: {
    fontSize: 31,
    fontWeight: '900',
    color: colors.brand,
  },

  onlineDot: {
    position: 'absolute',
    width: 13,
    height: 13,
    borderRadius: 7,
    backgroundColor: '#4CCB83',
    borderWidth: 3,
    borderColor: colors.surface,
    right: 1,
    bottom: 1,
  },

  profileInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },

  accountLabel: {
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 1.3,
    color: 'rgba(255,255,255,0.62)',
    marginBottom: 4,
  },

  name: {
    fontSize: 21,
    fontWeight: '900',
    color: '#FFFFFF',
  },

  roleBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.13)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.16)',
    borderRadius: 999,
    paddingHorizontal: 9,
    paddingVertical: 5,
    marginTop: 7,
  },

  roleBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
  },

  profileDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.13)',
    marginVertical: spacing.md,
  },

  profileFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  mobileInfo: {
    flex: 1,
  },

  profileFooterLabel: {
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 1,
    color: 'rgba(255,255,255,0.55)',
  },

  profileFooterValue: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.78)',
    marginTop: 3,
  },

  verifiedBadge: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 999,
    paddingHorizontal: 9,
    paddingVertical: 6,
    marginLeft: spacing.sm,
  },

  verifiedBadgeText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#FFFFFF',
  },

  /* SECTION */

  sectionHeader: {
    marginBottom: spacing.sm,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: colors.ink,
    letterSpacing: -0.3,
  },

  sectionSubtitle: {
    fontSize: 10,
    color: colors.muted,
    marginTop: 3,
  },

  /* OVERVIEW */

  overviewRow: {
    flexDirection: 'row',
    marginBottom: spacing.md,
  },

  overviewItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 18,
    padding: spacing.sm,
    marginRight: spacing.xs,
    minHeight: 68,
  },

  overviewIcon: {
    width: 37,
    height: 37,
    borderRadius: 12,
    backgroundColor: colors.brandSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },

  overviewIconText: {
    fontSize: 18,
  },

  overviewContent: {
    flex: 1,
    marginLeft: 7,
  },

  overviewTitle: {
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 0.7,
    color: colors.muted,
  },

  overviewValue: {
    fontSize: 12,
    fontWeight: '900',
    color: colors.ink,
    marginTop: 3,
  },

  /* COMMON CARD */

  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  cardIcon: {
    width: 43,
    height: 43,
    borderRadius: 14,
    backgroundColor: colors.brandSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },

  cardIconText: {
    fontSize: 20,
  },

  cardHeaderContent: {
    flex: 1,
    marginLeft: spacing.sm,
  },

  cardTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: colors.ink,
  },

  cardSubtitle: {
    fontSize: 10,
    lineHeight: 15,
    color: colors.muted,
    marginTop: 3,
  },

  languageBadge: {
    backgroundColor: colors.brandSoft,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },

  languageBadgeText: {
    fontSize: 9,
    fontWeight: '900',
    color: colors.brand,
  },

  cardDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.md,
  },

  /* HELP */

  helpList: {
    marginTop: spacing.md,
  },

  helpItem: {
    minHeight: 64,
    flexDirection: 'row',
    alignItems: 'center',
  },

  helpItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  helpIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: colors.brandSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },

  helpIconText: {
    fontSize: 17,
  },

  helpContent: {
    flex: 1,
  },

  helpTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: colors.ink,
  },

  helpSubtitle: {
    fontSize: 9,
    color: colors.muted,
    marginTop: 3,
  },

  helpArrow: {
    fontSize: 24,
    color: colors.brand,
    marginLeft: 8,
  },

  /* LOGOUT */

  logoutCard: {
    backgroundColor: '#FFF7F7',
    borderWidth: 1,
    borderColor: '#F0DADA',
    borderRadius: 22,
    padding: spacing.md,
    marginTop: spacing.sm,
  },

  logoutHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  logoutIcon: {
    width: 43,
    height: 43,
    borderRadius: 14,
    backgroundColor: '#FBE8E8',
    alignItems: 'center',
    justifyContent: 'center',
  },

  logoutIconText: {
    fontSize: 23,
    color: '#B62F2F',
    fontWeight: '900',
  },

  logoutHeaderContent: {
    flex: 1,
    marginLeft: spacing.sm,
  },

  logoutTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: colors.ink,
  },

  logoutSubtitle: {
    fontSize: 10,
    color: colors.muted,
    marginTop: 3,
  },

  logoutDescription: {
    fontSize: 10,
    lineHeight: 17,
    color: colors.muted,
    marginTop: spacing.md,
  },

  logoutButton: {
    marginTop: spacing.md,
  },

  /* FOOTER */

  footer: {
    alignItems: 'center',
    paddingTop: spacing.xl,
    paddingBottom: spacing.md,
  },

  footerLogo: {
    fontSize: 25,
    color: colors.brand,
  },

  footerTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: colors.ink,
    marginTop: 5,
  },

  footerText: {
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 1.4,
    color: colors.muted,
    marginTop: 5,
  },
});