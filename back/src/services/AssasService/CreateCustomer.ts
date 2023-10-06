import axios from "axios";
import Company from "../../models/Company";
import { listCustomer } from "./ListCustomer";
import { verifySandbox } from "./VerifySandbox";

export const createCustomer = async (access_token: string) => {
  try {
    const api = verifySandbox();

    const {
      name,
      phone: mobilePhone,
      email,
      cpfCnpj,
      postalCode
    } = await Company.findByPk("1");

    const customer = await listCustomer({ access_token, cpfCnpj });

    if (customer) return customer;

    const url = `${api}/customers`;

    const options = {
      headers: {
        accept: "application/json",
        access_token
      }
    };

    const data = {
      name,
      cpfCnpj,
      email,
      mobilePhone,
      postalCode
    };

    const response = await axios.post(url, data, options);

    return response.data.id;
  } catch (error) {
    return error;
  }
};
