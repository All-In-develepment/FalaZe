import { Telegraf } from "telegraf";
import { message } from "telegraf/filters";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

export const TelegramService = async () => {
  const bot = new Telegraf(process.env.BOT_TOKEN);

  const url = `https://api.telegram.org/bot${process.env.BOT_TOKEN}/getUpdates`;

  const result = (await axios.get(url))?.data;

  const chatId: number = result.result[0].message.chat.id;

  console.log({ chatId });

  bot.telegram.sendMessage(chatId, "ola, como vai, telegramzadaaa");

  // bot.start(ctx => ctx.reply("Welcome"));
  // bot.help(ctx => ctx.reply("Send me a sticker"));
  // bot.on(message("sticker"), ctx => ctx.reply("👍"));
  // bot.hears("hi", ctx => ctx.reply("ola"));
  // bot.launch();

  // // Enable graceful stop
  // process.once("SIGINT", () => bot.stop("SIGINT"));
  // process.once("SIGTERM", () => bot.stop("SIGTERM"));
};
