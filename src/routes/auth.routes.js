import { isSignUp, isSignIn } from '../utils/common.js';
import authController from '../controllers/auth.controller.js';

export default function authRoutes(req, res) {
  let matchedRoute = false;

  if (!matchedRoute && isSignIn.test(req.url) && req.method === 'POST') {
    matchedRoute = true;
    authController.signIn(req, res);
  } else if (!matchedRoute && isSignUp.test(req.url) && req.method === 'POST') {
    matchedRoute = true;
    authController.signUp(req, res);
  }
  res.on('ready', () => res.end());

  return matchedRoute;
}
