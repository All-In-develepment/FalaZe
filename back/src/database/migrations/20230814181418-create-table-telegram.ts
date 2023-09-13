import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
  up: (queryInterface: QueryInterface) => {
    return queryInterface.createTable("Telegrams", {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      session: {
        type: DataTypes.TEXT
      },
      qrcode: {
        type: DataTypes.TEXT
      },
      name: {
        type: DataTypes.TEXT
      },
      status: {
        type: DataTypes.STRING
      },
      user: {
        type: DataTypes.JSON
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false
      }
    });
  },

  down: (queryInterface: QueryInterface) => {
    return queryInterface.dropTable("Telegrams");
  }
};
