import { Op } from "sequelize";
import Tag from "../../models/Tag";
import TicketTag from "../../models/TicketTag";
import { Params } from "./DashbardDataService";
import AppError from "../../errors/AppError";

export const ReportService = async ({
  date_from,
  date_to,
  tagName
}: Params) => {
  try {
    const dateFrom = new Date(date_from) as unknown as number;
    const dateTo = (new Date(date_to).getTime() +
      24 * 60 * 60 * 1000) as unknown as number;

    console.log({ dateFrom, dateTo });

    if (tagName.toLowerCase() === "todos" && date_from) {
      console.log("toca");

      const count = await TicketTag.count({
        where: {
          createdAt: {
            [Op.gte]: dateFrom,
            [Op.lt]: dateTo
          }
        }
      });

      console.log({ count });

      return count;
    } else if (tagName.toLowerCase() === "todos") {
      const count = await TicketTag.count();

      return count;
    }

    const { id } = await Tag.findOne({ where: { name: tagName } });

    const count = await TicketTag.count({
      where: {
        createdAt: {
          [Op.between]: [dateFrom, dateTo]
        },
        tagId: id
      }
    });

    return count;
  } catch (error) {
    throw new AppError("TAGNAME_NOT_FOUND");
  }
};
