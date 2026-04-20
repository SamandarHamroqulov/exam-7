import { Sequelize } from "sequelize";

export const sequelize = new Sequelize({
  dialect: "postgres",
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  host: process.env.DB_HOST,
  logging: false,
});

export async function dbConnection() {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
    console.log("Ma'lumotlar bazasi ulandi.");
  } catch (err) {
    console.error("Ma'lumotlar bazasiga ulanib bo'lmadi:", err.message);
    process.exit(1);
  }
}
