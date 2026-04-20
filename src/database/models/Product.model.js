import { DataTypes } from "sequelize";
import { sequelize } from "../config.js";
import { CategoryModel } from "./Category.model.js";

export const ProductModel = sequelize.define("Product", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  price: { type: DataTypes.FLOAT, allowNull: false },
  image: { type: DataTypes.STRING, allowNull: true },
  description: { type: DataTypes.TEXT, allowNull: true },
  category_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: CategoryModel, key: "id" },
  },
});

CategoryModel.hasMany(ProductModel, { foreignKey: "category_id" });
ProductModel.belongsTo(CategoryModel, { foreignKey: "category_id" });
