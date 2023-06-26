"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Contact_1 = __importDefault(require("../models/Contact"));
const Ticket_1 = __importDefault(require("../models/Ticket"));
const CreateContactService_1 = __importDefault(require("../services/ContactServices/CreateContactService"));
const Mustache_1 = __importDefault(require("../helpers/Mustache"));
const FindOrCreateTicketService_1 = __importDefault(require("../services/TicketServices/FindOrCreateTicketService"));
const CreateInfoAPIExternal = async ({ number, companyId, whatsappId, body }) => {
    let contact = await Contact_1.default.findOne({ where: { number, companyId } });
    if (!contact) {
        contact = await (0, CreateContactService_1.default)({
            name: number,
            number,
            email: "",
            companyId
        });
    }
    const unreadMessages = 0;
    let ticket = await Ticket_1.default.findOne({ where: { contactId: contact.id } });
    if (!ticket)
        ticket = await (0, FindOrCreateTicketService_1.default)(contact, whatsappId, unreadMessages, companyId);
    await ticket.update({ lastMessage: (0, Mustache_1.default)(body, ticket.contact) });
};
exports.default = CreateInfoAPIExternal;
