import { GroupChat } from "whatsapp-web.js";
import { editGroups } from "../../helpers/EditGroups";
import { getWbot } from "../../libs/wbot";

export const GetGroupsAdmin = async (
  ticketWhatsappId: number
): Promise<GroupChat[]> => {
  const wbot = getWbot(ticketWhatsappId);
  const userNumber = wbot.info.wid.user;

  const groupsChat = await editGroups(ticketWhatsappId);

  const owner = groupsChat.filter(groupChat =>
    groupChat.participants.some(
      admin => admin.isAdmin && admin.id.user === userNumber
    )
  );

  return owner;
};

// [
//   {
//     id: {
//       server: 'c.us',
//       user: '553192786493',
//       _serialized: '553192786493@c.us'
//     },
//     isAdmin: true,
//     isSuperAdmin: true
//   },
//   {
//     id: {
//       server: 'c.us',
//       user: '557592512104',
//       _serialized: '557592512104@c.us'
//     },
//     isAdmin: false,
//     isSuperAdmin: false
//   }
// ]
