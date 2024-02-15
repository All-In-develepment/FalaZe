import { Request, Response } from "express";
import { createPayment } from "../services/AssasService/CreatePayment";
import { paymentReceived } from "../services/AssasService/PaymentReceived";
import { createSubAccount } from "../services/AssasService/CreateSubAccount";
import { ISubAccount } from "../@types";
import { AxiosError } from "axios";

export const asaasPayments = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { invoiceId, companyId } = req.body;

    const create = await createPayment(invoiceId, companyId);

    return res.status(200).json(create);
  } catch (error) {
    return error;
  }
};

export const receivedPaymentAsaas = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { payment } = req.body;
  await paymentReceived(payment);

  return res.status(200).json();
};

export const asaasCreateSubAccount = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const {
      name,
      mobilePhone,
      email,
      cpfCnpj,
      full_address,
      companyId,
      sandbox,
      companyType
    }: ISubAccount = req.body;

    const subAccount = await createSubAccount({
      name,
      mobilePhone,
      email,
      cpfCnpj,
      full_address,
      companyType,
      companyId,
      sandbox
    });

    return res.status(200).json(subAccount);
  } catch (error) {
    if (error instanceof AxiosError) {
      return res
        .status((error as AxiosError).response?.status ?? 500)
        .json((error as AxiosError).response?.data);
    }
    return res.status(400).json((error as Error).message);
  }
};
