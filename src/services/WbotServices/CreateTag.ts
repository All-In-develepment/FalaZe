import AppError from "../../errors/AppError";
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
  name,
  color,
  description
}: Tags): Promise<void> => {
  try {
    const { id, tagId } = ticket;
    const oneTicket = await Ticket.findByPk(id);
    const oneTag = await Tag.findByPk(tagId);

    if (!tagId) {
      await oneTicket?.$create("tag", {
        name,
        color,
        description
      });
    }
    await oneTag?.update({ name, color, description });
  } catch (error) {
    throw new AppError("ERR_CHANGING_WAPP_GROUP");
  }
};
