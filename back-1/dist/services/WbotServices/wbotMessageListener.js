"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleMessage = exports.wbotMessageListener = exports.verifyMessage = exports.getMeSocket = exports.getQuotedMessageId = exports.getQuotedMessage = exports.getBodyMessage = void 0;
const path_1 = require("path");
const util_1 = require("util");
const fs_1 = require("fs");
const Sentry = __importStar(require("@sentry/node"));
const lodash_1 = require("lodash");
const baileys_1 = require("@adiwajshing/baileys");
const Contact_1 = __importDefault(require("../../models/Contact"));
const Ticket_1 = __importDefault(require("../../models/Ticket"));
const Message_1 = __importDefault(require("../../models/Message"));
const socket_1 = require("../../libs/socket");
const CreateMessageService_1 = __importDefault(require("../MessageServices/CreateMessageService"));
const logger_1 = require("../../utils/logger");
const CreateOrUpdateContactService_1 = __importDefault(require("../ContactServices/CreateOrUpdateContactService"));
const FindOrCreateTicketService_1 = __importDefault(require("../TicketServices/FindOrCreateTicketService"));
const ShowWhatsAppService_1 = __importDefault(require("../WhatsappService/ShowWhatsAppService"));
const Debounce_1 = require("../../helpers/Debounce");
const UpdateTicketService_1 = __importDefault(require("../TicketServices/UpdateTicketService"));
const Mustache_1 = __importDefault(require("../../helpers/Mustache"));
const UserRating_1 = __importDefault(require("../../models/UserRating"));
const SendWhatsAppMessage_1 = __importDefault(require("./SendWhatsAppMessage"));
const moment_1 = __importDefault(require("moment"));
const Queue_1 = __importDefault(require("../../models/Queue"));
const QueueOption_1 = __importDefault(require("../../models/QueueOption"));
const FindOrCreateATicketTrakingService_1 = __importDefault(require("../TicketServices/FindOrCreateATicketTrakingService"));
const Campaign_1 = __importDefault(require("../../models/Campaign"));
const CampaignShipping_1 = __importDefault(require("../../models/CampaignShipping"));
const sequelize_1 = require("sequelize");
const queues_1 = require("../../queues");
const User_1 = __importDefault(require("../../models/User"));
const Setting_1 = __importDefault(require("../../models/Setting"));
const CreateOrUpdateBaileysChatService_1 = require("../BaileysChatServices/CreateOrUpdateBaileysChatService");
const ShowBaileysChatService_1 = require("../BaileysChatServices/ShowBaileysChatService");
const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");
var axios = require("axios");
const isNumeric = (value) => /^-?\d+$/.test(value);
const writeFileAsync = (0, util_1.promisify)(fs_1.writeFile);
const getTypeMessage = (msg) => {
    return (0, baileys_1.getContentType)(msg.message);
};
function validaCpfCnpj(val) {
    if (val.length == 11) {
        var cpf = val.trim();
        cpf = cpf.replace(/\./g, "");
        cpf = cpf.replace("-", "");
        cpf = cpf.split("");
        var v1 = 0;
        var v2 = 0;
        var aux = false;
        for (var i = 1; cpf.length > i; i++) {
            if (cpf[i - 1] != cpf[i]) {
                aux = true;
            }
        }
        if (aux == false) {
            return false;
        }
        for (var i = 0, p = 10; cpf.length - 2 > i; i++, p--) {
            v1 += cpf[i] * p;
        }
        v1 = (v1 * 10) % 11;
        if (v1 == 10) {
            v1 = 0;
        }
        if (v1 != cpf[9]) {
            return false;
        }
        for (var i = 0, p = 11; cpf.length - 1 > i; i++, p--) {
            v2 += cpf[i] * p;
        }
        v2 = (v2 * 10) % 11;
        if (v2 == 10) {
            v2 = 0;
        }
        if (v2 != cpf[10]) {
            return false;
        }
        else {
            return true;
        }
    }
    else if (val.length == 14) {
        var cnpj = val.trim();
        cnpj = cnpj.replace(/\./g, "");
        cnpj = cnpj.replace("-", "");
        cnpj = cnpj.replace("/", "");
        cnpj = cnpj.split("");
        var v1 = 0;
        var v2 = 0;
        var aux = false;
        for (var i = 1; cnpj.length > i; i++) {
            if (cnpj[i - 1] != cnpj[i]) {
                aux = true;
            }
        }
        if (aux == false) {
            return false;
        }
        for (var i = 0, p1 = 5, p2 = 13; cnpj.length - 2 > i; i++, p1--, p2--) {
            if (p1 >= 2) {
                v1 += cnpj[i] * p1;
            }
            else {
                v1 += cnpj[i] * p2;
            }
        }
        v1 = v1 % 11;
        if (v1 < 2) {
            v1 = 0;
        }
        else {
            v1 = 11 - v1;
        }
        if (v1 != cnpj[12]) {
            return false;
        }
        for (var i = 0, p1 = 6, p2 = 14; cnpj.length - 1 > i; i++, p1--, p2--) {
            if (p1 >= 2) {
                v2 += cnpj[i] * p1;
            }
            else {
                v2 += cnpj[i] * p2;
            }
        }
        v2 = v2 % 11;
        if (v2 < 2) {
            v2 = 0;
        }
        else {
            v2 = 11 - v2;
        }
        if (v2 != cnpj[13]) {
            return false;
        }
        else {
            return true;
        }
    }
    else {
        return false;
    }
}
function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
async function sleep(time) {
    await timeout(time);
}
const sendMessageImage = async (wbot, contact, ticket, url, caption) => {
    let sentMessage;
    try {
        sentMessage = await wbot.sendMessage(`${contact.number}@${ticket.isGroup ? "g.us" : "s.whatsapp.net"}`, {
            image: url
                ? { url }
                : fs.readFileSync(`public/temp/${caption}-${makeid(10)}`),
            fileName: caption,
            caption: caption,
            mimetype: "image/jpeg"
        });
    }
    catch (error) {
        sentMessage = await wbot.sendMessage(`${contact.number}@${ticket.isGroup ? "g.us" : "s.whatsapp.net"}`, {
            text: (0, Mustache_1.default)("Não consegui enviar o PDF, tente novamente!", contact)
        });
    }
    (0, exports.verifyMessage)(sentMessage, ticket, contact);
};
const sendMessageLink = async (wbot, contact, ticket, url, caption) => {
    let sentMessage;
    try {
        sentMessage = await wbot.sendMessage(`${contact.number}@${ticket.isGroup ? "g.us" : "s.whatsapp.net"}`, {
            document: url
                ? { url }
                : fs.readFileSync(`public/temp/${caption}-${makeid(10)}`),
            fileName: caption,
            caption: caption,
            mimetype: "application/pdf"
        });
    }
    catch (error) {
        sentMessage = await wbot.sendMessage(`${contact.number}@${ticket.isGroup ? "g.us" : "s.whatsapp.net"}`, {
            text: (0, Mustache_1.default)("Não consegui enviar o PDF, tente novamente!", contact)
        });
    }
    (0, exports.verifyMessage)(sentMessage, ticket, contact);
};
function makeid(length) {
    var result = "";
    var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
const getBodyButton = (msg) => {
    if (msg.key.fromMe && msg.message.buttonsMessage?.contentText) {
        let bodyMessage = `*${msg?.message?.buttonsMessage?.contentText}*`;
        for (const buton of msg.message?.buttonsMessage?.buttons) {
            bodyMessage += `\n\n${buton.buttonText?.displayText}`;
        }
        return bodyMessage;
    }
    if (msg.key.fromMe && msg?.message?.viewOnceMessage?.message?.listMessage) {
        let bodyMessage = `*${msg?.message?.viewOnceMessage?.message?.listMessage?.description}*`;
        for (const buton of msg.message?.viewOnceMessage?.message?.listMessage
            ?.sections) {
            for (const rows of buton.rows) {
                bodyMessage += `\n\n${rows.title}`;
            }
        }
        return bodyMessage;
    }
};
const getBodyList = (msg) => {
    if (msg.key.fromMe && msg.message.listMessage?.description) {
        let bodyMessage = `*${msg.message.listMessage?.description}*`;
        for (const buton of msg.message.listMessage?.sections) {
            for (const rows of buton.rows) {
                bodyMessage += `\n\n${rows.title}`;
            }
        }
        return bodyMessage;
    }
    if (msg.key.fromMe && msg?.message?.viewOnceMessage?.message?.listMessage) {
        let bodyMessage = `*${msg?.message?.viewOnceMessage?.message?.listMessage?.description}*`;
        for (const buton of msg.message?.viewOnceMessage?.message?.listMessage
            ?.sections) {
            for (const rows of buton.rows) {
                bodyMessage += `\n\n${rows.title}`;
            }
        }
        return bodyMessage;
    }
};
const msgLocation = (image, latitude, longitude) => {
    if (image) {
        var b64 = Buffer.from(image).toString("base64");
        let data = `data:image/png;base64, ${b64} | https://maps.google.com/maps?q=${latitude}%2C${longitude}&z=17&hl=pt-BR|${latitude}, ${longitude} `;
        return data;
    }
};
const getBodyMessage = (msg) => {
    try {
        let type = getTypeMessage(msg);
        const types = {
            conversation: msg.message.conversation,
            imageMessage: msg.message.imageMessage?.caption,
            videoMessage: msg.message.videoMessage?.caption,
            extendedTextMessage: msg.message.extendedTextMessage?.text,
            buttonsResponseMessage: msg.message.buttonsResponseMessage?.selectedButtonId,
            templateButtonReplyMessage: msg.message?.templateButtonReplyMessage?.selectedId,
            messageContextInfo: msg.message.buttonsResponseMessage?.selectedButtonId ||
                msg.message.listResponseMessage?.title,
            buttonsMessage: getBodyButton(msg) || msg.message.buttonsMessage?.contentText,
            viewOnceMessage: getBodyButton(msg) ||
                msg.message?.listResponseMessage?.singleSelectReply?.selectedRowId,
            stickerMessage: "sticker",
            contactMessage: msg.message?.contactMessage?.vcard,
            contactsArrayMessage: "varios contatos",
            //locationMessage: `Latitude: ${msg.message.locationMessage?.degreesLatitude} - Longitude: ${msg.message.locationMessage?.degreesLongitude}`,
            locationMessage: msgLocation(msg.message?.locationMessage?.jpegThumbnail, msg.message?.locationMessage?.degreesLatitude, msg.message?.locationMessage?.degreesLongitude),
            liveLocationMessage: `Latitude: ${msg.message.liveLocationMessage?.degreesLatitude} - Longitude: ${msg.message.liveLocationMessage?.degreesLongitude}`,
            documentMessage: msg.message?.documentMessage?.title,
            audioMessage: "Áudio",
            listMessage: getBodyList(msg) || msg.message.listResponseMessage?.title,
            listResponseMessage: msg.message?.listResponseMessage?.singleSelectReply?.selectedRowId,
            reactionMessage: msg.message.reactionMessage?.text || "reaction",
            senderKeyDistributionMessage: msg.message.senderKeyDistributionMessage
                ?.axolotlSenderKeyDistributionMessage
        };
        /* console.log(msg); */
        const objKey = Object.keys(types).find(key => key === type);
        if (!objKey) {
            logger_1.logger.warn(`#### Nao achou o type 152: ${type}
  ${JSON.stringify(msg)}`);
            Sentry.setExtra("Mensagem", { BodyMsg: msg.message, msg, type });
            Sentry.captureException(new Error("Novo Tipo de Mensagem em getTypeMessage"));
        }
        return types[type];
    }
    catch (error) {
        Sentry.setExtra("Error getTypeMessage", { msg, BodyMsg: msg.message });
        Sentry.captureException(error);
        console.log(error);
    }
};
exports.getBodyMessage = getBodyMessage;
const getQuotedMessage = (msg) => {
    const body = msg.message.imageMessage.contextInfo ||
        msg.message.videoMessage.contextInfo ||
        msg.message?.documentMessage ||
        msg.message.extendedTextMessage.contextInfo ||
        msg.message.buttonsResponseMessage.contextInfo ||
        msg.message.listResponseMessage.contextInfo ||
        msg.message.templateButtonReplyMessage.contextInfo ||
        msg.message.buttonsResponseMessage?.contextInfo ||
        msg?.message?.buttonsResponseMessage?.selectedButtonId ||
        msg.message.listResponseMessage?.singleSelectReply?.selectedRowId ||
        msg?.message?.listResponseMessage?.singleSelectReply.selectedRowId ||
        msg.message.listResponseMessage?.contextInfo;
    msg.message.senderKeyDistributionMessage;
    // testar isso
    return (0, baileys_1.extractMessageContent)(body[Object.keys(body).values().next().value]);
};
exports.getQuotedMessage = getQuotedMessage;
const getQuotedMessageId = (msg) => {
    const body = (0, baileys_1.extractMessageContent)(msg.message)[Object.keys(msg?.message).values().next().value];
    return body?.contextInfo?.stanzaId;
};
exports.getQuotedMessageId = getQuotedMessageId;
const getMeSocket = (wbot) => {
    return {
        id: (0, baileys_1.jidNormalizedUser)(wbot.user.id),
        name: wbot.user.name
    };
};
exports.getMeSocket = getMeSocket;
const getSenderMessage = (msg, wbot) => {
    const me = (0, exports.getMeSocket)(wbot);
    if (msg.key.fromMe)
        return me.id;
    const senderId = msg.participant || msg.key.participant || msg.key.remoteJid || undefined;
    return senderId && (0, baileys_1.jidNormalizedUser)(senderId);
};
const getContactMessage = async (msg, wbot) => {
    const isGroup = msg.key.remoteJid.includes("g.us");
    const rawNumber = msg.key.remoteJid.replace(/\D/g, "");
    return isGroup
        ? {
            id: getSenderMessage(msg, wbot),
            name: msg.pushName
        }
        : {
            id: msg.key.remoteJid,
            name: msg.key.fromMe ? rawNumber : msg.pushName
        };
};
const downloadMedia = async (msg) => {
    const mineType = msg.message?.imageMessage ||
        msg.message?.audioMessage ||
        msg.message?.videoMessage ||
        msg.message?.stickerMessage ||
        msg.message?.documentMessage ||
        msg.message?.extendedTextMessage?.contextInfo?.quotedMessage?.imageMessage;
    const messageType = msg.message?.documentMessage
        ? "document"
        : mineType.mimetype.split("/")[0].replace("application", "document")
            ? mineType.mimetype
                .split("/")[0]
                .replace("application", "document")
            : mineType.mimetype.split("/")[0];
    let stream;
    let contDownload = 0;
    while (contDownload < 10 && !stream) {
        try {
            stream = await (0, baileys_1.downloadContentFromMessage)(msg.message.audioMessage ||
                msg.message.videoMessage ||
                msg.message.documentMessage ||
                msg.message.imageMessage ||
                msg.message.stickerMessage ||
                msg.message.extendedTextMessage?.contextInfo.quotedMessage
                    .imageMessage ||
                msg.message?.buttonsMessage?.imageMessage ||
                msg.message?.templateMessage?.fourRowTemplate?.imageMessage ||
                msg.message?.templateMessage?.hydratedTemplate?.imageMessage ||
                msg.message?.templateMessage?.hydratedFourRowTemplate?.imageMessage ||
                msg.message?.interactiveMessage?.header?.imageMessage, messageType);
        }
        catch (error) {
            contDownload++;
            await new Promise(resolve => setTimeout(resolve, 1000 * contDownload * 2));
            logger_1.logger.warn(`>>>> erro ${contDownload} de baixar o arquivo ${msg?.key.id}`);
        }
    }
    let buffer = Buffer.from([]);
    // eslint-disable-next-line no-restricted-syntax
    try {
        for await (const chunk of stream) {
            buffer = Buffer.concat([buffer, chunk]);
        }
    }
    catch (error) {
        return { data: "error", mimetype: "", filename: "" };
    }
    if (!buffer) {
        Sentry.setExtra("ERR_WAPP_DOWNLOAD_MEDIA", { msg });
        Sentry.captureException(new Error("ERR_WAPP_DOWNLOAD_MEDIA"));
        throw new Error("ERR_WAPP_DOWNLOAD_MEDIA");
    }
    let filename = msg.message?.documentMessage?.fileName || "";
    if (!filename) {
        const ext = mineType.mimetype.split("/")[1].split(";")[0];
        filename = `${new Date().getTime()}.${ext}`;
    }
    const media = {
        data: buffer,
        mimetype: mineType.mimetype,
        filename
    };
    return media;
};
const verifyContact = async (msgContact, wbot, companyId) => {
    let profilePicUrl;
    try {
        profilePicUrl = await wbot.profilePictureUrl(msgContact.id);
    }
    catch (e) {
        Sentry.captureException(e);
        profilePicUrl = `${process.env.FRONTEND_URL}/nopicture.png`;
    }
    const contactData = {
        name: msgContact?.name || msgContact.id.replace(/\D/g, ""),
        number: msgContact.id.replace(/\D/g, ""),
        profilePicUrl,
        isGroup: msgContact.id.includes("g.us"),
        companyId
    };
    const contact = (0, CreateOrUpdateContactService_1.default)(contactData);
    return contact;
};
const verifyQuotedMessage = async (msg) => {
    if (!msg)
        return null;
    const quoted = (0, exports.getQuotedMessageId)(msg);
    if (!quoted)
        return null;
    const quotedMsg = await Message_1.default.findOne({
        where: { id: quoted }
    });
    if (!quotedMsg)
        return null;
    return quotedMsg;
};
const verifyMediaMessage = async (msg, ticket, contact) => {
    const io = (0, socket_1.getIO)();
    const quotedMsg = await verifyQuotedMessage(msg);
    const media = await downloadMedia(msg);
    if (!media) {
        throw new Error("ERR_WAPP_DOWNLOAD_MEDIA");
    }
    if (!media.filename) {
        const ext = media.mimetype.split("/")[1].split(";")[0];
        media.filename = `${new Date().getTime()}.${ext}`;
    }
    try {
        await writeFileAsync((0, path_1.join)(__dirname, "..", "..", "..", "public", media.filename), media.data, "base64");
    }
    catch (err) {
        Sentry.captureException(err);
        logger_1.logger.error(err);
    }
    const body = (0, exports.getBodyMessage)(msg);
    const messageData = {
        id: msg.key.id,
        ticketId: ticket.id,
        contactId: msg.key.fromMe ? undefined : contact.id,
        body: body ? body : media.filename,
        fromMe: msg.key.fromMe,
        read: msg.key.fromMe,
        mediaUrl: media.filename,
        mediaType: media.mimetype.split("/")[0],
        quotedMsgId: quotedMsg?.id,
        ack: msg.status,
        remoteJid: msg.key.remoteJid,
        participant: msg.key.participant,
        dataJson: JSON.stringify(msg)
    };
    await ticket.update({
        lastMessage: body || media.filename
    });
    const newMessage = await (0, CreateMessageService_1.default)({
        messageData,
        companyId: ticket.companyId
    });
    if (!msg.key.fromMe && ticket.status === "closed") {
        await ticket.update({ status: "pending" });
        await ticket.reload({
            include: [
                { model: Queue_1.default, as: "queue" },
                { model: User_1.default, as: "user" },
                { model: Contact_1.default, as: "contact" }
            ]
        });
        io.to("closed").emit(`company-${ticket.companyId}-ticket`, {
            action: "delete",
            ticket,
            ticketId: ticket.id
        });
        io.to(ticket.status)
            .to(ticket.id.toString())
            .emit(`company-${ticket.companyId}-ticket`, {
            action: "update",
            ticket,
            ticketId: ticket.id
        });
    }
    return newMessage;
};
const verifyMessage = async (msg, ticket, contact) => {
    const io = (0, socket_1.getIO)();
    const quotedMsg = await verifyQuotedMessage(msg);
    const body = (0, exports.getBodyMessage)(msg);
    const messageData = {
        id: msg.key.id,
        ticketId: ticket.id,
        contactId: msg.key.fromMe ? undefined : contact.id,
        body,
        fromMe: msg.key.fromMe,
        mediaType: getTypeMessage(msg),
        read: msg.key.fromMe,
        quotedMsgId: quotedMsg?.id,
        ack: msg.status,
        remoteJid: msg.key.remoteJid,
        participant: msg.key.participant,
        dataJson: JSON.stringify(msg)
    };
    await ticket.update({
        lastMessage: body
    });
    await (0, CreateMessageService_1.default)({ messageData, companyId: ticket.companyId });
    if (!msg.key.fromMe && ticket.status === "closed") {
        await ticket.update({ status: "pending" });
        await ticket.reload({
            include: [
                { model: Queue_1.default, as: "queue" },
                { model: User_1.default, as: "user" },
                { model: Contact_1.default, as: "contact" }
            ]
        });
        io.to("closed").emit(`company-${ticket.companyId}-ticket`, {
            action: "delete",
            ticket,
            ticketId: ticket.id
        });
        io.to(ticket.status)
            .to(ticket.id.toString())
            .emit(`company-${ticket.companyId}-ticket`, {
            action: "update",
            ticket,
            ticketId: ticket.id
        });
    }
};
exports.verifyMessage = verifyMessage;
const isValidMsg = (msg) => {
    if (msg.key.remoteJid === "status@broadcast")
        return false;
    try {
        const msgType = getTypeMessage(msg);
        if (!msgType) {
            return;
        }
        const ifType = msgType === "conversation" ||
            msgType === "extendedTextMessage" ||
            msgType === "audioMessage" ||
            msgType === "videoMessage" ||
            msgType === "imageMessage" ||
            msgType === "documentMessage" ||
            msgType === "stickerMessage" ||
            msgType === "buttonsResponseMessage" ||
            msgType === "buttonsMessage" ||
            msgType === "messageContextInfo" ||
            msgType === "locationMessage" ||
            msgType === "liveLocationMessage" ||
            msgType === "contactMessage" ||
            msgType === "voiceMessage" ||
            msgType === "mediaMessage" ||
            msgType === "contactsArrayMessage" ||
            msgType === "reactionMessage" ||
            msgType === "ephemeralMessage" ||
            msgType === "protocolMessage" ||
            msgType === "listResponseMessage" ||
            msgType === "listMessage" ||
            msgType === "viewOnceMessage";
        if (!ifType) {
            logger_1.logger.warn(`#### Nao achou o type em isValidMsg: ${msgType}
${JSON.stringify(msg?.message)}`);
            Sentry.setExtra("Mensagem", { BodyMsg: msg.message, msg, msgType });
            Sentry.captureException(new Error("Novo Tipo de Mensagem em isValidMsg"));
        }
        return !!ifType;
    }
    catch (error) {
        Sentry.setExtra("Error isValidMsg", { msg });
        Sentry.captureException(error);
    }
};
const Push = (msg) => {
    return msg.pushName;
};
const verifyQueue = async (wbot, msg, ticket, contact) => {
    const { queues, greetingMessage } = await (0, ShowWhatsAppService_1.default)(wbot.id, ticket.companyId);
    if (queues.length === 1) {
        const firstQueue = (0, lodash_1.head)(queues);
        let chatbot = false;
        if (firstQueue?.options) {
            chatbot = firstQueue.options.length > 0;
        }
        await (0, UpdateTicketService_1.default)({
            ticketData: { queueId: firstQueue?.id, chatbot },
            ticketId: ticket.id,
            companyId: ticket.companyId
        });
        return;
    }
    const selectedOption = (0, exports.getBodyMessage)(msg);
    const choosenQueue = queues[+selectedOption - 1];
    const companyId = ticket.companyId;
    const buttonActive = await Setting_1.default.findOne({
        where: {
            key: "chatBotType",
            companyId
        }
    });
    const botList = async () => {
        const sectionsRows = [];
        queues.forEach((queue, index) => {
            sectionsRows.push({
                title: queue.name,
                rowId: `${index + 1}`
            });
        });
        const sections = [
            {
                rows: sectionsRows
            }
        ];
        const listMessage = {
            text: (0, Mustache_1.default)(`\u200e${greetingMessage}`, contact),
            buttonText: "Escolha uma opção",
            sections
        };
        const sendMsg = await wbot.sendMessage(`${contact.number}@${ticket.isGroup ? "g.us" : "s.whatsapp.net"}`, listMessage);
        await (0, exports.verifyMessage)(sendMsg, ticket, ticket.contact);
    };
    const botButton = async () => {
        const buttons = [];
        queues.forEach((queue, index) => {
            buttons.push({
                buttonId: `${index + 1}`,
                buttonText: { displayText: queue.name },
                type: 4
            });
        });
        const buttonMessage = {
            text: (0, Mustache_1.default)(`\u200e${greetingMessage}`, contact),
            buttons,
            headerType: 4
        };
        const sendMsg = await wbot.sendMessage(`${contact.number}@${ticket.isGroup ? "g.us" : "s.whatsapp.net"}`, buttonMessage);
        await (0, exports.verifyMessage)(sendMsg, ticket, ticket.contact);
    };
    const botText = async () => {
        let options = "";
        queues.forEach((queue, index) => {
            options += `*[ ${index + 1} ]* - ${queue.name}\n`;
        });
        const textMessage = {
            text: (0, Mustache_1.default)(`\u200e${greetingMessage}\n\n${options}`, contact)
        };
        const sendMsg = await wbot.sendMessage(`${contact.number}@${ticket.isGroup ? "g.us" : "s.whatsapp.net"}`, textMessage);
        await (0, exports.verifyMessage)(sendMsg, ticket, ticket.contact);
    };
    if (choosenQueue) {
        let chatbot = false;
        if (choosenQueue?.options) {
            chatbot = choosenQueue.options.length > 0;
        }
        await (0, UpdateTicketService_1.default)({
            ticketData: { queueId: choosenQueue.id, chatbot },
            ticketId: ticket.id,
            companyId: ticket.companyId
        });
        /* Tratamento para envio de mensagem quando a fila está fora do expediente */
        if (choosenQueue.options.length === 0) {
            const queue = await Queue_1.default.findByPk(choosenQueue.id);
            const { schedules } = queue;
            const now = (0, moment_1.default)();
            const weekday = now.format("dddd").toLowerCase();
            let schedule;
            if (Array.isArray(schedules) && schedules.length > 0) {
                schedule = schedules.find(s => s.weekdayEn === weekday &&
                    s.startTime !== "" &&
                    s.startTime !== null &&
                    s.endTime !== "" &&
                    s.endTime !== null);
            }
            if (queue.outOfHoursMessage !== null &&
                queue.outOfHoursMessage !== "" &&
                !(0, lodash_1.isNil)(schedule)) {
                const startTime = (0, moment_1.default)(schedule.startTime, "HH:mm");
                const endTime = (0, moment_1.default)(schedule.endTime, "HH:mm");
                if (now.isBefore(startTime) || now.isAfter(endTime)) {
                    const body = (0, Mustache_1.default)(`${queue.outOfHoursMessage}\n\n*[ # ]* - Voltar ao Menu Principal`, ticket.contact);
                    const sentMessage = await wbot.sendMessage(`${contact.number}@${ticket.isGroup ? "g.us" : "s.whatsapp.net"}`, {
                        text: body
                    });
                    await (0, exports.verifyMessage)(sentMessage, ticket, contact);
                    await (0, UpdateTicketService_1.default)({
                        ticketData: { queueId: null, chatbot },
                        ticketId: ticket.id,
                        companyId: ticket.companyId
                    });
                    return;
                }
            }
            const body = (0, Mustache_1.default)(`\u200e${choosenQueue.greetingMessage}`, ticket.contact);
            const sentMessage = await wbot.sendMessage(`${contact.number}@${ticket.isGroup ? "g.us" : "s.whatsapp.net"}`, {
                text: body
            });
            await (0, exports.verifyMessage)(sentMessage, ticket, contact);
        }
    }
    else {
        if (buttonActive.value === "list") {
            return botList();
        }
        if (buttonActive.value === "button" && queues.length <= 4) {
            return botButton();
        }
        if (buttonActive.value === "text") {
            return botText();
        }
        if (buttonActive.value === "button" && queues.length > 4) {
            return botText();
        }
    }
};
const verifyRating = (ticketTraking) => {
    if (ticketTraking &&
        ticketTraking.finishedAt === null &&
        ticketTraking.userId !== null &&
        ticketTraking.ratingAt !== null) {
        return true;
    }
    return false;
};
const handleRating = async (msg, ticket, ticketTraking) => {
    const io = (0, socket_1.getIO)();
    let rate = null;
    if (msg.message?.conversation) {
        rate = +msg.message?.conversation;
    }
    if (!Number.isNaN(rate) && Number.isInteger(rate) && !(0, lodash_1.isNull)(rate)) {
        const { complationMessage } = await (0, ShowWhatsAppService_1.default)(ticket.whatsappId, ticket.companyId);
        let finalRate = rate;
        if (rate < 1) {
            finalRate = 1;
        }
        if (rate > 3) {
            finalRate = 3;
        }
        await UserRating_1.default.create({
            ticketId: ticketTraking.ticketId,
            companyId: ticketTraking.companyId,
            userId: ticketTraking.userId,
            rate: finalRate
        });
        const body = (0, Mustache_1.default)(`\u200e${complationMessage}`, ticket.contact);
        await (0, SendWhatsAppMessage_1.default)({ body, ticket });
        await ticketTraking.update({
            finishedAt: (0, moment_1.default)().toDate(),
            rated: true
        });
        await ticket.update({
            queueId: null,
            userId: null,
            status: "closed"
        });
        io.to("open").emit(`company-${ticket.companyId}-ticket`, {
            action: "delete",
            ticket,
            ticketId: ticket.id
        });
        io.to(ticket.status)
            .to(ticket.id.toString())
            .emit(`company-${ticket.companyId}-ticket`, {
            action: "update",
            ticket,
            ticketId: ticket.id
        });
    }
};
const handleChartbot = async (ticket, msg, wbot, dontReadTheFirstQuestion = false) => {
    const queue = await Queue_1.default.findByPk(ticket.queueId, {
        include: [
            {
                model: QueueOption_1.default,
                as: "options",
                where: { parentId: null },
                order: [
                    ["option", "ASC"],
                    ["createdAt", "ASC"]
                ]
            }
        ]
    });
    const messageBody = (0, exports.getBodyMessage)(msg);
    if (messageBody == "#") {
        // voltar para o menu inicial
        await ticket.update({ queueOptionId: null, chatbot: false, queueId: null });
        await verifyQueue(wbot, msg, ticket, ticket.contact);
        return;
    }
    const companyId = ticket.companyId;
    const buttonActive = await Setting_1.default.findOne({
        where: {
            key: "chatBotType",
            companyId
        }
    });
    const botText = async () => {
        if (!(0, lodash_1.isNil)(queue) && !(0, lodash_1.isNil)(ticket.queueOptionId) && messageBody == "#") {
            // falar com atendente
            await ticket.update({ queueOptionId: null, chatbot: false });
            const sentMessage = await wbot.sendMessage(`${ticket.contact.number}@${ticket.isGroup ? "g.us" : "s.whatsapp.net"}`, {
                text: "\u200eAguarde, você será atendido em instantes."
            });
            (0, exports.verifyMessage)(sentMessage, ticket, ticket.contact);
            return;
        }
        else if (!(0, lodash_1.isNil)(queue) &&
            !(0, lodash_1.isNil)(ticket.queueOptionId) &&
            messageBody == "0") {
            // voltar para o menu anterior
            const option = await QueueOption_1.default.findByPk(ticket.queueOptionId);
            await ticket.update({ queueOptionId: option?.parentId });
        }
        else if (!(0, lodash_1.isNil)(queue) && !(0, lodash_1.isNil)(ticket.queueOptionId)) {
            // escolheu uma opção
            const count = await QueueOption_1.default.count({
                where: { parentId: ticket.queueOptionId }
            });
            let option = {};
            if (count == 1) {
                option = await QueueOption_1.default.findOne({
                    where: { parentId: ticket.queueOptionId }
                });
            }
            else {
                option = await QueueOption_1.default.findOne({
                    where: {
                        option: messageBody || "",
                        parentId: ticket.queueOptionId
                    }
                });
            }
            if (option) {
                await ticket.update({ queueOptionId: option?.id });
            }
        }
        else if (!(0, lodash_1.isNil)(queue) &&
            (0, lodash_1.isNil)(ticket.queueOptionId) &&
            !dontReadTheFirstQuestion) {
            // não linha a primeira pergunta
            const option = queue?.options.find(o => o.option == messageBody);
            if (option) {
                await ticket.update({ queueOptionId: option?.id });
            }
        }
        await ticket.reload();
        if (!(0, lodash_1.isNil)(queue) && (0, lodash_1.isNil)(ticket.queueOptionId)) {
            let body = "";
            let options = "";
            const queueOptions = await QueueOption_1.default.findAll({
                where: { queueId: ticket.queueId, parentId: null },
                order: [
                    ["option", "ASC"],
                    ["createdAt", "ASC"]
                ]
            });
            if (queue.greetingMessage) {
                body = `${queue.greetingMessage}\n\n`;
            }
            queueOptions.forEach((option, i) => {
                if (queueOptions.length - 1 > i) {
                    options += `*[ ${option.option} ]* - ${option.title}\n`;
                }
                else {
                    options += `*[ ${option.option} ]* - ${option.title}`;
                }
            });
            if (options !== "") {
                body += options;
            }
            body += "\n\n*[ # ]* - *Menu Inicial*";
            const textMessage = {
                text: (0, Mustache_1.default)(`\u200e${body}`, ticket.contact)
            };
            const sendMsg = await wbot.sendMessage(`${ticket.contact.number}@${ticket.isGroup ? "g.us" : "s.whatsapp.net"}`, textMessage);
            await (0, exports.verifyMessage)(sendMsg, ticket, ticket.contact);
        }
        else if (!(0, lodash_1.isNil)(queue) && !(0, lodash_1.isNil)(ticket.queueOptionId)) {
            const currentOption = await QueueOption_1.default.findByPk(ticket.queueOptionId);
            const queueOptions = await QueueOption_1.default.findAll({
                where: { parentId: ticket.queueOptionId },
                order: [
                    ["option", "ASC"],
                    ["createdAt", "ASC"]
                ]
            });
            let body = "";
            let options = "";
            let initialMessage = "";
            let aditionalOptions = "\n";
            if (queueOptions.length > 1) {
                if (!(0, lodash_1.isNil)(currentOption?.message) && currentOption?.message !== "") {
                    initialMessage = `${currentOption?.message}\n\n`;
                    body += initialMessage;
                }
                if (queueOptions.length == 0) {
                    aditionalOptions = `*#* - *Falar com o atendente*\n`;
                }
                queueOptions.forEach(option => {
                    options += `*[ ${option.option} ]* - ${option.title}\n`;
                });
                if (options !== "") {
                    body += options;
                }
                aditionalOptions += "*[ 0 ]* - *Voltar*\n";
                aditionalOptions += "*[ # ]* - *Menu inicial*";
                body += aditionalOptions;
            }
            else {
                const firstOption = (0, lodash_1.head)(queueOptions);
                if (firstOption) {
                    body = `${firstOption?.title}`;
                    if (firstOption?.message) {
                        body += `\n\n${firstOption.message}`;
                    }
                }
                else {
                    body += `*[ 0 ]* - *Voltar*\n`;
                    body += `*[ # ]* - *Menu inicial*`;
                }
            }
            const textMessage = {
                text: (0, Mustache_1.default)(`\u200e${body}`, ticket.contact)
            };
            const sendMsg = await wbot.sendMessage(`${ticket.contact.number}@${ticket.isGroup ? "g.us" : "s.whatsapp.net"}`, textMessage);
            await (0, exports.verifyMessage)(sendMsg, ticket, ticket.contact);
        }
    };
    const botList = async () => {
        if (!(0, lodash_1.isNil)(queue) && !(0, lodash_1.isNil)(ticket.queueOptionId) && messageBody == "#") {
            // falar com atendente
            await ticket.update({ queueOptionId: null, chatbot: false });
            const sentMessage = await wbot.sendMessage(`${ticket.contact.number}@${ticket.isGroup ? "g.us" : "s.whatsapp.net"}`, {
                text: "\u200eAguarde, você será atendido em instantes."
            });
            (0, exports.verifyMessage)(sentMessage, ticket, ticket.contact);
            return;
        }
        else if (!(0, lodash_1.isNil)(queue) &&
            !(0, lodash_1.isNil)(ticket.queueOptionId) &&
            messageBody == "0") {
            // voltar para o menu anterior
            const option = await QueueOption_1.default.findByPk(ticket.queueOptionId);
            await ticket.update({ queueOptionId: option?.parentId });
        }
        else if (!(0, lodash_1.isNil)(queue) && !(0, lodash_1.isNil)(ticket.queueOptionId)) {
            // escolheu uma opção
            const count = await QueueOption_1.default.count({
                where: { parentId: ticket.queueOptionId }
            });
            let option = {};
            if (count == 1) {
                option = await QueueOption_1.default.findOne({
                    where: { parentId: ticket.queueOptionId }
                });
            }
            else {
                option = await QueueOption_1.default.findOne({
                    where: {
                        option: messageBody || "",
                        parentId: ticket.queueOptionId
                    }
                });
            }
            if (option) {
                await ticket.update({ queueOptionId: option?.id });
            }
        }
        else if (!(0, lodash_1.isNil)(queue) &&
            (0, lodash_1.isNil)(ticket.queueOptionId) &&
            !dontReadTheFirstQuestion) {
            // não linha a primeira pergunta
            const option = queue?.options.find(o => o.option == messageBody);
            if (option) {
                await ticket.update({ queueOptionId: option?.id });
            }
        }
        await ticket.reload();
        if (!(0, lodash_1.isNil)(queue) && (0, lodash_1.isNil)(ticket.queueOptionId)) {
            const sectionsRows = [];
            let body = "";
            let options = "";
            const queueOptions = await QueueOption_1.default.findAll({
                where: { queueId: ticket.queueId, parentId: null },
                order: [
                    ["option", "ASC"],
                    ["createdAt", "ASC"]
                ]
            });
            if (queue.greetingMessage) {
                body = `${queue.greetingMessage}\n\n`;
            }
            queueOptions.forEach((option, i) => {
                sectionsRows.push({
                    title: option.title,
                    rowId: `${option.option}`
                });
            });
            sectionsRows.push({
                title: "Voltar Menu Inicial",
                rowId: `#`
            });
            const sections = [
                {
                    rows: sectionsRows
                }
            ];
            const listMessage = {
                text: (0, Mustache_1.default)(`\u200e${queue.greetingMessage}`, ticket.contact),
                buttonText: "Escolha uma opção",
                sections
            };
            const sendMsg = await wbot.sendMessage(`${ticket.contact.number}@${ticket.isGroup ? "g.us" : "s.whatsapp.net"}`, listMessage);
            await (0, exports.verifyMessage)(sendMsg, ticket, ticket.contact);
        }
        else if (!(0, lodash_1.isNil)(queue) && !(0, lodash_1.isNil)(ticket.queueOptionId)) {
            const currentOption = await QueueOption_1.default.findByPk(ticket.queueOptionId);
            const queueOptions = await QueueOption_1.default.findAll({
                where: { parentId: ticket.queueOptionId },
                order: [
                    ["option", "ASC"],
                    ["createdAt", "ASC"]
                ]
            });
            let sectionsRows = [];
            let body = "";
            let initialMessage = "";
            if (queueOptions.length > 1) {
                if (!(0, lodash_1.isNil)(currentOption?.message) && currentOption?.message !== "") {
                    initialMessage = `${currentOption?.message}`;
                    body += initialMessage;
                }
                if (queueOptions.length == 0) {
                    sectionsRows.push({
                        title: "Voltar Menu Inicial",
                        rowId: `#`
                    });
                }
                queueOptions.forEach(option => {
                    sectionsRows.push({
                        title: option.title,
                        rowId: `${option.option}`
                    });
                });
                /* if (options !== "") {
                  body += options;
                } */
                sectionsRows.push({
                    title: "Voltar",
                    rowId: `0`
                });
                sectionsRows.push({
                    title: "Menu Inicial",
                    rowId: `#`
                });
                //body += aditionalOptions;
            }
            else {
                const firstOption = (0, lodash_1.head)(queueOptions);
                if (firstOption) {
                    body = `${firstOption?.title}`;
                    if (firstOption?.message) {
                        body += `\n\n${firstOption.message}`;
                    }
                    sectionsRows.push({
                        title: "Voltar",
                        rowId: `0`
                    });
                    sectionsRows.push({
                        title: "Menu Inicial",
                        rowId: `#`
                    });
                }
                else {
                    sectionsRows.push({
                        title: "Voltar",
                        rowId: `0`
                    });
                    sectionsRows.push({
                        title: "Menu Inicial",
                        rowId: `#`
                    });
                }
            }
            const sections = [
                {
                    rows: sectionsRows
                }
            ];
            const listMessage = {
                text: (0, Mustache_1.default)(`\u200e${body}`, ticket.contact),
                buttonText: "Escolha uma opção",
                sections
            };
            const sendMsg = await wbot.sendMessage(`${ticket.contact.number}@${ticket.isGroup ? "g.us" : "s.whatsapp.net"}`, listMessage);
            await (0, exports.verifyMessage)(sendMsg, ticket, ticket.contact);
        }
    };
    const botButton = async () => {
        if (!(0, lodash_1.isNil)(queue) && !(0, lodash_1.isNil)(ticket.queueOptionId) && messageBody == "#") {
            // falar com atendente
            await ticket.update({ queueOptionId: null, chatbot: false });
            const sentMessage = await wbot.sendMessage(`${ticket.contact.number}@${ticket.isGroup ? "g.us" : "s.whatsapp.net"}`, {
                text: "\u200eAguarde, você será atendido em instantes."
            });
            (0, exports.verifyMessage)(sentMessage, ticket, ticket.contact);
            return;
        }
        else if (!(0, lodash_1.isNil)(queue) &&
            !(0, lodash_1.isNil)(ticket.queueOptionId) &&
            messageBody == "0") {
            // voltar para o menu anterior
            const option = await QueueOption_1.default.findByPk(ticket.queueOptionId);
            await ticket.update({ queueOptionId: option?.parentId });
        }
        else if (!(0, lodash_1.isNil)(queue) && !(0, lodash_1.isNil)(ticket.queueOptionId)) {
            // escolheu uma opção
            const count = await QueueOption_1.default.count({
                where: { parentId: ticket.queueOptionId }
            });
            let option = {};
            if (count == 1) {
                option = await QueueOption_1.default.findOne({
                    where: { parentId: ticket.queueOptionId }
                });
            }
            else {
                option = await QueueOption_1.default.findOne({
                    where: {
                        option: messageBody || "",
                        parentId: ticket.queueOptionId
                    }
                });
            }
            if (option) {
                await ticket.update({ queueOptionId: option?.id });
            }
        }
        else if (!(0, lodash_1.isNil)(queue) &&
            (0, lodash_1.isNil)(ticket.queueOptionId) &&
            !dontReadTheFirstQuestion) {
            // não linha a primeira pergunta
            const option = queue?.options.find(o => o.option == messageBody);
            if (option) {
                await ticket.update({ queueOptionId: option?.id });
            }
        }
        await ticket.reload();
        if (!(0, lodash_1.isNil)(queue) && (0, lodash_1.isNil)(ticket.queueOptionId)) {
            const buttons = [];
            let body = "";
            let options = "";
            const queueOptions = await QueueOption_1.default.findAll({
                where: { queueId: ticket.queueId, parentId: null },
                order: [
                    ["option", "ASC"],
                    ["createdAt", "ASC"]
                ]
            });
            if (queue.greetingMessage) {
                body = `${queue.greetingMessage}\n\n`;
            }
            queueOptions.forEach((option, i) => {
                buttons.push({
                    buttonId: `${option.option}`,
                    buttonText: { displayText: option.title },
                    type: 4
                });
            });
            buttons.push({
                buttonId: `#`,
                buttonText: { displayText: "Voltar Menu Inicial" },
                type: 4
            });
            const buttonMessage = {
                text: (0, Mustache_1.default)(`\u200e${queue.greetingMessage}`, ticket.contact),
                buttons,
                headerType: 4
            };
            const sendMsg = await wbot.sendMessage(`${ticket.contact.number}@${ticket.isGroup ? "g.us" : "s.whatsapp.net"}`, buttonMessage);
            await (0, exports.verifyMessage)(sendMsg, ticket, ticket.contact);
        }
        else if (!(0, lodash_1.isNil)(queue) && !(0, lodash_1.isNil)(ticket.queueOptionId)) {
            const currentOption = await QueueOption_1.default.findByPk(ticket.queueOptionId);
            const queueOptions = await QueueOption_1.default.findAll({
                where: { parentId: ticket.queueOptionId },
                order: [
                    ["option", "ASC"],
                    ["createdAt", "ASC"]
                ]
            });
            const buttons = [];
            let sectionsRows = [];
            let body = "";
            let initialMessage = "";
            if (queueOptions.length > 1) {
                if (!(0, lodash_1.isNil)(currentOption?.message) && currentOption?.message !== "") {
                    initialMessage = `${currentOption?.message}`;
                    body += initialMessage;
                }
                if (queueOptions.length == 0) {
                    buttons.push({
                        buttonId: `#`,
                        buttonText: { displayText: "Voltar Menu Inicial" },
                        type: 4
                    });
                }
                queueOptions.forEach(option => {
                    buttons.push({
                        buttonId: `${option.option}`,
                        buttonText: { displayText: option.title },
                        type: 4
                    });
                });
                /* if (options !== "") {
                  body += options;
                } */
                buttons.push({
                    buttonId: `0`,
                    buttonText: { displayText: "Voltar" },
                    type: 4
                });
                buttons.push({
                    buttonId: `#`,
                    buttonText: { displayText: "Voltar Menu Inicial" },
                    type: 4
                });
                //body += aditionalOptions;
            }
            else {
                const firstOption = (0, lodash_1.head)(queueOptions);
                if (firstOption) {
                    body = `${firstOption?.title}`;
                    if (firstOption?.message) {
                        body += `\n\n${firstOption.message}`;
                    }
                    buttons.push({
                        buttonId: `0`,
                        buttonText: { displayText: "Voltar" },
                        type: 4
                    });
                    buttons.push({
                        buttonId: `#`,
                        buttonText: { displayText: "Voltar Menu Inicial" },
                        type: 4
                    });
                }
                else {
                    buttons.push({
                        buttonId: `0`,
                        buttonText: { displayText: "Voltar" },
                        type: 4
                    });
                    buttons.push({
                        buttonId: `#`,
                        buttonText: { displayText: "Voltar Menu Inicial" },
                        type: 4
                    });
                }
            }
            const sections = [
                {
                    rows: sectionsRows
                }
            ];
            const buttonMessage = {
                text: (0, Mustache_1.default)(`\u200e${body}`, ticket.contact),
                buttons,
                headerType: 4
            };
            const sendMsg = await wbot.sendMessage(`${ticket.contact.number}@${ticket.isGroup ? "g.us" : "s.whatsapp.net"}`, buttonMessage);
            await (0, exports.verifyMessage)(sendMsg, ticket, ticket.contact);
        }
    };
    if (buttonActive.value === "list") {
        return botList();
    }
    if (buttonActive.value === "button" && QueueOption_1.default.length <= 4) {
        return botButton();
    }
    if (buttonActive.value === "text") {
        return botText();
    }
    if (buttonActive.value === "button" && QueueOption_1.default.length > 4) {
        return botText();
    }
    if (!(0, lodash_1.isNil)(queue) && (0, lodash_1.isNil)(ticket.queueOptionId)) {
        let body = "";
        let options = "";
        const queueOptions = await QueueOption_1.default.findAll({
            where: { queueId: ticket.queueId, parentId: null },
            order: [
                ["option", "ASC"],
                ["createdAt", "ASC"]
            ]
        });
        if (queue.greetingMessage) {
            body = `${queue.greetingMessage}\n\n`;
        }
        queueOptions.forEach((option, i) => {
            if (queueOptions.length - 1 > i) {
                options += `*${option.option}* - ${option.title}\n`;
            }
            else {
                options += `*${option.option}* - ${option.title}`;
            }
        });
        if (options !== "") {
            body += options;
        }
        body += "\n\n*#* - *Menu inicial*";
        const debouncedSentMessage = (0, Debounce_1.debounce)(async () => {
            const sentMessage = await wbot.sendMessage(`${ticket.contact.number}@${ticket.isGroup ? "g.us" : "s.whatsapp.net"}`, {
                text: body
            });
            (0, exports.verifyMessage)(sentMessage, ticket, ticket.contact);
        }, 3000, ticket.id);
        debouncedSentMessage();
    }
    else if (!(0, lodash_1.isNil)(queue) && !(0, lodash_1.isNil)(ticket.queueOptionId)) {
        const currentOption = await QueueOption_1.default.findByPk(ticket.queueOptionId);
        const queueOptions = await QueueOption_1.default.findAll({
            where: { parentId: ticket.queueOptionId },
            order: [
                ["option", "ASC"],
                ["createdAt", "ASC"]
            ]
        });
        let body = "";
        let options = "";
        let initialMessage = "";
        let aditionalOptions = "\n";
        if (queueOptions.length > 1) {
            if (!(0, lodash_1.isNil)(currentOption?.message) && currentOption?.message !== "") {
                initialMessage = `${currentOption?.message}\n\n`;
                body += initialMessage;
            }
            if (queueOptions.length == 0) {
                aditionalOptions = `*#* - *Falar com o atendente*\n`;
            }
            queueOptions.forEach(option => {
                options += `*${option.option}* - ${option.title}\n`;
            });
            if (options !== "") {
                body += options;
            }
            aditionalOptions += "*0* - *Voltar*\n";
            aditionalOptions += "*#* - *Menu inicial*";
            body += aditionalOptions;
        }
        else {
            const firstOption = (0, lodash_1.head)(queueOptions);
            if (firstOption) {
                body = `${firstOption?.title}`;
                if (firstOption?.message) {
                    body += `\n\n${firstOption.message}`;
                }
            }
            else {
                body = `*#* - *Falar com o atendente*\n\n`;
                body += `*0* - *Voltar*\n`;
                body += `*#* - *Menu inicial*`;
            }
        }
        const debouncedSentMessage = (0, Debounce_1.debounce)(async () => {
            const sentMessage = await wbot.sendMessage(`${ticket.contact.number}@${ticket.isGroup ? "g.us" : "s.whatsapp.net"}`, {
                text: body
            });
            (0, exports.verifyMessage)(sentMessage, ticket, ticket.contact);
        }, 3000, ticket.id);
        debouncedSentMessage();
    }
};
const getChat = async (whatsapp, msg) => {
    try {
        const countMessageUnread = await (0, ShowBaileysChatService_1.ShowBaileysChatService)(whatsapp.id, msg.key.remoteJid);
        return countMessageUnread.unreadCount;
    }
    catch (error) {
        return 0;
    }
};
const handleMessage = async (msg, wbot, companyId) => {
    if (!isValidMsg(msg))
        return;
    try {
        let msgContact;
        let groupContact;
        const isGroup = msg.key.remoteJid?.endsWith("@g.us");
        const msgIsGroupBlock = await Setting_1.default.findOne({
            where: {
                companyId,
                key: "CheckMsgIsGroup"
            }
        });
        const bodyMessage = (0, exports.getBodyMessage)(msg);
        const msgType = getTypeMessage(msg);
        const hasMedia = msg.message?.audioMessage ||
            msg.message?.imageMessage ||
            msg.message?.videoMessage ||
            msg.message?.documentMessage ||
            msg.message.stickerMessage;
        if (msg.key.fromMe) {
            if (/\u200e/.test(bodyMessage))
                return;
            if (!hasMedia &&
                msgType !== "conversation" &&
                msgType !== "extendedTextMessage" &&
                msgType !== "vcard")
                return;
            msgContact = await getContactMessage(msg, wbot);
        }
        else {
            msgContact = await getContactMessage(msg, wbot);
        }
        if (msgIsGroupBlock?.value === "enabled" && isGroup)
            return;
        if (isGroup) {
            const grupoMeta = await wbot.groupMetadata(msg.key.remoteJid);
            const msgGroupContact = {
                id: grupoMeta.id,
                name: grupoMeta.subject
            };
            groupContact = await verifyContact(msgGroupContact, wbot, companyId);
        }
        const whatsapp = await (0, ShowWhatsAppService_1.default)(wbot.id, companyId);
        const countMessageUnread = await getChat(whatsapp, msg);
        const unreadMessages = msg.key.fromMe ? 0 : countMessageUnread;
        const contact = await verifyContact(msgContact, wbot, companyId);
        if (unreadMessages === 0 &&
            whatsapp.farewellMessage &&
            (0, Mustache_1.default)(whatsapp.farewellMessage, contact) === bodyMessage)
            return;
        const ticket = await (0, FindOrCreateTicketService_1.default)(contact, whatsapp.id, unreadMessages, companyId, groupContact);
        /////INTEGRAÇÕES
        const filaescolhida = ticket.queue?.name;
        if (filaescolhida === "2ª Via de Boleto" ||
            filaescolhida === "2 Via de Boleto") {
            let cpfcnpj;
            cpfcnpj = (0, exports.getBodyMessage)(msg);
            cpfcnpj = cpfcnpj.replace(/\./g, "");
            cpfcnpj = cpfcnpj.replace("-", "");
            cpfcnpj = cpfcnpj.replace("/", "");
            cpfcnpj = cpfcnpj.replace(" ", "");
            cpfcnpj = cpfcnpj.replace(",", "");
            const asaastoken = await Setting_1.default.findOne({
                where: {
                    key: "asaas",
                    companyId
                }
            });
            const ixcapikey = await Setting_1.default.findOne({
                where: {
                    key: "tokenixc",
                    companyId
                }
            });
            const urlixcdb = await Setting_1.default.findOne({
                where: {
                    key: "ipixc",
                    companyId
                }
            });
            const ipmkauth = await Setting_1.default.findOne({
                where: {
                    key: "ipmkauth",
                    companyId
                }
            });
            const clientidmkauth = await Setting_1.default.findOne({
                where: {
                    key: "clientidmkauth",
                    companyId
                }
            });
            const clientesecretmkauth = await Setting_1.default.findOne({
                where: {
                    key: "clientsecretmkauth",
                    companyId
                }
            });
            let urlmkauth = ipmkauth.value;
            if (urlmkauth.substr(-1) === "/") {
                urlmkauth = urlmkauth.slice(0, -1);
            }
            //VARS
            let url = `${urlmkauth}/api/`;
            const Client_Id = clientidmkauth.value;
            const Client_Secret = clientesecretmkauth.value;
            const ixckeybase64 = btoa(ixcapikey.value);
            const urlixc = urlixcdb.value;
            const asaastk = asaastoken.value;
            const cnpj_cpf = (0, exports.getBodyMessage)(msg);
            let numberCPFCNPJ = cpfcnpj;
            if (urlmkauth != "" && Client_Id != "" && Client_Secret != "") {
                if (isNumeric(numberCPFCNPJ) === true) {
                    if (cpfcnpj.length > 2) {
                        const isCPFCNPJ = validaCpfCnpj(numberCPFCNPJ);
                        if (isCPFCNPJ) {
                            const textMessage = {
                                text: (0, Mustache_1.default)(`Aguarde! Estamos consultando na base de dados!`, contact)
                            };
                            try {
                                await sleep(2000);
                                await wbot.sendMessage(`${ticket.contact.number}@${ticket.isGroup ? "g.us" : "s.whatsapp.net"}`, textMessage);
                            }
                            catch (error) {
                                //console.log('Não consegui enviar a mensagem!')
                            }
                            axios({
                                rejectUnauthorized: true,
                                method: "get",
                                url,
                                auth: {
                                    username: Client_Id,
                                    password: Client_Secret
                                }
                            })
                                .then(function (response) {
                                const jtw = response.data;
                                var config = {
                                    method: "GET",
                                    url: `${urlmkauth}/api/cliente/show/${numberCPFCNPJ}`,
                                    headers: {
                                        Authorization: `Bearer ${jtw}`
                                    }
                                };
                                axios
                                    .request(config)
                                    .then(async function (response) {
                                    if (response.data == "NULL") {
                                        const textMessage = {
                                            text: (0, Mustache_1.default)(`Cadastro não localizado! *CPF/CNPJ* incorreto ou inválido. Tenta novamente!`, contact)
                                        };
                                        try {
                                            await sleep(2000);
                                            await wbot.sendMessage(`${ticket.contact.number}@${ticket.isGroup ? "g.us" : "s.whatsapp.net"}`, textMessage);
                                        }
                                        catch (error) {
                                            console.log("Não consegui enviar a mensagem!");
                                        }
                                    }
                                    else {
                                        let nome;
                                        let cpf_cnpj;
                                        let qrcode;
                                        let valor;
                                        let bloqueado;
                                        let linhadig;
                                        let uuid_cliente;
                                        let referencia;
                                        let status;
                                        let datavenc;
                                        let descricao;
                                        let titulo;
                                        let statusCorrigido;
                                        let valorCorrigido;
                                        nome = response.data.dados_cliente.titulos.nome;
                                        cpf_cnpj = response.data.dados_cliente.titulos.cpf_cnpj;
                                        valor = response.data.dados_cliente.titulos.valor;
                                        bloqueado =
                                            response.data.dados_cliente.titulos.bloqueado;
                                        uuid_cliente =
                                            response.data.dados_cliente.titulos.uuid_cliente;
                                        qrcode = response.data.dados_cliente.titulos.qrcode;
                                        linhadig = response.data.dados_cliente.titulos.linhadig;
                                        referencia =
                                            response.data.dados_cliente.titulos.referencia;
                                        status = response.data.dados_cliente.titulos.status;
                                        datavenc = response.data.dados_cliente.titulos.datavenc;
                                        descricao =
                                            response.data.dados_cliente.titulos.descricao;
                                        titulo = response.data.dados_cliente.titulos.titulo;
                                        statusCorrigido =
                                            status[0].toUpperCase() + status.substr(1);
                                        valorCorrigido = valor.replace(".", ",");
                                        var curdate = new Date(datavenc);
                                        const mesCorreto = curdate.getMonth() + 1;
                                        const ano = ("0" + curdate.getFullYear()).slice(-4);
                                        const mes = ("0" + mesCorreto).slice(-2);
                                        const dia = ("0" + curdate.getDate()).slice(-2);
                                        const anoMesDia = `${dia}/${mes}/${ano}`;
                                        try {
                                            const textMessage = {
                                                text: (0, Mustache_1.default)(`Localizei seu Cadastro! *${nome}* só mais um instante por favor!`, contact)
                                            };
                                            await wbot.sendMessage(`${ticket.contact.number}@${ticket.isGroup ? "g.us" : "s.whatsapp.net"}`, textMessage);
                                            const bodyBoleto = {
                                                text: (0, Mustache_1.default)(`Segue a segunda-via da sua Fatura!\n\n*Nome:* ${nome}\n*Valor:* R$ ${valorCorrigido}\n*Data Vencimento:* ${anoMesDia}\n*Link:* ${urlmkauth}/boleto/21boleto.php?titulo=${titulo}\n\nVou mandar o *código de barras* na próxima mensagem para ficar mais fácil para você copiar!`, contact)
                                            };
                                            await sleep(2000);
                                            await wbot.sendMessage(`${ticket.contact.number}@${ticket.isGroup ? "g.us" : "s.whatsapp.net"}`, bodyBoleto);
                                            const bodyLinha = {
                                                text: (0, Mustache_1.default)(`${linhadig}`, contact)
                                            };
                                            await sleep(2000);
                                            await wbot.sendMessage(`${ticket.contact.number}@${ticket.isGroup ? "g.us" : "s.whatsapp.net"}`, bodyLinha);
                                            if (qrcode !== null) {
                                                const bodyPdf = {
                                                    text: (0, Mustache_1.default)(`Este é o *PIX COPIA E COLA*`, contact)
                                                };
                                                await sleep(2000);
                                                await wbot.sendMessage(`${ticket.contact.number}@${ticket.isGroup ? "g.us" : "s.whatsapp.net"}`, bodyPdf);
                                                const bodyqrcode = {
                                                    text: (0, Mustache_1.default)(`${qrcode}`, contact)
                                                };
                                                await sleep(2000);
                                                await wbot.sendMessage(`${ticket.contact.number}@${ticket.isGroup ? "g.us" : "s.whatsapp.net"}`, bodyqrcode);
                                                let linkBoleto = `https://chart.googleapis.com/chart?cht=qr&chs=500x500&chld=L|0&chl=${qrcode}`;
                                                await sleep(2000);
                                                await sendMessageImage(wbot, contact, ticket, linkBoleto, "");
                                            }
                                            const bodyPdf = {
                                                text: (0, Mustache_1.default)(`Agora vou te enviar o boleto em *PDF* caso você precise.`, contact)
                                            };
                                            await sleep(2000);
                                            const bodyPdfQr = {
                                                text: (0, Mustache_1.default)(`${bodyPdf}`, contact)
                                            };
                                            await wbot.sendMessage(`${ticket.contact.number}@${ticket.isGroup ? "g.us" : "s.whatsapp.net"}`, bodyPdfQr);
                                            await sleep(2000);
                                            //GERA O PDF
                                            const nomePDF = `Boleto-${nome}-${dia}-${mes}-${ano}.pdf`;
                                            async () => {
                                                const browser = await puppeteer.launch({
                                                    args: ["--no-sandbox"]
                                                });
                                                const page = await browser.newPage();
                                                const website_url = `${urlmkauth}/boleto/21boleto.php?titulo=${titulo}`;
                                                await page.goto(website_url, {
                                                    waitUntil: "networkidle0"
                                                });
                                                await page.emulateMediaType("screen");
                                                // Downlaod the PDF
                                                const pdf = await page.pdf({
                                                    path: nomePDF,
                                                    printBackground: true,
                                                    format: "A4"
                                                });
                                                await browser.close();
                                                await sendMessageLink(wbot, contact, ticket, nomePDF, nomePDF);
                                            };
                                            if (bloqueado === "sim") {
                                                const bodyBloqueio = {
                                                    text: (0, Mustache_1.default)(`${nome} vi tambem que a sua conexão esta bloqueada! Vou desbloquear para você por *48 horas*.`, contact)
                                                };
                                                await sleep(2000);
                                                await wbot.sendMessage(`${ticket.contact.number}@${ticket.isGroup ? "g.us" : "s.whatsapp.net"}`, bodyBloqueio);
                                                const bodyqrcode = {
                                                    text: (0, Mustache_1.default)(`Estou liberando seu acesso. Por favor aguarde!`, contact)
                                                };
                                                await sleep(2000);
                                                await wbot.sendMessage(`${ticket.contact.number}@${ticket.isGroup ? "g.us" : "s.whatsapp.net"}`, bodyqrcode);
                                                var optionsdesbloq = {
                                                    method: "GET",
                                                    url: `${urlmkauth}/api/cliente/desbloqueio/${uuid_cliente}`,
                                                    headers: {
                                                        Authorization: `Bearer ${jtw}`
                                                    }
                                                };
                                                axios
                                                    .request(optionsdesbloq)
                                                    .then(async function (response) {
                                                    const bodyLiberado = {
                                                        text: (0, Mustache_1.default)(`Pronto liberei! Vou precisar que você *retire* seu equipamento da tomada.\n\n*OBS: Somente retire da tomada.* \nAguarde 1 minuto e ligue novamente!`, contact)
                                                    };
                                                    await sleep(2000);
                                                    await wbot.sendMessage(`${ticket.contact.number}@${ticket.isGroup ? "g.us" : "s.whatsapp.net"}`, bodyLiberado);
                                                    const bodyqrcode = {
                                                        text: (0, Mustache_1.default)(`Veja se seu acesso voltou! Caso nao tenha voltado retorne o contato e fale com um atendente!`, contact)
                                                    };
                                                    await sleep(2000);
                                                    await wbot.sendMessage(`${ticket.contact.number}@${ticket.isGroup ? "g.us" : "s.whatsapp.net"}`, bodyqrcode);
                                                })
                                                    .catch(async function (error) {
                                                    const bodyfinaliza = {
                                                        text: (0, Mustache_1.default)(`Opss! Algo de errado aconteceu! Digite *#* para voltar ao menu anterior e fale com um atendente!`, contact)
                                                    };
                                                    await wbot.sendMessage(`${ticket.contact.number}@${ticket.isGroup ? "g.us" : "s.whatsapp.net"}`, bodyfinaliza);
                                                });
                                            }
                                            const bodyfinaliza = {
                                                text: (0, Mustache_1.default)(`Estamos finalizando esta conversa! Caso precise entre em contato conosco!`, contact)
                                            };
                                            await sleep(12000);
                                            await wbot.sendMessage(`${ticket.contact.number}@${ticket.isGroup ? "g.us" : "s.whatsapp.net"}`, bodyfinaliza);
                                            await sleep(2000);
                                            fs.unlink(nomePDF, function (err) {
                                                if (err)
                                                    throw err;
                                                console.log(err);
                                            });
                                            await (0, UpdateTicketService_1.default)({
                                                ticketData: { status: "closed" },
                                                ticketId: ticket.id,
                                                companyId: ticket.companyId
                                            });
                                        }
                                        catch (error) {
                                            console.log("11 Não consegui enviar a mensagem!");
                                        }
                                    }
                                })
                                    .catch(async function (error) {
                                    try {
                                        const bodyBoleto = {
                                            text: (0, Mustache_1.default)(`Não consegui encontrar seu cadastro.\n\nPor favor tente novamente!\nOu digite *#* para voltar ao *Menu Anterior*`, contact)
                                        };
                                        await sleep(2000);
                                        await wbot.sendMessage(`${ticket.contact.number}@${ticket.isGroup ? "g.us" : "s.whatsapp.net"}`, bodyBoleto);
                                    }
                                    catch (error) {
                                        console.log("111 Não consegui enviar a mensagem!");
                                    }
                                });
                            })
                                .catch(async function (error) {
                                const bodyfinaliza = {
                                    text: (0, Mustache_1.default)(`Opss! Algo de errado aconteceu! Digite *#* para voltar ao menu anterior e fale com um atendente!`, contact)
                                };
                                await wbot.sendMessage(`${ticket.contact.number}@${ticket.isGroup ? "g.us" : "s.whatsapp.net"}`, bodyfinaliza);
                            });
                        }
                        else {
                            const body = {
                                text: (0, Mustache_1.default)(`Este CPF/CNPJ não é válido!\n\nPor favor tente novamente!\nOu digite *#* para voltar ao *Menu Anterior*`, contact)
                            };
                            await sleep(2000);
                            await wbot.sendMessage(`${ticket.contact.number}@${ticket.isGroup ? "g.us" : "s.whatsapp.net"}`, body);
                        }
                    }
                }
            }
            if (asaastoken.value !== "") {
                if (isNumeric(numberCPFCNPJ) === true) {
                    if (cpfcnpj.length > 2) {
                        const isCPFCNPJ = validaCpfCnpj(numberCPFCNPJ);
                        if (isCPFCNPJ) {
                            const body = {
                                text: (0, Mustache_1.default)(`Aguarde! Estamos consultando na base de dados!`, contact)
                            };
                            try {
                                await sleep(2000);
                                await wbot.sendMessage(`${ticket.contact.number}@${ticket.isGroup ? "g.us" : "s.whatsapp.net"}`, body);
                            }
                            catch (error) {
                                //console.log('Não consegui enviar a mensagem!')
                            }
                            var optionsc = {
                                method: "GET",
                                url: "https://www.asaas.com/api/v3/customers",
                                params: { cpfCnpj: numberCPFCNPJ },
                                headers: {
                                    "Content-Type": "application/json",
                                    access_token: asaastk
                                }
                            };
                            axios
                                .request(optionsc)
                                .then(async function (response) {
                                let nome;
                                let id_cliente;
                                let totalCount;
                                nome = response?.data?.data[0]?.name;
                                id_cliente = response?.data?.data[0]?.id;
                                totalCount = response?.data?.totalCount;
                                if (totalCount === 0) {
                                    const body = {
                                        text: (0, Mustache_1.default)(`Cadastro não localizado! *CPF/CNPJ* incorreto ou inválido. Tenta novamente!`, contact)
                                    };
                                    await sleep(2000);
                                    await wbot.sendMessage(`${ticket.contact.number}@${ticket.isGroup ? "g.us" : "s.whatsapp.net"}`, body);
                                }
                                else {
                                    const body = {
                                        text: (0, Mustache_1.default)(`Localizei seu Cadastro! \n*${nome}* só mais um instante por favor!`, contact)
                                    };
                                    await sleep(2000);
                                    await wbot.sendMessage(`${ticket.contact.number}@${ticket.isGroup ? "g.us" : "s.whatsapp.net"}`, body);
                                    var optionsListpaymentOVERDUE = {
                                        method: "GET",
                                        url: "https://www.asaas.com/api/v3/payments",
                                        params: { customer: id_cliente, status: "OVERDUE" },
                                        headers: {
                                            "Content-Type": "application/json",
                                            access_token: asaastk
                                        }
                                    };
                                    axios
                                        .request(optionsListpaymentOVERDUE)
                                        .then(async function (response) {
                                        let totalCount_overdue;
                                        totalCount_overdue = response?.data?.totalCount;
                                        if (totalCount_overdue === 0) {
                                            const body = {
                                                text: (0, Mustache_1.default)(`Você não tem nenhuma fatura vencidada! \nVou te enviar a proxima fatura. Por favor aguarde!`, contact)
                                            };
                                            await sleep(2000);
                                            await wbot.sendMessage(`${ticket.contact.number}@${ticket.isGroup ? "g.us" : "s.whatsapp.net"}`, body);
                                            var optionsPENDING = {
                                                method: "GET",
                                                url: "https://www.asaas.com/api/v3/payments",
                                                params: { customer: id_cliente, status: "PENDING" },
                                                headers: {
                                                    "Content-Type": "application/json",
                                                    access_token: asaastk
                                                }
                                            };
                                            axios
                                                .request(optionsPENDING)
                                                .then(async function (response) {
                                                function sortfunction(a, b) {
                                                    return a.dueDate.localeCompare(b.dueDate);
                                                }
                                                const ordenado = response?.data?.data.sort(sortfunction);
                                                let id_payment_pending;
                                                let value_pending;
                                                let description_pending;
                                                let invoiceUrl_pending;
                                                let dueDate_pending;
                                                let invoiceNumber_pending;
                                                let totalCount_pending;
                                                let value_pending_corrigida;
                                                let dueDate_pending_corrigida;
                                                id_payment_pending = ordenado[0]?.id;
                                                value_pending = ordenado[0]?.value;
                                                description_pending = ordenado[0]?.description;
                                                invoiceUrl_pending = ordenado[0]?.invoiceUrl;
                                                dueDate_pending = ordenado[0]?.dueDate;
                                                invoiceNumber_pending =
                                                    ordenado[0]?.invoiceNumber;
                                                totalCount_pending = response?.data?.totalCount;
                                                dueDate_pending_corrigida = dueDate_pending
                                                    ?.split("-")
                                                    ?.reverse()
                                                    ?.join("/");
                                                value_pending_corrigida =
                                                    value_pending.toLocaleString("pt-br", {
                                                        style: "currency",
                                                        currency: "BRL"
                                                    });
                                                const bodyBoleto = {
                                                    text: (0, Mustache_1.default)(`Segue a segunda-via da sua Fatura!\n\n*Fatura:* ${invoiceNumber_pending}\n*Nome:* ${nome}\n*Valor:* R$ ${value_pending_corrigida}\n*Data Vencimento:* ${dueDate_pending_corrigida}\n*Descrição:*\n${description_pending}\n*Link:* ${invoiceUrl_pending}`, contact)
                                                };
                                                await sleep(2000);
                                                await wbot.sendMessage(`${ticket.contact.number}@${ticket.isGroup ? "g.us" : "s.whatsapp.net"}`, bodyBoleto);
                                                //GET DADOS PIX
                                                var optionsGetPIX = {
                                                    method: "GET",
                                                    url: `https://www.asaas.com/api/v3/payments/${id_payment_pending}/pixQrCode`,
                                                    headers: {
                                                        "Content-Type": "application/json",
                                                        access_token: asaastk
                                                    }
                                                };
                                                axios
                                                    .request(optionsGetPIX)
                                                    .then(async function (response) {
                                                    let success;
                                                    let payload;
                                                    success = response?.data?.success;
                                                    payload = response?.data?.payload;
                                                    if (success === true) {
                                                        const bodyPixCP = {
                                                            text: (0, Mustache_1.default)(`Este é o *PIX Copia e Cola*`, contact)
                                                        };
                                                        await sleep(2000);
                                                        await wbot.sendMessage(`${ticket.contact.number}@${ticket.isGroup
                                                            ? "g.us"
                                                            : "s.whatsapp.net"}`, bodyPixCP);
                                                        const bodyPix = {
                                                            text: (0, Mustache_1.default)(`${payload}`, contact)
                                                        };
                                                        await sleep(2000);
                                                        await wbot.sendMessage(`${ticket.contact.number}@${ticket.isGroup
                                                            ? "g.us"
                                                            : "s.whatsapp.net"}`, bodyPix);
                                                        let linkBoleto = `https://chart.googleapis.com/chart?cht=qr&chs=500x500&chld=L|0&chl=${payload}`;
                                                        await sleep(2000);
                                                        await sendMessageImage(wbot, contact, ticket, linkBoleto, "");
                                                        var optionsBoletopend = {
                                                            method: "GET",
                                                            url: `https://www.asaas.com/api/v3/payments/${id_payment_pending}/identificationField`,
                                                            headers: {
                                                                "Content-Type": "application/json",
                                                                access_token: asaastk
                                                            }
                                                        };
                                                        axios
                                                            .request(optionsBoletopend)
                                                            .then(async function (response) {
                                                            let codigo_barras;
                                                            codigo_barras =
                                                                response.data.identificationField;
                                                            const bodycodigoBarras = {
                                                                text: (0, Mustache_1.default)(`${codigo_barras}`, contact)
                                                            };
                                                            if (response.data?.errors?.code !==
                                                                "invalid_action") {
                                                                const bodycodigo = {
                                                                    text: (0, Mustache_1.default)(`Este é o *Código de Barras*!`, contact)
                                                                };
                                                                await sleep(2000);
                                                                await wbot.sendMessage(`${ticket.contact.number}@${ticket.isGroup
                                                                    ? "g.us"
                                                                    : "s.whatsapp.net"}`, bodycodigo);
                                                                await sleep(2000);
                                                                await wbot.sendMessage(`${ticket.contact.number}@${ticket.isGroup
                                                                    ? "g.us"
                                                                    : "s.whatsapp.net"}`, bodycodigoBarras);
                                                                const bodyfinaliza = {
                                                                    text: (0, Mustache_1.default)(`Estamos finalizando esta conversa! Caso precise entre em contato conosco!`, contact)
                                                                };
                                                                await sleep(2000);
                                                                await wbot.sendMessage(`${ticket.contact.number}@${ticket.isGroup
                                                                    ? "g.us"
                                                                    : "s.whatsapp.net"}`, bodyfinaliza);
                                                                await sleep(2000);
                                                                await (0, UpdateTicketService_1.default)({
                                                                    ticketData: { status: "closed" },
                                                                    ticketId: ticket.id,
                                                                    companyId: ticket.companyId
                                                                });
                                                            }
                                                            else {
                                                                const bodyfinaliza = {
                                                                    text: (0, Mustache_1.default)(`Estamos finalizando esta conversa! Caso precise entre em contato conosco!`, contact)
                                                                };
                                                                await sleep(2000);
                                                                await wbot.sendMessage(`${ticket.contact.number}@${ticket.isGroup
                                                                    ? "g.us"
                                                                    : "s.whatsapp.net"}`, bodyfinaliza);
                                                                await (0, UpdateTicketService_1.default)({
                                                                    ticketData: { status: "closed" },
                                                                    ticketId: ticket.id,
                                                                    companyId: ticket.companyId
                                                                });
                                                            }
                                                        })
                                                            .catch(async function (error) {
                                                            const bodyfinaliza = {
                                                                text: (0, Mustache_1.default)(`Estamos finalizando esta conversa! Caso precise entre em contato conosco!`, contact)
                                                            };
                                                            await sleep(2000);
                                                            await wbot.sendMessage(`${ticket.contact.number}@${ticket.isGroup
                                                                ? "g.us"
                                                                : "s.whatsapp.net"}`, bodyfinaliza);
                                                            await (0, UpdateTicketService_1.default)({
                                                                ticketData: { status: "closed" },
                                                                ticketId: ticket.id,
                                                                companyId: ticket.companyId
                                                            });
                                                        });
                                                    }
                                                })
                                                    .catch(async function (error) {
                                                    const body = {
                                                        text: (0, Mustache_1.default)(`*Opss!!!!*\nOcorreu um erro! Digite *#* e fale com um *Atendente*!`, contact)
                                                    };
                                                    await sleep(2000);
                                                    await wbot.sendMessage(`${ticket.contact.number}@${ticket.isGroup ? "g.us" : "s.whatsapp.net"}`, body);
                                                });
                                            })
                                                .catch(async function (error) {
                                                const body = {
                                                    text: (0, Mustache_1.default)(`*Opss!!!!*\nOcorreu um erro! Digite *#* e fale com um *Atendente*!`, contact)
                                                };
                                                await sleep(2000);
                                                await wbot.sendMessage(`${ticket.contact.number}@${ticket.isGroup ? "g.us" : "s.whatsapp.net"}`, body);
                                            });
                                        }
                                        else {
                                            let id_payment_overdue;
                                            let value_overdue;
                                            let description_overdue;
                                            let invoiceUrl_overdue;
                                            let dueDate_overdue;
                                            let invoiceNumber_overdue;
                                            let value_overdue_corrigida;
                                            let dueDate_overdue_corrigida;
                                            id_payment_overdue = response?.data?.data[0]?.id;
                                            value_overdue = response?.data?.data[0]?.value;
                                            description_overdue =
                                                response?.data?.data[0]?.description;
                                            invoiceUrl_overdue =
                                                response?.data?.data[0]?.invoiceUrl;
                                            dueDate_overdue = response?.data?.data[0]?.dueDate;
                                            invoiceNumber_overdue =
                                                response?.data?.data[0]?.invoiceNumber;
                                            dueDate_overdue_corrigida = dueDate_overdue
                                                ?.split("-")
                                                ?.reverse()
                                                ?.join("/");
                                            value_overdue_corrigida =
                                                value_overdue.toLocaleString("pt-br", {
                                                    style: "currency",
                                                    currency: "BRL"
                                                });
                                            const body = {
                                                text: (0, Mustache_1.default)(`Você tem *${totalCount_overdue}* fatura(s) vencidada(s)! \nVou te enviar. Por favor aguarde!`, contact)
                                            };
                                            await sleep(2000);
                                            await wbot.sendMessage(`${ticket.contact.number}@${ticket.isGroup ? "g.us" : "s.whatsapp.net"}`, body);
                                            const bodyBoleto = {
                                                text: (0, Mustache_1.default)(`Segue a segunda-via da sua Fatura!\n\n*Fatura:* ${invoiceNumber_overdue}\n*Nome:* ${nome}\n*Valor:* R$ ${value_overdue_corrigida}\n*Data Vencimento:* ${dueDate_overdue_corrigida}\n*Descrição:*\n${description_overdue}\n*Link:* ${invoiceUrl_overdue}`, contact)
                                            };
                                            await sleep(2000);
                                            await wbot.sendMessage(`${ticket.contact.number}@${ticket.isGroup ? "g.us" : "s.whatsapp.net"}`, bodyBoleto);
                                            //GET DADOS PIX
                                            var optionsGetPIX = {
                                                method: "GET",
                                                url: `https://www.asaas.com/api/v3/payments/${id_payment_overdue}/pixQrCode`,
                                                headers: {
                                                    "Content-Type": "application/json",
                                                    access_token: asaastk
                                                }
                                            };
                                            axios
                                                .request(optionsGetPIX)
                                                .then(async function (response) {
                                                let success;
                                                let payload;
                                                success = response?.data?.success;
                                                payload = response?.data?.payload;
                                                if (success === true) {
                                                    const bodyPixCP = {
                                                        text: (0, Mustache_1.default)(`Este é o *PIX Copia e Cola*`, contact)
                                                    };
                                                    await sleep(2000);
                                                    await wbot.sendMessage(`${ticket.contact.number}@${ticket.isGroup ? "g.us" : "s.whatsapp.net"}`, bodyPixCP);
                                                    const bodyPix = {
                                                        text: (0, Mustache_1.default)(`${payload}`, contact)
                                                    };
                                                    await sleep(2000);
                                                    await wbot.sendMessage(`${ticket.contact.number}@${ticket.isGroup ? "g.us" : "s.whatsapp.net"}`, bodyPix);
                                                    let linkBoleto = `https://chart.googleapis.com/chart?cht=qr&chs=500x500&chld=L|0&chl=${payload}`;
                                                    await sleep(2000);
                                                    await sendMessageImage(wbot, contact, ticket, linkBoleto, "");
                                                    var optionsBoleto = {
                                                        method: "GET",
                                                        url: `https://www.asaas.com/api/v3/payments/${id_payment_overdue}/identificationField`,
                                                        headers: {
                                                            "Content-Type": "application/json",
                                                            access_token: asaastk
                                                        }
                                                    };
                                                    axios
                                                        .request(optionsBoleto)
                                                        .then(async function (response) {
                                                        let codigo_barras;
                                                        codigo_barras =
                                                            response.data.identificationField;
                                                        const bodycodigoBarras = {
                                                            text: (0, Mustache_1.default)(`${codigo_barras}`, contact)
                                                        };
                                                        if (response.data?.errors?.code !==
                                                            "invalid_action") {
                                                            const bodycodigo = {
                                                                text: (0, Mustache_1.default)(`Este é o *Código de Barras*!`, contact)
                                                            };
                                                            await sleep(2000);
                                                            await wbot.sendMessage(`${ticket.contact.number}@${ticket.isGroup
                                                                ? "g.us"
                                                                : "s.whatsapp.net"}`, bodycodigo);
                                                            await sleep(2000);
                                                            await wbot.sendMessage(`${ticket.contact.number}@${ticket.isGroup
                                                                ? "g.us"
                                                                : "s.whatsapp.net"}`, bodycodigoBarras);
                                                            const bodyfinaliza = {
                                                                text: (0, Mustache_1.default)(`Estamos finalizando esta conversa! Caso precise entre em contato conosco!`, contact)
                                                            };
                                                            await sleep(2000);
                                                            await wbot.sendMessage(`${ticket.contact.number}@${ticket.isGroup
                                                                ? "g.us"
                                                                : "s.whatsapp.net"}`, bodyfinaliza);
                                                            await (0, UpdateTicketService_1.default)({
                                                                ticketData: { status: "closed" },
                                                                ticketId: ticket.id,
                                                                companyId: ticket.companyId
                                                            });
                                                        }
                                                        else {
                                                            const bodyfinaliza = {
                                                                text: (0, Mustache_1.default)(`Estamos finalizando esta conversa! Caso precise entre em contato conosco!`, contact)
                                                            };
                                                            await sleep(2000);
                                                            await wbot.sendMessage(`${ticket.contact.number}@${ticket.isGroup
                                                                ? "g.us"
                                                                : "s.whatsapp.net"}`, bodyfinaliza);
                                                            await (0, UpdateTicketService_1.default)({
                                                                ticketData: { status: "closed" },
                                                                ticketId: ticket.id,
                                                                companyId: ticket.companyId
                                                            });
                                                        }
                                                    })
                                                        .catch(function (error) {
                                                        //console.error(error);
                                                    });
                                                }
                                            })
                                                .catch(function (error) { });
                                        }
                                    })
                                        .catch(async function (error) {
                                        const body = {
                                            text: (0, Mustache_1.default)(`*Opss!!!!*\nOcorreu um erro! Digite *#* e fale com um *Atendente*!`, contact)
                                        };
                                        await sleep(2000);
                                        await wbot.sendMessage(`${ticket.contact.number}@${ticket.isGroup ? "g.us" : "s.whatsapp.net"}`, body);
                                    });
                                }
                            })
                                .catch(async function (error) {
                                const body = {
                                    text: (0, Mustache_1.default)(`*Opss!!!!*\nOcorreu um erro! Digite *#* e fale com um *Atendente*!`, contact)
                                };
                                await sleep(2000);
                                await wbot.sendMessage(`${ticket.contact.number}@${ticket.isGroup ? "g.us" : "s.whatsapp.net"}`, body);
                            });
                        }
                    }
                }
            }
            if (ixcapikey.value != "" && urlixcdb.value != "") {
                if (isNumeric(numberCPFCNPJ) === true) {
                    if (cpfcnpj.length > 2) {
                        const isCPFCNPJ = validaCpfCnpj(numberCPFCNPJ);
                        if (isCPFCNPJ) {
                            if (numberCPFCNPJ.length <= 11) {
                                numberCPFCNPJ = numberCPFCNPJ.replace(/(\d{3})(\d)/, "$1.$2");
                                numberCPFCNPJ = numberCPFCNPJ.replace(/(\d{3})(\d)/, "$1.$2");
                                numberCPFCNPJ = numberCPFCNPJ.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
                            }
                            else {
                                numberCPFCNPJ = numberCPFCNPJ.replace(/^(\d{2})(\d)/, "$1.$2");
                                numberCPFCNPJ = numberCPFCNPJ.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3");
                                numberCPFCNPJ = numberCPFCNPJ.replace(/\.(\d{3})(\d)/, ".$1/$2");
                                numberCPFCNPJ = numberCPFCNPJ.replace(/(\d{4})(\d)/, "$1-$2");
                            }
                            //const token = await CheckSettingsHelper("OBTEM O TOKEN DO BANCO (dei insert na tabela settings)")
                            const body = {
                                text: (0, Mustache_1.default)(`Aguarde! Estamos consultando na base de dados!`, contact)
                            };
                            try {
                                await sleep(2000);
                                await wbot.sendMessage(`${ticket.contact.number}@${ticket.isGroup ? "g.us" : "s.whatsapp.net"}`, body);
                            }
                            catch (error) {
                                //console.log('Não consegui enviar a mensagem!')
                            }
                            var options = {
                                method: "GET",
                                url: `${urlixc}/webservice/v1/cliente`,
                                headers: {
                                    ixcsoft: "listar",
                                    Authorization: `Basic ${ixckeybase64}`
                                },
                                data: {
                                    qtype: "cliente.cnpj_cpf",
                                    query: numberCPFCNPJ,
                                    oper: "=",
                                    page: "1",
                                    rp: "1",
                                    sortname: "cliente.cnpj_cpf",
                                    sortorder: "asc"
                                }
                            };
                            let teste = axios
                                .request(options)
                                .then(async function (response) {
                                if (response.data.type === "error") {
                                    const body = {
                                        text: (0, Mustache_1.default)(`*Opss!!!!*\nOcorreu um erro! Digite *#* e fale com um *Atendente*!`, contact)
                                    };
                                    await sleep(2000);
                                    await wbot.sendMessage(`${ticket.contact.number}@${ticket.isGroup ? "g.us" : "s.whatsapp.net"}`, body);
                                }
                                if (response.data.total === 0) {
                                    const body = {
                                        text: (0, Mustache_1.default)(`Cadastro não localizado! *CPF/CNPJ* incorreto ou inválido. Tenta novamente!`, contact)
                                    };
                                    try {
                                        await sleep(2000);
                                        await wbot.sendMessage(`${ticket.contact.number}@${ticket.isGroup ? "g.us" : "s.whatsapp.net"}`, body);
                                    }
                                    catch (error) {
                                        //console.log('Não consegui enviar a mensagem!')
                                    }
                                }
                                else {
                                    let nome;
                                    let id;
                                    let type;
                                    nome = response.data?.registros[0]?.razao;
                                    id = response.data?.registros[0]?.id;
                                    type = response.data?.type;
                                    const body = {
                                        text: (0, Mustache_1.default)(`Localizei seu Cadastro! \n*${nome}* só mais um instante por favor!`, contact)
                                    };
                                    await sleep(2000);
                                    await wbot.sendMessage(`${ticket.contact.number}@${ticket.isGroup ? "g.us" : "s.whatsapp.net"}`, body);
                                    var boleto = {
                                        method: "GET",
                                        url: `${urlixc}/webservice/v1/fn_areceber`,
                                        headers: {
                                            ixcsoft: "listar",
                                            Authorization: `Basic ${ixckeybase64}`
                                        },
                                        data: {
                                            qtype: "fn_areceber.id_cliente",
                                            query: id,
                                            oper: "=",
                                            page: "1",
                                            rp: "1",
                                            sortname: "fn_areceber.data_vencimento",
                                            sortorder: "asc",
                                            grid_param: '[{"TB":"fn_areceber.status", "OP" : "=", "P" : "A"}]'
                                        }
                                    };
                                    axios
                                        .request(boleto)
                                        .then(async function (response) {
                                        let gateway_link;
                                        let valor;
                                        let datavenc;
                                        let datavencCorrigida;
                                        let valorCorrigido;
                                        let linha_digitavel;
                                        let impresso;
                                        let idboleto;
                                        idboleto = response.data?.registros[0]?.id;
                                        gateway_link =
                                            response.data?.registros[0]?.gateway_link;
                                        valor = response.data?.registros[0]?.valor;
                                        datavenc = response.data?.registros[0]?.data_vencimento;
                                        linha_digitavel =
                                            response.data?.registros[0]?.linha_digitavel;
                                        impresso = response.data?.registros[0]?.impresso;
                                        valorCorrigido = valor.replace(".", ",");
                                        datavencCorrigida = datavenc
                                            .split("-")
                                            .reverse()
                                            .join("/");
                                        //console.log(response.data?.registros[0])
                                        //INFORMAÇÕES BOLETO
                                        const bodyBoleto = {
                                            text: (0, Mustache_1.default)(`Segue a segunda-via da sua Fatura!\n\n*Fatura:* ${idboleto}\n*Nome:* ${nome}\n*Valor:* R$ ${valorCorrigido}\n*Data Vencimento:* ${datavencCorrigida}\n\nVou mandar o *código de barras* na próxima mensagem para ficar mais fácil para você copiar!`, contact)
                                        };
                                        //await sleep(2000)
                                        //await wbot.sendMessage(`${ticket.contact.number}@${ticket.isGroup ? "g.us" : "s.whatsapp.net"}`, bodyBoleto);
                                        //LINHA DIGITAVEL
                                        if (impresso !== "S") {
                                            //IMPRIME BOLETO PARA GERAR CODIGO BARRAS
                                            var boletopdf = {
                                                method: "GET",
                                                url: `${urlixc}/webservice/v1/get_boleto`,
                                                headers: {
                                                    ixcsoft: "listar",
                                                    Authorization: `Basic ${ixckeybase64}`
                                                },
                                                data: {
                                                    boletos: idboleto,
                                                    juro: "N",
                                                    multa: "N",
                                                    atualiza_boleto: "N",
                                                    tipo_boleto: "arquivo",
                                                    base64: "S"
                                                }
                                            };
                                            axios
                                                .request(boletopdf)
                                                .then(function (response) { })
                                                .catch(function (error) {
                                                console.error(error);
                                            });
                                        }
                                        //SE TIVER PIX ENVIA O PIX
                                        var optionsPix = {
                                            method: "GET",
                                            url: `${urlixc}/webservice/v1/get_pix`,
                                            headers: {
                                                ixcsoft: "listar",
                                                Authorization: `Basic ${ixckeybase64}`
                                            },
                                            data: { id_areceber: idboleto }
                                        };
                                        axios
                                            .request(optionsPix)
                                            .then(async function (response) {
                                            let tipo;
                                            let pix;
                                            tipo = response.data?.type;
                                            pix = response.data?.pix?.qrCode?.qrcode;
                                            if (tipo === "success") {
                                                const bodyBoletoPix = {
                                                    text: (0, Mustache_1.default)(`Segue a segunda-via da sua Fatura!\n\n*Fatura:* ${idboleto}\n*Nome:* ${nome}\n*Valor:* R$ ${valorCorrigido}\n*Data Vencimento:* ${datavencCorrigida}\n\nVou te enviar o *Código de Barras* e o *PIX* basta clicar em qual você quer utlizar que já vai copiar! Depois basta realizar o pagamento no seu banco`, contact)
                                                };
                                                await wbot.sendMessage(`${ticket.contact.number}@${ticket.isGroup ? "g.us" : "s.whatsapp.net"}`, bodyBoletoPix);
                                                const body_linhadigitavel = {
                                                    text: (0, Mustache_1.default)("Este é o *Código de Barras*", contact)
                                                };
                                                await sleep(2000);
                                                await wbot.sendMessage(`${ticket.contact.number}@${ticket.isGroup ? "g.us" : "s.whatsapp.net"}`, body_linhadigitavel);
                                                await sleep(2000);
                                                const body_linha_digitavel = {
                                                    text: (0, Mustache_1.default)(`${linha_digitavel}`, contact)
                                                };
                                                await wbot.sendMessage(`${ticket.contact.number}@${ticket.isGroup ? "g.us" : "s.whatsapp.net"}`, body_linha_digitavel);
                                                const body_pix = {
                                                    text: (0, Mustache_1.default)("Este é o *PIX Copia e Cola*", contact)
                                                };
                                                await sleep(2000);
                                                await wbot.sendMessage(`${ticket.contact.number}@${ticket.isGroup ? "g.us" : "s.whatsapp.net"}`, body_pix);
                                                await sleep(2000);
                                                const body_pix_dig = {
                                                    text: (0, Mustache_1.default)(`${pix}`, contact)
                                                };
                                                await wbot.sendMessage(`${ticket.contact.number}@${ticket.isGroup ? "g.us" : "s.whatsapp.net"}`, body_pix_dig);
                                                const body_pixqr = {
                                                    text: (0, Mustache_1.default)("QR CODE do *PIX*", contact)
                                                };
                                                await sleep(2000);
                                                await wbot.sendMessage(`${ticket.contact.number}@${ticket.isGroup ? "g.us" : "s.whatsapp.net"}`, body_pixqr);
                                                let linkBoleto = `https://chart.googleapis.com/chart?cht=qr&chs=500x500&chld=L|0&chl=${pix}`;
                                                await sleep(2000);
                                                await sendMessageImage(wbot, contact, ticket, linkBoleto, "");
                                                ///VE SE ESTA BLOQUEADO PARA LIBERAR!
                                                var optionscontrato = {
                                                    method: "POST",
                                                    url: `${urlixc}/webservice/v1/cliente_contrato`,
                                                    headers: {
                                                        ixcsoft: "listar",
                                                        Authorization: `Basic ${ixckeybase64}`
                                                    },
                                                    data: {
                                                        qtype: "cliente_contrato.id_cliente",
                                                        query: id,
                                                        oper: "=",
                                                        page: "1",
                                                        rp: "1",
                                                        sortname: "cliente_contrato.id",
                                                        sortorder: "asc"
                                                    }
                                                };
                                                axios
                                                    .request(optionscontrato)
                                                    .then(async function (response) {
                                                    let status_internet;
                                                    let id_contrato;
                                                    status_internet =
                                                        response.data?.registros[0]
                                                            ?.status_internet;
                                                    id_contrato = response.data?.registros[0]?.id;
                                                    if (status_internet !== "A") {
                                                        const bodyPdf = {
                                                            text: (0, Mustache_1.default)(`*${nome}* vi tambem que a sua conexão esta bloqueada! Vou desbloquear para você.`, contact)
                                                        };
                                                        await sleep(2000);
                                                        await wbot.sendMessage(`${ticket.contact.number}@${ticket.isGroup
                                                            ? "g.us"
                                                            : "s.whatsapp.net"}`, bodyPdf);
                                                        const bodyqrcode = {
                                                            text: (0, Mustache_1.default)(`Estou liberando seu acesso. Por favor aguarde!`, contact)
                                                        };
                                                        await sleep(2000);
                                                        await wbot.sendMessage(`${ticket.contact.number}@${ticket.isGroup
                                                            ? "g.us"
                                                            : "s.whatsapp.net"}`, bodyqrcode);
                                                        //REALIZANDO O DESBLOQUEIO
                                                        var optionsdesbloqeuio = {
                                                            method: "POST",
                                                            url: `${urlixc}/webservice/v1/desbloqueio_confianca`,
                                                            headers: {
                                                                Authorization: `Basic ${ixckeybase64}`
                                                            },
                                                            data: { id: id_contrato }
                                                        };
                                                        axios
                                                            .request(optionsdesbloqeuio)
                                                            .then(async function (response) {
                                                            let tipo;
                                                            let mensagem;
                                                            tipo = response.data?.tipo;
                                                            mensagem = response.data?.mensagem;
                                                            if (tipo === "sucesso") {
                                                                //DESCONECTANDO O CLIENTE PARA VOLTAR O ACESSO
                                                                var optionsRadius = {
                                                                    method: "GET",
                                                                    url: `${urlixc}/webservice/v1/radusuarios`,
                                                                    headers: {
                                                                        ixcsoft: "listar",
                                                                        Authorization: `Basic ${ixckeybase64}`
                                                                    },
                                                                    data: {
                                                                        qtype: "radusuarios.id_cliente",
                                                                        query: id,
                                                                        oper: "=",
                                                                        page: "1",
                                                                        rp: "1",
                                                                        sortname: "radusuarios.id",
                                                                        sortorder: "asc"
                                                                    }
                                                                };
                                                                axios
                                                                    .request(optionsRadius)
                                                                    .then(async function (response) {
                                                                    let tipo;
                                                                    tipo = response.data?.type;
                                                                    if (tipo === "success") {
                                                                        const body_mensagem = {
                                                                            text: (0, Mustache_1.default)(`${mensagem}`, contact)
                                                                        };
                                                                        await sleep(2000);
                                                                        await wbot.sendMessage(`${ticket.contact.number}@${ticket.isGroup
                                                                            ? "g.us"
                                                                            : "s.whatsapp.net"}`, body_mensagem);
                                                                        const bodyPdf = {
                                                                            text: (0, Mustache_1.default)(`Fiz os procedimentos de liberação! Agora aguarde até 5 minutos e veja se sua conexão irá retornar! .\n\nCaso não tenha voltado, retorne o contato e fale com um atendente!`, contact)
                                                                        };
                                                                        await sleep(2000);
                                                                        await wbot.sendMessage(`${ticket.contact.number}@${ticket.isGroup
                                                                            ? "g.us"
                                                                            : "s.whatsapp.net"}`, bodyPdf);
                                                                        const bodyfinaliza = {
                                                                            text: (0, Mustache_1.default)(`Estamos finalizando esta conversa! Caso precise entre em contato conosco!`, contact)
                                                                        };
                                                                        await sleep(2000);
                                                                        await wbot.sendMessage(`${ticket.contact.number}@${ticket.isGroup
                                                                            ? "g.us"
                                                                            : "s.whatsapp.net"}`, bodyfinaliza);
                                                                        await (0, UpdateTicketService_1.default)({
                                                                            ticketData: {
                                                                                status: "closed"
                                                                            },
                                                                            ticketId: ticket.id,
                                                                            companyId: ticket.companyId
                                                                        });
                                                                    }
                                                                })
                                                                    .catch(function (error) {
                                                                    console.error(error);
                                                                });
                                                                //FIM DA DESCONEXÃO
                                                            }
                                                            else {
                                                                var msgerrolbieracao = response.data.mensagem;
                                                                const bodyerro = {
                                                                    text: (0, Mustache_1.default)(`Ops! Ocorreu um erro e nao consegui desbloquear`, contact)
                                                                };
                                                                const msg_errolbieracao = {
                                                                    text: (0, Mustache_1.default)(`${msgerrolbieracao}`, contact)
                                                                };
                                                                await sleep(2000);
                                                                await wbot.sendMessage(`${ticket.contact.number}@${ticket.isGroup
                                                                    ? "g.us"
                                                                    : "s.whatsapp.net"}`, bodyerro);
                                                                await sleep(2000);
                                                                await wbot.sendMessage(`${ticket.contact.number}@${ticket.isGroup
                                                                    ? "g.us"
                                                                    : "s.whatsapp.net"}`, msg_errolbieracao);
                                                                const bodyerroatendent = {
                                                                    text: (0, Mustache_1.default)(`Digite *#* para voltar o menu e fale com um atendente!`, contact)
                                                                };
                                                                await sleep(2000);
                                                                await wbot.sendMessage(`${ticket.contact.number}@${ticket.isGroup
                                                                    ? "g.us"
                                                                    : "s.whatsapp.net"}`, bodyerroatendent);
                                                            }
                                                        })
                                                            .catch(async function (error) {
                                                            const bodyerro = {
                                                                text: (0, Mustache_1.default)(`Ops! Ocorreu um erro digite *#* e fale com um atendente!`, contact)
                                                            };
                                                            await sleep(2000);
                                                            await wbot.sendMessage(`${ticket.contact.number}@${ticket.isGroup
                                                                ? "g.us"
                                                                : "s.whatsapp.net"}`, bodyerro);
                                                        });
                                                    }
                                                    else {
                                                        const bodyfinaliza = {
                                                            text: (0, Mustache_1.default)(`Estamos finalizando esta conversa! Caso precise entre em contato conosco!`, contact)
                                                        };
                                                        await sleep(8000);
                                                        await wbot.sendMessage(`${ticket.contact.number}@${ticket.isGroup
                                                            ? "g.us"
                                                            : "s.whatsapp.net"}`, bodyfinaliza);
                                                        await (0, UpdateTicketService_1.default)({
                                                            ticketData: { status: "closed" },
                                                            ticketId: ticket.id,
                                                            companyId: ticket.companyId
                                                        });
                                                    }
                                                    //
                                                })
                                                    .catch(async function (error) {
                                                    const bodyerro = {
                                                        text: (0, Mustache_1.default)(`Ops! Ocorreu um erro digite *#* e fale com um atendente!`, contact)
                                                    };
                                                    await sleep(2000);
                                                    await wbot.sendMessage(`${ticket.contact.number}@${ticket.isGroup ? "g.us" : "s.whatsapp.net"}`, bodyerro);
                                                });
                                                ///VE SE ESTA BLOQUEADO PARA LIBERAR!
                                            }
                                            else {
                                                const bodyBoleto = {
                                                    text: (0, Mustache_1.default)(`Segue a segunda-via da sua Fatura!\n\n*Fatura:* ${idboleto}\n*Nome:* ${nome}\n*Valor:* R$ ${valorCorrigido}\n*Data Vencimento:* ${datavencCorrigida}\n\nBasta clicar aqui em baixo em código de barras para copiar, apos isto basta realizar o pagamento em seu banco!`, contact)
                                                };
                                                await sleep(2000);
                                                await wbot.sendMessage(`${ticket.contact.number}@${ticket.isGroup ? "g.us" : "s.whatsapp.net"}`, bodyBoleto);
                                                const body = {
                                                    text: (0, Mustache_1.default)(`Este é o *Codigo de Barras*`, contact)
                                                };
                                                await sleep(2000);
                                                await wbot.sendMessage(`${ticket.contact.number}@${ticket.isGroup ? "g.us" : "s.whatsapp.net"}`, body);
                                                await sleep(2000);
                                                const body_linha_digitavel = {
                                                    text: (0, Mustache_1.default)(`${linha_digitavel}`, contact)
                                                };
                                                await wbot.sendMessage(`${ticket.contact.number}@${ticket.isGroup ? "g.us" : "s.whatsapp.net"}`, body_linha_digitavel);
                                                ///VE SE ESTA BLOQUEADO PARA LIBERAR!
                                                var optionscontrato = {
                                                    method: "POST",
                                                    url: `${urlixc}/webservice/v1/cliente_contrato`,
                                                    headers: {
                                                        ixcsoft: "listar",
                                                        Authorization: `Basic ${ixckeybase64}`
                                                    },
                                                    data: {
                                                        qtype: "cliente_contrato.id_cliente",
                                                        query: id,
                                                        oper: "=",
                                                        page: "1",
                                                        rp: "1",
                                                        sortname: "cliente_contrato.id",
                                                        sortorder: "asc"
                                                    }
                                                };
                                                axios
                                                    .request(optionscontrato)
                                                    .then(async function (response) {
                                                    let status_internet;
                                                    let id_contrato;
                                                    status_internet =
                                                        response.data?.registros[0]
                                                            ?.status_internet;
                                                    id_contrato = response.data?.registros[0]?.id;
                                                    if (status_internet !== "A") {
                                                        const bodyPdf = {
                                                            text: (0, Mustache_1.default)(`*${nome}* vi tambem que a sua conexão esta bloqueada! Vou desbloquear para você.`, contact)
                                                        };
                                                        await sleep(2000);
                                                        await wbot.sendMessage(`${ticket.contact.number}@${ticket.isGroup
                                                            ? "g.us"
                                                            : "s.whatsapp.net"}`, bodyPdf);
                                                        const bodyqrcode = {
                                                            text: (0, Mustache_1.default)(`Estou liberando seu acesso. Por favor aguarde!`, contact)
                                                        };
                                                        await sleep(2000);
                                                        await wbot.sendMessage(`${ticket.contact.number}@${ticket.isGroup
                                                            ? "g.us"
                                                            : "s.whatsapp.net"}`, bodyqrcode);
                                                        //REALIZANDO O DESBLOQUEIO
                                                        var optionsdesbloqeuio = {
                                                            method: "POST",
                                                            url: `${urlixc}/webservice/v1/desbloqueio_confianca`,
                                                            headers: {
                                                                Authorization: `Basic ${ixckeybase64}`
                                                            },
                                                            data: { id: id_contrato }
                                                        };
                                                        axios
                                                            .request(optionsdesbloqeuio)
                                                            .then(async function (response) {
                                                            let tipo;
                                                            let mensagem;
                                                            tipo = response.data?.tipo;
                                                            mensagem = response.data?.mensagem;
                                                            if (tipo === "sucesso") {
                                                                //DESCONECTANDO O CLIENTE PARA VOLTAR O ACESSO
                                                                var optionsRadius = {
                                                                    method: "GET",
                                                                    url: `${urlixc}/webservice/v1/radusuarios`,
                                                                    headers: {
                                                                        ixcsoft: "listar",
                                                                        Authorization: `Basic ${ixckeybase64}`
                                                                    },
                                                                    data: {
                                                                        qtype: "radusuarios.id_cliente",
                                                                        query: id,
                                                                        oper: "=",
                                                                        page: "1",
                                                                        rp: "1",
                                                                        sortname: "radusuarios.id",
                                                                        sortorder: "asc"
                                                                    }
                                                                };
                                                                axios
                                                                    .request(optionsRadius)
                                                                    .then(async function (response) {
                                                                    let tipo;
                                                                    tipo = response.data?.type;
                                                                    const body_mensagem = {
                                                                        text: (0, Mustache_1.default)(`${mensagem}`, contact)
                                                                    };
                                                                    if (tipo === "success") {
                                                                        await sleep(2000);
                                                                        await wbot.sendMessage(`${ticket.contact.number}@${ticket.isGroup
                                                                            ? "g.us"
                                                                            : "s.whatsapp.net"}`, body_mensagem);
                                                                        const bodyPdf = {
                                                                            text: (0, Mustache_1.default)(`Fiz os procedimentos de liberação! Agora aguarde até 5 minutos e veja se sua conexão irá retornar! .\n\nCaso não tenha voltado, retorne o contato e fale com um atendente!`, contact)
                                                                        };
                                                                        await sleep(2000);
                                                                        await wbot.sendMessage(`${ticket.contact.number}@${ticket.isGroup
                                                                            ? "g.us"
                                                                            : "s.whatsapp.net"}`, bodyPdf);
                                                                        const bodyfinaliza = {
                                                                            text: (0, Mustache_1.default)(`Estamos finalizando esta conversa! Caso precise entre em contato conosco!`, contact)
                                                                        };
                                                                        await sleep(2000);
                                                                        await wbot.sendMessage(`${ticket.contact.number}@${ticket.isGroup
                                                                            ? "g.us"
                                                                            : "s.whatsapp.net"}`, bodyfinaliza);
                                                                        await (0, UpdateTicketService_1.default)({
                                                                            ticketData: {
                                                                                status: "closed"
                                                                            },
                                                                            ticketId: ticket.id,
                                                                            companyId: ticket.companyId
                                                                        });
                                                                    }
                                                                    else {
                                                                        await sleep(2000);
                                                                        await wbot.sendMessage(`${ticket.contact.number}@${ticket.isGroup
                                                                            ? "g.us"
                                                                            : "s.whatsapp.net"}`, body_mensagem);
                                                                        const bodyPdf = {
                                                                            text: (0, Mustache_1.default)(`Vou precisar que você *retire* seu equipamento da tomada.\n\n*OBS: Somente retire da tomada.* \nAguarde 1 minuto e ligue novamente!`, contact)
                                                                        };
                                                                        await sleep(2000);
                                                                        await wbot.sendMessage(`${ticket.contact.number}@${ticket.isGroup
                                                                            ? "g.us"
                                                                            : "s.whatsapp.net"}`, bodyPdf);
                                                                        const bodyqrcode = {
                                                                            text: (0, Mustache_1.default)(`Veja se seu acesso voltou! Caso não tenha voltado retorne o contato e fale com um atendente!`, contact)
                                                                        };
                                                                        await sleep(2000);
                                                                        await wbot.sendMessage(`${ticket.contact.number}@${ticket.isGroup
                                                                            ? "g.us"
                                                                            : "s.whatsapp.net"}`, bodyqrcode);
                                                                        const bodyfinaliza = {
                                                                            text: (0, Mustache_1.default)(`Estamos finalizando esta conversa! Caso precise entre em contato conosco!`, contact)
                                                                        };
                                                                        await sleep(2000);
                                                                        await wbot.sendMessage(`${ticket.contact.number}@${ticket.isGroup
                                                                            ? "g.us"
                                                                            : "s.whatsapp.net"}`, bodyfinaliza);
                                                                        await (0, UpdateTicketService_1.default)({
                                                                            ticketData: {
                                                                                status: "closed"
                                                                            },
                                                                            ticketId: ticket.id,
                                                                            companyId: ticket.companyId
                                                                        });
                                                                    }
                                                                })
                                                                    .catch(function (error) {
                                                                    console.error(error);
                                                                });
                                                                //FIM DA DESCONEXÃO
                                                            }
                                                            else {
                                                                const bodyerro = {
                                                                    text: (0, Mustache_1.default)(`Ops! Ocorreu um erro e nao consegui desbloquear! Digite *#* e fale com um atendente!`, contact)
                                                                };
                                                                await sleep(2000);
                                                                await wbot.sendMessage(`${ticket.contact.number}@${ticket.isGroup
                                                                    ? "g.us"
                                                                    : "s.whatsapp.net"}`, bodyerro);
                                                            }
                                                        })
                                                            .catch(async function (error) {
                                                            const bodyerro = {
                                                                text: (0, Mustache_1.default)(`Ops! Ocorreu um erro digite *#* e fale com um atendente!`, contact)
                                                            };
                                                            await sleep(2000);
                                                            await wbot.sendMessage(`${ticket.contact.number}@${ticket.isGroup
                                                                ? "g.us"
                                                                : "s.whatsapp.net"}`, bodyerro);
                                                        });
                                                    }
                                                    else {
                                                        const bodyfinaliza = {
                                                            text: (0, Mustache_1.default)(`Estamos finalizando esta conversa! Caso precise entre em contato conosco!`, contact)
                                                        };
                                                        await sleep(2000);
                                                        await wbot.sendMessage(`${ticket.contact.number}@${ticket.isGroup
                                                            ? "g.us"
                                                            : "s.whatsapp.net"}`, bodyfinaliza);
                                                        await (0, UpdateTicketService_1.default)({
                                                            ticketData: { status: "closed" },
                                                            ticketId: ticket.id,
                                                            companyId: ticket.companyId
                                                        });
                                                    }
                                                    //
                                                })
                                                    .catch(async function (error) {
                                                    const bodyerro = {
                                                        text: (0, Mustache_1.default)(`Ops! Ocorreu um erro digite *#* e fale com um atendente!`, contact)
                                                    };
                                                    await sleep(2000);
                                                    await wbot.sendMessage(`${ticket.contact.number}@${ticket.isGroup ? "g.us" : "s.whatsapp.net"}`, bodyerro);
                                                });
                                                ///VE SE ESTA BLOQUEADO PARA LIBERAR!
                                            }
                                        })
                                            .catch(function (error) {
                                            console.error(error);
                                        });
                                        //FIM DO PÌX
                                    })
                                        .catch(function (error) {
                                        console.error(error);
                                    });
                                }
                            })
                                .catch(async function (error) {
                                logger_1.logger.error(error.reason);
                                const body = {
                                    text: (0, Mustache_1.default)(`*Opss!!!!*\nOcorreu um erro! Digite *#* e fale com um *Atendente*!`, contact)
                                };
                                await sleep(2000);
                                await wbot.sendMessage(`${ticket.contact.number}@${ticket.isGroup ? "g.us" : "s.whatsapp.net"}`, body);
                            });
                        }
                        else {
                            const body = {
                                text: (0, Mustache_1.default)(`Este CPF/CNPJ não é válido!\n\nPor favor tente novamente!\nOu digite *#* para voltar ao *Menu Anterior*`, contact)
                            };
                            await sleep(2000);
                            await wbot.sendMessage(`${ticket.contact.number}@${ticket.isGroup ? "g.us" : "s.whatsapp.net"}`, body);
                        }
                    }
                }
            }
        }
        if (filaescolhida === "Religue de Confiança" ||
            filaescolhida === "Liberação em Confiança") {
            let cpfcnpj;
            cpfcnpj = (0, exports.getBodyMessage)(msg);
            cpfcnpj = cpfcnpj.replace(/\./g, "");
            cpfcnpj = cpfcnpj.replace("-", "");
            cpfcnpj = cpfcnpj.replace("/", "");
            cpfcnpj = cpfcnpj.replace(" ", "");
            cpfcnpj = cpfcnpj.replace(",", "");
            const asaastoken = await Setting_1.default.findOne({
                where: {
                    key: "asaas",
                    companyId
                }
            });
            const ixcapikey = await Setting_1.default.findOne({
                where: {
                    key: "tokenixc",
                    companyId
                }
            });
            const urlixcdb = await Setting_1.default.findOne({
                where: {
                    key: "ipixc",
                    companyId
                }
            });
            const ipmkauth = await Setting_1.default.findOne({
                where: {
                    key: "ipmkauth",
                    companyId
                }
            });
            const clientidmkauth = await Setting_1.default.findOne({
                where: {
                    key: "clientidmkauth",
                    companyId
                }
            });
            const clientesecretmkauth = await Setting_1.default.findOne({
                where: {
                    key: "clientsecretmkauth",
                    companyId
                }
            });
            let urlmkauth = ipmkauth.value;
            if (urlmkauth.substr(-1) === "/") {
                urlmkauth = urlmkauth.slice(0, -1);
            }
            //VARS
            let url = `${urlmkauth}/api/`;
            const Client_Id = clientidmkauth.value;
            const Client_Secret = clientesecretmkauth.value;
            const ixckeybase64 = btoa(ixcapikey.value);
            const urlixc = urlixcdb.value;
            const asaastk = asaastoken.value;
            const cnpj_cpf = (0, exports.getBodyMessage)(msg);
            let numberCPFCNPJ = cpfcnpj;
            if (ixcapikey.value != "" && urlixcdb.value != "") {
                if (isNumeric(numberCPFCNPJ) === true) {
                    if (cpfcnpj.length > 2) {
                        const isCPFCNPJ = validaCpfCnpj(numberCPFCNPJ);
                        if (isCPFCNPJ) {
                            if (numberCPFCNPJ.length <= 11) {
                                numberCPFCNPJ = numberCPFCNPJ.replace(/(\d{3})(\d)/, "$1.$2");
                                numberCPFCNPJ = numberCPFCNPJ.replace(/(\d{3})(\d)/, "$1.$2");
                                numberCPFCNPJ = numberCPFCNPJ.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
                            }
                            else {
                                numberCPFCNPJ = numberCPFCNPJ.replace(/^(\d{2})(\d)/, "$1.$2");
                                numberCPFCNPJ = numberCPFCNPJ.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3");
                                numberCPFCNPJ = numberCPFCNPJ.replace(/\.(\d{3})(\d)/, ".$1/$2");
                                numberCPFCNPJ = numberCPFCNPJ.replace(/(\d{4})(\d)/, "$1-$2");
                            }
                            //const token = await CheckSettingsHelper("OBTEM O TOKEN DO BANCO (dei insert na tabela settings)")
                            const body = {
                                text: (0, Mustache_1.default)(`Aguarde! Estamos consultando na base de dados!`, contact)
                            };
                            try {
                                await sleep(2000);
                                await wbot.sendMessage(`${ticket.contact.number}@${ticket.isGroup ? "g.us" : "s.whatsapp.net"}`, body);
                            }
                            catch (error) {
                                //console.log('Não consegui enviar a mensagem!')
                            }
                            var options = {
                                method: "GET",
                                url: `${urlixc}/webservice/v1/cliente`,
                                headers: {
                                    ixcsoft: "listar",
                                    Authorization: `Basic ${ixckeybase64}`
                                },
                                data: {
                                    qtype: "cliente.cnpj_cpf",
                                    query: numberCPFCNPJ,
                                    oper: "=",
                                    page: "1",
                                    rp: "1",
                                    sortname: "cliente.cnpj_cpf",
                                    sortorder: "asc"
                                }
                            };
                            axios
                                .request(options)
                                .then(async function (response) {
                                //console.log(response.data)
                                if (response.data.type === "error") {
                                    const body = {
                                        text: (0, Mustache_1.default)(`*Opss!!!!*\nOcorreu um erro! Digite *#* e fale com um *Atendente*!`, contact)
                                    };
                                    await sleep(2000);
                                    await wbot.sendMessage(`${ticket.contact.number}@${ticket.isGroup ? "g.us" : "s.whatsapp.net"}`, body);
                                }
                                if (response.data.total === 0) {
                                    const body = {
                                        text: (0, Mustache_1.default)(`Cadastro não localizado! *CPF/CNPJ* incorreto ou inválido. Tenta novamente!`, contact)
                                    };
                                    try {
                                        await sleep(2000);
                                        await wbot.sendMessage(`${ticket.contact.number}@${ticket.isGroup ? "g.us" : "s.whatsapp.net"}`, body);
                                    }
                                    catch (error) {
                                        //console.log('Não consegui enviar a mensagem!')
                                    }
                                }
                                else {
                                    let nome;
                                    let id;
                                    let type;
                                    nome = response.data?.registros[0]?.razao;
                                    id = response.data?.registros[0]?.id;
                                    type = response.data?.type;
                                    const body = {
                                        text: (0, Mustache_1.default)(`Localizei seu Cadastro! \n*${nome}* só mais um instante por favor!`, contact)
                                    };
                                    await sleep(2000);
                                    await wbot.sendMessage(`${ticket.contact.number}@${ticket.isGroup ? "g.us" : "s.whatsapp.net"}`, body);
                                    ///VE SE ESTA BLOQUEADO PARA LIBERAR!
                                    var optionscontrato = {
                                        method: "POST",
                                        url: `${urlixc}/webservice/v1/cliente_contrato`,
                                        headers: {
                                            ixcsoft: "listar",
                                            Authorization: `Basic ${ixckeybase64}`
                                        },
                                        data: {
                                            qtype: "cliente_contrato.id_cliente",
                                            query: id,
                                            oper: "=",
                                            page: "1",
                                            rp: "1",
                                            sortname: "cliente_contrato.id",
                                            sortorder: "asc"
                                        }
                                    };
                                    axios
                                        .request(optionscontrato)
                                        .then(async function (response) {
                                        let status_internet;
                                        let id_contrato;
                                        status_internet =
                                            response.data?.registros[0]?.status_internet;
                                        id_contrato = response.data?.registros[0]?.id;
                                        if (status_internet !== "A") {
                                            const bodyPdf = {
                                                text: (0, Mustache_1.default)(`*${nome}*  a sua conexão esta bloqueada! Vou desbloquear para você.`, contact)
                                            };
                                            await sleep(2000);
                                            await wbot.sendMessage(`${ticket.contact.number}@${ticket.isGroup ? "g.us" : "s.whatsapp.net"}`, bodyPdf);
                                            const bodyqrcode = {
                                                text: (0, Mustache_1.default)(`Estou liberando seu acesso. Por favor aguarde!`, contact)
                                            };
                                            await sleep(2000);
                                            await wbot.sendMessage(`${ticket.contact.number}@${ticket.isGroup ? "g.us" : "s.whatsapp.net"}`, bodyqrcode);
                                            //REALIZANDO O DESBLOQUEIO
                                            var optionsdesbloqeuio = {
                                                method: "POST",
                                                url: `${urlixc}/webservice/v1/desbloqueio_confianca`,
                                                headers: {
                                                    Authorization: `Basic ${ixckeybase64}`
                                                },
                                                data: { id: id_contrato }
                                            };
                                            axios
                                                .request(optionsdesbloqeuio)
                                                .then(async function (response) {
                                                let tipo;
                                                let mensagem;
                                                tipo = response.data?.tipo;
                                                mensagem = response.data?.mensagem;
                                                const body_mensagem = {
                                                    text: (0, Mustache_1.default)(`${mensagem}`, contact)
                                                };
                                                if (tipo === "sucesso") {
                                                    //DESCONECTANDO O CLIENTE PARA VOLTAR O ACESSO
                                                    var optionsRadius = {
                                                        method: "GET",
                                                        url: `${urlixc}/webservice/v1/radusuarios`,
                                                        headers: {
                                                            ixcsoft: "listar",
                                                            Authorization: `Basic ${ixckeybase64}`
                                                        },
                                                        data: {
                                                            qtype: "radusuarios.id_cliente",
                                                            query: id,
                                                            oper: "=",
                                                            page: "1",
                                                            rp: "1",
                                                            sortname: "radusuarios.id",
                                                            sortorder: "asc"
                                                        }
                                                    };
                                                    axios
                                                        .request(optionsRadius)
                                                        .then(async function (response) {
                                                        let tipo;
                                                        tipo = response.data?.type;
                                                        if (tipo === "success") {
                                                            await sleep(2000);
                                                            await wbot.sendMessage(`${ticket.contact.number}@${ticket.isGroup
                                                                ? "g.us"
                                                                : "s.whatsapp.net"}`, body_mensagem);
                                                            const bodyPdf = {
                                                                text: (0, Mustache_1.default)(`Fiz os procedimentos de liberação! Agora aguarde até 5 minutos e veja se sua conexão irá retornar! .\n\nCaso não tenha voltado, retorne o contato e fale com um atendente!`, contact)
                                                            };
                                                            await sleep(2000);
                                                            await wbot.sendMessage(`${ticket.contact.number}@${ticket.isGroup
                                                                ? "g.us"
                                                                : "s.whatsapp.net"}`, bodyPdf);
                                                            const bodyfinaliza = {
                                                                text: (0, Mustache_1.default)(`Estamos finalizando esta conversa! Caso precise entre em contato conosco!`, contact)
                                                            };
                                                            await sleep(2000);
                                                            await wbot.sendMessage(`${ticket.contact.number}@${ticket.isGroup
                                                                ? "g.us"
                                                                : "s.whatsapp.net"}`, bodyfinaliza);
                                                            await (0, UpdateTicketService_1.default)({
                                                                ticketData: { status: "closed" },
                                                                ticketId: ticket.id,
                                                                companyId: ticket.companyId
                                                            });
                                                        }
                                                        else {
                                                            await sleep(2000);
                                                            await wbot.sendMessage(`${ticket.contact.number}@${ticket.isGroup
                                                                ? "g.us"
                                                                : "s.whatsapp.net"}`, body_mensagem);
                                                            const bodyPdf = {
                                                                text: (0, Mustache_1.default)(`Vou precisar que você *retire* seu equipamento da tomada.\n\n*OBS: Somente retire da tomada.* \nAguarde 1 minuto e ligue novamente!`, contact)
                                                            };
                                                            await sleep(2000);
                                                            await wbot.sendMessage(`${ticket.contact.number}@${ticket.isGroup
                                                                ? "g.us"
                                                                : "s.whatsapp.net"}`, bodyPdf);
                                                            const bodyqrcode = {
                                                                text: (0, Mustache_1.default)(`Veja se seu acesso voltou! Caso não tenha voltado retorne o contato e fale com um atendente!`, contact)
                                                            };
                                                            await sleep(2000);
                                                            await wbot.sendMessage(`${ticket.contact.number}@${ticket.isGroup
                                                                ? "g.us"
                                                                : "s.whatsapp.net"}`, bodyqrcode);
                                                            const bodyfinaliza = {
                                                                text: (0, Mustache_1.default)(`Estamos finalizando esta conversa! Caso precise entre em contato conosco!`, contact)
                                                            };
                                                            await sleep(2000);
                                                            await wbot.sendMessage(`${ticket.contact.number}@${ticket.isGroup
                                                                ? "g.us"
                                                                : "s.whatsapp.net"}`, bodyfinaliza);
                                                            await (0, UpdateTicketService_1.default)({
                                                                ticketData: { status: "closed" },
                                                                ticketId: ticket.id,
                                                                companyId: ticket.companyId
                                                            });
                                                        }
                                                    })
                                                        .catch(function (error) {
                                                        console.error(error);
                                                    });
                                                    //FIM DA DESCONEXÃO
                                                }
                                                else {
                                                    const bodyerro = {
                                                        text: (0, Mustache_1.default)(`Ops! Ocorreu um erro e nao consegui desbloquear!`, contact)
                                                    };
                                                    await sleep(2000);
                                                    await wbot.sendMessage(`${ticket.contact.number}@${ticket.isGroup ? "g.us" : "s.whatsapp.net"}`, bodyerro);
                                                    await sleep(2000);
                                                    await wbot.sendMessage(`${ticket.contact.number}@${ticket.isGroup ? "g.us" : "s.whatsapp.net"}`, body_mensagem);
                                                    const bodyerroatendente = {
                                                        text: (0, Mustache_1.default)(`Digite *#* e fale com um atendente!`, contact)
                                                    };
                                                    await sleep(2000);
                                                    await wbot.sendMessage(`${ticket.contact.number}@${ticket.isGroup ? "g.us" : "s.whatsapp.net"}`, bodyerroatendente);
                                                } /* else {
                                                     const bodyerro = {
                                      text: formatBody(`Ops! Ocorreu um erro e nao consegui desbloquear! Digite *#* e fale com um atendente!`
                                                     await sleep(2000)
                                                     await wbot.sendMessage(`${ticket.contact.number}@${ticket.isGroup ? "g.us" : "s.whatsapp.net"}`,bodyerro);
                                                 } */
                                            })
                                                .catch(async function (error) {
                                                console.log("LINHA 738: " + error);
                                                const bodyerro = {
                                                    text: (0, Mustache_1.default)(`Ops! Ocorreu um erro digite *#* e fale com um atendente!`, contact)
                                                };
                                                await sleep(2000);
                                                await wbot.sendMessage(`${ticket.contact.number}@${ticket.isGroup ? "g.us" : "s.whatsapp.net"}`, bodyerro);
                                            });
                                        }
                                        else {
                                            const bodysembloqueio = {
                                                text: (0, Mustache_1.default)(`Sua Conexão não está bloqueada! Caso esteja com dificuldades de navegação, retorne o contato e fale com um atendente!`, contact)
                                            };
                                            await sleep(2000);
                                            await wbot.sendMessage(`${ticket.contact.number}@${ticket.isGroup ? "g.us" : "s.whatsapp.net"}`, bodysembloqueio);
                                            const bodyfinaliza = {
                                                text: (0, Mustache_1.default)(`Estamos finalizando esta conversa! Caso precise entre em contato conosco!`, contact)
                                            };
                                            await sleep(2000);
                                            await wbot.sendMessage(`${ticket.contact.number}@${ticket.isGroup ? "g.us" : "s.whatsapp.net"}`, bodyfinaliza);
                                            await (0, UpdateTicketService_1.default)({
                                                ticketData: { status: "closed" },
                                                ticketId: ticket.id,
                                                companyId: ticket.companyId
                                            });
                                        }
                                        //
                                    })
                                        .catch(async function (error) {
                                        console.log("LINHA 746: " + error);
                                        const bodyerro = {
                                            text: (0, Mustache_1.default)(`Ops! Ocorreu um erro digite *#* e fale com um atendente!`, contact)
                                        };
                                        await sleep(2000);
                                        await wbot.sendMessage(`${ticket.contact.number}@${ticket.isGroup ? "g.us" : "s.whatsapp.net"}`, bodyerro);
                                    });
                                }
                            })
                                .catch(async function (error) {
                                const body = {
                                    text: (0, Mustache_1.default)(`*Opss!!!!*\nOcorreu um erro! Digite *#* e fale com um *Atendente*!`, contact)
                                };
                                await sleep(2000);
                                await wbot.sendMessage(`${ticket.contact.number}@${ticket.isGroup ? "g.us" : "s.whatsapp.net"}`, body);
                            });
                        }
                        else {
                            const body = {
                                text: (0, Mustache_1.default)(`Este CPF/CNPJ não é válido!\n\nPor favor tente novamente!\nOu digite *#* para voltar ao *Menu Anterior*`, contact)
                            };
                            await sleep(2000);
                            await wbot.sendMessage(`${ticket.contact.number}@${ticket.isGroup ? "g.us" : "s.whatsapp.net"}`, body);
                        }
                    }
                }
            }
        }
        // voltar para o menu inicial
        if (bodyMessage == "#") {
            await ticket.update({
                queueOptionId: null,
                chatbot: false,
                queueId: null
            });
            await verifyQueue(wbot, msg, ticket, ticket.contact);
            return;
        }
        const ticketTraking = await (0, FindOrCreateATicketTrakingService_1.default)({
            ticketId: ticket.id,
            companyId,
            whatsappId: whatsapp?.id
        });
        if (hasMedia) {
            await verifyMediaMessage(msg, ticket, contact);
        }
        else {
            await (0, exports.verifyMessage)(msg, ticket, contact);
        }
        try {
            if (!msg.key.fromMe) {
                /*** Tratamento para avaliação do atendente */
                if (ticketTraking !== null && verifyRating(ticketTraking)) {
                    handleRating(msg, ticket, ticketTraking);
                    return;
                }
            }
        }
        catch (e) {
            Sentry.captureException(e);
            console.log(e);
        }
        if (!ticket.queue &&
            !isGroup &&
            !msg.key.fromMe &&
            !ticket.userId &&
            whatsapp.queues.length >= 1) {
            await verifyQueue(wbot, msg, ticket, ticket.contact);
        }
        const dontReadTheFirstQuestion = ticket.queue === null;
        await ticket.reload();
        if (whatsapp.queues.length == 1 && ticket.queue) {
            if (ticket.chatbot && !msg.key.fromMe) {
                await handleChartbot(ticket, msg, wbot);
            }
        }
        if (whatsapp.queues.length > 1 && ticket.queue) {
            if (ticket.chatbot && !msg.key.fromMe) {
                await handleChartbot(ticket, msg, wbot, dontReadTheFirstQuestion);
            }
        }
    }
    catch (err) {
        Sentry.captureException(err);
        logger_1.logger.error(`Error handling whatsapp message: Err: ${err}`);
    }
};
exports.handleMessage = handleMessage;
const handleMsgAck = async (msg, chat) => {
    await new Promise(r => setTimeout(r, 500));
    const io = (0, socket_1.getIO)();
    try {
        const messageToUpdate = await Message_1.default.findByPk(msg.key.id, {
            include: [
                "contact",
                {
                    model: Message_1.default,
                    as: "quotedMsg",
                    include: ["contact"]
                }
            ]
        });
        if (!messageToUpdate)
            return;
        await messageToUpdate.update({ ack: chat });
        io.to(messageToUpdate.ticketId.toString()).emit(`company-${messageToUpdate.companyId}-appMessage`, {
            action: "update",
            message: messageToUpdate
        });
    }
    catch (err) {
        Sentry.captureException(err);
        logger_1.logger.error(`Error handling message ack. Err: ${err}`);
    }
};
const verifyRecentCampaign = async (message, companyId) => {
    if (!message.key.fromMe) {
        const number = message.key.remoteJid.replace(/\D/g, "");
        const campaigns = await Campaign_1.default.findAll({
            where: { companyId, status: "EM_ANDAMENTO", confirmation: true }
        });
        if (campaigns) {
            const ids = campaigns.map(c => c.id);
            const campaignShipping = await CampaignShipping_1.default.findOne({
                where: { campaignId: { [sequelize_1.Op.in]: ids }, number, confirmation: null }
            });
            if (campaignShipping) {
                await campaignShipping.update({
                    confirmedAt: (0, moment_1.default)(),
                    confirmation: true
                });
                await queues_1.campaignQueue.add("DispatchCampaign", {
                    campaignShippingId: campaignShipping.id,
                    campaignId: campaignShipping.campaignId
                }, {
                    delay: (0, queues_1.parseToMilliseconds)((0, queues_1.randomValue)(0, 10))
                });
            }
        }
    }
};
const verifyCampaignMessageAndCloseTicket = async (message, companyId) => {
    const io = (0, socket_1.getIO)();
    const body = (0, exports.getBodyMessage)(message);
    const isCampaign = /\u200c/.test(body);
    if (message.key.fromMe && isCampaign) {
        const messageRecord = await Message_1.default.findOne({
            where: { id: message.key.id, companyId }
        });
        const ticket = await Ticket_1.default.findByPk(messageRecord.ticketId);
        await ticket.update({ status: "pending" });
        io.to("open").emit(`company-${ticket.companyId}-ticket`, {
            action: "delete",
            ticket,
            ticketId: ticket.id
        });
        io.to(ticket.status)
            .to(ticket.id.toString())
            .emit(`company-${ticket.companyId}-ticket`, {
            action: "update",
            ticket,
            ticketId: ticket.id
        });
    }
};
const filterMessages = (msg) => {
    if (msg.message?.protocolMessage)
        return false;
    if ([
        baileys_1.WAMessageStubType.REVOKE,
        baileys_1.WAMessageStubType.E2E_DEVICE_CHANGED,
        baileys_1.WAMessageStubType.E2E_IDENTITY_CHANGED,
        baileys_1.WAMessageStubType.CIPHERTEXT
    ].includes(msg.messageStubType))
        return false;
    return true;
};
const wbotMessageListener = async (wbot, companyId) => {
    try {
        wbot.ev.on("messages.upsert", async (messageUpsert) => {
            const messages = messageUpsert.messages
                .filter(filterMessages)
                .map(msg => msg);
            if (!messages)
                return;
            messages.forEach(async (message) => {
                const messageExists = await Message_1.default.count({
                    where: { id: message.key.id, companyId }
                });
                if (!messageExists) {
                    await handleMessage(message, wbot, companyId);
                    await verifyRecentCampaign(message, companyId);
                    await verifyCampaignMessageAndCloseTicket(message, companyId);
                }
            });
            // comunicação com o n8n atraves do webhook
            // const url = "https://n8n.dende.tech/";
            // axios({
            //   method: "POST",
            //   url: `${url}webhook-test/7b63c5c0-7fda-4f03-8cf5-0de9cf748399`,
            //   headers: {
            //     "Content-Type": "application/json"
            //   },
            //   data: messages
            // })
            //   .then(response => {
            //     console.log(response.data);
            //   })
            //   .catch(error => {
            //     throw new Error(error);
            //   });
        });
        wbot.ev.on("messages.update", (messageUpdate) => {
            if (messageUpdate.length === 0)
                return;
            messageUpdate.forEach(async (message) => {
                wbot.readMessages([message.key]);
                handleMsgAck(message, message.update.status);
            });
        });
        wbot.ev.on("messages.update", (messageUpdate) => {
            if (messageUpdate.length === 0)
                return;
            messageUpdate.forEach(async (message) => {
                handleMsgAck(message, message.update.status);
            });
        });
        wbot.ev.on("chats.update", async (chatUpdate) => {
            if (chatUpdate.length === 0)
                return;
            chatUpdate.forEach(async (chat) => {
                await (0, CreateOrUpdateBaileysChatService_1.CreateOrUpdateBaileysChatService)(wbot.id, chat);
            });
        });
    }
    catch (error) {
        Sentry.captureException(error);
        logger_1.logger.error(`Error handling wbot message listener. Err: ${error}`);
    }
};
exports.wbotMessageListener = wbotMessageListener;
