import { Request, Response } from "express";
import { CreateTag, Tags } from "../services/WbotServices/CreateTag";
import { GetOneTag } from "../services/WbotServices/GetOneTag";
import ShowTicketService from "../services/TicketServices/ShowTicketService";
import { getApiToken } from "../helpers/Api";
import { RemoveTag } from "../services/WbotServices/DeleteTag";
import { UpdateTag } from "../services/WbotServices/UpdateTag";
import { GetAllTag } from "../services/WbotServices/GetAllTags";

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

export const updateTag = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { color, description, name, token }: TagsData = req.body;
  const { ticketId } = req.params;
  const ticket = await ShowTicketService(ticketId);

  const apiToken = (await getApiToken()).value;

  if (apiToken !== token)
    return res.status(500).json({ status: false, response: "API INVÁLIDA" });

  UpdateTag({ color, description, name, ticket });
  return res.send();
};

export const getOneTag = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { token }: TagsData = req.body;
  const { ticketId } = req.params;
  const ticket = await ShowTicketService(ticketId);

  const apiToken = (await getApiToken()).value;

  if (apiToken !== token)
    return res.status(500).json({ status: false, response: "API INVÁLIDA" });

  GetOneTag(ticket);
  return res.send();
};

export const getAllTag = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { token }: TagsData = req.body;

  const apiToken = (await getApiToken()).value;

  if (apiToken !== token)
    return res.status(500).json({ status: false, response: "API INVÁLIDA" });

  GetAllTag();
  return res.send();
};

export const removeTag = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { token }: TagsData = req.body;
  const { ticketId } = req.params;
  const ticket = await ShowTicketService(ticketId);

  const apiToken = (await getApiToken()).value;

  if (apiToken !== token)
    return res.status(500).json({ status: false, response: "API INVÁLIDA" });

  RemoveTag(ticket);
  return res.send();
};
