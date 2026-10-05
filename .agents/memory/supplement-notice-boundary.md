---
name: Supplement notice boundary
description: Distinguishes the local demo request flow from live supplement email and file delivery.
---

Keep supplement notices in this portal visibly demo-only while staff access is based on browser session state. The prototype may show an email preview, a local response link, and file metadata, but it must not claim an email was sent, a recipient was verified, or file bytes were uploaded.

**Why:** The user chose to keep the demo admin login for now. A public browser-only flow cannot securely authorize staff email actions or serve as a cross-device application record.

**How to apply:** Before enabling live email, add server-verified staff authorization and persistent request/application storage; use expiring recipient links and durable file storage. Keep the current limitations explicit until that work is completed.
