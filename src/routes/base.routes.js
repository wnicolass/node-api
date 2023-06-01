import { isBaseRoute } from '../utils/common.js';
import checkLogin from '../middleware/check-login.js';

export default async function baseRoutes(req, res) {
  let matchedRoute = false;

  if (!matchedRoute && isBaseRoute.test(req.url) && req.method === 'GET') {
    matchedRoute = true;
    const isAuthorized = await checkLogin(req, res);

    if (!isAuthorized) {
      return matchedRoute;
    }

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(
      JSON.stringify({
        index: 'ok',
      })
    );
  }
  return matchedRoute;
}
