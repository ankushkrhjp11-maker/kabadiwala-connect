import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { AppRoute } from '../navigation/types';
import { colors, spacing } from '../theme';

const tabs: Array<{ route: AppRoute; label: string; icon: string }> = [
  { route: 'dashboard', label: 'Home', icon: '⌂' },
  { route: 'myLots', label: 'My lots', icon: '▣' },
  { route: 'earnings', label: 'Earnings', icon: '₹' },
  { route: 'profile', label: 'Profile', icon: '●' },
];

export function BottomNav({ active, onNavigate }: { active: AppRoute; onNavigate: (route: AppRoute) => void }) {
  return <View style={styles.bar}>{tabs.map((tab) => <Pressable key={tab.route} accessibilityRole="tab" accessibilityLabel={tab.label} onPress={() => onNavigate(tab.route)} style={styles.tab}><Text style={[styles.icon, active === tab.route && styles.active]}>{tab.icon}</Text><Text style={[styles.label, active === tab.route && styles.active]}>{tab.label}</Text></Pressable>)}</View>;
}

const styles = StyleSheet.create({
  bar: { flexDirection: 'row', backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 8, paddingBottom: 8 },
  tab: { flex: 1, alignItems: 'center', minHeight: 54, justifyContent: 'center' },
  icon: { fontSize: 22, color: colors.muted, marginBottom: 3 },
  label: { fontSize: 12, color: colors.muted, fontWeight: '700' },
  active: { color: colors.brand },
});
