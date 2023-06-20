import Whatsapp from "../models/Whatsapp";
import GetWhatsappWbot from "./GetWhatsappWbot";
import fs from "fs";

import { getMessageOptions } from "../services/WbotServices/SendWhatsAppMedia";
import { verifyMessage } from "../services/WbotServices/wbotMessageListener";
import Contact from "../models/Contact";
import Ticket from "../models/Ticket";
import CreateInfoAPIExternal from "./CreateInfoAPIExternal";

export type MessageData = {
  number: string;
  body: string;
  mediaPath?: string;
  whatsappId?: number;
};

export const SendMessage = async (
  whatsapp: Whatsapp,
  messageData: MessageData
): Promise<any> => {
  try {
    const wbot = await GetWhatsappWbot(whatsapp);
    const chatId = `${messageData.number}@s.whatsapp.net`;

    let message;

    if (messageData.mediaPath) {
      const options = await getMessageOptions(
        messageData.body,
        messageData.mediaPath
      );
      if (options) {
        const body = fs.readFileSync(messageData.mediaPath);
        message = await wbot.sendMessage(chatId, {
          ...options
        });
      }
    } else {
      const body = `\u200e${messageData.body}`;
      message = await wbot.sendMessage(chatId, { text: body });
    }
    const contact = await Contact.findOne({
      where: { number: messageData.number }
    });

    const companyId = 1;
    const { number, whatsappId, body } = messageData;
    await CreateInfoAPIExternal({
      number,
      companyId,
      whatsappId,
      body
    });
    const ticket = await Ticket.findOne({ where: { contactId: contact.id } });

    await verifyMessage(message, ticket, contact);

    return message;
  } catch (err: any) {
    throw new Error(err);
  }
};
