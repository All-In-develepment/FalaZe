import AppError from "../../errors/AppError";
import Tag from "../../models/Tag";

export const GetAllTag = async (): Promise<Tag[]> => {
  try {
    const findAll = await Tag.findAll();
    if (!findAll) throw new AppError("ERR_NO_TAG_FOUND", 404);

    const tagData: Tag[] = findAll.map(item => item.toJSON() as Tag);

    return tagData;
  } catch (error) {
    throw new AppError("ERR_CHANGING_WAPP_GROUP");
  }
};
