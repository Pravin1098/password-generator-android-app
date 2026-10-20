import { calculateStrength, generatePassphrase, generatePassword, generatePin, validatePasswordOptions } from './generator';
import { defaultPasswordOptions } from '../types';

describe('SecurePass generators', () => {
  it('creates a password at the requested length', () => {
    const password = generatePassword({ ...defaultPasswordOptions, length: 32 });
    expect(password).toHaveLength(32);
  });

  it('honors character selection and ambiguous exclusion', () => {
    const password = generatePassword({ length: 20, uppercase: false, lowercase: true, numbers: false, symbols: false, excludeAmbiguous: true, excludeCharacters: '', pronounceable: false });
    expect(password).toMatch(/^[a-km-z]+$/);
    expect(password).not.toMatch(/[l]/);
  });

  it('rejects invalid character combinations', () => {
    expect(validatePasswordOptions({ ...defaultPasswordOptions, uppercase: false, lowercase: false, numbers: false, symbols: false })).toBeTruthy();
    expect(() => generatePassword({ ...defaultPasswordOptions, pronounceable: true })).toThrow();
  });

  it('calculates an increasing strength score', () => {
    expect(calculateStrength('abc').score).toBeLessThan(calculateStrength('Abcdef123!long').score);
  });

  it('creates the requested PIN length without repeats', () => {
    const pin = generatePin({ length: 8, excludeRepeated: true });
    expect(pin).toHaveLength(8);
    expect(new Set(pin).size).toBe(8);
  });

  it('creates passphrases with requested words and options', () => {
    const phrase = generatePassphrase({ words: 3, separator: '-', includeNumbers: true, capitalize: true });
    expect(phrase.split('-')).toHaveLength(4);
    expect(phrase).toMatch(/[A-Z]/);
    expect(phrase).toMatch(/\d\d$/);
  });
});
