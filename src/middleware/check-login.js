import { decode } from '../utils/unsec-jwt.js';
import models from '../database/index.js';

export default async function checkLogin(req, res) {
  let isAuthorized = false;
  const { authorization } = req.headers;

  if (!authorization) {
    res.statusCode = 401;
    res.setHeader('Content-Type', 'application/json');
    res.write(
      JSON.stringify({
        error_msg: 'Login required',
      })
    );
    res.end();
    return isAuthorized;
  }

  const [, token] = authorization.split(/\s/);

  const { id, email } = decode(token).payload;
  const user = await models.User.findOne({ where: { id, email } });
  if (!user) {
    res.statusCode = 401;
    res.setHeader('Content-Type', 'application/json');
    res.write(
      JSON.stringify({
        error_msg: 'Login required',
      })
    );
    res.end();
    return isAuthorized;
  }
  isAuthorized = true;
  return isAuthorized;
}
