import { useState } from 'react';

import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import type {
  AppLanguage,
  AppRoute,
} from '../navigation/types';

type RegisterScreenProps = {
  language: AppLanguage;
  onNavigate: (route: AppRoute) => void;
  onRegisterStart?: (data: {
    name: string;
    phone: string;
  }) => void;
};

export function RegisterScreen({
  language,
  onNavigate,
  onRegisterStart,
}: RegisterScreenProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const isHindi = language === 'hi';
  const isMarathi = language === 'mr';

  const handleContinue = () => {
    const cleanName = name.trim();
    const cleanPhone = phone.replace(/\D/g, '');

    if (!cleanName) {
      Alert.alert(
        isHindi
          ? 'नाम जरूरी है'
          : isMarathi
            ? 'नाव आवश्यक आहे'
            : 'Name required',
        isHindi
          ? 'कृपया अपना नाम दर्ज करें।'
          : isMarathi
            ? 'कृपया तुमचे नाव टाका.'
            : 'Please enter your name.',
      );
      return;
    }

    if (cleanName.length < 2) {
      Alert.alert(
        isHindi
          ? 'अमान्य नाम'
          : isMarathi
            ? 'अवैध नाव'
            : 'Invalid name',
        isHindi
          ? 'कृपया सही नाम दर्ज करें।'
          : isMarathi
            ? 'कृपया योग्य नाव टाका.'
            : 'Please enter a valid name.',
      );
      return;
    }

    if (cleanPhone.length < 10) {
      Alert.alert(
        isHindi
          ? 'अमान्य मोबाइल नंबर'
          : isMarathi
            ? 'अवैध मोबाईल नंबर'
            : 'Invalid mobile number',
        isHindi
          ? 'कृपया सही मोबाइल नंबर दर्ज करें।'
          : isMarathi
            ? 'कृपया योग्य मोबाईल नंबर टाका.'
            : 'Please enter a valid mobile number.',
      );
      return;
    }

    /*
     * Registration data is handled by AppNavigator.
     * Do not navigate manually from here.
     */
    onRegisterStart?.({
      name: cleanName,
      phone: cleanPhone,
    });
  };

  const nameProgress = Math.min(name.trim().length / 2, 1);
  const phoneProgress = Math.min(phone.length / 10, 1);

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={
          Platform.OS === 'ios'
            ? 'padding'
            : undefined
        }
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* =================================================
              TOP BRAND
             ================================================= */}

          <View style={styles.topBar}>
            <View style={styles.brandIcon}>
              <Text style={styles.brandIconText}>
                ♻
              </Text>
            </View>

            <View style={styles.brandContent}>
              <Text style={styles.brandName}>
                Kabadiwala Connect
              </Text>

              <Text style={styles.brandSubtitle}>
                Smart recycling • Better earnings
              </Text>
            </View>

            <View style={styles.stepBadge}>
              <Text style={styles.stepText}>
                01
              </Text>
            </View>
          </View>

          {/* =================================================
              HERO
             ================================================= */}

          <View style={styles.hero}>
            <View style={styles.heroCircle}>
              <Text style={styles.heroEmoji}>
                👋
              </Text>
            </View>

            <Text style={styles.heroEyebrow}>
              GET STARTED
            </Text>

            <Text style={styles.title}>
              {isHindi
                ? 'अपना अकाउंट बनाएं'
                : isMarathi
                  ? 'तुमचे खाते तयार करा'
                  : 'Create your account'}
            </Text>

            <Text style={styles.subtitle}>
              {isHindi
                ? 'कुछ आसान जानकारी भरकर शुरुआत करें'
                : isMarathi
                  ? 'काही सोपी माहिती भरून सुरुवात करा'
                  : 'A few simple details and you are ready to go'}
            </Text>
          </View>

          {/* =================================================
              PROGRESS
             ================================================= */}

          <View style={styles.progressCard}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressTitle}>
                Profile setup
              </Text>

              <Text style={styles.progressValue}>
                {name.trim() && phone.length === 10
                  ? 'Complete'
                  : 'Step 1 of 2'}
              </Text>
            </View>

            <View style={styles.progressTrack}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width:
                      name.trim() && phone.length === 10
                        ? '100%'
                        : `${Math.max(
                            nameProgress * 50 +
                              phoneProgress * 50,
                            5,
                          )}%`,
                  },
                ]}
              />
            </View>

            <View style={styles.progressSteps}>
              <View style={styles.progressStep}>
                <View
                  style={[
                    styles.progressDot,
                    name.trim() && styles.progressDotActive,
                  ]}
                >
                  <Text style={styles.progressDotText}>
                    1
                  </Text>
                </View>

                <Text style={styles.progressStepText}>
                  Your details
                </Text>
              </View>

              <View style={styles.progressStep}>
                <View
                  style={[
                    styles.progressDot,
                    phone.length === 10 &&
                      styles.progressDotActive,
                  ]}
                >
                  <Text style={styles.progressDotText}>
                    2
                  </Text>
                </View>

                <Text style={styles.progressStepText}>
                  Your role
                </Text>
              </View>
            </View>
          </View>

          {/* =================================================
              FORM CARD
             ================================================= */}

          <View style={styles.formCard}>
            <View style={styles.formHeader}>
              <View>
                <Text style={styles.formTitle}>
                  Your information
                </Text>

                <Text style={styles.formSubtitle}>
                  Tell us a little about yourself
                </Text>
              </View>

              <View style={styles.requiredBadge}>
                <Text style={styles.requiredText}>
                  REQUIRED
                </Text>
              </View>
            </View>

            {/* Name */}

            <View style={styles.fieldGroup}>
              <View style={styles.labelRow}>
                <Text style={styles.label}>
                  {isHindi
                    ? 'पूरा नाम'
                    : isMarathi
                      ? 'पूर्ण नाव'
                      : 'Full Name'}
                </Text>

                <Text style={styles.requiredStar}>
                  *
                </Text>
              </View>

              <View
                style={[
                  styles.inputContainer,
                  name.trim().length >= 2 &&
                    styles.inputContainerActive,
                ]}
              >
                <View style={styles.inputIcon}>
                  <Text style={styles.inputIconText}>
                    👤
                  </Text>
                </View>

                <TextInput
                  value={name}
                  onChangeText={setName}
                  placeholder={
                    isHindi
                      ? 'अपना नाम दर्ज करें'
                      : isMarathi
                        ? 'तुमचे नाव टाका'
                        : 'Enter your name'
                  }
                  placeholderTextColor="#9AA39D"
                  autoCapitalize="words"
                  autoCorrect={false}
                  style={styles.input}
                />

                {name.trim().length >= 2 ? (
                  <View style={styles.validIcon}>
                    <Text style={styles.validIconText}>
                      ✓
                    </Text>
                  </View>
                ) : null}
              </View>

              <Text style={styles.fieldHint}>
                Use the name you normally use for collection work.
              </Text>
            </View>

            {/* Phone */}

            <View style={styles.fieldGroup}>
              <View style={styles.labelRow}>
                <Text style={styles.label}>
                  {isHindi
                    ? 'मोबाइल नंबर'
                    : isMarathi
                      ? 'मोबाईल नंबर'
                      : 'Mobile Number'}
                </Text>

                <Text style={styles.requiredStar}>
                  *
                </Text>
              </View>

              <View
                style={[
                  styles.phoneContainer,
                  phone.length === 10 &&
                    styles.inputContainerActive,
                ]}
              >
                <View style={styles.countryCodeBox}>
                  <Text style={styles.flag}>
                    🇮🇳
                  </Text>

                  <Text style={styles.countryCode}>
                    +91
                  </Text>
                </View>

                <View style={styles.divider} />

                <TextInput
                  value={phone}
                  onChangeText={(value) => {
                    const digits = value
                      .replace(/\D/g, '')
                      .slice(0, 10);

                    setPhone(digits);
                  }}
                  placeholder={
                    isHindi
                      ? '10 अंकों का नंबर'
                      : isMarathi
                        ? '10 अंकी नंबर'
                        : '10-digit mobile number'
                  }
                  placeholderTextColor="#9AA39D"
                  keyboardType="phone-pad"
                  maxLength={10}
                  style={styles.phoneInput}
                />

                {phone.length === 10 ? (
                  <View style={styles.validIcon}>
                    <Text style={styles.validIconText}>
                      ✓
                    </Text>
                  </View>
                ) : null}
              </View>

              <View style={styles.phoneMeta}>
                <Text style={styles.fieldHint}>
                  {isHindi
                    ? 'OTP से आपका नंबर सुरक्षित रहेगा।'
                    : isMarathi
                      ? 'OTP द्वारे तुमचा नंबर सुरक्षित राहील.'
                      : 'Your number will be secured using OTP.'}
                </Text>

                <Text style={styles.counter}>
                  {phone.length}/10
                </Text>
              </View>
            </View>
          </View>

          {/* =================================================
              TRUST CARD
             ================================================= */}

          <View style={styles.trustCard}>
            <View style={styles.trustIcon}>
              <Text style={styles.trustIconText}>
                🔒
              </Text>
            </View>

            <View style={styles.trustContent}>
              <Text style={styles.trustTitle}>
                Your information stays protected
              </Text>

              <Text style={styles.trustText}>
                We use your mobile number only for account
                verification and secure access.
              </Text>
            </View>
          </View>

          {/* =================================================
              CONTINUE BUTTON
             ================================================= */}

          <Pressable
            style={({ pressed }) => [
              styles.button,
              pressed && styles.buttonPressed,
            ]}
            onPress={handleContinue}
          >
            <View style={styles.buttonContent}>
              <Text style={styles.buttonText}>
                {isHindi
                  ? 'आगे बढ़ें'
                  : isMarathi
                    ? 'पुढे जा'
                    : 'Continue'}
              </Text>

              <View style={styles.buttonArrow}>
                <Text style={styles.arrowText}>
                  →
                </Text>
              </View>
            </View>
          </Pressable>

          {/* =================================================
              LOGIN
             ================================================= */}

          <Pressable
            onPress={() => onNavigate('login')}
            style={({ pressed }) => [
              styles.loginButton,
              pressed && styles.loginPressed,
            ]}
          >
            <Text style={styles.loginText}>
              {isHindi
                ? 'पहले से अकाउंट है? '
                : isMarathi
                  ? 'आधीच खाते आहे? '
                  : 'Already have an account? '}

              <Text style={styles.loginHighlight}>
                {isHindi
                  ? 'लॉगिन करें'
                  : isMarathi
                    ? 'लॉगिन करा'
                    : 'Login'}
              </Text>
            </Text>
          </Pressable>

          {/* =================================================
              FOOTER
             ================================================= */}

          <View style={styles.footer}>
            <View style={styles.footerLine} />

            <Text style={styles.footerText}>
              ♻  Building a cleaner circular economy
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

