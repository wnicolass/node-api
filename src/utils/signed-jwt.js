import { createHmac } from 'node:crypto';
import { JwtTypeError, JwtError } from '../errors/jwt.error.js';
import { base64 } from './unsec-jwt.js';

/*
 * We sign a JWT to ensure that the
 * data contained therein is authentic
 *
 * This code was made following the JWT Handbook v0.14.1
 * See: https://auth0.com/resources/ebooks/jwt-handbook/
 */

function unbase64(b64encoded) {
  return Buffer.from(b64encoded, 'base64url').toString();
}

export function encodeJWT(payload, secret) {
  if (typeof payload !== 'object') {
    throw new JwtTypeError(
      `Header and Payload must be of type object, instead received ${typeof header} - ${typeof payload}`
    );
  }

  if (typeof secret !== 'string') {
    throw new JwtTypeError(
      `Secret must be of type string, instead received ${typeof secret}`
    );
  }

  // HMAC + SHA256 = HS256
  const header = {
    alg: 'HS256',
    typ: 'JWT',
  };

  // 7 days in seconds
  const expiryDate = (Date.now() + 1000 * 60 * 60 * 24 * 7) / 1000;
  payload['exp'] = expiryDate;
  payload['iat'] = Date.now() / 1000;

  // encoding header and payload
  const encodedHeader = base64(JSON.stringify(header));
  const encodedPayload = base64(JSON.stringify(payload));
  const baseJWT = `${encodedHeader}.${encodedPayload}`;

  // signing JWT
  const signature = createHmac('sha256', secret);
  signature.update(JSON.stringify(baseJWT));
  const signatureDigest = signature.digest('base64url');

  return `${baseJWT}.${signatureDigest}`;
}

export function decodeJWT(jwt, secret) {
  if (typeof jwt !== 'string' || typeof secret !== 'string') {
    throw new JwtTypeError(
      `JWT and Secret must be both of type string, instead received`
    );
  }

  const jwtParts = jwt.split('.');
  if (jwtParts.length !== 3) {
    throw new JwtError('Invalid JWT format');
  }

  const [header, payload, incomingSignature] = jwtParts;
  const parsedHeader = JSON.parse(unbase64(header));
  const parsedPayload = JSON.parse(unbase64(payload));

  if (parsedHeader.alg !== 'HS256') {
    throw new JwtError('Invalid JWT algorithm');
  } else if (!(Date.now() / 1000 < parsedPayload.exp)) {
    throw new JwtError('Expired JWT');
  }

  // Sig === Signature
  const checkSig = createHmac('sha256', secret);
  checkSig.update(JSON.stringify(`${header}.${payload}`));
  const checkSigDigest = checkSig.digest('base64url');

  if (incomingSignature !== checkSigDigest) {
    throw new JwtError('Invalid JWT');
  }

  return { header: parsedHeader, payload: parsedPayload };
}
