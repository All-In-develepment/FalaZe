import { Router } from "express";

import * as TagController from "../controllers/TagController";

const tagsRoutes = Router();

tagsRoutes.post("/createTag/:ticketId", TagController.createTag);

export default tagsRoutes;
