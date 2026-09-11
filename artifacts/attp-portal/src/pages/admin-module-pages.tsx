import { useMemo, useState } from "react";
import {
  ArrowUpRight,
  BarChart3,
  Building2,
  CheckCircle2,
  ClipboardCheck,
  FileText,
  Search,
  TriangleAlert,
  Utensils,
} from "lucide-react";
import { Link } from "wouter";
import {
  AdminShell,
  EmptyState,
  MetricCard,
  SectionHeading,
  StatusPill,
} from "@/components/portal-ui";

type FacilityCategory =
  | "Trường học có bếp ăn bán trú"
  | "Cơ sở cung cấp thực phẩm"
  | "Cơ sở cung cấp suất ăn";

type Facility = {
  id: string;
  name: string;
  category: FacilityCategory;
  address: string;
  contact: string;
  status: "approved" | "warning" | "stopped";
  meals: string;
};

const facilities: Facility[] = [
  {
    id: "facility-001",
    name: "Trường Tiểu học Lê Lợi",
    category: "Trường học có bếp ăn bán trú",
    address: "85 Lê Lợi, phường Bến Nghé",
    contact: "028 3822 4567",
    status: "approved",
    meals: "320 suất/ngày",
  },
  {
    id: "facility-002",
    name: "Trường Mầm non Hoa Sen",
    category: "Trường học có bếp ăn bán trú",
    address: "35 Nguyễn Du, phường Sài Gòn",
    contact: "028 3822 1122",
    status: "warning",
    meals: "180 suất/ngày",
  },
  {
    id: "facility-003",
    name: "Công ty TNHH Nông sản An Phú",
    category: "Cơ sở cung cấp thực phẩm",
    address: "184 Nguyễn Văn Linh, Quận 7",
    contact: "0908 123 456",
    status: "approved",
    meals: "—",
  },
  {
    id: "facility-004",
    name: "Hợp tác xã Rau sạch Củ Chi",
    category: "Cơ sở cung cấp thực phẩm",
    address: "Đường Tỉnh lộ 8, Củ Chi",
    contact: "0903 456 789",
    status: "approved",
    meals: "—",
  },
  {
    id: "facility-005",
    name: "Công ty Suất ăn Minh Tâm",
    category: "Cơ sở cung cấp suất ăn",
    address: "Khu công nghiệp Tân Bình",
    contact: "028 3812 8899",
    status: "approved",
    meals: "1.200 suất/ngày",
  },
  {
    id: "facility-006",
    name: "Bếp ăn tập thể An Phú",
    category: "Cơ sở cung cấp suất ăn",
    address: "12 Nguyễn Hữu Thọ, Quận 7",
    contact: "0912 555 888",
    status: "stopped",
    meals: "650 suất/ngày",
  },
];

const categoryOptions: Array<"Tất cả" | FacilityCategory> = [
  "Tất cả",
  "Trường học có bếp ăn bán trú",
  "Cơ sở cung cấp thực phẩm",
  "Cơ sở cung cấp suất ăn",
];

const mealData = {
  "three-step": {
    eyebrow: "Quản lý bữa ăn",
    title: "Kiểm thực 3 bước",
    description:
      "Theo dõi việc kiểm tra nguyên liệu đầu vào, quá trình chế biến và lưu mẫu thức ăn tại các cơ sở.",
    icon: ClipboardCheck,
    columns: ["Cơ sở", "Ngày kiểm", "Người thực hiện", "Bước 1", "Bước 2", "Bước 3"],
    rows: [
      ["Trường Tiểu học Lê Lợi", "10/09/2026", "Nguyễn Thị Lan", "Đạt", "Đạt", "Đạt"],
      ["Trường Mầm non Hoa Sen", "10/09/2026", "Trần Minh Hoàng", "Đạt", "Đạt", "Thiếu mẫu"],
      ["Bếp ăn tập thể An Phú", "09/09/2026", "Lê Thị Hạnh", "Không đạt", "Đạt", "Không đạt"],
    ],
  },
  menus: {
    eyebrow: "Quản lý bữa ăn",
    title: "Thực đơn và suất ăn",
    description:
      "Quản lý thực đơn theo tuần, số lượng suất ăn và tình trạng phê duyệt của từng cơ sở.",
    icon: Utensils,
    columns: ["Cơ sở", "Tuần áp dụng", "Số suất/ngày", "Thực đơn", "Trạng thái"],
    rows: [
      ["Trường Tiểu học Lê Lợi", "Tuần 37 · 08–12/09", "320", "Cơm + món mặn + canh", "Đã duyệt"],
      ["Trường Mầm non Hoa Sen", "Tuần 37 · 08–12/09", "180", "Cháo / cơm theo lứa tuổi", "Chờ duyệt"],
      ["Công ty Suất ăn Minh Tâm", "Tuần 37 · 08–12/09", "1.200", "Suất ăn công nghiệp", "Đã duyệt"],
    ],
  },
  recipes: {
    eyebrow: "Quản lý bữa ăn",
    title: "Món ăn và quy trình chế biến",
    description:
      "Danh mục món ăn, định lượng nguyên liệu và quy trình chế biến đang áp dụng tại các bếp ăn.",
    icon: FileText,
    columns: ["Tên món ăn", "Nhóm món", "Định lượng", "Quy trình", "Cập nhật"],
    rows: [
      ["Thịt kho trứng", "Món mặn", "120g/suất", "Đã ban hành", "05/09/2026"],
      ["Canh rau củ thịt bằm", "Món canh", "180ml/suất", "Đã ban hành", "05/09/2026"],
      ["Cá basa sốt cà", "Món mặn", "100g/suất", "Đang rà soát", "02/09/2026"],
      ["Cháo gà rau củ", "Món cho trẻ", "250ml/suất", "Đã ban hành", "01/09/2026"],
    ],
  },
} as const;

