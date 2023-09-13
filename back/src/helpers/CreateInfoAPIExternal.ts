import Contact from "../models/Contact";
import Ticket from "../models/Ticket";
import CreateContactService from "../services/ContactServices/CreateContactService";
import formatBody from "../helpers/Mustache";
import FindOrCreateTicketService from "../services/TicketServices/FindOrCreateTicketService";

interface Request {
  number: string;
  companyId: number;
  whatsappId?: number;
  telegramId?: number;
  body: string;
}

const CreateInfoAPIExternal = async ({
  number,
  companyId,
  whatsappId,
  body,
  telegramId
}: Request) => {
  let contact = await Contact.findOne({ where: { number, companyId } });

  if (!contact) {
    contact = await CreateContactService({
      name: number,
      number,
      email: "",
      companyId
    });
  }
  const unreadMessages = 0;

  let ticket = await Ticket.findOne({ where: { contactId: contact.id } });

  if (!ticket && whatsappId)
    ticket = await FindOrCreateTicketService({
      contact,
      whatsappId,
      unreadMessages,
      companyId
    });

  if (!ticket && telegramId)
    ticket = await FindOrCreateTicketService({
      contact,
      telegramId,
      unreadMessages,
      companyId
    });

  await ticket.update({ lastMessage: formatBody(body, ticket.contact) });

  return contact;
};
export default CreateInfoAPIExternal;
