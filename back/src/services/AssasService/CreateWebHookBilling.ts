import axios from "axios";

import dotenv from "dotenv";
dotenv.config();

interface IRequest {
  access_token: string;
  url: string;
}

export const createWebHookBilling = async ({ access_token, url }: IRequest) => {
  try {
    const options = {
      headers: {
        accept: "application/json",
        access_token
      }
    };

    const webHook = `${process.env.BACKEND_URL}/webhook/payment`;

    const data = {
      apiVersion: "3",
      enabled: true,
      interrupted: false,
      url: webHook,
      email: process.env.ASAAS_EMAIL_WEBHOOK
    };

    const response = await axios.post(url, data, options);

    return response.data;
  } catch (error) {
    return error;
  }
};
