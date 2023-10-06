import axios from "axios";
import Setting from "../../models/Setting";
import { createWebHookBilling } from "./CreateWebHookBilling";
import { verifySandbox } from "./VerifySandbox";

export const listWebHookBilling = async () => {
  const api = verifySandbox();

  const { value: access_token } = await Setting.findOne({
    where: { key: "asaas" }
  });

  const url = `${api}/webhook`;
  try {
    const options = {
      headers: {
        accept: "application/json",
        access_token
      }
    };

    const response = await axios.get(url, options);

    return response.data;
  } catch (error) {
    const response = await createWebHookBilling({ access_token, url });

    return response.data;
  }
};
