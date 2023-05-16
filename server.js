import { log } from 'node:console';
import app from './app.js';

const port = process.env.PORT || 8000;

app.listen(port, () => log(`Server listening on port ${port}`));
