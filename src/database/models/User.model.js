import { DataTypes } from "sequelize";
import { sequelize } from "../config.js";

export const UserModel = sequelize.define("User", {
  user_id: { type: DataTypes.BIGINT, allowNull: false, unique: true },
  firstname: { type: DataTypes.STRING },
  phone_number: { type: DataTypes.STRING, allowNull: false },
  isVerified: { type: DataTypes.BOOLEAN, defaultValue: false },
});
