import express from "express";
import isAuth from "../middleware/isAuth";

import * as TelegramController from "../controllers/TelegramController";

const telegramRoutes = express.Router();

telegramRoutes.get("/telegram/login", TelegramController.loginTelegram);
telegramRoutes.post("/telegram/send-message", TelegramController.sendMessage);

export default telegramRoutes;
