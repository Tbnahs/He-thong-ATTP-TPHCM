---
name: Facility history integration
description: Boundary between the frontend-only facility profile demo and future external-system synchronization.
---

Approved facility profiles are currently a frontend demonstration with typed records. The UI intentionally distinguishes data entered on the Sở portal from records received from an external facility system, but it does not imply that an API or durable storage already exists.

**Why:** Facilities may continue using their own software, so delivery and violation history must be keyed to a shared facility identity and synchronized through a formal contract rather than copied manually into the portal.

**How to apply:** Before production integration, define authentication/signing, facility and order identifiers, event timestamps, idempotency, correction rules, violation status transitions, sync acknowledgements, and error visibility. Keep the profile UI as the consumer of the normalized history shape.