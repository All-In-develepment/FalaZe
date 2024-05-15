import express from "express";
import isAuth from "../middleware/isAuth";
import * as AsaasController from "../controllers/AsaasController";

const asaasRoutes = express.Router();

asaasRoutes.post("/invoices/asaas", isAuth, AsaasController.asaasPayments);
asaasRoutes.post("/webhook/payment", AsaasController.receivedPaymentAsaas);
asaasRoutes.post("/webhook/payment", AsaasController.receivedPaymentAsaas);
asaasRoutes.post(
  "/invoices/asaas/sub-account",
  AsaasController.asaasCreateSubAccount
);

export default asaasRoutes;
