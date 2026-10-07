/// <reference path="../../pb_data/types.d.ts" />

const { getMayarConfig } = require(`${__hooks}/mayar/config.js`);

/**
 * Handles creation of a single payment request via Mayar Headless API v2.
 * POST /api/mayar/create-payment
 */
function handleCreatePayment(e) {
  const authRecord = e.auth;
  if (!authRecord) {
    return e.json(401, { error: "Authentication required." });
  }

  const config = getMayarConfig();
  if (!config.apiKey) {
    console.log("[Mayar] Missing MAYAR_API_KEY in backend environment");
    return e.json(500, { error: "Mayar payment gateway is not configured." });
  }

  const userId = authRecord.id;
  const userEmail = authRecord.get("email");
  const userName = authRecord.get("name") || authRecord.get("username") || userEmail || "Kickserve Host";

  // Check if client requested a specific plan code, default to lifetime
  const reqInfo = e.requestInfo();
  const body = reqInfo.body || {};
  const requestedPlanCode = body.planCode || "pro_lifetime";

  let planPrice = config.price;
  let planName = "Kickserve Pro Lifetime";

  try {
    let planRec = null;
    if (requestedPlanCode) {
      try {
        planRec = $app.findFirstRecordByFilter(
          "plans",
          "is_active = true && code = {:code}",
          { code: requestedPlanCode }
        );
      } catch (_) {}
    }
    if (!planRec) {
      try {
        planRec = $app.findFirstRecordByFilter(
          "plans",
          "is_active = true && billing_cycle = 'lifetime'"
        );
      } catch (_) {}
    }

    if (planRec) {
      planPrice = planRec.getInt("price") || planRec.get("price") || config.price;
      planName = planRec.getString("name") || planName;
    }
  } catch (err) {
    console.log("[Mayar] Could not find active plan in database, fallback to config:", err);
  }

  const paymentPayload = {
    name: "Kickserve Pro - " + userName + " #" + Math.floor(1000 + Math.random() * 9000),
    amount: planPrice,
    email: userEmail,
    description: planName + " (32 Players, Rosters & Club Branding)",
    extraData: {
      userId: userId,
      planCode: requestedPlanCode,
    },
  };

  console.log(
    "[Mayar] Requesting payment link for user:",
    userId,
    "amount:",
    planPrice,
    "plan:",
    planName,
    "endpoint:",
    config.baseUrl + "/hl/v2/payments/create"
  );

  try {
    const response = $http.send({
      url: config.baseUrl + "/hl/v2/payments/create",
      method: "POST",
      body: JSON.stringify(paymentPayload),
      headers: {
        Authorization: "Bearer " + config.apiKey,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      timeout: 60,
    });

    if (response.statusCode >= 400) {
      console.log(
        "[Mayar] API error status:",
        response.statusCode,
        "body:",
        toString(response.body)
      );
      return e.json(response.statusCode, {
        error: "Failed to create payment with Mayar.",
        details: response.json || toString(response.body),
      });
    }

    const resData = response.json || {};
    const data = resData.data || resData;
    const paymentUrl = data.link || data.url || data.paymentUrl || data.checkoutUrl;
    const paymentId = data.id || data.paymentId || "";

    if (!paymentUrl) {
      console.log("[Mayar] No paymentUrl returned in response:", JSON.stringify(resData));
      return e.json(502, {
        error: "No payment link returned by payment provider.",
        details: resData,
      });
    }

    // Record pending transaction in database for tracking
    try {
      const paymentsCol = $app.findCollectionByNameOrId("payments");
      const paymentRec = new Record(paymentsCol);
      paymentRec.set("user", userId);
      paymentRec.set("amount", planPrice);
      paymentRec.set("status", "pending");
      paymentRec.set("mayar_payment_id", paymentId);
      paymentRec.set("payload", resData);
      $app.save(paymentRec);
    } catch (dbErr) {
      console.log("[Mayar] Warning: Failed to record pending payment record:", dbErr);
    }

    return e.json(200, {
      success: true,
      paymentUrl: paymentUrl,
      paymentId: paymentId,
    });
  } catch (err) {
    console.log("[Mayar] Network or execution error:", err);
    return e.json(500, {
      error: "Internal server error creating payment link.",
    });
  }
}

module.exports = {
  handleCreatePayment,
};
