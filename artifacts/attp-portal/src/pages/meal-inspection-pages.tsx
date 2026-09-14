import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CalendarDays,
  Camera,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Download,
  ExternalLink,
  FileDown,
  FileText,
  Filter,
  MapPin,
  MonitorPlay,
  Pencil,
  Printer,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Video,
  Wifi,
  WifiOff,
} from "lucide-react";
import { Link, useLocation, useParams } from "wouter";
import { AdminShell } from "@/components/portal-ui";
import cameraViewPath from "../../../../attached_assets/Chi_tiết_kiểm_thực_-_MN_Hoa_Sen_1789369484529.png";

type CameraState = "online" | "offline";
type ScoreStatus = "Đạt" | "Cần rà soát" | "Chưa cập nhật";

type SchoolInspection = {
  id: string;
  initials: string;
  name: string;
  shortName: string;
  ward: string;
  address: string;
  date: string;
  inspector: string;
  lastUpdated: string;
  scores: Record<"m1" | "m2" | "m3" | "m4" | "m5", number>;
  statuses: Record<"m1" | "m2" | "m3" | "m4" | "m5", ScoreStatus>;
  camera: CameraState;
  cameraCount: number;
};

const seededSchools: SchoolInspection[] = [
  {
    id: "hoa-sen",
    initials: "MS",
    name: "Trường Mầm non Hoa Sen",
    shortName: "Điểm trường A",
    ward: "Phường Bến Nghé",
    address: "35 Nguyễn Du, phường Bến Nghé",
    date: "09/03/2026",
    inspector: "Trần Minh Hoàng",
    lastUpdated: "10:45",
    scores: { m1: 50, m2: 20, m3: 20, m4: 100, m5: 100 },
    statuses: {
      m1: "Đạt",
      m2: "Đạt",
      m3: "Đạt",
      m4: "Đạt",
      m5: "Đạt",
    },
    camera: "online",
    cameraCount: 3,
  },
  {
    id: "nguyen-hue",
    initials: "NH",
    name: "Trường Tiểu học Nguyễn Huệ",
    shortName: "Tiểu học công lập",
    ward: "Phường Bến Nghé",
    address: "14 Lê Thánh Tôn, phường Bến Nghé",
    date: "09/03/2026",
    inspector: "Nguyễn Thị Lan",
    lastUpdated: "11:15",
    scores: { m1: 50, m2: 20, m3: 20, m4: 100, m5: 100 },
    statuses: {
      m1: "Đạt",
      m2: "Đạt",
      m3: "Đạt",
      m4: "Đạt",
      m5: "Đạt",
    },
    camera: "online",
    cameraCount: 4,
  },
  {
    id: "sao-mai",
    initials: "SM",
    name: "Trường Mầm non Sao Mai",
    shortName: "Điểm trường B",
    ward: "Phường Đa Kao",
    address: "118 Điện Biên Phủ, phường Đa Kao",
    date: "09/03/2026",
    inspector: "Lê Thị Hạnh",
    lastUpdated: "09:30",
    scores: { m1: 50, m2: 20, m3: 20, m4: 100, m5: 100 },
    statuses: {
      m1: "Đạt",
      m2: "Đạt",
      m3: "Cần rà soát",
      m4: "Đạt",
      m5: "Đạt",
    },
    camera: "offline",
    cameraCount: 2,
  },
  {
    id: "ly-thanh-tong",
    initials: "LT",
    name: "Trường THCS Lý Thánh Tông",
    shortName: "Trường học cơ sở",
    ward: "Phường Tân Định",
    address: "42 Trần Quý Khoách, phường Tân Định",
    date: "09/03/2026",
    inspector: "Phạm Quốc Bảo",
    lastUpdated: "10:55",
    scores: { m1: 50, m2: 20, m3: 20, m4: 100, m5: 100 },
    statuses: {
      m1: "Đạt",
      m2: "Đạt",
      m3: "Đạt",
      m4: "Đạt",
      m5: "Đạt",
    },
    camera: "online",
    cameraCount: 3,
  },
  {
    id: "le-loi",
    initials: "LL",
    name: "Trường Tiểu học Lê Lợi",
    shortName: "Điểm trường trung tâm",
    ward: "Phường Bến Nghé",
    address: "85 Lê Lợi, phường Bến Nghé",
    date: "08/03/2026",
    inspector: "Nguyễn Thị Lan",
    lastUpdated: "15:20",
    scores: { m1: 50, m2: 20, m3: 20, m4: 100, m5: 100 },
    statuses: {
      m1: "Đạt",
      m2: "Đạt",
      m3: "Đạt",
      m4: "Đạt",
      m5: "Đạt",
    },
    camera: "online",
    cameraCount: 5,
  },
  {
    id: "minh-khai",
    initials: "MK",
    name: "Trường THCS Minh Khai",
    shortName: "Khu bếp bán trú",
    ward: "Phường Tân Định",
    address: "91 Hai Bà Trưng, phường Tân Định",
    date: "08/03/2026",
    inspector: "Phạm Quốc Bảo",
    lastUpdated: "14:10",
    scores: { m1: 50, m2: 20, m3: 20, m4: 100, m5: 100 },
    statuses: {
      m1: "Đạt",
      m2: "Cần rà soát",
      m3: "Đạt",
      m4: "Đạt",
      m5: "Chưa cập nhật",
    },
    camera: "online",
    cameraCount: 2,
  },
];

