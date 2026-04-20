import { UserModel } from "../../database/models/User.model.js";
import { requestContact } from "../keyboards/keyboards.js";

export async function authMiddleware(ctx, next) {
  const telegramId = ctx.from?.id;
  const user = await UserModel.findOne({ where: { user_id: telegramId } });
  if (!user || !user.isVerified) {
    return await ctx.reply("Botdan foydalanish uchun avval ro'yxatdan o'ting:", {
      reply_markup: requestContact,
    });
  }
  return next();
}
