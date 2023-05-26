import { Buffer } from 'node:buffer';

/*
 * Unsecured JWTs
 * There is no signature or encrpytion
 * The jwt is encoded with only two elements
 * Header and Payload.

  This code was made following the JWT Handbook v0.14.1.
  See: https://auth0.com/resources/ebooks/jwt-handbook/

  **NOT RECOMMENDED FOR PRODUCTION USE**
 */

// 1. Take the header/payload as a byte array of its UTF-8 representation.
function base64(content) {
  return Buffer.from(content)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}
// 2. Encode the byte array using the Base64-URL algorithm, removing trailing equal signs (=).
export function encode(payload = {}) {
  const encodedHeader = base64(
    JSON.stringify({
      alg: 'none',
    })
  );
  const encodedPayload = base64(
    JSON.stringify({
      ...payload,
    })
  );
  return `${encodedHeader}.${encodedPayload}`;
}
