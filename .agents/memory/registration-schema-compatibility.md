---
name: Registration schema compatibility
description: The registration form follows the two confirmed customer survey forms while preserving historical applications.
---

The new registration flow should expose only “Cơ sở giáo dục” and “Cơ sở chế biến và cung cấp suất ăn”. The legacy “food-supplier” type remains in the application/schema model so historical applications, review records, and published profiles continue to render.

**Why:** Removing the legacy type globally would make existing snapshots and older records unreadable, while leaving it as a new registration choice would conflict with the customer-approved forms.

**How to apply:** Add future fields to the confirmed school or meal-provider criteria sets. Keep compatibility fallbacks for old keys in submit, review, and profile mapping code; do not delete the legacy type unless a migration for stored snapshots exists.