import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
  up: (queryInterface: QueryInterface) => {
    return queryInterface.createTable("Affiliates", {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      asaasId: {
        type: DataTypes.STRING
      },
      name: {
        type: DataTypes.STRING
      },
      email: {
        type: DataTypes.STRING
      },
      phone: {
        type: DataTypes.STRING
      },
      address: {
        type: DataTypes.STRING
      },
      addressNumber: {
        type: DataTypes.STRING
      },
      complement: {
        type: DataTypes.STRING
      },
      province: {
        type: DataTypes.STRING
      },
      postalCode: {
        type: DataTypes.STRING
      },
      cpfCnpj: {
        type: DataTypes.STRING
      },
      apiKey: {
        type: DataTypes.STRING
      },
      walletId: {
        type: DataTypes.STRING
      },
      companyType: {
        type: DataTypes.STRING
      },
      personType: {
        type: DataTypes.STRING
      },
      birthDate: {
        type: DataTypes.STRING
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
    return queryInterface.dropTable("Affiliates");
  }
};
