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

_Populate as you build — non-obvious choices a reader couldn't infer from the code (3-5 bullets)._

## Product

_Describe the high-level user-facing capabilities of this app once they exist._

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

_Populate as you build — sharp edges, "always run X before Y" rules._

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
