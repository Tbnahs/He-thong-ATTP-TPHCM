import { useMemo, useState } from "react";
import {
  ArrowUpRight,
  BarChart3,
  Building2,
  CalendarRange,
  CheckCircle2,
  ClipboardCheck,
  Download,
  FileText,
  MapPin,
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
  const alertRows = [
    ["MN Sao Mai", "Không tuân thủ món ăn", "08/09/2026", "Khẩn cấp", "urgent"],
    ["TH Nguyễn Huệ", "Nhập nguyên liệu thiếu hóa đơn/chứng từ", "08/09/2026", "Khẩn cấp", "urgent"],
    ["MN Hoa Sen", "Nhiệt độ đồ đông sai lệch", "08/09/2026", "Cao", "high"],
    ["TH Lê Lợi", "Thiếu chứng từ nhập hàng", "08/09/2026", "Trung bình", "medium"],
    ["Mầm non 19/5", "Dụng cụ chưa vệ sinh", "08/09/2026", "Khẩn cấp", "urgent"],
    ["THCS Minh Khai", "Trùng ngộ độc với điểm", "08/09/2026", "Cao", "high"],
  ];
  const mapPins = [
    { left: "23%", top: "45%" },
    { left: "37%", top: "32%" },
    { left: "52%", top: "55%" },
    { left: "61%", top: "39%" },
    { left: "72%", top: "60%" },
    { left: "43%", top: "72%" },
    { left: "79%", top: "31%" },
  ];
  const linePoints = [
    [0, 74],
    [16, 55],
    [32, 68],
    [48, 42],
    [64, 47],
    [80, 24],
    [100, 52],
  ]
    .map(([x, y]) => `${x},${y}`)
    .join(" ");
  const scoreBars = [44, 52, 47, 70, 64, 82, 75];
  const riskSlices = [
    { label: "Lưu mẫu", value: "32%", color: "#f97316" },
    { label: "Nguồn gốc", value: "24%", color: "#facc15" },
    { label: "Vệ sinh", value: "14%", color: "#ec4899" },
    { label: "Chứng nhận", value: "18%", color: "#6366f1" },
  ];

  return (
    <AdminShell>
      <div className="mx-auto max-w-[1600px] px-4 py-5 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
          <div className="grid gap-3 md:grid-cols-[1fr_1fr_auto] md:items-end">
            <label className="block">
              <span className="mb-1.5 flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-[.12em] text-muted-foreground">
                <CalendarRange size={13} /> Khoảng thời gian
              </span>
              <select className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm font-semibold outline-none focus:ring-2 focus:ring-primary/20">
                <option>Hôm nay</option>
                <option>7 ngày qua</option>
                <option>Tháng này</option>
              </select>
            </label>
            <label className="block">
              <span className="mb-1.5 text-[10px] font-extrabold uppercase tracking-[.12em] text-muted-foreground">
                Loại hình trường
              </span>
              <select className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm font-semibold outline-none focus:ring-2 focus:ring-primary/20">
                <option>Tất cả</option>
                <option>Trường học có bếp ăn</option>
                <option>Cơ sở cung cấp suất ăn</option>
              </select>
            </label>
            <button
              type="button"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <Download size={15} /> Xuất báo cáo nhanh
            </button>
          </div>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            ["Tổng trường quản lý", "14", "Bến Nghé", "text-primary", Building2],
            ["Suất ăn phục vụ hôm nay", "3.180", "11.430 lượt", "text-primary", Utensils],
            ["Cảnh báo đang mở", "6", "Cần xử lý ngay", "text-red-600", TriangleAlert],
            ["Sự cố đang xử lý", "1", "Mức Sai Sót", "text-amber-600", CheckCircle2],
          ].map(([label, value, note, tone, Icon]) => (
            <div key={label as string} className="rounded-2xl border border-border bg-card p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <p className="text-xs font-bold text-muted-foreground">{label as string}</p>
                <span className={`rounded-lg bg-secondary p-2 ${tone as string}`}>
                  <Icon size={17} />
                </span>
              </div>
              <div className="mt-3 flex items-end justify-between gap-2">
                <p className={`text-3xl font-black tracking-tight ${tone as string}`}>{value as string}</p>
                <span className="text-right text-[10px] font-bold text-muted-foreground">{note as string}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-[.9fr_1.7fr]">
          <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <h2 className="flex items-center gap-2 text-sm font-extrabold">
                <MapPin size={16} className="text-primary" /> Bản đồ số ATTP
              </h2>
              <span className="flex items-center gap-1 text-[10px] font-semibold text-muted-foreground">
                <span className="h-2 w-2 rounded-full bg-emerald-500" /> Đạt
                <span className="ml-2 h-2 w-2 rounded-full bg-amber-400" /> Cảnh báo
              </span>
            </div>
            <div className="relative h-[270px] overflow-hidden bg-[#dce5ea]">
              <div
                className="absolute inset-0 opacity-60"
                style={{
                  backgroundImage:
                    "linear-gradient(30deg, transparent 47%, #aabcc5 48%, #aabcc5 49%, transparent 50%), linear-gradient(120deg, transparent 46%, #b6c7ce 47%, #b6c7ce 48%, transparent 49%), linear-gradient(#c9d5da 1px, transparent 1px), linear-gradient(90deg, #c9d5da 1px, transparent 1px)",
                  backgroundSize: "150px 120px, 190px 160px, 34px 34px, 34px 34px",
                }}
              />
              <div className="absolute left-[20%] top-[15%] h-[72%] w-[58%] rotate-12 rounded-[38%_62%_48%_52%] border-2 border-white/75 bg-slate-400/20" />
              <div className="absolute left-[42%] top-[28%] h-28 w-36 -rotate-12 rounded-[45%] border border-white/80 bg-slate-500/20" />
              <span className="absolute left-[42%] top-[16%] text-xs font-extrabold text-slate-500/80">HANOI</span>
              {mapPins.map((pin, index) => (
                <MapPin
                  key={`${pin.left}-${pin.top}`}
                  size={index === 2 ? 25 : 20}
                  fill={index === 2 ? "#ef4444" : "#ef4444"}
                  className="absolute -translate-x-1/2 -translate-y-full text-red-500 drop-shadow-sm"
                  style={{ left: pin.left, top: pin.top }}
                />
              ))}
              <div className="absolute bottom-3 right-3 flex flex-col overflow-hidden rounded-lg border border-white bg-white/90 shadow-sm">
                <button type="button" className="px-2 py-1 text-lg leading-none text-slate-500">+</button>
                <button type="button" className="border-t border-slate-200 px-2 py-1 text-lg leading-none text-slate-500">−</button>
              </div>
            </div>
          </section>

          <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
            <div className="flex items-center justify-between border-b border-border bg-red-50/70 px-4 py-3">
              <h2 className="flex items-center gap-2 text-sm font-extrabold text-red-700">
                <TriangleAlert size={16} /> Danh sách cảnh báo đỏ
              </h2>
              <span className="rounded-full bg-red-600 px-2 py-1 text-[9px] font-extrabold text-white">MỚI NHẤT</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[650px] text-left text-xs">
                <thead className="bg-secondary/70 text-[9px] font-extrabold uppercase tracking-wide text-muted-foreground">
                  <tr>
                    <th className="px-4 py-2.5">Trường</th>
                    <th className="px-4 py-2.5">Nội dung cảnh báo</th>
                    <th className="px-4 py-2.5">Thời gian</th>
                    <th className="px-4 py-2.5">Mức ưu tiên</th>
                    <th className="px-4 py-2.5 text-right">Hành động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {alertRows.map(([school, issue, time, priority, severity]) => (
                    <tr key={school} className="hover:bg-secondary/30">
                      <td className="px-4 py-3 font-bold">{school}</td>
                      <td className="px-4 py-3">
                        <span className="rounded-md bg-red-50 px-2 py-1 text-[10px] font-semibold text-red-600">{issue}</span>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{time}</td>
                      <td className={`px-4 py-3 font-bold ${severity === "urgent" ? "text-red-600" : severity === "high" ? "text-orange-600" : "text-amber-600"}`}>{priority}</td>
                      <td className="px-4 py-3 text-right">
                        <button type="button" className="rounded-md bg-red-600 px-3 py-1 text-[10px] font-extrabold text-white hover:bg-red-700">BÁO CÁO</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Link href="/admin/inspections/incidents" className="block border-t border-border py-2 text-center text-[10px] font-bold text-muted-foreground hover:text-primary">
              Xem tất cả 24 cảnh báo →
            </Link>
          </section>
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-3">
          <section className="rounded-2xl border border-border bg-card p-4 shadow-sm">
            <h2 className="text-xs font-extrabold">Kiểm thực 3 bước theo tháng</h2>
            <div className="mt-4 flex h-40 items-end gap-2 border-b border-l border-border px-2 pb-1 pt-3">
              <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full overflow-visible">
                <polyline points={linePoints} fill="rgba(249,115,22,.12)" stroke="none" />
                <polyline points={linePoints} fill="none" stroke="#f97316" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
                {linePoints.split(" ").map((point) => {
                  const [cx, cy] = point.split(",");
                  return <circle key={point} cx={cx} cy={cy} r="1.5" fill="#f97316" />;
                })}
              </svg>
            </div>
            <div className="mt-2 flex justify-between pl-2 text-[9px] text-muted-foreground">
              {["T1", "T2", "T3", "T4", "T5", "T6", "T7"].map((month) => <span key={month}>{month}</span>)}
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-card p-4 shadow-sm">
            <h2 className="text-xs font-extrabold">Số đợt kiểm tra theo tháng</h2>
            <div className="mt-4 flex h-40 items-end justify-around gap-2 border-b border-l border-border px-3 pb-1 pt-3">
              {scoreBars.map((height, index) => (
                <div key={height + index} className="flex h-full flex-1 items-end justify-center">
                  <div className={`w-full max-w-8 rounded-t-sm ${index > 4 ? "bg-indigo-500" : "bg-slate-300"}`} style={{ height: `${height}%` }} />
                </div>
              ))}
            </div>
            <div className="mt-2 flex justify-around text-[9px] text-muted-foreground">
              {["T1", "T2", "T3", "T4", "T5", "T6", "T7"].map((month) => <span key={month}>{month}</span>)}
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-card p-4 shadow-sm">
            <h2 className="text-xs font-extrabold">Top 5 lỗi thường gặp (%)</h2>
            <div className="mt-4 flex items-center gap-5">
              <div
                className="relative h-32 w-32 shrink-0 rounded-full"
                style={{ background: "conic-gradient(#f97316 0 32%, #facc15 32% 56%, #ec4899 56% 70%, #6366f1 70% 88%, #cbd5e1 88% 100%)" }}
              >
                <div className="absolute inset-7 flex items-center justify-center rounded-full bg-card text-center text-[10px] font-bold text-muted-foreground">
                  Tỷ lệ<br />lỗi
                </div>
              </div>
              <div className="grid gap-2 text-[10px] font-semibold text-muted-foreground">
                {riskSlices.map((slice) => (
                  <span key={slice.label} className="flex items-center gap-2">
                    <i className="h-2 w-2 rounded-sm" style={{ backgroundColor: slice.color }} />
                    {slice.label} <b className="text-foreground">{slice.value}</b>
                  </span>
                ))}
              </div>
            </div>
          </section>
        </div>

        <section className="mt-4 rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="mono-label text-primary">HOẠT ĐỘNG GẦN NHẤT</p>
              <h2 className="mt-1 text-lg font-extrabold">Theo dõi nghiệp vụ</h2>
            </div>
            <Link href="/admin/applications/pending" className="inline-flex items-center gap-1 text-sm font-bold text-primary hover:underline">
              Xem hồ sơ đăng ký <ArrowUpRight size={15} />
            </Link>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
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