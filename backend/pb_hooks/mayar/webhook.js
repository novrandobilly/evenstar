/// <reference path="../../pb_data/types.d.ts" />

const { getMayarConfig } = require(`${__hooks}/mayar/config.js`);

/**
 * Handles incoming webhooks from Mayar.
 * POST /api/mayar/webhook
 */
function handleWebhook(e) {
  try {
    const reqInfo = e.requestInfo();
    const config = getMayarConfig();

    // Verify webhook secret token via query param (?token=...) or header
    const query = reqInfo.query || {};
    const headers = reqInfo.headers || {};
    const incomingToken = query.token || headers["x-mayar-token"] || "";

    if (config.webhookToken && incomingToken !== config.webhookToken) {
      console.log("[Mayar Webhook] Unauthorized attempt with invalid token.");
      return e.json(403, { error: "Invalid webhook token." });
    }

    const body = reqInfo.body || {};
    console.log("[Mayar Webhook] Received webhook event:", JSON.stringify(body));

    const event = body.event || body.type || "";
    const data = body.data || body;

    const isSuccess =
      event === "payment.received" ||
      data.status === "SUCCESS" ||
      data.status === "paid" ||
      data.status === "PAID";

    if (!isSuccess) {
      return e.json(200, { message: "Event ignored or pending." });
    }

    // Locate the target user ID from extra metadata, transaction, or customer email
    let targetUserId =
      data.extraData?.userId ||
      data.extra?.userId ||
      data.metadata?.userId ||
      data.customer?.extra?.userId ||
      "";

    let userRecord = null;

    if (targetUserId) {
      try {
        userRecord = $app.findRecordById("users", targetUserId);
      } catch (_) {}
    }

    // Fallback: search user by customer email
    const customerEmail = data.customer?.email || data.email;
    if (!userRecord && customerEmail) {
      try {
        userRecord = $app.findFirstRecordByFilter("users", "email = {:email}", {
          email: customerEmail,
        });
      } catch (_) {}
    }

    if (!userRecord) {
      console.log("[Mayar Webhook] No matching user found for data:", JSON.stringify(data));
      return e.json(404, { error: "User not found for this payment." });
    }

    // 1. Upgrade user tier to 'pro' (lifetime access: subscription_expires_at is cleared)
    userRecord.set("tier", "pro");
    userRecord.set("subscription_expires_at", "");
    $app.save(userRecord);

    console.log("[Mayar Webhook] Successfully upgraded user", userRecord.id, "to PRO tier!");

    // 2. Record or update transaction in payments collection
    try {
      const paymentId = data.id || data.transactionId || "";
      let paymentRec = null;

      try {
        paymentRec = $app.findFirstRecordByFilter(
          "payments",
          "mayar_payment_id = {:pid} || (user = {:uid} && status = 'pending')",
          { pid: paymentId, uid: userRecord.id }
        );
      } catch (_) {}

      if (!paymentRec) {
        const paymentsCol = $app.findCollectionByNameOrId("payments");
        paymentRec = new Record(paymentsCol);
        paymentRec.set("user", userRecord.id);
      }

      paymentRec.set("status", "success");
      paymentRec.set("amount", data.amount || config.price);
      paymentRec.set("mayar_payment_id", paymentId);
      paymentRec.set("payment_method", data.paymentMethod || data.channel || "qris");
      paymentRec.set("payload", body);
      $app.save(paymentRec);
    } catch (payErr) {
      console.log("[Mayar Webhook] Warning: Failed to save payment record:", payErr);
    }

    return e.json(200, {
      success: true,
      message: "User upgraded to pro successfully.",
    });
  } catch (err) {
    console.log("[Mayar Webhook] Handler error:", err);
    return e.json(500, {
      error: "Internal error processing webhook.",
      details: String(err),
    });
  }
}

module.exports = {
  handleWebhook,
};
