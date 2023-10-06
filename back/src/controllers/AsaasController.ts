import { Request, Response } from "express";
import { createPayment } from "../services/AssasService/CreatePayment";
import { paymentReceived } from "../services/AssasService/PaymentReceived";

export const asaasPayments = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { invoiceId } = req.body;

    console.log(invoiceId);

    const create = await createPayment(invoiceId);

    console.log(create);

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
