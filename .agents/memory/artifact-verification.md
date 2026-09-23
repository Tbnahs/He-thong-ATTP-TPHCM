---
name: Artifact verification
description: Workspace dependency hydration and manual build requirements for artifact previews
---

Use the existing pnpm lockfile to hydrate an imported workspace before running checks. When running an artifact's Vite build outside its managed workflow, provide both the artifact's configured `PORT` and `BASE_PATH`; the managed workflow supplies them automatically.

**Why:** The package-install helper is for adding language packages, not for installing all workspace dependencies, and this artifact's Vite config intentionally fails without explicit routing environment values.

**How to apply:** Prefer `pnpm install --frozen-lockfile` for missing workspace dependencies, then run checks with `PORT=<localPort> BASE_PATH=<previewPath>` from the artifact metadata.