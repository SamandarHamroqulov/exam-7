import { InlineKeyboard, Keyboard } from "grammy";

export const requestContact = new Keyboard()
  .requestContact("📞 Telefon raqamni yuborish")
  .resized()
  .oneTime();

export const menuKeyboard = new Keyboard()
  .text("🍱 Menyu")
  .row()
  .text("🛍 Buyurtmalarim")
  .row()
  .text("ℹ️ Biz haqimizda")
  .resized();

export const createCategoryKeyboard = (categories) => {
  const keyboard = new InlineKeyboard();
  categories.forEach((cat) => keyboard.text(cat.name, `category_${cat.id}`).row());
  return keyboard;
};

export const createProductsKeyboard = (products) => {
  const keyboard = new InlineKeyboard();
  products.forEach((product) =>
    keyboard.text(`${product.name} — ${product.price} so'm`, `product_${product.id}`).row()
  );
  keyboard.text("⬅️ Ortga", "back_to_categories");
  return keyboard;
};
export const adminKeyboard = new Keyboard()
  .text("➕ Mahsulot qo'shish")
  .row()
  .text("📦 Mahsulotlar ro'yxati")
  .resized();

