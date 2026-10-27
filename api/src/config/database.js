import pg from 'pg';
import { config } from './index.js';

export const pool = new pg.Pool({
  ...config.db,
  max: 10,
  connectionTimeoutMillis: 3000,
});
