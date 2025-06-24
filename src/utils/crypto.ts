// cryptoUtils.js
import CryptoJS from "crypto-js";

const SECRET_KEY = "your-secret-key"; // Keep this consistent

// Encrypt function
export const encrypt = (text : string) => {
  return CryptoJS.AES.encrypt(text, SECRET_KEY).toString();
};

// Decrypt function
export const decrypt = (cipherText : string) => {
  const bytes = CryptoJS.AES.decrypt(cipherText, SECRET_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
};
