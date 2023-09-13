import { TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions";
import Telegram from "../../models/Telegram";

export const loginTelegram = async id => {
  try {
    const apiId = Number(process.env.API_ID);
    const apiHash = String(process.env.API_HASH);
    // const storeSession = new StoreSession("my_session");

    const { session, user } = await Telegram.findByPk(id);

    const stringSession = new StringSession(session);

    const client = new TelegramClient(stringSession, apiId, apiHash, {
      connectionRetries: 5,
      useWSS: true
    });

    await client.connect(); // This assumes you have already authenticated with .start()

    console.log("conexão estabelicida com sucesso");

    return client;
  } catch (error) {
    console.log({ error });
  }
};
