import { Composer } from "grammy";

import { startHandler } from "../commands/start.js";
import { contactHandler } from "./auth.js";
import { menuHandler } from "./menu.js";
import { adminHandler } from "./adminHandler.js";
import { aboutUs } from "./aboutUs.handler.js";
import { productHandler } from "./product.handler.js";
import { ordersHandler } from "./orders.handler.js";
import { locationHandler } from "./location.handler.js";
import { authMiddleware } from "../middlewares/auth.mid.js";
import { adminMiddleware } from "../middlewares/admin.mid.js";
import {
  handleCategoryCallback,
  handleProductCallback,
  handleQuantityCallback,
  handleBackToCategories,
} from "../callbacks/product.callback.js";
import {
  handleAddToCart,
  handleViewCart,
  handleClearCart,
} from "../callbacks/cart.callback.js";
import { handleOrderStart } from "../callbacks/order.callback.js";

const composer = new Composer();

composer.command("start", startHandler);
composer.command("admin", adminMiddleware, adminHandler);

composer.on("message:contact", contactHandler);
composer.hears("🍱 Menyu", authMiddleware, menuHandler);
composer.hears("🛍 Buyurtmalarim", authMiddleware, ordersHandler);
composer.hears("ℹ️ Biz haqimizda", aboutUs);
composer.hears("📦 Mahsulotlar ro'yxati", productHandler);
composer.hears("➕ Mahsulot qo'shish", adminMiddleware, async (ctx) => {
  await ctx.conversation.enter("addProduct");
});

composer.on("message:location", locationHandler);

composer.on("callback_query:data", async (ctx) => {
  const data = ctx.callbackQuery.data;
  const userId = ctx.from.id;

  try {
    if (data.startsWith("category_")) {
      await handleCategoryCallback(ctx, data.split("_")[1]);
    } else if (data.startsWith("product_")) {
      await handleProductCallback(ctx, data.split("_")[1]);
    } else if (data.startsWith("plus_") || data.startsWith("minus_")) {
      const [action, productId] = data.split("_");
      await handleQuantityCallback(ctx, action, productId);
    } else if (data.startsWith("add_to_cart_")) {
      await handleAddToCart(ctx, data.split("_")[3], userId);
      return;
    } else if (data === "view_cart") {
      await handleViewCart(ctx, userId);
    } else if (data === "clear_cart") {
      await handleClearCart(ctx, userId);
    } else if (data === "back_to_categories") {
      await handleBackToCategories(ctx);
    } else if (data === "order_start") {
      await handleOrderStart(ctx);
    }

    await ctx.answerCallbackQuery().catch(() => {});
  } catch (err) {
    console.error("Callback xatosi:", err);
    await ctx.answerCallbackQuery().catch(() => {});
  }
});

composer.on("message:text", async (ctx) => {
  await ctx.reply(`Bunday buyruq mavjud emas: ${ctx.message.text}`);
});

export default composer;
