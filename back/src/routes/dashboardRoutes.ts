import express from "express";
import isAuth from "../middleware/isAuth";

import * as DashboardController from "../controllers/DashbardController";
import { DashboardAttendantsService } from "../services/ReportService/DashboardAttendants";

const routes = express.Router();

routes.get("/dashboard", isAuth, DashboardController.index);
routes.get("/dashboard/tag", isAuth, DashboardController.dashBoardTag);
routes.get(
  "/dashboard/attendants",
  isAuth,
  DashboardController.dashBoardAttendants
);

export default routes;
