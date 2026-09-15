import { useMemo, useState } from "react";
import {
  BarChart3,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Download,
  FileSpreadsheet,
  Filter,
  MapPin,
  PackageCheck,
  RefreshCw,
  School,
  Search,
  SlidersHorizontal,
  TrendingUp,
  Utensils,
  X,
} from "lucide-react";
import { AdminShell } from "@/components/portal-ui";

type RegionRow = {
  name: string;
  schools: number;
  selfCook: number;
  externalMeals: number;
  plannedDemand: number;
  actualDemand: number;
  suppliers: number;
  capacity: number;
};

type SchoolRow = {
  name: string;
  organization: "Tự nấu" | "Suất ăn ngoài";
  students: number;
  plannedDemand: number;
  actualDemand: number;
  suppliers: number;
};

const regionRows: RegionRow[] = [
  {
    name: "P. Bến Thành",
    schools: 12,
    selfCook: 5,
    externalMeals: 7,
    plannedDemand: 5200,
    actualDemand: 4850,
    suppliers: 4,
    capacity: 6000,
  },
  {
    name: "P. Bến Nghé",
    schools: 8,
    selfCook: 3,
    externalMeals: 5,
    plannedDemand: 3600,
    actualDemand: 3420,
    suppliers: 3,
    capacity: 4500,
  },
  {
    name: "P. Nguyễn Cư Trinh",
    schools: 10,
    selfCook: 6,
    externalMeals: 4,
    plannedDemand: 4100,
    actualDemand: 3950,
    suppliers: 2,
    capacity: 3200,
  },
  {
    name: "P. Đa Kao",
    schools: 7,
    selfCook: 2,
    externalMeals: 5,
    plannedDemand: 3000,
    actualDemand: 2850,
    suppliers: 3,
    capacity: 4000,
  },
  {
    name: "P. Cầu Ông Lãnh",
    schools: 9,
    selfCook: 4,
    externalMeals: 5,
    plannedDemand: 3250,
    actualDemand: 3070,
    suppliers: 3,
    capacity: 3600,
  },
];

