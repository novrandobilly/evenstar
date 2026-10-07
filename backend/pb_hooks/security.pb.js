/// <reference path="../pb_data/types.d.ts" />

/**
 * Security hook: prevents regular users from mutating their own
 * 'tier' and 'subscription_expires_at' fields directly via client API requests.
 */
onRecordUpdateRequest((e) => {
  if (!e.hasSuperuserAuth()) {
    const original = e.record.original();
    if (original) {
      const currentTier = e.record.get("tier");
      const originalTier = original.get("tier");
      if (currentTier !== originalTier) {
        throw new BadRequestError("Modifying subscription tier directly is not allowed.");
      }

      const currentExpires = e.record.get("subscription_expires_at");
      const originalExpires = original.get("subscription_expires_at");
      if (currentExpires !== originalExpires) {
        throw new BadRequestError("Modifying subscription expiration directly is not allowed.");
      }
    }
  }

  e.next();
}, "users");
