import * as Crypto from 'expo-crypto';
import { PassphraseOptions, PasswordOptions, PinOptions } from '../types';

const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz';
const NUMBERS = '0123456789';
const SYMBOLS = '!@#$%^&*()-_=+[]{};:,.?/';
const AMBIGUOUS = 'O0l1I';
const WORDS = ['River', 'Coffee', 'Moon', 'Cloud', 'Cedar', 'Velvet', 'Orbit', 'Meadow', 'Copper', 'Wander', 'Harbor', 'Quiet', 'Pixel', 'Juniper', 'Solar', 'Canyon', 'Mosaic', 'Breeze', 'Saffron', 'Lumen', 'Echo', 'Willow', 'Comet', 'Nectar'];

export class GeneratorError extends Error {}

function secureIndex(max: number): number {
  if (max < 1) throw new GeneratorError('No characters are available for generation.');
  const bytes = Crypto.getRandomBytes(4);
  const value = ((bytes[0] * 0x1000000) + (bytes[1] * 0x10000) + (bytes[2] * 0x100) + bytes[3]) >>> 0;
  return value % max;
}

function choose(source: string): string {
  return source[secureIndex(source.length)];
}

export function validatePasswordOptions(options: PasswordOptions): string | null {
  if (options.length < 4 || options.length > 64) return 'Password length must be between 4 and 64 characters.';
  if (!options.uppercase && !options.lowercase && !options.numbers && !options.symbols) return 'Select at least one character type.';
  if (options.pronounceable && options.symbols) return 'Pronounceable passwords cannot include symbols.';
  return null;
}

export function generatePassword(options: PasswordOptions): string {
  const error = validatePasswordOptions(options);
  if (error) throw new GeneratorError(error);
  let pool = '';
  const required: string[] = [];
  if (options.uppercase) { pool += UPPERCASE; required.push(choose(UPPERCASE)); }
  if (options.lowercase) { pool += LOWERCASE; required.push(choose(LOWERCASE)); }
  if (options.numbers) { pool += NUMBERS; required.push(choose(NUMBERS)); }
  if (options.symbols) { pool += SYMBOLS; required.push(choose(SYMBOLS)); }
  const exclusions = new Set(`${options.excludeAmbiguous ? AMBIGUOUS : ''}${options.excludeCharacters}`);
  pool = [...pool].filter((character) => !exclusions.has(character)).join('');
  const filteredRequired = required.map((character) => exclusions.has(character) ? choose(pool) : character);
  if (!pool) throw new GeneratorError('Your exclusions remove every available character.');
  const result = [...filteredRequired];
  while (result.length < options.length) result.push(choose(pool));
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = secureIndex(index + 1);
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }
  return result.join('');
}

export function generatePassphrase(options: PassphraseOptions): string {
  if (options.words < 2 || options.words > 8) throw new GeneratorError('Choose between 2 and 8 words.');
  const selected = Array.from({ length: options.words }, () => {
    const word = WORDS[secureIndex(WORDS.length)];
    return options.capitalize ? word : word.toLowerCase();
  });
  if (options.includeNumbers) selected.push(choose(NUMBERS) + choose(NUMBERS));
  return selected.join(options.separator);
}

export function generatePin(options: PinOptions): string {
  const digits: string[] = [];
  while (digits.length < options.length) {
    const digit = choose(NUMBERS);
    if (options.excludeRepeated && digits.includes(digit)) continue;
    digits.push(digit);
  }
  return digits.join('');
}

export function calculateStrength(value: string, options?: PasswordOptions): { label: string; score: number } {
  if (!value) return { label: 'Not rated', score: 0 };
  let score = 0;
  if (value.length >= 8) score += 1;
  if (value.length >= 14) score += 1;
  if (/[a-z]/.test(value)) score += 1;
  if (/[A-Z]/.test(value)) score += 1;
  if (/\d/.test(value)) score += 1;
  if (/[^A-Za-z0-9]/.test(value)) score += 1;
  if (options?.excludeAmbiguous) score = Math.min(6, score + 1);
  if (score <= 2) return { label: 'Weak', score };
  if (score <= 4) return { label: 'Medium', score };
  if (score === 5) return { label: 'Strong', score };
  return { label: 'Very strong', score };
}
