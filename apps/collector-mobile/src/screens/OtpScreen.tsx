import { useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Button, Card, Field } from '../components/UI';
import { Screen } from '../components/Screen';

import type {
  AppLanguage,
  AppRoute,
  BusinessRole,
} from '../navigation/types';

import { colors, spacing, typography } from '../theme';

import {
  loginWithPhone,
  saveAuthSession,
} from '../services/authApi';

type Props = {
  language: AppLanguage;
  phone: string;
  onNavigate: (route: AppRoute) => void;
  onRoleDetected: (role: BusinessRole) => void;
};

export function OtpScreen({
  language,
  phone,
  onNavigate,
  onRoleDetected,
}: Props) {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const content = {
    en: {
      title: 'Verify your mobile',
      subtitle:
        'Enter the 6-digit OTP sent to your mobile number.',
      otpLabel: 'One-time password',
      otpPlaceholder: 'Enter 6-digit OTP',
      verify: 'Verify & Continue',
      resend: 'Resend OTP',
      change: 'Change mobile number',
      demoTitle: 'Development OTP',
      demo: 'For development, use OTP 123456.',
      error: 'Please enter a valid 6-digit OTP.',
      loginError:
        'Unable to sign in. Please try again.',
      sentTo: 'OTP sent to',
      verifying: 'Checking account...',
      registering:
        'Account not found. Opening registration...',
    },

    hi: {
      title: 'मोबाइल सत्यापित करें',
      subtitle:
        'आपके मोबाइल नंबर पर भेजा गया 6 अंकों का OTP दर्ज करें।',
      otpLabel: 'OTP',
      otpPlaceholder: '6 अंकों का OTP दर्ज करें',
      verify: 'सत्यापित करें',
      resend: 'OTP दोबारा भेजें',
      change: 'मोबाइल नंबर बदलें',
      demoTitle: 'डेवलपमेंट OTP',
      demo:
        'डेवलपमेंट के लिए OTP 123456 इस्तेमाल करें।',
      error:
        'कृपया सही 6 अंकों का OTP दर्ज करें।',
      loginError:
        'साइन इन नहीं हो सका। कृपया दोबारा प्रयास करें।',
      sentTo: 'OTP भेजा गया',
      verifying: 'अकाउंट चेक हो रहा है...',
      registering:
        'अकाउंट नहीं मिला। रजिस्ट्रेशन खोला जा रहा है...',
    },

    mr: {
      title: 'मोबाईल सत्यापित करा',
      subtitle:
        'तुमच्या मोबाईल नंबरवर पाठवलेला 6 अंकी OTP टाका.',
      otpLabel: 'OTP',
      otpPlaceholder: '6 अंकी OTP टाका',
      verify: 'Verify & Continue',
      resend: 'OTP पुन्हा पाठवा',
      change: 'मोबाईल नंबर बदला',
      demoTitle: 'डेव्हलपमेंट OTP',
      demo:
        'डेव्हलपमेंटसाठी OTP 123456 वापरा.',
      error:
        'कृपया योग्य 6 अंकी OTP टाका.',
      loginError:
        'साइन इन करता आले नाही. पुन्हा प्रयत्न करा.',
      sentTo: 'OTP पाठवला गेला',
      verifying: 'अकाउंट तपासत आहे...',
      registering:
        'अकाउंट सापडले नाही. रजिस्ट्रेशन उघडत आहे...',
    },
  };

  const text = content[language];

  async function handleVerify() {
    /* STEP 1: VALIDATE OTP */

    if (otp !== '123456') {
      setError(text.error);
      return;
    }

    /* STEP 2: CLEAN PHONE NUMBER */

    const cleanPhone = phone.replace(/\D/g, '');

    if (cleanPhone.length !== 10) {
      setError(text.loginError);
      return;
    }

    /* STEP 3: PREVENT DUPLICATE REQUESTS */

    if (loading) {
      return;
    }

    try {
      setLoading(true);
      setError('');

      /* STEP 4: LOGIN EXISTING ACCOUNT */

      const response =
        await loginWithPhone(cleanPhone);

      const user = response.user;

      console.log(
        'LOGIN USER:',
        user,
      );

      /* STEP 5: RECYCLER */

      if (user.role === 'RECYCLER') {
        onRoleDetected('Recycler');

        await saveAuthSession(
          response,
          'Recycler',
        );

        onNavigate('recyclerDashboard');

        return;
      }

      /* STEP 6: TRADER */

      if (
        user.businessRole === 'TRADER'
      ) {
        onRoleDetected('Trader');

        await saveAuthSession(
          response,
          'Trader',
        );

        onNavigate('traderDashboard');

        return;
      }

      /* STEP 7: MANUFACTURER */

      if (
        user.businessRole === 'MANUFACTURER'
      ) {
        onRoleDetected('Manufacturer');

        await saveAuthSession(
          response,
          'Manufacturer',
        );

        onNavigate(
          'manufacturerDashboard',
        );

        return;
      }

      /* STEP 8: COLLECTOR */

      if (user.role === 'COLLECTOR') {
        onRoleDetected('Collector');

        await saveAuthSession(
          response,
          'Collector',
        );

        onNavigate('dashboard');

        return;
      }

      /* STEP 9: UNKNOWN ACCOUNT */

      setError(
        'Unable to determine your account type.',
      );
    } catch (requestError) {
      console.error(
        'Authentication failed:',
        requestError,
      );

      const message =
        requestError instanceof Error
          ? requestError.message
          : '';

      /* STEP 10: ACCOUNT NOT FOUND */

      if (
        message
          .toLowerCase()
          .includes('account not found')
      ) {
        setError(text.registering);

        setTimeout(() => {
          onNavigate('register');
        }, 800);

        return;
      }

      /* STEP 11: OTHER AUTH ERRORS */

      setError(
        message || text.loginError,
      );
    } finally {
      setLoading(false);
    }
  }

  function handleOtpChange(
    value: string,
  ) {
    const cleanValue = value
      .replace(/\D/g, '')
      .slice(0, 6);

    setOtp(cleanValue);
    setError('');
  }

  function handleResend() {
    setOtp('');
    setError('');
  }

  function handleChangePhone() {
    if (loading) {
      return;
    }

    setOtp('');
    setError('');

    onNavigate('login');
  }

  return (
    <Screen
      title={text.title}
      subtitle={text.subtitle}
    >
      {/* Verification Hero */}

      <View style={styles.hero}>
        <View style={styles.heroIcon}>
          <Text style={styles.heroIconText}>
            ✓
          </Text>
        </View>

        <View style={styles.heroContent}>
          <Text style={styles.heroEyebrow}>
            SECURE VERIFICATION
          </Text>

          <Text style={styles.heroTitle}>
            Almost there
          </Text>

          <Text style={styles.heroText}>
            Verify your mobile number to securely
            access your account.
          </Text>
        </View>
      </View>

      {/* Mobile Number */}

      <View style={styles.numberCard}>
        <View style={styles.phoneIcon}>
          <Text style={styles.phoneIconText}>
            ☎
          </Text>
        </View>

        <View style={styles.numberContent}>
          <Text style={styles.numberLabel}>
            {text.sentTo}
          </Text>

          <Text style={styles.phone}>
            {phone || 'Your mobile number'}
          </Text>
        </View>

        <View style={styles.verifiedBadge}>
          <Text style={styles.verifiedText}>
            OTP
          </Text>
        </View>
      </View>

      {/* OTP Card */}

      <Card accent>
        <View style={styles.formHeader}>
          <View>
            <Text style={styles.formTitle}>
              Enter verification code
            </Text>

            <Text style={styles.formSubtitle}>
              Use the 6-digit code to continue.
            </Text>
          </View>

          <View style={styles.lockIcon}>
            <Text style={styles.lockText}>
              🔐
            </Text>
          </View>
        </View>

        <Field
          label={text.otpLabel}
          placeholder={text.otpPlaceholder}
          value={otp}
          onChangeText={handleOtpChange}
          keyboardType="number-pad"
          maxLength={6}
        />

        {/* OTP Progress */}

        <View style={styles.otpProgress}>
          {[0, 1, 2, 3, 4, 5].map(
            (index) => (
              <View
                key={index}
                style={[
                  styles.otpDot,
                  index < otp.length &&
                    styles.otpDotFilled,
                ]}
              />
            ),
          )}
        </View>

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

        <Button
          label={
            loading
              ? text.verifying
              : text.verify
          }
          onPress={handleVerify}
        />

        <View style={styles.actions}>
          <Button
            label={text.resend}
            variant="secondary"
            onPress={handleResend}
          />

          <Button
            label={text.change}
            variant="quiet"
            onPress={handleChangePhone}
          />
        </View>
      </Card>

      {/* Security Information */}

      <View style={styles.securityBox}>
        <View style={styles.securityIcon}>
          <Text style={styles.securityIconText}>
            🛡️
          </Text>
        </View>

        <View style={styles.securityContent}>
          <Text style={styles.securityTitle}>
            Secure account access
          </Text>

          <Text style={styles.securityText}>
            Your verification helps protect your
            account and keeps your recovery data secure.
          </Text>
        </View>
      </View>

      {/* Development Information */}

      <View style={styles.demoBox}>
        <View style={styles.demoIcon}>
          <Text style={styles.demoIconText}>
            i
          </Text>
        </View>

        <View style={styles.demoContent}>
          <Text style={styles.demoTitle}>
            {text.demoTitle}
          </Text>

          <Text style={styles.demoText}>
            {text.demo}
          </Text>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  /* Hero */

  hero: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.brand,
    borderRadius: 22,
    padding: spacing.md,
    marginBottom: spacing.md,
    overflow: 'hidden',
  },

  heroIcon: {
    width: 52,
    height: 52,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },

  heroIconText: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: '900',
  },

  heroContent: {
    flex: 1,
  },

  heroEyebrow: {
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 1.3,
    color: 'rgba(255,255,255,0.62)',
    marginBottom: 3,
  },

  heroTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
  },

  heroText: {
    fontSize: 10,
    lineHeight: 15,
    color: 'rgba(255,255,255,0.72)',
    marginTop: 3,
  },

  /* Number */

  numberCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    padding: spacing.md,
    marginBottom: spacing.md,
  },

  phoneIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: colors.brandSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },

  phoneIconText: {
    fontSize: 19,
    color: colors.brand,
  },

  numberContent: {
    flex: 1,
  },

  numberLabel: {
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 1,
    color: colors.muted,
    marginBottom: 3,
  },

  phone: {
    fontSize: 17,
    fontWeight: '900',
    color: colors.ink,
    letterSpacing: 0.3,
  },

  verifiedBadge: {
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 9,
    backgroundColor: colors.brandSoft,
  },

  verifiedText: {
    fontSize: 8,
    fontWeight: '900',
    color: colors.brand,
    letterSpacing: 0.8,
  },

  /* Form */

  formHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },

  formTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: colors.ink,
  },

  formSubtitle: {
    fontSize: 10,
    color: colors.muted,
    marginTop: 3,
  },

  lockIcon: {
    width: 40,
    height: 40,
    borderRadius: 13,
    backgroundColor: colors.brandSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },

  lockText: {
    fontSize: 18,
  },

  /* OTP Progress */

  otpProgress: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
    marginBottom: spacing.md,
    gap: 7,
  },

  otpDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.border,
  },

  otpDotFilled: {
    width: 20,
    backgroundColor: colors.brand,
  },

  /* Error */

  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3F3',
    borderWidth: 1,
    borderColor: '#F3D0D0',
    borderRadius: 13,
    paddingHorizontal: spacing.sm,
    paddingVertical: 9,
    marginBottom: spacing.md,
  },

  errorIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.danger,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },

  errorIconText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
  },

  error: {
    flex: 1,
    color: colors.danger,
    fontSize: 11,
    lineHeight: 16,
    fontWeight: '600',
  },

  /* Actions */

  actions: {
    marginTop: spacing.sm,
    gap: spacing.sm,
  },

  /* Security */

  securityBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.brandSoft,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 18,
    padding: spacing.md,
    marginTop: spacing.md,
  },

  securityIcon: {
    width: 40,
    height: 40,
    borderRadius: 13,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },

  securityIconText: {
    fontSize: 20,
  },

  securityContent: {
    flex: 1,
  },

  securityTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: colors.ink,
  },

  securityText: {
    fontSize: 10,
    lineHeight: 16,
    color: colors.muted,
    marginTop: 3,
  },

  /* Demo */

  demoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
    padding: spacing.md,
    borderRadius: 18,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },

  demoIcon: {
    width: 34,
    height: 34,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.brand,
    marginRight: spacing.sm,
  },

  demoIconText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
  },

  demoContent: {
    flex: 1,
  },

  demoTitle: {
    ...typography.label,
    marginBottom: 3,
  },

  demoText: {
    color: colors.muted,
    fontSize: 10,
    lineHeight: 16,
  },
});