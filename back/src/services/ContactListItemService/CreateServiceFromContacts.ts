import CreateService, { Data } from "./CreateService";

export const CreateServiceFromContacts = (data: Data[]) => {
  try {
    console.log(data);

    data.forEach(contact => CreateService(contact));
  } catch (error) {
    console.log(error);
  }
};
