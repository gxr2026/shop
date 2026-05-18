import CryptoJS from 'crypto-js';
import { env } from './env';

export function encryptCard(raw: string): string {
  return CryptoJS.AES.encrypt(raw, env.cardSecret).toString();
}

export function decryptCard(cipher: string): string {
  const bytes = CryptoJS.AES.decrypt(cipher, env.cardSecret);
  return bytes.toString(CryptoJS.enc.Utf8);
}
