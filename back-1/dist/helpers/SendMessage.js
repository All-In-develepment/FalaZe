"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendMessage = void 0;
const GetWhatsappWbot_1 = __importDefault(require("./GetWhatsappWbot"));
const fs_1 = __importDefault(require("fs"));
const SendWhatsAppMedia_1 = require("../services/WbotServices/SendWhatsAppMedia");
const wbotMessageListener_1 = require("../services/WbotServices/wbotMessageListener");
const Contact_1 = __importDefault(require("../models/Contact"));
const Ticket_1 = __importDefault(require("../models/Ticket"));
const CreateInfoAPIExternal_1 = __importDefault(require("./CreateInfoAPIExternal"));
const SendMessage = async (whatsapp, messageData) => {
    try {
        const wbot = await (0, GetWhatsappWbot_1.default)(whatsapp);
        const chatId = `${messageData.number}@s.whatsapp.net`;
        let message;
        if (messageData.mediaPath) {
            const options = await (0, SendWhatsAppMedia_1.getMessageOptions)(messageData.body, messageData.mediaPath);
            if (options) {
                const body = fs_1.default.readFileSync(messageData.mediaPath);
                message = await wbot.sendMessage(chatId, {
                    ...options
                });
            }
        }
        else {
            const body = `\u200e${messageData.body}`;
            message = await wbot.sendMessage(chatId, { text: body });
        }
        const contact = await Contact_1.default.findOne({
            where: { number: messageData.number }
        });
        const companyId = 1;
        const { number, whatsappId, body } = messageData;
        await (0, CreateInfoAPIExternal_1.default)({
            number,
            companyId,
            whatsappId,
            body
        });
        const ticket = await Ticket_1.default.findOne({ where: { contactId: contact.id } });
        await (0, wbotMessageListener_1.verifyMessage)(message, ticket, contact);
        return message;
    }
    catch (err) {
        throw new Error(err);
    }
};
exports.SendMessage = SendMessage;
