import { StringDecoder } from 'node:string_decoder';
import models from '../database/index.js';
import { encode } from '../utils/unsec-jwt.js';
import { isValidEmail, isValidPassword } from '../utils/common.js';
import { hash, compare } from '../utils/hash.js';
import buildRes from '../utils/res-builder.js';

export default (function authController() {
  return {
    signIn(req, res) {
      req.on('data', async (bodyBuffer) => {
        const decoder = new StringDecoder('utf8');
        const { email, password } = JSON.parse(decoder.write(bodyBuffer));

        if (!email || !password) {
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
        if (!user) {
          const headers = { 'Content-Type': 'application/json' };
          const body = { error_msg: `User with email ${email} doesn't exist` };
          return buildRes(res, headers, body, 404);
        }
        const passwordMatches = await compare(password, user.hashed_password);
        if (!passwordMatches) {
          const headers = { 'Content-Type': 'application/json' };
          const body = { error_msg: `Invalid credentials` };
          return buildRes(res, headers, body, 400);
        }

        const payload = { id: user.id, email };
        const token = encode(payload);
        const headers = { 'Content-Type': 'application/json' };
        const body = { access_token: token };
        return buildRes(res, headers, body, 200);
      });
    },

    signUp(req, res) {
      req.on('data', async (bodyBuffer) => {
        const decoder = new StringDecoder('utf8');
        const { username, email, password } = JSON.parse(
          decoder.write(bodyBuffer)
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

        const hashedPassword = await hash(password);
        await models.User.create({
          username,
          email,
          hashed_password: hashedPassword,
        });

        const headers = { 'Content-Type': 'application/json' };
        const body = { success: 'Account created successfully' };
        return buildRes(res, headers, body);
      });
    },
  };
})();
