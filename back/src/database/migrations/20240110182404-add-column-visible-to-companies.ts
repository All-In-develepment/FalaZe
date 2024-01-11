import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
  up: (queryInterface: QueryInterface) => {
    return Promise.all([
      queryInterface.addColumn("Plans", "isVisible", {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
      })
    ]);
  },

  down: (queryInterface: QueryInterface) => {
    return Promise.all([queryInterface.removeColumn("Plans", "isVisible")]);
  }
};
