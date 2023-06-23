import express from "express";
import isAuth from "../middleware/isAuth";

import * as ReportController from "../controllers/ReportController";

const routes = express.Router();

routes.get("/report", ReportController.getReport);

export default routes;
