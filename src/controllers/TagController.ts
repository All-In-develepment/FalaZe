import { Request, Response } from "express";
import { CreateTag, Tags } from "../services/WbotServices/CreateTag";
import ShowTicketService from "../services/TicketServices/ShowTicketService";
import { getApiToken } from "../helpers/Api";

interface TagsData extends Tags {
  token: string;
}

export const createTag = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { color, description, name, token }: TagsData = req.body;
  const { ticketId } = req.params;
  const ticket = await ShowTicketService(ticketId);

  const apiToken = (await getApiToken()).value;

  if (apiToken !== token)
    return res.status(500).json({ status: false, response: "API INVÁLIDA" });

  CreateTag({ color, description, name, ticket });
  return res.send();
};
