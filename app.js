'use strict';
import { createServer } from 'node:http';
import baseRoutes from './src/routes/base.routes.js';
import loadEnv from './src/utils/load-env.js';
import authRoutes from './src/routes/auth.routes.js';

const server = createServer();

export default (async function app() {
  await loadEnv();

  server.on('request', async (req, res) => {
    let matchedRoute = await baseRoutes(req, res);
    matchedRoute ||= authRoutes(req, res);

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
