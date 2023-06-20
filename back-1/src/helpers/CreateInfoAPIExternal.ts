import Contact from "../models/Contact";
import Ticket from "../models/Ticket";
import CreateContactService from "../services/ContactServices/CreateContactService";
import formatBody from "../helpers/Mustache";
import FindOrCreateTicketService from "../services/TicketServices/FindOrCreateTicketService";

interface Request {
  number: string;
  companyId: number;
  whatsappId: number;
  body: string;
}

const CreateInfoAPIExternal = async ({
  number,
  companyId,
  whatsappId,
  body
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

  if (!ticket)
    ticket = await FindOrCreateTicketService(
      contact,
      whatsappId,
      unreadMessages,
      companyId
    );

  await ticket.update({ lastMessage: formatBody(body, ticket.contact) });
};
export default CreateInfoAPIExternal;
