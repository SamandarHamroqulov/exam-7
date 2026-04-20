import { DataTypes } from "sequelize";
import { sequelize } from "../config.js";

export const OrderModel = sequelize.define("Order", {
  user_id: { type: DataTypes.BIGINT, allowNull: false },
  total_price: { type: DataTypes.FLOAT, allowNull: false },
  status: { type: DataTypes.STRING, defaultValue: "pending" }, 
  latitude: { type: DataTypes.FLOAT },
  longitude: { type: DataTypes.FLOAT },
  address: { type: DataTypes.TEXT },
});

export const OrderItemModel = sequelize.define("OrderItem", {
  order_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: OrderModel, key: "id" },
  },
  product_name: { type: DataTypes.STRING, allowNull: false },
  quantity: { type: DataTypes.INTEGER, allowNull: false },
  price: { type: DataTypes.FLOAT, allowNull: false },
});
OrderModel.hasMany(OrderItemModel, { foreignKey: 'order_id', as: 'items' });
OrderItemModel.belongsTo(OrderModel, { foreignKey: 'order_id' });