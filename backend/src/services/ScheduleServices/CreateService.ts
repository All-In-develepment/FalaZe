import * as Yup from "yup";

import AppError from "../../errors/AppError";
import Schedule from "../../models/Schedule";
import { addNewInterval } from "../../helpers/addNewInterval";
import TicketTag from "../../models/TicketTag";
import Ticket from "../../models/Ticket";

interface Request {
  body: string;
  sendAt: string;
  contactId: number | string;
  tagId: number | string;
  companyId: number | string;
  userId?: number | string;
  recurrence: {
    number?: number | string;
    type?: string;
    intervalValue?: number;
  };
}

const CreateService = async ({
  body,
  sendAt,
  contactId,
  tagId,
  companyId,
  userId,
  recurrence
}: Request): Promise<Schedule[]> => {
  const schema = Yup.object().shape({
    body: Yup.string().required().min(5),
    sendAt: Yup.string().required()
  });

  await schema.validate({ body, sendAt });
  try {
    let ticketTags = [];

    if (tagId) {
      ticketTags = await TicketTag.findAll({
        where: { tagId },
        include: [
          {
            model: Ticket,
            as: "ticket",
            attributes: ["contactId"]
          }
        ],
        raw: true,
        nest: true
      });
    }

    const contactIds = ticketTags.map(ticketTag => ticketTag.ticket.contactId);

    if (contactIds.length === 0) {
      contactIds.push(Number(contactId));
    }

    if (!contactId && ticketTags.length === 0) {
      throw new Error("Contato não encontrado!");
    }

    const schedules: Schedule[] = [];

    const createSchedulesForContactIds = async (newSendAt: string) => {
      const schedulePromises = contactIds.map(async id => {
        const schedule = await Schedule.create({
          body,
          sendAt: newSendAt,
          contactId: id,
          companyId,
          userId,
          status: "PENDENTE"
        });
        await schedule.reload();
        return schedule;
      });
      return Promise.all(schedulePromises);
    };

    if (recurrence?.number) {
      for (let index = 0; index < Number(recurrence.number); index++) {
        const newSendAt = addNewInterval(
          sendAt,
          recurrence.type,
          index,
          recurrence.intervalValue
        );
        const newSchedules = await createSchedulesForContactIds(newSendAt);
        schedules.push(...newSchedules);
      }
    } else {
      const newSchedules = await createSchedulesForContactIds(sendAt);
      schedules.push(...newSchedules);
    }

    return schedules;
  } catch (err: any) {
    throw new AppError(err.message);
  }
};

export default CreateService;
