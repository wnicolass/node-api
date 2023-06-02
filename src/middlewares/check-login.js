import { decode } from '../utils/unsec-jwt.js';
import models from '../database/index.js';
import HTTPError from '../errors/http.error.js';

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
    const { id, email } = decode(token).payload;
    user = await models.User.findOne({ where: { id, email } });
  } catch (err) {
    console.log(err);
  }

  if (!user) {
    throw new HTTPError('Login required', 401, {
      'Content-Type': 'application/json',
    });
  }
}
