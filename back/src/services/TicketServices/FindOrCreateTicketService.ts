import { subHours } from "date-fns";
import { Op } from "sequelize";
import Contact from "../../models/Contact";
import Ticket from "../../models/Ticket";
import ShowTicketService from "./ShowTicketService";
import FindOrCreateATicketTrakingService from "./FindOrCreateATicketTrakingService";
import Setting from "../../models/Setting";
import Whatsapp from "../../models/Whatsapp";
import Telegram from "../../models/Telegram";

interface TicketData {
  status?: string;
  companyId?: number;
  unreadMessages?: number;
}

interface Request {
  contact: Contact;
  whatsappId?: number;
  telegramId?: number;
  unreadMessages: number;
  companyId: number;
  groupContact?: Contact;
}

const FindOrCreateTicketService = async ({
  contact,
  whatsappId,
  telegramId,
  unreadMessages,
  companyId,
  groupContact
}: Request): Promise<Ticket> => {
  try {
    let ticket = await Ticket.findOne({
      where: {
        status: {
          [Op.or]: ["open", "pending", "closed"]
        },
        contactId: groupContact ? groupContact.id : contact.id,
        companyId
      },
      order: [["id", "DESC"]]
    });

    if (ticket && whatsappId) {
      await ticket.update({ unreadMessages, whatsappId });
    }

    if (ticket && telegramId) {
      await ticket.update({ unreadMessages, telegramId });
    }

    if (ticket?.status === "closed") {
      await ticket.update({ queueId: null, userId: null });
    }

    if (!ticket && groupContact) {
      ticket = await Ticket.findOne({
        where: {
          contactId: groupContact.id
        },
        order: [["updatedAt", "DESC"]]
      });

      if (ticket && whatsappId) {
        await ticket.update({
          status: "pending",
          userId: null,
          unreadMessages,
          queueId: null,
          companyId
        });
        await FindOrCreateATicketTrakingService({
          ticketId: ticket.id,
          companyId,
          whatsappId: ticket.whatsappId,
          userId: ticket.userId
        });
      }

      if (ticket && telegramId) {
        await ticket.update({
          status: "pending",
          userId: null,
          unreadMessages,
          queueId: null,
          companyId
        });
        await FindOrCreateATicketTrakingService({
          ticketId: ticket.id,
          companyId,
          telegramId: ticket.telegramId,
          userId: ticket.userId
        });
      }

      const msgIsGroupBlock = await Setting.findOne({
        where: { key: "timeCreateNewTicket" }
      });

      const value = msgIsGroupBlock
        ? parseInt(msgIsGroupBlock.value, 10)
        : 7200;
    }

    if (!ticket && !groupContact) {
      ticket = await Ticket.findOne({
        where: {
          updatedAt: {
            [Op.between]: [+subHours(new Date(), 2), +new Date()]
          },
          contactId: contact.id
        },
        order: [["updatedAt", "DESC"]]
      });

      if (ticket && whatsappId) {
        await ticket.update({
          status: "pending",
          userId: null,
          unreadMessages,
          queueId: null,
          companyId
        });
        await FindOrCreateATicketTrakingService({
          ticketId: ticket.id,
          companyId,
          whatsappId: ticket.whatsappId,
          userId: ticket.userId
        });
      }

      if (ticket && telegramId) {
        await ticket.update({
          status: "pending",
          userId: null,
          unreadMessages,
          queueId: null,
          companyId
        });
        await FindOrCreateATicketTrakingService({
          ticketId: ticket.id,
          companyId,
          telegramId: ticket.telegramId,
          userId: ticket.userId
        });
      }
    }
    let whatsapp: Whatsapp;
    if (whatsappId)
      whatsapp = await Whatsapp.findOne({
        where: { id: whatsappId }
      });

    let telegram: Telegram;
    if (telegramId)
      telegram = await Telegram.findOne({
        where: { id: telegramId }
      });

    if (!ticket && whatsappId) {
      ticket = await Ticket.create({
        contactId: groupContact ? groupContact.id : contact.id,
        status: "pending",
        isGroup: !!groupContact,
        unreadMessages,
        whatsappId,
        whatsapp,
        companyId
      });
      await FindOrCreateATicketTrakingService({
        ticketId: ticket.id,
        companyId,
        whatsappId,
        userId: ticket.userId
      });
    }

    if (!ticket && telegramId) {
      ticket = await Ticket.create({
        contactId: groupContact ? groupContact.id : contact.id,
        status: "pending",
        isGroup: !!groupContact,
        unreadMessages,
        telegramId,
        telegram,
        companyId
      });
      await FindOrCreateATicketTrakingService({
        ticketId: ticket.id,
        companyId,
        telegramId,
        userId: ticket.userId
      });
    }

    ticket = await ShowTicketService(ticket.id, companyId);

    return ticket;
  } catch (error) {
    console.log(error);
  }
};

export default FindOrCreateTicketService;
