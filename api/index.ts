
import { createServer } from 'http';
import app from '../src/api.js';

// No Vercel, o ambiente será production, garantindo o "export default app;" no api.js
export default app;
