import express from "express";
import isAuth from "../middleware/isAuth";
import * as QueueOptionController from "../controllers/QueueOptionController";
import * as InvoicesController from "../controllers/InvoicesController";
import { createPixKey } from "../services/AssasService/CreatePixKey";
import { getPixKey } from "../services/AssasService/GetPixKey";

const invoiceRoutes = express.Router();

invoiceRoutes.get("/invoices", isAuth, InvoicesController.index);
invoiceRoutes.get("/invoices/list", InvoicesController.list);
invoiceRoutes.get("/invoices/all", isAuth, InvoicesController.list);
invoiceRoutes.get("/invoices/:Invoiceid", isAuth, InvoicesController.show);
invoiceRoutes.put("/invoices/:id", isAuth, InvoicesController.update);

invoiceRoutes.post("/create_pix", createPixKey);
invoiceRoutes.get("/get_pix", getPixKey);

export default invoiceRoutes;
