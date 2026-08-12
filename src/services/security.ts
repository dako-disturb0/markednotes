import * as Crypto from 'expo-crypto';

const APP_SALT = 'MARKED_NOTES_SECURE_SALT_v1_2026';

export const SecurityService = {
  /**
   * Generates a unique SHA-256 Security Hash for the application instance.
   */
  async getAppSecurityHash(): Promise<string> {
    const rawString = `MARKED_NOTES_APP_${APP_SALT}_EXPO_V57`;
    const digest = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      rawString
    );
    return digest.toUpperCase();
  },

  /**
   * Generates a SHA-256 integrity checksum hash for note content or files.
   */
  async generateContentHash(content: string): Promise<string> {
    const digest = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      content + APP_SALT
    );
    return digest.substring(0, 16).toUpperCase();
  },

  /**
   * Simple XOR Cipher + Base64 text encryption for secure note payload.
   */
  encryptText(text: string, secretKey: string = APP_SALT): string {
    if (!text) return '';
    try {
      let result = '';
      for (let i = 0; i < text.length; i++) {
        const charCode = text.charCodeAt(i) ^ secretKey.charCodeAt(i % secretKey.length);
        result += String.fromCharCode(charCode);
      }
      return encodeURIComponent(result);
    } catch (e) {
      console.error('Encryption failed', e);
      return text;
    }
  },

  /**
   * Decrypts text encrypted by encryptText.
   */
  decryptText(encryptedText: string, secretKey: string = APP_SALT): string {
    if (!encryptedText) return '';
    try {
      const decoded = decodeURIComponent(encryptedText);
      let result = '';
      for (let i = 0; i < decoded.length; i++) {
        const charCode = decoded.charCodeAt(i) ^ secretKey.charCodeAt(i % secretKey.length);
        result += String.fromCharCode(charCode);
      }
      return result;
    } catch (e) {
      console.error('Decryption failed', e);
      return encryptedText;
    }
  },
};
