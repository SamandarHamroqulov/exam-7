import { OrderModel } from '../../database/models/Order.Model.js';

export async function ordersHandler(ctx) {
  const orders = await OrderModel.findAll({
    where: { user_id: ctx.from.id },
    order: [['createdAt', 'DESC']],
    limit: 5,
  });

  if (orders.length === 0) {
    return await ctx.reply("Sizda hali buyurtmalar yo'q.");
  }

  let text = '🧾 *Sizning oxirgi buyurtmalaringiz:*\n\n';
  orders.forEach((order) => {
    text += `🆔 #${order.id} | 💰 ${order.total_price} so'm | 📌 ${order.status}\n`;
  });

  await ctx.reply(text, { parse_mode: 'Markdown' });
}
