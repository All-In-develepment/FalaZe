import { DashBoardTagService } from "./../services/ReportService/DashboardTagService";
import { Request, Response } from "express";

import DashboardDataService, {
  DashboardData,
  Params
} from "../services/ReportService/DashbardDataService";

export const index = async (req: Request, res: Response): Promise<Response> => {
  const params: Params = req.query;
  const { companyId } = req.user;
  let daysInterval = 3;

  const dashboardData: DashboardData = await DashboardDataService(
    companyId,
    params
  );

  return res.status(200).json(dashboardData);
};

export const dashBoardTag = async (req: Request, res: Response) => {
  const params: Params = req.query;
  const dashboardData = await DashBoardTagService(params);
  return res.status(200).json(dashboardData);
};
