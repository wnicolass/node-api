import { pbkdf2, randomBytes } from 'node:crypto';

export async function hash(password) {
  return await new Promise((res, rej) => {
    genSalt(16, (err, salt) => {
      if (err) {
        return rej(err);
      }

      // Node.js does not normalize character representations
      const normalizedPass = password.normalize('NFC');

      pbkdf2(
        normalizedPass,
        salt.toString('hex'),
        100000,
        64,
        'sha512',
        (err, key) => {
          if (err) {
            return rej(err);
          }
          console.log(key.toString('hex'));
          res(key.toString('hex'));
        }
      );
    });
  });
}

export function genSalt(length = 16, callback) {
  return randomBytes(length, callback);
}