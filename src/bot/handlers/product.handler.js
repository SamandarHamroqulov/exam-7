import { InlineKeyboard } from 'grammy';
import { ProductModel } from '../../database/models/Product.model.js';

export async function productHandler(ctx) {
  try {
    const products = await ProductModel.findAll();

    let text = '📦 Mahsulotlar:\n\n';

    products.forEach((product, index) => {
      text += `${index + 1}. ${product.name} - ${product.price} so'm\n`;
    });

    await ctx.reply(text);  
  } catch (err) {
    console.log(`Bot error ${err.message}`);
  }
}
