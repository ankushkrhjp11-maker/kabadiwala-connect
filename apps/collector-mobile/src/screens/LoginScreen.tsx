import { useState } from 'react';

import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  Button,
  Card,
  Field,
} from '../components/UI';

import { Screen } from '../components/Screen';

import type {
  AppLanguage,
  AppRoute,
} from '../navigation/types';

import {
  colors,
  spacing,
  typography,
} from '../theme';

type Props = {
  language: AppLanguage;
  onNavigate: (route: AppRoute) => void;
  onPhoneChange: (phone: string) => void;
};

export function LoginScreen({
  language,
  onNavigate,
  onPhoneChange,
}: Props) {
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

  const label =
    language === 'hi'
      ? 'मोबाइल नंबर'
      : language === 'mr'
        ? 'मोबाईल नंबर'
        : 'Mobile number';

  const helper =
    language === 'hi'
      ? 'अपने खाते से जुड़े 10 अंकों का मोबाइल नंबर दर्ज करें।'
      : language === 'mr'
        ? 'तुमच्या खात्याशी जोडलेला 10 अंकी मोबाईल नंबर टाका.'
        : 'Enter the 10-digit mobile number linked to your account.';

  const handlePhoneChange = (value: string) => {
    const cleaned = value
      .replace(/\D/g, '')
      .slice(0, 10);

    setPhone(cleaned);
    onPhoneChange(cleaned);
    setError('');
  };

  const handleSendOtp = () => {
    if (phone.length === 10) {
      onNavigate('otp');
      return;
    }

    setError(
      'Please enter a valid 10-digit mobile number.',
    );
  };

  return (
    <Screen
      title="Welcome"
      subtitle="Sign in to continue your recycling journey."
    >
      {/* =================================================
          HERO
         ================================================= */}

      <View style={styles.hero}>
        <View style={styles.heroIcon}>
          <Text style={styles.heroIconText}>
            ♻
          </Text>
        </View>

        <View style={styles.heroContent}>
          <Text style={styles.heroEyebrow}>
            KABADIWALA CONNECT
          </Text>

          <Text style={styles.heroTitle}>
            Welcome back
          </Text>

          <Text style={styles.heroText}>
            Manage your collection, lots and earnings
            from one simple place.
          </Text>
        </View>
      </View>

      {/* =================================================
          LOGIN CARD
         ================================================= */}

      <Card accent>
        <View style={styles.cardHeader}>
          <View>
            <Text style={styles.cardTitle}>
              Sign in
            </Text>

            <Text style={styles.cardSubtitle}>
              Use your registered mobile number
            </Text>
          </View>

          <View style={styles.secureBadge}>
            <Text style={styles.secureIcon}>
              🔒
            </Text>

            <Text style={styles.secureText}>
              Secure
            </Text>
          </View>
        </View>

        {/* Mobile field */}

        <View style={styles.fieldSection}>
          <Field
            label={label}
            placeholder="10-digit mobile number"
            value={phone}
            onChangeText={handlePhoneChange}
          />

          <Text style={styles.helper}>
            {helper}
          </Text>
        </View>

        {/* Phone progress */}

        <View style={styles.progressRow}>
          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                {
                  width:
                    phone.length === 0
                      ? '0%'
                      : `${phone.length * 10}%`,
                },
              ]}
            />
          </View>

          <Text style={styles.progressText}>
            {phone.length}/10
          </Text>
        </View>

        {/* Error */}

        {error ? (
          <View style={styles.errorBox}>
            <View style={styles.errorIcon}>
              <Text style={styles.errorIconText}>
                !
              </Text>
            </View>

            <Text style={styles.error}>
              {error}
            </Text>
          </View>
        ) : null}

        {/* Button */}

        <Button
          label="Send OTP"
          onPress={handleSendOtp}
        />

        <Text style={styles.otpInfo}>
          You will receive a verification code on
          your registered number.
        </Text>
      </Card>

      {/* =================================================
          OFFLINE / LOW NETWORK
         ================================================= */}

      <View style={styles.networkCard}>
        <View style={styles.networkIcon}>
          <Text style={styles.networkIconText}>
            ⌁
          </Text>
        </View>

        <View style={styles.networkContent}>
          <Text style={styles.networkTitle}>
            Designed for low-network areas
          </Text>

          <Text style={styles.networkText}>
            Your saved collection work stays on your
            phone and syncs when connectivity returns.
          </Text>
        </View>

        <View style={styles.onlineDot} />
      </View>

      {/* =================================================
          TRUST MESSAGE
         ================================================= */}

      <View style={styles.trust}>
        <Text style={styles.trustIcon}>
          ✓
        </Text>

        <Text style={styles.trustText}>
          Simple • Secure • Built for recyclers
        </Text>
      </View>
    </Screen>
  );
}

