import { GroupChat } from "whatsapp-web.js";
import { getWbot } from "../libs/wbot";
import AppError from "../errors/AppError";

export const getChats = async (
  ticketWhatsappId: number
): Promise<GroupChat[]> => {
  const wbot = getWbot(ticketWhatsappId);
  const chats = await wbot.getChats();
  const groupsChat: GroupChat[] = [];
  chats.forEach(chat => {
    if (chat.isGroup) {
      const chatGroup = <GroupChat>chat;
      groupsChat.push(chatGroup);
    }
  });
  if (groupsChat.length === 0) throw new AppError("You have no group yet.");
  return groupsChat;
};

export const delay = (index: number): number =>
  1000 + Math.floor(Math.random() * 4000) * (index + 1);

export const setOnlyAdminInfo = async (
  ticketWhatsappId: number,
  chatId: string
): Promise<void> => {
  try {
    const wbot = getWbot(ticketWhatsappId);
    const chat = await wbot.getChatById(chatId);
    const chatGroup = <GroupChat>chat;

    setTimeout(() => chatGroup.setInfoAdminsOnly(true), delay(0));
  } catch (error) {
    throw new AppError("ERR_CHANGING_WAPP_GROUP");
  }
};
