import AppError from "../../errors/AppError";
import { delay } from "../../helpers/EditGroups";
import { GetGroupsAdmin } from "./GetGroupsAdmin";

export const CloseGroup = async (ticketWhatsappId: number): Promise<void> => {
  try {
    const groupsChat = await GetGroupsAdmin(ticketWhatsappId);
    groupsChat.forEach((groupChat, index) => {
      setTimeout(() => groupChat.setMessagesAdminsOnly(true), delay(index));
    });
  } catch (error) {
    throw new AppError("ERR_CHANGING_WAPP_GROUP");
  }
};
