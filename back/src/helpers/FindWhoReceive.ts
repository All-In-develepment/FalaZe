import AppError from "../errors/AppError";
import Message from "../models/Message";
import Ticket from "../models/Ticket";
import Whatsapp from "../models/Whatsapp";

export const FindWhoReceive = async (id: string) => {
  try {
    const { ticketId } = await Message.findByPk(id);

    const { whatsappId } = await Ticket.findByPk(ticketId);

    const { session, webHook, token } = await Whatsapp.findByPk(whatsappId);

    const obj = JSON.parse(session);
    const numberId: string = obj.creds.me.id;

    const number = numberId.split(":", 1)[0];

    return {
      number,
      token,
      webHook
    };
  } catch (error) {
    throw new AppError("MESSAGE_NOT_FOUND");
  }
};
