import 'dotenv/config';
import { Bot, session } from 'grammy';
import { dbConnection } from './database/config.js';
import composer from './bot/handlers/index.js';
import { conversations, createConversation } from '@grammyjs/conversations';
import { addProductConversation } from './bot/conversations/addProduct.js';

const token = process.env.BOT_TOKEN;
if (!token) throw new Error('BOT_TOKEN topilmadi!');

export const bot = new Bot(token);

bot.use(session({ initial: () => ({}) }));
bot.use(conversations());
bot.use(createConversation(addProductConversation, 'addProduct'));
bot.use(composer);
bot.catch((err) => {
  console.error('Bot xatosi:', err.message);
});

await dbConnection();


await bot.api.setMyCommands([
  { command: 'start', description: 'Botni ishga tushirish' },
  { command: 'admin', description: '⚙️ Admin panel' },
]);
bot.start();
