import { pbkdf2, randomBytes } from 'node:crypto';
import { Buffer } from 'node:buffer';

function genSalt(length = 16, callback) {
  return randomBytes(length, callback);
}

function hash(password) {
  return new Promise((res, rej) => {
    genSalt(16, (err, bufferedSalt) => {
      if (err) {
        return rej(err);
      }

      // Node.js does not normalize character representations
      const normalizedPass = password.normalize('NFC');

      function hashCb(err, key) {
        if (err) {
          rej(err);
        }

        const keyBuffer = Buffer.alloc(16 * 5);

        // Adding salt to the password buffer
        bufferedSalt.copy(keyBuffer);

        // Adding the generated key to the password buffer
        key.copy(keyBuffer, bufferedSalt.length);
        res(keyBuffer.toString('hex'));
      }

      // See: https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html#pbkdf2
      pbkdf2(normalizedPass, bufferedSalt, 210000, 64, 'sha512', hashCb);
    });
  });
}

function compare(password, hashedPassword) {
  return new Promise((res, rej) => {
    const hashedPasswordBuffer = Buffer.from(hashedPassword, 'hex');

    // Workaround because buffer.slice is deprecated
    const [...passAsUint8BitArray] = new Uint8Array(hashedPasswordBuffer);

    // Getting salt from the password byte array
    const salt = Buffer.from(passAsUint8BitArray.slice(0, 16));

    // Getting the password from the password byte array
    const storedPassAsBuffer = Buffer.from(
      passAsUint8BitArray.slice(16, 16 * 5)
    );

    function hashCb(err, key) {
      if (err) {
        rej(err);
      }

      res(storedPassAsBuffer.compare(key) === 0);
    }

    pbkdf2(password, salt, 210000, 64, 'sha512', hashCb);
  });
}

export { hash, compare };
