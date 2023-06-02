import { isBaseRoute } from '../utils/common.js';
import baseController from '../controllers/base.controller.js';

export default async function baseRoutes(req, res) {
  let matchedRoute = false;
  if (!matchedRoute && isBaseRoute.test(req.url) && req.method === 'GET') {
    matchedRoute = true;
    baseController.index(req, res);
  }
  return matchedRoute;
}
