import AppError from "../../errors/AppError";
import { delay } from "../../helpers/EditGroups";
import { GetGroupsAdmin } from "./GetGroupsAdmin";

export interface ISendGroupMessage {
  newMessageGroup: string;
  ticketWhatsappId: number;
}
export const SendGroupMessage = async ({
  newMessageGroup,
  ticketWhatsappId
}: ISendGroupMessage): Promise<void> => {
  try {
    const groupsChat = await GetGroupsAdmin(ticketWhatsappId);
    groupsChat.forEach((groupChat, index) => {
      setTimeout(() => groupChat.sendMessage(newMessageGroup), delay(index));
    });
  } catch (error) {
    throw new AppError("ERR_CHANGING_WAPP_GROUP");
  }
};
