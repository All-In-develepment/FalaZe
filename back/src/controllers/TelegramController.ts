import { message } from "telegraf/filters";
import { Request, Response } from "express";
import { createTelegram } from "../services/TelegramServices/CreateTelegramService";
import { testFunc } from "../services/TelegramServices/test";
import { sendMessageTelegram } from "../services/TelegramServices/SendMessageTelegramService";

export const loginTelegram = async (req: Request, res: Response) => {
  console.log("cheguei na controller");

  await createTelegram();
  // const test = await testFunc();
};

export const sendMessage = async (req: Request, res: Response) => {
  const { numberContact, message } = req.body;

  console.log(numberContact, message);

  const senderMessage = await sendMessageTelegram({
    numberContact,
    message,
    id: 2
  });

  return res.status(200).json(senderMessage);
};
