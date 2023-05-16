import { describe, it, before, after } from 'node:test';
import { strictEqual, deepStrictEqual, ok } from 'assert';
import { get } from 'http';
import app from '../app.js';

const BASE_URL = process.env.BASE_URL ?? 'http://localhost:8000/api';

describe('Base Test Flow', async () => {
  let server = {};
  before(async () => {
    server = app.listen(8000);
    await new Promise((resolve) => server.once('listening', resolve));
  });

  it('should return ok from index', () => {
    get(BASE_URL, (res) => {
      const { statusCode } = res;
      strictEqual(statusCode, 200);
      console.log(res);
    });
  });

  after((done) => server.close(done));
});
