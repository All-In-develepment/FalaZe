import axios from "axios";
import { verifySandbox } from "./VerifySandbox";
import Setting from "../../models/Setting";
import Invoices from "../../models/Invoices";
import { dateAdjustment } from "../../helpers/dateAdjustment";
import { createCustomer } from "./CreateCustomer";
import { listWebHookBilling } from "./ListWebHookBilling";

import dotenv from "dotenv";
import Affiliates from "../../models/Affiliates";
import Company from "../../models/Company";

dotenv.config();

export const createPayment = async (id: string, companyId: string) => {
  try {
    const sandbox = process.env.ASAAS_SANDBOX;
    const percentualValue = process.env.ASSAS_PERCENTUAL;

    const api = verifySandbox(sandbox);

    const { value: access_token } = await Setting.findOne({
      where: { key: "asaas", companyId }
    });

    const invoice = await Invoices.findByPk(id);

    const { value, dueDate: oldDate } = invoice;

    // const dueDate = dateAdjustment(oldDate);

    const [dueDate] = oldDate.split("T");

    const customer = await createCustomer(access_token, sandbox, companyId);

    const company = await Company.findByPk(companyId, {
      include: [
        {
          model: Affiliates,
          attributes: ["walletId"]
        }
      ]
    });

    const url = `${api}/payments`;

    const options = {
      headers: {
        accept: "application/json",
        access_token
      }
    };

    const data = {
      billingType: "UNDEFINED",
      customer,
      value,
      dueDate,
      ...(company.affiliate && {
        split: [
          {
            walletId: company.affiliate.walletId,
            percentualValue
          }
        ]
      })
    };

    await listWebHookBilling();

    const response = await axios.post(url, data, options);

    const billingId = response.data.id;

    await invoice.update({ billingId });

    return response.data.invoiceUrl;
  } catch (error) {
    return error;
  }
};