const steps = [
  {
    id: "1",
    label: "Mẫu 1",
    title: "Kiểm tra nguyên liệu nhập vào",
    description: "Nguồn gốc, chứng từ và cảm quan thực phẩm",
    score: "m1" as const,
  },
  {
    id: "2",
    label: "Mẫu 2",
    title: "Kiểm tra quy trình chế biến",
    description: "Thực hiện vệ sinh trong quá trình chế biến",
    score: "m2" as const,
  },
  {
    id: "3",
    label: "Mẫu 3",
    title: "Kiểm tra trước khi ăn",
    description: "Đánh giá món ăn trước khi phục vụ",
    score: "m3" as const,
  },
  {
    id: "4",
    label: "Mẫu 4",
    title: "Nhật ký lưu mẫu thực phẩm",
    description: "Theo dõi thời gian và điều kiện lưu mẫu",
    score: "m4" as const,
  },
  {
    id: "5",
    label: "Mẫu 5",
    title: "Theo dõi hủy mẫu thức ăn",
    description: "Xác nhận hủy mẫu và lưu trữ minh chứng",
    score: "m5" as const,
  },
];

const formTabs = [
  { id: "1", label: "Mẫu 1", title: "Kiểm tra trước khi chế biến" },
  { id: "2", label: "Mẫu 2", title: "Kiểm tra khi chế biến" },
  { id: "3", label: "Mẫu 3", title: "Kiểm tra trước khi ăn" },
  { id: "5", label: "Mẫu 5", title: "Theo dõi lưu và hủy mẫu thức ăn" },
];

const defaultRows: Record<string, string[][]> = {
  "1": [
    [
      "1",
      "Thịt bò Kobe",
      "Cửa hàng Vissan",
      "Nguyễn Văn A",
      "0907548119",
      "3 kg",
      "Công ty TNHH Vissan",
      "Đạt",
      "Đạt",
      "Đạt",
      "Đạt",
      "—",
    ],
  ],
  "2": [
    [
      "1",
      "Bữa trưa",
      "Thịt kho trứng",
      "Thịt, trứng, gia vị",
      "180",
      "09:15",
      "10:00",
      "Đạt",
      "Đạt",
      "Đạt",
      "—",
    ],
  ],
  "3": [
    [
      "1",
      "Bữa trưa",
      "Thịt kho trứng",
      "180",
      "10:15",
      "10:20",
      "Đạt",
      "Đạt",
      "—",
    ],
  ],
  "5": [
    [
      "1",
      "Thịt kho trứng",
      "Bữa ăn trưa",
      "180 suất",
      "2 kg",
      "Hộp chuyên dụng",
      "2–8°C",
      "10/03/2026",
      "11/03/2026",
      "Đã xác nhận",
      "Nguyễn Văn A",
      "—",
    ],
  ],
};

const headers: Record<string, string[]> = {
  "1": [
    "TT",
    "Tên thực phẩm",
    "Tên cơ sở sản xuất",
    "Tên chủ giao hàng",
    "Địa chỉ, điện thoại",
    "Khối lượng",
    "Nơi cung cấp",
    "Chứng từ",
    "Giấy ĐK VS Thú y",
    "Kiểm dịch",
    "Kiểm tra cảm quan",
    "Biện pháp xử lý / Ghi chú",
  ],
  "2": [
    "TT",
    "Ca/Bữa ăn",
    "Tên món ăn",
    "Nguyên liệu chính",
    "Số lượng / suất ăn",
    "Thời gian sơ chế",
    "Thời gian chế biến",
    "Người tham gia",
    "Thiết bị, dụng cụ",
    "Khu vực chế biến",
    "Biện pháp xử lý / Ghi chú",
  ],
  "3": [
    "TT",
    "Ca/Bữa ăn",
    "Tên món ăn",
    "Số lượng / suất ăn",
    "Thời gian chia món",
    "Thời gian bắt đầu ăn",
    "Dụng cụ, chia, đựng",
    "Kiểm tra cảm quan món ăn",
    "Biện pháp xử lý / Ghi chú",
  ],
  "5": [
    "TT",
    "Tên món thức ăn",
    "Bữa ăn",
    "Số lượng suất ăn",
    "Khối lượng",
    "Dụng cụ chứa mẫu",
    "Nhiệt độ bảo quản",
    "Thời gian lấy mẫu",
    "Thời gian hủy mẫu",
    "Ghi chú",
    "Người lưu mẫu",
    "Hình ảnh mẫu",
  ],
};

function readStorage<T>(key: string, fallback: T): T {
  try {
    const saved = localStorage.getItem(key);
    return saved ? (JSON.parse(saved) as T) : fallback;
  } catch {
    return fallback;
  }
}

