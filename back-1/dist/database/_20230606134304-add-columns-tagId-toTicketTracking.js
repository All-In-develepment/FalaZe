"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
module.exports = {
    up: (queryInterface) => {
        return queryInterface.addColumn("TicketTraking", "tagId", {
            type: sequelize_1.DataTypes.INTEGER,
            references: { model: "Tags", key: "id" },
            onDelete: "SET NULL",
            allowNull: true
        });
    },
    down: (queryInterface) => {
        return Promise.all([queryInterface.removeColumn("TicketTraking", "tagId")]);
    }
};
