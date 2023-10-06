import dotenv from "dotenv";

dotenv.config();

export const verifySandbox = () => {
  const asaas = process.env.ASAAS_SANDBOX;

  const sandbox = "https://sandbox.asaas.com/api/v3";

  const prod = "https://api.asaas.com/v3";

  return asaas.toLowerCase() == "false" ? prod : sandbox;
};