function saveStorage<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}

function downloadCsv(filename: string, rows: string[][]) {
  const csv = rows
    .map((row) =>
      row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(","),
    )
    .join("\n");
  const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

function PageFrame({ children }: { children: React.ReactNode }) {
  return (
    <AdminShell>
      <div className="min-h-[calc(100dvh-65px)] bg-[#f6f8fa]">{children}</div>
    </AdminShell>
  );
}

function TinyStatus({
  status,
  compact = false,
}: {
  status: ScoreStatus;
  compact?: boolean;
}) {
  const isGood = status === "Đạt";
  const isReview = status === "Cần rà soát";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[10px] font-extrabold ${
        isGood
          ? "bg-emerald-50 text-emerald-700"
          : isReview
            ? "bg-rose-50 text-rose-600"
            : "bg-slate-100 text-slate-500"
      }`}
      data-testid={`status-score-${status}`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          isGood ? "bg-emerald-500" : isReview ? "bg-rose-500" : "bg-slate-400"
        }`}
      />
      {compact ? (isGood ? "Đạt" : isReview ? "Rà soát" : "Chưa có") : status}
    </span>
  );
}

function DashboardHeader({
  onExport,
  exportLabel = "Xuất báo cáo",
}: {
  onExport?: () => void;
  exportLabel?: string;
}) {
  return (
    <div className="flex flex-col gap-4 border-b border-slate-200/80 bg-white px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
      <div>
        <div className="mb-2 flex items-center gap-2 text-[11px] font-semibold text-slate-400">
          <Link href="/admin/meals/three-step" className="hover:text-orange-600">
            Quản lý bữa ăn
          </Link>
          <ChevronRight size={13} />
          <span className="text-slate-600">Kiểm thực 3 bước</span>
        </div>
        <h1 className="text-[22px] font-extrabold tracking-tight text-slate-900 sm:text-[26px]">
          Nhật ký kiểm thực 3 bước
        </h1>
        <p className="mt-1 text-xs font-medium text-slate-500 sm:text-sm">
          Theo dõi và giám sát an toàn thực phẩm tại các cơ sở giáo dục
        </p>
      </div>
      {onExport && (
        <button
          type="button"
          onClick={onExport}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-orange-500 px-4 py-2.5 text-xs font-extrabold text-white shadow-sm shadow-orange-500/20 transition hover:bg-orange-600"
          data-testid="button-export-inspection-report"
        >
          <FileDown size={15} /> {exportLabel}
        </button>
      )}
    </div>
  );
}

