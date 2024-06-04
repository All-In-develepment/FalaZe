import { QueryInterface, DataTypes } from "sequelize";
//
module.exports = {
  up: (queryInterface: QueryInterface) => {
    return queryInterface.changeColumn("Whatsapps", "transferQueueId", {
      type: DataTypes.INTEGER,
      references: { model: "Queues", key: "id" },
      allowNull: true,
      onUpdate: "CASCADE",
      onDelete: "SET NULL"
    });
  },

  down: (queryInterface: QueryInterface) => {
    return queryInterface.changeColumn("Whatsapps", "transferQueueId");
  }
};
