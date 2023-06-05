import { decodeJWT } from '../utils/signed-jwt.js';
import models from '../database/index.js';
import HTTPError from '../errors/http.error.js';

const { JWT_SECRET } = process.env;

export default async function checkLogin(req, res) {
  const { authorization } = req.headers;

  if (!authorization) {
    throw new HTTPError('Login required', 401, {
      'Content-Type': 'application/json',
    });
  }

  const [, token] = authorization.split(/\s/);
  let user;
  try {
    const { sub, email } = decodeJWT(token, JWT_SECRET).payload;
    user = await models.User.findOne({ where: { id: sub, email } });
  } catch (err) {
    console.log(err);
  }

  if (!user) {
    throw new HTTPError('Login required', 401, {
      'Content-Type': 'application/json',
    });
  }

  req.user = user;
  return;
}