export function ThreeStepInspectionDashboard() {
  const [schools] = useState(() =>
    readStorage<SchoolInspection[]>("attp-three-step-records-v1", seededSchools),
  );
  const [ward, setWard] = useState("Tất cả phường");
  const [school, setSchool] = useState("Tất cả trường");
  const [date, setDate] = useState("09/03/2026");
  const [page, setPage] = useState(1);
  const pageSize = 4;
  const wards = [...new Set(schools.map((item) => item.ward))];
  const filtered = useMemo(
    () =>
      schools.filter(
        (item) =>
          (ward === "Tất cả phường" || item.ward === ward) &&
          (school === "Tất cả trường" || item.id === school) &&
          (!date || item.date === date),
      ),
    [date, school, schools, ward],
  );
  const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const visible = filtered.slice((page - 1) * pageSize, page * pageSize);
  const exportRows = filtered.map((item) => [
    item.name,
    item.ward,
    item.date,
    item.inspector,
    `${item.scores.m1}`,
    `${item.scores.m2}`,
    `${item.scores.m3}`,
    item.camera === "online" ? "Đang kết nối" : "Ngoại tuyến",
  ]);

  useEffect(() => {
    if (page > pages) setPage(pages);
  }, [page, pages]);

  const handleFilter = () => setPage(1);

  return (
    <PageFrame>
      <DashboardHeader
        onExport={() =>
          downloadCsv("nhat-ky-kiem-thuc-3-buoc.csv", [
            ["Trường học", "Phường", "Ngày thực hiện", "Người kiểm tra", "Mẫu 1", "Mẫu 2", "Mẫu 3", "Camera"],
            ...exportRows,
          ])
        }
      />
      <div className="mx-auto max-w-[1500px] px-4 py-5 sm:px-7 lg:px-9">
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            {
              label: "Tổng số trường",
              value: "15",
              note: "Trong địa bàn quản lý",
              icon: Building2,
              cls: "bg-blue-50 text-blue-600",
            },
            {
              label: "Tổng số mẫu",
              value: "12",
              note: "Đã ghi nhận hôm nay",
              icon: CheckCircle2,
              cls: "bg-emerald-50 text-emerald-600",
            },
            {
              label: "Tổng lưu mẫu",
              value: "02",
              note: "Cần theo dõi thêm",
              icon: ShieldCheck,
              cls: "bg-amber-50 text-amber-600",
            },
          ].map((card) => (
            <div
              key={card.label}
              className="rounded-xl border border-slate-200 bg-white px-4 py-4 shadow-[0_2px_8px_rgba(15,23,42,.03)] sm:px-5"
              data-testid={`card-summary-${card.label}`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[11px] font-bold text-slate-400">{card.label}</p>
                  <p className="mt-2 text-2xl font-black tracking-tight text-slate-900">{card.value}</p>
                  <p className="mt-1 text-[10px] font-medium text-slate-400">{card.note}</p>
                </div>
                <span className={`rounded-lg p-2.5 ${card.cls}`}>
                  <card.icon size={18} />
                </span>
              </div>
            </div>
          ))}
        </div>

        <section className="mt-4 rounded-xl border border-slate-200 bg-white p-4 shadow-[0_2px_8px_rgba(15,23,42,.03)] sm:p-5">
          <div className="mb-3 flex items-center gap-2 text-xs font-extrabold text-slate-700">
            <SlidersHorizontal size={15} className="text-orange-500" /> Bộ lọc dữ liệu
          </div>
          <div className="grid gap-3 md:grid-cols-[1fr_1fr_1fr_auto]">
            <label className="block">
              <span className="mb-1.5 block text-[10px] font-extrabold uppercase tracking-wide text-slate-400">
                Xã / phường
              </span>
              <select
                value={ward}
                onChange={(event) => {
                  setWard(event.target.value);
                  setPage(1);
                }}
                className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs font-semibold text-slate-700 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                data-testid="select-filter-ward"
              >
                <option>Tất cả phường</option>
                {wards.map((item) => <option key={item}>{item}</option>)}
              </select>
            </label>
            <label className="block">
              <span className="mb-1.5 block text-[10px] font-extrabold uppercase tracking-wide text-slate-400">Trường</span>
              <select
                value={school}
                onChange={(event) => {
                  setSchool(event.target.value);
                  setPage(1);
                }}
                className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs font-semibold text-slate-700 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                data-testid="select-filter-school"
              >
                <option value="Tất cả trường">Tất cả trường</option>
                {schools.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
              </select>
            </label>
            <label className="block">
              <span className="mb-1.5 block text-[10px] font-extrabold uppercase tracking-wide text-slate-400">Ngày thực hiện</span>
              <div className="relative">
                <CalendarDays size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={date}
                  onChange={(event) => {
                    setDate(event.target.value);
                    setPage(1);
                  }}
                  className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-xs font-semibold text-slate-700 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                  data-testid="input-filter-date"
                />
              </div>
            </label>
            <button
              type="button"
              onClick={handleFilter}
              className="self-end rounded-lg bg-slate-900 px-4 py-2.5 text-xs font-extrabold text-white transition hover:bg-slate-700"
              data-testid="button-apply-inspection-filters"
            >
              <Search size={14} className="mr-1.5 inline-block" /> Lọc dữ liệu
            </button>
          </div>
        </section>

        <section className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_2px_8px_rgba(15,23,42,.03)]">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-4 py-4 sm:px-5">
            <div>
              <h2 className="text-sm font-extrabold text-slate-800">Danh sách nhật ký kiểm thực</h2>
              <p className="mt-0.5 text-[11px] font-medium text-slate-400">Cập nhật theo dữ liệu giám sát tại cơ sở</p>
            </div>
            <span className="rounded-full bg-orange-50 px-2.5 py-1 text-[10px] font-extrabold text-orange-600">
              {filtered.length} bản ghi
            </span>
          </div>
          {visible.length ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[980px] text-left">
                <thead className="bg-slate-50 text-[10px] font-extrabold uppercase tracking-wide text-slate-400">
                  <tr>
                    <th className="px-5 py-3">Trường học</th>
                    <th className="px-3 py-3">Ngày thực hiện</th>
                    <th className="px-3 py-3">Người kiểm tra</th>
                    <th className="px-3 py-3">Kết quả 5 mẫu</th>
                    <th className="px-3 py-3">IoT / Camera</th>
                    <th className="px-3 py-3">Cập nhật cuối</th>
                    <th className="px-5 py-3 text-right">Hành động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {visible.map((item) => (
                    <tr key={item.id} className="group transition hover:bg-orange-50/35" data-testid={`row-school-${item.id}`}>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-orange-50 text-xs font-black text-orange-600">{item.initials}</span>
                          <div>
                            <p className="text-xs font-extrabold text-slate-800">{item.name}</p>
                            <p className="mt-0.5 text-[10px] font-medium text-slate-400">{item.shortName}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-4 text-xs font-semibold text-slate-600">{item.date}</td>
                      <td className="px-3 py-4 text-xs font-semibold text-slate-600">{item.inspector}</td>
                      <td className="px-3 py-4">
                        <div className="flex gap-1.5">
                          {steps.map((step) => (
                            <TinyStatus key={step.id} status={item.statuses[step.score]} compact />
                          ))}
                        </div>
                      </td>
                      <td className="px-3 py-4">
                        <div className={`inline-flex items-center gap-1.5 text-[10px] font-extrabold ${item.camera === "online" ? "text-emerald-600" : "text-rose-500"}`}>
                          {item.camera === "online" ? <Video size={15} /> : <WifiOff size={15} />}
                          {item.camera === "online" ? `${item.cameraCount} camera · Online` : "Offline"}
                        </div>
                      </td>
                      <td className="px-3 py-4">
                        <p className="text-xs font-bold text-slate-600">{item.lastUpdated}</p>
                        <p className="text-[10px] text-slate-400">{item.date}</p>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <Link
                          href={`/admin/meals/three-step/${item.id}`}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-[11px] font-extrabold text-slate-600 transition hover:border-orange-300 hover:bg-orange-50 hover:text-orange-600"
                          data-testid={`link-view-inspection-${item.id}`}
                        >
                          Xem chi tiết <ArrowRight size={13} />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="px-6 py-16 text-center">
              <Filter size={28} className="mx-auto text-slate-300" />
              <p className="mt-3 text-sm font-extrabold text-slate-700">Không có nhật ký phù hợp</p>
              <p className="mt-1 text-xs text-slate-400">Thử điều chỉnh phường, trường hoặc ngày thực hiện.</p>
            </div>
          )}
          <div className="flex flex-col gap-3 border-t border-slate-100 px-5 py-3 text-[11px] font-medium text-slate-400 sm:flex-row sm:items-center sm:justify-between">
            <span>Hiển thị {filtered.length ? (page - 1) * pageSize + 1 : 0}–{Math.min(page * pageSize, filtered.length)} trong {filtered.length} trường</span>
            <div className="flex items-center gap-1">
              <button type="button" onClick={() => setPage((current) => Math.max(1, current - 1))} disabled={page === 1} className="rounded-md border border-slate-200 p-1.5 text-slate-500 disabled:opacity-40" data-testid="button-pagination-previous"><ChevronLeft size={14} /></button>
              {Array.from({ length: pages }, (_, index) => index + 1).map((item) => (
                <button type="button" key={item} onClick={() => setPage(item)} className={`h-7 min-w-7 rounded-md px-2 text-[11px] font-extrabold ${page === item ? "bg-orange-500 text-white" : "border border-slate-200 text-slate-500 hover:border-orange-300"}`} data-testid={`button-pagination-${item}`}>{item}</button>
              ))}
              <button type="button" onClick={() => setPage((current) => Math.min(pages, current + 1))} disabled={page === pages} className="rounded-md border border-slate-200 p-1.5 text-slate-500 disabled:opacity-40" data-testid="button-pagination-next"><ChevronRight size={14} /></button>
            </div>
          </div>
        </section>
      </div>
    </PageFrame>
  );
}

export function ThreeStepInspectionDetail() {
  const { schoolId } = useParams<{ schoolId: string }>();
  const [, navigate] = useLocation();
  const [schools, setSchools] = useState(() => readStorage("attp-three-step-records-v1", seededSchools));
  const school = schools.find((item) => item.id === schoolId) ?? seededSchools[0];
  const [activeStep, setActiveStep] = useState("4");
  const [live, setLive] = useState(() => readStorage(`attp-camera-live:${school.id}`, true));
  const active = steps.find((step) => step.id === activeStep) ?? steps[3];

  const setCameraLive = () => {
    const next = !live;
    setLive(next);
    saveStorage(`attp-camera-live:${school.id}`, next);
  };
  const markReviewed = () => {
    const next = schools.map((item) => item.id === school.id ? { ...item, lastUpdated: "Vừa xong" } : item);
    setSchools(next);
    saveStorage("attp-three-step-records-v1", next);
  };

  return (
    <PageFrame>
      <div className="border-b border-slate-200/80 bg-white px-5 py-4 sm:px-8">
        <button type="button" onClick={() => navigate("/admin/meals/three-step")} className="mb-3 inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-orange-600" data-testid="button-back-inspection-list"><ArrowLeft size={15} /> Quay lại danh sách</button>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-[11px] font-medium text-slate-400"><MapPin size={13} className="text-orange-500" /> {school.ward} <span>•</span> {school.date} <span>•</span> Bữa trưa</div>
            <h1 className="mt-1 text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">{school.name}</h1>
          </div>
          <button type="button" onClick={markReviewed} className="inline-flex w-fit items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-extrabold text-emerald-700 hover:bg-emerald-100" data-testid="button-mark-inspection-reviewed"><Check size={14} /> Đánh dấu đã rà soát</button>
        </div>
      </div>
      <div className="mx-auto max-w-[1500px] px-4 py-5 sm:px-7 lg:px-9">
        <div className="mb-4 flex items-center gap-2 text-xs font-extrabold text-slate-700"><FileText size={16} className="text-orange-500" /> Nhật ký kiểm thực 3 bước <span className="ml-auto text-[10px] font-semibold text-slate-400">Cập nhật {school.lastUpdated}</span></div>
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1.3fr)_minmax(340px,.9fr)]">
          <section className="space-y-3">
            {steps.map((step, index) => {
              const isActive = activeStep === step.id;
              const status = school.statuses[step.score];
              return (
                <div key={step.id}>
                  <button type="button" onClick={() => setActiveStep(step.id)} className={`flex w-full items-center gap-3 rounded-xl border px-4 py-4 text-left transition ${isActive ? "border-orange-200 bg-orange-50/70 shadow-sm" : "border-slate-200 bg-white hover:border-orange-200 hover:bg-orange-50/30"}`} data-testid={`button-select-step-${step.id}`}>
                    <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-black ${isActive ? "bg-orange-500 text-white" : "bg-orange-50 text-orange-600"}`}>0{index + 1}</span>
                    <span className="min-w-0 flex-1">
                      <span className="flex flex-wrap items-center gap-2 text-sm font-extrabold text-slate-800">{step.label}: {step.title}<TinyStatus status={status} /></span>
                      <span className="mt-1 block text-[11px] font-medium text-slate-400">{step.description}</span>
                    </span>
                    <ChevronRight size={17} className={isActive ? "text-orange-500" : "text-slate-300"} />
                  </button>
                  {isActive && (
                    <div className="ml-4 border-l-2 border-orange-200 px-4 pb-1 pt-3">
                      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-white px-3 py-3 text-xs shadow-sm ring-1 ring-slate-100">
                        <div><p className="font-extrabold text-slate-700">Kết quả đang ghi nhận</p><p className="mt-1 text-[11px] text-slate-400">Điểm kiểm tra của {step.label.toLowerCase()} trong ngày {school.date}</p></div>
                        <Link href={`/admin/meals/three-step/${school.id}/form/${step.id === "4" ? "5" : step.id}`} className="inline-flex items-center gap-1.5 rounded-lg bg-orange-500 px-3 py-2 text-[11px] font-extrabold text-white hover:bg-orange-600" data-testid={`link-open-form-step-${step.id}`}>Mở biểu mẫu <ExternalLink size={13} /></Link>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </section>

          <aside className="space-y-4">
            <section className="overflow-hidden rounded-xl border border-slate-200 bg-white">
              <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                <h2 className="flex items-center gap-2 text-sm font-extrabold text-slate-700"><Video size={16} className="text-orange-500" /> Trạng thái Camera</h2>
                <span className="text-[9px] font-extrabold uppercase tracking-wider text-slate-400">Hệ thống IoT</span>
              </div>
              <div className="divide-y divide-slate-100">
                {[["Khu 1", school.camera === "online" ? "3 Camera" : "2 Camera", school.camera], ["Khu 2", "4 Camera", "online" as CameraState], ["Khu 3", "2 Camera", school.camera === "online" ? "online" : "offline"]].map(([area, count, status]) => (
                  <div key={area} className="flex items-center justify-between px-4 py-3 text-xs">
                    <span className="flex items-center gap-2 font-bold text-slate-700"><span className={`h-2 w-2 rounded-full ${status === "online" ? "bg-emerald-500" : "bg-rose-500"}`} />{area}</span>
                    <span className="flex items-center gap-3 text-[10px] font-semibold text-slate-400"><span>{count}</span><span className={status === "online" ? "text-emerald-600" : "text-rose-500"}>{status === "online" ? "ONLINE" : "OFFLINE"}</span></span>
                  </div>
                ))}
              </div>
            </section>
            <section className="overflow-hidden rounded-xl bg-slate-950 p-3 text-white shadow-lg shadow-slate-900/10">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-sm font-extrabold"><span className={`h-2 w-2 rounded-full ${live ? "bg-red-500" : "bg-slate-500"}`} /> Live View - Trực tiếp bếp</h2>
                <div className="flex items-center gap-1">
                  <button type="button" onClick={setCameraLive} className="rounded-md bg-white/10 p-2 text-slate-300 hover:bg-white/20" aria-label={live ? "Tạm dừng live view" : "Bật live view"} data-testid="button-toggle-live-view">{live ? <Wifi size={14} /> : <WifiOff size={14} />}</button>
                  <button type="button" onClick={() => window.open(cameraViewPath, "_blank", "noopener,noreferrer")} className="rounded-md bg-white/10 p-2 text-slate-300 hover:bg-white/20" aria-label="Mở hình ảnh camera" data-testid="button-open-camera-image"><MonitorPlay size={14} /></button>
                </div>
              </div>
              <div className="relative overflow-hidden rounded-lg bg-slate-800">
                <img src={cameraViewPath} alt="Hình ảnh khu bếp và các camera giám sát" className={`aspect-[1.5] w-full object-cover ${!live ? "grayscale opacity-50" : ""}`} data-testid="img-live-camera-view" />
                <div className="absolute left-2 top-2 flex items-center gap-1.5 rounded bg-red-600 px-2 py-1 text-[9px] font-black uppercase"><span className="h-1.5 w-1.5 rounded-full bg-white" /> {live ? "Live" : "Paused"}</div>
              </div>
              <div className="mt-3 flex items-center justify-between text-[10px] font-semibold text-slate-400"><span className="flex items-center gap-1.5 text-emerald-400"><Wifi size={12} /> Băng thông: 4.2 Mbps</span><span>Độ phân giải Full HD 1080p</span></div>
            </section>
            <div className="rounded-xl border border-blue-100 bg-blue-50/70 p-4">
              <div className="flex gap-3"><Camera size={18} className="mt-0.5 shrink-0 text-blue-600" /><div><p className="text-xs font-extrabold text-blue-900">{active.label}: {active.title}</p><p className="mt-1 text-[11px] leading-5 text-blue-700/75">Chọn một bước ở bên trái để kiểm tra chi tiết và mở biểu mẫu ghi nhận.</p></div></div>
            </div>
          </aside>
        </div>
      </div>
    </PageFrame>
  );
}

function FormMeta({
  school,
  values,
  onChange,
}: {
  school: SchoolInspection;
  values: { facility: string; inspector: string; date: string; location: string };
  onChange: (key: keyof typeof values, value: string) => void;
}) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
      <div className="mb-4 flex items-center justify-between">
        <div><p className="text-[10px] font-extrabold uppercase tracking-[.15em] text-orange-500">Thông tin biên bản</p><h2 className="mt-1 text-base font-extrabold text-slate-800">Mẫu biểu ghi chép kiểm thực ba bước</h2></div>
        <ShieldCheck size={22} className="text-emerald-500" />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {([
          ["facility", "Tên cơ sở", values.facility || school.name],
          ["inspector", "Người kiểm tra", values.inspector || school.inspector],
          ["date", "Thời gian kiểm tra", values.date || school.date],
          ["location", "Địa điểm kiểm tra", values.location || `Bếp ${school.shortName}`],
        ] as Array<[keyof typeof values, string, string]>).map(([key, label, placeholder]) => (
          <label key={key} className="block">
            <span className="mb-1.5 block text-[10px] font-extrabold text-slate-500">{label}</span>
            <input value={values[key]} onChange={(event) => onChange(key, event.target.value)} placeholder={placeholder} className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs font-semibold text-slate-700 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100" data-testid={`input-form-meta-${key}`} />
          </label>
        ))}
      </div>
    </section>
  );
}

export function ThreeStepInspectionForm() {
  const { schoolId, formId = "1" } = useParams<{ schoolId: string; formId: string }>();
  const [, navigate] = useLocation();
  const school = seededSchools.find((item) => item.id === schoolId) ?? seededSchools[0];
  const normalizedFormId = formTabs.some((item) => item.id === formId) ? formId : "1";
  const tab = formTabs.find((item) => item.id === normalizedFormId) ?? formTabs[0];
  const saved = readStorage<{ meta: { facility: string; inspector: string; date: string; location: string }; rows: string[][] }>(
    `attp-inspection-form:${school.id}:${normalizedFormId}`,
    { meta: { facility: school.name, inspector: school.inspector, date: school.date, location: `Bếp ${school.shortName}` }, rows: defaultRows[normalizedFormId].map((row) => [...row]) },
  );
  const [meta, setMeta] = useState(saved.meta);
  const [rows, setRows] = useState(saved.rows);
  const [saveState, setSaveState] = useState("Chưa lưu thay đổi");

  useEffect(() => {
    const next = readStorage<{ meta: typeof saved.meta; rows: string[][] }>(
      `attp-inspection-form:${school.id}:${normalizedFormId}`,
      { meta: { facility: school.name, inspector: school.inspector, date: school.date, location: `Bếp ${school.shortName}` }, rows: defaultRows[normalizedFormId].map((row) => [...row]) },
    );
    setMeta(next.meta);
    setRows(next.rows);
    setSaveState("Chưa lưu thay đổi");
  }, [normalizedFormId, school.id]);

  const updateCell = (rowIndex: number, columnIndex: number, value: string) => {
    setRows((current) => current.map((row, index) => index === rowIndex ? row.map((cell, cellIndex) => cellIndex === columnIndex ? value : cell) : row));
    setSaveState("Có thay đổi chưa lưu");
  };
  const updateMeta = (key: keyof typeof meta, value: string) => {
    setMeta((current) => ({ ...current, [key]: value }));
    setSaveState("Có thay đổi chưa lưu");
  };
  const saveForm = () => {
    saveStorage(`attp-inspection-form:${school.id}:${normalizedFormId}`, { meta, rows });
    setSaveState("Đã lưu lúc " + new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }));
  };
  const addRow = () => {
    setRows((current) => [...current, Array(headers[normalizedFormId].length).fill("").map((cell, index) => index === 0 ? String(current.length + 1) : cell)]);
    setSaveState("Có thay đổi chưa lưu");
  };

  return (
    <PageFrame>
      <div className="border-b border-slate-200/80 bg-white px-5 py-4 sm:px-8">
        <button type="button" onClick={() => navigate(`/admin/meals/three-step/${school.id}`)} className="mb-3 inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-orange-600" data-testid="button-back-inspection-detail"><ArrowLeft size={15} /> Quay lại chi tiết</button>
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div><p className="text-[10px] font-extrabold uppercase tracking-[.15em] text-orange-500">Nhật ký kiểm thực 3 bước</p><h1 className="mt-1 text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">{school.name}</h1></div>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => window.print()} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-extrabold text-slate-600 hover:border-orange-300 hover:text-orange-600" data-testid="button-print-inspection-form"><Printer size={14} /> In biểu mẫu</button>
            <button type="button" onClick={() => downloadCsv(`mau-${normalizedFormId}-${school.id}.csv`, [headers[normalizedFormId], ...rows])} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-extrabold text-slate-600 hover:border-orange-300 hover:text-orange-600" data-testid="button-export-inspection-form"><Download size={14} /> Xuất Excel</button>
            <button type="button" onClick={saveForm} className="inline-flex items-center gap-2 rounded-lg bg-orange-500 px-3 py-2 text-xs font-extrabold text-white shadow-sm hover:bg-orange-600" data-testid="button-save-inspection-form"><Check size={14} /> Lưu biểu mẫu</button>
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-[1500px] px-4 py-5 sm:px-7 lg:px-9">
        <FormMeta school={school} values={meta} onChange={updateMeta} />
        <div className="mt-4 grid grid-cols-2 gap-2 rounded-xl border border-slate-200 bg-slate-100 p-1.5 sm:grid-cols-4">
          {formTabs.map((item) => (
            <Link key={item.id} href={`/admin/meals/three-step/${school.id}/form/${item.id}`} className={`rounded-lg px-2 py-2.5 text-center text-[10px] font-extrabold transition sm:text-xs ${normalizedFormId === item.id ? "bg-orange-500 text-white shadow-sm" : "text-slate-500 hover:bg-white hover:text-orange-600"}`} data-testid={`link-form-tab-${item.id}`}><span className="block">{item.label}</span><span className="mt-0.5 block font-semibold opacity-80">{item.title}</span></Link>
          ))}
        </div>
        <section className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_2px_8px_rgba(15,23,42,.03)]">
          <div className="flex flex-col gap-3 border-b border-slate-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <div><p className="text-[10px] font-extrabold uppercase tracking-[.12em] text-orange-500">{tab.label}</p><h2 className="mt-1 text-sm font-extrabold text-slate-800">{tab.title} <span className="font-medium text-slate-400">(Bước {normalizedFormId === "5" ? "5" : normalizedFormId})</span></h2></div>
            <span className={`inline-flex w-fit items-center gap-1.5 text-[11px] font-bold ${saveState.startsWith("Đã") ? "text-emerald-600" : saveState.startsWith("Có") ? "text-orange-600" : "text-slate-400"}`} data-testid="text-form-save-status"><span className="h-1.5 w-1.5 rounded-full bg-current" /> {saveState}</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px] border-collapse text-left">
              <thead className="bg-slate-50">
                <tr>{headers[normalizedFormId].map((header, index) => <th key={`${header}-${index}`} className="border-b border-r border-slate-200 px-2 py-3 text-[9px] font-extrabold leading-4 text-slate-500">{header}</th>)}</tr>
              </thead>
              <tbody>
                {rows.map((row, rowIndex) => (
                  <tr key={`row-${rowIndex}`} className="hover:bg-orange-50/20" data-testid={`row-form-entry-${rowIndex}`}>
                    {row.map((cell, columnIndex) => (
                      <td key={`${rowIndex}-${columnIndex}`} className="border-b border-r border-slate-200 p-1">
                        {columnIndex === 0 ? <span className="flex min-h-10 items-center justify-center text-[11px] font-bold text-slate-500">{cell || rowIndex + 1}</span> : <input value={cell} onChange={(event) => updateCell(rowIndex, columnIndex, event.target.value)} className="min-h-10 w-full min-w-[76px] rounded bg-transparent px-2 text-[11px] font-semibold text-slate-700 outline-none focus:bg-orange-50 focus:ring-1 focus:ring-orange-300" aria-label={`${headers[normalizedFormId][columnIndex]} dòng ${rowIndex + 1}`} data-testid={`input-form-cell-${rowIndex}-${columnIndex}`} />}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 px-4 py-3">
            <button type="button" onClick={addRow} className="inline-flex items-center gap-1.5 text-xs font-extrabold text-orange-600 hover:text-orange-700" data-testid="button-add-form-row"><Pencil size={13} /> Thêm dòng ghi nhận</button>
            <p className="text-[10px] font-medium text-slate-400"><FileText size={12} className="mr-1 inline-block" /> Mọi thay đổi được lưu trên thiết bị này</p>
          </div>
        </section>
        <div className="mt-4 flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50/60 p-4 text-xs text-blue-800"><ShieldCheck size={17} className="mt-0.5 shrink-0 text-blue-600" /><p><strong className="font-extrabold">Lưu ý nghiệp vụ:</strong> Kiểm tra lại thông tin người thực hiện, thời gian và minh chứng trước khi xuất hoặc in biên bản.</p></div>
      </div>
    </PageFrame>
  );
}