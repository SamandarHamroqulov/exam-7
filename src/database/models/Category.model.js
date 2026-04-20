import { DataTypes } from "sequelize";
import { sequelize } from "../config.js";

export const CategoryModel = sequelize.define("Category", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
});
