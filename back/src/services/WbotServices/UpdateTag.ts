import AppError from "../../errors/AppError";
import Tag from "../../models/Tag";
import { Tags } from "./CreateTag";

export const UpdateTag = async ({
  ticket,
  name,
  color,
  description
}: Tags): Promise<Tag> => {
  try {
    const { tagId } = ticket;
    const oneTag = await Tag.findByPk(tagId);

    if (!oneTag) throw new AppError("ERR_NO_TAG_FOUND", 404);
    const tagUpdated = await oneTag.update({ name, color, description });

    return tagUpdated;
  } catch (error) {
    throw new AppError("ERR_CHANGING_WAPP_GROUP");
  }
};
