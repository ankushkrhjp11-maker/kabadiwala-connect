import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Screen } from '../components/Screen';
import { Card } from '../components/UI';
import { colors, spacing, typography } from '../theme';

type SafetyScreenProps = {
  onBack: () => void;
};

const tips = [
  {
    icon: '🔋',
    tag: 'BATTERY',
    title: 'Battery & swelling',
    body: 'Never puncture, open or crush a swollen battery. Keep it away from heat, fire and metal objects.',
    action: 'Stop handling if swollen',
    level: 'HIGH',
  },
  {
    icon: '🧤',
    tag: 'PROTECTION',
    title: 'Protect your hands',
    body: 'Always use gloves. Avoid direct contact with broken glass, sharp metal or unknown powder.',
    action: 'Wear gloves before sorting',
    level: 'MEDIUM',
  },
  {
    icon: '⚡',
    tag: 'ELECTRICAL',
    title: 'Disconnect power',
    body: 'Unplug electronic devices before handling them. Never dismantle equipment connected to electricity.',
    action: 'Power off first',
    level: 'HIGH',
  },
];

export function SafetyScreen({
  onBack,
}: SafetyScreenProps) {
  return (
    <Screen
      title="Safety first"
      subtitle="Protect yourself while handling e-waste."
      showBack
      onBack={onBack}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* HERO */}
        <View style={styles.hero}>
          <View style={styles.heroIcon}>
            <Text style={styles.heroIconText}>
              🛡️
            </Text>
          </View>

          <View style={styles.heroText}>
            <Text style={styles.heroEyebrow}>
              SAFETY GUIDE
            </Text>

            <Text style={styles.heroTitle}>
              Stay safe. Work smart.
            </Text>

            <Text style={styles.heroDescription}>
              A few simple habits can protect you,
              your family and the environment.
            </Text>
          </View>
        </View>

        {/* WARNING */}
        <View style={styles.warning}>
          <View style={styles.warningIcon}>
            <Text style={styles.warningIconText}>
              !
            </Text>
          </View>

          <View style={styles.warningContent}>
            <Text style={styles.warningTitle}>
              Something looks unsafe?
            </Text>

            <Text style={styles.warningText}>
              Stop handling it and ask an authorized
              person for help.
            </Text>
          </View>
        </View>

        {/* SECTION HEADER */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>
              Essential precautions
            </Text>

            <Text style={styles.sectionSubtitle}>
              Remember these before sorting
            </Text>
          </View>

          <View style={styles.tipCount}>
            <Text style={styles.tipCountText}>
              {tips.length}
            </Text>
          </View>
        </View>

        {/* SAFETY CARDS */}
        {tips.map((tip, index) => (
          <Card key={tip.title}>
            <View style={styles.cardTop}>
              <View style={styles.iconBox}>
                <Text style={styles.icon}>
                  {tip.icon}
                </Text>
              </View>

              <View style={styles.cardHeading}>
                <Text style={styles.tag}>
                  {tip.tag}
                </Text>

                <Text style={styles.title}>
                  {tip.title}
                </Text>
              </View>

              <View
                style={[
                  styles.levelBadge,
                  tip.level === 'HIGH'
                    ? styles.highBadge
                    : styles.mediumBadge,
                ]}
              >
                <Text
                  style={[
                    styles.levelText,
                    tip.level === 'HIGH'
                      ? styles.highText
                      : styles.mediumText,
                  ]}
                >
                  {tip.level}
                </Text>
              </View>
            </View>

            <Text style={styles.body}>
              {tip.body}
            </Text>

            <View style={styles.actionBox}>
              <View style={styles.actionIcon}>
                <Text style={styles.actionIconText}>
                  ✓
                </Text>
              </View>

              <Text style={styles.actionText}>
                {tip.action}
              </Text>
            </View>

            <Pressable
              onPress={() => {
                console.log(
                  `Listen safety tip ${index + 1}`,
                );
              }}
              style={({ pressed }) => [
                styles.listenButton,
                pressed && styles.pressed,
              ]}
            >
              <Text style={styles.listenIcon}>
                🔊
              </Text>

              <Text style={styles.listenText}>
                Tap to hear this tip
              </Text>

              <Text style={styles.arrow}>
                →
              </Text>
            </Pressable>
          </Card>
        ))}

        {/* QUICK CHECK */}
        <View style={styles.checkCard}>
          <View style={styles.checkHeader}>
            <View style={styles.checkIcon}>
              <Text style={styles.checkIconText}>
                ✓
              </Text>
            </View>

            <View>
              <Text style={styles.checkTitle}>
                Quick safety check
              </Text>

              <Text style={styles.checkSubtitle}>
                Before you start collecting
              </Text>
            </View>
          </View>

          <View style={styles.checkList}>
            <CheckItem text="Power disconnected" />
            <CheckItem text="Gloves available" />
            <CheckItem text="No swollen battery" />
            <CheckItem text="Work area is clear" />
          </View>
        </View>

        {/* BOTTOM MESSAGE */}
        <View style={styles.bottomMessage}>
          <Text style={styles.bottomEmoji}>
            ♻️
          </Text>

          <Text style={styles.bottomTitle}>
            Safe collection means responsible recycling.
          </Text>

          <Text style={styles.bottomText}>
            When in doubt, don't take the risk.
            Ask for verification.
          </Text>
        </View>
      </ScrollView>
    </Screen>
  );
}

/* =====================================================
   CHECK ITEM
   ===================================================== */

