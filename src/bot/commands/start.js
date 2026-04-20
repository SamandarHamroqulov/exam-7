import { UserModel } from "../../database/models/User.model.js";
import { menuKeyboard, requestContact } from "../keyboards/keyboards.js";

export async function startHandler(ctx) {
  try {
    const telegramId = ctx.from.id;
    const existingUser = await UserModel.findOne({ where: { user_id: telegramId } });
    if (existingUser) {
      return await ctx.reply("Xush kelibsiz! Quyidagi menyudan foydalanishingiz mumkin:", {
        reply_markup: menuKeyboard,
      });
    }
    await ctx.reply(
      `Salom, ${ctx.from.first_name}! Botdan foydalanish uchun ro'yxatdan o'ting:`,
      { reply_markup: requestContact }
    );
  } catch (err) {
    console.error("startHandler xatosi:", err);
    await ctx.reply("Kechirasiz, tizimda xatolik yuz berdi.");
  }
}
