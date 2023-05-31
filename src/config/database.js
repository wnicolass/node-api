import { loadEnvSync } from '../utils/load-env.js';

loadEnvSync();

export default {
  dialect: 'mysql',
  host: process.env.DATABASE_HOST,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD || '',
  port: process.env.DATABASE_PORT,
  database: process.env.DATABASE,
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
    createdAt: false,
    updatedAt: false,
  },
  dialectOptions: {
    timezone: '+02:00',
  },
  timezone: 'Europe/Lisbon',
};
