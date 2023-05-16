'use strict';
import { createServer } from 'node:http';
import baseRoutes from './routes/base.routes.js';

const server = createServer(async (req, res) => {
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

export default server;
