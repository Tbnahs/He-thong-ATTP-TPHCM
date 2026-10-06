---
name: Registration schema compatibility
description: The registration form follows the two confirmed customer survey forms while preserving historical applications.
---

The new registration flow should expose only “Cơ sở giáo dục” and “Cơ sở chế biến và cung cấp suất ăn”. The legacy “food-supplier” type remains in the application/schema model so historical applications, review records, and published profiles continue to render.

**Why:** Removing the legacy type globally would make existing snapshots and older records unreadable, while leaving it as a new registration choice would conflict with the customer-approved forms.

**How to apply:** Add future fields to the confirmed school or meal-provider criteria sets. Keep compatibility fallbacks for old keys in submit, review, and profile mapping code; do not delete the legacy type unless a migration for stored snapshots exists.

The review and approved-profile screens must mirror the form actually submitted for each facility type, including repeated entries and supporting files. If an older record lacks a separate form snapshot, reconstruct it only from saved registration data; if the data is absent, state that clearly rather than showing a fabricated or empty form. School-specific model forms must use the same saved form data and conditional visibility in review and profile screens.

**Why:** The user requires registration, review, and approved facility management to stay consistent for all three facility types; reviewers must also see all declared content without omissions.

**How to apply:** When a registration field is added or changed, update its saved submission data and use the same saved schema/visibility rules in review and approved-profile rendering. Preserve access to old records and surface missing historical data explicitly.

The approved facility management list should seed demo approvals from the current school and meal-provider forms, not outdated approval fixtures. Retire only known demo rows; keep real browser-saved approvals and legacy record compatibility.

**Why:** The user asked to remove the old reviewed demo profiles and show several approved examples based on the current registration forms.

**How to apply:** Keep fixture cleanup narrowly scoped to known demo IDs, and generate replacement approved examples from the current criteria sets for both active registration types.

An application is approved only when its reviewer record includes the officer’s full name, position, phone, email, signature, and review time. Pending applications must not carry reviewer sign-off. Do not invent an officer identity for an older approval that lacks this information; return it to an unreviewed state until it can be signed correctly. When an active account has permission to review applications, prefill its details but let the officer edit them before approval.

**Why:** The user requires clear accountability for each approval, while demo and older browser-stored records may not contain a real sign-off.

**How to apply:** Validate all sign-off fields at the approval action, persist the sign-off with the application, and treat incomplete historical approvals as unreviewed rather than fabricating reviewer details.

Every route that can approve an application must use the same sign-off-validated review flow. Redirect legacy review URLs instead of keeping a parallel approval path.

**Why:** A second review page can bypass the required officer identity and signature even when the primary flow validates them.

**How to apply:** Keep one approval action path; when older routes remain for compatibility, send them to the canonical signed-review page.

The application-review workflow has exactly three statuses: pending, needs-more-info, and approved. Do not add rejection, warning, or stopped states to application records. Other modules may use their own monitoring statuses. When loading legacy application records with an unsupported status, normalize them to pending and clear stale review sign-off/publication state.

**Why:** The user explicitly limited “Duyệt hồ sơ” to “Chờ duyệt”, “Yêu cầu bổ sung”, and “Đã duyệt”.

**How to apply:** Keep the application type, sample data, review actions, filters, exports, and legacy-storage normalization aligned with those three statuses. Keep unrelated facility-monitoring and product-review status models separate.

In the school application list, show grade level and student count from the submitted registration data. Do not substitute meal-demand values for either field; meal demand is not a list column.

**Why:** The user asked for those two values to reflect what applicants entered on their form and to remove the demand column.

**How to apply:** Read the current and legacy school form keys from each saved application or stored registration account when building review rows.

For “Yêu cầu bổ sung”, retain the reviewing officer’s required contact details separately from the final approval sign-off. The facility must be able to see who requested the information; “needs more info” is a reviewed outcome, but not an approval.

**Why:** The user requires reviewer name, position, phone, and email during review, and those details must remain visible to the facility without misrepresenting the record as approved.

**How to apply:** Store the supplemental-review contact with the request and the application; use it for the facility notice. Keep the signed approval reviewer record reserved for approved applications.