import {
  Table,
  Model,
  PrimaryKey,
  AutoIncrement,
  Column,
  CreatedAt,
  UpdatedAt,
  BelongsTo,
  ForeignKey,
  HasMany
} from "sequelize-typescript";
import User from "./User";
import Stage from "./Stage";

@Table
class Funnel extends Model<Funnel> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column
  name: string;

  @Column
  description: string;

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

  @HasMany(() => Stage)
  stage: Stage[];
}

export default Funnel;
