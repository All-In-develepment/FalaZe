import { TelegramClient, Api } from "telegram";
import { StoreSession, StringSession } from "telegram/sessions";
import input from "input";

export const testFunc = async () => {
  const apiId = 22721672;
  const apiHash = "f5cd62b2a0e60b7e2b0a39d4a38a4f13";
  // const stringSession = new StringSession(
  //   "1AQAOMTQ5LjE1NC4xNzUuNTcBuwXEpigO7WE7m96FTE/GQIlnVAtGZTScAxtUeAMvyWzI2Hf6yIpw/2Up2J2eAa5PwGUYRh7GaFJPTG2a75X9zEmKZN/WVssEcKHuF+Z9FRaZvLwlmghlLIKKwR8xbe8dHLR2f1V7+n1NctDRxNSGe2mOtRBJfZfzsEnz8IE8MqrwxJfMoO/kuMdHRuBgN7/2PMMiRDvxO37LvsD2EjwyZr8YsISewCfRs2a7V6qsxYvCk5hiMyp2zvKqbrp6H23ZCi7c3n1NODiEnHMYm10LDbfiQ/XyrJ/Id8TnilkmEnr+bcvI+Ib7nCzlUeJfEiD7NmDHYzjsopbJnyA83ZBN3Vg="
  // ); // fill this later with the value from session.save()

  const storeSession = new StoreSession("my_session");

  (async () => {
    console.log("Loading interactive example...");
    const client = new TelegramClient(storeSession, apiId, apiHash, {
      connectionRetries: 5
    });
    await client.start({
      phoneNumber: async () => await input.text("Please enter your number: "),
      password: async () => await input.text("Please enter your password: "),
      phoneCode: async () =>
        await input.text("Please enter the code you received: "),
      onError: err => console.log(err)
    });
    console.log("You should now be connected.");
    console.log(client.session.save()); // Save this string to avoid logging in again

    // const contact = await client.getEntity("+557599189-7068");
    const contact = await client.getEntity("+5575992512104");

    console.log(contact);

    // await client.sendMessage("me", { message: "Hello!" });

    const result = await client.invoke(
      new Api.messages.SendMessage({
        peer: contact,
        message: "Hello there!"
      })
    );
    console.log(result);
  })();
};
