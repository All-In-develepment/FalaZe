import AppError from "../../errors/AppError";
import { getChats } from "../../helpers/GetGroups";
import GetTicketWbot from "../../helpers/GetTicketWbot";
import Tag from "../../models/Tag";
import Ticket from "../../models/Ticket";

export interface Tags {
  ticket: Ticket;
  name: string;
  color: string;
  description: string;
}

export const CreateTag = async ({
  ticket,
  name = "",
  color = "",
  description = ""
}: Tags): Promise<void> => {
  try {
    const wbot = await GetTicketWbot(ticket);
    const chats = await wbot.getChats();
    console.log(wbot);

    const tag = Tag.findByPk();
  } catch (error) {
    throw new AppError("ERR_CHANGING_WAPP_GROUP");
  }
};
