import axios from "axios";
import { verifySandbox } from "./VerifySandbox";
import Setting from "../../models/Setting";
import Invoices from "../../models/Invoices";
import { dateAdjustment } from "../../helpers/dateAdjustment";
import { createCustomer } from "./CreateCustomer";
import { listWebHookBilling } from "./ListWebHookBilling";

export const createPayment = async (id: string) => {
  try {
    const api = verifySandbox();

    const { value: access_token } = await Setting.findOne({
      where: { key: "asaas" }
    });

    const invoice = await Invoices.findByPk(id);

    const { value, dueDate: oldDate } = invoice;

    // const dueDate = dateAdjustment(oldDate);

    const [dueDate] = oldDate.split("T");

    const customer = await createCustomer(access_token);

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
      dueDate
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
