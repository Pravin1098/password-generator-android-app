export type GeneratorMode = 'password' | 'passphrase' | 'pin';
export type ThemePreference = 'system' | 'light' | 'dark';

export interface PasswordOptions {
  length: number;
  uppercase: boolean;
  lowercase: boolean;
  numbers: boolean;
  symbols: boolean;
  excludeAmbiguous: boolean;
  excludeCharacters: string;
  pronounceable: boolean;
}

export interface PassphraseOptions {
  words: number;
  separator: string;
  includeNumbers: boolean;
  capitalize: boolean;
}

export interface PinOptions {
  length: 4 | 6 | 8;
  excludeRepeated: boolean;
}

export interface HistoryEntry {
  id: string;
  value: string;
  mode: GeneratorMode;
  createdAt: number;
}

export interface AppSettings {
  theme: ThemePreference;
  historyEnabled: boolean;
  defaultLength: number;
  hapticsEnabled: boolean;
  passwordOptions: PasswordOptions;
}

export const defaultPasswordOptions: PasswordOptions = {
  length: 18,
  uppercase: true,
  lowercase: true,
  numbers: true,
  symbols: true,
  excludeAmbiguous: false,
  excludeCharacters: '',
  pronounceable: false,
};

export const defaultSettings: AppSettings = {
  theme: 'system',
  historyEnabled: true,
  defaultLength: 18,
  hapticsEnabled: true,
  passwordOptions: defaultPasswordOptions,
};
