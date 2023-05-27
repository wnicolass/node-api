import { regExpCompiler } from '../utils/common.js';
import { encode, decode } from '../utils/unsec-jwt.js';
import { StringDecoder } from 'node:string_decoder';

const signInRouteRegExp = regExpCompiler(/\/api\/sign-in\/?$/);
const signUpRouteRegExp = regExpCompiler(/\/api\/sign-up\/?$/);

export default function authRoutes(req, res) {
  let matchedRoute = false;

  if (signInRouteRegExp().test(req.url) && req.method === 'GET') {
    matchedRoute = true;
    res.writeHead(200, { 'Content-Type': 'application/json' });
    const token = encode({ sub: 'id_here' });
    res.end(
      JSON.stringify({
        access_token: token,
      })
    );
  } else if (signUpRouteRegExp().test(req.url) && req.method === 'POST') {
    matchedRoute = true;
    req.on('data', (bufferedBody) => {
      const decoder = new StringDecoder('utf8');
      const { name, email, password } = JSON.parse(decoder.write(bufferedBody));
      if (!name || !email || !password) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.write(
          JSON.stringify({
            error_msg: 'Required field missing',
          })
        );
        res.emit('ready');
      }
    });
    res.on('ready', () => {
      res.end();
    });
  }
  return matchedRoute;
}
