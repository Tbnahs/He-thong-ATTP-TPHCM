---
name: Facility account controls
description: Rules for account actions in the approved facility profile list.
---

Keep profile-list actions as accessible icon buttons. Resetting a facility password must change only the linked account's password to the same initial default used when facility accounts are created.

**Why:** the user asked for icon-based actions and clarified that reset means restoring the account's initial default password.

**How to apply:** resolve the account linked to that facility, update only its password, and keep the button's accessible label/tooltip explicit about resetting to the initial default.

Approved profiles without a linked account should receive one idempotent demo account so the lock and password-reset controls work. Use the application ID as the username, the established initial default password, and only a real email from saved data.

**Why:** the user chose to create accounts for approved profiles that are missing one; existing login accepts the account username even when no email was saved.

**How to apply:** create missing accounts once from the approved profile snapshot, preserve existing account state, and never invent an email address.
