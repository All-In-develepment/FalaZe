// import Database from "../../database";

import { Database } from "../../database";

const database = new Database();
const truncate = async (): Promise<void> => {
  await database.sequelize.truncate({ force: true, cascade: true });
};

const disconnect = async (): Promise<void> => {
  return database.sequelize.connectionManager.close();
};

export { truncate, disconnect };
