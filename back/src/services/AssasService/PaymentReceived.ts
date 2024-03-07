import { where } from "sequelize";
import { dateAdjustment } from "../../helpers/dateAdjustment";
import Company from "../../models/Company";
import Invoices from "../../models/Invoices";
import AppError from "../../errors/AppError";

export const paymentReceived = async payment => {
  const invoice = await Invoices.findOne({
    where: { billingId: payment.id },
    include: [
      {
        model: Company
      }
    ]
  });

  if (!invoice) {
    throw new AppError("Invoice not found", 402);
  }

  const expiresAt = new Date(invoice.company.dueDate);
  expiresAt.setDate(expiresAt.getDate() + 30);
  const dueDate = expiresAt.toISOString().split("T")[0];

  await invoice.company.update({ dueDate });
  const invoicePaid = await invoice.update({ status: "paid" });

  return invoicePaid;
};
