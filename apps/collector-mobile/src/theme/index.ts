import { Platform } from 'react-native';

export const colors = {
  brand: '#0B6B57',
  brandDark: '#084C3E',
  brandSoft: '#E6F4EF',
  ink: '#17211F',
  muted: '#61716D',
  canvas: '#F6F9F7',
  surface: '#FFFFFF',
  border: '#DDE8E3',
  warning: '#9A5A00',
  warningSoft: '#FFF4DF',
  danger: '#A33B3B',
  dangerSoft: '#FDECEC',
  success: '#216C44',
};

export const spacing = { xs: 6, sm: 10, md: 16, lg: 22, xl: 30 };

export const typography = {
  title: { fontSize: 26, lineHeight: 32, fontWeight: '800' as const, color: colors.ink },
  heading: { fontSize: 20, lineHeight: 26, fontWeight: '800' as const, color: colors.ink },
  body: { fontSize: 16, lineHeight: 23, color: colors.ink },
  label: { fontSize: 13, lineHeight: 18, fontWeight: '700' as const, color: colors.muted },
};

export const shadow = Platform.select({
  android: { elevation: 2 },
  ios: { shadowColor: '#12352B', shadowOpacity: 0.08, shadowRadius: 8, shadowOffset: { width: 0, height: 3 } },
  default: {},
});
