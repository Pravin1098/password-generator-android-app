jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));
jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));

import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { defaultSettings, HistoryEntry } from '../types';
import { loadHistory, loadSettings, saveFavorites, saveHistory, saveSettings } from './storage';

describe('local storage', () => {
  it('returns defaults when settings are empty', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
    await expect(loadSettings()).resolves.toEqual(defaultSettings);
  });

  it('persists preferences and sensitive collections through their intended stores', async () => {
    const entry: HistoryEntry = { id: '1', value: 'offline-secret', mode: 'password', createdAt: 1 };
    await saveSettings(defaultSettings);
    await saveHistory([entry]);
    await saveFavorites([entry]);
    expect(AsyncStorage.setItem).toHaveBeenCalled();
    expect(SecureStore.setItemAsync).toHaveBeenCalledTimes(2);
  });

  it('returns an empty history when secure storage has no value', async () => {
    (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(null);
    await expect(loadHistory()).resolves.toEqual([]);
  });
});