function categoryShortName(category: FacilityCategory) {
  return category === "Trường học có bếp ăn bán trú"
    ? "Trường học"
    : category === "Cơ sở cung cấp thực phẩm"
      ? "Cung cấp thực phẩm"
      : "Cung cấp suất ăn";
}

export function AdminMonitoringDashboard() {
  return (
    <AdminShell>
      <div className="mx-auto max-w-7xl px-5 py-9 lg:px-10">
        <SectionHeading
          eyebrow="Tổng quan giám sát"
          title="Dashboard giám sát."
          description="Theo dõi nhanh tình trạng cơ sở, hồ sơ đăng ký và hoạt động kiểm tra an toàn thực phẩm."
          action={
            <Link
              href="/admin/inspections/schedule"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-bold text-primary-foreground"
            >
              <ClipboardCheck size={17} /> Xem lịch kiểm tra
            </Link>
          }
        />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard label="Tổng số cơ sở" value="48" icon={Building2} tone="green" />
          <MetricCard label="Hồ sơ chờ xử lý" value="12" icon={FileText} tone="gold" />
          <MetricCard label="Tỷ lệ đạt tháng này" value="84%" icon={CheckCircle2} tone="blue" />
          <MetricCard label="Cảnh báo cần xử lý" value="03" icon={TriangleAlert} tone="orange" />
        </div>
        <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_.9fr]">
          <section className="rounded-3xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="mono-label text-primary">PHÂN BỐ CƠ SỞ</p>
                <h2 className="mt-2 text-xl font-extrabold">Tình hình theo loại hình</h2>
              </div>
              <BarChart3 className="text-primary" size={22} />
            </div>
            <div className="mt-6 space-y-5">
              {[
                ["Trường học có bếp ăn bán trú", 22, "bg-primary"],
                ["Cơ sở cung cấp thực phẩm", 14, "bg-sky-500"],
                ["Cơ sở cung cấp suất ăn", 12, "bg-amber-500"],
              ].map(([label, value, color]) => (
                <div key={label as string}>
                  <div className="flex justify-between gap-4 text-sm font-bold">
                    <span>{label}</span>
                    <span>{value}</span>
                  </div>
                  <div className="mt-2 h-3 rounded-full bg-secondary">
                    <div
                      className={`h-3 rounded-full ${color}`}
                      style={{ width: `${(Number(value) / 48) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
          <section className="rounded-3xl border border-border bg-card p-6 shadow-sm">
            <p className="mono-label text-primary">CẦN QUAN TÂM</p>
            <h2 className="mt-2 text-xl font-extrabold">Cảnh báo gần đây</h2>
            <div className="mt-5 space-y-3">
              {[
                ["Trường Mầm non Hoa Sen", "86% · cần đánh giá lại", "warning"],
                ["Bếp ăn tập thể An Phú", "72% · đang tạm dừng", "stopped"],
                ["03 hồ sơ đăng ký quá hạn xử lý", "Cập nhật hôm nay", "pending"],
              ].map(([title, text, status]) => (
                <div key={title} className="flex items-start gap-3 rounded-2xl bg-secondary/50 p-4">
                  <TriangleAlert size={17} className="mt-0.5 shrink-0 text-amber-600" />
                  <div className="min-w-0">
                    <p className="text-sm font-bold">{title}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{text}</p>
                  </div>
                  <StatusPill status={status} />
                </div>
              ))}
            </div>
          </section>
        </div>
        <section className="mt-6 rounded-3xl border border-border bg-card p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="mono-label text-primary">HOẠT ĐỘNG GẦN NHẤT</p>
              <h2 className="mt-2 text-xl font-extrabold">Theo dõi nghiệp vụ</h2>
            </div>
            <Link href="/admin/applications/pending" className="text-sm font-bold text-primary hover:underline">
              Xem hồ sơ đăng ký <ArrowUpRight className="inline" size={15} />
            </Link>
          </div>
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            {[
              ["12", "Hồ sơ đăng ký trong tuần", "bg-emerald-50 text-emerald-900"],
              ["08", "Lịch kiểm tra đã hoàn tất", "bg-sky-50 text-sky-900"],
              ["03", "Biên bản cần khắc phục", "bg-amber-50 text-amber-900"],
            ].map(([value, label, className]) => (
              <div key={label} className={`rounded-2xl p-4 ${className}`}>
                <p className="font-mono text-3xl font-extrabold">{value}</p>
                <p className="mt-1 text-sm font-semibold">{label}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </AdminShell>
  );
}

export function AdminBlankPage() {
  return <AdminShell><div aria-hidden="true" /></AdminShell>;
}

export function AdminFacilitiesPage() {
  const [category, setCategory] = useState<(typeof categoryOptions)[number]>("Tất cả");
  const [search, setSearch] = useState("");
  const filtered = useMemo(
    () =>
      facilities.filter(
        (facility) =>
          (category === "Tất cả" || facility.category === category) &&
          `${facility.name} ${facility.address}`
            .toLowerCase()
            .includes(search.toLowerCase()),
      ),
    [category, search],
  );
  return (
    <AdminShell>
      <div className="mx-auto max-w-7xl px-5 py-9 lg:px-10">
        <SectionHeading
          eyebrow="Quản lý cơ sở"
          title="Danh sách cơ sở."
          description="Tra cứu và theo dõi các trường học có bếp ăn bán trú, cơ sở cung cấp thực phẩm và cơ sở cung cấp suất ăn."
        />
        <div className="grid gap-4 md:grid-cols-3">
          <MetricCard label="Trường học" value="22" icon={Building2} tone="green" />
          <MetricCard label="Cung cấp thực phẩm" value="14" icon={FileText} tone="blue" />
          <MetricCard label="Cung cấp suất ăn" value="12" icon={Utensils} tone="gold" />
        </div>
        <div className="mt-8 overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
          <div className="flex flex-col gap-3 border-b border-border p-5 lg:flex-row lg:items-center">
            <label className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Tìm tên cơ sở, địa chỉ..."
                className="focus-ring h-11 w-full rounded-xl border border-input bg-background pl-9 pr-3 text-sm"
              />
            </label>
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value as (typeof categoryOptions)[number])}
              className="focus-ring h-11 rounded-xl border border-input bg-background px-3 text-sm font-semibold"
            >
              {categoryOptions.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </div>
          {filtered.length ? (
            <div className="divide-y divide-border">
              {filtered.map((facility) => (
                <div key={facility.id} className="flex flex-col gap-4 px-5 py-5 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex min-w-0 items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary">
                      <Building2 size={19} />
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-extrabold">{facility.name}</h3>
                        <StatusPill status={facility.status} />
                      </div>
                      <p className="mt-1 text-xs font-semibold text-primary">{categoryShortName(facility.category)}</p>
                      <p className="mt-1 text-sm text-muted-foreground">{facility.address} · {facility.contact}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-6 lg:justify-end">
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Quy mô suất ăn</p>
                      <p className="font-bold">{facility.meals}</p>
                    </div>
                    <button type="button" className="inline-flex items-center gap-1 text-sm font-bold text-primary hover:underline">
                      Xem hồ sơ <ArrowUpRight size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState title="Không có cơ sở phù hợp" description="Thử thay đổi loại hình hoặc từ khóa tìm kiếm." />
          )}
        </div>
      </div>
    </AdminShell>
  );
}

type MealPageKey = keyof typeof mealData;

export function AdminMealManagementPage({ page }: { page: MealPageKey }) {
  const config = mealData[page];
  const Icon = config.icon;
  const [search, setSearch] = useState("");
  const rows = config.rows.filter((row) =>
    row.join(" ").toLowerCase().includes(search.toLowerCase()),
  );
  return (
    <AdminShell>
      <div className="mx-auto max-w-7xl px-5 py-9 lg:px-10">
        <SectionHeading
          eyebrow={config.eyebrow}
          title={`${config.title}.`}
          description={config.description}
          action={
            <button type="button" className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-bold text-primary-foreground">
              <Icon size={17} /> Thêm dữ liệu
            </button>
          }
        />
        <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
          <div className="border-b border-border p-5">
            <div className="relative max-w-md">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder={`Tìm trong ${config.title.toLowerCase()}...`}
                className="focus-ring h-11 w-full rounded-xl border border-input bg-background pl-9 pr-3 text-sm"
              />
            </div>
          </div>
          {rows.length ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead className="bg-secondary/50 text-xs uppercase tracking-wide text-muted-foreground">
                  <tr>
                    {config.columns.map((column) => (
                      <th key={column} className="px-5 py-4 font-extrabold">{column}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {rows.map((row, index) => (
                    <tr key={`${row[0]}-${index}`} className="hover:bg-secondary/20">
                      {row.map((value, cellIndex) => (
                        <td key={`${value}-${cellIndex}`} className="px-5 py-4 font-semibold">
                          {cellIndex === row.length - 1 && (value === "Đã duyệt" || value === "Đạt" || value === "Đã ban hành") ? (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-900">
                              <CheckCircle2 size={13} /> {value}
                            </span>
                          ) : (
                            value
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState title="Không tìm thấy dữ liệu" description="Thử thay đổi từ khóa tìm kiếm." />
          )}
        </div>
      </div>
    </AdminShell>
  );
}