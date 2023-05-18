const BASE_URL = '/api';

export default function baseRoutes(req, res) {
  let matched = false;
  const isBaseURL = req.url === `${BASE_URL}` || req.url === '/';
  if (isBaseURL && req.method === 'GET') {
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
