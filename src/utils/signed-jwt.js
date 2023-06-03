import { createHmac } from 'node:crypto';
import JwtPartTypeError from '../errors/jwt.error.js';
import { base64 } from './unsec-jwt.js';

const { JWT_SECRET } = process.env;

/*
 * We sign a JWT to ensure that the
 * data contained therein is authentic
 *
 * This code was made following the JWT Handbook v0.14.1
 * See: https://auth0.com/resources/ebooks/jwt-handbook/
 */

export function signedEncode(header, payload, secret) {
  if (typeof header !== 'object' || typeof payload !== 'object') {
    throw new JwtPartTypeError(
      `Header and Payload must be of type object, instead received ${typeof header} - ${typeof payload}`
    );
  }

  if (typeof secret !== 'string') {
    throw new JwtPartTypeError(
      `Secret must be of type string, instead received ${typeof secret}`
    );
  }

  // HMAC + SHA256 = HS256
  header['alg'] = 'HS256';

  // encoding header and payload
  const encodedHeader = base64(JSON.stringify(header));
  const encodedPayload = base64(JSON.stringify(payload));
  const baseJWT = `${encodedHeader}.${encodedPayload}`;

  // signing JWT
  const signature = createHmac('sha256', JWT_SECRET);
  signature.update(JSON.stringify(baseJWT));
  const signatureDigest = signature.digest('base64url');

  return `${baseJWT}.${signatureDigest}`;
}
console.log(signedEncode({}, { sub: 1, iat: 3123123 }, ''));