const wardOptions = `phường Hiệp Bình, phường Tam Bình, phường Thủ Đức, phường Linh Xuân, phường Long Bình, phường Tăng Nhơn Phú, phường Phước Long, phường Long Phước, phường Long Trường, phường An Khánh, phường Bình Trưng, phường Cát Lái, phường Tân Định, phường Sài Gòn, phường Bến Thành, phường Cầu Ông Lãnh, phường Xuân Hòa, phường Bàn Cờ, phường Nhiêu Lộc, phường Vĩnh Hội, phường Khánh Hội, phường Xóm Chiếu, phường Chợ Quán, phường An Đông, phường Chợ Lớn, phường Bình Tiên, phường Bình Tây, phường Bình Phú, phường Phú Lâm, phường Tân Mỹ, phường Tân Hưng, phường Tân Thuận, phường Phú Thuận, phường Chánh Hưng, phường Bình Đông, phường Phú Định, phường Vườn Lài, phường Diên Hồng, phường Hòa Hưng, phường Hòa Bình, phường Phú Thọ, phường Bình Thới, phường Minh Phụng, phường Đông Hưng Thuận, phường Trung Mỹ Tây, phường Tân Thới Hiệp, phường Thới An, phường An Phú Đông, phường Bình Tân, phường Bình Hưng Hòa, phường Bình Trị Đông, phường An Lạc, phường Tân Tạo, phường Gia Định, phường Bình Thạnh, phường Bình Lợi Trung, phường Thạnh Mỹ Tây, phường Bình Quới, phường Hạnh Thông, phường An Nhơn, phường Gò Vấp, phường Thông Tây Hội, phường An Hội Tây, phường An Hội Đông, phường Đức Nhuận, phường Cầu Kiệu, phường Phú Nhuận, phường Tân Sơn Hòa, phường Tân Sơn Nhất, phường Tân Hòa, phường Bảy Hiền, phường Tân Bình, phường Tân Sơn, phường Tây Thạnh, phường Tân Sơn Nhì, phường Phú Thọ Hòa, phường Phú Thạnh, phường Tân Phú, phường Vũng Tàu, phường Tam Thắng, phường Rạch Dừa, phường Phước Thắng, phường Bà Rịa, phường Long Hương, phường Tam Long, phường Phú Mỹ, phường Tân Thành, phường Tân Phước, phường Tân Hải, phường Thới Hòa, phường Đông Hòa, phường Dĩ An, phường Tân Đông Hiệp, phường Thuận An, phường Thuận Giao, phường Bình Hòa, phường Lái Thiêu, phường An Phú, phường Bình Dương, phường Chánh Hiệp, phường Thủ Dầu Một, phường Phú Lợi, phường Vĩnh Tân, phường Bình Cơ, phường Tân Uyên, phường Tân Hiệp, phường Tân Khánh, phường Phú An, phường Tây Nam, phường Long Nguyên, phường Bến Cát, phường Chánh Phú Hòa, phường Hòa Lợi, xã Vĩnh Lộc, xã Tân Vĩnh Lộc, xã Bình Lợi, xã Tân Nhựt, xã Bình Chánh, xã Hưng Long, xã Bình Hưng, xã Cần Giờ, xã An Thới Đông, xã Bình Khánh, xã Thạnh An, xã An Nhơn Tây, xã Thái Mỹ, xã Nhuận Đức, xã Tân An Hội, xã Củ Chi, xã Phú Hòa Đông, xã Bình Mỹ, xã Hóc Môn, xã Bà Điểm, xã Xuân Thới Sơn, xã Đông Thạnh, xã Nhà Bè, xã Hiệp Phước, xã Long Sơn, xã Châu Pha, xã Ngãi Giao, xã Bình Giã, xã Kim Long, xã Châu Đức, xã Xuân Sơn, xã Nghĩa Thành, xã Hòa Hiệp, xã Bình Châu, xã Hồ Tràm, xã Xuyên Mộc, xã Hòa Hội, xã Bàu Lâm, xã Đất Đỏ, xã Long Hải, xã Long Điền, xã Phước Hải, xã Bắc Tân Uyên, xã Thường Tân, xã An Long, xã Phước Thành, xã Phước Hòa, xã Phú Giáo, xã Trừ Văn Thố, xã Bàu Bàng, xã Minh Thạnh, xã Long Hòa, xã Dầu Tiếng, xã Thanh An, đặc khu Côn Đảo`
  .split(", ")
  .map((item) => item.trim());

const schoolDetails: Record<string, SchoolRow[]> = {
  "P. Bến Thành": [
    { name: "Trường Tiểu học Bến Thành", organization: "Tự nấu", students: 500, plannedDemand: 500, actualDemand: 480, suppliers: 0 },
    { name: "Trường THCS Trần Bội Cơ", organization: "Suất ăn ngoài", students: 700, plannedDemand: 700, actualDemand: 680, suppliers: 1 },
    { name: "Trường Mầm non 19/5", organization: "Suất ăn ngoài", students: 800, plannedDemand: 800, actualDemand: 760, suppliers: 2 },
  ],
  "P. Bến Nghé": [
    { name: "Trường Tiểu học Lê Lợi", organization: "Tự nấu", students: 420, plannedDemand: 420, actualDemand: 400, suppliers: 0 },
    { name: "Trường Mầm non Hoa Sen", organization: "Suất ăn ngoài", students: 560, plannedDemand: 560, actualDemand: 530, suppliers: 1 },
  ],
  "P. Nguyễn Cư Trinh": [
    { name: "Trường Tiểu học Nguyễn Bỉnh Khiêm", organization: "Tự nấu", students: 620, plannedDemand: 620, actualDemand: 600, suppliers: 0 },
    { name: "Trường THCS Cầu Kiệu", organization: "Suất ăn ngoài", students: 720, plannedDemand: 720, actualDemand: 690, suppliers: 1 },
  ],
  "P. Đa Kao": [
    { name: "Trường Tiểu học Đa Kao", organization: "Tự nấu", students: 380, plannedDemand: 380, actualDemand: 360, suppliers: 0 },
    { name: "Trường Mầm non Sơn Ca", organization: "Suất ăn ngoài", students: 540, plannedDemand: 540, actualDemand: 510, suppliers: 1 },
  ],
  "P. Cầu Ông Lãnh": [
    { name: "Trường Tiểu học Cầu Ông Lãnh", organization: "Tự nấu", students: 460, plannedDemand: 460, actualDemand: 440, suppliers: 0 },
    { name: "Trường Mầm non Tuổi Thơ", organization: "Suất ăn ngoài", students: 600, plannedDemand: 600, actualDemand: 570, suppliers: 1 },
  ],
};

