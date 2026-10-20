import { ColorSchemeName } from 'react-native';
import { ThemePreference } from '../types';

export interface AppColors { background: string; surface: string; ink: string; muted: string; line: string; accent: string; accentSoft: string; danger: string; tab: string; }
export const lightColors: AppColors = { background: '#F7F8FA', surface: '#FFFFFF', ink: '#17202A', muted: '#7B8794', line: '#E8EBEF', accent: '#0F766E', accentSoft: '#DDF4EF', danger: '#C2415A', tab: '#61707D' };
export const darkColors: AppColors = { background: '#101719', surface: '#182326', ink: '#F2F7F6', muted: '#9AABAE', line: '#2A393B', accent: '#57C7B5', accentSoft: '#203F3B', danger: '#F27B8E', tab: '#A9B8BA' };
export function getColors(preference: ThemePreference, system: ColorSchemeName): AppColors {
  return preference === 'dark' || (preference === 'system' && system === 'dark') ? darkColors : lightColors;
}
