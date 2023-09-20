import axios from "axios";
import Setting from "../../models/Setting";

import { Request, Response } from "express";

export const getPixKey = async (req: Request, res: Response) => {
  try {
    const { value: access_token } = await Setting.findOne({
      where: { key: "asaas" }
    });
    const url = "https://sandbox.asaas.com/api/v3/pix/addressKeys";
    const options = {
      headers: {
        accept: "application/json",
        access_token
      }
    };

    const response = await axios.get(url, options);
    return res.json(response.data);
  } catch (error) {}
};
