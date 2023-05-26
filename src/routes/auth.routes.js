import { regExpCompiler } from '../utils/common.js';
import { encode, decode } from '../utils/unsec-jwt.js';

const signInRouteRegExp = regExpCompiler(/(\/api\/sign-in\/?)$/);

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
  }
  return matchedRoute;
}
