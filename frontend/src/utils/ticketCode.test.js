import { describe, expect, it } from 'vitest';
import { estCodeValide, normaliserCode } from './ticketCode.js';

describe('normaliserCode', () => {
  it('passe le code en majuscules', () => {
    expect(normaliserCode('abc123xyz9')).toBe('ABC123XYZ9');
  });

  it('retire les espaces et caractères spéciaux', () => {
    expect(normaliserCode('ab c-12_3')).toBe('ABC123');
  });

  it('limite le code à 10 caractères', () => {
    expect(normaliserCode('ABCDEFGHIJKLMN')).toBe('ABCDEFGHIJ');
  });
});

describe('estCodeValide', () => {
  it('accepte un code de 10 caractères alphanumériques', () => {
    expect(estCodeValide('ABC123XYZ9')).toBe(true);
  });

  it('refuse un code trop court', () => {
    expect(estCodeValide('ABC123')).toBe(false);
  });

  it('refuse les caractères interdits', () => {
    expect(estCodeValide('ABC123-XYZ')).toBe(false);
  });
});
