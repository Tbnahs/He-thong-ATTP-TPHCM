---
name: Supplement notice boundary
description: Distinguishes the local demo request flow from live supplement email and file delivery.
---

Send supplement requests to the linked facility account in the portal; do not create supplement emails or public recipient links. Keep the workflow visibly demo-only while staff access and records depend on browser session/local storage; do not claim cross-device delivery or that file bytes were uploaded.

**Why:** The user requested that all supplement requests go directly to the facility's account instead of email. The current portal has no authenticated server-side storage or delivery.

**How to apply:** Show requests in the linked facility account's application view, and keep account linkage as a prerequisite. Any future cross-device delivery or durable attachments need authenticated server-side authorization, persistent storage, and an explicit delivery design; never fall back to email.
