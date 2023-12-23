import { DashBoardTagService } from "./../services/ReportService/DashboardTagService";
import { Request, Response } from "express";

import DashboardDataService, {
  DashboardData,
  Params
} from "../services/ReportService/DashbardDataService";
import { DashboardAttendantsService } from "../services/ReportService/DashboardAttendants";

export const index = async (req: Request, res: Response): Promise<Response> => {
  const params: Params = req.query;
  const { companyId } = req.user;
  let daysInterval = 3;

  const dashboardData: DashboardData = await DashboardDataService(
    companyId,
    params
  );

  console.log(dashboardData);

  return res.status(200).json(dashboardData);
};

export const dashBoardTag = async (req: Request, res: Response) => {
  const params: Params = req.query;
  const dashboardData = await DashBoardTagService(params);
  return res.status(200).json(dashboardData);
};

export const dashBoardAttendants = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { days: day, date_from, date_to, companyId }: Params = req.query;

  console.log({ date_from, date_to, day });

  const days = parseInt(`${day}`.replace(/\D/g, ""), 10);

  const attendants = await DashboardAttendantsService({
    days,
    date_from,
    date_to,
    companyId
  });

  return res.status(200).json(attendants);
};
