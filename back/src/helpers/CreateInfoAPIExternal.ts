import Contact from "../models/Contact";
import Ticket from "../models/Ticket";
import CreateContactService from "../services/ContactServices/CreateContactService";
import CreateTicketService from "../services/TicketServices/CreateTicketService";
import formatBody from "../helpers/Mustache";

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

  let ticket = await Ticket.findOne({ where: { contactId: contact.id } });

  if (!ticket) {
    ticket = await CreateTicketService({
      contactId: contact.id,
      status: "pending",
      userId: whatsappId,
      companyId,
      queueId: null
    });
  }
  await ticket.update({ lastMessage: formatBody(body, ticket.contact) });
};
export default CreateInfoAPIExternal;
