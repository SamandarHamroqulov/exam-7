import { adminKeyboard } from '../keyboards/keyboards.js';

export async function adminHandler(ctx) {
  try {
    await ctx.reply(`Xush kelibsiz`,{
      reply_markup: adminKeyboard,
    });
  } catch (err) {
    console.error(`adminHandler error: ${err.message}`);
  }
}
