import { adminKeyboard } from '../keyboards/keyboards.js';

export async function adminMiddleware(ctx, next) {
  try {
    const telegramId = ctx.from?.id;

    if (telegramId !== Number(process.env.ADMIN_ID)) {
      return await ctx.reply("Sizda admin huquqi yo'q.");
    }



    return next();
  } catch (err) {
    console.error(err.message);
  }
}