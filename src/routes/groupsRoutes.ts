import { Router } from "express";

import * as GroupsController from "../controllers/GroupsController";

const groupsRoutes = Router();

groupsRoutes.post("/fzGroupsCreate", GroupsController.createGroup);
groupsRoutes.post("/fzGroupsUpdateTitle", GroupsController.updateGroupTitle);
groupsRoutes.post(
  "/fzGroupsUpdateDescription",
  GroupsController.updateGroupDescription
);
groupsRoutes.post("/fzCloseGroups", GroupsController.closeGroup);
groupsRoutes.post("/fzOpenGroups", GroupsController.openGroup);
groupsRoutes.post("/fzSendGroupsMessage", GroupsController.sendGroupMessage);
groupsRoutes.post(
  "/fzSendGroupsMessageNASA",
  GroupsController.sendGroupMessageNASA
);
groupsRoutes.get("/fzGroups", GroupsController.getGroupsAdmin);

export default groupsRoutes;
