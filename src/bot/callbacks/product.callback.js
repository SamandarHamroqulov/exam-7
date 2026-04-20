import { InlineKeyboard, InputFile } from 'grammy';
import path from 'path';
import { ProductModel } from '../../database/models/Product.model.js';
import { CategoryModel } from '../../database/models/Category.model.js';
import {
  createCategoryKeyboard,
  createProductsKeyboard,
} from '../keyboards/keyboards.js';

export async function handleCategoryCallback(ctx, categoryId) {
  const products = await ProductModel.findAll({
    where: { category_id: categoryId },
  });
  const text =
    products.length === 0
      ? "Bu bo'limda mahsulotlar yo'q."
      : 'Mahsulotni tanlang:';

  if (ctx.callbackQuery.message.photo) {
    await ctx.deleteMessage().catch(() => {});
    await ctx.reply(text, { reply_markup: createProductsKeyboard(products) });
  } else {
    await ctx.editMessageText(text, {
      reply_markup: createProductsKeyboard(products),
    });
  }
}

export async function handleProductCallback(ctx, productId) {
  const product = await ProductModel.findByPk(productId);
  if (!product) return await ctx.answerCallbackQuery('Mahsulot topilmadi');

  const caption = `<b>${product.name}</b>\n\n💰 Narxi: ${product.price} so'm\n\nYoqimli ishtaha!`;
  const keyboard = new InlineKeyboard()
    .text('➖', `minus_${product.id}`)
    .text('1', 'count')
    .text('➕', `plus_${product.id}`)
    .row()
    .text("🛒 Savatga qo'shish", `add_to_cart_${product.id}`)
    .row()
    .text('⬅️ Orqaga', `category_${product.category_id}`);

  await ctx.deleteMessage().catch(() => {});

  if (product.image) {
    await ctx.replyWithPhoto(
      new InputFile(path.join(process.cwd(), 'public', product.image)),
      { caption, parse_mode: 'HTML', reply_markup: keyboard },
    );
  } else {
    await ctx.reply(caption, { parse_mode: 'HTML', reply_markup: keyboard });
  }
}

export async function handleQuantityCallback(ctx, action, productId) {
  const currentQuantity = parseInt(
    ctx.callbackQuery.message.reply_markup.inline_keyboard[0][1].text,
  );
  const newQuantity =
    action === 'plus' ? currentQuantity + 1 : currentQuantity - 1;

  if (newQuantity < 1) {
    return await ctx.answerCallbackQuery('Minimal 1 dona');
  }

  const product = await ProductModel.findByPk(productId);
  const totalPrice = product.price * newQuantity;
  const newCaption =
    `<b>${product.name}</b>\n\n` +
    `💰 Narxi: ${product.price} so'm\n` +
    `🔢 Miqdor: ${newQuantity}\n` +
    `──────────────\n` +
    `💵 Jami: ${totalPrice} so'm`;

  const newKeyboard = new InlineKeyboard()
    .text('➖', `minus_${product.id}`)
    .text(`${newQuantity}`, 'count')
    .text('➕', `plus_${product.id}`)
    .row()
    .text("🛒 Savatga qo'shish", `add_to_cart_${product.id}`)
    .row()
    .text('⬅️ Orqaga', `category_${product.category_id}`);

  if (ctx.callbackQuery.message.photo) {
    await ctx.editMessageCaption({
      caption: newCaption,
      parse_mode: 'HTML',
      reply_markup: newKeyboard,
    });
  } else {
    await ctx.editMessageText(newCaption, {
      parse_mode: 'HTML',
      reply_markup: newKeyboard,
    });
  }
}

export async function handleBackToCategories(ctx) {
  const categories = await CategoryModel.findAll();
  const kb = createCategoryKeyboard(categories);

  if (ctx.callbackQuery.message.photo) {
    await ctx.deleteMessage().catch(() => {});
    await ctx.reply('Kategoriya:', { reply_markup: kb });
  } else {
    await ctx.editMessageText('Kategoriya:', { reply_markup: kb });
  }
}