/* =========================================================
   STYLES
   ========================================================= */

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F4F7F5',
  },

  flex: {
    flex: 1,
  },

  container: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 30,
  },

  /* -------------------------------------------------------
     BRAND
     ------------------------------------------------------- */

  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },

  brandIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#178A4B',
    alignItems: 'center',
    justifyContent: 'center',
  },

  brandIconText: {
    color: '#FFFFFF',
    fontSize: 25,
    fontWeight: '900',
  },

  brandContent: {
    flex: 1,
    marginLeft: 11,
  },

  brandName: {
    fontSize: 14,
    fontWeight: '900',
    color: '#17211B',
  },

  brandSubtitle: {
    fontSize: 9,
    color: '#7B857E',
    marginTop: 2,
  },

  stepBadge: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#E1F3E7',
    alignItems: 'center',
    justifyContent: 'center',
  },

  stepText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#178A4B',
  },

  /* -------------------------------------------------------
     HERO
     ------------------------------------------------------- */

  hero: {
    alignItems: 'center',
    marginBottom: 18,
  },

  heroCircle: {
    width: 68,
    height: 68,
    borderRadius: 24,
    backgroundColor: '#E0F3E7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },

  heroEmoji: {
    fontSize: 34,
  },

  heroEyebrow: {
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.5,
    color: '#178A4B',
  },

  title: {
    fontSize: 27,
    fontWeight: '900',
    color: '#17211B',
    textAlign: 'center',
    marginTop: 4,
  },

  subtitle: {
    fontSize: 12,
    lineHeight: 18,
    color: '#707A73',
    textAlign: 'center',
    marginTop: 6,
    maxWidth: 300,
  },

  /* -------------------------------------------------------
     PROGRESS
     ------------------------------------------------------- */

  progressCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 15,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E5EBE7',
  },

  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 9,
  },

  progressTitle: {
    fontSize: 11,
    fontWeight: '900',
    color: '#27332B',
  },

  progressValue: {
    fontSize: 9,
    fontWeight: '800',
    color: '#178A4B',
  },

  progressTrack: {
    height: 5,
    borderRadius: 999,
    backgroundColor: '#E8EDE9',
    overflow: 'hidden',
  },

  progressFill: {
    height: '100%',
    backgroundColor: '#178A4B',
    borderRadius: 999,
  },

  progressSteps: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 11,
  },

  progressStep: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  progressDot: {
    width: 21,
    height: 21,
    borderRadius: 8,
    backgroundColor: '#E8EDE9',
    alignItems: 'center',
    justifyContent: 'center',
  },

  progressDotActive: {
    backgroundColor: '#178A4B',
  },

  progressDotText: {
    fontSize: 8,
    fontWeight: '900',
    color: '#FFFFFF',
  },

  progressStepText: {
    fontSize: 8,
    color: '#7A837D',
    marginLeft: 5,
  },

  /* -------------------------------------------------------
     FORM
     ------------------------------------------------------- */

  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 19,
    borderWidth: 1,
    borderColor: '#E5EBE7',
  },

  formHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },

  formTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: '#17211B',
  },

  formSubtitle: {
    fontSize: 9,
    color: '#7B857E',
    marginTop: 3,
  },

  requiredBadge: {
    backgroundColor: '#F0F5F2',
    borderRadius: 8,
    paddingHorizontal: 7,
    paddingVertical: 5,
  },

  requiredText: {
    fontSize: 7,
    fontWeight: '900',
    color: '#7B857E',
    letterSpacing: 0.5,
  },

  fieldGroup: {
    marginBottom: 18,
  },

  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },

  label: {
    fontSize: 11,
    fontWeight: '900',
    color: '#27332B',
  },

  requiredStar: {
    color: '#E05252',
    fontSize: 12,
    fontWeight: '900',
    marginLeft: 3,
  },

  inputContainer: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DFE6E1',
    borderRadius: 15,
    backgroundColor: '#FAFCFA',
    paddingHorizontal: 11,
  },

  inputContainerActive: {
    borderColor: '#178A4B',
    backgroundColor: '#F9FCFA',
  },

  inputIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#EAF5EE',
    alignItems: 'center',
    justifyContent: 'center',
  },

  inputIconText: {
    fontSize: 15,
  },

  input: {
    flex: 1,
    height: '100%',
    paddingHorizontal: 9,
    fontSize: 14,
    color: '#17211B',
  },

  validIcon: {
    width: 23,
    height: 23,
    borderRadius: 8,
    backgroundColor: '#178A4B',
    alignItems: 'center',
    justifyContent: 'center',
  },

  validIconText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
  },

  fieldHint: {
    flex: 1,
    fontSize: 8,
    lineHeight: 13,
    color: '#8A938D',
    marginTop: 6,
  },

  /* -------------------------------------------------------
     PHONE
     ------------------------------------------------------- */

  phoneContainer: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DFE6E1',
    borderRadius: 15,
    backgroundColor: '#FAFCFA',
    paddingHorizontal: 10,
  },

  countryCodeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 3,
  },

  flag: {
    fontSize: 17,
  },

  countryCode: {
    fontSize: 13,
    fontWeight: '900',
    color: '#27332B',
    marginLeft: 5,
  },

  divider: {
    width: 1,
    height: 28,
    backgroundColor: '#DDE4DF',
    marginHorizontal: 9,
  },

  phoneInput: {
    flex: 1,
    height: '100%',
    fontSize: 14,
    color: '#17211B',
    letterSpacing: 0.5,
  },

  phoneMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  counter: {
    fontSize: 8,
    color: '#178A4B',
    fontWeight: '900',
    marginTop: 6,
  },

  /* -------------------------------------------------------
     TRUST
     ------------------------------------------------------- */

  trustCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EDF8F1',
    borderRadius: 17,
    padding: 13,
    marginTop: 14,
  },

  trustIcon: {
    width: 40,
    height: 40,
    borderRadius: 13,
    backgroundColor: '#D9F0E1',
    alignItems: 'center',
    justifyContent: 'center',
  },

  trustIconText: {
    fontSize: 18,
  },

  trustContent: {
    flex: 1,
    marginLeft: 10,
  },

  trustTitle: {
    fontSize: 10,
    fontWeight: '900',
    color: '#27332B',
  },

  trustText: {
    fontSize: 8,
    lineHeight: 13,
    color: '#718078',
    marginTop: 3,
  },

  /* -------------------------------------------------------
     BUTTON
     ------------------------------------------------------- */

  button: {
    height: 57,
    borderRadius: 17,
    backgroundColor: '#178A4B',
    marginTop: 17,
    shadowColor: '#178A4B',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.18,
    shadowRadius: 10,
    elevation: 4,
    overflow: 'hidden',
  },

  buttonPressed: {
    opacity: 0.88,
    transform: [
      {
        scale: 0.99,
      },
    ],
  },

  buttonContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
  },

  buttonArrow: {
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },

  arrowText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '900',
  },

  /* -------------------------------------------------------
     LOGIN
     ------------------------------------------------------- */

  loginButton: {
    alignItems: 'center',
    paddingVertical: 18,
  },

  loginPressed: {
    opacity: 0.65,
  },

  loginText: {
    fontSize: 10,
    color: '#737D76',
  },

  loginHighlight: {
    color: '#178A4B',
    fontWeight: '900',
  },

  /* -------------------------------------------------------
     FOOTER
     ------------------------------------------------------- */

  footer: {
    alignItems: 'center',
    paddingTop: 2,
  },

  footerLine: {
    width: 45,
    height: 3,
    borderRadius: 999,
    backgroundColor: '#DDE7E0',
    marginBottom: 8,
  },

  footerText: {
    fontSize: 8,
    color: '#9AA39D',
    fontWeight: '700',
  },
});