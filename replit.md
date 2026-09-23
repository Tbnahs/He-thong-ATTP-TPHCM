# ATTP TP.HCM

Cổng thông tin an toàn thực phẩm TP.HCM với tra cứu công khai, đăng ký hồ sơ trực tuyến và khu vực quản trị xét duyệt.

## Run & Operate

- `pnpm --filter @workspace/attp-portal run dev` — run the React/Vite portal (port 23165)
- `pnpm run typecheck` — typecheck the frontend and scripts
- `pnpm run build` — typecheck and build the static frontend
- No API server or database is required. The portal runs entirely from typed sample data plus browser `localStorage`/`sessionStorage`; uploaded files are represented by their local file names.

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite
- Styling: Tailwind CSS
- Data: typed local sample data

## Where things live

- `artifacts/attp-portal/src/pages/portal-pages.tsx` — public portal, registration form, admin dashboard and criteria editor
- `artifacts/attp-portal/src/pages/product-pages.tsx` — facility product declarations and Admin product appraisal/publication workflow
- `artifacts/attp-portal/src/pages/facility-profile-pages.tsx` — approved facility profiles, delivery history and violation history
- `artifacts/attp-portal/src/components/portal-ui.tsx` — shared public/admin shells and UI patterns
- `artifacts/attp-portal/src/lib/mock-data.ts` — sample records, applications, suppliers and criteria

## Architecture decisions

- The inspection module is a frontend-only workflow backed by typed sample data and browser localStorage, matching the current no-API demo architecture.
- The food-safety alert flow includes a frontend-only school notification/update demo: schools can open an alert, submit incident details and evidence names, while Sở staff can request a text-only supplement or close the case with a conclusion. State is shared through the existing browser localStorage demo.
- Inspection criteria use a single 100-point score and classify results at 100% (PASS), 80–99% (warning / temporary suspension), and below 80% (stop operation).
- The admin navigation keeps incident management as a reserved submenu entry while schedule, minutes, and criteria configuration have dedicated screens.
- Product declarations are intentionally a frontend prototype: self-declared products publish immediately, while registered declarations move through review, request-for-more-information, rejection, and approval/receipt-number states. Published records are added to the existing public lookup session data.
- Facility approval and facility profiles are separate admin modules: “Duyệt cơ sở” handles the application queue, while “Hồ sơ cơ sở” lists approved facilities and groups delivery/violation history by facility. The current implementation uses typed demo records and shows both direct portal data and external-system API data sources; a production API contract is still needed for real synchronization.

## Product

The portal supports public ATTP lookup and registration, an admin monitoring dashboard, facility approval grouped by school / food supplier / meal provider, approved facility profiles with delivery and violation history, meal management for three-step checks, menus, and recipes, admin review of facility applications, product declarations with self-declaration and registered-declaration paths, and an inspection workflow for scheduling visits, creating scored inspection minutes, configuring weighted criteria, exposing automatic result classifications, and demonstrating the school-to-Sở alert update loop.

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

_Populate as you build — sharp edges, "always run X before Y" rules._

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
