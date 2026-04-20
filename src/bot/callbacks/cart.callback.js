import { InlineKeyboard } from 'grammy';
import { Op } from 'sequelize';
import { CartModel } from '../../database/models/Cart.model.js';
import { ProductModel } from '../../database/models/Product.model.js';
import { CategoryModel } from '../../database/models/Category.model.js';
import { createCategoryKeyboard } from '../keyboards/keyboards.js';

export async function handleAddToCart(ctx, productId, userId) {
  const quantity = parseInt(
    ctx.callbackQuery.message.reply_markup.inline_keyboard[0][1].text,
  );

  const [cartItem, created] = await CartModel.findOrCreate({
    where: { user_id: userId, product_id: productId },
    defaults: { quantity },
  });
  if (!created) {
    cartItem.quantity += quantity;
    await cartItem.save();
  }

  await ctx.answerCallbackQuery({ text: "✅ Savatga qo'shildi!" });

  const drinkCategory = await CategoryModel.findOne({
    where: { name: { [Op.iLike]: '%ichimlik%' } },
  });

  const userCart = await CartModel.findAll({ where: { user_id: userId } });
  const hasDrink = drinkCategory
    ? await ProductModel.findOne({
        where: {
          id: userCart.map((i) => i.product_id),
          category_id: drinkCategory.id,
        },
      })
    : true;

  if (!hasDrink && drinkCategory) {
    await ctx.reply("🥤 Ichimlik ham qo'shasizmi?", {
      reply_markup: new InlineKeyboard()
        .text('🥤 Ichimliklar', `category_${drinkCategory.id}`)
        .text('🛒 Savat', 'view_cart'),
    });
  } else {
    await ctx.reply("Savatga qo'shildi. Yana nima buyurasiz?", {
      reply_markup: new InlineKeyboard()
        .text('🍱 Menyu', 'back_to_categories')
        .text('🛒 Savat', 'view_cart'),
    });
  }
}

export async function handleViewCart(ctx, userId) {
  const cartItems = await CartModel.findAll({
    where: { user_id: userId },
    include: [{ model: ProductModel, as: 'product' }],
  });

  if (cartItems.length === 0) {
    return await ctx.answerCallbackQuery("Savat bo'sh");
  }

  let text = '🛒 *Sizning savatingiz:*\n\n';
  let total = 0;
  cartItems.forEach((item, i) => {
    const sum = item.product.price * item.quantity;
    total += sum;
    text += `${i + 1}. ${item.product.name} (${item.quantity}x) = ${sum}\n`;
  });
  text += `\n*Jami: ${total} so'm*`;

  const kb = new InlineKeyboard()
    .text('🗑 Tozalash', 'clear_cart')
    .text('🚖 Buyurtma', 'order_start')
    .row()
    .text('🍱 Menyu', 'back_to_categories');

  if (ctx.callbackQuery.message.photo) {
    await ctx.deleteMessage().catch(() => {});
    await ctx.reply(text, { reply_markup: kb, parse_mode: 'Markdown' });
  } else {
    await ctx.editMessageText(text, { reply_markup: kb, parse_mode: 'Markdown' });
  }
}

export async function handleClearCart(ctx, userId) {
  await CartModel.destroy({ where: { user_id: userId } });
  const categories = await CategoryModel.findAll();
  await ctx.editMessageText("Savat bo'shatildi. Kategoriya tanlang:", {
    reply_markup: createCategoryKeyboard(categories),
  });
}