function CheckItem({
  text,
}: {
  text: string;
}) {
  return (
    <View style={styles.checkItem}>
      <View style={styles.smallCheck}>
        <Text style={styles.smallCheckText}>
          ✓
        </Text>
      </View>

      <Text style={styles.checkItemText}>
        {text}
      </Text>
    </View>
  );
}

/* =====================================================
   STYLES
   ===================================================== */

const styles = StyleSheet.create({
  content: {
    paddingBottom: 40,
  },

  /* HERO */

  hero: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.brand,
    borderRadius: 24,
    padding: spacing.md,
    marginBottom: spacing.md,
  },

  heroIcon: {
    width: 62,
    height: 62,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  heroIconText: {
    fontSize: 32,
  },

  heroText: {
    flex: 1,
    marginLeft: spacing.sm,
  },

  heroEyebrow: {
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.3,
    color: 'rgba(255,255,255,0.75)',
  },

  heroTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FFFFFF',
    marginTop: 3,
  },

  heroDescription: {
    fontSize: 11,
    lineHeight: 17,
    color: 'rgba(255,255,255,0.86)',
    marginTop: 5,
  },

  /* WARNING */

  warning: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF5E5',
    borderWidth: 1,
    borderColor: '#F4D39A',
    borderRadius: 18,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },

  warningIcon: {
    width: 38,
    height: 38,
    borderRadius: 13,
    backgroundColor: '#F3A51C',
    alignItems: 'center',
    justifyContent: 'center',
  },

  warningIconText: {
    color: '#FFFFFF',
    fontSize: 21,
    fontWeight: '900',
  },

  warningContent: {
    flex: 1,
    marginLeft: spacing.sm,
  },

  warningTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: '#7B5000',
  },

  warningText: {
    fontSize: 10,
    lineHeight: 15,
    color: '#876B35',
    marginTop: 3,
  },

  /* SECTION */

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: colors.ink,
  },

  sectionSubtitle: {
    fontSize: 10,
    color: colors.muted,
    marginTop: 3,
  },

  tipCount: {
    width: 34,
    height: 34,
    borderRadius: 12,
    backgroundColor: colors.brandSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },

  tipCountText: {
    fontSize: 13,
    fontWeight: '900',
    color: colors.brand,
  },

  /* CARD */

  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  iconBox: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: colors.brandSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },

  icon: {
    fontSize: 26,
  },

  cardHeading: {
    flex: 1,
    marginLeft: spacing.sm,
  },

  tag: {
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 1,
    color: colors.brand,
  },

  title: {
    fontSize: 16,
    fontWeight: '900',
    color: colors.ink,
    marginTop: 3,
  },

  levelBadge: {
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 5,
  },

  highBadge: {
    backgroundColor: '#FFE8E5',
  },

  mediumBadge: {
    backgroundColor: '#FFF3D8',
  },

  levelText: {
    fontSize: 8,
    fontWeight: '900',
  },

  highText: {
    color: '#C33B2D',
  },

  mediumText: {
    color: '#A66A00',
  },

  body: {
    ...typography.body,
    color: colors.muted,
    lineHeight: 19,
    marginTop: spacing.md,
  },

  /* ACTION */

  actionBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7F9F8',
    borderRadius: 13,
    padding: spacing.sm,
    marginTop: spacing.md,
  },

  actionIcon: {
    width: 25,
    height: 25,
    borderRadius: 9,
    backgroundColor: colors.brandSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },

  actionIconText: {
    fontSize: 12,
    fontWeight: '900',
    color: colors.brand,
  },

  actionText: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.ink,
    marginLeft: spacing.xs,
  },

  /* LISTEN */

  listenButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.md,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },

  listenIcon: {
    fontSize: 15,
  },

  listenText: {
    flex: 1,
    fontSize: 11,
    fontWeight: '800',
    color: colors.brand,
    marginLeft: spacing.xs,
  },

  arrow: {
    fontSize: 18,
    fontWeight: '900',
    color: colors.brand,
  },

  pressed: {
    opacity: 0.55,
  },

  /* QUICK CHECK */

  checkCard: {
    backgroundColor: '#F2F8F5',
    borderWidth: 1,
    borderColor: '#D7E9DF',
    borderRadius: 22,
    padding: spacing.md,
    marginTop: spacing.sm,
  },

  checkHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  checkIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: colors.brand,
    alignItems: 'center',
    justifyContent: 'center',
  },

  checkIconText: {
    color: '#FFFFFF',
    fontSize: 19,
    fontWeight: '900',
  },

  checkTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: colors.ink,
    marginLeft: spacing.sm,
  },

  checkSubtitle: {
    fontSize: 10,
    color: colors.muted,
    marginLeft: spacing.sm,
    marginTop: 2,
  },

  checkList: {
    marginTop: spacing.md,
    gap: spacing.sm,
  },

  checkItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  smallCheck: {
    width: 23,
    height: 23,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  smallCheckText: {
    fontSize: 11,
    fontWeight: '900',
    color: colors.brand,
  },

  checkItemText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.ink,
    marginLeft: spacing.sm,
  },

  /* BOTTOM */

  bottomMessage: {
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.lg,
  },

  bottomEmoji: {
    fontSize: 25,
  },

  bottomTitle: {
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '900',
    color: colors.ink,
    marginTop: spacing.xs,
  },

  bottomText: {
    textAlign: 'center',
    fontSize: 10,
    lineHeight: 16,
    color: colors.muted,
    marginTop: 4,
  },
});