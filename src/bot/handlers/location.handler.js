import { CartModel } from '../../database/models/Cart.model.js';
import { ProductModel } from '../../database/models/Product.model.js';
import { OrderModel, OrderItemModel } from '../../database/models/Order.Model.js';
import { menuKeyboard } from '../keyboards/keyboards.js';

export async function locationHandler(ctx) {
  const userId = ctx.from.id;

  const cartItems = await CartModel.findAll({
    where: { user_id: userId },
    include: [{ model: ProductModel}],
  });

  if (cartItems.length === 0) {
    return ctx.reply("Savat bo'sh.");
  }

  const total = cartItems.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0,
  );

  const order = await OrderModel.create({
    user_id: userId,
    total_price: total,
    latitude: ctx.message.location.latitude,
    longitude: ctx.message.location.longitude,
  });

  for (const item of cartItems) {
    await OrderItemModel.create({
      order_id: order.id,
      product_name: item.product.name,
      quantity: item.quantity,
      price: item.product.price,
    });
  }

  await CartModel.destroy({ where: { user_id: userId } });
  await ctx.reply(`✅ Buyurtma qabul qilindi! ID: #${order.id}`, {
    reply_markup: menuKeyboard,
  });
}
