import { UserModel } from "../../database/models/User.model.js";
import { menuKeyboard } from "../keyboards/keyboards.js";

export async function contactHandler(ctx) {
  const { phone_number, first_name, user_id: telegramId } = ctx.message.contact;
  try {
    const existingUser = await UserModel.findOne({ where: { user_id: telegramId } });
    if (existingUser) {
      return await ctx.reply("Siz allaqachon ro'yxatdan o'tgansiz!", {
        reply_markup: menuKeyboard,
      });
    }
    await UserModel.create({
      user_id: telegramId,
      phone_number,
      firstname: first_name,
      isVerified: true,
    });
    await ctx.reply("Rahmat, muvaffaqiyatli ro'yxatdan o'tdingiz!", {
      reply_markup: menuKeyboard,
    });
  } catch (error) {
    console.error("contactHandler xatosi:", error);
    await ctx.reply("Ro'yxatdan o'tishda xatolik. Qaytadan urinib ko'ring.");
  }
}
