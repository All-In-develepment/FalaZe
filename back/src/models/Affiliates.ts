import {
  Table,
  Column,
  CreatedAt,
  UpdatedAt,
  Model,
  PrimaryKey,
  AutoIncrement,
  DataType,
  BelongsTo,
  ForeignKey,
  HasMany
} from "sequelize-typescript";
import Company from "./Company";
import { DataTypes } from "sequelize";

@Table
class Affiliates extends Model<Affiliates> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column
  asaasId: string;

  @Column
  name: string;

  @Column(DataType.TEXT)
  email: string;

  @Column
  phone: string;

  @Column
  address: string;

  @Column
  addressNumber: string;

  @Column
  complement: string;

  @Column
  province: string;

  @Column
  postalCode: string;

  @Column
  cpfCnpj: string;

  @Column
  apiKey: string;

  @Column
  walletId: string;

  @Column({
    type: DataTypes.ENUM("MEI", "LIMITED", "INDIVIDUAL", "ASSOCIATION")
  })
  companyType: string;

  @Column({ type: DataTypes.ENUM("FISICA", "JURIDICA") })
  personType: string;

  @Column
  birthDate: string;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @Column
  data: string;

  @HasMany(() => Company)
  companies: Company[];
}

export default Affiliates;
