import AppError from "../../errors/AppError";
import Tag from "../../models/Tag";
import Ticket from "../../models/Ticket";

export const RemoveTag = async (ticket: Ticket): Promise<void> => {
  try {
    const { tagId } = ticket;
    const findOne = await Tag.findOne({
      where: {
        id: tagId
      }
    });
    if (!findOne) throw new AppError("ERR_NO_TAG_FOUND", 404);
    const removeTag = await findOne.destroy();
    return removeTag;
  } catch (error) {
    throw new AppError("ERR_CHANGING_WAPP_GROUP");
  }
};
