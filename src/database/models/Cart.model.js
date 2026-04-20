import { DataTypes } from 'sequelize';
import { sequelize } from '../config.js';
import { ProductModel } from './Product.model.js';

export const CartModel = sequelize.define('Cart', {
  user_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  quantity: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
  },
});
CartModel.belongsTo(ProductModel, { foreignKey: 'product_id', as: 'product' });
