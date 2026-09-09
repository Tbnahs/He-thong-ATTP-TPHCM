# ATTP TP.HCM

Cổng thông tin an toàn thực phẩm TP.HCM với tra cứu công khai, đăng ký hồ sơ trực tuyến và khu vực quản trị xét duyệt.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm --filter @workspace/attp-portal run dev` — run the React/Vite portal (port 23165)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string
- The managed Replit preview starts the portal and API artifact workflows automatically.

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/attp-portal/src/pages/portal-pages.tsx` — public portal, registration form, admin dashboard and criteria editor
- `artifacts/attp-portal/src/components/portal-ui.tsx` — shared public/admin shells and UI patterns
- `artifacts/api-server/src/lib/criteria-data.ts` — criteria groups, fields, answer types and versioning rules
- `lib/api-spec/openapi.yaml` — API contract source of truth
- `lib/db/src/schema/` — PostgreSQL/Drizzle schema definitions

## Architecture decisions

_Populate as you build — non-obvious choices a reader couldn't infer from the code (3-5 bullets)._

## Product

_Describe the high-level user-facing capabilities of this app once they exist._

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

_Populate as you build — sharp edges, "always run X before Y" rules._

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
