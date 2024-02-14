export const verifySandbox = (asaas: string) => {
  const sandbox = "https://sandbox.asaas.com/api/v3";

  const prod = "https://api.asaas.com/v3";

  return asaas.toLowerCase() == "false" ? prod : sandbox;
};
