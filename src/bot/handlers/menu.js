import { CategoryModel } from "../../database/models/Category.model.js";
import { createCategoryKeyboard } from "../keyboards/keyboards.js";

export async function menuHandler(ctx) {
  try {
    const categories = await CategoryModel.findAll();
    if (categories.length === 0) {
      return await ctx.reply("Hozircha kategoriyalar mavjud emas.");
    }
await ctx.reply(
  "🗂 Sizga kerakli kategoriyani tanlang:",
  {
    reply_markup: createCategoryKeyboard(categories),
  }
);
  } catch (err) {
    console.error("menuHandler xatosi:", err);
    await ctx.reply("Kategoriyalarni yuklashda xatolik.");
  }
}
