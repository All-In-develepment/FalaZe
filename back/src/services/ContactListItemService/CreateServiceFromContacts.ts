import CreateService, { Data } from "./CreateService";

export const CreateServiceFromContacts = async (data: Data[]) => {
  try {
    const validContacts = data.filter(contact =>
      /^\d{8,17}$/.test(contact.number)
    );

    const records = await Promise.all(
      validContacts.map(async contact => await CreateService(contact))
    );
    return records;
  } catch (error) {
    console.log(error);
  }
};
