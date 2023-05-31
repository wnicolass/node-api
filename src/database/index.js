import { Sequelize } from 'sequelize';
import initModels from '../models/init-models.js';
import dbConfig from '../config/database.js';

const sequelize = new Sequelize(dbConfig);
const models = initModels(sequelize);
// Object.values(models).forEach((model) => model.sync({ alter: true }));

export default {
  ...models,
};
