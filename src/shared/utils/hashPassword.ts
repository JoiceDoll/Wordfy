import CryptoJS from 'crypto-js';

export function hashPassword(password: string, salt: string): string {
  return CryptoJS.SHA256(`${salt}:${password}`).toString(CryptoJS.enc.Hex);
}

export function createSalt(): string {
  return CryptoJS.lib.WordArray.random(16).toString(CryptoJS.enc.Hex);
}
