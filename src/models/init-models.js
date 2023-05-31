import { DataTypes } from 'sequelize';
import { default as User } from './User.js';

export default function initModels(sequelize) {
  return {
    User: User(sequelize, DataTypes),
  };
}
