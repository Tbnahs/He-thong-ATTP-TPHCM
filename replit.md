# ATTP TP.HCM

Cổng thông tin an toàn thực phẩm TP.HCM với tra cứu công khai, đăng ký hồ sơ trực tuyến và khu vực quản trị xét duyệt.

## Run & Operate

- `pnpm --filter @workspace/attp-portal run dev` — run the React/Vite portal (port 23165)
- `pnpm run typecheck` — typecheck the frontend and scripts
- `pnpm run build` — typecheck and build the static frontend
- No API server or database is required. The portal runs entirely from the sample data in `artifacts/attp-portal/src/lib/mock-data.ts`.

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite
- Styling: Tailwind CSS
- Data: typed local sample data

## Where things live

- `artifacts/attp-portal/src/pages/portal-pages.tsx` — public portal, registration form, admin dashboard and criteria editor
- `artifacts/attp-portal/src/components/portal-ui.tsx` — shared public/admin shells and UI patterns
- `artifacts/attp-portal/src/lib/mock-data.ts` — sample records, applications, suppliers and criteria

## Architecture decisions

- The inspection module is a frontend-only workflow backed by typed sample data and browser localStorage, matching the current no-API demo architecture.
- Inspection criteria use a single 100-point score and classify results at 100% (PASS), 80–99% (warning / temporary suspension), and below 80% (stop operation).
- The admin navigation keeps incident management as a reserved submenu entry while schedule, minutes, and criteria configuration have dedicated screens.

## Product

The portal supports public ATTP lookup and registration, an admin monitoring dashboard, facility management grouped by school / food supplier / meal provider, meal management for three-step checks, menus, and recipes, admin review of facility applications, and an inspection workflow for scheduling visits, creating scored inspection minutes, configuring weighted criteria, and exposing automatic result classifications.

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

_Populate as you build — sharp edges, "always run X before Y" rules._

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
