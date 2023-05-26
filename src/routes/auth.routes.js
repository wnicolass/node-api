import { regExpCompiler } from '../utils/common.js';

const signInRouteRegExp = regExpCompiler(/(\/api\/sign-in\/?)$/);

export default function authRoutes(req, res) {
  let matchedRoute = false;
  if (signInRouteRegExp().test(req.url) && req.method === 'POST') {
    matchedRoute = true;
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(
      JSON.stringify({
        access_token: 'imagine the token here',
      })
    );
  }
  return matchedRoute;
}
