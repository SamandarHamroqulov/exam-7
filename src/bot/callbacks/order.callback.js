export async function handleOrderStart(ctx) {
  await ctx.deleteMessage().catch(() => {});
  await ctx.reply('Yetkazib berish uchun lokatsiya yuboring:', {
    reply_markup: {
      keyboard: [[{ text: '📍 Lokatsiya yuborish', request_location: true }]],
      resize_keyboard: true,
      one_time_keyboard: true,
    },
  });
}
