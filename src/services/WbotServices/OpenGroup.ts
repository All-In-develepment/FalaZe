import AppError from "../../errors/AppError";
import { delay } from "../../helpers/EditGroups";
import { GetGroupsAdmin } from "./GetGroupsAdmin";

export const OpenGroup = async (ticketWhatsappId: number): Promise<void> => {
  try {
    const groupsChat = await GetGroupsAdmin(ticketWhatsappId);
    groupsChat.forEach((groupChat, index) => {
      setTimeout(() => groupChat.setMessagesAdminsOnly(false), delay(index));
    });
  } catch (error) {
    throw new AppError("ERR_CHANGING_WAPP_GROUP");
  }
};
