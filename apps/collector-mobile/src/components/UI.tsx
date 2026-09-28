import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type KeyboardTypeOptions,
  type TextInputProps,
} from 'react-native';

import { colors, spacing, typography } from '../theme';

/* =========================================================
   BUTTON
   ========================================================= */

type ButtonProps = {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'quiet';
  disabled?: boolean;
  icon?: string;
};

export function Button({
  label,
  onPress,
  variant = 'primary',
  disabled = false,
  icon,
}: ButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,

        variant === 'primary' &&
          styles.buttonPrimary,

        variant === 'secondary' &&
          styles.buttonSecondary,

        variant === 'quiet' &&
          styles.buttonQuiet,

        pressed &&
          !disabled &&
          styles.pressed,

        disabled &&
          styles.disabled,
      ]}
    >
      {icon ? (
        <Text
          style={[
            styles.buttonIcon,

            variant === 'primary' &&
              styles.buttonIconPrimary,

            variant === 'secondary' &&
              styles.buttonIconSecondary,

            variant === 'quiet' &&
              styles.buttonIconQuiet,
          ]}
        >
          {icon}
        </Text>
      ) : null}

      <Text
        style={[
          styles.buttonText,

          variant === 'primary' &&
            styles.buttonTextPrimary,

          variant === 'secondary' &&
            styles.buttonTextSecondary,

          variant === 'quiet' &&
            styles.buttonTextQuiet,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

/* =========================================================
   CARD
   ========================================================= */

type CardProps = {
  children: React.ReactNode;
  accent?: boolean;
  onPress?: () => void;
};

export function Card({
  children,
  accent = false,
  onPress,
}: CardProps) {
  const cardContent = (
    <View
      style={[
        styles.card,
        accent &&
          styles.cardAccent,
      ]}
    >
      {children}
    </View>
  );

  if (!onPress) {
    return cardContent;
  }

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        pressed &&
          styles.cardPressed,
      ]}
    >
      {cardContent}
    </Pressable>
  );
}

/* =========================================================
   FIELD
   ========================================================= */

type FieldProps = {
  label: string;
  placeholder?: string;
  value: string;
  onChangeText: (value: string) => void;

  multiline?: boolean;

  keyboardType?: KeyboardTypeOptions;
} & Omit<
  TextInputProps,
  | 'value'
  | 'onChangeText'
  | 'placeholder'
  | 'multiline'
  | 'keyboardType'
>;

export function Field({
  label,
  placeholder,
  value,
  onChangeText,
  multiline = false,
  keyboardType = 'default',
  ...inputProps
}: FieldProps) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>
        {label}
      </Text>

      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.muted}
        multiline={multiline}
        keyboardType={keyboardType}
        style={[
          styles.input,
          multiline &&
            styles.inputMultiline,
        ]}
        {...inputProps}
      />
    </View>
  );
}

/* =========================================================
   CHIP
   ========================================================= */

type ChipProps = {
  children: React.ReactNode;
};

export function Chip({
  children,
}: ChipProps) {
  return (
    <View style={styles.chip}>
      <Text style={styles.chipText}>
        {children}
      </Text>
    </View>
  );
}

/* =========================================================
   STATE VIEW
   ========================================================= */

type StateViewProps = {
  icon?: string;
  title?: string;
  message?: string;
  loading?: boolean;
  action?: React.ReactNode;
  children?: React.ReactNode;
};

export function StateView({
  icon,
  title,
  message,
  loading = false,
  action,
  children,
}: StateViewProps) {
  return (
    <View style={styles.stateView}>
      {icon ? (
        <View style={styles.stateIcon}>
          <Text style={styles.stateIconText}>
            {icon}
          </Text>
        </View>
      ) : null}

      {title ? (
        <Text style={styles.stateTitle}>
          {title}
        </Text>
      ) : null}

      {message ? (
        <Text style={styles.stateMessage}>
          {message}
        </Text>
      ) : null}

      {loading ? (
        <Text style={styles.stateLoading}>
          Loading...
        </Text>
      ) : null}

      {action ? (
        <View style={styles.stateAction}>
          {action}
        </View>
      ) : null}

      {children}
    </View>
  );
}

