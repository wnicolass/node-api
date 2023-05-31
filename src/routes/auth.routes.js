import { regExpCompiler } from '../utils/common.js';
import { encode } from '../utils/unsec-jwt.js';
import { StringDecoder } from 'node:string_decoder';
import { hash } from '../utils/hash.js';
import models from '../database/index.js';

const isSignIn = regExpCompiler(/\/api\/sign-in\/?$/)();
const isSignUp = regExpCompiler(/\/api\/sign-up\/?$/)();
const isValidEmail = regExpCompiler(
  /^[^\s\.]+\.?[^\s\.]+@[^\s]+\.[^\s]+\w+$/
)();
const isValidPassword = regExpCompiler(
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%\]\)]).{6,20}$/
)();

export default function authRoutes(req, res) {
  let matchedRoute = false;

  if (isSignIn.test(req.url) && req.method === 'GET') {
    matchedRoute = true;
    res.writeHead(200, { 'Content-Type': 'application/json' });
    const token = encode({ sub: 'id_here' });
    res.end(
      JSON.stringify({
        access_token: token,
      })
    );
  } else if (isSignUp.test(req.url) && req.method === 'POST') {
    matchedRoute = true;
    req.on('data', async (bufferedBody) => {
      const decoder = new StringDecoder('utf8');
      const { username, email, password } = JSON.parse(
        decoder.write(bufferedBody)
      );

      if (!username || !email || !password) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.write(
          JSON.stringify({
            error_msg: 'Missing required field',
          })
        );
        return res.emit('ready');
      }

      if (!isValidEmail.test(email) || !isValidPassword.test(password)) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.write(
          JSON.stringify({
            error_msg: 'Invalid credentials',
          })
        );
        return res.emit('ready');
      }

      const user = await models.User.findOne({ where: { email } });
      if (user) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.write(
          JSON.stringify({
            error_msg: 'User already exists',
          })
        );
        return res.emit('ready');
      }

      return hash(password).then((hashedPassword) => {
        return models.User.create({
          username,
          email,
          hashed_password: hashedPassword,
        }).then(() => res.emit('ready'));
      });
    });
    res.on('ready', () => {
      res.end();
    });
  }
  return matchedRoute;
}
