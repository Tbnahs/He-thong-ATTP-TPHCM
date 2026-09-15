import { useMemo, useState } from "react";
import {
  ArrowUpRight,
  BarChart3,
  Building2,
  CalendarDays,
  CalendarRange,
  ChefHat,
  CheckCircle2,
  Clock3,
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

type RecipeRecord = {
  id: string;
  name: string;
  code: string;
  school: string;
  ward: string;
  type: "Lỏng" | "Mặn" | "Món cho trẻ";
  ingredients: string[];
  steps: string[];
  updatedAt: string;
  accent: "green" | "orange" | "purple";
};

const recipeRecords: RecipeRecord[] = [
  {
    id: "recipe-canh-chua-ca-basa",
    name: "Canh chua cá basa",
    code: "MA-00452",
    school: "iSchool Nam Sài Gòn",
    ward: "Phường Bến Nghé",
    type: "Lỏng",
    ingredients: ["Cá basa", "Cà chua", "Thơm", "Rau muống"],
    steps: [
      "Sơ chế cá, rau, cà chua, thơm",
      "Phi thơm, nấu nước dùng 15 phút",
      "Cho cá vào nấu chín, nêm gia vị",
      "Thêm rau muống, tắt bếp.",
    ],
    updatedAt: "05/09/2026",
    accent: "green",
  },
  {
    id: "recipe-thit-kho-trung",
    name: "Thịt kho trứng",
    code: "MA-00218",
    school: "Trường Tiểu học Lê Lợi",
    ward: "Phường Bến Nghé",
    type: "Mặn",
    ingredients: ["Thịt heo", "Trứng vịt", "Nước màu", "Hành tím"],
    steps: [
      "Sơ chế thịt, luộc trứng và bóc vỏ",
      "Ướp thịt với gia vị trong 20 phút",
      "Kho thịt với nước dừa đến mềm",
      "Cho trứng vào, đun nhỏ lửa.",
    ],
    updatedAt: "05/09/2026",
    accent: "orange",
  },
  {
    id: "recipe-chao-ga-rau-cu",
    name: "Cháo gà rau củ",
    code: "MA-00510",
    school: "Trường Mầm non Hoa Sen",
    ward: "Phường Sài Gòn",
    type: "Món cho trẻ",
    ingredients: ["Gạo tẻ", "Thịt gà", "Cà rốt", "Bí xanh"],
    steps: [
      "Vo gạo, sơ chế thịt gà và rau củ",
      "Nấu gạo với nước dùng đến nhừ",
      "Cho thịt gà và rau củ vào nấu chín",
      "Nêm nhạt, kiểm tra trước khi chia suất.",
    ],
    updatedAt: "01/09/2026",
    accent: "purple",
  },
];

function categoryShortName(category: FacilityCategory) {
  return category === "Trường học có bếp ăn bán trú"
    ? "Trường học"
    : category === "Cơ sở cung cấp thực phẩm"
      ? "Cung cấp thực phẩm"
      : "Cung cấp suất ăn";
}

export function AdminMonitoringDashboard() {
  type MonitoringStatus = "Đạt" | "Cảnh báo" | "Chưa đạt";
  type SchoolLevel = "Mầm non" | "Cấp 1" | "Cấp 2" | "Cấp 3";
  type SupplierRecord = {
    name: string;
    area: string;
    status: MonitoringStatus;
    capacity: number;
    demand: number;
    updated: string;
  };
  type SchoolRecord = {
    name: string;
    level: SchoolLevel;
    area: string;
    status: MonitoringStatus;
    demand: number;
    supply: number;
    supplier: string;
    updated: string;
  };

  const [activeTab, setActiveTab] = useState<"suppliers" | "schools">(
    "suppliers",
  );
  const [schoolLevel, setSchoolLevel] = useState<"Tất cả cấp học" | SchoolLevel>(
    "Tất cả cấp học",
  );
  const suppliers: SupplierRecord[] = [
    { name: "Công ty Suất ăn Minh Tâm", area: "Tân Bình", status: "Đạt", capacity: 1200, demand: 980, updated: "08/09/2026" },
    { name: "Bếp ăn tập thể An Phú", area: "Quận 7", status: "Chưa đạt", capacity: 650, demand: 420, updated: "08/09/2026" },
    { name: "Công ty TNHH Bếp Việt", area: "Bình Thạnh", status: "Đạt", capacity: 480, demand: 360, updated: "07/09/2026" },
    { name: "Hợp tác xã Suất ăn Xanh", area: "Thủ Đức", status: "Đạt", capacity: 320, demand: 280, updated: "06/09/2026" },
    { name: "Cơ sở Bếp sạch Nam Sài Gòn", area: "Quận 4", status: "Cảnh báo", capacity: 270, demand: 210, updated: "05/09/2026" },
    { name: "Công ty Suất ăn Hướng Dương", area: "Gò Vấp", status: "Đạt", capacity: 180, demand: 120, updated: "04/09/2026" },
  ];
  const schools: SchoolRecord[] = [
    { name: "Trường Mầm non Hoa Sen", level: "Mầm non", area: "Phường Sài Gòn", status: "Cảnh báo", demand: 180, supply: 190, supplier: "Minh Tâm", updated: "08/09/2026" },
    { name: "Trường Mầm non Sao Mai", level: "Mầm non", area: "Tân Bình", status: "Đạt", demand: 220, supply: 220, supplier: "Bếp Việt", updated: "08/09/2026" },
    { name: "Trường Mầm non Mặt Trời", level: "Mầm non", area: "Quận 7", status: "Đạt", demand: 180, supply: 190, supplier: "Minh Tâm", updated: "07/09/2026" },
    { name: "Trường Mầm non Tuổi Thơ", level: "Mầm non", area: "Gò Vấp", status: "Đạt", demand: 160, supply: 170, supplier: "Hướng Dương", updated: "07/09/2026" },
    { name: "Trường Mầm non Bé Ngoan", level: "Mầm non", area: "Thủ Đức", status: "Chưa đạt", demand: 180, supply: 160, supplier: "An Phú", updated: "06/09/2026" },
    { name: "Trường Tiểu học Lê Lợi", level: "Cấp 1", area: "Phường Bến Nghé", status: "Đạt", demand: 320, supply: 340, supplier: "Minh Tâm", updated: "08/09/2026" },
    { name: "Trường Tiểu học Nguyễn Huệ", level: "Cấp 1", area: "Quận 1", status: "Cảnh báo", demand: 280, supply: 300, supplier: "Bếp Việt", updated: "08/09/2026" },
    { name: "Trường Tiểu học Trần Hưng Đạo", level: "Cấp 1", area: "Quận 5", status: "Đạt", demand: 300, supply: 310, supplier: "Minh Tâm", updated: "07/09/2026" },
    { name: "Trường Tiểu học Bàu Sen", level: "Cấp 1", area: "Quận 6", status: "Đạt", demand: 260, supply: 280, supplier: "Xanh", updated: "07/09/2026" },
    { name: "Trường Tiểu học Bình Quới", level: "Cấp 1", area: "Bình Thạnh", status: "Đạt", demand: 260, supply: 280, supplier: "Hướng Dương", updated: "06/09/2026" },
    { name: "Trường THCS Minh Khai", level: "Cấp 2", area: "Quận 3", status: "Cảnh báo", demand: 240, supply: 250, supplier: "Minh Tâm", updated: "08/09/2026" },
    { name: "Trường THCS Võ Trường Toản", level: "Cấp 2", area: "Quận 1", status: "Đạt", demand: 220, supply: 220, supplier: "Bếp Việt", updated: "07/09/2026" },
    { name: "Trường THCS Nguyễn Du", level: "Cấp 2", area: "Quận 10", status: "Đạt", demand: 180, supply: 190, supplier: "Xanh", updated: "06/09/2026" },
    { name: "Trường THPT Lê Quý Đôn", level: "Cấp 3", area: "Quận 3", status: "Đạt", demand: 200, supply: 210, supplier: "Minh Tâm", updated: "08/09/2026" },
  ];
  const alertRows = [
    ["MN Hoa Sen", "Nhập nguyên liệu thiếu hóa đơn/chứng từ", "08/09/2026", "Khẩn cấp", "urgent"],
    ["THCS Minh Khai", "Số lượng suất ăn không khớp với dữ liệu thực tế", "08/09/2026", "Cao", "high"],
    ["MN Sao Mai", "Chưa lưu mẫu món ăn", "08/09/2026", "Khẩn cấp", "urgent"],
    ["TH Lê Lợi", "Thiếu hình ảnh/minh chứng khi lưu mẫu", "08/09/2026", "Cao", "high"],
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
  const filteredSchools = schoolLevel === "Tất cả cấp học"
    ? schools
    : schools.filter((school) => school.level === schoolLevel);
  const activeSchools = activeTab === "schools" ? filteredSchools : schools;
  const supplierCapacity = suppliers.reduce((sum, item) => sum + item.capacity, 0);
  const supplierDemand = suppliers.reduce((sum, item) => sum + item.demand, 0);
  const schoolDemand = activeSchools.reduce((sum, item) => sum + item.demand, 0);
  const schoolSupply = activeSchools.reduce((sum, school) => sum + school.supply, 0);
  const activeStatusCounts = (records: Array<{ status: MonitoringStatus }>) =>
    records.reduce(
      (counts, record) => ({ ...counts, [record.status]: counts[record.status] + 1 }),
      { Đạt: 0, "Cảnh báo": 0, "Chưa đạt": 0 },
    );
  const statusCounts = activeTab === "suppliers"
    ? activeStatusCounts(suppliers)
    : activeStatusCounts(activeSchools);
  const balance = activeTab === "suppliers"
    ? supplierCapacity - supplierDemand
    : schoolSupply - schoolDemand;
  const balancePercent = activeTab === "suppliers"
    ? Math.round((supplierDemand / supplierCapacity) * 100)
    : Math.min(100, Math.round((schoolSupply / Math.max(1, schoolDemand)) * 100));
  const scoreBars = [44, 52, 47, 70, 64, 82, 75];
  const riskSlices = [
    { label: "Lưu mẫu", value: "32%", color: "#f97316" },
    { label: "Nguồn gốc", value: "24%", color: "#facc15" },
    { label: "Vệ sinh", value: "14%", color: "#ec4899" },
    { label: "Chứng nhận", value: "18%", color: "#6366f1" },
  ];
  const cards = activeTab === "suppliers"
    ? [
        ["Tổng cơ sở cung cấp", suppliers.length.toString().padStart(2, "0"), "cơ sở trong hệ thống", "text-primary", Building2],
        ["Tổng công suất cung cấp", supplierCapacity.toLocaleString("vi-VN"), "suất ăn/ngày", "text-primary", Utensils],
        ["Tổng nhu cầu thực tế", supplierDemand.toLocaleString("vi-VN"), "suất ăn/ngày", "text-sky-600", ClipboardCheck],
        ["Cân bằng cung - nhu cầu", `+${balance.toLocaleString("vi-VN")}`, "suất ăn/ngày còn dư", "text-emerald-600", CheckCircle2],
      ]
    : [
        ["Tổng cơ sở giáo dục", activeSchools.length.toString().padStart(2, "0"), schoolLevel === "Tất cả cấp học" ? "toàn thành phố" : schoolLevel, "text-primary", Building2],
        ["Tổng nhu cầu suất ăn", schoolDemand.toLocaleString("vi-VN"), "suất ăn/ngày", "text-primary", Utensils],
        ["Công suất đã phân bổ", schoolSupply.toLocaleString("vi-VN"), "suất ăn/ngày", "text-sky-600", ClipboardCheck],
        ["Cân bằng cung - nhu cầu", balance >= 0 ? `+${balance.toLocaleString("vi-VN")}` : balance.toLocaleString("vi-VN"), balance >= 0 ? "còn dư công suất" : "thiếu công suất", balance >= 0 ? "text-emerald-600" : "text-red-600", balance >= 0 ? CheckCircle2 : TriangleAlert],
      ];

  return (
    <AdminShell>
      <div className="mx-auto max-w-[1600px] px-4 py-5 sm:px-6 lg:px-8">
        <section className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="mono-label text-primary">DASHBOARD GIÁM SÁT</p>
              <h1 className="mt-1 text-2xl font-extrabold tracking-tight">Theo dõi cung - cầu suất ăn</h1>
              <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
                Tách riêng dữ liệu cơ sở cung cấp và cơ sở giáo dục để cơ quan quản lý chủ động nhận diện nguy cơ thiếu hụt.
              </p>
            </div>
            <div className="grid grid-cols-2 rounded-xl bg-secondary p-1" role="tablist" aria-label="Phạm vi dashboard">
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
                  className={`rounded-lg px-3 py-2.5 text-left text-xs font-bold transition-colors sm:px-4 ${activeTab === value ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
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
              <select
                id="dashboard-school-level"
                value={schoolLevel}
                onChange={(event) => setSchoolLevel(event.target.value as "Tất cả cấp học" | SchoolLevel)}
                className="rounded-lg border border-border bg-background px-3 py-2 text-xs font-semibold"
                data-testid="select-dashboard-school-level"
              >
                {["Tất cả cấp học", "Mầm non", "Cấp 1", "Cấp 2", "Cấp 3"].map((level) => <option key={level}>{level}</option>)}
              </select>
              <span className="text-xs text-muted-foreground">
                {activeSchools.length} cơ sở · {schoolDemand.toLocaleString("vi-VN")} suất ăn/ngày cần phục vụ
              </span>
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

        <section className="mt-4 rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <p className="mono-label text-primary">TÌNH TRẠNG HỒ SƠ</p>
              <h2 className="mt-1 text-lg font-extrabold">
                {activeTab === "suppliers" ? "Phân loại cơ sở cung cấp" : "Phân loại cơ sở giáo dục"}
              </h2>
              <p className="mt-1 text-xs text-muted-foreground">Số liệu cập nhật đến ngày 08/09/2026</p>
            </div>
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              {([
                ["Đạt", "bg-emerald-50 text-emerald-700", "border-emerald-100"],
                ["Cảnh báo", "bg-amber-50 text-amber-700", "border-amber-100"],
                ["Chưa đạt", "bg-red-50 text-red-700", "border-red-100"],
              ] as const).map(([status, color, border]) => (
                <div key={status} className={`min-w-[92px] rounded-xl border px-3 py-2.5 ${color} ${border}`}>
                  <p className="text-[10px] font-bold uppercase tracking-wide">{status}</p>
                  <p className="mt-1 text-xl font-black">{statusCounts[status]}</p>
                  <p className="text-[10px] font-medium opacity-80">
                    {activeTab === "suppliers" ? "cơ sở cung cấp" : "cơ sở giáo dục"}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-5">
            <div className="mb-2 flex justify-between text-[11px] font-semibold text-muted-foreground">
              <span>Tỷ lệ đạt yêu cầu</span>
              <span>{Math.round((statusCounts["Đạt"] / Math.max(1, activeTab === "suppliers" ? suppliers.length : activeSchools.length)) * 100)}%</span>
            </div>
            <div className="flex h-2.5 overflow-hidden rounded-full bg-slate-100">
              <div className="bg-emerald-500" style={{ width: `${(statusCounts["Đạt"] / Math.max(1, activeTab === "suppliers" ? suppliers.length : activeSchools.length)) * 100}%` }} />
              <div className="bg-amber-400" style={{ width: `${(statusCounts["Cảnh báo"] / Math.max(1, activeTab === "suppliers" ? suppliers.length : activeSchools.length)) * 100}%` }} />
              <div className="bg-red-500" style={{ width: `${(statusCounts["Chưa đạt"] / Math.max(1, activeTab === "suppliers" ? suppliers.length : activeSchools.length)) * 100}%` }} />
            </div>
          </div>
        </section>

        <section className="mt-4 rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="mono-label text-primary">CÂN BẰNG CUNG - NHU CẦU</p>
              <h2 className="mt-1 text-lg font-extrabold">Năng lực phục vụ suất ăn trong ngày</h2>
              <p className="mt-1 text-xs text-muted-foreground">
                {activeTab === "suppliers" ? "So sánh tổng công suất của các cơ sở cung cấp với nhu cầu đã đăng ký." : "So sánh công suất đã phân bổ với nhu cầu theo cấp học đang chọn."}
              </p>
            </div>
            <div className={`rounded-xl px-3 py-2 text-right ${balance >= 0 ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>
              <p className="text-[10px] font-bold uppercase tracking-wide">Kết quả</p>
              <p className="text-lg font-black">{balance >= 0 ? "Đủ nguồn cung" : "Có nguy cơ thiếu"}</p>
            </div>
          </div>
          <div className="mt-5 grid gap-5 md:grid-cols-[1fr_250px] md:items-center">
            <div>
              <div className="mb-2 flex justify-between text-xs font-semibold text-muted-foreground">
                <span>Công suất sử dụng dự kiến</span>
                <span className="font-black text-foreground">{balancePercent}%</span>
              </div>
              <div className="relative h-5 overflow-hidden rounded-full bg-slate-100">
                <div className={`h-full rounded-full ${balance >= 0 ? "bg-primary" : "bg-red-500"}`} style={{ width: `${Math.min(100, balancePercent)}%` }} />
                <div className="absolute inset-y-0 left-1/2 border-l border-white/70" />
                <div className="absolute inset-y-0 left-3/4 border-l border-white/70" />
              </div>
              <div className="mt-2 flex justify-between text-[10px] text-muted-foreground">
                <span>0 suất</span><span>50%</span><span>75%</span><span>100% nhu cầu</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="rounded-xl bg-secondary/60 p-3">
                <p className="text-[10px] font-bold text-muted-foreground">CUNG</p>
                <p className="mt-1 text-xl font-black text-primary">{(activeTab === "suppliers" ? supplierCapacity : schoolSupply).toLocaleString("vi-VN")}</p>
              </div>
              <div className="rounded-xl bg-secondary/60 p-3">
                <p className="text-[10px] font-bold text-muted-foreground">NHU CẦU</p>
                <p className="mt-1 text-xl font-black text-sky-700">{(activeTab === "suppliers" ? supplierDemand : schoolDemand).toLocaleString("vi-VN")}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-4 overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <div className="flex flex-col gap-2 border-b border-border px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <div>
              <p className="mono-label text-primary">DANH SÁCH THEO DÕI</p>
              <h2 className="mt-1 text-lg font-extrabold">
                {activeTab === "suppliers" ? "Cơ sở cung cấp suất ăn" : `Cơ sở giáo dục${schoolLevel === "Tất cả cấp học" ? "" : ` · ${schoolLevel}`}`}
              </h2>
            </div>
            <span className="text-xs font-semibold text-muted-foreground">{activeTab === "suppliers" ? suppliers.length : activeSchools.length} kết quả</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-xs">
              <thead className="bg-secondary/70 text-[10px] font-extrabold uppercase tracking-wide text-muted-foreground">
                {activeTab === "suppliers" ? (
                  <tr><th className="px-5 py-3">Cơ sở cung cấp</th><th className="px-4 py-3">Khu vực</th><th className="px-4 py-3">Trạng thái</th><th className="px-4 py-3 text-right">Công suất</th><th className="px-4 py-3 text-right">Nhu cầu</th><th className="px-5 py-3 text-right">Cập nhật</th></tr>
                ) : (
                  <tr><th className="px-5 py-3">Cơ sở giáo dục</th><th className="px-4 py-3">Cấp học</th><th className="px-4 py-3">Khu vực</th><th className="px-4 py-3">Trạng thái</th><th className="px-4 py-3 text-right">Nhu cầu</th><th className="px-5 py-3 text-right">Cập nhật</th></tr>
                )}
              </thead>
              <tbody className="divide-y divide-border">
                {activeTab === "suppliers" ? suppliers.map((supplier) => (
                  <tr key={supplier.name} className="transition-colors hover:bg-secondary/30">
                    <td className="px-5 py-3.5 font-bold">{supplier.name}</td><td className="px-4 py-3.5 text-muted-foreground">{supplier.area}</td><td className="px-4 py-3.5"><StatusPill status={supplier.status === "Đạt" ? "approved" : supplier.status === "Cảnh báo" ? "warning" : "stopped"} /></td><td className="px-4 py-3.5 text-right font-bold">{supplier.capacity.toLocaleString("vi-VN")}</td><td className="px-4 py-3.5 text-right font-bold">{supplier.demand.toLocaleString("vi-VN")}</td><td className="px-5 py-3.5 text-right text-muted-foreground">{supplier.updated}</td>
                  </tr>
                )) : activeSchools.map((school) => (
                  <tr key={school.name} className="transition-colors hover:bg-secondary/30">
                    <td className="px-5 py-3.5 font-bold">{school.name}<span className="mt-1 block text-[10px] font-medium text-muted-foreground">Đơn vị cung cấp: {school.supplier}</span></td><td className="px-4 py-3.5"><span className="rounded-full bg-sky-50 px-2.5 py-1 text-[10px] font-bold text-sky-700">{school.level}</span></td><td className="px-4 py-3.5 text-muted-foreground">{school.area}</td><td className="px-4 py-3.5"><StatusPill status={school.status === "Đạt" ? "approved" : school.status === "Cảnh báo" ? "warning" : "stopped"} /></td><td className="px-4 py-3.5 text-right font-bold">{school.demand.toLocaleString("vi-VN")}</td><td className="px-5 py-3.5 text-right text-muted-foreground">{school.updated}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

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
            <h2 className="text-xs font-extrabold">Kiểm thực 3 bước theo tháng</h2>
            <div className="mt-4 flex h-40 items-end gap-2 border-b border-l border-border px-2 pb-1 pt-3">
              <svg
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                className="h-full w-full overflow-visible"
              >
                <polyline
                  points="0,74 16,55 32,68 48,42 64,47 80,24 100,52"
                  fill="rgba(249,115,22,.12)"
                  stroke="none"
                />
                <polyline
                  points="0,74 16,55 32,68 48,42 64,47 80,24 100,52"
                  fill="none"
                  stroke="#f97316"
                  strokeWidth="1.5"
                  vectorEffect="non-scaling-stroke"
                />
                {"0,74 16,55 32,68 48,42 64,47 80,24 100,52".split(" ").map((point) => {
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

function RecipeCard({
  recipe,
  onDetails,
}: {
  recipe: RecipeRecord;
  onDetails: () => void;
}) {
  const accentClasses = {
    green: "from-emerald-100 via-lime-50 to-orange-100",
    orange: "from-orange-100 via-amber-50 to-rose-100",
    purple: "from-violet-100 via-fuchsia-50 to-orange-100",
  };

  return (
    <article className="recipe-card overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-[0_4px_20px_rgba(0,0,0,.08)] transition hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(0,0,0,.12)]">
      <div className={`recipe-card__visual relative flex h-56 items-center justify-center overflow-hidden bg-gradient-to-br ${accentClasses[recipe.accent]}`}>
        <div className="absolute -right-10 -top-14 h-44 w-44 rounded-full bg-white/45" />
        <div className="absolute -bottom-16 -left-8 h-44 w-44 rounded-full bg-white/35" />
        <div className="relative flex h-28 w-28 items-center justify-center rounded-full border-8 border-white/70 bg-white/65 text-orange-500 shadow-xl backdrop-blur-sm">
          <ChefHat size={62} strokeWidth={1.5} />
        </div>
        <span className="absolute left-4 top-4 rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-extrabold uppercase tracking-[.05em] text-emerald-600">
          {recipe.type}
        </span>
      </div>
      <div className="recipe-card__body flex min-h-[542px] flex-col gap-6 p-6">
        <div>
          <h2 className="text-[22px] font-bold leading-7 text-[#1f2937]">{recipe.name}</h2>
          <p className="mt-1 text-xs font-semibold leading-5 text-[#4b5563]">Mã món: {recipe.code}</p>
          <p className="text-[13px] font-semibold leading-5 text-[#4b5563]">Trường sở hữu: {recipe.school}</p>
        </div>

        <section>
          <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-[.025em] text-[#374151]">
            <Utensils size={14} className="text-[#f26522]" />
            Nguyên liệu cần giám sát
          </h3>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {recipe.ingredients.map((ingredient) => (
              <div key={ingredient} className="flex items-center gap-3 rounded-xl border border-slate-100 bg-[#f9fafb] px-3 py-3">
                <span className="h-2 w-2 shrink-0 rounded-full bg-[#f26522]" />
                <span className="text-sm font-medium text-[#4b5563]">{ingredient}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="border-t border-slate-100 pt-6">
          <div className="flex items-center justify-between gap-3">
            <button type="button" onClick={onDetails} className="inline-flex items-center gap-2 text-[15px] font-bold text-[#f26522] transition hover:text-orange-700">
              Xem quy trình chế biến <ChevronRight size={14} />
            </button>
            <Clock3 size={15} className="text-slate-400" aria-label={`Cập nhật ${recipe.updatedAt}`} />
          </div>
          <div className="relative mt-4 space-y-4 pl-1">
            <span className="absolute bottom-3 left-[11px] top-2 w-0.5 bg-slate-200" aria-hidden="true" />
            {recipe.steps.map((step, index) => (
              <div key={step} className="relative flex items-start gap-4">
                <span className="relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#f26522] text-[11px] font-bold text-white">
                  {index + 1}
                </span>
                <p className="pt-0.5 text-sm font-medium leading-[23px] text-[#4b5563]">{step}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-4 text-[11px] font-semibold text-slate-400">
          <span>Cập nhật lần cuối</span>
          <span>{recipe.updatedAt}</span>
        </div>
      </div>
    </article>
  );
}

function RecipeDetailDialog({
  recipe,
  onClose,
}: {
  recipe: RecipeRecord;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="recipe-detail-title">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white px-6 py-5">
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-[.12em] text-[#f26522]">Quy trình chế biến</p>
            <h2 id="recipe-detail-title" className="mt-1 text-xl font-bold text-slate-900">{recipe.name}</h2>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:border-orange-300 hover:text-orange-600" aria-label="Đóng quy trình chế biến">
            <X size={18} />
          </button>
        </div>
        <div className="space-y-6 p-6">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
              <p className="text-[11px] font-semibold text-slate-500">Mã món</p>
              <p className="mt-1 text-sm font-bold text-slate-800">{recipe.code}</p>
            </div>
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
              <p className="text-[11px] font-semibold text-slate-500">Trường sở hữu</p>
              <p className="mt-1 text-sm font-bold text-slate-800">{recipe.school}</p>
            </div>
          </div>
          <div>
            <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-[.025em] text-slate-700">
              <Utensils size={15} className="text-[#f26522]" /> Nguyên liệu
            </h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {recipe.ingredients.map((ingredient) => (
                <span key={ingredient} className="rounded-full bg-orange-50 px-3 py-1.5 text-xs font-bold text-orange-700">{ingredient}</span>
              ))}
            </div>
          </div>
          <div>
            <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-[.025em] text-slate-700">
              <ChefHat size={15} className="text-[#f26522]" /> Các bước thực hiện
            </h3>
            <div className="relative mt-4 space-y-4 pl-1">
              <span className="absolute bottom-3 left-[11px] top-2 w-0.5 bg-slate-200" aria-hidden="true" />
              {recipe.steps.map((step, index) => (
                <div key={step} className="relative flex items-start gap-4">
                  <span className="relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#f26522] text-[11px] font-bold text-white">{index + 1}</span>
                  <p className="pt-0.5 text-sm leading-6 text-slate-600">{step}</p>
                </div>
              ))}
            </div>
          </div>
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
  const [recipeWard, setRecipeWard] = useState("Tất cả Xã/Phường");
  const [recipeType, setRecipeType] = useState("Tất cả loại món");
  const [recipeSchool, setRecipeSchool] = useState("Tất cả các trường");
  const [selectedRecipe, setSelectedRecipe] = useState<RecipeRecord | null>(null);
  const rows = config.rows.filter((row) =>
    row.join(" ").toLowerCase().includes(search.toLowerCase()),
  );

  if (page === "recipes") {
    const filteredRecipes = recipeRecords.filter(
      (recipe) =>
        (recipeType === "Tất cả loại món" || recipe.type === recipeType) &&
        (recipeSchool === "Tất cả các trường" || recipe.school === recipeSchool) &&
        (recipeWard === "Tất cả Xã/Phường" || recipe.ward === recipeWard) &&
        (!search || `${recipe.name} ${recipe.code} ${recipe.school} ${recipe.type}`.toLowerCase().includes(search.toLowerCase())),
    );
    const clearRecipeFilters = () => {
      setSearch("");
      setRecipeWard("Tất cả Xã/Phường");
      setRecipeType("Tất cả loại món");
      setRecipeSchool("Tất cả các trường");
    };

    return (
      <AdminShell>
        <div className="recipe-management-page min-h-[calc(100dvh-65px)] bg-[#f9fafb]">
          <div className="recipe-management-page__content mx-auto max-w-[1180px] px-4 pb-12 pt-8 sm:px-7 lg:px-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[.12em] text-[#f26522]">Quản lý bữa ăn</p>
                <h1 className="mt-1 text-[25px] font-bold tracking-tight text-[#1f2937]">Danh sách món ăn</h1>
                <p className="mt-1 text-sm text-[#6b7280]">Quản lý nguyên liệu và quy trình chế biến đang áp dụng tại các bếp ăn.</p>
              </div>
              <div className="relative w-full lg:w-80">
                <Search size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#9ca3af]" />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Tìm kiếm tên món, mã món..."
                  className="h-[46px] w-full rounded-xl border border-[#e5e7eb] bg-white pl-11 pr-4 text-sm text-[#374151] outline-none transition placeholder:text-[#9ca3af] focus:border-[#f26522] focus:ring-4 focus:ring-orange-100"
                  aria-label="Tìm kiếm tên món, mã món"
                />
              </div>
            </div>

            <section className="recipe-filter-card mt-7 rounded-2xl border border-[#f3f4f6] bg-white p-6 shadow-[0_1px_2px_rgba(0,0,0,.05)]">
              <div className="grid gap-5 md:grid-cols-3">
                <MenuFilterSelect label="Xã / phường" value={recipeWard} onChange={setRecipeWard} options={["Tất cả Xã/Phường", ...Array.from(new Set(recipeRecords.map((recipe) => recipe.ward)))]} />
                <MenuFilterSelect label="Trường học" value={recipeSchool} onChange={setRecipeSchool} options={["Tất cả các trường", ...Array.from(new Set(recipeRecords.map((recipe) => recipe.school)))]} />
                <MenuFilterSelect label="Loại món ăn" value={recipeType} onChange={setRecipeType} options={["Tất cả loại món", "Lỏng", "Mặn", "Món cho trẻ"]} />
              </div>
              <div className="mt-5 flex justify-end">
                <button type="button" onClick={clearRecipeFilters} className="inline-flex items-center gap-2 text-sm font-bold text-[#f26522] transition hover:text-orange-700">
                  <X size={15} /> Đặt lại bộ lọc
                </button>
              </div>
            </section>

            <div className="mb-4 mt-8 flex items-end justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-[#1f2937]">Món ăn đang áp dụng</h2>
                <p className="mt-1 text-xs font-medium text-[#6b7280]">{filteredRecipes.length} món ăn · Cập nhật theo hồ sơ bếp ăn</p>
              </div>
              <span className="hidden rounded-full bg-orange-50 px-3 py-1.5 text-xs font-bold text-orange-700 sm:inline-flex">{recipeRecords.length} hồ sơ</span>
            </div>

            {filteredRecipes.length ? (
              <div className="grid items-start gap-5 xl:grid-cols-3">
                {filteredRecipes.map((recipe) => (
                  <RecipeCard key={recipe.id} recipe={recipe} onDetails={() => setSelectedRecipe(recipe)} />
                ))}
              </div>
            ) : (
              <EmptyState title="Không tìm thấy món ăn" description="Thử thay đổi từ khóa hoặc bộ lọc." />
            )}
          </div>
        </div>
        {selectedRecipe && <RecipeDetailDialog recipe={selectedRecipe} onClose={() => setSelectedRecipe(null)} />}
      </AdminShell>
    );
  }

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
