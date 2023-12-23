import { Sequelize, Op, QueryTypes } from "sequelize";
import AppError from "../../errors/AppError";
import User from "../../models/User";

import { Params } from "./DashbardDataService";
import sequelize from "../../database";
import Ticket from "../../models/Ticket";

interface IAttendants extends User {
  id: number;
  name: string;
  totalTickets: string;
  closedTickets: string;
  openedTickets: string;
  ticketData: IDataTickets[];
}

interface IDataTickets {
  date: string;
  ticketCount: string;
  status: string;
}

export const DashboardAttendantsService = async ({
  days,
  date_from,
  date_to,
  companyId
}: Params) => {
  try {
    const dateFrom = date_from
      ? (new Date(date_from) as unknown as number)
      : undefined;
    const dateTo = date_to
      ? (new Date(date_to) as unknown as number)
      : undefined;

    const conditionUser = days
      ? `"Tickets"."createdAt" >= (NOW() - INTERVAL ':days days')`
      : `"Tickets"."createdAt" >= :dateFrom AND "Tickets"."createdAt" < :dateTo`;

    const conditionAttendants = days
      ? `"createdAt" >= (NOW() - INTERVAL ':days days')`
      : `"createdAt" >= :dateFrom AND "createdAt" < :dateTo`;

    const users = await User.findAll({
      attributes: [
        "id",
        "name",
        [
          Sequelize.literal(
            `(
              SELECT COUNT(*)
              FROM "Tickets"
              WHERE "Tickets"."userId" = "User".id
              AND (${conditionUser})
              AND "Tickets"."companyId" = ${companyId}
            )`
          ),
          "totalTickets"
        ],

        [
          Sequelize.literal(
            `(
              SELECT COUNT(*)
              FROM "Tickets"
              WHERE "Tickets"."userId" = "User".id
              AND "Tickets".status = 'closed'
              AND (${conditionUser})
              AND "Tickets"."companyId" = ${companyId}
            )`
          ),
          "closedTickets"
        ],
        [
          Sequelize.literal(
            `(
              SELECT COUNT(*)
              FROM "Tickets"
              WHERE "Tickets"."userId" = "User".id
              AND "Tickets".status = 'open'
              AND (${conditionUser})
              AND "Tickets"."companyId" = ${companyId}
            )`
          ),
          "openedTickets"
        ]
      ],
      where: { companyId },
      replacements: {
        dateFrom: dateFrom || null,
        dateTo: dateTo || null,
        days: days || null
      },
      raw: true
    });

    const userIds = users.map(user => user.id);

    const attendants = await Promise.all(
      userIds.map(async userId => {
        const result = await Ticket.findAll({
          attributes: [
            [Sequelize.fn("DATE", Sequelize.col("createdAt")), "date"],
            [Sequelize.literal("COUNT(*)"), "ticketCount"],
            "status"
          ],
          where: {
            userId: userId,
            [Op.and]: Sequelize.literal(`${conditionAttendants}`)
          },
          group: [
            Sequelize.fn("DATE", Sequelize.col("createdAt")),
            "userId",
            "status"
          ],
          replacements: {
            dateFrom: dateFrom || null,
            dateTo: dateTo || null,
            days: days || null
          },
          raw: true
        });

        const user = users.find(user => user.id === userId) as IAttendants;

        const dataTicket = result as unknown as IDataTickets[];

        if (user) {
          const organizedResult = dataTicket.reduce((acc, entry) => {
            const date = entry.date;
            const status = entry.status;
            const ticketCount = entry.ticketCount;

            acc[status] = acc[status] || {};

            acc[status][date] = ticketCount;

            return acc;
          }, {});

          user.ticketData = organizedResult as IDataTickets[];
        }

        return user;
      })
    );

    const sortedAttendants = attendants
      .slice()
      .sort((a, b) => a.name.localeCompare(b.name));

    return sortedAttendants;
  } catch (error) {
    throw new AppError(error);
  }
};
