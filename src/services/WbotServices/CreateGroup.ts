import { Contact, CreateGroupResult } from "whatsapp-web.js";
import AppError from "../../errors/AppError";
import { getWbot } from "../../libs/wbot";
import { setOnlyAdminInfo } from "../../helpers/EditGroups";

export interface ICreateGroup {
  title: string;
  contacts: Contact[];
  ticketWhatsappId: number;
}

// example
// gid: {
//   server: 'g.us',
//   user: '120363146050992004',
//   _serialized: '120363146050992004@g.us'
// }

// [
//   "557592512104",
//   "553192727108",
//   "553192727136",
//   "553192242896",
//   "553192420229",
//   "553192727397"
// ];

export const CreateGroup = async ({
  title,
  contacts,
  ticketWhatsappId
}: ICreateGroup): Promise<CreateGroupResult> => {
  const wbot = getWbot(ticketWhatsappId);

  const contactsFormatted = contacts.map(contact => `55${contact}@c.us`);

  try {
    const createGroup = await wbot.createGroup(title, contactsFormatted);
    // eslint-disable-next-line
    const user: any = createGroup.gid;
    const chatId = `${user.user}@${user.server}`;

    setOnlyAdminInfo(ticketWhatsappId, chatId);
    return createGroup;
  } catch (error) {
    throw new AppError("ERR_CHANGING_WAPP_GROUP");
  }
};
