import Message from "../models/Message";
import Ticket from "../models/Ticket";
import Whatsapp from "../models/Whatsapp";

export const FindWhoReceive = async (id: string) => {
  const { ticketId } = await Message.findByPk(id);

  const { whatsappId } = await Ticket.findByPk(ticketId);

  const { session } = await Whatsapp.findByPk(whatsappId);

  const obj = JSON.parse(session);
  const numberId: string = obj.creds.me.id;

  return numberId.split(":", 1)[0];
};
