import express from "express";
import isAuth from "../middleware/isAuth";

import * as ContactListItemController from "../controllers/ContactListItemController";

import * as ContactListItemService from "../services/ContactListItemService/CreateServiceFromContacts";

const routes = express.Router();

routes.get(
  "/contact-list-items/list",
  isAuth,
  ContactListItemController.findList
);

routes.get("/contact-list-items", isAuth, ContactListItemController.index);

routes.get("/contact-list-items/:id", isAuth, ContactListItemController.show);

routes.post("/contact-list-items", isAuth, ContactListItemController.store);

routes.put("/contact-list-items/:id", isAuth, ContactListItemController.update);

routes.post(
  "/contact-list-items-db/",
  ContactListItemController.createListItemFromContacts
);

routes.delete(
  "/contact-list-items/:id",
  isAuth,
  ContactListItemController.remove
);

export default routes;
