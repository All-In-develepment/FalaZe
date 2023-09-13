import { Api, TelegramClient } from "telegram";
import { StoreSession, StringSession } from "telegram/sessions";
import qrcode from "qrcode-terminal";
import dotenv from "dotenv";
import Telegram from "../../models/Telegram";

dotenv.config();

export const createTelegram = async () => {
  try {
    const apiId = Number(process.env.API_ID);
    const apiHash = String(process.env.API_HASH);
    const stringSession = new StringSession(""); // You should put your string session here

    // const storeSession = new StoreSession("my_session");
    const client = new TelegramClient(stringSession, apiId, apiHash, {
      connectionRetries: 5,
      useWSS: true
    });

    await client.connect();

    const clientSession = await Telegram.create();

    const user = await client.signInUserWithQrCode(
      { apiId, apiHash },
      {
        onError: async (p1: Error) => {
          console.log("error", p1);
          // true = stop the authentication processes
          return true;
        },
        qrCode: async code => {
          console.log("Convert the next string to a QR code and scan it");
          const qrCodeURI = `tg://login?token=${code.token.toString(
            "base64url"
          )}`;

          clientSession.update({ qrcode: qrCodeURI });

          qrcode.generate(qrCodeURI, { small: true });
        },
        password: async hint => {
          // password if needed
          return "1111";
        }
      }
    );
    const session = client.session.save();

    clientSession.update({
      session,
      user
    });
  } catch (err) {
    console.log(`ERROR => ${err}`);
  }
};
