import axios from "axios";
import { IAddress, IViaCepResponse } from "../@types";

export const getAddress = async (postalCode: string) => {
  const cep = String(postalCode)
    ?.trim()
    ?.replace(/[a-zA-B.-]/g, "");

  if (!cep) throw new Error("Insira o CEP");

  if (!/\d{8}/.test(cep) || cep.length !== 8) throw new Error("CEP inválido");

  const url = `http://viacep.com.br/ws/${cep}/json/`;

  const viaCepResponse: IViaCepResponse = (await axios.get(url))?.data;

  if (!viaCepResponse) throw new Error("CEP não encontrado");

  const address: IAddress = {
    postalCode: viaCepResponse.cep,
    address: viaCepResponse.logradouro,
    addressNumber: "",
    province: viaCepResponse.bairro
  };

  return address;
};