/* =========================================================
   STYLES
   ========================================================= */

const styles = StyleSheet.create({
  /* -------------------------------------------------------
     BUTTON
     ------------------------------------------------------- */

  button: {
    minHeight: 52,

    paddingHorizontal: spacing.lg,

    borderRadius: 14,

    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'center',

    gap: spacing.sm,
  },

  buttonPrimary: {
    backgroundColor: colors.brand,
  },

  buttonSecondary: {
    backgroundColor: colors.brandSoft,

    borderWidth: 1,

    borderColor: colors.border,
  },

  buttonQuiet: {
    backgroundColor: 'transparent',
  },

  buttonText: {
    ...typography.label,

    textAlign: 'center',
  },

  buttonTextPrimary: {
    color: '#FFFFFF',
  },

  buttonTextSecondary: {
    color: colors.brand,
  },

  buttonTextQuiet: {
    color: colors.muted,
  },

  buttonIcon: {
    fontSize: 20,

    fontWeight: '800',
  },

  buttonIconPrimary: {
    color: '#FFFFFF',
  },

  buttonIconSecondary: {
    color: colors.brand,
  },

  buttonIconQuiet: {
    color: colors.muted,
  },

  pressed: {
    opacity: 0.82,

    transform: [
      {
        scale: 0.985,
      },
    ],
  },

  disabled: {
    opacity: 0.55,
  },

  /* -------------------------------------------------------
     CARD
     ------------------------------------------------------- */

  card: {
    backgroundColor: colors.surface,

    borderRadius: 18,

    padding: spacing.lg,

    borderWidth: 1,

    borderColor: colors.border,
  },

  cardAccent: {
    borderColor: colors.brand,
  },

  cardPressed: {
    opacity: 0.88,

    transform: [
      {
        scale: 0.985,
      },
    ],
  },

  /* -------------------------------------------------------
     FIELD
     ------------------------------------------------------- */

  field: {
    marginBottom: spacing.md,
  },

  fieldLabel: {
    marginBottom: spacing.xs,

    color: colors.ink,

    fontSize: 14,

    fontWeight: '700',
  },

  input: {
    minHeight: 52,

    paddingHorizontal: spacing.md,

    paddingVertical: spacing.sm,

    borderRadius: 14,

    borderWidth: 1,

    borderColor: colors.border,

    backgroundColor: colors.surface,

    color: colors.ink,

    fontSize: 16,
  },

  inputMultiline: {
    minHeight: 110,

    textAlignVertical: 'top',
  },

  /* -------------------------------------------------------
     CHIP
     ------------------------------------------------------- */

  chip: {
    alignSelf: 'flex-start',

    paddingHorizontal: 10,

    paddingVertical: 6,

    borderRadius: 999,

    backgroundColor: colors.brandSoft,

    borderWidth: 1,

    borderColor: colors.border,
  },

  chipText: {
    color: colors.brand,

    fontSize: 12,

    fontWeight: '800',
  },

  /* -------------------------------------------------------
     STATE VIEW
     ------------------------------------------------------- */

  stateView: {
    padding: spacing.xl,

    alignItems: 'center',

    justifyContent: 'center',
  },

  stateIcon: {
    width: 52,

    height: 52,

    borderRadius: 26,

    alignItems: 'center',

    justifyContent: 'center',

    backgroundColor: colors.brandSoft,

    borderWidth: 1,

    borderColor: colors.border,

    marginBottom: spacing.md,
  },

  stateIconText: {
    color: colors.brand,

    fontSize: 22,

    fontWeight: '800',
  },

  stateTitle: {
    ...typography.heading,

    textAlign: 'center',

    marginBottom: spacing.xs,
  },

  stateMessage: {
    ...typography.body,

    color: colors.muted,

    textAlign: 'center',
  },

  stateLoading: {
    marginTop: spacing.sm,

    color: colors.muted,

    fontSize: 13,

    fontWeight: '600',
  },

  stateAction: {
    marginTop: spacing.md,

    width: '100%',
  },
});