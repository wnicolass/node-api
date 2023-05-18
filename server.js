import { log } from 'node:console';
import app from './app.js';

app.on('env-loaded', () => {
  const port = process.env.PORT;
  app.listen(port, () => log(`Server listening on port ${port}`));
});
