import AppError from "../../errors/AppError";
import { delay } from "../../helpers/GetGroups";
import { getWbot } from "../../libs/wbot";
import { GetGroupsAdmin } from "./GetGroupsAdmin";

export interface ISendGroupMessageNASA {
  newMessageGroup: string;
  ticketWhatsappId: number;
}

export const SendGroupMessageNASA = async ({
  newMessageGroup,
  ticketWhatsappId
}: ISendGroupMessageNASA): Promise<void> => {
  try {
    const groupsChat = await GetGroupsAdmin(ticketWhatsappId);
    const wbot = getWbot(ticketWhatsappId);
    const admin = `${wbot.info.wid.user}@c.us`;

    const users: string[] = [];

    groupsChat.map(groupChat =>
      groupChat.participants.map(participant =>
        users.push(`${participant.id.user}@c.us`)
      )
    );
    const usersUnique = users.filter(
      (value, index, array) => array.indexOf(value) === index && value !== admin
    );

    usersUnique.forEach((userUnique, index) =>
      setTimeout(
        () => wbot.sendMessage(userUnique, newMessageGroup),
        delay(index)
      )
    );
  } catch (error) {
    throw new AppError("ERR_CHANGING_WAPP_GROUP");
  }
};
