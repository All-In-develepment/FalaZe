import axios from "axios";
import Setting from "../../models/Setting";
import { verifySandbox } from "./VerifySandbox";

export const qrCodePix = async () => {
  try {
    const api = verifySandbox();

    const { value: access_token } = await Setting.findOne({
      where: { key: "asaas" }
    });

    const url = `${api}/payments/id/pixQrCode`;
    const options = {
      headers: {
        accept: "application/json",
        access_token
      }
    };

    const { data } = await axios.get(url, options);
    return data;
  } catch (error) {
    return error;
  }
};
