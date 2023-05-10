import {
  AutoIncrement,
  BelongsTo,
  Column,
  CreatedAt,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt
} from "sequelize-typescript";
import Funnel from "./Funnel";
import User from "./User";

@Table
class Stage extends Model<Stage> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column
  name: string;

  @Column
  funnelStage: number;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @ForeignKey(() => User)
  @Column
  createdFromId: number;

  @BelongsTo(() => User)
  createdFrom: User;

  @ForeignKey(() => User)
  @Column
  editedFromId: number;

  @BelongsTo(() => User)
  editedFrom: User;

  @ForeignKey(() => Funnel)
  @Column
  funnelId: number;

  @BelongsTo(() => Funnel)
  funnel: Funnel;
}
export default Stage;
