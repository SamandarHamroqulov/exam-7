export async function aboutUs(ctx) {
  try {
    return await ctx.reply(
`🏢 Biz haqimizda

Biz sizga eng sifatli va mazali taomlarni tez va qulay tarzda yetkazib berishni maqsad qilgan zamonaviy xizmatmiz.

🍱 Har kuni yangi va mazali taomlar
🚀 Tezkor yetkazib berish
💰 Hamyonbop narxlar
⭐ Mijozlar ishonchi — biz uchun eng muhim

Biz bilan buyurtma berish — bu vaqtni tejash va sifatni tanlash degani!

📞 Aloqa: @samandardev1`
    );
  } catch (err) {
    console.log(`Bot error: ${err.message}`);
  }
}