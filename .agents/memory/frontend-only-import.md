---
name: Frontend-only workspace cleanup
description: Imported workspaces may retain backend TypeScript project references after API and database removal.
---

When converting an imported full-stack workspace to a frontend-only sample app, remove backend packages and their TypeScript references together, then keep the Vite port and base path explicit for local builds. Do not leave a manual dev server running on the artifact's managed port.

**Why:** A removed workspace package can still break typecheck through a dangling project reference even when no source file imports it.

**How to apply:** After deleting backend packages, search for their names across tsconfig and workspace manifests before running the frontend checks. For preview failures reporting a port collision, stop old shell-launched servers before restarting the managed artifact workflow.