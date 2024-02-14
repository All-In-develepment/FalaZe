import axios from "axios";
import { verifySandbox } from "./VerifySandbox";
import { getAddress } from "../../helpers/getAddress";
import { ISubAccount } from "../../@types";
import Setting from "../../models/Setting";
import Affiliates from "../../models/Affiliates";
import dotenv from "dotenv";
import Company from "../../models/Company";
dotenv.config();

export const createSubAccount = async ({
  name,
  mobilePhone,
  email,
  cpfCnpj,
  full_address,
  companyType,
  companyId,
  sandbox
}: ISubAccount) => {
  const api = verifySandbox(process.env.ASAAS_SANDBOX);

  const { value: access_token } = await Setting.findOne({
    where: { key: "asaas", companyId }
  });

  const { postalCode, addressNumber } = full_address;

  const fullAddress = await getAddress(postalCode);

  if (fullAddress instanceof Error) {
    throw fullAddress;
  }

  const url = `${api}/accounts`;

  const options = {
    headers: {
      accept: "application/json",
      access_token
    }
  };

  const data = {
    name,
    email,
    cpfCnpj: cpfCnpj.replace(/[.-/]/g, ""),
    mobilePhone,
    companyType,
    address: fullAddress.address,
    addressNumber,
    province: fullAddress.province,
    postalCode: postalCode.replace("-", "")
  };

  const { data: asaasData } = await axios.post(url, data, options);

  const { id } = await Affiliates.create({
    asaasId: asaasData.id,
    name: asaasData.name,
    email: asaasData.email,
    phone: asaasData.mobilePhone,
    address: asaasData.address,
    addressNumber: asaasData.addressNumber,
    complement: asaasData.complement,
    province: asaasData.province,
    postalCode: asaasData.postalCode,
    cpfCnpj: asaasData.cpfCnpj,
    apiKey: asaasData.apiKey,
    walletId: asaasData.walletId,
    companyType: asaasData.companyType,
    personType: asaasData.personType,
    birthDate: asaasData.birthDate,
    data: JSON.stringify(asaasData)
  });

  const company = await Company.findByPk(companyId);

  await company.update({ affiliateId: id });

  return asaasData;
};
