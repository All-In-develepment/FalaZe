import Setting from "../../models/Setting";
import { ICreateSubscription } from "../CompanyService/CreateCompanyService";
import axios from "axios";

// name: string;
// mobilePhone: string;
// email: string;

export const CreateSubscriptionAsaas = async ({
  value,
  name,
  phone,
  email,
  cpfCnpj,
  postalCode,
  addressNumber,
  holderName,
  number,
  expiryMonth,
  expiryYear,
  ccv
}: ICreateSubscription) => {
  try {
    const { value: access_token } = await Setting.findOne({
      where: { key: "asaas" }
    });

    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split("T");

    const sandbox = process.env.ASAAS_SANDBOX;

    const url = `${process.env.INTEGRATOR_URL}/invoices/asaas/subscriptions`;

    const options = {
      headers: {
        accept: "application/json",
        access_token
      }
    };

    const data = {
      nextDueDate: formattedDate,
      value,
      name,
      mobilePhone: phone,
      email,
      cpfCnpj,
      postalCode,
      addressNumber,
      holderName,
      number,
      expiryMonth,
      expiryYear,
      ccv,
      access_token,
      sandbox
    };

    const response = await axios.post(url, data, options);
  } catch (error) {}
};
