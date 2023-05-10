import { Database } from "../../database/index";
import Queue from "../../models/Queue";
import Whatsapp from "../../models/Whatsapp";

const ListWhatsAppsService = async (): Promise<Whatsapp[] | undefined> => {
  const db = new Database();
  const [result] = await db.sequelize.query(
    "SELECT 1 FROM information_schema.tables WHERE table_name = 'Whatsapps'"
  );

  if (result.length === 0) {
    console.log("A tabela não existe");
    return;
  }

  const whatsapps = await Whatsapp.findAll({
    include: [
      {
        model: Queue,
        as: "queues",
        attributes: ["id", "name", "color", "greetingMessage"]
      }
    ]
  });
  // eslint-disable-next-line
  return whatsapps;
};

export default ListWhatsAppsService;
