import { isBaseRoute } from '../utils/common.js';
import checkLogin from '../middleware/check-login.js';

export default async function baseRoutes(req, res) {
  let matchedRoute = false;
  try {
    if (!matchedRoute && isBaseRoute.test(req.url) && req.method === 'GET') {
      matchedRoute = true;
      await checkLogin(req, res);

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(
        JSON.stringify({
          index: 'ok',
        })
      );
    }
    return matchedRoute;
  } catch (err) {
    res.statusCode = err.statusCode;
    res.headers = err.headers;
    res.end(JSON.stringify({ error_msg: err.message }));
  }
}
