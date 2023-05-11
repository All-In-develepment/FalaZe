import { Router } from "express";

import * as TagController from "../controllers/TagController";

const tagsRoutes = Router();

tagsRoutes.post("/createTag/:ticketId", TagController.createTag);
tagsRoutes.put("/updateTag/:ticketId", TagController.updateTag);
tagsRoutes.get("/getOneTag/:ticketId", TagController.getOneTag);
tagsRoutes.get("/getAllTag", TagController.getAllTag);
tagsRoutes.delete("/deleteTag/:ticketId", TagController.removeTag);

export default tagsRoutes;
