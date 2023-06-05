import checkLogin from '../middlewares/check-login.js';

export default (function baseController() {
  return {
    async index(req, res) {
      try {
        await checkLogin(req, res);
      } catch (err) {
        res.statusCode = err.statusCode;
        res.headers = err.headers;
        return res.end(JSON.stringify({ error_msg: err.message }));
      }

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(
        JSON.stringify({
          username: req.user.username,
        })
      );
    },
  };
})();
