import express from "express";
import isAuth from "../middleware/isAuth";

import * as SubscriptionController from "../controllers/SubscriptionController";
import { isAuthWebhook } from "../middleware/isAuthWebhook";

const subscriptionRoutes = express.Router();
subscriptionRoutes.post(
  "/subscription",
  isAuth,
  SubscriptionController.createSubscription
);
subscriptionRoutes.post(
  "/subscription/create/webhook",
  SubscriptionController.createWebhook
);
subscriptionRoutes.post(
  "/subscription/webhook/:type?",
  SubscriptionController.webhook
);
// subscriptionRoutes.post(
//   "/subscription/webhook/:type?",
//   isAuthWebhook,
//   SubscriptionController.webhook
// );

export default subscriptionRoutes;
