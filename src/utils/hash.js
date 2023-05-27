import { pbkdf2, randomBytes } from 'node:crypto';

export async function hash(password) {
  return await new Promise((res, rej) => {
    genSalt(16, (err, bufferedSalt) => {
      if (err) {
        return rej(err);
      }

      // Node.js does not normalize character representations
      const normalizedPass = password.normalize('NFC');
      const salt = bufferedSalt.toString('hex');

      function hashCb(err, key) {
        if (err) {
          return rej(err);
        }
        res(key.toString('hex'));
      }

      pbkdf2(normalizedPass, salt, 100000, 64, 'sha512', hashCb);
    });
  });
}

export function genSalt(length = 16, callback) {
  return randomBytes(length, callback);
}
