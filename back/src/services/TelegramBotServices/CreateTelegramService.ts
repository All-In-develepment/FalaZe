import { Telegraf, Telegram } from "telegraf";
import { message } from "telegraf/filters";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

// apiUrl = https://api.telegram.org/bot<bot_token>
// apiFileUrl = https://api.telegram.org/file/bot<bot_token>

const TelegramService = async () => {
  const apiUrl = `https://api.telegram.org/bot${process.env.BOT_TOKEN}`;
  const apiFileUrl = `https://api.telegram.org/file/bot${process.env.BOT_TOKEN}`;

  const bot = new Telegraf(process.env.BOT_TOKEN);
  console.log("bot iniciado");

  bot.start(ctx => {
    const { from, chat } = ctx;
    console.log(from);
    console.log(chat);

    ctx.reply(`Seja bem vindo, ${from.first_name} ${from.last_name}.
     Como posso ajudar?`);
  });

  // const chatId = "545786261";

  // const telegram = new Telegram(process.env.BOT_TOKEN);

  // telegram.sendMessage(chatId, "Mensagemzaaaaaada");

  // const sendMessageEndPoint = (msg: string) => {
  //   axios
  //     .get(`${apiUrl}/sendMessage?chat_id=${chatId}&text=${encodeURI(msg)}`)
  //     .catch(e => console.log("algo de errado nao esta certo"));
  // };
  // setInterval(() => sendMessageEndPoint("isso é uma mensagem"), 500);

  // const url = `https://api.telegram.org/bot${process.env.BOT_TOKEN}/getUpdates`;

  // const result = (await axios.get(url))?.data;

  // const chatId: number = result.result[0].message.chat.id;

  // console.log({ chatId });

  // bot.telegram.sendMessage(chatId, "ola, como vai, telegramzadaaa");

  bot.launch();

  // bot.start(ctx => ctx.reply("Welcome"));
  // bot.help(ctx => ctx.reply("Send me a sticker"));
  // bot.on(message("sticker"), ctx => ctx.reply("👍"));
  // bot.hears("hi", ctx => ctx.reply("ola"));
  // bot.launch();

  // // Enable graceful stop
  // process.once("SIGINT", () => bot.stop("SIGINT"));
  // process.once("SIGTERM", () => bot.stop("SIGTERM"));
};

TelegramService();

/*
NOTAS:

capturar o chatId quando start a conversa com o bot e salvar no banco de dados (criar tabela ou coluna para o chatId)

criar um endpoint para receber a mensagem e entao essa mensagem ser enviada para o usuário através do bot

npx ts-node-dev --respawn --transpile-only --ignore node_modules src/services/TelegramServices/CreateTelegramService.ts
*/