/* =====================================================
   STYLES
   ===================================================== */

const styles = StyleSheet.create({
  /* -----------------------------------------------------
     HERO
     ----------------------------------------------------- */

  hero: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.brandSoft,
    borderRadius: 22,
    padding: spacing.md,
    marginBottom: spacing.md,
  },

  heroIcon: {
    width: 62,
    height: 62,
    borderRadius: 20,
    backgroundColor: colors.brand,
    alignItems: 'center',
    justifyContent: 'center',
  },

  heroIconText: {
    color: '#FFFFFF',
    fontSize: 35,
    fontWeight: '800',
  },

  heroContent: {
    flex: 1,
    marginLeft: spacing.sm,
  },

  heroEyebrow: {
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 1.2,
    color: colors.brand,
  },

  heroTitle: {
    fontSize: 21,
    fontWeight: '900',
    color: colors.ink,
    marginTop: 3,
  },

  heroText: {
    fontSize: 10,
    lineHeight: 16,
    color: colors.muted,
    marginTop: 4,
  },

  /* -----------------------------------------------------
     LOGIN CARD
     ----------------------------------------------------- */

  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },

  cardTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: colors.ink,
  },

  cardSubtitle: {
    fontSize: 10,
    color: colors.muted,
    marginTop: 3,
  },

  secureBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.brandSoft,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 5,
  },

  secureIcon: {
    fontSize: 10,
  },

  secureText: {
    fontSize: 8,
    fontWeight: '900',
    color: colors.brand,
    marginLeft: 4,
  },

  fieldSection: {
    marginTop: spacing.xs,
  },

  helper: {
    fontSize: 9,
    lineHeight: 14,
    color: colors.muted,
    marginTop: 5,
  },

  /* -----------------------------------------------------
     PHONE PROGRESS
     ----------------------------------------------------- */

  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
    marginBottom: spacing.md,
  },

  progressTrack: {
    flex: 1,
    height: 5,
    backgroundColor: colors.border,
    borderRadius: 999,
    overflow: 'hidden',
  },

  progressFill: {
    height: '100%',
    backgroundColor: colors.brand,
    borderRadius: 999,
  },

  progressText: {
    width: 34,
    textAlign: 'right',
    fontSize: 9,
    fontWeight: '800',
    color: colors.muted,
  },

  /* -----------------------------------------------------
     ERROR
     ----------------------------------------------------- */

  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF0EE',
    borderRadius: 12,
    padding: spacing.sm,
    marginBottom: spacing.sm,
  },

  errorIcon: {
    width: 23,
    height: 23,
    borderRadius: 8,
    backgroundColor: colors.danger,
    alignItems: 'center',
    justifyContent: 'center',
  },

  errorIconText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
  },

  error: {
    flex: 1,
    color: colors.danger,
    fontSize: 10,
    fontWeight: '700',
    marginLeft: spacing.xs,
  },

  /* -----------------------------------------------------
     OTP INFO
     ----------------------------------------------------- */

  otpInfo: {
    fontSize: 9,
    lineHeight: 14,
    color: colors.muted,
    textAlign: 'center',
    marginTop: spacing.sm,
  },

  /* -----------------------------------------------------
     NETWORK CARD
     ----------------------------------------------------- */

  networkCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F6F8F7',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 18,
    padding: spacing.md,
    marginTop: spacing.lg,
  },

  networkIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: colors.brandSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },

  networkIconText: {
    fontSize: 25,
    color: colors.brand,
  },

  networkContent: {
    flex: 1,
    marginLeft: spacing.sm,
  },

  networkTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: colors.ink,
  },

  networkText: {
    fontSize: 9,
    lineHeight: 14,
    color: colors.muted,
    marginTop: 3,
  },

  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.brand,
    marginLeft: spacing.sm,
  },

  /* -----------------------------------------------------
     TRUST
     ----------------------------------------------------- */

  trust: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.lg,
  },

  trustIcon: {
    width: 19,
    height: 19,
    borderRadius: 7,
    backgroundColor: colors.brandSoft,
    color: colors.brand,
    textAlign: 'center',
    lineHeight: 19,
    fontSize: 10,
    fontWeight: '900',
    overflow: 'hidden',
  },

  trustText: {
    fontSize: 9,
    color: colors.muted,
    fontWeight: '700',
    marginLeft: 6,
  },
});