import Message from "../models/Message";
import Ticket from "../models/Ticket";
import Whatsapp from "../models/Whatsapp";

export const FindWhoReceive = async (id: string) => {
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
};
