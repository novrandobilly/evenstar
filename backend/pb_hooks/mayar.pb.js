/// <reference path="../pb_data/types.d.ts" />

/**
 * Route 1: Create Single Payment Request with Mayar
 * POST /api/mayar/create-payment
 */
routerAdd(
  "POST",
  "/api/mayar/create-payment",
  (e) => {
    const { handleCreatePayment } = require(`${__hooks}/mayar/createPayment.js`);
    return handleCreatePayment(e);
  },
  $apis.requireAuth()
);

/**
 * Route 2: Mayar Webhook Listener
 * POST /api/mayar/webhook
 */
routerAdd("POST", "/api/mayar/webhook", (e) => {
  const { handleWebhook } = require(`${__hooks}/mayar/webhook.js`);
  return handleWebhook(e);
});
