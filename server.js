import { log } from 'node:console';
import app from './app.js';

app.on('env-loaded', () => {
  const { PORT } = process.env;
  app.listen(PORT, () => log(`Server listening on port ${PORT}`));
});
