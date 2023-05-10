import gracefulShutdown from "http-graceful-shutdown";
import app from "./app";
import { initIO } from "./libs/socket";
import { logger } from "./utils/logger";
import { StartAllWhatsAppsSessions } from "./services/WbotServices/StartAllWhatsAppsSessions";
import { Database } from "./database";

const server = app.listen(process.env.PORT, () => {
  logger.info(`Server started on port: ${process.env.PORT}`);
});

const connection = new Database();

// connection.addModels();
connection.connect();

initIO(server);

StartAllWhatsAppsSessions();
gracefulShutdown(server);
