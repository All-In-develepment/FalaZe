import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
  up: (queryInterface: QueryInterface) => {
    return Promise.all([
      queryInterface.addColumn("Companies", "cpfCnpj", {
        type: DataTypes.TEXT
      }),
      queryInterface.addColumn("Companies", "postalCode", {
        type: DataTypes.TEXT
      })
    ]);
  },

  down: (queryInterface: QueryInterface) => {
    return Promise.all([
      queryInterface.removeColumn("Companies", "cpfCnpj"),
      queryInterface.removeColumn("Companies", "postalCode")
    ]);
  }
};
