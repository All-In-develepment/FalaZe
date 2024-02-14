export interface IViaCepResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
}

export interface IAddress {
  postalCode: string;
  address: string;
  addressNumber: string;
  province: string;
}

export interface ICreateCustomer {
  name: string;
  mobilePhone: string;
  email: string;
  cpfCnpj: string;
  companyId: string;
  sandbox: string;
  full_address: IAddress;
}

export interface IListCustomer {
  access_token: string;
  cpfCnpj: string;
  sandbox: string;
}

export interface ICreatePayment extends ICreateCustomer {
  oldDate: string;
  value: number;
}

export interface IListWebHookBilling {
  sandbox: string;
  access_token: string;
}

export interface ICreateWebHookBilling {
  access_token: string;
  url: string;
}

export interface ISubscription extends ICreateCustomer {
  addressNumber: string;
  remoteIp: string;
  holderName: string;
  number: string;
  expiryMonth: string;
  expiryYear: string;
  ccv: string;
  value: number;
  nextDueDate: string;
}

export interface ISubAccount extends ICreateCustomer {
  companyType?: string;
}
