---
name: Excel in frontend-only portal
description: Current spreadsheet behavior and its persistence boundary in the frontend-only ATTP portal
---

The portal generates Excel-compatible `.xls` downloads and reads real `.xlsx`, `.xls`, and CSV files in the browser with SheetJS. Imported rows still live only in the current browser session.

**Why:** The imported workspace has no backend/data API, so browser-side workbook handling provides the requested Excel flow without pretending imports are durable.

**How to apply:** If the portal needs durable imports, row-level validation errors, or multi-user visibility, add a backend import endpoint and storage; keep SheetJS at the browser boundary for workbook parsing.