import axios from "axios";
import { verifySandbox } from "./VerifySandbox";

interface IRequest {
  access_token: string;
  cpfCnpj: string;
}

export const listCustomer = async ({ access_token, cpfCnpj }: IRequest) => {
  try {
    const api = verifySandbox();

    const url = `${api}/customers?cpfCnpj=${cpfCnpj}`;
    const options = {
      headers: {
        accept: "application/json",
        access_token
      }
    };

    const { data } = await axios.get(url, options);

    if (data.data.length === 0) return false;

    return data.data[0].id;
  } catch (error) {
    return error;
  }
};
