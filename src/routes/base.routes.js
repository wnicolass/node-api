import { regExpCompiler } from '../utils/common.js';

const baseRoutesRegExp = regExpCompiler(/(\/api\/?|\/)$/);

export default function baseRoutes(req, res) {
  let matched = false;
  if (baseRoutesRegExp().test(req.url) && req.method === 'GET') {
    matched = true;
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(
      JSON.stringify({
        index: 'ok',
      })
    );
  }
  return matched;
}
