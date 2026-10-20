import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { AppSettings, defaultSettings, HistoryEntry } from '../types';

const SETTINGS_KEY = '@securepass/settings';
const HISTORY_KEY = 'securepass.history';
const FAVORITES_KEY = 'securepass.favorites';

async function readSecure<T>(key: string): Promise<T[]> {
  try {
    const value = await SecureStore.getItemAsync(key);
    return value ? JSON.parse(value) as T[] : [];
  } catch {
    return [];
  }
}

async function writeSecure<T>(key: string, value: T[]): Promise<void> {
  await SecureStore.setItemAsync(key, JSON.stringify(value));
}

export async function loadSettings(): Promise<AppSettings> {
  try {
    const stored = await AsyncStorage.getItem(SETTINGS_KEY);
    return stored ? { ...defaultSettings, ...JSON.parse(stored) } : defaultSettings;
  } catch {
    return defaultSettings;
  }
}

export async function saveSettings(settings: AppSettings): Promise<void> {
  await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

export const loadHistory = () => readSecure<HistoryEntry>(HISTORY_KEY);
export const loadFavorites = () => readSecure<HistoryEntry>(FAVORITES_KEY);
export const saveHistory = (items: HistoryEntry[]) => writeSecure(HISTORY_KEY, items);
export const saveFavorites = (items: HistoryEntry[]) => writeSecure(FAVORITES_KEY, items);
export async function clearAllData(): Promise<void> {
  await Promise.all([AsyncStorage.removeItem(SETTINGS_KEY), SecureStore.deleteItemAsync(HISTORY_KEY), SecureStore.deleteItemAsync(FAVORITES_KEY)]);
}
