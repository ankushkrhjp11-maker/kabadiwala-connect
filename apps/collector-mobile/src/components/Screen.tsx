import type {
  PropsWithChildren,
  ReactNode,
} from 'react';

import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  colors,
  spacing,
  typography,
} from '../theme';

type ScreenProps = PropsWithChildren<{
  title?: string;
  subtitle?: string;
  headerRight?: ReactNode;
  showBack?: boolean;
  onBack?: () => void;
}>;

export function Screen({
  children,
  title,
  subtitle,
  headerRight,
  showBack = false,
  onBack,
}: ScreenProps) {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {(title ||
          subtitle ||
          headerRight ||
          showBack) && (
          <View style={styles.header}>
            {showBack && (
              <Pressable
                onPress={onBack}
                style={({ pressed }) => [
                  styles.backButton,
                  pressed && styles.pressed,
                ]}
              >
                <Text style={styles.backIcon}>
                  ‹
                </Text>
              </Pressable>
            )}

            <View style={styles.headerText}>
              {title && (
                <Text style={typography.title}>
                  {title}
                </Text>
              )}

              {subtitle && (
                <Text style={styles.subtitle}>
                  {subtitle}
                </Text>
              )}
            </View>

            {headerRight}
          </View>
        )}

        {children}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.canvas,
  },

  content: {
    padding: spacing.md,
    paddingBottom: 30,
    flexGrow: 1,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.lg,
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },

  backIcon: {
    fontSize: 30,
    lineHeight: 32,
    color: colors.ink,
    marginTop: -2,
  },

  pressed: {
    opacity: 0.65,
  },

  headerText: {
    flex: 1,
  },

  subtitle: {
    ...typography.body,
    color: colors.muted,
    marginTop: spacing.xs,
  },
});