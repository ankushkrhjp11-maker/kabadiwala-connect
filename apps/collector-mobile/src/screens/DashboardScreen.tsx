import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Card, Button, Chip } from './components/UI';
import { Screen } from './components/Screen';
import type { AppRoute } from '../navigation/types';
import { colors, spacing, typography } from '../theme';

type DashboardScreenProps = {
  onNavigate: (route: AppRoute) => void;
};

export function DashboardScreen({ onNavigate }: DashboardScreenProps) {
  return (
    <Screen
      title="Namaste, Collector 👋"
      subtitle="Collect smart. Recycle responsibly."
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        {/* STATUS */}
        <View style={styles.statusRow}>
          <Chip>Offline ready</Chip>

          <View style={styles.syncStatus}>
            <View style={styles.syncDot} />
            <Text style={styles.syncText}>Ready to sync</Text>
          </View>
        </View>

        {/* HERO / EARNINGS */}
        <View style={styles.earningsCard}>
          <View style={styles.earningsGlow} />

          <View style={styles.earningsTop}>
            <View style={styles.earningsIcon}>
              <Text style={styles.earningsIconText}>₹</Text>
            </View>

            <View style={styles.earningsStatus}>
              <View style={styles.smallDot} />
              <Text style={styles.earningsStatusText}>THIS MONTH</Text>
            </View>
          </View>

          <Text style={styles.earningsLabel}>Your earnings</Text>

          <Text style={styles.balance}>₹ 0</Text>

          <Text style={styles.earningsHint}>
            Earnings will appear here after successful sales.
          </Text>

          <View style={styles.earningDivider} />

          <View style={styles.earningStats}>
            <View style={styles.statBlock}>
              <Text style={styles.statNumber}>0</Text>
              <Text style={styles.statLabel}>Completed sales</Text>
            </View>

            <View style={styles.statSeparator} />

            <View style={styles.statBlock}>
              <Text style={styles.statNumber}>0</Text>
              <Text style={styles.statLabel}>Pending lots</Text>
            </View>
          </View>
        </View>

        {/* CREATE LOT */}
        <View style={styles.createSection}>
          <View style={styles.sectionHeadingRow}>
            <View style={styles.sectionNumber}>
              <Text style={styles.sectionNumberText}>01</Text>
            </View>

            <View style={styles.sectionHeadingContent}>
              <Text style={styles.sectionTitle}>Start a collection</Text>
              <Text style={styles.sectionSubtitle}>
                Turn collected e-waste into a digital lot.
              </Text>
            </View>
          </View>

          <View style={styles.createCard}>
            <View style={styles.createIconCircle}>
              <Text style={styles.createIcon}>＋</Text>
            </View>

            <View style={styles.createContent}>
              <Text style={styles.createTitle}>
                Create a new e-waste lot
              </Text>

              <Text style={styles.createDescription}>
                Add material, photo, weight and collection details.
              </Text>
            </View>

            <Button
              label="Create"
              onPress={() => onNavigate('createLot')}
            />
          </View>
        </View>

        {/* QUICK ACTIONS */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Quick actions</Text>

            <Text style={styles.sectionSubtitle}>
              Everything you need in one place.
            </Text>
          </View>
        </View>

        <View style={styles.grid}>
          <ActionCard
            icon="📦"
            title="My lots"
            subtitle="Track collected e-waste"
            onPress={() => onNavigate('myLots')}
          />

          <ActionCard
            icon="₹"
            title="Earnings"
            subtitle="View your sales ledger"
            onPress={() => onNavigate('earnings')}
          />

          <ActionCard
            icon="🛡"
            title="Safety"
            subtitle="Safe handling guidance"
            onPress={() => onNavigate('safety')}
          />

          <ActionCard
            icon="●"
            title="My profile"
            subtitle="Manage your account"
            onPress={() => onNavigate('profile')}
          />
        </View>

        {/* MARKET */}
        <View style={styles.infoCard}>
          <View style={styles.infoHeader}>
            <View style={styles.infoIcon}>
              <Text style={styles.infoIconText}>₹</Text>
            </View>

            <View style={styles.infoHeading}>
              <Text style={styles.cardEyebrow}>MARKET</Text>

              <Text style={styles.cardTitle}>
                Today's price board
              </Text>
            </View>

            <Text style={styles.arrow}>›</Text>
          </View>

          <View style={styles.infoDivider} />

          <Text style={styles.emptyTitle}>
            Current prices will appear here
          </Text>

          <Text style={styles.emptyText}>
            Check the latest buying prices before creating a lot.
          </Text>
        </View>

        {/* RECYCLERS */}
        <View style={styles.infoCard}>
          <View style={styles.infoHeader}>
            <View style={styles.recyclerIcon}>
              <Text style={styles.recyclerIconText}>⌖</Text>
            </View>

            <View style={styles.infoHeading}>
              <Text style={styles.cardEyebrow}>NETWORK</Text>

              <Text style={styles.cardTitle}>
                Nearby authorized recyclers
              </Text>
            </View>

            <Text style={styles.arrow}>›</Text>
          </View>

          <View style={styles.infoDivider} />

          <View style={styles.recyclerContent}>
            <View style={styles.locationPin}>
              <Text style={styles.locationPinText}>●</Text>
            </View>

            <View style={styles.recyclerText}>
              <Text style={styles.emptyTitle}>
                Recycler matching is ready
              </Text>

              <Text style={styles.emptyText}>
                Authorized recyclers matching your material and
                location will appear here.
              </Text>
            </View>
          </View>
        </View>

        {/* SAFETY */}
        <View style={styles.safetyCard}>
          <View style={styles.safetyTop}>
            <View style={styles.warningCircle}>
              <Text style={styles.warningText}>!</Text>
            </View>

            <View style={styles.safetyTitleBlock}>
              <Text style={styles.safetyEyebrow}>SAFETY FIRST</Text>
              <Text style={styles.safetyTitle}>Handle e-waste carefully</Text>
            </View>
          </View>

          <Text style={styles.safetyText}>
            Batteries, CRTs and damaged electronic components
            need extra care during collection and transport.
          </Text>

          <View style={styles.safetyFooter}>
            <Text style={styles.safetyFooterText}>
              Open Safety for detailed guidance
            </Text>

            <Text style={styles.safetyArrow}>→</Text>
          </View>
        </View>

        {/* FOOTER */}
        <View style={styles.footer}>
          <Text style={styles.footerRecycle}>♻</Text>

          <Text style={styles.footerTitle}>
            Recycle responsibly
          </Text>

          <Text style={styles.footerText}>
            Every verified collection helps build a cleaner future.
          </Text>
        </View>

        <View style={styles.bottomSpace} />
      </ScrollView>
    </Screen>
  );
}

/* =========================================================
   ACTION CARD
========================================================= */

type ActionCardProps = {
  icon: string;
  title: string;
  subtitle: string;
  onPress: () => void;
};

function ActionCard({
  icon,
  title,
  subtitle,
  onPress,
}: ActionCardProps) {
  return (
    <Card onPress={onPress}>
      <View style={styles.actionTop}>
        <View style={styles.actionIcon}>
          <Text style={styles.actionEmoji}>{icon}</Text>
        </View>

        <Text style={styles.actionArrow}>↗</Text>
      </View>

      <Text style={styles.actionTitle}>{title}</Text>

      <Text style={styles.actionSubtitle}>{subtitle}</Text>
    </Card>
  );
}

/* =========================================================
   STYLES
========================================================= */

const styles = StyleSheet.create({
  container: {
    paddingBottom: spacing.xl,
  },

  /* STATUS */

  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },

  syncStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: colors.surfaceMuted,
  },

  syncDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.success,
    marginRight: 6,
  },

  syncText: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: '700',
  },

  /* EARNINGS */

  earningsCard: {
    position: 'relative',
    overflow: 'hidden',
    borderRadius: 24,
    padding: spacing.lg,
    backgroundColor: colors.brandDark,
    marginBottom: spacing.xl,
  },

  earningsGlow: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    right: -75,
    top: -75,
    backgroundColor: 'rgba(255, 255, 255, 0.07)',
  },

  earningsTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  earningsIcon: {
    width: 46,
    height: 46,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.13)',
  },

  earningsIconText: {
    color: colors.surface,
    fontSize: 23,
    fontWeight: '900',
  },

  earningsStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.10)',
  },

  smallDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.success,
    marginRight: 6,
  },

  earningsStatusText: {
    color: 'rgba(255, 255, 255, 0.72)',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1,
  },

  earningsLabel: {
    color: 'rgba(255, 255, 255, 0.78)',
    fontSize: 14,
    fontWeight: '700',
    marginTop: spacing.lg,
  },

  balance: {
    color: colors.surface,
    fontSize: 42,
    fontWeight: '900',
    marginTop: 3,
    letterSpacing: -1,
  },

  earningsHint: {
    color: 'rgba(255, 255, 255, 0.65)',
    fontSize: 12,
    lineHeight: 18,
    marginTop: 2,
    maxWidth: 280,
  },

  earningDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    marginVertical: spacing.lg,
  },

  earningStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  statBlock: {
    flex: 1,
  },

  statNumber: {
    color: colors.surface,
    fontSize: 19,
    fontWeight: '900',
  },

  statLabel: {
    color: 'rgba(255, 255, 255, 0.58)',
    fontSize: 11,
    marginTop: 2,
  },

  statSeparator: {
    width: 1,
    height: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    marginHorizontal: spacing.md,
  },

  /* SECTION */

  sectionHeadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },

  sectionNumber: {
    width: 34,
    height: 34,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.brandSoft,
    marginRight: spacing.sm,
  },

  sectionNumberText: {
    color: colors.brandDark,
    fontSize: 11,
    fontWeight: '900',
  },

  sectionHeadingContent: {
    flex: 1,
  },

  sectionHeader: {
    marginBottom: spacing.md,
  },

  sectionTitle: {
    ...typography.heading,
    color: colors.text,
    fontSize: 19,
    fontWeight: '900',
  },

  sectionSubtitle: {
    color: colors.muted,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 3,
  },

  /* CREATE */

  createSection: {
    marginBottom: spacing.xl,
  },

  createCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },

  createIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.brandSoft,
    marginRight: spacing.sm,
  },

  createIcon: {
    color: colors.brandDark,
    fontSize: 28,
    fontWeight: '300',
  },

  createContent: {
    flex: 1,
    marginRight: spacing.sm,
  },

  createTitle: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '900',
  },

  createDescription: {
    color: colors.muted,
    fontSize: 11,
    lineHeight: 16,
    marginTop: 3,
  },

  /* QUICK ACTIONS */

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: spacing.xl,
  },

  actionTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  actionIcon: {
    width: 46,
    height: 46,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceMuted,
    marginBottom: spacing.sm,
  },

  actionEmoji: {
    fontSize: 21,
    color: colors.brandDark,
  },

  actionArrow: {
    color: colors.brandDark,
    fontSize: 17,
    fontWeight: '900',
  },

  actionTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '900',
  },

  actionSubtitle: {
    color: colors.muted,
    fontSize: 11,
    lineHeight: 17,
    marginTop: 3,
    paddingRight: 6,
  },

  /* INFO CARDS */

  infoCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    padding: spacing.md,
    marginBottom: spacing.md,
  },

  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  infoIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.brandSoft,
    marginRight: spacing.sm,
  },

  infoIconText: {
    color: colors.brandDark,
    fontSize: 20,
    fontWeight: '900',
  },

  recyclerIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceMuted,
    marginRight: spacing.sm,
  },

  recyclerIconText: {
    color: colors.brandDark,
    fontSize: 24,
    fontWeight: '800',
  },

  infoHeading: {
    flex: 1,
  },

  cardEyebrow: {
    color: colors.muted,
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1,
  },

  cardTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '900',
    marginTop: 3,
  },

  arrow: {
    color: colors.muted,
    fontSize: 26,
    fontWeight: '300',
    marginLeft: 8,
  },

  infoDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.md,
  },

  emptyTitle: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '800',
  },

  emptyText: {
    color: colors.muted,
    fontSize: 11,
    lineHeight: 17,
    marginTop: 3,
  },

  /* RECYCLER */

  recyclerContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  locationPin: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceMuted,
    marginRight: spacing.sm,
  },

  locationPinText: {
    color: colors.brandDark,
    fontSize: 12,
  },

  recyclerText: {
    flex: 1,
  },

  /* SAFETY */

  safetyCard: {
    borderRadius: 20,
    padding: spacing.md,
    backgroundColor: '#FFF8E8',
    borderWidth: 1,
    borderColor: '#F3E2B8',
    marginTop: spacing.sm,
  },

  safetyTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  warningCircle: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF0C8',
    marginRight: spacing.sm,
  },

  warningText: {
    color: '#9A6A00',
    fontSize: 20,
    fontWeight: '900',
  },

  safetyTitleBlock: {
    flex: 1,
  },

  safetyEyebrow: {
    color: '#9A6A00',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1,
  },

  safetyTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '900',
    marginTop: 3,
  },

  safetyText: {
    color: colors.muted,
    fontSize: 11,
    lineHeight: 18,
    marginTop: spacing.md,
  },

  safetyFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.md,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: '#F3E2B8',
  },

  safetyFooterText: {
    color: '#80662B',
    fontSize: 10,
    fontWeight: '700',
  },

  safetyArrow: {
    color: '#80662B',
    fontSize: 17,
    fontWeight: '900',
  },

  /* FOOTER */

  footer: {
    alignItems: 'center',
    marginTop: spacing.xl,
    paddingHorizontal: 30,
  },

  footerRecycle: {
    color: colors.brandDark,
    fontSize: 24,
    marginBottom: 5,
  },

  footerTitle: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '900',
  },

  footerText: {
    color: colors.muted,
    fontSize: 10,
    lineHeight: 16,
    textAlign: 'center',
    marginTop: 3,
  },

  bottomSpace: {
    height: spacing.xl,
  },
});