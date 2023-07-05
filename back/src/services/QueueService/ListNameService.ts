import Whatsapp from "../../models/Whatsapp";

interface Request {
  companyId: number;
}

const ListNameService = async ({ companyId }: Request): Promise<Whatsapp[]> => {
  const names = await Whatsapp.findAll({
    where: {
      companyId
    },
    order: [["name", "ASC"]]
  });

  return names;
};

export default ListNameService;
