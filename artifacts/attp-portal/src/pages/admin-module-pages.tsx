import { useMemo, useState } from "react";
import {
  ArrowUpRight,
  BarChart3,
  Building2,
  CalendarDays,
  CalendarRange,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  CircleDollarSign,
  ClipboardCheck,
  Download,
  Flame,
  FileText,
  MapPin,
  PieChart,
  Search,
  SlidersHorizontal,
  TriangleAlert,
  Utensils,
  X,
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
    columns: [
      "Cơ sở",
      "Ngày kiểm",
      "Người thực hiện",
      "Bước 1",
      "Bước 2",
      "Bước 3",
    ],
    rows: [
      [
        "Trường Tiểu học Lê Lợi",
        "10/09/2026",
        "Nguyễn Thị Lan",
        "Đạt",
        "Đạt",
        "Đạt",
      ],
      [
        "Trường Mầm non Hoa Sen",
        "10/09/2026",
        "Trần Minh Hoàng",
        "Đạt",
        "Đạt",
        "Thiếu mẫu",
      ],
      [
        "Bếp ăn tập thể An Phú",
        "09/09/2026",
        "Lê Thị Hạnh",
        "Không đạt",
        "Đạt",
        "Không đạt",
      ],
    ],
  },
  menus: {
    eyebrow: "Quản lý bữa ăn",
    title: "Thực đơn và suất ăn",
    description:
      "Quản lý thực đơn theo tuần, số lượng suất ăn và tình trạng phê duyệt của từng cơ sở.",
    icon: Utensils,
    columns: [
      "Cơ sở",
      "Tuần áp dụng",
      "Số suất/ngày",
      "Thực đơn",
      "Trạng thái",
    ],
    rows: [
      [
        "Trường Tiểu học Lê Lợi",
        "Tuần 37 · 08–12/09",
        "320",
        "Cơm + món mặn + canh",
        "Đã duyệt",
      ],
      [
        "Trường Mầm non Hoa Sen",
        "Tuần 37 · 08–12/09",
        "180",
        "Cháo / cơm theo lứa tuổi",
        "Chờ duyệt",
      ],
      [
        "Công ty Suất ăn Minh Tâm",
        "Tuần 37 · 08–12/09",
        "1.200",
        "Suất ăn công nghiệp",
        "Đã duyệt",
      ],
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
      [
        "Canh rau củ thịt bằm",
        "Món canh",
        "180ml/suất",
        "Đã ban hành",
        "05/09/2026",
      ],
      ["Cá basa sốt cà", "Món mặn", "100g/suất", "Đang rà soát", "02/09/2026"],
      [
        "Cháo gà rau củ",
        "Món cho trẻ",
        "250ml/suất",
        "Đã ban hành",
        "01/09/2026",
      ],
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
  const [activeTab, setActiveTab] = useState<"suppliers" | "schools">("suppliers");
  const [schoolLevel, setSchoolLevel] = useState("Tất cả cấp học");
  const alertRows = [
    [
      "MN Hoa Sen",
      "Nhập nguyên liệu thiếu hóa đơn/chứng từ",
      "08/09/2026",
      "Khẩn cấp",
      "urgent",
    ],
    [
      "THCS Minh Khai",
      "Số lượng suất ăn không khớp với dữ liệu thực tế",
      "08/09/2026",
      "Cao",
      "high",
    ],
    ["MN Hoa Sen", "Chưa lưu mẫu món ăn", "08/09/2026", "Khẩn cấp", "urgent"],
    [
      "TH Lê Lợi",
      "Thiếu hình ảnh/minh chứng khi lưu mẫu",
      "08/09/2026",
      "Cao",
      "high",
    ],
    [
      "Bếp ăn An Phú",
      "Thiếu hình ảnh/minh chứng khi hủy mẫu",
      "08/09/2026",
      "Cao",
      "high",
    ],
    [
      "MN Sao Mai",
      "Nghi ngờ ngộ độc thực phẩm (có phản ánh phụ huynh gửi tới trường)",
      "08/09/2026",
      "Khẩn cấp",
      "urgent",
    ],
    [
      "TH Nguyễn Huệ",
      "Chưa kiểm tra vệ sinh khu vực bếp",
      "08/09/2026",
      "Cao",
      "high",
    ],
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
  const schoolLevelStats: Record<string, { schools: string; demand: string; updated: string; alerts: string }> = {
    "Tất cả cấp học": { schools: "14", demand: "3.180", updated: "11/14", alerts: "6" },
    "Mầm non": { schools: "05", demand: "920", updated: "04/05", alerts: "2" },
    "Cấp 1": { schools: "05", demand: "1.420", updated: "04/05", alerts: "3" },
    "Cấp 2": { schools: "03", demand: "640", updated: "02/03", alerts: "1" },
    "Cấp 3": { schools: "01", demand: "200", updated: "01/01", alerts: "0" },
  };
  const cards = activeTab === "suppliers"
    ? [
        ["Tổng cơ sở cung cấp", "06", "04 đạt · 01 cảnh báo · 01 chưa đạt", "text-primary", Building2],
        ["Tổng công suất cung cấp", "1.850", "suất ăn/ngày", "text-primary", Utensils],
        ["Tổng nhu cầu đã đăng ký", "1.620", "suất ăn/ngày", "text-sky-600", ClipboardCheck],
        ["Cân bằng cung - nhu cầu", "+230", "Dư công suất", "text-emerald-600", CheckCircle2],
      ]
    : [
        ["Tổng cơ sở giáo dục", schoolLevelStats[schoolLevel].schools, "Theo cấp học", "text-primary", Building2],
        ["Tổng nhu cầu suất ăn", schoolLevelStats[schoolLevel].demand, "suất ăn/ngày", "text-primary", Utensils],
        ["Đã cập nhật nhu cầu", schoolLevelStats[schoolLevel].updated, "cơ sở giáo dục", "text-sky-600", ClipboardCheck],
        ["Cảnh báo đang mở", schoolLevelStats[schoolLevel].alerts, "Cần xử lý ngay", "text-red-600", TriangleAlert],
      ];

  return (
    <AdminShell>
      <div className="mx-auto max-w-[1600px] px-4 py-5 sm:px-6 lg:px-8">
        <section className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="mono-label text-primary">DASHBOARD GIÁM SÁT</p>
              <h1 className="mt-1 text-xl font-extrabold">Theo dõi cung - cầu suất ăn</h1>
              <p className="mt-1 text-sm text-muted-foreground">Tách riêng dữ liệu cơ sở cung cấp và cơ sở giáo dục để theo dõi đúng nhu cầu quản lý.</p>
            </div>
            <div className="flex rounded-xl bg-secondary p-1" role="tablist" aria-label="Phạm vi dashboard">
              {[
                ["suppliers", "Cơ sở cung cấp suất ăn"],
                ["schools", "Cơ sở giáo dục"],
              ].map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  role="tab"
                  aria-selected={activeTab === value}
                  onClick={() => setActiveTab(value as "suppliers" | "schools")}
                  className={`rounded-lg px-3 py-2 text-xs font-bold transition-colors sm:px-4 ${activeTab === value ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                  data-testid={`tab-dashboard-${value}`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          {activeTab === "schools" && (
            <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-border pt-4">
              <label htmlFor="dashboard-school-level" className="text-xs font-bold text-muted-foreground">Lọc theo cấp học</label>
              <select id="dashboard-school-level" value={schoolLevel} onChange={(event) => setSchoolLevel(event.target.value)} className="rounded-lg border border-border bg-background px-3 py-2 text-xs font-semibold" data-testid="select-dashboard-school-level">
                {Object.keys(schoolLevelStats).map((level) => <option key={level}>{level}</option>)}
              </select>
            </div>
          )}
        </section>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {cards.map(([label, value, note, tone, Icon]) => (
            <div
              key={label as string}
              className="rounded-2xl border border-border bg-card p-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <p className="text-xs font-bold text-muted-foreground">
                  {label as string}
                </p>
                <span
                  className={`rounded-lg bg-secondary p-2 ${tone as string}`}
                >
                  <Icon size={17} />
                </span>
              </div>
              <div className="mt-3 flex items-end justify-between gap-2">
                <p
                  className={`text-3xl font-black tracking-tight ${tone as string}`}
                >
                  {value as string}
                </p>
                <span className="text-right text-[10px] font-bold text-muted-foreground">
                  {note as string}
                </span>
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
                <span className="ml-2 h-2 w-2 rounded-full bg-amber-400" /> Cảnh
                báo
              </span>
            </div>
            <div className="relative h-[270px] overflow-hidden bg-[#dce5ea]">
              <div
                className="absolute inset-0 opacity-60"
                style={{
                  backgroundImage:
                    "linear-gradient(30deg, transparent 47%, #aabcc5 48%, #aabcc5 49%, transparent 50%), linear-gradient(120deg, transparent 46%, #b6c7ce 47%, #b6c7ce 48%, transparent 49%), linear-gradient(#c9d5da 1px, transparent 1px), linear-gradient(90deg, #c9d5da 1px, transparent 1px)",
                  backgroundSize:
                    "150px 120px, 190px 160px, 34px 34px, 34px 34px",
                }}
              />
              <div className="absolute left-[20%] top-[15%] h-[72%] w-[58%] rotate-12 rounded-[38%_62%_48%_52%] border-2 border-white/75 bg-slate-400/20" />
              <div className="absolute left-[42%] top-[28%] h-28 w-36 -rotate-12 rounded-[45%] border border-white/80 bg-slate-500/20" />
              <span className="absolute left-[42%] top-[16%] text-xs font-extrabold text-slate-500/80">
                Hồ Chí Minh{" "}
              </span>
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
                <button
                  type="button"
                  className="px-2 py-1 text-lg leading-none text-slate-500"
                >
                  +
                </button>
                <button
                  type="button"
                  className="border-t border-slate-200 px-2 py-1 text-lg leading-none text-slate-500"
                >
                  −
                </button>
              </div>
            </div>
          </section>

          <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
            <div className="flex items-center justify-between border-b border-border bg-red-50/70 px-4 py-3">
              <h2 className="flex items-center gap-2 text-sm font-extrabold text-red-700">
                <TriangleAlert size={16} /> Danh sách cảnh báo đỏ
              </h2>
              <span className="rounded-full bg-red-600 px-2 py-1 text-[9px] font-extrabold text-white">
                MỚI NHẤT
              </span>
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
                  {alertRows.map(
                    ([school, issue, time, priority, severity]) => (
                      <tr key={`${school}-${issue}-${time}`} className="hover:bg-secondary/30">
                        <td className="px-4 py-3 font-bold">{school}</td>
                        <td className="px-4 py-3">
                          <span className="rounded-md bg-red-50 px-2 py-1 text-[10px] font-semibold text-red-600">
                            {issue}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {time}
                        </td>
                        <td
                          className={`px-4 py-3 font-bold ${severity === "urgent" ? "text-red-600" : severity === "high" ? "text-orange-600" : "text-amber-600"}`}
                        >
                          {priority}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            type="button"
                            className="rounded-md bg-red-600 px-3 py-1 text-[10px] font-extrabold text-white hover:bg-red-700"
                          >
                            BÁO CÁO
                          </button>
                        </td>
                      </tr>
                    ),
                  )}
                </tbody>
              </table>
            </div>
            <Link
              href="/admin/inspections/incidents"
              className="block border-t border-border py-2 text-center text-[10px] font-bold text-muted-foreground hover:text-primary"
            >
              Xem tất cả 24 cảnh báo →
            </Link>
          </section>
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-3">
          <section className="rounded-2xl border border-border bg-card p-4 shadow-sm">
            <h2 className="text-xs font-extrabold">
              Kiểm thực 3 bước theo tháng
            </h2>
            <div className="mt-4 flex h-40 items-end gap-2 border-b border-l border-border px-2 pb-1 pt-3">
              <svg
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                className="h-full w-full overflow-visible"
              >
                <polyline
                  points={linePoints}
                  fill="rgba(249,115,22,.12)"
                  stroke="none"
                />
                <polyline
                  points={linePoints}
                  fill="none"
                  stroke="#f97316"
                  strokeWidth="1.5"
                  vectorEffect="non-scaling-stroke"
                />
                {linePoints.split(" ").map((point) => {
                  const [cx, cy] = point.split(",");
                  return (
                    <circle
                      key={point}
                      cx={cx}
                      cy={cy}
                      r="1.5"
                      fill="#f97316"
                    />
                  );
                })}
              </svg>
            </div>
            <div className="mt-2 flex justify-between pl-2 text-[9px] text-muted-foreground">
              {["T1", "T2", "T3", "T4", "T5", "T6", "T7"].map((month) => (
                <span key={month}>{month}</span>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-card p-4 shadow-sm">
            <h2 className="text-xs font-extrabold">
              Số đợt kiểm tra theo tháng
            </h2>
            <div className="mt-4 flex h-40 items-end justify-around gap-2 border-b border-l border-border px-3 pb-1 pt-3">
              {scoreBars.map((height, index) => (
                <div
                  key={height + index}
                  className="flex h-full flex-1 items-end justify-center"
                >
                  <div
                    className={`w-full max-w-8 rounded-t-sm ${index > 4 ? "bg-indigo-500" : "bg-slate-300"}`}
                    style={{ height: `${height}%` }}
                  />
                </div>
              ))}
            </div>
            <div className="mt-2 flex justify-around text-[9px] text-muted-foreground">
              {["T1", "T2", "T3", "T4", "T5", "T6", "T7"].map((month) => (
                <span key={month}>{month}</span>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-card p-4 shadow-sm">
            <h2 className="text-xs font-extrabold">Top 5 lỗi thường gặp (%)</h2>
            <div className="mt-4 flex items-center gap-5">
              <div
                className="relative h-32 w-32 shrink-0 rounded-full"
                style={{
                  background:
                    "conic-gradient(#f97316 0 32%, #facc15 32% 56%, #ec4899 56% 70%, #6366f1 70% 88%, #cbd5e1 88% 100%)",
                }}
              >
                <div className="absolute inset-7 flex items-center justify-center rounded-full bg-card text-center text-[10px] font-bold text-muted-foreground">
                  Tỷ lệ
                  <br />
                  lỗi
                </div>
              </div>
              <div className="grid gap-2 text-[10px] font-semibold text-muted-foreground">
                {riskSlices.map((slice) => (
                  <span key={slice.label} className="flex items-center gap-2">
                    <i
                      className="h-2 w-2 rounded-sm"
                      style={{ backgroundColor: slice.color }}
                    />
                    {slice.label}{" "}
                    <b className="text-foreground">{slice.value}</b>
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
              <h2 className="mt-1 text-lg font-extrabold">
                Theo dõi nghiệp vụ
              </h2>
            </div>
            <Link
              href="/admin/applications/pending"
              className="inline-flex items-center gap-1 text-sm font-bold text-primary hover:underline"
            >
              Xem hồ sơ đăng ký <ArrowUpRight size={15} />
            </Link>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {[
              [
                "12",
                "Hồ sơ đăng ký trong tuần",
                "bg-emerald-50 text-emerald-900",
              ],
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
  return (
    <AdminShell>
      <div aria-hidden="true" />
    </AdminShell>
  );
}

export function AdminFacilitiesPage() {
  const [category, setCategory] =
    useState<(typeof categoryOptions)[number]>("Tất cả");
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
          <MetricCard
            label="Trường học"
            value="22"
            icon={Building2}
            tone="green"
          />
          <MetricCard
            label="Cung cấp thực phẩm"
            value="14"
            icon={FileText}
            tone="blue"
          />
          <MetricCard
            label="Cung cấp suất ăn"
            value="12"
            icon={Utensils}
            tone="gold"
          />
        </div>
        <div className="mt-8 overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
          <div className="flex flex-col gap-3 border-b border-border p-5 lg:flex-row lg:items-center">
            <label className="relative flex-1">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Tìm tên cơ sở, địa chỉ..."
                className="focus-ring h-11 w-full rounded-xl border border-input bg-background pl-9 pr-3 text-sm"
              />
            </label>
            <select
              value={category}
              onChange={(event) =>
                setCategory(
                  event.target.value as (typeof categoryOptions)[number],
                )
              }
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
                <div
                  key={facility.id}
                  className="flex flex-col gap-4 px-5 py-5 lg:flex-row lg:items-center lg:justify-between"
                >
                  <div className="flex min-w-0 items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary">
                      <Building2 size={19} />
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-extrabold">{facility.name}</h3>
                        <StatusPill status={facility.status} />
                      </div>
                      <p className="mt-1 text-xs font-semibold text-primary">
                        {categoryShortName(facility.category)}
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {facility.address} · {facility.contact}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-6 lg:justify-end">
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">
                        Quy mô suất ăn
                      </p>
                      <p className="font-bold">{facility.meals}</p>
                    </div>
                    <button
                      type="button"
                      className="inline-flex items-center gap-1 text-sm font-bold text-primary hover:underline"
                    >
                      Xem hồ sơ <ArrowUpRight size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              title="Không có cơ sở phù hợp"
              description="Thử thay đổi loại hình hoặc từ khóa tìm kiếm."
            />
          )}
        </div>
      </div>
    </AdminShell>
  );
}

type MealPageKey = keyof typeof mealData;

type MenuRecord = {
  id: string;
  weekday: string;
  day: string;
  month: string;
  year: string;
  school: string;
  ward: string;
  ageGroup: string;
  menuName: string;
  servingCount: number;
  servedCount: number;
  price: string;
  otherCost: string;
  menuIncome: string;
  menuExpense: string;
  lunch: string;
  snack: string;
  afternoon: string;
  calories: string;
  caloriesRange: string;
  macros: string;
  macroRange: string;
};

const menuRecords: MenuRecord[] = [
  {
    id: "menu-2026-01-02-nha-tre",
    weekday: "THỨ 2",
    day: "02",
    month: "Tháng 01",
    year: "2026",
    school: "TRƯỜNG MẦM NON HOA HỒNG",
    ward: "Phường Bến Nghé",
    ageGroup: "NHÀ TRẺ 18–36 THÁNG",
    menuName: "Thực đơn A",
    servingCount: 150,
    servedCount: 150,
    price: "24.000đ",
    otherCost: "0đ",
    menuIncome: "24.000đ",
    menuExpense: "24.000đ",
    lunch: "Cơm; Canh thịt gà nấu bí xanh; Thịt lợn, trứng vịt đảo bông (Tráng miệng quả cam)",
    snack: "Sữa chua nuti",
    afternoon: "Phở bò nấu cà chua, hành lá",
    calories: "641",
    caloriesRange: "600 – 651",
    macros: "14 : 48 : 38",
    macroRange: "13-20 : 30-40 : 47-50",
  },
  {
    id: "menu-2026-01-02-mam-non",
    weekday: "THỨ 2",
    day: "02",
    month: "Tháng 01",
    year: "2026",
    school: "TRƯỜNG MẦM NON HOA HỒNG",
    ward: "Phường Bến Nghé",
    ageGroup: "MẦM NON 2–3 TUỔI",
    menuName: "Thực đơn A",
    servingCount: 150,
    servedCount: 150,
    price: "24.000đ",
    otherCost: "0đ",
    menuIncome: "24.000đ",
    menuExpense: "24.000đ",
    lunch: "Cơm; Canh thịt gà nấu bí xanh; Thịt lợn, trứng vịt đảo bông (Tráng miệng quả cam)",
    snack: "Sữa chua nuti",
    afternoon: "Phở bò nấu cà chua, hành lá",
    calories: "641",
    caloriesRange: "600 – 651",
    macros: "14 : 48 : 38",
    macroRange: "13-20 : 30-40 : 47-50",
  },
  {
    id: "menu-2026-01-03-tieu-hoc",
    weekday: "THỨ 3",
    day: "03",
    month: "Tháng 01",
    year: "2026",
    school: "TRƯỜNG TIỂU HỌC LÊ LỢI",
    ward: "Phường Bến Nghé",
    ageGroup: "TIỂU HỌC 6–10 TUỔI",
    menuName: "Thực đơn B",
    servingCount: 320,
    servedCount: 318,
    price: "28.000đ",
    otherCost: "500đ",
    menuIncome: "28.000đ",
    menuExpense: "26.500đ",
    lunch: "Cơm gạo lứt; Cá basa sốt cà; Canh rau củ thịt bằm (Tráng miệng chuối)",
    snack: "Bánh mì phô mai",
    afternoon: "Cháo gà rau củ",
    calories: "702",
    caloriesRange: "650 – 750",
    macros: "16 : 46 : 38",
    macroRange: "15-20 : 30-40 : 40-50",
  },
];

function MenuFilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="block min-w-0">
      <span className="meal-field-label mb-2 block text-[10px] font-extrabold uppercase tracking-[0.08em] text-slate-500">
        {label}
      </span>
      <span className="relative block">
        <select
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="meal-field-control h-11 w-full appearance-none rounded-lg border border-slate-200 bg-[#fbfcfd] px-3 pr-9 text-xs font-semibold text-slate-600 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
        >
          {options.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
        <ChevronDown
          size={15}
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
        />
      </span>
    </label>
  );
}

function MealLine({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "lunch" | "snack" | "afternoon";
}) {
  const toneClasses = {
    lunch: "border-emerald-100 bg-emerald-50 text-emerald-700",
    snack: "border-amber-100 bg-amber-50 text-amber-700",
    afternoon: "border-indigo-100 bg-indigo-50 text-indigo-700",
  };
  return (
      <div className="meal-detail-meal-row flex items-start gap-3">
      <span
        className={`mt-0.5 inline-flex shrink-0 items-center rounded-full border px-3 py-1.5 text-[10px] font-extrabold ${toneClasses[tone]}`}
      >
        {label}
      </span>
      <p className="pt-1 text-xs font-semibold leading-5 text-slate-700">{value}</p>
    </div>
  );
}

function formatSchoolName(value: string) {
  const normalized = value.toLocaleLowerCase("vi-VN");
  return normalized.replace(/^trường/, "Trường");
}

function MenuCard({
  menu,
  onDetails,
}: {
  menu: MenuRecord;
  onDetails: () => void;
}) {
  return (
    <article className="meal-menu-card group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_8px_24px_rgba(15,23,42,.04)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgba(15,23,42,.09)]">
      <div className="grid lg:grid-cols-[270px_minmax(0,1fr)]">
        <div className="meal-menu-card__meta border-b border-slate-100 p-5 lg:border-b-0 lg:border-r">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-[.12em] text-orange-600">{menu.weekday}</p>
              <p className="mt-1 text-4xl font-black tracking-tight text-slate-900">
                {menu.day}<span className="ml-1 text-sm font-bold text-slate-400">/ 01</span>
              </p>
            </div>
            <span className="rounded-lg bg-orange-50 p-2.5 text-orange-600"><CalendarDays size={18} /></span>
          </div>
          <div className="mt-5">
            <p className="text-sm font-black text-slate-900 normal-case">{formatSchoolName(menu.school)}</p>
            <p className="mt-1 text-[11px] font-semibold text-slate-400">{menu.ward}</p>
            <span className="mt-3 inline-flex rounded-full bg-blue-50 px-2.5 py-1.5 text-[10px] font-extrabold text-blue-700">{menu.ageGroup}</span>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-2">
            <div className="rounded-lg bg-slate-50 p-3">
              <p className="text-[9px] font-extrabold uppercase text-slate-400">Suất ăn</p>
              <p className="mt-1 text-base font-black text-slate-800">{menu.servedCount}</p>
            </div>
            <div className="rounded-lg bg-slate-50 p-3">
              <p className="text-[9px] font-extrabold uppercase text-slate-400">Calo</p>
              <p className="mt-1 text-base font-black text-slate-800">{menu.calories}<span className="text-[9px] font-bold text-slate-400"> kcal</span></p>
            </div>
          </div>
        </div>

        <div className="meal-menu-card__body p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-[.12em] text-slate-400">Thực đơn trong ngày</p>
              <h2 className="mt-1 text-xl font-black tracking-tight text-slate-900">{menu.menuName}</h2>
            </div>
            <button type="button" onClick={onDetails} className="hidden items-center gap-1 text-xs font-extrabold text-orange-600 sm:inline-flex">
              Chi tiết <ChevronRight size={15} />
            </button>
          </div>
          <div className="mt-5 grid gap-3">
            {[
              { label: "BỮA TRƯA", value: menu.lunch, rowClass: "border-emerald-100 bg-emerald-50/60", labelClass: "text-emerald-700" },
              { label: "BỮA PHỤ", value: menu.snack, rowClass: "border-amber-100 bg-amber-50/60", labelClass: "text-amber-700" },
              { label: "BỮA CHIỀU", value: menu.afternoon, rowClass: "border-indigo-100 bg-indigo-50/60", labelClass: "text-indigo-700" },
            ].map(({ label, value, rowClass, labelClass }) => (
              <div key={label} className={`flex items-start gap-3 rounded-xl border p-3 ${rowClass}`}>
                <span className={`min-w-[72px] rounded-md bg-white px-2 py-1 text-center text-[9px] font-extrabold ${labelClass}`}>{label}</span>
                <p className="text-xs font-semibold leading-5 text-slate-700">{value}</p>
              </div>
            ))}
          </div>
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-dashed border-slate-200 pt-4">
            <div className="flex items-center gap-2 text-[11px] font-bold text-slate-500">
              <span className="rounded-md bg-orange-50 p-1.5 text-orange-500"><Flame size={14} /></span>
              Năng lượng trong ngưỡng
            </div>
            <div className="flex items-center gap-2 text-[11px] font-bold text-slate-500">
              <span className="rounded-md bg-blue-50 p-1.5 text-blue-500"><PieChart size={14} /></span>
              PLG <b className="text-slate-800">{menu.macros}</b>
            </div>
            <button type="button" onClick={onDetails} className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-slate-900 px-3 py-2 text-[11px] font-extrabold text-white transition hover:bg-orange-600 sm:w-auto">
              Xem chi tiết <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

function MenuDetailDialog({
  menu,
  onClose,
}: {
  menu: MenuRecord;
  onClose: () => void;
}) {
  return (
    <div className="meal-detail-overlay fixed inset-0 z-40 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="menu-detail-title">
      <div className="meal-detail-dialog max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-[#f3f4f6] shadow-2xl">
        <div className="meal-detail-dialog__header sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4 sm:px-7">
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-orange-600">Chi tiết thực đơn</p>
            <h2 id="menu-detail-title" className="mt-1 text-lg font-black text-slate-900">{menu.menuName} · {menu.school}</h2>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:border-orange-300 hover:text-orange-600" aria-label="Đóng chi tiết thực đơn"><X size={18} /></button>
        </div>
        <div className="meal-detail-dialog__content space-y-4 p-4 sm:p-7">
          <section className="meal-detail-card meal-detail-summary rounded-xl border border-slate-200 bg-white p-5">
            <div className="meal-detail-section-heading">
              <span aria-hidden="true" />
              <h3>Chi tiết thực đơn</h3>
            </div>
            <div className="meal-detail-summary-grid mt-4 grid gap-3 sm:grid-cols-4">
              {[
                ["Ngày áp dụng", `${menu.day} ${menu.month} ${menu.year}`],
                ["Lứa tuổi", menu.ageGroup],
                ["Tổng suất ăn", `${menu.servedCount} suất`],
                ["Tiền thu 1 suất", menu.price],
              ].map(([label, value]) => (
                <div className="meal-detail-field" key={label}>
                  <p>{label}</p>
                  <div>{value}</div>
                </div>
              ))}
            </div>
          </section>
          <section className="meal-detail-card overflow-hidden rounded-xl border border-slate-200 bg-white">
            <div className="meal-detail-section-heading px-5 pt-4">
              <span aria-hidden="true" />
              <h3>Chọn món ăn theo từng buổi</h3>
            </div>
            <p className="meal-detail-section-description px-5 pt-2">Các món ăn được phê duyệt cho ngày áp dụng.</p>
            <div className="meal-detail-meals space-y-1 p-5">
              <MealLine label="BỮA TRƯA" value={menu.lunch} tone="lunch" />
              <MealLine label="BỮA PHỤ" value={menu.snack} tone="snack" />
              <MealLine label="BỮA CHIỀU" value={menu.afternoon} tone="afternoon" />
            </div>
          </section>
          <section className="meal-detail-card overflow-hidden rounded-xl border border-slate-200 bg-white">
            <div className="meal-detail-section-heading px-5 pt-4">
              <span aria-hidden="true" />
              <h3>Tổng hợp dinh dưỡng</h3>
            </div>
            <p className="meal-detail-section-description px-5 pt-2">Chỉ số dinh dưỡng được tính theo khẩu phần trong ngày.</p>
            <div className="overflow-x-auto">
              <table className="meal-detail-nutrition-table mt-3 w-full min-w-[620px] text-left text-xs">
                <thead>
                  <tr><th className="px-5 py-3">Chỉ tiêu</th><th className="px-5 py-3">Tổng cộng</th><th className="px-5 py-3">Khoảng khuyến nghị</th><th className="px-5 py-3">Đánh giá</th></tr>
                </thead>
                <tbody>
                  {[
                    ["Calo (kcal)", menu.calories, menu.caloriesRange],
                    ["Đạm (%)", "14", "13–20"],
                    ["Lipit (%)", "48", "30–40"],
                    ["Gluxit (%)", "38", "40–50"],
                  ].map(([label, total, range]) => (
                    <tr key={label}><td className="px-5 py-3 font-bold text-slate-700">{label}</td><td className="px-5 py-3 font-black text-slate-800">{total}</td><td className="px-5 py-3 text-slate-500">{range}</td><td className="px-5 py-3"><span className="font-extrabold text-emerald-600">Đạt</span></td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
          <section className="meal-detail-card meal-detail-cost rounded-xl border border-orange-100 bg-orange-50 px-5 py-4">
            <div className="meal-detail-section-heading">
              <span aria-hidden="true" />
              <h3>Cân đối chi phí</h3>
            </div>
            <div className="meal-detail-cost-grid mt-3">
              <div><span>Tiền thu</span><strong>{menu.menuIncome}</strong></div>
              <div><span>Tiền chi</span><strong>{menu.menuExpense}</strong></div>
              <div><span>Tiền thu 1 suất</span><strong>{menu.price}</strong></div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export function AdminMealManagementPage({ page }: { page: MealPageKey }) {
  const config = mealData[page];
  const Icon = config.icon;
  const [search, setSearch] = useState("");
  const [ward, setWard] = useState("Tất cả Xã/Phường");
  const [school, setSchool] = useState("Tất cả các trường");
  const [time, setTime] = useState("Chọn thời gian");
  const [selectedMenu, setSelectedMenu] = useState<MenuRecord | null>(null);
  const rows = config.rows.filter((row) =>
    row.join(" ").toLowerCase().includes(search.toLowerCase()),
  );

  if (page === "menus") {
    const filteredMenus = menuRecords.filter(
      (menu) =>
        (ward === "Tất cả Xã/Phường" || menu.ward === ward) &&
        (school === "Tất cả các trường" || menu.school === school) &&
        (time === "Chọn thời gian" || `${menu.month} ${menu.year}` === time) &&
        (!search || `${menu.school} ${menu.menuName} ${menu.ageGroup}`.toLowerCase().includes(search.toLowerCase())),
    );
    const clearFilters = () => {
      setWard("Tất cả Xã/Phường");
      setSchool("Tất cả các trường");
      setTime("Chọn thời gian");
      setSearch("");
    };
    return (
      <AdminShell>
        <div className="meal-management-page min-h-[calc(100dvh-65px)] bg-[#f9fafb]">
          <div className="meal-management-page__header border-b border-slate-200/80 bg-white px-5 py-5 lg:px-10">
            <div className="mx-auto flex max-w-[1180px] items-end justify-between gap-4">
              <div>
                <div className="mb-2 flex items-center gap-2 text-[11px] font-semibold text-slate-400">
                  <span>Quản lý bữa ăn</span><ChevronRight size={13} /><span className="text-slate-600">Danh sách thực đơn</span>
                </div>
                <h1 className="text-[24px] font-black tracking-tight text-slate-900">Danh sách thực đơn</h1>
                <p className="mt-1 text-xs font-medium text-slate-500">Chọn đúng trường và ngày để xem khẩu phần, suất ăn và dinh dưỡng.</p>
              </div>
              <div className="hidden items-center gap-2 rounded-xl bg-orange-50 px-3 py-2 text-xs font-extrabold text-orange-700 sm:flex">
                <Utensils size={15} /> {filteredMenus.length} thực đơn đang theo dõi
              </div>
            </div>
          </div>
          <div className="meal-management-page__content mx-auto max-w-[1180px] px-4 py-6 sm:px-7 lg:px-10">
            <section className="meal-filter-card rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_5px_20px_rgba(15,23,42,.035)]">
              <div className="mb-4 flex items-center gap-2 text-xs font-extrabold text-slate-800">
                <SlidersHorizontal size={15} className="text-orange-600" /> Bộ lọc thực đơn
                <span className="ml-auto text-[10px] font-semibold text-slate-400">Cập nhật hôm nay</span>
              </div>
              <div className="grid gap-3 md:grid-cols-[1fr_1fr_1fr_1.2fr]">
                <MenuFilterSelect label="Xã / phường" value={ward} onChange={setWard} options={["Tất cả Xã/Phường", ...Array.from(new Set(menuRecords.map((menu) => menu.ward)))]} />
                <MenuFilterSelect label="Trường học" value={school} onChange={setSchool} options={["Tất cả các trường", ...Array.from(new Set(menuRecords.map((menu) => menu.school)))]} />
                <MenuFilterSelect label="Thời gian" value={time} onChange={setTime} options={["Chọn thời gian", "Tháng 01 2026"]} />
                <label className="block">
                   <span className="meal-field-label mb-2 block text-[10px] font-extrabold uppercase tracking-[0.08em] text-slate-500">Tìm kiếm</span>
                  <span className="relative block">
                    <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                     <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Tên trường hoặc thực đơn..." className="meal-field-control h-11 w-full rounded-lg border border-slate-200 bg-[#fbfcfd] pl-9 pr-3 text-xs font-semibold text-slate-700 outline-none placeholder:text-slate-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-100" />
                  </span>
                </label>
              </div>
            </section>
            <div className="mb-3 mt-7 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-black text-slate-800">Thực đơn theo ngày</h2>
                <p className="mt-1 text-[11px] font-medium text-slate-400">{filteredMenus.length} kết quả · Sắp xếp theo ngày áp dụng</p>
              </div>
              <button type="button" onClick={clearFilters} className="text-xs font-extrabold text-orange-600 transition hover:text-orange-700">Xóa bộ lọc</button>
            </div>
            <div className="space-y-4">
              {filteredMenus.length ? filteredMenus.map((menu) => <MenuCard key={menu.id} menu={menu} onDetails={() => setSelectedMenu(menu)} />) : (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
                  <Utensils size={28} className="mx-auto text-slate-300" />
                  <p className="mt-3 text-sm font-extrabold text-slate-700">Không có thực đơn phù hợp</p>
                  <p className="mt-1 text-xs text-slate-400">Thử thay đổi phường, trường hoặc thời gian lọc.</p>
                </div>
              )}
            </div>
          </div>
        </div>
        {selectedMenu && <MenuDetailDialog menu={selectedMenu} onClose={() => setSelectedMenu(null)} />}
      </AdminShell>
    );
  }

  return (
       <AdminShell>
      <div className="mx-auto max-w-7xl px-5 py-9 lg:px-10">
        <SectionHeading
          eyebrow={config.eyebrow}
          title={`${config.title}.`}
          description={config.description}
          action={
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-bold text-primary-foreground"
            >
              <Icon size={17} /> Thêm dữ liệu
            </button>
          }
        />
        <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
          <div className="border-b border-border p-5">
            <div className="relative max-w-md">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
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
                      <th key={column} className="px-5 py-4 font-extrabold">
                        {column}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {rows.map((row, index) => (
                    <tr
                      key={`${row[0]}-${index}`}
                      className="hover:bg-secondary/20"
                    >
                      {row.map((value, cellIndex) => (
                        <td
                          key={`${value}-${cellIndex}`}
                          className="px-5 py-4 font-semibold"
                        >
                          {cellIndex === row.length - 1 &&
                          (value === "Đã duyệt" ||
                            value === "Đạt" ||
                            value === "Đã ban hành") ? (
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
            <EmptyState
              title="Không tìm thấy dữ liệu"
              description="Thử thay đổi từ khóa tìm kiếm."
            />
          )}
        </div>
      </div>
    </AdminShell>
  );
}
