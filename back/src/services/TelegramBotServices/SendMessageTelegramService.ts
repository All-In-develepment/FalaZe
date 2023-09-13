import { Telegram } from "telegraf";

export const SendMessageTelegramService = (msg: string) => {
  const chatId = "545786261";
  const telegram = new Telegram(process.env.BOT_TOKEN);

  telegram.sendMessage(chatId, msg);
};
