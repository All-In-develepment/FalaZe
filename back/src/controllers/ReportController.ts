import { Params } from "../services/ReportService/DashbardDataService";
import { Request, Response } from "express";
import { ReportService } from "../services/ReportService/ReportService";

export const getReport = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const params: Params = req.query;

  const dashboardData = await ReportService(params);
  return res.status(200).json(dashboardData);
};
