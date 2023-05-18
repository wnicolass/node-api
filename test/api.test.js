import { describe, it, before, after } from 'node:test';
import { strictEqual, deepStrictEqual, ok } from 'node:assert';
import { get } from 'node:http';
import app from '../app.js';

const BASE_URL = process.env.BASE_URL ?? 'http://localhost:8000/api';
const PORT = process.env.PORT;

describe('Base Test Flow', async () => {
  let server = {};
  before(async () => {
    server = app.listen(PORT);
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
