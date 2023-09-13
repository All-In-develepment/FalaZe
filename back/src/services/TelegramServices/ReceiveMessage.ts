import { message } from "telegraf/filters";
import { Api, TelegramClient, client } from "telegram";
import { loginTelegram } from "./LoginTelegramServices";
import { StringSession } from "telegram/sessions";

import dotenv from "dotenv";
import { connect } from "http2";

dotenv.config();

const receivedMessage = async () => {
  // const client = await loginTelegram(id);

  const apiId = Number(process.env.API_ID);
  const apiHash = String(process.env.API_HASH);

  const session =
    "1AQAOMTQ5LjE1NC4xNzUuNTMBu1mBW0T8pLUYdg0xReizUTX8FaR+Z4v3PKYDRQogNRG9D8AMYqlZ1R+ZDJr4nD3XsnGikPWtjsrjsl2VfNt4QBWvIrdrYcmzDegHnt9iP5IC+YUkgBFCXStslDBBbVJyGfXLM1GprSpyYCE2Q4Ky1bNzcYI48DawnMnbJNanfPmHYjCsNr843tI50Fv13e1GZe6FoH5gpwfcBFk5KXQ7C/LKnnfSMybhHij2erUs7+ao2eBVm/2GKIQHQ6aI7oz3H3n07z2X9LqGKUt+im5Bt5/M82Gm8kRoh9Kb/Imsgtkbp+MSbsYlcV/GIKsN8MRh/uSRdHJSMqXSgk8nIpBfeN4=";

  const stringSession = new StringSession(session);

  const client = new TelegramClient(stringSession, apiId, apiHash, {
    connectionRetries: 5,
    useWSS: true
  });

  await client.connect();

  const entity = await client.getEntity("+5575992668221");

  // const result = await client.invoke(
  //   new Api.messages.GetHistory({
  //     peer: entity, // Para buscar mensagens na sua própria conta
  //     limit: 10 // Você pode ajustar o limite de mensagens
  //   })
  // );

  // result.messages.forEach(message => console.log(message.message));

  const result = await client.invoke(
    new Api.messages.ReceivedQueue({
      maxQts: 43
    })
  );

  console.log(result);
};

receivedMessage();
