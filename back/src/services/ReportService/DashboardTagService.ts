import AppError from "../../errors/AppError";
import Contact from "../../models/Contact";
import Tag from "../../models/Tag";
import TicketTag from "../../models/TicketTag";

export const DashBoardTagService = async (tagName: string) => {
  console.log({ tagName });
  console.log("oi moanoite");

  try {
    if (tagName) {
      const { id } = await Tag.findOne({ where: { name: tagName } });
      const ticketTag = await TicketTag.findAll({
        where: { tagId: id }
      });
      const nameTicket = await Promise.all(
        ticketTag.map(async tag => {
          const contact = await Contact.findOne({
            where: { id: tag.ticketId }
          });
          return contact.name;
        })
      );
      return nameTicket;
    }
    const ticketsTag = await TicketTag.findAll({ attributes: ["tagId"] });

    const ticketTagIds = ticketsTag.map(tag => tag.tagId);
    const tagsId = await Tag.findAll({ where: { id: ticketTagIds } });
    const name = tagsId.map(tag => tag.name);

    return name;
  } catch (error) {
    throw new AppError("TAGNAME_NOT_FOUND");
  }
};
