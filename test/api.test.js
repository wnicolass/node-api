import { describe, it, before, after } from 'node:test';
import { strictEqual, deepStrictEqual, ok } from 'node:assert';
import { default as app } from '../app.js';

describe('Base Test Flow', async () => {
  let server = {};
  let URL = ``;

  before(async () => {
    await app.then(async (_app) => {
      server = _app.listen(8000);
      const { BASE_URL, PORT } = process.env;
      URL = `${BASE_URL}:${PORT}`;
    });
    await new Promise((resolve) => server.once('listening', resolve));
  });

  it('should return ok from index', async () => {
    try {
      const res = await fetch(URL);
      strictEqual(res.status, 200);
      const responseData = await res.json();
      ok(
        typeof responseData.index === 'string',
        'response data should be string'
      );
      ok(responseData.index === 'ok', 'response data content should be "ok"');
      deepStrictEqual(responseData, { index: 'ok' });
    } catch (err) {
      console.error(err);
    }
  });

  after((done) => server.close(done));
});
