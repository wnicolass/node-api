import { log } from 'node:console';
import { default as app } from './app.js';
import './src/utils/hash.js';

app.then((server) => {
  const { PORT } = process.env;
  server.listen(PORT, () => log(`Server listening on port ${PORT}`));
});
