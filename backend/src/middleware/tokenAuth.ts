import { Request, Response, NextFunction } from "express";

import AppError from "../errors/AppError";
import Whatsapp from "../models/Whatsapp";
import Invoices from "../models/Invoices";
import { format } from "date-fns";

type HeaderParams = {
  Bearer: string;
};

const tokenAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.headers.authorization.replace("Bearer ", "");
    const whatsapp = await Whatsapp.findOne({ where: { token } });

    const invoices = await Invoices.findOne({
      where: { companyId: whatsapp.companyId }
    });

    const currentDate = new Date();
    const formattedDate = format(currentDate, "yyyy-MM-dd'T'HH:mm:ssXXX");

    if (invoices.status !== "paid" && invoices.dueDate < formattedDate)
      throw new Error();

    if (whatsapp) {
      req.params = {
        whatsappId: whatsapp.id.toString()
      };
    } else {
      throw new Error();
    }
  } catch (err) {
    throw new AppError("Acesso não permitido", 401);
  }

  return next();
};

export default tokenAuth;
