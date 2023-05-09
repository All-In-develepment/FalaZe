import {
  Table,
  Model,
  PrimaryKey,
  AutoIncrement,
  Column,
  CreatedAt,
  UpdatedAt,
  BelongsToMany,
  AllowNull
} from "sequelize-typescript";
import Ticket from "./Ticket";
import TicketTag from "./TicketTag";

@Table
class Tag extends Model<Tag> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @AllowNull(false)
  @Column
  name: string;

  @AllowNull(false)
  @Column
  color: string;

  @Column
  description: string;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @BelongsToMany(() => Ticket, () => TicketTag)
  tickets: Ticket[];
}

export default Tag;
