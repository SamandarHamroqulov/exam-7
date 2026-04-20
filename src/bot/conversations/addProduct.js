import { InlineKeyboard } from "grammy";
import { CategoryModel } from "../../database/models/Category.model.js";
import { ProductModel } from "../../database/models/Product.model.js";
import { promises as fs } from "fs";
import fsSync from "fs"; 
import path from "path";
import https from "https"; 

export async function addProductConversation(conversation, ctx) {
  const categories = await conversation.external(() =>
    CategoryModel.findAll({ raw: true })
  );

  if (categories.length === 0) {
    return await ctx.reply("Avval kategoriya qo'shing.");
  }

  const catKeyboard = new InlineKeyboard();
  categories.forEach((cat) =>
    catKeyboard.text(cat.name, `cat_${cat.id}`).row()
  );

  await ctx.reply("Kategoriyani tanlang:", {
    reply_markup: catKeyboard,
  });

  const catCtx = await conversation.waitForCallbackQuery(/^cat_/);
  const categoryId = catCtx.callbackQuery.data.split("_")[1];
  await catCtx.answerCallbackQuery();

  const selectedCategory = categories.find((c) => c.id == categoryId);
  await catCtx.editMessageText(`✅ Kategoriya: ${selectedCategory?.name}`);

  await ctx.reply("Mahsulot nomini yozing:");
  const nameCtx = await conversation.wait();
  const name = nameCtx.message?.text;

  if (!name) {
    return await ctx.reply("❌ Nom kiritilmadi. Bekor qilindi.");
  }

  await ctx.reply("Narxini yozing (masalan: 15000):");
  const priceCtx = await conversation.wait();
  const price = parseFloat(priceCtx.message?.text);

  if (isNaN(price) || price <= 0) {
    return await ctx.reply("❌ Narx noto'g'ri. Bekor qilindi.");
  }

  await ctx.reply("Mahsulot rasmini yuboring:");
  const photoCtx = await conversation.wait();
  const photo = photoCtx.message?.photo;

  if (!photo) {
    return await ctx.reply("❌ Rasm yuborilmadi. Bekor qilindi.");
  }

  const fileId = photo[photo.length - 1].file_id;

  const file = await conversation.external(() => ctx.api.getFile(fileId));
  
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  await conversation.external(() => fs.mkdir(uploadDir, { recursive: true }));

  const fileName = `product-${Date.now()}.jpg`;
  const uploadPath = path.join(uploadDir, fileName);

 const downloadFile = (filePath, savePath) => {
  return new Promise((resolve, reject) => {
    const url = `https://api.telegram.org/file/bot${process.env.BOT_TOKEN}/${filePath}`;
    
    const request = https.get(url, { timeout: 30000 }, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Server xatosi: ${response.statusCode}`));
        return;
      }

      const fileStream = fsSync.createWriteStream(savePath);
      response.pipe(fileStream);

      fileStream.on("finish", () => {
        fileStream.close();
        resolve();
      });

      fileStream.on("error", (err) => {
        fsSync.unlink(savePath, () => reject(err));
      });
    });

    request.on("error", (err) => {
      reject(err);
    });

    request.on("timeout", () => {
      request.destroy();
      reject(new Error("Telegram serveri bilan ulanish vaqti tugadi (Timeout)"));
    });
  });
};
  try {
    await conversation.external(() => downloadFile(file.file_path, uploadPath));
  } catch (e) {
    console.error("Yuklashda xatolik:", e);
    return await ctx.reply("❌ Rasmni yuklab bo‘lmadi.");
  }

  await conversation.external(() =>
    ProductModel.create({
      name,
      price,
      image: `uploads/${fileName}`,
      category_id: categoryId,
    })
  );

  await ctx.reply(
    `✅ Mahsulot qo'shildi!\n\n📦 ${name}\n💰 ${price} so'm\n🗂 Kategoriya: ${selectedCategory?.name}`
  );
}