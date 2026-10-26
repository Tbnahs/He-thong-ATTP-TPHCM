---
name: Address workflow scope
description: Product rules for structured address entry, filtering, reporting, and transaction locations.
---

All address-related workflows must use a shared structured administrative-unit selection, not free-text-only locality fields. Apply this across registration and every affected downstream feature, including facility lists, reports, inspections, and alerts. Non-transactional filters use the facility headquarters; food delivery, receipt, and other inbound/outbound transaction views filter by the actual transaction location.

**Why:** The user explained that consistent location selection at registration is the source data needed for reliable downstream filtering, reporting, and alerts.

**How to apply:** Reuse the same administrative-unit dataset and stable codes across forms, saved records, filters, and APIs. Keep the facility headquarters distinct from each operational address so each view filters the correct location. Convert existing text-only records to the structured flow and review records that cannot be mapped reliably.
