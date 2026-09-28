import {
  useState,
  type ReactNode,
} from 'react';

import {
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import * as ImagePicker from 'expo-image-picker';

import {
  registerUser,
  loginWithPhone,
  saveAuthSession,
  updateMyProfile,
  type BusinessRoleApi,
} from '../services/authApi';

import { Screen } from '../components/Screen';
import { Button } from '../components/UI';

import type {
  AppLanguage,
  AppRoute,
  BusinessRole,
} from '../navigation/types';

import {
  colors,
  spacing,
  typography,
} from '../theme';

type Props = {
  language: AppLanguage;

  registrationData?: {
    name: string;
    phone: string;
  } | null;

  registrationPhone?: string;

  onNavigate: (route: AppRoute) => void;

  onRoleSelect: (role: BusinessRole) => void;

  onBack?: () => void;
};

/* =====================================================
   ROLE OPTIONS
   ===================================================== */

const roles: {
  value: BusinessRole;
  title: string;
  description: string;
  icon: string;
}[] = [
  {
    value: 'Collector',
    title: 'Collector',
    description:
      'Collect e-waste and create digital lots for buyers.',
    icon: '🧑‍🔧',
  },
  {
    value: 'Recycler',
    title: 'Recycler',
    description:
      'Process e-waste and recover valuable materials.',
    icon: '♻️',
  },
  {
    value: 'Trader',
    title: 'Trader',
    description:
      'Buy, aggregate and sell e-waste materials.',
    icon: '🤝',
  },
  {
    value: 'Manufacturer',
    title: 'Manufacturer',
    description:
      'Use recycled materials for manufacturing.',
    icon: '🏭',
  },
];

/* =====================================================
   API ROLE → APP ROLE
   ===================================================== */

function apiRoleToBusinessRole(
  role:
    | 'COLLECTOR'
    | 'RECYCLER'
    | 'TRADER'
    | 'MANUFACTURER'
    | null
    | undefined,
): BusinessRole | null {
  if (role === 'COLLECTOR') {
    return 'Collector';
  }

  if (role === 'RECYCLER') {
    return 'Recycler';
  }

  if (role === 'TRADER') {
    return 'Trader';
  }

  if (role === 'MANUFACTURER') {
    return 'Manufacturer';
  }

  return null;
}

/* =====================================================
   SCREEN
   ===================================================== */

export function RoleSelectionScreen({
  language,
  registrationData,
  registrationPhone,
  onNavigate,
  onRoleSelect,
  onBack,
}: Props) {
  const [name, setName] = useState(
    registrationData?.name ?? '',
  );

  const [dob, setDob] = useState('');
  const [email, setEmail] = useState('');

  const [selectedRole, setSelectedRole] =
    useState<BusinessRole | null>(null);

  const [profileImage, setProfileImage] =
    useState<string | null>(null);

  const [roleModalVisible, setRoleModalVisible] =
    useState(false);

  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  /* ===================================================
     LANGUAGE TEXT
     =================================================== */

  const text =
    language === 'hi'
      ? {
          title: 'अपना प्रोफाइल पूरा करें',

          subtitle:
            'कुछ जानकारी भरें और अपने काम की भूमिका चुनें।',

          step: 'PROFILE SETUP',

          progress: 'अंतिम चरण',

          name: 'नाम',

          namePlaceholder:
            'अपना पूरा नाम दर्ज करें',

          dob: 'जन्म तिथि',

          dobPlaceholder:
            'DD / MM / YYYY',

          role: 'आपकी भूमिका',

          rolePlaceholder:
            'अपनी भूमिका चुनें',

          email: 'ईमेल आईडी',

          emailPlaceholder:
            'अपना ईमेल पता दर्ज करें',

          picture: 'प्रोफाइल फोटो',

          optional: '(वैकल्पिक)',

          upload:
            'फोटो चुनने के लिए टैप करें',

          takePhoto:
            'कैमरा',

          choosePhoto:
            'गैलरी',

          continue:
            'अकाउंट बनाएं',

          invalidEmail:
            'कृपया सही ईमेल आईडी दर्ज करें।',

          invalidDob:
            'कृपया सही जन्म तिथि दर्ज करें।',

          registrationFailed:
            'अकाउंट बनाने में समस्या हुई। कृपया दोबारा कोशिश करें।',

          saving:
            'अकाउंट बनाया जा रहा है...',

          missingName:
            'कृपया अपना नाम दर्ज करें।',

          missingRole:
            'कृपया अपनी भूमिका चुनें।',

          missingEmail:
            'कृपया अपना ईमेल दर्ज करें।',

          missingDob:
            'कृपया अपनी जन्म तिथि दर्ज करें.',
        }
      : language === 'mr'
        ? {
            title:
              'तुमचे प्रोफाइल पूर्ण करा',

            subtitle:
              'काही माहिती भरा आणि तुमची कामाची भूमिका निवडा.',

            step: 'PROFILE SETUP',

            progress: 'शेवटचा टप्पा',

            name: 'नाव',

            namePlaceholder:
              'तुमचे पूर्ण नाव टाका',

            dob: 'जन्मतारीख',

            dobPlaceholder:
              'DD / MM / YYYY',

            role: 'तुमची भूमिका',

            rolePlaceholder:
              'तुमची भूमिका निवडा',

            email: 'ईमेल आयडी',

            emailPlaceholder:
              'तुमचा ईमेल पत्ता टाका',

            picture: 'प्रोफाइल फोटो',

            optional: '(पर्यायी)',

            upload:
              'फोटो निवडण्यासाठी टॅप करा',

            takePhoto:
              'कॅमेरा',

            choosePhoto:
              'गॅलरी',

            continue:
              'खाते तयार करा',

            invalidEmail:
              'कृपया योग्य ईमेल आयडी टाका.',

            invalidDob:
              'कृपया योग्य जन्मतारीख टाका.',

            registrationFailed:
              'खाते तयार करता आले नाही. पुन्हा प्रयत्न करा.',

            saving:
              'खाते तयार होत आहे...',

            missingName:
              'कृपया तुमचे नाव भरा.',

            missingRole:
              'कृपया तुमची भूमिका निवडा.',

            missingEmail:
              'कृपया तुमचा ईमेल भरा.',

            missingDob:
              'कृपया तुमची जन्मतारीख भरा.',
          }
        : {
            title:
              'Complete your profile',

            subtitle:
              'Add a few details and choose how you work with e-waste.',

            step: 'PROFILE SETUP',

            progress: 'FINAL STEP',

            name: 'Name',

            namePlaceholder:
              'Enter your full name',

            dob: 'Date of Birth',

            dobPlaceholder:
              'DD / MM / YYYY',

            role: 'Your Role',

            rolePlaceholder:
              'Choose your role',

            email: 'Email ID',

            emailPlaceholder:
              'Enter your email address',

            picture: 'Profile Picture',

            optional: '(Optional)',

            upload:
              'Tap to choose a profile photo',

            takePhoto:
              'Camera',

            choosePhoto:
              'Gallery',

            continue:
              'Create Account',

            invalidEmail:
              'Please enter a valid email address.',

            invalidDob:
              'Please enter a valid date of birth.',

            registrationFailed:
              'Unable to create account. Please try again.',

            saving:
              'Creating account...',

            missingName:
              'Please enter your name.',

            missingRole:
              'Please select your role.',

            missingEmail:
              'Please enter your email.',

            missingDob:
              'Please enter your date of birth.',
          };

  /* ===================================================
     PICK IMAGE
     =================================================== */

  async function pickProfilePicture() {
    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        return;
      }

      const result =
        await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ['images'],
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8,
        });

      if (!result.canceled) {
        setProfileImage(
          result.assets[0].uri,
        );

        setError('');
      }
    } catch (requestError) {
      console.error(
        'Profile image selection failed:',
        requestError,
      );
    }
  }

  /* ===================================================
     CAMERA
     =================================================== */

  async function takeProfilePicture() {
    try {
      const permission =
        await ImagePicker.requestCameraPermissionsAsync();

      if (!permission.granted) {
        return;
      }

      const result =
        await ImagePicker.launchCameraAsync({
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8,
        });

      if (!result.canceled) {
        setProfileImage(
          result.assets[0].uri,
        );

        setError('');
      }
    } catch (requestError) {
      console.error(
        'Profile camera failed:',
        requestError,
      );
    }
  }

  /* ===================================================
     DATE VALIDATION
     =================================================== */

  function convertDobToApiFormat(
    value: string,
  ): string | null {
    const parts = value
      .trim()
      .split('/')
      .map((part) => part.trim());

    if (parts.length !== 3) {
      return null;
    }

    const [day, month, year] = parts;

    if (
      day.length !== 2 ||
      month.length !== 2 ||
      year.length !== 4
    ) {
      return null;
    }

    const dayNumber = Number(day);
    const monthNumber = Number(month);
    const yearNumber = Number(year);

    if (
      !Number.isInteger(dayNumber) ||
      !Number.isInteger(monthNumber) ||
      !Number.isInteger(yearNumber)
    ) {
      return null;
    }

    if (
      monthNumber < 1 ||
      monthNumber > 12 ||
      dayNumber < 1 ||
      dayNumber > 31
    ) {
      return null;
    }

    const date = new Date(
      Date.UTC(
        yearNumber,
        monthNumber - 1,
        dayNumber,
      ),
    );

    if (
      date.getUTCFullYear() !== yearNumber ||
      date.getUTCMonth() !== monthNumber - 1 ||
      date.getUTCDate() !== dayNumber
    ) {
      return null;
    }

    const today = new Date();

    const todayUtc = Date.UTC(
      today.getUTCFullYear(),
      today.getUTCMonth(),
      today.getUTCDate(),
    );

    if (date.getTime() > todayUtc) {
      return null;
    }

    return `${yearNumber}-${String(
      monthNumber,
    ).padStart(2, '0')}-${String(
      dayNumber,
    ).padStart(2, '0')}`;
  }

  /* ===================================================
     CONTINUE
     =================================================== */

  async function handleContinue() {
    if (saving) {
      return;
    }

    const cleanName =
      name.trim();

    const cleanPhone = (
      registrationData?.phone ||
      registrationPhone ||
      ''
    ).replace(/\D/g, '');

    const cleanEmail =
      email.trim().toLowerCase();

    /* -------------------------------------------------
       REQUIRED
       ------------------------------------------------- */

    if (!cleanName) {
      setError(text.missingName);
      return;
    }

    if (!dob.trim()) {
      setError(text.missingDob);
      return;
    }

    if (!selectedRole) {
      setError(text.missingRole);
      return;
    }

    if (!cleanEmail) {
      setError(text.missingEmail);
      return;
    }

    /* -------------------------------------------------
       PHONE
       ------------------------------------------------- */

    if (
      cleanPhone.length < 10 ||
      cleanPhone.length > 15
    ) {
      setError(
        'Registration phone number is missing or invalid. Please go back and enter your phone number again.',
      );

      return;
    }

    /* -------------------------------------------------
       EMAIL
       ------------------------------------------------- */

    const emailIsValid =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        cleanEmail,
      );

    if (!emailIsValid) {
      setError(text.invalidEmail);
      return;
    }

    /* -------------------------------------------------
       DOB
       ------------------------------------------------- */

    const formattedDob =
      convertDobToApiFormat(dob);

    if (!formattedDob) {
      setError(text.invalidDob);
      return;
    }

    /* -------------------------------------------------
       BUSINESS ROLE
       ------------------------------------------------- */

    const apiBusinessRole:
      BusinessRoleApi | null =
      selectedRole === 'Collector'
        ? null
        : selectedRole === 'Recycler'
          ? 'RECYCLER'
          : selectedRole === 'Trader'
            ? 'TRADER'
            : 'MANUFACTURER';

    try {
      setSaving(true);
      setError('');

      /* ===============================================
         1. REGISTER
         =============================================== */

      let authResponse;
      let accountAlreadyExists = false;

      try {
        authResponse =
          await registerUser(
            cleanName,
            cleanPhone,
            apiBusinessRole,
          );
      } catch (registrationError) {
        const message =
          registrationError instanceof Error
            ? registrationError.message
            : String(registrationError);

        /* =============================================
           EXISTING ACCOUNT
           ============================================= */

        if (
          message
            .toLowerCase()
            .includes('already exists')
        ) {
          console.log(
            'Account already exists. Logging in automatically...',
          );

          accountAlreadyExists = true;

          authResponse =
            await loginWithPhone(
              cleanPhone,
            );
        } else {
          throw registrationError;
        }
      }

      /* ===============================================
         2. FINAL ROLE
         =============================================== */

      const existingBusinessRole =
        apiRoleToBusinessRole(
          authResponse.user.businessRole,
        );

      const finalBusinessRole =
        accountAlreadyExists &&
        existingBusinessRole
          ? existingBusinessRole
          : selectedRole;

      /* ===============================================
         3. SAVE SESSION
         =============================================== */

      await saveAuthSession(
        authResponse,
        finalBusinessRole,
      );

      /* ===============================================
         4. UPDATE PROFILE
         =============================================== */

      if (!accountAlreadyExists) {
        const profileData = {
          name: cleanName,

          email: cleanEmail,

          dateOfBirth:
            formattedDob,

          ...(apiBusinessRole
            ? {
                businessRole:
                  apiBusinessRole,
              }
            : {}),

          ...(profileImage
            ? {
                profileImageReference:
                  profileImage,
              }
            : {}),
        };

        await updateMyProfile(
          profileData,
        );
      }

      /* ===============================================
         5. OPEN DASHBOARD
         =============================================== */

      onRoleSelect(
        finalBusinessRole,
      );
    } catch (requestError) {
      console.error(
        'Account registration/login failed:',
        requestError,
      );

      setError(
        requestError instanceof Error &&
        requestError.message
          ? requestError.message
          : text.registrationFailed,
      );
    } finally {
      setSaving(false);
    }
  }

  const selectedRoleData =
    roles.find(
      (role) =>
        role.value === selectedRole,
    );

  /* ===================================================
     RENDER
     =================================================== */

  return (
    <Screen
      title={text.title}
      subtitle={text.subtitle}
      showBack
      onBack={() => {
        if (!saving) {
          if (onBack) {
            onBack();
          } else {
            onNavigate('register');
          }
        }
      }}
    >
      <KeyboardAvoidingView
        behavior={
          Platform.OS === 'ios'
            ? 'padding'
            : undefined
        }
        style={styles.keyboard}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={
            styles.scrollContent
          }
        >
          {/* =================================================
              HEADER / STEP
             ================================================= */}

          <View style={styles.stepHeader}>
            <View style={styles.stepIcon}>
              <Text style={styles.stepIconText}>
                ✓
              </Text>
            </View>

            <View style={styles.stepContent}>
              <Text style={styles.stepEyebrow}>
                {text.step}
              </Text>

              <Text style={styles.stepTitle}>
                {text.progress}
              </Text>
            </View>

            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>
                02
              </Text>
            </View>
          </View>

          {/* =================================================
              PROFILE HERO
             ================================================= */}

          <View style={styles.profileHero}>
            <View style={styles.heroGlow} />

            <View style={styles.heroAvatar}>
              {profileImage ? (
                <Image
                  source={{
                    uri: profileImage,
                  }}
                  style={styles.heroImage}
                />
              ) : (
                <Text style={styles.heroAvatarText}>
                  ♙
                </Text>
              )}

              <View style={styles.cameraBadge}>
                <Text style={styles.cameraBadgeText}>
                  +
                </Text>
              </View>
            </View>

            <View style={styles.heroInfo}>
              <Text style={styles.heroTitle}>
                {name.trim()
                  ? name.trim()
                  : 'Your profile'}
              </Text>

              <Text style={styles.heroSubtitle}>
                Add your details and choose your role
              </Text>
            </View>
          </View>

          {/* =================================================
              FORM CARD
             ================================================= */}

          <View style={styles.formCard}>
            {/* NAME */}

            <FormRow icon="♙">
              <FieldLabel
                text={text.name}
                required
              />

              <View
                style={[
                  styles.inputBox,
                  name.trim().length >= 2 &&
                    styles.inputBoxActive,
                ]}
              >
                <TextInput
                  value={name}
                  onChangeText={(value) => {
                    setName(value);
                    setError('');
                  }}
                  placeholder={
                    text.namePlaceholder
                  }
                  placeholderTextColor="#91A19B"
                  style={styles.input}
                  autoCapitalize="words"
                  autoCorrect={false}
                  editable={!saving}
                />

                {name.trim().length >= 2 ? (
                  <View
                    style={styles.validBadge}
                  >
                    <Text
                      style={
                        styles.validBadgeText
                      }
                    >
                      ✓
                    </Text>
                  </View>
                ) : null}
              </View>
            </FormRow>

            {/* DOB */}

            <FormRow icon="▣">
              <FieldLabel
                text={text.dob}
                required
              />

              <View
                style={[
                  styles.inputBox,
                  dob.length === 10 &&
                    styles.inputBoxActive,
                ]}
              >
                <TextInput
                  value={dob}
                  onChangeText={(value) => {
                    const cleaned =
                      value
                        .replace(
                          /[^\d/]/g,
                          '',
                        )
                        .slice(0, 10);

                    setDob(cleaned);
                    setError('');
                  }}
                  placeholder={
                    text.dobPlaceholder
                  }
                  placeholderTextColor="#91A19B"
                  style={styles.input}
                  keyboardType="default"
                  maxLength={10}
                  editable={!saving}
                />

                <Text
                  style={styles.inputRightIcon}
                >
                  ▣
                </Text>
              </View>
            </FormRow>

            {/* ROLE */}

            <FormRow icon="◎">
              <FieldLabel
                text={text.role}
                required
              />

              <Pressable
                onPress={() =>
                  setRoleModalVisible(true)
                }
                style={({ pressed }) => [
                  styles.selectBox,
                  selectedRole &&
                    styles.selectBoxActive,
                  pressed &&
                    styles.pressed,
                ]}
                disabled={saving}
              >
                {selectedRoleData ? (
                  <View
                    style={
                      styles.selectedRoleRow
                    }
                  >
                    <View
                      style={
                        styles.selectedRoleIcon
                      }
                    >
                      <Text
                        style={
                          styles.selectedRoleEmoji
                        }
                      >
                        {
                          selectedRoleData.icon
                        }
                      </Text>
                    </View>

                    <View
                      style={
                        styles.selectedRoleContent
                      }
                    >
                      <Text
                        style={
                          styles.selectedRoleTitle
                        }
                      >
                        {
                          selectedRoleData.title
                        }
                      </Text>

                      <Text
                        style={
                          styles.selectedRoleSub
                        }
                        numberOfLines={1}
                      >
                        {
                          selectedRoleData.description
                        }
                      </Text>
                    </View>
                  </View>
                ) : (
                  <Text
                    style={
                      styles.placeholderText
                    }
                  >
                    {text.rolePlaceholder}
                  </Text>
                )}

                <Text
                  style={styles.chevron}
                >
                  ›
                </Text>
              </Pressable>
            </FormRow>

            {/* EMAIL */}

            <FormRow icon="✉">
              <FieldLabel
                text={text.email}
                required
              />

              <View
                style={[
                  styles.inputBox,
                  email.includes('@') &&
                    styles.inputBoxActive,
                ]}
              >
                <TextInput
                  value={email}
                  onChangeText={(value) => {
                    setEmail(value);
                    setError('');
                  }}
                  placeholder={
                    text.emailPlaceholder
                  }
                  placeholderTextColor="#91A19B"
                  style={styles.input}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!saving}
                />

                <Text
                  style={styles.inputRightIcon}
                >
                  ✉
                </Text>
              </View>
            </FormRow>

            {/* PROFILE PHOTO */}

            <FormRow icon="◉">
              <View
                style={styles.pictureLabelRow}
              >
                <Text
                  style={styles.fieldLabel}
                >
                  {text.picture}
                </Text>

                <Text
                  style={styles.optionalText}
                >
                  {' '}
                  {text.optional}
                </Text>
              </View>

              <Pressable
                onPress={
                  pickProfilePicture
                }
                style={({ pressed }) => [
                  styles.uploadBox,
                  pressed &&
                    styles.pressed,
                ]}
                disabled={saving}
              >
                {profileImage ? (
                  <Image
                    source={{
                      uri: profileImage,
                    }}
                    style={
                      styles.profilePreview
                    }
                  />
                ) : (
                  <View
                    style={
                      styles.defaultAvatar
                    }
                  >
                    <Text
                      style={
                        styles.avatarIcon
                      }
                    >
                      ♙
                    </Text>
                  </View>
                )}

                <View
                  style={styles.uploadContent}
                >
                  <Text
                    style={
                      styles.uploadTitle
                    }
                  >
                    {text.upload}
                  </Text>

                  <Text
                    style={
                      styles.uploadHint
                    }
                  >
                    JPG or PNG • Square photo
                  </Text>
                </View>

                <View
                  style={
                    styles.uploadArrow
                  }
                >
                  <Text
                    style={
                      styles.uploadArrowText
                    }
                  >
                    ↑
                  </Text>
                </View>
              </Pressable>

              {/* Camera shortcut */}

              <Pressable
                onPress={
                  takeProfilePicture
                }
                style={({ pressed }) => [
                  styles.cameraShortcut,
                  pressed &&
                    styles.pressed,
                ]}
                disabled={saving}
              >
                <Text
                  style={
                    styles.cameraShortcutIcon
                  }
                >
                  ◉
                </Text>

                <Text
                  style={
                    styles.cameraShortcutText
                  }
                >
                  {text.takePhoto}
                </Text>
              </Pressable>
            </FormRow>

            {/* ERROR */}

            {error ? (
              <View
                style={styles.errorBox}
              >
                <View
                  style={styles.errorIcon}
                >
                  <Text
                    style={
                      styles.errorIconText
                    }
                  >
                    !
                  </Text>
                </View>

                <Text
                  style={styles.errorText}
                >
                  {error}
                </Text>
              </View>
            ) : null}

            {/* CREATE */}

            <Button
              label={
                saving
                  ? text.saving
                  : text.continue
              }
              onPress={
                handleContinue
              }
              icon="→"
            />
          </View>

          {/* =================================================
              BOTTOM TRUST
             ================================================= */}

          <View style={styles.trustBar}>
            <View style={styles.trustIcon}>
              <Text
                style={styles.trustIconText}
              >
                🔒
              </Text>
            </View>

            <View
              style={styles.trustContent}
            >
              <Text
                style={styles.trustTitle}
              >
                Secure profile setup
              </Text>

              <Text
                style={styles.trustText}
              >
                Your details are used to personalize
                your Kabadiwala Connect experience.
              </Text>
            </View>

            <Text style={styles.trustCheck}>
              ✓
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* =================================================
          ROLE MODAL
         ================================================= */}

      <Modal
        visible={roleModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() =>
          setRoleModalVisible(false)
        }
      >
        <View
          style={styles.modalOverlay}
        >
          <Pressable
            style={styles.modalBackground}
            onPress={() =>
              setRoleModalVisible(false)
            }
          />

          <View
            style={styles.roleModal}
          >
            <View
              style={styles.modalHandle}
            />

            <View
              style={styles.modalHeader}
            >
              <View>
                <Text
                  style={styles.modalEyebrow}
                >
                  WORK PROFILE
                </Text>

                <Text
                  style={styles.modalTitle}
                >
                  {text.role}
                </Text>

                <Text
                  style={
                    styles.modalSubtitle
                  }
                >
                  Choose the role that best describes you.
                </Text>
              </View>

              <Pressable
                onPress={() =>
                  setRoleModalVisible(false)
                }
                style={styles.closeButton}
              >
                <Text
                  style={styles.closeText}
                >
                  ×
                </Text>
              </Pressable>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={
                false
              }
              bounces={false}
            >
              {roles.map((role) => {
                const isSelected =
                  selectedRole ===
                  role.value;

                return (
                  <Pressable
                    key={role.value}
                    onPress={() => {
                      setSelectedRole(
                        role.value,
                      );

                      setRoleModalVisible(
                        false,
                      );

                      setError('');
                    }}
                    style={({ pressed }) => [
                      styles.roleOption,
                      isSelected &&
                        styles.roleOptionSelected,
                      pressed &&
                        styles.roleOptionPressed,
                    ]}
                  >
                    <View
                      style={[
                        styles.roleIconCircle,
                        isSelected &&
                          styles.roleIconCircleSelected,
                      ]}
                    >
                      <Text
                        style={
                          styles.roleIcon
                        }
                      >
                        {role.icon}
                      </Text>
                    </View>

                    <View
                      style={
                        styles.roleInfo
                      }
                    >
                      <View
                        style={
                          styles.roleTitleRow
                        }
                      >
                        <Text
                          style={
                            styles.roleTitle
                          }
                        >
                          {role.title}
                        </Text>

                        {isSelected ? (
                          <View
                            style={
                              styles.selectedBadge
                            }
                          >
                            <Text
                              style={
                                styles.selectedBadgeText
                              }
                            >
                              SELECTED
                            </Text>
                          </View>
                        ) : null}
                      </View>

                      <Text
                        style={
                          styles.roleDescription
                        }
                      >
                        {role.description}
                      </Text>
                    </View>

                    <View
                      style={[
                        styles.roleCheck,
                        isSelected &&
                          styles.roleCheckSelected,
                      ]}
                    >
                      {isSelected ? (
                        <Text
                          style={
                            styles.roleCheckText
                          }
                        >
                          ✓
                        </Text>
                      ) : (
                        <Text
                          style={
                            styles.roleArrow
                          }
                        >
                          ›
                        </Text>
                      )}
                    </View>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </Screen>
  );
}

/* =====================================================
   FORM ROW
   ===================================================== */

function FormRow({
  icon,
  children,
}: {
  icon: string;
  children: ReactNode;
}) {
  return (
    <View style={styles.formRow}>
      <View style={styles.leftIcon}>
        <Text
          style={styles.leftIconText}
        >
          {icon}
        </Text>
      </View>

      <View style={styles.formContent}>
        {children}
      </View>
    </View>
  );
}

/* =====================================================
   FIELD LABEL
   ===================================================== */

function FieldLabel({
  text,
  required,
}: {
  text: string;
  required?: boolean;
}) {
  return (
    <Text style={styles.fieldLabel}>
      {text}

      {required ? (
        <Text style={styles.required}>
          {' '}
          *
        </Text>
      ) : null}
    </Text>
  );
}

/* =====================================================
   STYLES
   ===================================================== */

const styles = StyleSheet.create({
  keyboard: {
    flex: 1,
  },

  scrollContent: {
    paddingBottom: 35,
  },

  /* ---------------------------------------------------
     STEP HEADER
     --------------------------------------------------- */

  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F8F3',
    borderRadius: 18,
    padding: 12,
    marginBottom: 14,
  },

  stepIcon: {
    width: 38,
    height: 38,
    borderRadius: 13,
    backgroundColor: '#178A4B',
    alignItems: 'center',
    justifyContent: 'center',
  },

  stepIconText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '900',
  },

  stepContent: {
    flex: 1,
    marginLeft: 10,
  },

  stepEyebrow: {
    fontSize: 7,
    fontWeight: '900',
    letterSpacing: 1.1,
    color: '#178A4B',
  },

  stepTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: '#17211B',
    marginTop: 2,
  },

  stepNumber: {
    width: 35,
    height: 30,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  stepNumberText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#178A4B',
  },

  /* ---------------------------------------------------
     PROFILE HERO
     --------------------------------------------------- */

  profileHero: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#17211B',
    borderRadius: 24,
    padding: 17,
    marginBottom: 14,
    overflow: 'hidden',
  },

  heroGlow: {
    position: 'absolute',
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: 'rgba(23,138,75,0.20)',
    right: -35,
    top: -40,
  },

  heroAvatar: {
    width: 72,
    height: 72,
    borderRadius: 24,
    backgroundColor: '#E3F2E8',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },

  heroAvatarText: {
    fontSize: 39,
    color: '#6F8278',
  },

  heroImage: {
    width: 72,
    height: 72,
    borderRadius: 24,
  },

  cameraBadge: {
    position: 'absolute',
    right: -5,
    bottom: -5,
    width: 25,
    height: 25,
    borderRadius: 9,
    backgroundColor: '#178A4B',
    borderWidth: 2,
    borderColor: '#17211B',
    alignItems: 'center',
    justifyContent: 'center',
  },

  cameraBadgeText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
  },

  heroInfo: {
    flex: 1,
    marginLeft: 14,
  },

  heroTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
  },

  heroSubtitle: {
    fontSize: 9,
    lineHeight: 14,
    color: '#AEBBB3',
    marginTop: 4,
    maxWidth: 220,
  },

  /* ---------------------------------------------------
     FORM CARD
     --------------------------------------------------- */

  formCard: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000000',
    shadowOpacity: 0.07,
    shadowRadius: 18,
    shadowOffset: {
      width: 0,
      height: 7,
    },
    elevation: 4,
  },

  formRow: {
    flexDirection: 'row',
    marginBottom: spacing.lg,
  },

  leftIcon: {
    width: 38,
    alignItems: 'flex-start',
    paddingTop: 4,
  },

  leftIconText: {
    fontSize: 21,
    color: colors.brand,
    fontWeight: '800',
  },

  formContent: {
    flex: 1,
  },

  fieldLabel: {
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '900',
    color: colors.ink,
    marginBottom: 8,
  },

  required: {
    color: '#D33131',
  },

  optionalText: {
    fontSize: 10,
    color: colors.muted,
    fontWeight: '600',
  },

  /* ---------------------------------------------------
     INPUT
     --------------------------------------------------- */

  inputBox: {
    minHeight: 56,
    borderWidth: 1.4,
    borderColor: '#D7E1DC',
    borderRadius: 15,
    backgroundColor: '#FBFDFC',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 3,
  },

  inputBoxActive: {
    borderColor: colors.brand,
    backgroundColor: '#FAFDFB',
  },

  input: {
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 14,
    fontSize: 14,
    color: colors.ink,
  },

  validBadge: {
    width: 23,
    height: 23,
    borderRadius: 8,
    backgroundColor: colors.brand,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 11,
  },

  validBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
  },

  inputRightIcon: {
    fontSize: 19,
    color: '#87958F',
    marginRight: 14,
  },

  /* ---------------------------------------------------
     ROLE SELECT
     --------------------------------------------------- */

  selectBox: {
    minHeight: 62,
    borderWidth: 1.4,
    borderColor: '#D7E1DC',
    borderRadius: 15,
    paddingHorizontal: 11,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FBFDFC',
  },

  selectBoxActive: {
    borderColor: colors.brand,
    backgroundColor: '#F8FCF9',
  },

  selectedRoleRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },

  selectedRoleIcon: {
    width: 39,
    height: 39,
    borderRadius: 12,
    backgroundColor: '#E4F3E9',
    alignItems: 'center',
    justifyContent: 'center',
  },

  selectedRoleEmoji: {
    fontSize: 20,
  },

  selectedRoleContent: {
    flex: 1,
    marginLeft: 9,
  },

  selectedRoleTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: colors.ink,
  },

  selectedRoleSub: {
    fontSize: 8,
    color: colors.muted,
    marginTop: 3,
  },

  placeholderText: {
    flex: 1,
    fontSize: 13,
    color: '#91A19B',
  },

  chevron: {
    fontSize: 26,
    color: colors.ink,
    marginLeft: 8,
    transform: [
      {
        rotate: '90deg',
      },
    ],
  },

  /* ---------------------------------------------------
     PHOTO
     --------------------------------------------------- */

  pictureLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },

  uploadBox: {
    minHeight: 83,
    borderWidth: 1.4,
    borderStyle: 'dashed',
    borderColor: '#B8CBC2',
    borderRadius: 16,
    padding: 11,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FBFDFC',
  },

  defaultAvatar: {
    width: 53,
    height: 53,
    borderRadius: 18,
    backgroundColor: '#E7EEEB',
    alignItems: 'center',
    justifyContent: 'center',
  },

  profilePreview: {
    width: 53,
    height: 53,
    borderRadius: 18,
  },

  avatarIcon: {
    fontSize: 30,
    color: '#778982',
  },

  uploadContent: {
    flex: 1,
    marginLeft: 11,
  },

  uploadTitle: {
    fontSize: 10,
    fontWeight: '900',
    color: colors.ink,
  },

  uploadHint: {
    fontSize: 8,
    color: colors.muted,
    marginTop: 3,
  },

  uploadArrow: {
    width: 34,
    height: 34,
    borderRadius: 11,
    backgroundColor: '#E6F3EA',
    alignItems: 'center',
    justifyContent: 'center',
  },

  uploadArrowText: {
    color: colors.brand,
    fontSize: 16,
    fontWeight: '900',
  },

  cameraShortcut: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
    marginTop: 8,
    paddingVertical: 5,
    paddingHorizontal: 8,
  },

  cameraShortcutIcon: {
    fontSize: 13,
    color: colors.brand,
  },

  cameraShortcutText: {
    fontSize: 9,
    fontWeight: '800',
    color: colors.brand,
    marginLeft: 5,
  },

  /* ---------------------------------------------------
     ERROR
     --------------------------------------------------- */

  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF1EF',
    borderRadius: 13,
    padding: 10,
    marginBottom: spacing.md,
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

  errorText: {
    flex: 1,
    color: colors.danger,
    fontSize: 9,
    lineHeight: 14,
    fontWeight: '700',
    marginLeft: 8,
  },

  /* ---------------------------------------------------
     TRUST
     --------------------------------------------------- */

  trustBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F7F3',
    borderRadius: 17,
    padding: 12,
    marginTop: 14,
  },

  trustIcon: {
    width: 37,
    height: 37,
    borderRadius: 12,
    backgroundColor: '#DCEFE3',
    alignItems: 'center',
    justifyContent: 'center',
  },

  trustIconText: {
    fontSize: 16,
  },

  trustContent: {
    flex: 1,
    marginLeft: 9,
  },

  trustTitle: {
    fontSize: 9,
    fontWeight: '900',
    color: colors.ink,
  },

  trustText: {
    fontSize: 7.5,
    lineHeight: 12,
    color: colors.muted,
    marginTop: 2,
  },

  trustCheck: {
    color: colors.brand,
    fontSize: 17,
    fontWeight: '900',
    marginLeft: 8,
  },

  /* ---------------------------------------------------
     PRESS
     --------------------------------------------------- */

  pressed: {
    opacity: 0.7,
  },

  /* ---------------------------------------------------
     MODAL
     --------------------------------------------------- */

  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },

  modalBackground: {
  position: 'absolute',
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
  backgroundColor: 'rgba(8, 27, 20, 0.45)',
},

  roleModal: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: spacing.lg,
    paddingTop: 9,
    paddingBottom: 28,
    maxHeight: '78%',
  },

  modalHandle: {
    alignSelf: 'center',
    width: 43,
    height: 5,
    borderRadius: 999,
    backgroundColor: colors.border,
    marginBottom: 17,
  },

  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },

  modalEyebrow: {
    fontSize: 7,
    fontWeight: '900',
    letterSpacing: 1.2,
    color: colors.brand,
  },

  modalTitle: {
    ...typography.heading,
    marginTop: 2,
  },

  modalSubtitle: {
    fontSize: 9,
    color: colors.muted,
    marginTop: 3,
  },

  closeButton: {
    width: 33,
    height: 33,
    borderRadius: 11,
    backgroundColor: '#F0F3F1',
    alignItems: 'center',
    justifyContent: 'center',
  },

  closeText: {
    fontSize: 22,
    lineHeight: 24,
    color: colors.ink,
  },

  /* ---------------------------------------------------
     ROLE OPTIONS
     --------------------------------------------------- */

  roleOption: {
    minHeight: 79,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E3EAE6',
    borderRadius: 17,
    padding: 10,
    marginBottom: 9,
    backgroundColor: '#FFFFFF',
  },

  roleOptionSelected: {
    borderColor: colors.brand,
    backgroundColor: '#F4FBF6',
  },

  roleOptionPressed: {
    opacity: 0.72,
  },

  roleIconCircle: {
    width: 49,
    height: 49,
    borderRadius: 16,
    backgroundColor: '#EFF4F1',
    alignItems: 'center',
    justifyContent: 'center',
  },

  roleIconCircleSelected: {
    backgroundColor: '#DCEFE3',
  },

  roleIcon: {
    fontSize: 24,
  },

  roleInfo: {
    flex: 1,
    marginLeft: 10,
  },

  roleTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  roleTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: colors.ink,
  },

  selectedBadge: {
    backgroundColor: '#DCEFE3',
    borderRadius: 6,
    paddingHorizontal: 5,
    paddingVertical: 3,
    marginLeft: 7,
  },

  selectedBadgeText: {
    fontSize: 6,
    fontWeight: '900',
    color: colors.brand,
  },

  roleDescription: {
    fontSize: 8.5,
    lineHeight: 13,
    color: colors.muted,
    marginTop: 4,
  },

  roleCheck: {
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: '#F0F3F1',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 7,
  },

  roleCheckSelected: {
    backgroundColor: colors.brand,
  },

  roleCheckText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
  },

  roleArrow: {
    color: '#7D8A84',
    fontSize: 21,
    fontWeight: '700',
  },
});