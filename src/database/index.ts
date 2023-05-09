import { Sequelize } from "sequelize-typescript";
import User from "../models/User";
import Setting from "../models/Setting";
import Contact from "../models/Contact";
import Ticket from "../models/Ticket";
import Whatsapp from "../models/Whatsapp";
import ContactCustomField from "../models/ContactCustomField";
import Message from "../models/Message";
import Queue from "../models/Queue";
import WhatsappQueue from "../models/WhatsappQueue";
import UserQueue from "../models/UserQueue";
import QuickAnswer from "../models/QuickAnswer";
import Tag from "../models/Tag";
import TicketTag from "../models/TicketTag";

// eslint-disable-next-line
const dbConfig = require("../config/database");

export const models = [
  User,
  Contact,
  Ticket,
  Message,
  Whatsapp,
  ContactCustomField,
  Setting,
  Queue,
  WhatsappQueue,
  UserQueue,
  QuickAnswer,
  Tag,
  TicketTag
];

export class Database {
  sequelize: Sequelize;

  constructor() {
    this.sequelize = new Sequelize(dbConfig);
  }

  async connect(): Promise<void> {
    try {
      await this.sequelize.addModels(models);
      // await this.sequelize.sync({ alter: true, force: true });
      await this.sequelize.authenticate();
      console.log("Connection has been established successfully");
    } catch (error) {
      console.log("Unable to connect to the database", error);
    }
  }
}
