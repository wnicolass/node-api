const BASE_URL = '/api';

export default function baseRoutes(req, res) {
  let matched = false;
  if (req.url === `${BASE_URL}` && req.method === 'GET') {
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
