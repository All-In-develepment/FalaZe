import { Api } from "telegram";
import dotenv from "dotenv";

import { loginTelegram } from "./LoginTelegramServices";
import { formatPhoneNumber } from "../../helpers/FormatPhoneNumber";
import CreateInfoAPIExternal from "../../helpers/CreateInfoAPIExternal";
import CreateMessageService, {
  MessageData
} from "../MessageServices/CreateMessageService";
import Ticket from "../../models/Ticket";
import { RandomNumber } from "../../helpers/randomNumber";
import Message from "../../models/Message";

dotenv.config();

interface params {
  numberContact: string;
  message: string;
  id: number;
}
type MessageType = Api.TypeUpdates & { updates: [{ randomId: {} }] };

export const sendMessageTelegram = async ({
  numberContact,
  message,
  id
}: params) => {
  try {
    const client = await loginTelegram(id);

    const formattedNumber = formatPhoneNumber(numberContact);

    const entity = await client.getEntity(formattedNumber);

    const result = (await client.invoke(
      new Api.messages.SendMessage({
        peer: entity,
        message
      })
    )) as any;

    const formattedNumberWithoutNinth = formattedNumber.replace(
      /^\+?(\d{4})9?(\d{8})/,
      "$1$2"
    );

    const contact = await CreateInfoAPIExternal({
      number: formattedNumberWithoutNinth,
      companyId: 1,
      telegramId: id,
      body: message
    });

    const ticket = await Ticket.findOne({ where: { contactId: contact.id } });

    await client.disconnect();

    // let messageId: Message;
    // let randomNumber: string;
    // let isUnique = false;

    // while (!isUnique) {
    //   randomNumber = RandomNumber();
    //   messageId = await Message.findByPk(randomNumber);

    //   if (!messageId) {
    //     isUnique = true;
    //   }
    // }

    const randomNumber = RandomNumber();

    const messageData: MessageData = {
      id: randomNumber,
      fromMe: true,
      ticketId: ticket.id,
      body: message
    };

    await CreateMessageService({
      messageData,
      companyId: 1
    });

    return result;
  } catch (error) {
    console.log({ error });
  }
};
