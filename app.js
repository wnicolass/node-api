'use strict';
import { createServer } from 'node:http';
import baseRoutes from './routes/base.routes.js';
import loadEnv from './utils/load-env.js';

const server = createServer();

export default (async function app() {
  await loadEnv();

  server.on('request', async (req, res) => {
    let matchedRoute;
    matchedRoute = baseRoutes(req, res);

    if (!matchedRoute) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(
        JSON.stringify({
          error_message: 'Not Found',
        })
      );
    }
  });

  return server;
})();
