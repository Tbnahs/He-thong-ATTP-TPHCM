---
name: Attachment preview storage
description: Storage boundary for uploaded file previews in the browser-only portal
---

Keep attachment bytes in IndexedDB for local previews and store only a reference in registration metadata; do not put PDF bytes or base64 payloads in sessionStorage. Browser-local files are not shared with officers on other devices.

**Why:** Registration state uses browser storage with limited quota, and officers need honest visibility into whether a record contains the original file.

**How to apply:** For cross-device or multi-user review, move file bytes to authenticated server-side/object storage and persist an access-controlled reference. For sample or legacy records that only contain a filename, show that the original content is unavailable rather than generating a substitute.
