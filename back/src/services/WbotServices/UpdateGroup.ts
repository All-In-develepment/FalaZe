import AppError from "../../errors/AppError";
import { delay } from "../../helpers/GetGroups";
import { GetGroupsAdmin } from "./GetGroupsAdmin";

export interface IUpdateSubject {
  subject: string;
  ticketWhatsappId: number;
}
export interface IUpdateDescription {
  description: string;
  ticketWhatsappId: number;
}

export const UpdateGroupTitle = async ({
  subject,
  ticketWhatsappId
}: IUpdateSubject): Promise<boolean> => {
  try {
    const groupsChat = await GetGroupsAdmin(ticketWhatsappId);

    groupsChat.forEach((groupChat, index) => {
      setTimeout(() => groupChat.setSubject(subject), delay(index));
    });
    return true;
  } catch (error) {
    throw new AppError("ERR_CHANGING_WAPP_GROUP");
  }
};

export const UpdateGroupDescription = async ({
  description,
  ticketWhatsappId
}: IUpdateDescription): Promise<void> => {
  try {
    const groupsChat = await GetGroupsAdmin(ticketWhatsappId);
    return groupsChat.forEach((groupChat, index) => {
      setTimeout(() => groupChat.setDescription(description), delay(index));
    });
  } catch (error) {
    throw new AppError("ERR_CHANGING_WAPP_GROUP");
  }
};
