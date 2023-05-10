import { Request, Response } from "express";
import { getApiToken } from "../helpers/Api";
import { CloseGroup } from "../services/WbotServices/CloseGroup";
import {
  CreateGroup,
  ICreateGroup
} from "../services/WbotServices/CreateGroup";
import { OpenGroup } from "../services/WbotServices/OpenGroup";
import {
  ISendGroupMessage,
  SendGroupMessage
} from "../services/WbotServices/SendGroupMessage";
import {
  UpdateGroupTitle,
  UpdateGroupDescription,
  IUpdateDescription,
  IUpdateSubject
} from "../services/WbotServices/UpdateGroup";
import { GetGroupsAdmin } from "../services/WbotServices/GetGroupsAdmin";
import { SendGroupMessageNASA } from "../services/WbotServices/SendGroupMessageNASA";

interface IGroupData extends ICreateGroup {
  token: string;
}

interface IUpdateSubjectData extends IUpdateSubject {
  token: string;
}

interface IUpdateDescriptionData extends IUpdateDescription {
  token: string;
}

interface ISendGroupMessageData extends ISendGroupMessage {
  token: string;
}

export const createGroup = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { title, contacts, ticketWhatsappId, token }: IGroupData = req.body;

  const apiToken = (await getApiToken()).value;

  if (apiToken !== token)
    return res.status(500).json({ status: false, response: "API INVÁLIDA" });

  await CreateGroup({ title, contacts, ticketWhatsappId });
  return res.send();
};

export const updateGroupTitle = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { subject, ticketWhatsappId, token }: IUpdateSubjectData = req.body;

  const apiToken = (await getApiToken()).value;

  if (apiToken !== token)
    return res.status(500).json({ status: false, response: "API INVÁLIDA" });

  await UpdateGroupTitle({ subject, ticketWhatsappId });
  return res.send();
};

export const updateGroupDescription = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { description, ticketWhatsappId, token }: IUpdateDescriptionData =
    req.body;

  const apiToken = (await getApiToken()).value;

  if (apiToken !== token)
    return res.status(500).json({ status: false, response: "API INVÁLIDA" });

  await UpdateGroupDescription({ description, ticketWhatsappId });
  return res.send();
};

export const sendGroupMessage = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { newMessageGroup, ticketWhatsappId, token }: ISendGroupMessageData =
    req.body;

  const apiToken = (await getApiToken()).value;

  if (apiToken !== token)
    return res.status(500).json({ status: false, response: "API INVÁLIDA" });

  await SendGroupMessage({ newMessageGroup, ticketWhatsappId });
  return res.send();
};

export const openGroup = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { ticketWhatsappId, token }: ISendGroupMessageData = req.body;

  const apiToken = (await getApiToken()).value;

  if (apiToken !== token)
    return res.status(500).json({ status: false, response: "API INVÁLIDA" });

  await OpenGroup(ticketWhatsappId);
  return res.send();
};

export const closeGroup = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { ticketWhatsappId, token }: ISendGroupMessageData = req.body;

  const apiToken = (await getApiToken()).value;

  if (apiToken !== token)
    return res.status(500).json({ status: false, response: "API INVÁLIDA" });

  await CloseGroup(ticketWhatsappId);
  return res.send();
};

export const sendGroupMessageNASA = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { newMessageGroup, ticketWhatsappId, token }: ISendGroupMessageData =
    req.body;

  const apiToken = (await getApiToken()).value;

  if (apiToken !== token)
    return res.status(500).json({ status: false, response: "API INVÁLIDA" });

  await SendGroupMessageNASA({ newMessageGroup, ticketWhatsappId });
  return res.send();
};

export const getGroupsAdmin = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { ticketWhatsappId, token }: ISendGroupMessageData = req.body;

  const apiToken = (await getApiToken()).value;

  if (apiToken !== token)
    return res.status(500).json({ status: false, response: "API INVÁLIDA" });

  await GetGroupsAdmin(ticketWhatsappId);
  return res.send();
};
