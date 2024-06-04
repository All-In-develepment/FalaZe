import {
  Table,
  Column,
  CreatedAt,
  UpdatedAt,
  Model,
  ForeignKey,
  AutoIncrement,
  PrimaryKey
} from "sequelize-typescript";
import Queue from "./Queue";
import Whatsapp from "./Whatsapp";

@Table
class TransferQueue extends Model<TransferQueue> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @ForeignKey(() => Whatsapp)
  @Column
  whatsappId: number;

  @ForeignKey(() => Queue)
  @Column
  queueId: number;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}

export default TransferQueue;