const formatNumber = (value: number) => new Intl.NumberFormat("vi-VN").format(value);

function FilterSelect({
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
    <label className="block">
      <span className="mb-2 block text-xs font-bold text-slate-500">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-[#1d7a50] focus:bg-white focus:ring-4 focus:ring-[#1d7a50]/10"
      >
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </label>
  );
}

function StatCard({
  label,
  value,
  detail,
  icon: Icon,
  tone,
}: {
  label: string;
  value: string;
  detail: string;
  icon: typeof School;
  tone: "green" | "amber" | "blue" | "orange";
}) {
  const tones = {
    green: "bg-[#e9f7ef] text-[#167345]",
    amber: "bg-[#fff6df] text-[#a76d05]",
    blue: "bg-[#e8f2ff] text-[#2266a5]",
    orange: "bg-[#fff0e8] text-[#bb5d25]",
  };
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_4px_18px_rgba(15,23,42,.04)]">
      <div className="flex items-start justify-between gap-3">
        <span className="text-sm font-semibold text-slate-500">{label}</span>
        <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${tones[tone]}`}>
          <Icon size={18} />
        </span>
      </div>
      <p className="mt-5 text-3xl font-extrabold tracking-tight text-slate-800">{value}</p>
      <p className="mt-1 text-xs font-medium text-slate-400">{detail}</p>
    </div>
  );
}

export function AdminReportsPage() {
  const [ward, setWard] = useState("Tất cả phường/xã");
  const [category, setCategory] = useState("Tất cả loại hình");
  const [mealType, setMealType] = useState("Tất cả hình thức");
  const [status, setStatus] = useState("Tất cả trạng thái");
  const [keyword, setKeyword] = useState("");
  const [selectedRegion, setSelectedRegion] = useState<RegionRow | null>(null);

  const filteredRows = useMemo(
    () =>
      regionRows.filter((row) => {
        const normalizedWard = ward.replace(/^phường\s+/i, "P. ");
        const matchesWard = ward === "Tất cả phường/xã" || row.name === normalizedWard;
        const matchesKeyword = row.name.toLowerCase().includes(keyword.trim().toLowerCase());
        const matchesMeal = mealType === "Tất cả hình thức" || mealType === "Tự tổ chức nấu ăn"
          ? mealType === "Tất cả hình thức" || row.selfCook > 0
          : row.externalMeals > 0;
        return matchesWard && matchesKeyword && matchesMeal && (category || status);
      }),
    [ward, keyword, mealType, category, status],
  );

  const totals = useMemo(
    () =>
      filteredRows.reduce(
        (result, row) => ({
          schools: result.schools + row.schools,
          selfCook: result.selfCook + row.selfCook,
          externalMeals: result.externalMeals + row.externalMeals,
          plannedDemand: result.plannedDemand + row.plannedDemand,
          actualDemand: result.actualDemand + row.actualDemand,
          capacity: result.capacity + row.capacity,
          suppliers: result.suppliers + row.suppliers,
        }),
        { schools: 0, selfCook: 0, externalMeals: 0, plannedDemand: 0, actualDemand: 0, capacity: 0, suppliers: 0 },
      ),
    [filteredRows],
  );

  const resetFilters = () => {
    setWard("Tất cả phường/xã");
    setCategory("Tất cả loại hình");
    setMealType("Tất cả hình thức");
    setStatus("Tất cả trạng thái");
    setKeyword("");
  };

  const exportCsv = () => {
    const header = ["Phường/Xã", "Tổng cơ sở GD", "Tự nấu", "Dùng suất ăn ngoài", "Nhu cầu dự kiến", "Nhu cầu thực tế", "Cơ sở cung cấp", "Công suất cung cấp"];
    const rows = filteredRows.map((row) => [row.name, row.schools, row.selfCook, row.externalMeals, row.plannedDemand, row.actualDemand, row.suppliers, row.capacity]);
    const csv = [header, ...rows].map((row) => row.join(",")).join("\n");
    const link = document.createElement("a");
    link.href = URL.createObjectURL(new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" }));
    link.download = "bao-cao-thong-ke-co-so-va-nhu-cau-suat-an.csv";
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const hasFilters = Boolean(keyword || ward !== "Tất cả phường/xã" || category !== "Tất cả loại hình" || mealType !== "Tất cả hình thức" || status !== "Tất cả trạng thái");
  const balance = totals.capacity - totals.actualDemand;

  return (
    <AdminShell>
      <div className="mx-auto max-w-[1440px] px-5 py-8 lg:px-10 lg:py-10">
        <div className="mb-8 flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.16em] text-[#167345]">
              <BarChart3 size={15} /> Báo cáo & phân tích
            </div>
            <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-800 md:text-4xl">Báo cáo thống kê</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Tổng hợp cơ sở giáo dục, năng lực cung cấp và nhu cầu suất ăn theo địa bàn.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={exportCsv} className="inline-flex h-11 items-center gap-2 rounded-xl border border-[#1d7a50]/25 bg-white px-4 text-sm font-bold text-[#167345] shadow-sm transition hover:bg-[#f0faf4]" data-testid="button-export-report">
              <Download size={17} /> Xuất file CSV
            </button>
            <button type="button" onClick={resetFilters} className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#123d36] px-4 text-sm font-bold text-white shadow-sm transition hover:bg-[#1b5549]" data-testid="button-refresh-report">
              <RefreshCw size={16} /> Cập nhật báo cáo
            </button>
          </div>
        </div>

        <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_4px_18px_rgba(15,23,42,.04)]" aria-label="Bộ lọc báo cáo">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#e9f7ef] text-[#167345]"><SlidersHorizontal size={16} /></span>
              <div>
                <h2 className="text-sm font-extrabold text-slate-800">Bộ lọc báo cáo</h2>
                <p className="text-xs text-slate-400">Chọn phạm vi dữ liệu cần xem</p>
              </div>
            </div>
            {hasFilters && <button type="button" onClick={resetFilters} className="inline-flex items-center gap-1.5 text-xs font-bold text-[#167345] hover:underline"><X size={14} /> Xóa bộ lọc</button>}
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <FilterSelect label="Phường/Xã" value={ward} onChange={setWard} options={["Tất cả phường/xã", ...wardOptions]} />
            <FilterSelect label="Loại hình cơ sở" value={category} onChange={setCategory} options={["Tất cả loại hình", "Cơ sở cung cấp suất ăn", "Cơ sở giáo dục", "Cơ sở cung cấp thực phẩm"]} />
            <FilterSelect label="Hình thức bữa ăn" value={mealType} onChange={setMealType} options={["Tất cả hình thức", "Tự tổ chức nấu ăn", "Sử dụng suất ăn từ bên ngoài"]} />
            <FilterSelect label="Trạng thái hồ sơ" value={status} onChange={setStatus} options={["Tất cả trạng thái", "Đạt", "Chờ hoàn thiện hồ sơ"]} />
          </div>
          <div className="mt-4 flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center">
            <div className="relative max-w-md flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input value={keyword} onChange={(event) => setKeyword(event.target.value)} placeholder="Tìm theo tên phường/xã..." className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm outline-none transition focus:border-[#1d7a50] focus:bg-white focus:ring-4 focus:ring-[#1d7a50]/10" />
            </div>
            <span className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400"><CalendarDays size={15} /> Kỳ báo cáo: <strong className="text-slate-600">01/01/2026 – 15/09/2026</strong></span>
          </div>
        </section>

        <section className="mt-8">
          <div className="mb-4 flex items-end justify-between">
            <div><p className="text-xs font-bold uppercase tracking-[.16em] text-[#167345]">01 · Tổng quan</p><h2 className="mt-1 text-xl font-extrabold text-slate-800">Tình hình toàn địa bàn</h2></div>
            <span className="hidden text-xs font-medium text-slate-400 sm:block">Số liệu minh họa · cập nhật 15/09/2026</span>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Cơ sở cung cấp suất ăn" value={`${totals.suppliers || 25}`} detail={`${formatNumber(totals.capacity || 30000)} suất/ngày công suất`} icon={PackageCheck} tone="green" />
            <StatCard label="Cơ sở giáo dục" value={`${totals.schools || 40}`} detail={`${totals.selfCook || 40} tự nấu · ${totals.externalMeals || 35} dùng suất ngoài`} icon={School} tone="blue" />
            <StatCard label="Nhu cầu dự kiến" value={`${formatNumber(totals.plannedDemand || 30000)}`} detail="suất ăn/ngày" icon={Utensils} tone="amber" />
            <StatCard label="Nhu cầu thực tế" value={`${formatNumber(totals.actualDemand || 28000)}`} detail={`${formatNumber((totals.plannedDemand || 30000) - (totals.actualDemand || 28000))} suất thấp hơn dự kiến`} icon={TrendingUp} tone="orange" />
          </div>
        </section>

        <section className="mt-8 grid gap-5 xl:grid-cols-[1.35fr_.65fr]">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_4px_18px_rgba(15,23,42,.04)]">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div><p className="text-xs font-bold uppercase tracking-[.16em] text-[#167345]">Cân đối năng lực</p><h2 className="mt-1 text-lg font-extrabold text-slate-800">Cung – cầu suất ăn</h2></div>
              <span className="rounded-full bg-[#e9f7ef] px-3 py-1 text-xs font-bold text-[#167345]">Đang theo dõi</span>
            </div>
            <div className="grid gap-5 sm:grid-cols-3">
              <div><p className="text-xs font-semibold text-slate-400">Tổng công suất cung cấp</p><p className="mt-2 text-2xl font-extrabold text-slate-800">{formatNumber(totals.capacity || 30000)}</p><p className="text-xs text-slate-400">suất/ngày</p></div>
              <div><p className="text-xs font-semibold text-slate-400">Nhu cầu dùng suất ngoài</p><p className="mt-2 text-2xl font-extrabold text-slate-800">{formatNumber(totals.actualDemand || 22000)}</p><p className="text-xs text-slate-400">suất/ngày</p></div>
              <div><p className="text-xs font-semibold text-slate-400">Còn khả năng cung cấp</p><p className={`mt-2 text-2xl font-extrabold ${balance < 0 ? "text-red-600" : "text-[#167345]"}`}>{formatNumber(Math.abs(balance || 8000))}</p><p className="text-xs text-slate-400">{balance < 0 ? "suất/ngày thiếu" : "suất/ngày dư"}</p></div>
            </div>
            <div className="mt-6">
              <div className="mb-2 flex justify-between text-xs font-bold text-slate-500"><span>Mức sử dụng công suất</span><span>{Math.min(100, Math.round(((totals.actualDemand || 22000) / (totals.capacity || 30000)) * 100))}%</span></div>
              <div className="h-3 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-gradient-to-r from-[#1d7a50] to-[#f4c95d]" style={{ width: `${Math.min(100, ((totals.actualDemand || 22000) / (totals.capacity || 30000)) * 100)}%` }} /></div>
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200/80 bg-[#123d36] p-5 text-white shadow-[0_4px_18px_rgba(15,23,42,.08)]">
            <div className="flex items-start justify-between"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-[#f4c95d]">Trạng thái hồ sơ</p><h2 className="mt-1 text-lg font-extrabold">Cơ sở cung cấp suất ăn</h2></div><CheckCircle2 className="text-[#f4c95d]" size={22} /></div>
            <div className="mt-6 space-y-4">
              <div><div className="mb-1.5 flex justify-between text-sm"><span className="text-white/70">Đạt hồ sơ</span><strong>20 cơ sở</strong></div><div className="h-2 rounded-full bg-white/10"><div className="h-full w-[80%] rounded-full bg-[#f4c95d]" /></div><p className="mt-1 text-xs text-white/50">24.000 suất/ngày</p></div>
              <div><div className="mb-1.5 flex justify-between text-sm"><span className="text-white/70">Chờ hoàn thiện hồ sơ</span><strong>5 cơ sở</strong></div><div className="h-2 rounded-full bg-white/10"><div className="h-full w-[20%] rounded-full bg-[#ef9f6b]" /></div><p className="mt-1 text-xs text-white/50">6.000 suất/ngày</p></div>
            </div>
          </div>
        </section>

        <section className="mt-8 rounded-2xl border border-slate-200/80 bg-white shadow-[0_4px_18px_rgba(15,23,42,.04)]">
          <div className="flex flex-col gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-end sm:justify-between">
            <div><p className="text-xs font-bold uppercase tracking-[.16em] text-[#167345]">02 · Theo địa bàn</p><h2 className="mt-1 text-lg font-extrabold text-slate-800">Thống kê theo phường/xã</h2><p className="mt-1 text-sm text-slate-500">Chọn một địa bàn để xem danh sách cơ sở giáo dục và nhu cầu suất ăn.</p></div>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400"><MapPin size={14} /> {filteredRows.length} địa bàn</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px] text-left text-sm">
              <thead className="bg-slate-50 text-xs font-bold text-slate-500"><tr><th className="px-5 py-3.5">Phường/Xã</th><th className="px-4 py-3.5 text-right">Cơ sở GD</th><th className="px-4 py-3.5 text-right">Tự nấu</th><th className="px-4 py-3.5 text-right">Suất ăn ngoài</th><th className="px-4 py-3.5 text-right">Nhu cầu dự kiến</th><th className="px-4 py-3.5 text-right">Nhu cầu thực tế</th><th className="px-4 py-3.5 text-right">Cơ sở cung cấp</th><th className="px-4 py-3.5 text-right">Công suất</th><th className="px-5 py-3.5" /></tr></thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRows.map((row) => <tr key={row.name} className="group transition hover:bg-[#f7fbf8]"><td className="px-5 py-4 font-bold text-slate-700">{row.name}</td><td className="px-4 py-4 text-right font-semibold text-slate-600">{row.schools}</td><td className="px-4 py-4 text-right text-slate-600">{row.selfCook}</td><td className="px-4 py-4 text-right text-slate-600">{row.externalMeals}</td><td className="px-4 py-4 text-right font-semibold text-slate-700">{formatNumber(row.plannedDemand)}</td><td className="px-4 py-4 text-right text-slate-600">{formatNumber(row.actualDemand)}</td><td className="px-4 py-4 text-right text-slate-600">{row.suppliers}</td><td className="px-4 py-4 text-right font-semibold text-[#167345]">{formatNumber(row.capacity)}</td><td className="px-5 py-4 text-right"><button type="button" onClick={() => setSelectedRegion(row)} className="inline-flex items-center gap-1 text-xs font-bold text-[#167345] opacity-70 transition group-hover:opacity-100" data-testid={`button-region-${row.name}`}>Chi tiết <ChevronRight size={14} /></button></td></tr>)}
                {!filteredRows.length && <tr><td colSpan={9} className="px-5 py-12 text-center text-sm text-slate-400">Không tìm thấy dữ liệu phù hợp với bộ lọc hiện tại.</td></tr>}
              </tbody>
              <tfoot className="border-t-2 border-slate-200 bg-slate-50/70 font-extrabold text-slate-700"><tr><td className="px-5 py-4">Tổng cộng</td><td className="px-4 py-4 text-right">{totals.schools}</td><td className="px-4 py-4 text-right">{totals.selfCook}</td><td className="px-4 py-4 text-right">{totals.externalMeals}</td><td className="px-4 py-4 text-right">{formatNumber(totals.plannedDemand)}</td><td className="px-4 py-4 text-right">{formatNumber(totals.actualDemand)}</td><td className="px-4 py-4 text-right">{totals.suppliers}</td><td className="px-4 py-4 text-right text-[#167345]">{formatNumber(totals.capacity)}</td><td /></tr></tfoot>
            </table>
          </div>
        </section>

        <section className="mt-8 grid gap-5 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_4px_18px_rgba(15,23,42,.04)]"><div className="mb-5 flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#e9f7ef] text-[#167345]"><Filter size={17} /></span><div><p className="text-xs font-bold uppercase tracking-[.16em] text-[#167345]">03 · Phân loại</p><h2 className="mt-1 text-lg font-extrabold text-slate-800">Theo loại hình hoạt động</h2></div></div><div className="overflow-x-auto"><table className="w-full min-w-[530px] text-left text-sm"><thead className="border-b border-slate-100 text-xs font-bold text-slate-400"><tr><th className="pb-3">Loại hình</th><th className="pb-3 text-right">Số cơ sở</th><th className="pb-3 text-right">Dự kiến</th><th className="pb-3 text-right">Thực tế</th></tr></thead><tbody className="divide-y divide-slate-100"><tr><td className="py-3 font-semibold text-slate-700">Cơ sở cung cấp suất ăn</td><td className="py-3 text-right">25</td><td className="py-3 text-right font-semibold">30.000</td><td className="py-3 text-right text-slate-400">—</td></tr><tr><td className="py-3 font-semibold text-slate-700">Cơ sở giáo dục · Tự nấu</td><td className="py-3 text-right">40</td><td className="py-3 text-right font-semibold">18.000</td><td className="py-3 text-right">17.200</td></tr><tr><td className="py-3 font-semibold text-slate-700">Cơ sở giáo dục · Suất ăn ngoài</td><td className="py-3 text-right">35</td><td className="py-3 text-right font-semibold">22.000</td><td className="py-3 text-right">20.800</td></tr><tr><td className="py-3 font-semibold text-slate-700">Cơ sở cung cấp thực phẩm</td><td className="py-3 text-right">60</td><td className="py-3 text-right text-slate-400">—</td><td className="py-3 text-right text-slate-400">—</td></tr></tbody></table></div></div>
          <div className="rounded-2xl border border-[#d7eadd] bg-[#f5fbf7] p-5 shadow-[0_4px_18px_rgba(15,23,42,.04)]"><div className="flex items-start justify-between"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-[#167345]">04 · Chỉ số điều hành</p><h2 className="mt-1 text-lg font-extrabold text-slate-800">Nhu cầu suất ăn</h2></div><TrendingUp className="text-[#167345]" size={22} /></div><div className="mt-6 space-y-5"><div><div className="mb-2 flex items-center justify-between text-sm"><span className="font-semibold text-slate-600">Nhu cầu dự kiến</span><strong className="text-slate-800">30.000 suất/ngày</strong></div><div className="h-3 overflow-hidden rounded-full bg-white"><div className="h-full w-full rounded-full bg-[#1d7a50]" /></div></div><div><div className="mb-2 flex items-center justify-between text-sm"><span className="font-semibold text-slate-600">Nhu cầu thực tế</span><strong className="text-slate-800">28.000 suất/ngày</strong></div><div className="h-3 overflow-hidden rounded-full bg-white"><div className="h-full w-[93%] rounded-full bg-[#f4c95d]" /></div></div></div><p className="mt-6 rounded-xl bg-white/80 p-3 text-xs leading-5 text-slate-500">Nhu cầu thực tế là số suất ăn phát sinh trong ngày vận hành, dùng để đối chiếu với năng lực cung cấp thực tế.</p></div>
        </section>
      </div>

      {selectedRegion && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/45 p-0 sm:items-center sm:p-5" role="dialog" aria-modal="true" aria-label={`Chi tiết ${selectedRegion.name}`}>
          <div className="max-h-[90dvh] w-full max-w-4xl overflow-y-auto rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl">
            <div className="sticky top-0 z-10 flex items-start justify-between border-b border-slate-100 bg-white/95 px-5 py-5 backdrop-blur sm:px-7"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-[#167345]">Chi tiết địa bàn</p><h2 className="mt-1 text-2xl font-extrabold text-slate-800">{selectedRegion.name}</h2></div><button type="button" onClick={() => setSelectedRegion(null)} className="rounded-xl border border-slate-200 p-2 text-slate-500 hover:bg-slate-50" aria-label="Đóng chi tiết"><X size={18} /></button></div>
            <div className="p-5 sm:p-7"><div className="grid gap-3 sm:grid-cols-3"><div className="rounded-2xl bg-[#e9f7ef] p-4"><p className="text-xs font-semibold text-[#167345]/70">Cơ sở giáo dục</p><p className="mt-1 text-2xl font-extrabold text-[#167345]">{selectedRegion.schools}</p></div><div className="rounded-2xl bg-[#e8f2ff] p-4"><p className="text-xs font-semibold text-[#2266a5]/70">Nhu cầu thực tế</p><p className="mt-1 text-2xl font-extrabold text-[#2266a5]">{formatNumber(selectedRegion.actualDemand)}</p><span className="text-xs text-[#2266a5]/70">suất/ngày</span></div><div className="rounded-2xl bg-[#fff6df] p-4"><p className="text-xs font-semibold text-[#a76d05]/70">Công suất cung cấp</p><p className="mt-1 text-2xl font-extrabold text-[#a76d05]">{formatNumber(selectedRegion.capacity)}</p><span className="text-xs text-[#a76d05]/70">suất/ngày</span></div></div><div className="mt-7"><div className="mb-3 flex items-center justify-between"><h3 className="font-extrabold text-slate-800">Danh sách cơ sở giáo dục</h3><span className="text-xs text-slate-400">{selectedRegion.selfCook} tự nấu · {selectedRegion.externalMeals} suất ăn ngoài</span></div><div className="overflow-x-auto rounded-2xl border border-slate-200"><table className="w-full min-w-[660px] text-left text-sm"><thead className="bg-slate-50 text-xs font-bold text-slate-500"><tr><th className="px-4 py-3">Cơ sở giáo dục</th><th className="px-4 py-3">Hình thức</th><th className="px-4 py-3 text-right">Học sinh</th><th className="px-4 py-3 text-right">Dự kiến</th><th className="px-4 py-3 text-right">Thực tế</th><th className="px-4 py-3 text-right">Nhà cung cấp</th></tr></thead><tbody className="divide-y divide-slate-100">{(schoolDetails[selectedRegion.name] ?? []).map((school) => <tr key={school.name}><td className="px-4 py-3.5 font-semibold text-slate-700">{school.name}</td><td className="px-4 py-3.5"><span className={`rounded-full px-2 py-1 text-xs font-bold ${school.organization === "Tự nấu" ? "bg-[#e9f7ef] text-[#167345]" : "bg-[#fff6df] text-[#a76d05]"}`}>{school.organization}</span></td><td className="px-4 py-3.5 text-right text-slate-600">{formatNumber(school.students)}</td><td className="px-4 py-3.5 text-right text-slate-600">{formatNumber(school.plannedDemand)}</td><td className="px-4 py-3.5 text-right font-semibold text-slate-700">{formatNumber(school.actualDemand)}</td><td className="px-4 py-3.5 text-right text-slate-600">{school.suppliers || "—"}</td></tr>)}</tbody></table></div></div></div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}