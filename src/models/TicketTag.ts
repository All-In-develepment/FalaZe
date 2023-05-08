import { Table, Model, ForeignKey, Column } from "sequelize-typescript";
import Ticket from "./Ticket";
import Tag from "./Tag";

@Table
class TicketTag extends Model {
  @ForeignKey(() => Ticket)
  @Column
  ticketId: number;

  @ForeignKey(() => Tag)
  @Column
  tagId: number;
}

export default TicketTag;
