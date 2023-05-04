import { Client as Session } from "whatsapp-web.js";
import { getWbot } from "../libs/wbot";
// import GetDefaultWhatsApp from "./GetDefaultWhatsApp";
// import Ticket from "../models/Ticket";

const GetTicketWbot2 = async (ticket: number): Promise<Session> => {
  const wbot = getWbot(ticket);

  return wbot;
};

export default GetTicketWbot2;
