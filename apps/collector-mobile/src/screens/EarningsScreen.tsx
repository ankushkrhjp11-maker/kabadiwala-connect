import { Screen } from '../components/Screen';
import { Card, StateView } from '../components/UI';
import { colors, spacing, typography } from '../theme';
import { Text, StyleSheet } from 'react-native';

type EarningsScreenProps = {
  onBack: () => void;
};

export function EarningsScreen({
  onBack,
}: EarningsScreenProps) {
  return (
    <Screen
      title="My earnings"
      subtitle="A clear view of your collection income."
      showBack
      onBack={onBack}
    >
      <Card accent>
        <Text style={styles.label}>
          AVAILABLE THIS MONTH
        </Text>

        <Text style={styles.amount}>
          ₹ 0
        </Text>

        <Text style={styles.muted}>
          No confirmed handovers yet
        </Text>
      </Card>

      <StateView
        icon="₹"
        title="Your ledger is empty"
        message="Confirmed payments and future earnings will be shown here. We never change old entries."
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  label: {
    ...typography.label,
    color: colors.brand,
  },

  amount: {
    fontSize: 36,
    fontWeight: '900',
    color: colors.brandDark,
    marginTop: spacing.xs,
  },

  muted: {
    ...typography.body,
    color: colors.muted,
  },
});