import { StringDecoder } from 'node:string_decoder';
import models from '../database/index.js';
import { encode } from '../utils/unsec-jwt.js';
import { isValidEmail, isValidPassword } from '../utils/common.js';
import { hash } from '../utils/hash.js';
import buildRes from '../utils/res-builder.js';

export default (function authController() {
  return {
    signIn(req, res) {
      const token = encode({ sub: 'id_here' });
      const headers = { 'Content-Type': 'application/json' };
      const body = { access_token: token };
      return buildRes(res, headers, body);
    },

    signUp(req, res) {
      req.on('data', async (bufferedBody) => {
        const decoder = new StringDecoder('utf8');
        const { username, email, password } = JSON.parse(
          decoder.write(bufferedBody)
        );

        if (!username || !email || !password) {
          const headers = { 'Content-Type': 'application/json' };
          const body = { error_msg: 'Missing required field' };
          return buildRes(res, headers, body, 400);
        }

        if (!isValidEmail.test(email) || !isValidPassword.test(password)) {
          const headers = { 'Content-Type': 'application/json' };
          const body = { error_msg: 'Invalid credentials' };
          return buildRes(res, headers, body, 400);
        }

        const user = await models.User.findOne({ where: { email } });
        if (user) {
          const headers = { 'Content-Type': 'application/json' };
          const body = { error_msg: 'User already exists' };
          return buildRes(res, headers, body, 400);
        }

        return hash(password).then((hashedPassword) => {
          return models.User.create({
            username,
            email,
            hashed_password: hashedPassword,
          }).then(() => {
            const headers = { 'Content-Type': 'application/json' };
            const body = { success: 'Account created successfully' };
            return buildRes(res, headers, body);
          });
        });
      });
    },
  };
})();
