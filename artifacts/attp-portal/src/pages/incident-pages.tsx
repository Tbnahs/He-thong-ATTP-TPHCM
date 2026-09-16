import { useMemo, useState, type ChangeEvent, type FormEvent, type ReactNode } from "react";
import {
  ArrowLeft,
  Bell,
  Check,
  ChevronRight,
  ChevronDown,
  CircleAlert,
  Clock3,
  ChefHat,
  FileText,
  Filter,
  Info,
  MapPin,
  MessageSquareText,
  Paperclip,
  Phone,
  Plus,
  Search,
  ShieldCheck,
  Siren,
  Upload,
  UserRound,
  Utensils,
  X,
} from "lucide-react";
import { Link, useLocation, useParams } from "wouter";
import { AdminShell, PublicShell } from "@/components/portal-ui";
import foodPhotoPath from "../../../../attached_assets/0_List_Of_Nucleic_Acid_Foods_1788929888254.jpg";
import {
  EVIDENCE_ACCEPT,
  EVIDENCE_MAX_SIZE_LABEL,
  validateEvidenceFiles,
} from "@/lib/file-upload";

type IncidentStatus = "Đang xử lý" | "Đã đóng";
type IncidentSeverity = "Khẩn cấp" | "Cao" | "Trung bình";
type IncidentReviewStatus = "Chưa cập nhật" | "Đã gửi" | "Yêu cầu bổ sung";
type IncidentFacilityType =
  | "Cơ sở giáo dục"
  | "Đơn vị cung cấp thực phẩm"
  | "Đơn vị cung cấp suất ăn";

const incidentFacilityOptions: Record<IncidentFacilityType, string[]> = {
  "Cơ sở giáo dục": [
    "Trường Tiểu học Lê Lợi",
    "Trường Tiểu học Thái Sơn",
    "Trường Mầm non Hoa Sen",
  ],
  "Đơn vị cung cấp thực phẩm": [
    "Công ty TNHH Nông sản An Phú",
    "Công ty Thực phẩm sạch Bình Minh",
  ],
  "Đơn vị cung cấp suất ăn": [
    "Bếp ăn tập thể An Phú",
    "Công ty Suất ăn Minh Tâm",
  ],
};

type Incident = {
  id: string;
  code: string;
  title: string;
  facilityType?: IncidentFacilityType;
  facility: string;
  meals?: string[];
  suspectedCases?: number;
  address: string;
  occurredAt: string;
  reportedAt: string;
  reporter: string;
  reporterRole?: string;
  phone: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
  description: string;
  response: string;
  foods: string;
  attachments: string[];
  notifyFacility: boolean;
  notifyHealth?: boolean;
  notifyDistrict: boolean;
  closedAt?: string;
  closedBy?: string;
  reviewStatus: IncidentReviewStatus;
  supplementRequest?: string;
  conclusion?: string;
  schoolUpdate?: SchoolIncidentUpdate;
  timeline: Array<{ time: string; label: string; detail: string; tone: string }>;
};

type SchoolIncidentUpdate = {
  submittedAt: string;
  contactName: string;
  contactRole: string;
  symptoms: string;
  affectedStudents: string;
  tracedMeals: string;
  actionsTaken: string;
  sampleHandling: string;
  notes: string;
  attachments: string[];
  menus?: MealLifecycle[];
};

type MealLifecycle = {
  id: string;
  code: string;
  name: string;
  processedAt: string;
  status: "Đang theo dõi" | "Đã hoàn tất";
  menuType: string;
  description: string;
  traceCode: string;
  chef: string;
  processCode: string;
  processAt: string;
  ingredients: Array<{ name: string; supplier: string; batch: string; unit: string }>;
};

const demoMealLifecycles: MealLifecycle[] = [
  {
    id: "canh-chua-ca-basa",
    code: "MA-00452",
    name: "Canh chua cá basa",
    processedAt: "12:43 12/06/2025",
    status: "Đang theo dõi",
    menuType: "Đặc (nấu chín)",
    description: "Món ăn được theo dõi trong 24h từ lúc bắt đầu chế biến.",
    traceCode: "1753402417699",
    chef: "Đầu bếp Checkee",
    processCode: "MTHS-001",
    processAt: "12:35 15/07/2025",
    ingredients: [
      { name: "Tôm sú", supplier: "Công ty TNHH Thương mại quốc tế Hải sản Hoàng Gia", batch: "2025071008", unit: "Gram" },
      { name: "Cải thìa xanh", supplier: "Khu A5-013 Chợ Bình Điền", batch: "2025070512", unit: "Kg" },
      { name: "Mì gói", supplier: "Nhà cung cấp sỉ & lẻ Minh Hằng", batch: "20250708", unit: "Gói" },
      { name: "Trứng gà", supplier: "Trang trại Bình An", batch: "2025070911", unit: "Quả" },
    ],
  },
  {
    id: "mi-tron-hai-san",
    code: "MTHS-002",
    name: "Mì trộn hải sản",
    processedAt: "12:11 10/06/2025",
    status: "Đã hoàn tất",
    menuType: "Khô (trộn)",
    description: "Món ăn đã hoàn tất theo dõi và được lưu đầy đủ hồ sơ.",
    traceCode: "1753402417700",
    chef: "Đầu bếp Checkee",
    processCode: "MTHS-002",
    processAt: "11:55 10/06/2025",
    ingredients: [
      { name: "Mì trứng", supplier: "Nhà cung cấp Minh Hằng", batch: "2025061002", unit: "Gói" },
      { name: "Tôm sú", supplier: "Hải sản Hoàng Gia", batch: "2025061008", unit: "Gram" },
      { name: "Rau cải", supplier: "Chợ Bình Điền", batch: "2025060512", unit: "Kg" },
    ],
  },
  {
    id: "com-thit-kho-trung",
    code: "CTKT-003",
    name: "Cơm thịt kho trứng",
    processedAt: "11:50 08/06/2025",
    status: "Đã hoàn tất",
    menuType: "Đặc (nấu chín)",
    description: "Món ăn được lưu mẫu sau khi hoàn tất chế biến tại trường.",
    traceCode: "1753402417701",
    chef: "Đầu bếp Checkee",
    processCode: "CTKT-003",
    processAt: "11:30 08/06/2025",
    ingredients: [
      { name: "Thịt heo", supplier: "Công ty Thực phẩm sạch Bình Minh", batch: "2025060804", unit: "Kg" },
      { name: "Trứng gà", supplier: "Trang trại Bình An", batch: "2025060809", unit: "Quả" },
      { name: "Gạo thơm", supplier: "Nông sản An Phú", batch: "2025060107", unit: "Kg" },
    ],
  },
];

function getMealLifecycles(update?: SchoolIncidentUpdate) {
  return update?.menus?.length ? update.menus : demoMealLifecycles;
}

function hasCompleteSchoolUpdate(update?: SchoolIncidentUpdate) {
  if (!update) return false;
  return [
    update.contactName,
    update.contactRole,
    update.symptoms,
    update.affectedStudents,
    update.tracedMeals,
    update.actionsTaken,
    update.sampleHandling,
  ].every((value) => Boolean(value?.trim()));
}

const STORAGE_KEY = "attp-food-safety-incidents";

const seedIncidents: Incident[] = [
  {
    id: "INC-2026-009",
    code: "INC-2026-009",
    title: "Nghi ngờ ngộ độc thực phẩm sau bữa trưa",
    facility: "Trường Tiểu học Thái Sơn",
    address: "12 Nguyễn Trãi, phường Bến Thành, TP.HCM",
    occurredAt: "2026-09-18T11:45",
    reportedAt: "2026-09-18T13:08",
    reporter: "Nguyễn Thị Minh Anh",
    phone: "0908 221 476",
    severity: "Khẩn cấp",
    status: "Đang xử lý",
    description:
      "Nhà trường ghi nhận 06 học sinh có biểu hiện đau bụng, buồn nôn sau bữa trưa. Các em đã được đưa đến phòng y tế để theo dõi và chưa ghi nhận trường hợp diễn biến nặng.",
    response:
      "Đã yêu cầu nhà trường niêm phong mẫu lưu, tạm dừng phục vụ bữa ăn và lập danh sách học sinh có triệu chứng.",
    foods: "Cơm trắng, thịt kho trứng, canh rau ngót",
    attachments: ["bien-ban-y-te-1809.pdf", "anh-khu-vuc-bep.jpg"],
    notifyFacility: true,
    notifyDistrict: true,
    reviewStatus: "Đã gửi",
    schoolUpdate: {
      submittedAt: "2026-09-18T15:10",
      contactName: "Nguyễn Thị Minh Anh",
      contactRole: "Cán bộ phụ trách y tế trường",
      symptoms: "06 học sinh đau bụng, buồn nôn sau bữa trưa; hiện đang được theo dõi tại phòng y tế.",
      affectedStudents: "06",
      tracedMeals: "Mì trộn hải sản, canh chua cá basa",
      actionsTaken: "Tạm dừng phục vụ bữa ăn, lập danh sách học sinh có triệu chứng và thông báo cho phụ huynh.",
      sampleHandling: "Đã niêm phong mẫu lưu, bảo quản tại kho lạnh 01 và bàn giao theo hướng dẫn.",
      notes: "Nhà trường đã hoàn tất cập nhật thông tin và hồ sơ lưu mẫu cho các món ăn trong bữa trưa.",
      attachments: ["bien-ban-niem-phong-mau.pdf", "so-theo-doi-suc-khoe.xlsx"],
      menus: demoMealLifecycles,
    },
    timeline: [
      { time: "13:08", label: "Tiếp nhận cảnh báo", detail: "Cán bộ trực ban ghi nhận thông tin từ nhà trường.", tone: "amber" },
      { time: "13:21", label: "Phân công xử lý", detail: "Tổ ATTP số 02 được phân công xác minh tại hiện trường.", tone: "blue" },
      { time: "14:05", label: "Đã yêu cầu bảo toàn mẫu", detail: "Cơ sở xác nhận đã niêm phong thức ăn lưu mẫu.", tone: "green" },
      { time: "15:10", label: "Nhà trường gửi kết quả", detail: "Nhà trường đã hoàn tất cập nhật thông tin và hồ sơ lưu mẫu.", tone: "blue" },
    ],
  },
  {
    id: "INC-2026-008",
    code: "INC-2026-008",
    title: "Phát hiện côn trùng trong khu vực sơ chế",
    facility: "Trường Mầm non Hoa Sen",
    address: "35 Nguyễn Du, phường Sài Gòn, TP.HCM",
    occurredAt: "2026-09-17T08:20",
    reportedAt: "2026-09-17T09:02",
    reporter: "Trần Minh Hoàng",
    phone: "0912 644 120",
    severity: "Cao",
    status: "Đang xử lý",
    description:
      "Qua phản ánh của giáo viên, khu vực sơ chế phát hiện côn trùng và một số vị trí chưa bảo đảm che chắn.",
    response: "Yêu cầu vệ sinh, khử khuẩn và kiểm tra lại toàn bộ khu vực trước khi tiếp tục chế biến.",
    foods: "Thực phẩm tươi sống",
    attachments: ["hien-truong-hoa-sen.jpg"],
    notifyFacility: true,
    notifyDistrict: false,
    reviewStatus: "Chưa cập nhật",
    timeline: [
      { time: "09:02", label: "Tiếp nhận cảnh báo", detail: "Phản ánh được ghi nhận trên hệ thống.", tone: "amber" },
      { time: "10:10", label: "Đã gửi yêu cầu khắc phục", detail: "Cơ sở được yêu cầu báo cáo kết quả trong ngày.", tone: "blue" },
    ],
  },
  {
    id: "INC-2026-007",
    code: "INC-2026-007",
    title: "Sai lệch nhiệt độ bảo quản thực phẩm",
    facility: "Bếp ăn tập thể An Phú",
    address: "184 Nguyễn Văn Linh, phường Tân Thuận, TP.HCM",
    occurredAt: "2026-09-12T15:10",
    reportedAt: "2026-09-12T15:44",
    reporter: "Lê Thị Hạnh",
    phone: "0938 550 801",
    severity: "Trung bình",
    status: "Đã đóng",
    description: "Thiết bị bảo quản ghi nhận nhiệt độ cao hơn ngưỡng cho phép trong khoảng thời gian kiểm tra.",
    response: "Đã thay cảm biến, kiểm tra lại toàn bộ tủ bảo quản và bổ sung sổ theo dõi nhiệt độ.",
    foods: "Thịt gia cầm, thực phẩm đông lạnh",
    attachments: [],
    notifyFacility: true,
    notifyDistrict: true,
    reviewStatus: "Đã gửi",
    conclusion: "Đã khắc phục, tiếp tục theo dõi trong 07 ngày.",
    closedAt: "2026-09-13T16:30",
    timeline: [
      { time: "15:44", label: "Tiếp nhận cảnh báo", detail: "Cảnh báo phát sinh từ biên bản kiểm tra.", tone: "amber" },
      { time: "16:30", label: "Đã đóng sự cố", detail: "Cơ sở hoàn tất biện pháp khắc phục.", tone: "green" },
    ],
  },
];

function readIncidents(): Incident[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return (JSON.parse(stored) as Incident[]).map((item) => ({
        ...item,
        reviewStatus: item.reviewStatus ?? (item.schoolUpdate ? "Đã gửi" : "Chưa cập nhật"),
      }));
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seedIncidents));
  } catch {
    return seedIncidents;
  }
  return seedIncidents;
}

function persistIncidents(items: Incident[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function toDateTimeLocal(value?: string) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const offset = date.getTimezoneOffset();
  return new Date(date.getTime() - offset * 60_000).toISOString().slice(0, 16);
}

const attachmentPreviewMap: Record<string, string> = {
  "anh-khu-vuc-bep.jpg": foodPhotoPath,
  "hien-truong-hoa-sen.jpg": foodPhotoPath,
};

function getAttachmentPreview(file: string) {
  if (!/\.(png|jpe?g|webp|gif)$/i.test(file)) return null;
  return attachmentPreviewMap[file] ?? foodPhotoPath;
}

function AttachmentPreview({
  file,
  compact = false,
}: {
  file: string;
  compact?: boolean;
}) {
  const preview = getAttachmentPreview(file);
  if (!preview) {
    return (
      <div className={`flex items-center gap-2 rounded-lg bg-[#eff6ff] px-3 py-2 text-xs font-semibold text-[#1e40af] ${compact ? "" : "h-full flex-col justify-center bg-white text-center"}`}>
        <FileText size={compact ? 14 : 30} className={compact ? "shrink-0" : ""} />
        <span className={compact ? "truncate" : "max-w-full truncate"}>{file}</span>
      </div>
    );
  }

  return (
    <a
      href={preview}
      target="_blank"
      rel="noreferrer"
      className={`group relative block overflow-hidden rounded-lg border border-[#dbe5ed] bg-white ${compact ? "h-24 w-36" : "h-32 w-44"}`}
      aria-label={`Mở ảnh ${file}`}
      data-testid={`image-attachment-${file}`}
    >
      <img src={preview} alt={file} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
      <span className="absolute inset-x-0 bottom-0 truncate bg-[#0f172a]/70 px-2 py-1 text-[10px] font-semibold text-white">{file}</span>
    </a>
  );
}

function severityClass(value: IncidentSeverity) {
  if (value === "Khẩn cấp") return "bg-[#fce4df] text-[#a33b27] border-[#f2b9ac]";
  if (value === "Cao") return "bg-[#fff0ce] text-[#865600] border-[#e8ca81]";
  return "bg-[#e2edf0] text-[#245a66] border-[#b5d0d5]";
}

function statusClass(value: IncidentStatus) {
  return value === "Đang xử lý"
    ? "bg-[#fff0ce] text-[#865600] border-[#e8ca81]"
    : "bg-[#e2f1e8] text-[#226644] border-[#b4d4bf]";
}

function PageFrame({ children }: { children: ReactNode }) {
  return (
    <AdminShell>
      <div className="min-h-[calc(100dvh-73px)] bg-[#f8fafc] px-4 py-8 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-[1096px]">{children}</div>
      </div>
    </AdminShell>
  );
}

function PageKicker({ children }: { children: ReactNode }) {
  return <p className="mono-label text-[#176b53]">{children}</p>;
}

function TopBar({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-7 flex flex-col gap-5 border-b border-[#dce5e3] pb-6 md:flex-row md:items-end md:justify-between">
      <div>
        <PageKicker>Thanh tra, kiểm tra / Sự cố ATTP</PageKicker>
        <h1 className="display-tight mt-2 text-3xl font-extrabold tracking-[-.04em] text-[#143b35] md:text-[2.65rem]">
          {title}
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-[#64736f]">{description}</p>
      </div>
      {action}
    </div>
  );
}

function PrimaryButton({
  children,
  onClick,
  type = "button",
  testId,
  variant = "primary",
  className = "",
}: {
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  testId: string;
  variant?: "primary" | "quiet" | "danger";
  className?: string;
}) {
  const styles = {
    primary: "bg-[#176b53] text-white hover:bg-[#125943]",
    quiet: "border border-[#cbdad5] bg-white text-[#31534b] hover:border-[#176b53] hover:text-[#176b53]",
    danger: "bg-[#a33b27] text-white hover:bg-[#89301f]",
  };
  return (
    <button
      type={type}
      onClick={onClick}
      className={`focus-ring inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold shadow-sm transition-all hover:-translate-y-0.5 ${styles[variant]} ${className}`}
      data-testid={testId}
    >
      {children}
    </button>
  );
}

export function IncidentListPage() {
  const [incidents, setIncidents] = useState<Incident[]>(readIncidents);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"Tất cả" | IncidentStatus>("Tất cả");
  const [facilityQuery, setFacilityQuery] = useState("Tất cả");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase("vi");
    return incidents.filter((item) => {
      const matchesQuery =
        !normalized ||
        [item.code, item.title, item.facility, item.address]
          .join(" ")
          .toLocaleLowerCase("vi")
          .includes(normalized);
      const occurredDate = item.occurredAt.slice(0, 10);
      return (
        matchesQuery &&
        (status === "Tất cả" || item.status === status) &&
        (facilityQuery === "Tất cả" || item.facility === facilityQuery) &&
        (!dateFrom || occurredDate >= dateFrom) &&
        (!dateTo || occurredDate <= dateTo)
      );
    });
  }, [dateFrom, dateTo, facilityQuery, incidents, query, status]);

  const activeCount = incidents.filter((item) => item.status === "Đang xử lý").length;
  const closedCount = incidents.filter((item) => item.status === "Đã đóng").length;
  const facilityOptions = Array.from(new Set(incidents.map((item) => item.facility)));

  return (
    <PageFrame>
      <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-xl font-normal leading-7 tracking-[.014em] text-[#1e293b]">Quản lý và xử lý sự cố An toàn Thực phẩm</h1>
          <p className="mt-1 text-base leading-6 text-[#64748b]">Giám sát và phản ứng nhanh với các báo cáo nghi ngờ ngộ độc thực phẩm từ các trường học</p>
        </div>
        <PrimaryButton onClick={() => setIsCreateOpen(true)} testId="button-create-incident" variant="danger">
          <Plus size={17} /> Cảnh báo ATTP
        </PrimaryButton>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <div className="flex items-center gap-5 rounded-2xl border border-[#f1f5f9] bg-white p-6 shadow-sm">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#fef2f2] text-[#dc2626]"><CircleAlert size={25} /></div>
          <div>
            <p className="text-sm leading-5 tracking-[.016em] text-[#64748b]">Đang xử lý</p>
            <p className="mt-1 text-3xl font-normal leading-9 tracking-[.03em] text-[#1e293b]" data-testid="metric-incident-active">{String(activeCount).padStart(2, "0")}</p>
          </div>
        </div>
        <div className="flex items-center gap-5 rounded-2xl border border-[#f1f5f9] bg-white p-6 shadow-sm">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#f0fdf4] text-[#16a34a]"><Check size={25} /></div>
          <div>
            <p className="text-sm leading-5 tracking-[.016em] text-[#64748b]">Đã đóng</p>
            <p className="mt-1 text-3xl font-normal leading-9 tracking-[-.03em] text-[#1e293b]" data-testid="metric-incident-closed">{String(closedCount).padStart(2, "0")}</p>
          </div>
        </div>
      </div>

      <section className="mt-8 overflow-hidden rounded-2xl border border-[#f1f5f9] bg-white p-6 shadow-sm" data-testid="panel-incident-list">
        <div className="relative">
          <Search size={16} className="absolute left-4 top-4 text-[#94a3b8]" />
          <label className="block">
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Nhập mã sự cố hoặc tên trường..."
              className="focus-ring h-[49px] w-full rounded-xl border border-[#e2e8f0] bg-[#f8fafc] pl-11 pr-4 text-base text-[#475569] outline-none transition-colors placeholder:text-[#9ca3af] focus:border-[#2563eb]"
              data-testid="input-incident-search"
            />
          </label>
        </div>
        <div className="mt-5 flex flex-wrap items-end gap-4 border-t border-[#f1f5f9] pt-5">
          <label className="flex min-w-[180px] flex-1 flex-col gap-1.5 px-1 text-xs uppercase tracking-[.05em] text-[#94a3b8]">Trạng thái
            <select value={status} onChange={(event) => setStatus(event.target.value as typeof status)} className="focus-ring h-10 rounded-lg border border-[#e2e8f0] bg-[#f8fafc] px-4 text-base normal-case tracking-normal text-[#475569] outline-none focus:border-[#2563eb]" data-testid="select-incident-status">
              <option value="Tất cả">Tất cả trạng thái</option><option>Đang xử lý</option><option>Đã đóng</option>
            </select>
          </label>
          <label className="flex min-w-[180px] flex-1 flex-col gap-1.5 px-1 text-xs uppercase tracking-[.05em] text-[#94a3b8]">Trường
            <select value={facilityQuery} onChange={(event) => setFacilityQuery(event.target.value)} className="focus-ring h-10 rounded-lg border border-[#e2e8f0] bg-[#f8fafc] px-4 text-base normal-case tracking-normal text-[#475569] outline-none focus:border-[#2563eb]" data-testid="select-incident-facility">
              <option>Tất cả</option>{facilityOptions.map((facility) => <option key={facility}>{facility}</option>)}
            </select>
          </label>
          <label className="flex min-w-[220px] flex-[1.2] flex-col gap-1.5 px-1 text-xs uppercase tracking-[.05em] text-[#94a3b8]">Khoảng thời gian
            <span className="flex h-10 items-center gap-2 rounded-lg border border-[#e2e8f0] bg-[#f8fafc] px-3">
              <input type="date" value={dateFrom} onChange={(event) => setDateFrom(event.target.value)} className="min-w-0 flex-1 bg-transparent text-sm text-[#475569] outline-none" aria-label="Từ ngày" />
              <span className="text-[#94a3b8]">–</span>
              <input type="date" value={dateTo} onChange={(event) => setDateTo(event.target.value)} className="min-w-0 flex-1 bg-transparent text-sm text-[#475569] outline-none" aria-label="Đến ngày" />
            </span>
          </label>
        </div>
      </section>

      <section className="mt-6 overflow-hidden rounded-2xl border border-[#f1f5f9] bg-white shadow-sm" data-testid="table-incident-list">
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[920px] text-left">
            <thead className="bg-[#f8fafc] text-xs uppercase tracking-[.05em] text-[#94a3b8]">
              <tr><th className="px-6 py-4 font-normal">Mã sự cố</th><th className="px-6 py-4 font-normal">Trường</th><th className="px-6 py-4 font-normal">Phát hiện</th><th className="px-6 py-4 font-normal">Số ca</th><th className="px-6 py-4 font-normal">Bữa ăn</th><th className="px-6 py-4 font-normal">Trạng thái</th><th className="px-6 py-4 text-right font-normal">Action</th></tr>
            </thead>
            <tbody className="divide-y divide-[#f8fafc]">
              {filtered.map((item) => (
                <tr key={item.id} className="transition-colors hover:bg-[#f8fafc]" data-testid={`row-incident-${item.id}`}>
                  <td className="px-6 py-6 align-middle font-mono text-base leading-6 tracking-[.03em] text-[#334155]" data-testid={`text-incident-code-${item.id}`}>{item.code}</td>
                  <td className="max-w-[220px] px-6 py-6 align-middle text-base leading-6 text-[#334155]">{item.facility}</td>
                  <td className="px-6 py-6 align-middle"><span className="block text-sm text-[#475569]">{new Intl.DateTimeFormat("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(item.occurredAt))}</span><span className="mt-0.5 block text-xs text-[#94a3b8]">{new Intl.DateTimeFormat("vi-VN", { hour: "2-digit", minute: "2-digit" }).format(new Date(item.occurredAt))}</span></td>
                  <td className="px-6 py-6 align-middle"><span className="inline-flex min-w-8 justify-center rounded bg-[#fef3c7] px-2 py-1 text-xs text-[#000]">{String(item.suspectedCases ?? 0).padStart(2, "0")}</span></td>
                  <td className="max-w-[120px] px-6 py-6 align-middle text-sm leading-5 text-[#475569]">{item.meals?.join(", ") || item.foods || "—"}</td>
                  <td className="px-6 py-6 align-middle"><span className={`inline-flex rounded-full px-3 py-1 text-xs ${item.status === "Đang xử lý" ? "bg-[#dbeafe] text-[#1d4ed8]" : "bg-[#dcfce7] text-[#15803d]"}`} data-testid={`status-incident-${item.id}`}>{item.status}</span></td>
                  <td className="px-6 py-6 text-right align-middle"><Link href={`/admin/inspections/incidents/${item.id}`} className="focus-ring inline-flex min-h-[58px] items-center justify-center rounded-lg border border-[#e2e8f0] bg-white px-6 text-sm text-[#334155] transition-colors hover:border-[#2563eb] hover:text-[#2563eb]" data-testid={`link-view-incident-${item.id}`}>Xem chi tiết</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="divide-y divide-[#f1f5f9] md:hidden">
          {filtered.map((item) => (
            <Link key={item.id} href={`/admin/inspections/incidents/${item.id}`} className="block p-5 transition-colors hover:bg-[#f8fafc]" data-testid={`card-incident-${item.id}`}>
              <div className="flex items-start justify-between gap-3"><span className="font-mono text-sm text-[#334155]">{item.code}</span><span className={`rounded-full px-3 py-1 text-xs ${item.status === "Đang xử lý" ? "bg-[#dbeafe] text-[#1d4ed8]" : "bg-[#dcfce7] text-[#15803d]"}`}>{item.status}</span></div>
              <p className="mt-4 text-base text-[#334155]">{item.facility}</p><p className="mt-2 text-sm text-[#64748b]">{item.title}</p>
              <div className="mt-4 flex items-center justify-between text-sm text-[#475569]"><span>{item.meals?.join(", ") || item.foods || "—"} · {item.suspectedCases ?? 0} ca</span><span className="font-semibold text-[#2563eb]">Xem</span></div>
            </Link>
          ))}
        </div>
        {filtered.length === 0 && <div className="p-14 text-center" data-testid="empty-incident-results"><CircleAlert className="mx-auto text-[#cbd5e1]" size={34} /><p className="mt-3 font-semibold text-[#334155]">Không tìm thấy sự cố phù hợp</p><p className="mt-1 text-sm text-[#64748b]">Thử thay đổi từ khóa hoặc bộ lọc đang chọn.</p></div>}
        <div className="flex flex-col gap-4 border-t border-[#f1f5f9] bg-[#f8fafc] px-6 py-4 text-sm text-[#64748b] sm:flex-row sm:items-center sm:justify-between">
          <span>Hiển thị 1 - {Math.min(filtered.length, 10)} trong tổng số {filtered.length} sự cố</span>
          <div className="flex items-center gap-2">
            <button type="button" className="h-8 w-8 rounded border border-[#e2e8f0] bg-white text-[#94a3b8]" aria-label="Trang trước">‹</button>
            <button type="button" className="h-8 w-8 rounded bg-[#2563eb] text-white">1</button>
            <button type="button" className="h-8 w-8 rounded border border-[#e2e8f0] bg-white text-[#475569]">2</button>
            <button type="button" className="h-8 w-8 rounded border border-[#e2e8f0] bg-white text-[#475569]" aria-label="Trang sau">›</button>
          </div>
        </div>
      </section>
      {isCreateOpen && (
        <IncidentCreateModal
          onClose={() => setIsCreateOpen(false)}
          onCreated={(incident) => {
            setIncidents((current) => [incident, ...current]);
            setIsCreateOpen(false);
          }}
        />
      )}
    </PageFrame>
  );
}

const fieldClass = "focus-ring mt-1.5 h-11 w-full rounded-xl border border-[#d4dfdb] bg-[#fbfcfb] px-3.5 text-sm text-[#21453d] outline-none transition-colors placeholder:text-[#a1ada9] focus:border-[#176b53]";
const areaClass = "focus-ring mt-1.5 w-full rounded-xl border border-[#d4dfdb] bg-[#fbfcfb] px-3.5 py-3 text-sm leading-6 text-[#21453d] outline-none transition-colors placeholder:text-[#a1ada9] focus:border-[#176b53]";
const designInputClass = "focus-ring mt-2 h-[50px] w-full rounded-xl border border-[#e2e8f0] bg-[#f8fafc] px-4 text-base text-[#334155] outline-none transition-colors placeholder:text-[#9ca3af] focus:border-[#2563eb]";
const designAreaClass = "focus-ring mt-2 min-h-[98px] w-full resize-y rounded-xl border border-[#e2e8f0] bg-[#f8fafc] px-4 py-3 text-base leading-6 text-[#334155] outline-none transition-colors placeholder:text-[#9ca3af] focus:border-[#2563eb]";
const designLabelClass = "text-xs font-semibold uppercase tracking-[0.05em] text-[#64748b]";

function IncidentCreateModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: (incident: Incident) => void;
}) {
  const [form, setForm] = useState({
    title: "",
    facilityType: "Cơ sở giáo dục" as IncidentFacilityType | "",
    facility: "",
    occurredAt: "",
    meals: ["Trưa"],
    suspectedCases: "",
    severity: "Cao" as IncidentSeverity,
    reporter: "",
    reporterRole: "",
    phone: "",
    foods: "",
    description: "",
    response: "",
    notifyFacility: true,
    notifyHealth: false,
    notifyDistrict: false,
  });
  const [files, setFiles] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const update = (key: string, value: string | boolean | string[]) =>
    setForm((current) => ({ ...current, [key]: value }));

  const toggleMeal = (meal: string) =>
    setForm((current) => ({
      ...current,
      meals: current.meals.includes(meal)
        ? current.meals.filter((item) => item !== meal)
        : [...current.meals, meal],
    }));

  const handleFiles = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files ?? []);
    const validationError = validateEvidenceFiles(selectedFiles);
    if (validationError) {
      window.alert(validationError);
      event.target.value = "";
      return;
    }
    setFiles(selectedFiles.map((file) => file.name));
    event.target.value = "";
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (
      !form.facility ||
      !form.occurredAt ||
      !form.meals.length ||
      !form.suspectedCases ||
      !form.reporter ||
      !form.reporterRole ||
      !form.phone ||
      !form.description
    ) {
      setSubmitted(true);
      return;
    }

    const current = readIncidents();
    const sequence = String(current.length + 10).padStart(3, "0");
    const now = new Date().toISOString();
    const incident: Incident = {
      id: `INC-2026-${sequence}`,
      code: `INC-2026-${sequence}`,
      title: form.title || `Nghi ngờ sự cố ATTP tại ${form.facility}`,
      facilityType: form.facilityType || undefined,
      facility: form.facility,
      meals: form.meals,
      suspectedCases: Number(form.suspectedCases),
      address: "Chưa cập nhật địa chỉ",
      occurredAt: form.occurredAt,
      reportedAt: now,
      reporter: form.reporter,
      reporterRole: form.reporterRole,
      phone: form.phone,
      severity: form.severity,
      status: "Đang xử lý",
      description: form.description,
      response: form.response || "Chưa có biện pháp xử lý được ghi nhận.",
      foods: form.foods || form.meals.join(", "),
      attachments: files,
      notifyFacility: form.notifyFacility,
      notifyHealth: form.notifyHealth,
      notifyDistrict: form.notifyDistrict,
      reviewStatus: "Chưa cập nhật",
      timeline: [
        {
          time: new Intl.DateTimeFormat("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
          }).format(new Date()),
          label: "Tiếp nhận cảnh báo",
          detail: "Cảnh báo mới được tạo bởi cán bộ phụ trách.",
          tone: "amber",
        },
      ],
    };
    persistIncidents([incident, ...current]);
    onCreated(incident);
  };

  const facilities = form.facilityType
    ? incidentFacilityOptions[form.facilityType]
    : [];
  const error = (value: string) =>
    submitted && !value ? (
      <span className="mt-1 block normal-case tracking-normal text-xs font-medium text-[#ef4444]">
        Vui lòng nhập thông tin này.
      </span>
    ) : null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-[#0f172a]/55 p-3 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label="Tạo mới cảnh báo ATTP"
      data-testid="dialog-create-incident"
    >
      <div className="my-2 w-full max-w-[894px] overflow-hidden rounded-2xl border border-[#e2e8f0] bg-white p-8 shadow-[0_12px_40px_rgba(15,23,42,.12)] sm:my-6">
        <form onSubmit={submit} className="max-h-[calc(100dvh-80px)] overflow-y-auto" data-testid="form-create-incident-modal">
          <button type="button" onClick={onClose} className="sr-only" aria-label="Đóng popup" data-testid="button-close-create-incident">
            Đóng popup
          </button>
          <div className="space-y-10">
            <section>
              <div className="mb-6 flex items-center gap-2">
                <span className="h-6 w-1 rounded-full bg-[#2563eb]" />
                <h3 className="text-sm font-bold uppercase tracking-[0.05em] text-[#1e293b]">1. Thông tin sự cố</h3>
              </div>
              <div className="space-y-6">
                <label className={designLabelClass}>
                  Trường học xảy ra sự cố <span className="text-[#ef4444]">*</span>
                  <span className="relative block">
                    <Search size={17} className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-[#94a3b8]" />
                    <select
                      value={form.facility}
                      onChange={(event) => update("facility", event.target.value)}
                      className={`${designInputClass} appearance-none pl-11 pr-11`}
                      data-testid="select-modal-incident-facility"
                    >
                      <option value="">Chọn trường học</option>
                      {facilities.map((facility) => <option key={facility}>{facility}</option>)}
                    </select>
                    <ChevronDown size={17} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
                  </span>
                  {error(form.facility)}
                </label>
                <div className="grid gap-6 md:grid-cols-2">
                  <label className={designLabelClass}>
                    Thời điểm phát hiện <span className="text-[#ef4444]">*</span>
                    <span className="relative block">
                      <Clock3 size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
                      <input type="datetime-local" value={form.occurredAt} onChange={(event) => update("occurredAt", event.target.value)} className={`${designInputClass} pl-11`} data-testid="input-modal-incident-occurred-at" />
                    </span>
                    {error(form.occurredAt)}
                  </label>
                  <div>
                    <p className={designLabelClass}>Bữa ăn liên quan <span className="text-[#64748b]">* (Được chọn nhiều)</span></p>
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      {["Sáng", "Trưa", "Chiều", "Tối"].map((meal) => {
                        const selected = form.meals.includes(meal);
                        return (
                          <button type="button" key={meal} onClick={() => toggleMeal(meal)} className={`h-[50px] rounded-xl border text-sm font-medium transition-colors ${selected ? "border-[#2563eb] bg-[#eff6ff] text-[#1d4ed8]" : "border-[#e2e8f0] bg-[#f8fafc] text-[#475569] hover:border-[#93c5fd]"}`} data-testid={`button-modal-incident-meal-${meal}`}>
                            {meal}
                          </button>
                        );
                      })}
                    </div>
                    {submitted && !form.meals.length && <span className="mt-1 block text-xs font-medium text-[#ef4444]">Vui lòng chọn ít nhất một bữa ăn.</span>}
                  </div>
                </div>
                <label className="block max-w-[calc(50%-12px)] min-w-[240px] sm:max-w-[calc(50%-12px)]">
                  <span className={designLabelClass}>Số ca nghi ngờ <span className="text-[#ef4444]">*</span></span>
                  <input type="number" min="1" value={form.suspectedCases} onChange={(event) => update("suspectedCases", event.target.value)} className={designInputClass} placeholder="0" data-testid="input-modal-incident-suspected-cases" />
                  {error(form.suspectedCases)}
                </label>
              </div>
            </section>

            <section>
              <div className="mb-6 flex items-center gap-2">
                <span className="h-6 w-1 rounded-full bg-[#94a3b8]" />
                <h3 className="text-sm font-bold uppercase tracking-[0.05em] text-[#1e293b]">2. Thông tin người báo cáo & ghi chú</h3>
              </div>
              <div className="grid gap-6 md:grid-cols-3">
                <label className={designLabelClass}>
                  Họ và tên <span className="text-[#ef4444]">*</span>
                  <input value={form.reporter} onChange={(event) => update("reporter", event.target.value)} className={designInputClass} placeholder="Nguyễn Văn A" data-testid="input-modal-incident-reporter" />
                  {error(form.reporter)}
                </label>
                <label className={designLabelClass}>
                  Chức vụ <span className="text-[#ef4444]">*</span>
                  <input value={form.reporterRole} onChange={(event) => update("reporterRole", event.target.value)} className={designInputClass} placeholder="Trưởng trạm y tế" data-testid="input-modal-incident-reporter-role" />
                  {error(form.reporterRole)}
                </label>
                <label className={designLabelClass}>
                  Số điện thoại <span className="text-[#ef4444]">*</span>
                  <input value={form.phone} onChange={(event) => update("phone", event.target.value)} className={designInputClass} placeholder="0909 123 456" data-testid="input-modal-incident-phone" />
                  {error(form.phone)}
                </label>
              </div>
              <label className={`${designLabelClass} mt-6 block`}>
                Mô tả chi tiết
                <textarea value={form.description} onChange={(event) => update("description", event.target.value)} className={designAreaClass} placeholder="Mô tả các biểu hiện của học sinh và các biện pháp xử lý ban đầu tại chỗ..." data-testid="textarea-modal-incident-description" />
                {error(form.description)}
              </label>
            </section>

            <section>
              <div className="mb-6 flex items-center gap-2">
                <span className="h-6 w-1 rounded-full bg-[#94a3b8]" />
                <h3 className="text-sm font-bold uppercase tracking-[0.05em] text-[#1e293b]">3. Tải lên minh chứng / hình ảnh</h3>
              </div>
              <label className="flex min-h-[132px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#e2e8f0] bg-[#f8fafc] px-5 text-center transition-colors hover:border-[#93c5fd] hover:bg-[#eff6ff]" data-testid="label-upload-modal-incident-files">
                <span className="flex h-12 w-12 items-center justify-center rounded-full border border-[#e2e8f0] bg-white text-[#2563eb] shadow-sm"><Upload size={22} /></span>
                <span className="mt-3 text-base font-medium text-[#1e293b]">Nhấn để tải lên hoặc kéo thả hình ảnh/tài liệu</span>
                <span className="mt-1 text-xs text-[#64748b]">Hỗ trợ JPG, PNG, PDF (Tối đa 10MB)</span>
                <input type="file" accept={EVIDENCE_ACCEPT} multiple className="sr-only" onChange={handleFiles} data-testid="input-modal-incident-files" />
              </label>
              {files.length > 0 && <div className="mt-3 space-y-2">{files.map((file) => <div key={file} className="flex items-center justify-between rounded-lg bg-[#eff6ff] px-3 py-2 text-xs font-semibold text-[#1e3a8a]"><span className="flex items-center gap-2 truncate"><FileText size={14} />{file}</span><button type="button" onClick={() => setFiles((current) => current.filter((name) => name !== file))} className="focus-ring rounded p-1 text-[#64748b] hover:text-[#ef4444]" aria-label={`Xóa tệp ${file}`}><X size={14} /></button></div>)}</div>}
            </section>

            <section>
              <div className="mb-6 flex items-center gap-2">
                <span className="h-6 w-1 rounded-full bg-[#2563eb]" />
                <h3 className="text-sm font-bold uppercase tracking-[0.05em] text-[#1e293b]">4. Gửi thông báo đến các bên liên quan</h3>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                {[
                  ["notifyFacility", "Nhà trường", "Thông báo qua hệ thống", form.notifyFacility, "checkbox-modal-notify-facility"],
                  ["notifyHealth", "Trạm Y tế địa phương", "Gửi Email tự động", form.notifyHealth, "checkbox-modal-notify-health"],
                  ["notifyDistrict", "UBND Phường/Xã", "Gửi Email tự động", form.notifyDistrict, "checkbox-modal-notify-district"],
                ].map(([key, title, description, checked, testId]) => (
                  <label key={String(key)} className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors ${checked ? "border-[#2563eb] bg-[#eff6ff]" : "border-[#e2e8f0] bg-white hover:border-[#93c5fd]"}`}>
                    <input type="checkbox" checked={Boolean(checked)} onChange={(event) => update(String(key), event.target.checked)} className="mt-0.5 h-5 w-5 accent-[#2563eb]" data-testid={testId} />
                    <span><strong className="block text-[13px] text-[#1e293b]">{title}</strong><span className="mt-1 block text-[11px] text-[#64748b]">{description}</span></span>
                  </label>
                ))}
              </div>
            </section>
          </div>
          <div className="mt-10 flex flex-col-reverse gap-4 border-t border-[#e2e8f0] pt-6 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="focus-ring inline-flex h-[50px] items-center justify-center rounded-xl border border-[#e2e8f0] px-8 text-base font-semibold text-[#64748b] transition-colors hover:border-[#94a3b8] hover:text-[#334155]"
              data-testid="button-cancel-create-incident"
            >
              Hủy
            </button>
            <PrimaryButton
              type="submit"
              variant="danger"
              testId="button-submit-incident-modal"
              className="h-[50px] px-10 text-base shadow-[0_10px_15px_-3px_#fee2e2,0_4px_6px_-4px_#fee2e2]"
            >
              <Siren size={16} /> Kích hoạt SOP & gửi thông báo
            </PrimaryButton>
          </div>
        </form>
      </div>
    </div>
  );
}

export function IncidentCreatePage() {
  const [, navigate] = useLocation();
  const [files, setFiles] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    title: "",
    facilityType: "" as IncidentFacilityType | "",
    facility: "",
    meals: ["Trưa"],
    suspectedCases: "",
    occurredAt: "",
    severity: "Cao" as IncidentSeverity,
    reporter: "",
    reporterRole: "",
    phone: "",
    foods: "",
    description: "",
    response: "",
    notifyFacility: true,
    notifyHealth: false,
    notifyDistrict: false,
  });

  const update = (key: string, value: string | boolean | string[]) => setForm((current) => ({ ...current, [key]: value }));
  const handleFiles = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files ?? []);
    const validationError = validateEvidenceFiles(selectedFiles);
    if (validationError) {
      window.alert(validationError);
      event.target.value = "";
      return;
    }
    setFiles(selectedFiles.map((file) => file.name));
    event.target.value = "";
  };
  const toggleMeal = (meal: string) => setForm((current) => ({
    ...current,
    meals: current.meals.includes(meal)
      ? current.meals.filter((item) => item !== meal)
      : [...current.meals, meal],
  }));
  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!form.title || !form.facilityType || !form.facility || !form.meals.length || !form.suspectedCases || !form.occurredAt || !form.description || !form.reporter || !form.reporterRole) {
      setSubmitted(true);
      return;
    }
    const current = readIncidents();
    const sequence = String(current.length + 10).padStart(3, "0");
    const now = new Date().toISOString();
    const incident: Incident = {
      id: `INC-2026-${sequence}`,
      code: `INC-2026-${sequence}`,
      title: form.title,
      facilityType: form.facilityType || undefined,
      facility: form.facility,
      meals: form.meals,
      suspectedCases: Number(form.suspectedCases),
      address: "Chưa cập nhật địa chỉ",
      occurredAt: form.occurredAt,
      reportedAt: now,
      reporter: form.reporter,
      reporterRole: form.reporterRole,
      phone: form.phone,
      severity: form.severity,
      status: "Đang xử lý",
      description: form.description,
      response: form.response || "Chưa có biện pháp xử lý được ghi nhận.",
      foods: form.foods || form.meals.join(", "),
      attachments: files,
      notifyFacility: form.notifyFacility,
      notifyHealth: form.notifyHealth,
      notifyDistrict: form.notifyDistrict,
      reviewStatus: "Chưa cập nhật",
      timeline: [{ time: new Intl.DateTimeFormat("vi-VN", { hour: "2-digit", minute: "2-digit" }).format(new Date()), label: "Tiếp nhận cảnh báo", detail: "Cảnh báo mới được tạo bởi cán bộ phụ trách.", tone: "amber" }],
    };
    persistIncidents([incident, ...current]);
    navigate(`/admin/inspections/incidents/${incident.id}`);
  };

  return (
    <PageFrame>
      <div className="mb-6">
        <Link href="/admin/inspections/incidents" className="focus-ring inline-flex items-center gap-2 text-sm font-bold text-[#2563eb] hover:text-[#1d4ed8]" data-testid="link-back-incidents">
          <ArrowLeft size={16} /> Danh sách sự cố
        </Link>
      </div>
      <TopBar title="Tạo mới cảnh báo ATTP" description="Ghi nhận nhanh thông tin ban đầu để kích hoạt quy trình xác minh và phối hợp xử lý." />
      <form onSubmit={submit} className="mx-auto max-w-[894px] rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-[0_12px_40px_rgba(15,23,42,.06)] sm:p-8" data-testid="form-create-incident">
        <div className="space-y-10">
          <section>
            <div className="mb-6 flex items-center gap-2">
              <span className="h-6 w-1 rounded-full bg-[#2563eb]" />
              <h2 className="text-sm font-bold uppercase tracking-[.05em] text-[#1e293b]">1. Thông tin sự cố</h2>
            </div>
            <div className="space-y-6">
              <label className={designLabelClass}>Tiêu đề sự cố <span className="text-[#ef4444]">*</span>
                <input value={form.title} onChange={(e) => update("title", e.target.value)} className={designInputClass} placeholder="Ví dụ: Nghi ngờ ngộ độc sau bữa trưa" data-testid="input-incident-title" />
                {submitted && !form.title && <span className="mt-1 block normal-case tracking-normal text-xs font-medium text-[#ef4444]">Vui lòng nhập tiêu đề.</span>}
              </label>
              <label className={designLabelClass}>Loại cơ sở <span className="text-[#ef4444]">*</span>
                <select value={form.facilityType} onChange={(e) => setForm((current) => ({ ...current, facilityType: e.target.value as IncidentFacilityType | "", facility: "" }))} className={designInputClass} data-testid="select-incident-facility-type">
                  <option value="">Chọn loại cơ sở</option>
                  {Object.keys(incidentFacilityOptions).map((option) => <option key={option} value={option}>{option}</option>)}
                </select>
                {submitted && !form.facilityType && <span className="mt-1 block normal-case tracking-normal text-xs font-medium text-[#ef4444]">Vui lòng chọn loại cơ sở.</span>}
              </label>
              <label className={designLabelClass}>Tên cơ sở liên quan <span className="text-[#ef4444]">*</span>
                <select value={form.facility} onChange={(e) => update("facility", e.target.value)} disabled={!form.facilityType} className={`${designInputClass} disabled:cursor-not-allowed disabled:bg-[#f1f5f9] disabled:text-[#94a3b8]`} data-testid="select-incident-facility">
                  <option value="">{form.facilityType ? "Chọn cơ sở" : "Chọn loại cơ sở trước"}</option>
                  {form.facilityType && incidentFacilityOptions[form.facilityType].map((facility) => <option key={facility}>{facility}</option>)}
                </select>
                {submitted && !form.facility && <span className="mt-1 block normal-case tracking-normal text-xs font-medium text-[#ef4444]">Vui lòng chọn cơ sở.</span>}
              </label>
              <div className="grid gap-6 md:grid-cols-2">
                <label className={designLabelClass}>Thời điểm phát hiện <span className="text-[#ef4444]">*</span>
                  <input type="datetime-local" value={form.occurredAt} onChange={(e) => update("occurredAt", e.target.value)} className={designInputClass} data-testid="input-incident-occurred-at" />
                  {submitted && !form.occurredAt && <span className="mt-1 block normal-case tracking-normal text-xs font-medium text-[#ef4444]">Vui lòng chọn thời điểm.</span>}
                </label>
                <div>
                  <p className={designLabelClass}>Bữa ăn liên quan <span className="text-[#ef4444]">*</span></p>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    {["Sáng", "Trưa", "Chiều", "Tối"].map((meal) => {
                      const selected = form.meals.includes(meal);
                      return <button type="button" key={meal} onClick={() => toggleMeal(meal)} className={`h-[50px] rounded-xl border text-sm font-medium transition-colors ${selected ? "border-[#2563eb] bg-[#eff6ff] text-[#1d4ed8]" : "border-[#e2e8f0] bg-[#f8fafc] text-[#475569] hover:border-[#93c5fd]"}`} data-testid={`button-incident-meal-${meal}`}>{meal}</button>;
                    })}
                  </div>
                  {submitted && !form.meals.length && <span className="mt-1 block text-xs font-medium text-[#ef4444]">Vui lòng chọn ít nhất một bữa ăn.</span>}
                </div>
              </div>
              <div className="grid gap-6 md:grid-cols-2">
                <label className={designLabelClass}>Số ca nghi ngờ <span className="text-[#ef4444]">*</span>
                  <input type="number" min="1" value={form.suspectedCases} onChange={(e) => update("suspectedCases", e.target.value)} className={designInputClass} placeholder="0" data-testid="input-incident-suspected-cases" />
                  {submitted && !form.suspectedCases && <span className="mt-1 block normal-case tracking-normal text-xs font-medium text-[#ef4444]">Vui lòng nhập số ca nghi ngờ.</span>}
                </label>
                <label className={designLabelClass}>Mức độ ưu tiên
                  <select value={form.severity} onChange={(e) => update("severity", e.target.value)} className={designInputClass} data-testid="select-incident-priority"><option>Khẩn cấp</option><option>Cao</option><option>Trung bình</option></select>
                </label>
              </div>
              <label className={designLabelClass}>Mô tả chi tiết / Ghi chú ban đầu <span className="text-[#ef4444]">*</span>
                <textarea value={form.description} onChange={(e) => update("description", e.target.value)} className={designAreaClass} placeholder="Mô tả các biểu hiện, số người bị ảnh hưởng và các biện pháp xử lý ban đầu tại chỗ..." data-testid="textarea-incident-description" />
                {submitted && !form.description && <span className="mt-1 block normal-case tracking-normal text-xs font-medium text-[#ef4444]">Vui lòng mô tả tình huống.</span>}
              </label>
              <label className={designLabelClass}>Thực phẩm / món ăn cụ thể
                <input value={form.foods} onChange={(e) => update("foods", e.target.value)} className={designInputClass} placeholder="Tên món ăn, nguyên liệu hoặc lô hàng..." data-testid="input-incident-foods" />
              </label>
            </div>
          </section>

          <section>
            <div className="mb-6 flex items-center gap-2">
              <span className="h-6 w-1 rounded-full bg-[#94a3b8]" />
              <h2 className="text-sm font-bold uppercase tracking-[.05em] text-[#1e293b]">3. Thông tin người báo cáo & ghi chú</h2>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              <label className={designLabelClass}>Họ và tên <span className="text-[#ef4444]">*</span>
                <input value={form.reporter} onChange={(e) => update("reporter", e.target.value)} className={designInputClass} placeholder="Nguyễn Văn A" data-testid="input-incident-reporter" />
                {submitted && !form.reporter && <span className="mt-1 block normal-case tracking-normal text-xs font-medium text-[#ef4444]">Vui lòng nhập họ tên.</span>}
              </label>
              <label className={designLabelClass}>Chức vụ <span className="text-[#ef4444]">*</span>
                <input value={form.reporterRole} onChange={(e) => update("reporterRole", e.target.value)} className={designInputClass} placeholder="Trưởng trạm y tế" data-testid="input-incident-reporter-role" />
                {submitted && !form.reporterRole && <span className="mt-1 block normal-case tracking-normal text-xs font-medium text-[#ef4444]">Vui lòng nhập chức vụ.</span>}
              </label>
              <label className={designLabelClass}>Số điện thoại <span className="text-[#ef4444]">*</span>
                <input value={form.phone} onChange={(e) => update("phone", e.target.value)} className={designInputClass} placeholder="0909 123 456" data-testid="input-incident-phone" />
              </label>
            </div>
            <label className={`${designLabelClass} mt-6 block`}>Biện pháp đã thực hiện
              <textarea value={form.response} onChange={(e) => update("response", e.target.value)} className={designAreaClass} placeholder="Ví dụ: tạm dừng phục vụ, niêm phong mẫu lưu..." data-testid="textarea-incident-response" />
            </label>
          </section>

          <section>
            <div className="mb-6 flex items-center gap-2">
              <span className="h-6 w-1 rounded-full bg-[#94a3b8]" />
              <h2 className="text-sm font-bold uppercase tracking-[.05em] text-[#1e293b]">4. Tải lên minh chứng / hình ảnh</h2>
            </div>
            <label className="flex min-h-[172px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#e2e8f0] bg-[#f8fafc] px-5 text-center transition-colors hover:border-[#93c5fd] hover:bg-[#eff6ff]" data-testid="label-upload-incident-files">
              <span className="flex h-12 w-12 items-center justify-center rounded-full border border-[#e2e8f0] bg-white text-[#2563eb] shadow-sm"><Upload size={22} /></span>
              <span className="mt-3 text-base font-medium text-[#1e293b]">Nhấn để tải lên hoặc kéo thả hình ảnh/tài liệu</span>
              <span className="mt-1 text-xs text-[#64748b]">Hỗ trợ JPG, PNG, PDF (Tối đa {EVIDENCE_MAX_SIZE_LABEL}/tệp)</span>
              <input type="file" accept={EVIDENCE_ACCEPT} multiple className="sr-only" onChange={handleFiles} data-testid="input-incident-files" />
            </label>
            {files.length > 0 && <div className="mt-3 space-y-2">{files.map((file) => <div key={file} className="flex items-center justify-between rounded-lg bg-[#eff6ff] px-3 py-2 text-xs font-semibold text-[#1e3a8a]" data-testid={`file-incident-${file}`}><span className="flex items-center gap-2 truncate"><FileText size={14} />{file}</span><button type="button" onClick={() => setFiles((current) => current.filter((name) => name !== file))} className="focus-ring rounded p-1 text-[#64748b] hover:text-[#ef4444]" aria-label={`Xóa tệp ${file}`} data-testid={`button-remove-file-${file}`}><X size={14} /></button></div>)}</div>}
          </section>

          <section>
            <div className="mb-6 flex items-center gap-2">
              <span className="h-6 w-1 rounded-full bg-[#2563eb]" />
              <h2 className="text-sm font-bold uppercase tracking-[.05em] text-[#1e293b]">5. Gửi thông báo đến các bên liên quan</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {[
                ["notifyFacility", "Nhà trường", "Thông báo qua hệ thống", form.notifyFacility, "checkbox-notify-facility"],
                ["notifyHealth", "Trạm Y tế địa phương", "Gửi Email tự động", form.notifyHealth, "checkbox-notify-health"],
                ["notifyDistrict", "UBND Phường/Xã", "Gửi Email tự động", form.notifyDistrict, "checkbox-notify-district"],
              ].map(([key, title, description, checked, testId]) => (
                <label key={String(key)} className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors ${checked ? "border-[#2563eb] bg-[#eff6ff]" : "border-[#e2e8f0] bg-white hover:border-[#93c5fd]"}`}>
                  <input type="checkbox" checked={Boolean(checked)} onChange={(e) => update(String(key), e.target.checked)} className="mt-0.5 h-5 w-5 accent-[#2563eb]" data-testid={testId} />
                  <span><strong className="block text-[13px] text-[#1e293b]">{title}</strong><span className="mt-1 block text-[11px] text-[#64748b]">{description}</span></span>
                </label>
              ))}
            </div>
          </section>

          <div className="flex flex-col-reverse gap-3 border-t border-[#e2e8f0] pt-6 sm:flex-row sm:justify-end">
            <Link href="/admin/inspections/incidents" className="focus-ring inline-flex h-[50px] items-center justify-center rounded-xl border border-[#e2e8f0] px-8 text-base font-semibold text-[#64748b] transition-colors hover:border-[#94a3b8] hover:text-[#334155]" data-testid="link-cancel-create-incident">Hủy</Link>
            <PrimaryButton type="submit" variant="danger" testId="button-submit-incident"><Siren size={16} /> Kích hoạt SOP & gửi thông báo</PrimaryButton>
          </div>
        </div>
      </form>
    </PageFrame>
  );
}

function UploadIcon() {
  return <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e5f2eb] text-[#176b53]"><Upload size={18} /></span>;
}

export function IncidentDetailPage() {
  const params = useParams<{ id: string }>();
  const [incident, setIncident] = useState<Incident | null>(() => readIncidents().find((item) => item.id === params.id) ?? null);
  const [isSupplementOpen, setIsSupplementOpen] = useState(false);
  const [supplementRequest, setSupplementRequest] = useState("");
  const [closedAt, setClosedAt] = useState(() => toDateTimeLocal(incident?.closedAt));
  const [closedBy, setClosedBy] = useState(() => incident?.closedBy ?? "");
  const [conclusion, setConclusion] = useState(() => incident?.conclusion ?? "");
  const [closeError, setCloseError] = useState("");

  const updateIncident = (next: Incident) => {
    setIncident(next);
    persistIncidents(readIncidents().map((item) => item.id === next.id ? next : item));
  };

  const requestSupplement = (event: FormEvent) => {
    event.preventDefault();
    if (!incident || !supplementRequest.trim()) return;
    const next = {
      ...incident,
      reviewStatus: "Yêu cầu bổ sung" as IncidentReviewStatus,
      supplementRequest: supplementRequest.trim(),
      timeline: [
        ...incident.timeline,
        {
          time: new Intl.DateTimeFormat("vi-VN", { hour: "2-digit", minute: "2-digit" }).format(new Date()),
          label: "Yêu cầu nhà trường bổ sung",
          detail: supplementRequest.trim(),
          tone: "orange",
        },
      ],
    };
    updateIncident(next);
    setSupplementRequest("");
    setIsSupplementOpen(false);
  };

  const closeIncident = () => {
    if (!incident || incident.status === "Đã đóng") return;
    if (!closedAt || !closedBy.trim() || !conclusion.trim()) {
      setCloseError("Vui lòng nhập đầy đủ ngày đóng hồ sơ, người thực hiện và kết luận cuối cùng.");
      return;
    }
    if (!window.confirm("Xác nhận đóng hồ sơ sự cố? Sau khi đóng, hồ sơ sẽ chỉ được xem và không thể chỉnh sửa.")) return;
    const closedAtIso = new Date(closedAt).toISOString();
    const next = {
      ...incident,
      status: "Đã đóng" as IncidentStatus,
      closedAt: closedAtIso,
      closedBy: closedBy.trim(),
      conclusion: conclusion.trim(),
      timeline: [
        ...incident.timeline,
        {
          time: new Intl.DateTimeFormat("vi-VN", { hour: "2-digit", minute: "2-digit" }).format(new Date()),
          label: "Đã đóng sự cố",
          detail: conclusion.trim(),
          tone: "green",
        },
      ],
    };
    updateIncident(next);
    setCloseError("");
  };

  if (!incident) {
    return (
      <AdminShell>
        <div className="min-h-[calc(100dvh-73px)] bg-[#f8fafc] p-6 sm:p-10">
          <div className="mx-auto max-w-3xl rounded-xl border border-[#e2e8f0] bg-white p-14 text-center shadow-sm">
            <CircleAlert className="mx-auto text-[#dc2626]" size={36} />
            <h1 className="mt-4 text-xl font-bold text-[#0f172a]">Không tìm thấy sự cố</h1>
            <p className="mt-2 text-sm text-[#64748b]">Sự cố có thể đã được xóa hoặc mã không còn hiệu lực.</p>
            <Link href="/admin/inspections/incidents" className="mt-5 inline-flex text-sm font-bold text-[#059669]" data-testid="link-back-missing-incident">Quay lại danh sách</Link>
          </div>
        </div>
      </AdminShell>
    );
  }

  const processSteps = [
    "Phát hiện sự cố",
    "Kích hoạt SOP\nAlert",
    "Gửi cảnh báo",
    "Nhà trường khoanh\nvùng món",
    "Nhà trường thực\nhiện truy xuất",
    "Nhà trường gửi kết\nquả",
    "Theo dõi xử lý",
    "Kết luận",
    "Đóng sự cố",
  ];
  const completedSteps = incident.status === "Đã đóng" ? processSteps.length : incident.schoolUpdate ? 6 : 3;
  const selectedNotifications = [
    incident.notifyFacility && "Nhà trường",
    incident.notifyHealth && "Y tế địa phương",
    incident.notifyDistrict && "Cơ quan quản lý",
  ].filter(Boolean) as string[];
  const canCloseIncident = hasCompleteSchoolUpdate(incident.schoolUpdate);

  const statusBadge = incident.status === "Đang xử lý"
    ? "border-[#fed7aa] bg-[#ffedd5] text-[#c2410c]"
    : "border-[#a7f3d0] bg-[#d1fae5] text-[#047857]";

  return (
    <AdminShell>
      <div className="min-h-[calc(100dvh-73px)] bg-[#f8fafc] text-[#0f172a]">
        <header className="border-b border-[#e2e8f0] bg-white">
          <div className="mx-auto flex min-h-[80px] items-center gap-4 px-5 py-4 sm:px-8">
            <Link
              href="/admin/inspections/incidents"
              className="focus-ring inline-flex shrink-0 items-center gap-2 text-sm font-medium text-[#64748b] transition-colors hover:text-[#1e40af]"
              aria-label="Quay lại danh sách sự cố"
              data-testid="link-back-incident-list"
            >
              <ArrowLeft size={16} />
              <span className="hidden sm:inline">Danh sách sự cố</span>
            </Link>
            <span className="h-8 w-px bg-[#e2e8f0]" aria-hidden="true" />
            <div className="flex min-w-0 flex-1 items-center justify-between gap-4">
              <div className="flex min-w-0 flex-wrap items-center gap-3">
                <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-[.05em] ${statusBadge}`} data-testid="status-incident-detail">
                  <span className={`h-1.5 w-1.5 rounded-full ${incident.status === "Đang xử lý" ? "bg-[#f97316]" : "bg-[#10b981]"}`} />
                  {incident.status}
                </span>
                <span className="truncate text-base font-semibold text-[#000] sm:text-xl">{incident.facility}</span>
              </div>
              <span className="hidden shrink-0 font-mono text-xs font-bold tracking-[.08em] text-[#94a3b8] sm:block">{incident.code}</span>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-[1376px] space-y-8 px-5 py-8 sm:px-8">
          <section className="rounded-xl border border-[#e2e8f0] bg-white p-5 shadow-sm sm:p-6" data-testid="section-incident-sop-timeline">
            <h2 className="text-sm font-bold uppercase tracking-[.05em] text-[#64748b]">Tiến trình quy trình (SOP timeline)</h2>
            <div className="relative mt-8 overflow-x-auto pb-1">
              <div className="relative flex min-w-[780px] justify-between gap-4">
                <div className="absolute left-12 right-12 top-4 h-0.5 bg-[#e2e8f0]" aria-hidden="true" />
                <div
                  className="absolute left-12 top-4 h-0.5 bg-[#059669]"
                  style={{ width: `calc((100% - 96px) * ${Math.max(0, completedSteps - 1) / (processSteps.length - 1)})` }}
                  aria-hidden="true"
                />
                {processSteps.map((label, index) => {
                  const completed = index < completedSteps;
                  return (
                    <div key={label} className="relative z-10 flex w-24 shrink-0 flex-col items-center gap-3 text-center" data-testid={`step-incident-${index}`}>
                      <span className={`flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-bold ${completed ? "border-[#059669] bg-[#059669] text-white" : "border-[#cbd5e1] bg-white text-[#94a3b8]"}`}>
                        {completed ? <Check size={14} strokeWidth={3} /> : index + 1}
                      </span>
                      <span className={`whitespace-pre-line text-[11px] font-medium leading-4 ${completed ? "text-[#0f172a]" : "text-[#94a3b8]"}`}>{label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          <section className="overflow-hidden rounded-xl border border-[#e2e8f0] bg-white shadow-sm" data-testid="section-incident-summary">
            <div className="flex items-center gap-3 border-b border-[#e2e8f0] px-5 py-5 sm:px-6">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#ecfdf5] text-[#059669]"><CircleAlert size={17} /></span>
              <h2 className="text-xl font-bold text-[#0f172a]">Chi tiết cảnh báo</h2>
            </div>

            <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-6 xl:grid-cols-4">
              <IncidentDetailCard icon={<FileText size={17} />} label="Mã sự cố" value={incident.code} tone="blue" />
              <IncidentDetailCard icon={<MapPin size={17} />} label="Trường học" value={incident.facility} tone="orange" />
              <IncidentDetailCard icon={<CircleAlert size={17} />} label="Số ca mắc" value={`${String(incident.suspectedCases ?? 0).padStart(2, "0")} học sinh`} tone="red" valueClassName="text-2xl font-bold text-[#dc2626]" />
              <IncidentDetailCard icon={<Clock3 size={17} />} label="Thời gian" value={formatDate(incident.occurredAt)} tone="purple" />
              <IncidentDetailCard icon={<Bell size={17} />} label="Bữa ăn nghi vấn" value={incident.meals?.join(", ") || incident.foods || "Chưa cập nhật"} tone="amber" />
              <IncidentDetailCard icon={<UserRound size={17} />} label="Người báo cáo" value={incident.reporter} tone="green" />
              <IncidentDetailCard icon={<Phone size={17} />} label="Số điện thoại" value={incident.phone || "Chưa cập nhật"} tone="green" />
              <IncidentDetailCard icon={<ShieldCheck size={17} />} label="Thông báo đã chọn" value={selectedNotifications.length ? selectedNotifications.join(", ") : "Chưa chọn"} tone="purple" />
            </div>

            <div className="space-y-6 border-t border-[#e2e8f0] px-5 py-6 sm:px-6">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-[.05em] text-[#1e293b]">Triệu chứng chính</h3>
                <div className="mt-3 rounded-lg border border-[#e2e8f0] bg-[#f8fafc] p-4 text-base leading-6 text-[#0f172a]" data-testid="text-incident-description">
                  {incident.description}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-bold uppercase tracking-[.05em] text-[#1e293b]">Minh chứng / hình ảnh</h3>
                {incident.attachments.length ? (
                  <div className="mt-3 flex flex-wrap gap-4 rounded-lg border border-[#e2e8f0] bg-[#f8fafc] p-4">
                    {incident.attachments.map((file) => (
                      <AttachmentPreview key={file} file={file} />
                    ))}
                  </div>
                ) : (
                  <div className="mt-3 rounded-lg border border-[#e2e8f0] bg-[#f8fafc] p-6 text-sm text-[#94a3b8]">Chưa có minh chứng hoặc hình ảnh đính kèm.</div>
                )}
              </div>
            </div>
          </section>

          <section className="overflow-hidden rounded-xl border border-[#e2e8f0] bg-white shadow-sm" data-testid="section-incident-school-update">
            <div className="flex items-center gap-4 bg-[#f8fafc] px-5 py-5 sm:px-6">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f1f5f9] text-[#94a3b8]"><MessageSquareText size={17} /></span>
              <div>
                <h2 className="text-lg font-bold text-[#0f172a]">Cập nhật từ nhà trường</h2>
                <p className="mt-0.5 text-xs text-[#64748b]">Đang chờ dữ liệu cập nhật từ phía nhà trường</p>
              </div>
            </div>
               {incident.schoolUpdate ? (
                <SchoolUpdateSummary incidentId={incident.id} facility={incident.facility} update={incident.schoolUpdate} reviewStatus={incident.reviewStatus} supplementRequest={incident.supplementRequest} />
             ) : (
               <div className="flex min-h-[280px] flex-col items-center justify-center px-6 py-16 text-center">
                 <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#eff6ff] text-[#1e40af]"><Info size={28} /></span>
                 <h3 className="mt-5 text-lg font-bold text-[#0f172a]">Chưa có cập nhật từ nhà trường</h3>
                 <p className="mt-2 max-w-md text-sm leading-6 text-[#64748b]">Hệ thống đang chờ nhà trường cập nhật thông tin chi tiết về sự cố.</p>
                 {incident.reviewStatus === "Yêu cầu bổ sung" && incident.supplementRequest && (
                   <div className="mt-5 max-w-xl rounded-xl border border-[#fed7aa] bg-[#fff7ed] px-5 py-4 text-left text-sm text-[#9a3412]">
                     <strong>Yêu cầu bổ sung:</strong> {incident.supplementRequest}
                   </div>
                 )}
               </div>
             )}
          </section>

           <section className="overflow-hidden rounded-xl border border-[#e2e8f0] bg-white p-5 shadow-sm sm:p-6" data-testid="section-incident-conclusion">
             <div className="flex items-center gap-3">
               <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#f1f5f9] text-[#475569]"><FileText size={15} /></span>
               <h2 className="text-sm font-extrabold uppercase tracking-[.03em] text-[#1e293b]">Kết luận &amp; đóng hồ sơ</h2>
             </div>
             <div className="mt-5 grid gap-5 rounded-xl border border-[#e2e8f0] bg-[#f8fafc] p-4 sm:p-5 md:grid-cols-2">
               <div className="space-y-4">
                 <div>
                   <p className="text-[10px] font-extrabold uppercase tracking-[.06em] text-[#64748b]">Ngày đóng hồ sơ</p>
                   {incident.status === "Đã đóng" ? (
                     <p className="mt-1 text-xs text-[#334155]" data-testid="text-incident-closed-at">{formatDate(incident.closedAt ?? incident.reportedAt)}</p>
                   ) : (
                     <input type="datetime-local" value={closedAt} onChange={(event) => { setClosedAt(event.target.value); setCloseError(""); }} className={`${designInputClass} mt-2`} data-testid="input-incident-closed-at" />
                   )}
                 </div>
                 <div>
                   <p className="text-[10px] font-extrabold uppercase tracking-[.06em] text-[#64748b]">Người thực hiện đóng</p>
                   {incident.status === "Đã đóng" ? (
                     <p className="mt-1 text-xs text-[#334155]" data-testid="text-incident-closed-by">{incident.closedBy || "Cán bộ phụ trách"}</p>
                   ) : (
                     <input value={closedBy} onChange={(event) => { setClosedBy(event.target.value); setCloseError(""); }} className={`${designInputClass} mt-2`} placeholder="Nhập tên người thực hiện" data-testid="input-incident-closed-by" />
                   )}
                 </div>
               </div>
               <div className="border-t border-[#e2e8f0] pt-4 md:border-l md:border-t-0 md:pl-6 md:pt-0">
                 <p className="text-[10px] font-extrabold uppercase tracking-[.06em] text-[#64748b]">Kết luận cuối cùng</p>
                 {incident.status === "Đã đóng" ? (
                   <p className="mt-1 text-xs leading-5 text-[#334155]" data-testid="text-incident-conclusion">{incident.conclusion || "Chưa cập nhật kết luận."}</p>
                 ) : (
                   <textarea value={conclusion} onChange={(event) => { setConclusion(event.target.value); setCloseError(""); }} className={`${designAreaClass} mt-2 min-h-[100px]`} placeholder="Nhập kết luận trước khi đóng hồ sơ..." data-testid="textarea-incident-conclusion" />
                 )}
               </div>
             </div>
             {incident.status !== "Đã đóng" && closeError && <p className="mt-3 text-sm font-semibold text-[#dc2626]" role="alert" data-testid="text-incident-close-error">{closeError}</p>}
             {incident.status !== "Đã đóng" && !canCloseIncident && <p className="mt-3 text-sm font-semibold text-[#b45309]" data-testid="text-incident-close-requirement">Chỉ có thể đóng hồ sơ sau khi nhà trường cập nhật đầy đủ thông tin xử lý.</p>}
           </section>
        </main>

        <footer className="border-t border-[#e2e8f0] bg-white px-5 py-6 shadow-[0_-4px_6px_-1px_rgba(0,0,0,.08)] sm:px-8">
          <div className="mx-auto flex max-w-[1376px] flex-col justify-center gap-3 sm:flex-row">
             {incident.status === "Đang xử lý" && (
             <button type="button" onClick={() => setIsSupplementOpen(true)} className="focus-ring inline-flex min-h-[59px] items-center justify-center gap-3 rounded-xl border border-[#e2e8f0] bg-[#f1f5f9] px-8 text-base font-bold text-[#0f172a] transition-colors hover:bg-[#e2e8f0]" data-testid="button-request-incident-update">
              <Bell size={18} /> Gửi yêu cầu bổ sung
            </button>
             )}
            {incident.status === "Đang xử lý" ? (
               <button type="button" onClick={closeIncident} disabled={!canCloseIncident} className="focus-ring inline-flex min-h-[59px] items-center justify-center gap-3 rounded-xl bg-[#1e40af] px-8 text-base font-bold text-white transition-colors hover:bg-[#1d4ed8] disabled:cursor-not-allowed disabled:bg-[#cbd5e1] disabled:text-[#64748b]" data-testid="button-close-incident" title={!canCloseIncident ? "Chờ nhà trường cập nhật đầy đủ thông tin xử lý" : undefined}>
                <Check size={18} /> Đóng hồ sơ sự cố
              </button>
            ) : (
              <span className="inline-flex min-h-[59px] items-center justify-center gap-3 rounded-xl border border-[#cbd5e1] bg-white px-8 text-sm font-bold text-[#64748b]" data-testid="button-closed-incident">
                <Check size={17} /> Hồ sơ đã được đóng - không thể chỉnh sửa
              </span>
            )}
          </div>
        </footer>
         {isSupplementOpen && (
           <IncidentTextModal
             title="Yêu cầu nhà trường cập nhật bổ sung"
             description="Nội dung này sẽ hiển thị trong thông báo demo của nhà trường."
             value={supplementRequest}
             onChange={setSupplementRequest}
             onClose={() => setIsSupplementOpen(false)}
             onSubmit={requestSupplement}
             submitLabel="Gửi yêu cầu bổ sung"
             testId="dialog-request-incident-update"
           />
         )}
      </div>
    </AdminShell>
  );
}

function IncidentDetailCard({
  icon,
  label,
  value,
  tone,
  valueClassName = "text-base font-medium text-[#0f172a]",
}: {
  icon: ReactNode;
  label: string;
  value: string;
  tone: "blue" | "orange" | "red" | "amber" | "green" | "purple";
  valueClassName?: string;
}) {
  const tones = {
    blue: "bg-[#eff6ff] text-[#1e40af]",
    orange: "bg-[#fff7ed] text-[#ea580c]",
    red: "bg-[#fef2f2] text-[#dc2626]",
    amber: "bg-[#fffbeb] text-[#d97706]",
    green: "bg-[#ecfdf5] text-[#059669]",
    purple: "bg-[#faf5ff] text-[#9333ea]",
  };

  return (
    <div className="rounded-xl border border-[#e2e8f0] bg-[#f8fafc] p-5">
      <div className="flex items-center gap-3">
        <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${tones[tone]}`}>{icon}</span>
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-[.05em] text-[#94a3b8]">{label}</p>
          <p className={`mt-1 break-words leading-6 ${valueClassName}`}>{value}</p>
        </div>
      </div>
    </div>
  );
}

function IncidentTextModal({
  title,
  description,
  value,
  onChange,
  onClose,
  onSubmit,
  submitLabel,
  testId,
}: {
  title: string;
  description: string;
  value: string;
  onChange: (value: string) => void;
  onClose: () => void;
  onSubmit: (event: FormEvent) => void;
  submitLabel: string;
  testId: string;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0f172a]/55 p-4" role="dialog" aria-modal="true" data-testid={testId}>
      <form onSubmit={onSubmit} className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="mono-label text-[#176b53]">Hồ sơ cảnh báo ATTP</p>
            <h2 className="mt-2 text-xl font-bold text-[#0f172a]">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-[#64748b]">{description}</p>
          </div>
          <button type="button" onClick={onClose} className="focus-ring rounded-lg p-2 text-[#64748b] hover:bg-[#f1f5f9]" aria-label="Đóng popup"><X size={19} /></button>
        </div>
        <label className="mt-6 block text-sm font-bold text-[#334155]">
          Nội dung <span className="text-[#dc2626]">*</span>
          <textarea
            autoFocus
            required
            value={value}
            onChange={(event) => onChange(event.target.value)}
            className={`${designAreaClass} min-h-[130px]`}
            placeholder="Nhập nội dung..."
            data-testid={`${testId}-textarea`}
          />
        </label>
        <div className="mt-6 flex flex-col-reverse gap-3 border-t border-[#e2e8f0] pt-5 sm:flex-row sm:justify-end">
          <button type="button" onClick={onClose} className="focus-ring inline-flex h-11 items-center justify-center rounded-xl border border-[#e2e8f0] px-6 text-sm font-bold text-[#64748b] hover:border-[#94a3b8]">Hủy</button>
          <PrimaryButton type="submit" testId={`${testId}-submit`}>{submitLabel}</PrimaryButton>
        </div>
      </form>
    </div>
  );
}

function SchoolUpdateSummary({
  incidentId,
  facility,
  update,
  reviewStatus,
  supplementRequest,
}: {
  incidentId: string;
  facility: string;
  update: SchoolIncidentUpdate;
  reviewStatus: IncidentReviewStatus;
  supplementRequest?: string;
}) {
  const [, navigate] = useLocation();
  const [isTraceOpen, setIsTraceOpen] = useState(false);
  const menus = getMealLifecycles(update);

  return (
    <div className="space-y-5 px-5 py-6 sm:px-6" data-testid="section-school-update-submitted">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[.05em] text-[#64748b]">Thông tin nhà trường cung cấp</p>
          <p className="mt-1 text-sm text-[#64748b]">Gửi lúc {formatDate(update.submittedAt)}</p>
        </div>
        <span className={`rounded-full border px-3 py-1 text-xs font-bold ${reviewStatus === "Yêu cầu bổ sung" ? "border-[#fed7aa] bg-[#fff7ed] text-[#c2410c]" : "border-[#a7f3d0] bg-[#ecfdf5] text-[#047857]"}`} data-testid="status-school-update">{reviewStatus}</span>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {[
          ["Người cập nhật", `${update.contactName} · ${update.contactRole}`],
          ["Món ăn đã truy xuất", update.tracedMeals],
        ].map(([label, value]) => (
          <div key={label} className="rounded-xl border border-[#e2e8f0] bg-[#f8fafc] p-4">
            <p className="text-xs font-bold uppercase tracking-[.05em] text-[#94a3b8]">{label}</p>
            <p className="mt-2 whitespace-pre-line text-sm leading-6 text-[#0f172a]">{value || "Chưa cập nhật"}</p>
          </div>
        ))}
      </div>
      {update.notes && <div className="rounded-xl border border-[#e2e8f0] bg-white p-4"><p className="text-xs font-bold uppercase tracking-[.05em] text-[#94a3b8]">Ghi chú thêm</p><p className="mt-2 whitespace-pre-line text-sm leading-6 text-[#334155]">{update.notes}</p></div>}
      {supplementRequest && (
        <div className="rounded-xl border border-[#fed7aa] bg-[#fff7ed] p-4 text-sm leading-6 text-[#9a3412]">
          <strong>Yêu cầu bổ sung gần nhất:</strong> {supplementRequest}
        </div>
      )}
      {update.attachments.length > 0 && <div className="flex flex-wrap gap-3">{update.attachments.map((file) => <AttachmentPreview key={file} file={file} compact />)}</div>}
       <section className="rounded-xl border border-[#e2e8f0] bg-[#f8fafc] p-4 sm:p-5" data-testid="section-saved-meal-records">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.05em] text-[#64748b]">Hồ sơ lưu mẫu</p>
            <h3 className="mt-1 text-lg font-bold text-[#0f172a]">Các thực đơn đã được nhà trường cập nhật</h3>
          </div>
          <span className="text-sm font-semibold text-[#64748b]">{menus.length} thực đơn</span>
        </div>
        <div className="mt-4 grid gap-4 lg:grid-cols-3">
          {menus.map((menu) => (
             <article key={menu.id} className="overflow-hidden rounded-2xl border border-[#f3f4f6] bg-white shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-4px_rgba(0,0,0,0.1)]">
               <div className="relative flex h-56 items-center overflow-hidden bg-[#f9fafb]">
                 <img src={foodPhotoPath} alt={`Ảnh minh họa ${menu.name}`} className="h-full w-full object-cover" />
                 <div className="absolute left-4 top-4 rounded-full bg-[#dcfce7] px-3 py-2 text-[11px] font-bold uppercase tracking-[.1em] text-[#16a34a]">
                   {menu.menuType.split(" ")[0]}
                 </div>
              </div>
               <div className="space-y-4 p-6">
                 <div className="space-y-1">
                   <h4 className="text-xl font-bold leading-7 text-[#1f2937]">{menu.name}</h4>
                   <p className="text-xs leading-4 text-[#64748b]">Mã món: {menu.code}</p>
                   <p className="text-xs leading-4 text-[#64748b]">Trường: {facility}</p>
                </div>
                 <div className="space-y-4">
                   <div className="flex flex-wrap justify-center gap-2">
                     {["Cá basa", "Cà chua"].map((ingredient) => (
                       <span key={ingredient} className="inline-flex items-center gap-2 rounded-lg border border-[#f3f4f6] bg-[#f9fafb] px-2 py-2 text-xs font-medium text-[#0f172a]">
                         <span className="h-2 w-2 rounded-full bg-[#f26522]" />
                         {ingredient}
                       </span>
                     ))}
                   </div>
                   <div className="space-y-3 pt-2">
                     {[
                       "Sơ chế cá, rau, cà chua, thơm",
                       "Phi thơm, nấu nước dùng 15 phút",
                       "Cho cá vào nấu chín, nêm gia vị",
                     ].map((step, index) => (
                       <div key={step} className="flex items-center gap-3">
                         <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#f26522] text-[10px] font-bold text-white">{index + 1}</span>
                         <span className="text-xs font-medium text-[#4b5563]">{step}</span>
                       </div>
                     ))}
                   </div>
                 </div>
                 <div className="space-y-2 rounded-xl border border-[#e2e8f0] bg-[#f8fafc] p-4 text-[13px] leading-5">
                   <div className="flex items-center justify-between gap-4">
                     <span className="text-[#64748b]">Thời gian chế biến:</span>
                     <span className="font-medium text-[#0f172a]">{menu.processAt.split(" ")[0]}</span>
                   </div>
                   <div className="flex items-center justify-between gap-4">
                     <span className="text-[#64748b]">Thời gian phục vụ:</span>
                     <span className="font-medium text-[#0f172a]">{menu.processedAt.split(" ")[0]}</span>
                   </div>
                   <div className="flex items-center justify-between gap-4">
                     <span className="text-[#64748b]">Số suất:</span>
                     <span className="font-medium text-[#0f172a]">450</span>
                   </div>
                   <div className="flex items-center justify-between gap-4">
                     <span className="text-[#64748b]">Tình trạng:</span>
                     <span className="font-medium text-[#0f172a]">{menu.status}</span>
                   </div>
                   <div className="flex items-center justify-between gap-4">
                     <span className="text-[#64748b]">Số lượng còn lại:</span>
                     <span className="font-medium text-[#0f172a]">12 kg</span>
                   </div>
                   <div className="flex items-center justify-between gap-4">
                     <span className="text-[#64748b]">Vị trí lưu giữ:</span>
                     <span className="font-medium text-[#0f172a]">Kho lạnh 01</span>
                   </div>
                </div>
                 <button type="button" onClick={() => setIsTraceOpen(true)} className="inline-flex h-11 w-full items-center justify-center rounded-lg bg-[#1b6c98] px-3 text-sm font-bold text-white transition-colors hover:bg-[#155777]" data-testid={`button-view-sample-record-${menu.id}`}>
                  Xem hồ sơ lưu mẫu
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
      {isTraceOpen && (
        <MealLifecycleDetailModal
          menus={menus}
          onClose={() => setIsTraceOpen(false)}
          onOpenMenu={(menuId) => navigate(`/admin/inspections/incidents/${incidentId}/menu/${menuId}`)}
        />
      )}
    </div>
  );
}

function MealLifecycleDetailModal({
  menus,
  onClose,
  onOpenMenu,
}: {
  menus: MealLifecycle[];
  onClose: () => void;
  onOpenMenu: (menuId: string) => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0f172a]/50 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="meal-lifecycle-title">
      <div className="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-[28px] bg-white shadow-2xl">
        <header className="flex items-center justify-between gap-4 border-b border-[#d3d3d3] px-5 py-4 sm:px-6">
          <h2 id="meal-lifecycle-title" className="text-xl font-bold text-[#0f172a]">Thông tin thực đơn</h2>
          <button type="button" onClick={onClose} className="rounded-lg px-3 py-2 text-sm font-semibold text-[#f15d22] hover:bg-[#fff7ed]" data-testid="button-close-meal-lifecycle">Đóng lại</button>
        </header>
        <div className="space-y-5 overflow-y-auto bg-[#f0f0f0] p-4 sm:p-5">
          <section className="rounded-xl bg-white p-4 shadow-sm sm:p-5">
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-xl bg-[#0f3f5b] p-3 text-xs font-bold text-white"><img src={foodPhotoPath} alt="Ảnh món ăn lưu mẫu" className="h-full w-full rounded-lg object-cover opacity-90" /><span className="absolute inset-x-2 bottom-2 rounded bg-[#0f172a]/70 px-1 py-0.5 text-center">Hồ sơ lưu mẫu</span></div>
              <div className="min-w-0 flex-1 divide-y divide-[#f0f0f0]">
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3"><span className="font-semibold text-[#0f172a]">Tên thực đơn</span><span className="rounded-full bg-[#f0f0f0] px-3 py-1 text-xs font-semibold text-[#1e1e1e]">Không theo dõi</span></div>
                <div className="flex gap-3 py-3 text-sm"><span className="w-36 shrink-0 font-semibold text-[#64748b]">Thực đơn</span><span className="font-bold text-[#f15d22]">Mì trộn hải sản</span></div>
                <div className="flex gap-3 py-3 text-sm"><span className="w-36 shrink-0 font-semibold text-[#64748b]">Loại thực đơn</span><span className="text-[#1e1e1e]">Đặc (nấu chín)</span></div>
                <div className="flex gap-3 pt-3 text-sm"><span className="w-36 shrink-0 font-semibold text-[#64748b]">Mô tả</span><span className="text-[#1e1e1e]">Món ăn được theo dõi và lưu đầy đủ hồ sơ trong 24 giờ.</span></div>
              </div>
            </div>
          </section>
          <section className="rounded-xl bg-white p-4 shadow-sm sm:p-5">
            <h3 className="text-base font-bold text-[#0f172a]">Thời gian phát hành ({menus.length})</h3>
            <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm text-[#1e1e1e]">{menus.map((menu) => <span key={menu.id}>• {menu.processedAt}</span>)}</div>
          </section>
          <section className="rounded-xl bg-white p-4 shadow-sm sm:p-5">
            <h3 className="text-base font-bold text-[#0f172a]">Quy trình chế biến (lưu vết)</h3>
            <p className="mt-3 text-sm text-[#808080]">Hiện tại không có quy trình chế biến nào!</p>
          </section>
          <section className="space-y-3">
            <h3 className="text-base font-bold text-[#0f172a]">Vòng đời thực đơn ({menus.length})</h3>
            {menus.map((menu, index) => (
              <button type="button" key={menu.id} onClick={() => onOpenMenu(menu.id)} className="flex w-full items-center gap-4 rounded-2xl bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md" data-testid={`button-open-menu-lifecycle-${menu.id}`}>
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f15d22] text-sm font-bold text-white">{index + 1}</span>
                <span className="min-w-0 flex-1"><span className="block text-sm text-[#1e1e1e]">Chế biến lúc {menu.processedAt}</span><span className="mt-1 block text-lg font-extrabold text-[#0f172a]">{menu.code}</span></span>
                <ChevronDown className="shrink-0 text-[#808080]" size={20} />
              </button>
            ))}
          </section>
        </div>
      </div>
    </div>
  );
}

export function IncidentMealDataPage() {
  const { id, menuId } = useParams<{ id: string; menuId: string }>();
  const incident = readIncidents().find((item) => item.id === id);
  const menu = getMealLifecycles(incident?.schoolUpdate).find((item) => item.id === menuId) ?? getMealLifecycles(incident?.schoolUpdate)[0];

  if (!incident || !menu) {
    return <AdminShell><main className="min-h-[calc(100dvh-73px)] bg-[#f8fafc] p-8 text-center"><h1 className="text-xl font-bold text-[#0f172a]">Không tìm thấy hồ sơ lưu mẫu</h1><Link href={id ? `/admin/inspections/incidents/${id}` : "/admin/inspections/incidents"} className="mt-4 inline-flex text-sm font-bold text-[#1b6c98]">Quay lại chi tiết cảnh báo</Link></main></AdminShell>;
  }

  return (
    <AdminShell>
      <main className="min-h-[calc(100dvh-73px)] bg-[#fafafa] px-4 py-6 sm:px-8">
        <div className="mx-auto max-w-5xl">
          <Link href={`/admin/inspections/incidents/${incident.id}`} className="inline-flex items-center gap-2 text-sm font-bold text-[#1b6c98]"><ArrowLeft size={16} /> Quay lại chi tiết cảnh báo</Link>
          <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div><p className="text-xs font-bold uppercase tracking-[.12em] text-[#f15d22]">Hồ sơ lưu mẫu / {menu.code}</p><h1 className="mt-1 text-2xl font-extrabold tracking-tight text-[#0f172a] sm:text-3xl">{menu.name}</h1></div>
            <span className="rounded-full bg-[#dcfce7] px-3 py-1.5 text-xs font-bold text-[#16a34a]">{menu.status}</span>
          </div>
          <section className="mt-6 rounded-xl bg-white p-4 shadow-sm sm:p-6">
            <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-start">
              <div className="h-32 w-32 shrink-0 overflow-hidden rounded-xl border-2 border-[#f0f0f0] bg-[#0f3f5b]"><img src={foodPhotoPath} alt={`Ảnh ${menu.name}`} className="h-full w-full object-cover" /></div>
              <div className="w-full divide-y divide-[#f0f0f0] text-sm">
                {[
                  ["Trạng thái", menu.status],
                  ["Tên thực đơn", menu.name],
                  ["Mã truy vết", menu.traceCode],
                  ["Loại thực đơn", menu.menuType],
                  ["Mô tả loại thực đơn", menu.description],
                ].map(([label, value]) => <div key={label} className="flex items-start justify-between gap-5 py-3 first:pt-0 last:pb-0"><span className="text-[#808080]">{label}</span><span className="max-w-[65%] text-right font-medium text-[#1e1e1e]">{value}</span></div>)}
              </div>
            </div>
          </section>
          <section className="mt-6 rounded-xl bg-white p-4 shadow-sm sm:p-6">
            <h2 className="text-base font-bold text-[#0f172a]">Quy trình chế biến (lưu vết)</h2>
            <div className="mt-4 rounded-lg bg-[#f0f0f0] p-4">
              <div className="flex items-center gap-4"><ChefHat size={24} className="text-[#0f172a]" /><div><p className="text-sm text-[#808080]">Đầu bếp</p><p className="font-semibold text-[#0f172a]">{menu.chef}</p></div></div>
              <div className="mt-4 flex items-center gap-4"><Utensils size={24} className="text-[#0f172a]" /><div><p className="text-sm text-[#808080]">Mã quy trình</p><p className="font-semibold text-[#0f172a]">{menu.processCode}</p></div></div>
              <div className="mt-4 flex items-center gap-4"><Clock3 size={24} className="text-[#0f172a]" /><div><p className="text-sm text-[#808080]">Chế biến lúc</p><p className="font-semibold text-[#0f172a]">{menu.processAt}</p></div></div>
            </div>
          </section>
          <section className="mt-6 overflow-hidden rounded-xl bg-white p-4 shadow-sm sm:p-6">
            <div className="flex items-center justify-between gap-3 border-b border-[#808080] pb-3"><h2 className="text-base font-bold text-[#0f172a]">Nguyên liệu</h2><span className="text-xs text-[#64748b]">{menu.ingredients.length} nguyên liệu</span></div>
            <div className="overflow-x-auto">
              <table className="mt-2 w-full min-w-[680px] text-left text-sm"><thead className="border-b border-[#d3d3d3] text-xs text-[#64748b]"><tr><th className="px-2 py-3">Nguyên liệu</th><th className="px-2 py-3">Nguồn cung cấp</th><th className="px-2 py-3 text-center">Số lô/mẻ</th><th className="px-2 py-3 text-center">Đơn vị tính</th></tr></thead><tbody>{menu.ingredients.map((ingredient) => <tr key={`${ingredient.name}-${ingredient.batch}`} className="border-b border-[#d3d3d3] last:border-0"><td className="px-2 py-4 font-medium">{ingredient.name}</td><td className="px-2 py-4">{ingredient.supplier}</td><td className="px-2 py-4 text-center">{ingredient.batch}</td><td className="px-2 py-4 text-center">{ingredient.unit}</td></tr>)}</tbody></table>
            </div>
          </section>
        </div>
      </main>
    </AdminShell>
  );
}

export function FacilityIncidentListPage() {
  const incidents = readIncidents().filter((item) => item.notifyFacility);
  return (
    <PublicShell>
      <main className="min-h-[calc(100dvh-160px)] bg-[#f8fafc] px-5 py-10 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <p className="mono-label text-[#176b53]">Không gian nhà trường / Thông báo hệ thống</p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-[-.04em] text-[#143b35]">Cảnh báo ATTP cần cập nhật</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#64748b]">Đây là luồng demo để nhà trường tiếp nhận cảnh báo từ Sở, cập nhật tình hình và gửi kết quả xử lý.</p>
          <div className="mt-8 space-y-4">
            {incidents.map((item) => (
              <Link key={item.id} href={`/facility/incidents/${item.id}`} className="block rounded-2xl border border-[#e2e8f0] bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-[#93c5fd] hover:shadow-md sm:p-6" data-testid={`card-facility-incident-${item.id}`}>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2"><span className="font-mono text-xs font-bold text-[#64748b]">{item.code}</span><span className={`rounded-full px-3 py-1 text-xs font-bold ${item.reviewStatus === "Yêu cầu bổ sung" ? "bg-[#fff7ed] text-[#c2410c]" : item.reviewStatus === "Đã gửi" ? "bg-[#ecfdf5] text-[#047857]" : "bg-[#eff6ff] text-[#1e40af]"}`}>{item.reviewStatus}</span></div>
                    <h2 className="mt-3 text-lg font-bold text-[#0f172a]">{item.title}</h2>
                    <p className="mt-1 text-sm text-[#64748b]">{item.facility} · Phát hiện {formatDate(item.occurredAt)}</p>
                  </div>
                  <span className="inline-flex items-center gap-2 text-sm font-bold text-[#1e40af]">Mở hồ sơ <ChevronRight size={16} /></span>
                </div>
                {item.reviewStatus === "Yêu cầu bổ sung" && item.supplementRequest && <p className="mt-4 rounded-xl bg-[#fff7ed] px-4 py-3 text-sm leading-6 text-[#9a3412]"><strong>Cần bổ sung:</strong> {item.supplementRequest}</p>}
              </Link>
            ))}
          </div>
        </div>
      </main>
    </PublicShell>
  );
}

export function FacilityIncidentDetailPage() {
  const params = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const [incident, setIncident] = useState<Incident | null>(() => readIncidents().find((item) => item.id === params.id) ?? null);
  const existing = incident?.schoolUpdate;
  const [form, setForm] = useState({
    contactName: existing?.contactName ?? "Nguyễn Thị Minh Anh",
    contactRole: existing?.contactRole ?? "Cán bộ phụ trách y tế trường",
    symptoms: existing?.symptoms ?? incident?.description ?? "",
    affectedStudents: existing?.affectedStudents ?? String(incident?.suspectedCases ?? ""),
    tracedMeals: existing?.tracedMeals ?? incident?.meals?.join(", ") ?? "",
    actionsTaken: existing?.actionsTaken ?? "",
    sampleHandling: existing?.sampleHandling ?? "",
    notes: existing?.notes ?? "",
  });
  const [files, setFiles] = useState<string[]>(existing?.attachments ?? []);
  const [submitted, setSubmitted] = useState(false);

  if (!incident) {
    return <PublicShell><main className="min-h-[calc(100dvh-160px)] px-5 py-16 text-center"><h1 className="text-xl font-bold text-[#143b35]">Không tìm thấy cảnh báo</h1><Link href="/facility/incidents" className="mt-4 inline-flex text-sm font-bold text-[#176b53]">Quay lại thông báo</Link></main></PublicShell>;
  }

  const update = (key: keyof typeof form, value: string) => setForm((current) => ({ ...current, [key]: value }));
  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!form.contactName || !form.contactRole || !form.symptoms || !form.affectedStudents || !form.tracedMeals || !form.actionsTaken || !form.sampleHandling) {
      setSubmitted(true);
      return;
    }
    const next: Incident = {
      ...incident,
      reviewStatus: "Đã gửi",
      schoolUpdate: { ...form, submittedAt: new Date().toISOString(), attachments: files, menus: existing?.menus ?? demoMealLifecycles },
      timeline: [
        ...incident.timeline,
        {
          time: new Intl.DateTimeFormat("vi-VN", { hour: "2-digit", minute: "2-digit" }).format(new Date()),
          label: "Nhà trường gửi kết quả",
          detail: "Nhà trường đã hoàn tất cập nhật thông tin sự cố và gửi lại Sở.",
          tone: "blue",
        },
      ],
    };
    persistIncidents(readIncidents().map((item) => item.id === next.id ? next : item));
    setIncident(next);
    setSubmitted(false);
    navigate(`/facility/incidents/${next.id}`);
  };
  const error = (value: string) => submitted && !value ? <span className="mt-1 block text-xs font-medium text-[#dc2626]">Vui lòng nhập thông tin này.</span> : null;

  return (
    <PublicShell>
      <main className="min-h-[calc(100dvh-160px)] bg-[#f8fafc] px-5 py-8 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <Link href="/facility/incidents" className="inline-flex items-center gap-2 text-sm font-bold text-[#176b53]" data-testid="link-back-facility-incidents"><ArrowLeft size={16} /> Thông báo cảnh báo</Link>
          <div className="mt-6 rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-sm sm:p-8">
            <div className="flex flex-col gap-3 border-b border-[#e2e8f0] pb-6 sm:flex-row sm:items-start sm:justify-between">
              <div><p className="font-mono text-xs font-bold tracking-[.08em] text-[#64748b]">{incident.code}</p><h1 className="mt-2 text-2xl font-extrabold text-[#143b35]">Nhà trường cập nhật thông tin sự cố</h1><p className="mt-2 text-sm text-[#64748b]">{incident.facility} · {incident.title}</p></div>
              <span className={`rounded-full px-3 py-1 text-xs font-bold ${incident.reviewStatus === "Yêu cầu bổ sung" ? "bg-[#fff7ed] text-[#c2410c]" : incident.reviewStatus === "Đã gửi" ? "bg-[#ecfdf5] text-[#047857]" : "bg-[#eff6ff] text-[#1e40af]"}`}>{incident.reviewStatus}</span>
            </div>
            {incident.supplementRequest && <div className="mt-6 rounded-xl border border-[#fed7aa] bg-[#fff7ed] p-4 text-sm leading-6 text-[#9a3412]" data-testid="notice-incident-supplement-request"><strong>Yêu cầu từ Sở:</strong> {incident.supplementRequest}</div>}
            <form onSubmit={submit} className="mt-8 space-y-7" data-testid="form-facility-incident-update">
              <section><h2 className="text-sm font-bold uppercase tracking-[.05em] text-[#1e293b]">Thông tin cập nhật thực tế</h2><div className="mt-4 grid gap-5 sm:grid-cols-2">
                <label className={designLabelClass}>Người cập nhật <span className="text-[#dc2626]">*</span><input value={form.contactName} onChange={(e) => update("contactName", e.target.value)} className={designInputClass} data-testid="input-facility-incident-contact" />{error(form.contactName)}</label>
                <label className={designLabelClass}>Chức vụ <span className="text-[#dc2626]">*</span><input value={form.contactRole} onChange={(e) => update("contactRole", e.target.value)} className={designInputClass} data-testid="input-facility-incident-role" />{error(form.contactRole)}</label>
                <label className={`${designLabelClass} sm:col-span-2`}>Triệu chứng / tình hình thực tế <span className="text-[#dc2626]">*</span><textarea value={form.symptoms} onChange={(e) => update("symptoms", e.target.value)} className={designAreaClass} data-testid="textarea-facility-incident-symptoms" />{error(form.symptoms)}</label>
                <label className={designLabelClass}>Số học sinh / người có triệu chứng <span className="text-[#dc2626]">*</span><input type="number" min="0" value={form.affectedStudents} onChange={(e) => update("affectedStudents", e.target.value)} className={designInputClass} data-testid="input-facility-incident-affected" />{error(form.affectedStudents)}</label>
                <label className={designLabelClass}>Món ăn đã khoanh vùng / truy xuất <span className="text-[#dc2626]">*</span><input value={form.tracedMeals} onChange={(e) => update("tracedMeals", e.target.value)} className={designInputClass} data-testid="input-facility-incident-meals" />{error(form.tracedMeals)}</label>
                <label className={`${designLabelClass} sm:col-span-2`}>Biện pháp nhà trường đã thực hiện <span className="text-[#dc2626]">*</span><textarea value={form.actionsTaken} onChange={(e) => update("actionsTaken", e.target.value)} className={designAreaClass} placeholder="Ví dụ: tạm dừng phục vụ, theo dõi sức khỏe học sinh..." data-testid="textarea-facility-incident-actions" />{error(form.actionsTaken)}</label>
                <label className={`${designLabelClass} sm:col-span-2`}>Tình trạng mẫu lưu / truy xuất hồ sơ <span className="text-[#dc2626]">*</span><textarea value={form.sampleHandling} onChange={(e) => update("sampleHandling", e.target.value)} className={designAreaClass} placeholder="Mô tả việc niêm phong, bảo quản và bàn giao mẫu lưu..." data-testid="textarea-facility-incident-samples" />{error(form.sampleHandling)}</label>
                <label className={`${designLabelClass} sm:col-span-2`}>Ghi chú thêm<textarea value={form.notes} onChange={(e) => update("notes", e.target.value)} className={designAreaClass} data-testid="textarea-facility-incident-notes" /></label>
              </div></section>
              <section><h2 className="text-sm font-bold uppercase tracking-[.05em] text-[#1e293b]">Minh chứng / hình ảnh</h2><label className="mt-4 flex cursor-pointer items-center gap-3 rounded-xl border-2 border-dashed border-[#dbe5e1] bg-[#f8fafc] px-4 py-5 text-sm font-semibold text-[#176b53]"><UploadIcon /><span>Chọn ảnh hoặc tài liệu minh chứng</span><input type="file" accept={EVIDENCE_ACCEPT} multiple className="sr-only" onChange={(event) => { const selectedFiles = Array.from(event.target.files ?? []); const validationError = validateEvidenceFiles(selectedFiles); if (validationError) { window.alert(validationError); event.target.value = ""; return; } setFiles(selectedFiles.map((file) => file.name)); event.target.value = ""; }} data-testid="input-facility-incident-files" /></label><p className="mt-2 text-xs text-[#64748b]">PDF, JPG hoặc PNG · tối đa {EVIDENCE_MAX_SIZE_LABEL}/tệp.</p>{files.length > 0 && <div className="mt-3 flex flex-wrap gap-2">{files.map((file) => <span key={file} className="rounded-lg bg-[#eff6ff] px-3 py-2 text-xs font-semibold text-[#1e40af]">{file}</span>)}</div>}</section>
              <div className="flex flex-col-reverse gap-3 border-t border-[#e2e8f0] pt-6 sm:flex-row sm:justify-end"><Link href="/facility/incidents" className="inline-flex h-12 items-center justify-center rounded-xl border border-[#e2e8f0] px-7 text-sm font-bold text-[#64748b]">Hủy</Link><PrimaryButton type="submit" testId="button-submit-facility-incident-update"><Check size={17} /> Kiểm tra & gửi Sở</PrimaryButton></div>
            </form>
          </div>
        </div>
      </main>
    </PublicShell>
  );
}

function IncidentDetailPageLegacy() {
  const params = useParams<{ id: string }>();
  const [incident, setIncident] = useState<Incident | null>(() => readIncidents().find((item) => item.id === params.id) ?? null);

  const closeIncident = () => {
    if (!incident || incident.status === "Đã đóng") return;
    if (!window.confirm("Xác nhận đóng sự cố này?")) return;
    const closedAt = new Date().toISOString();
    const next = { ...incident, status: "Đã đóng" as IncidentStatus, closedAt, timeline: [...incident.timeline, { time: new Intl.DateTimeFormat("vi-VN", { hour: "2-digit", minute: "2-digit" }).format(new Date()), label: "Đã đóng sự cố", detail: "Cán bộ phụ trách xác nhận sự cố đã hoàn tất xử lý.", tone: "green" }] };
    setIncident(next);
    persistIncidents(readIncidents().map((item) => item.id === next.id ? next : item));
  };

  if (!incident) {
    return <PageFrame><div className="rounded-2xl border border-[#d7e2de] bg-white p-14 text-center"><CircleAlert className="mx-auto text-[#a33b27]" size={36} /><h1 className="mt-4 text-xl font-extrabold text-[#21453d]">Không tìm thấy sự cố</h1><p className="mt-2 text-sm text-[#83908c]">Sự cố có thể đã được xóa hoặc mã không còn hiệu lực.</p><Link href="/admin/inspections/incidents" className="mt-5 inline-flex text-sm font-bold text-[#176b53]" data-testid="link-back-missing-incident">Quay lại danh sách</Link></div></PageFrame>;
  }

  return (
    <PageFrame>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3"><Link href="/admin/inspections/incidents" className="focus-ring inline-flex items-center gap-2 text-sm font-bold text-[#176b53] hover:text-[#125943]" data-testid="link-back-incident-list"><ArrowLeft size={16} /> Danh sách sự cố</Link><span className="font-mono text-xs font-bold text-[#84928e]">{incident.code}</span></div>
      <div className="mb-7 flex flex-col gap-5 border-b border-[#dce5e3] pb-6 lg:flex-row lg:items-end lg:justify-between"><div><PageKicker>Hồ sơ sự cố / {incident.code}</PageKicker><h1 className="display-tight mt-2 max-w-4xl text-3xl font-extrabold tracking-[-.04em] text-[#143b35] md:text-[2.5rem]" data-testid="text-incident-detail-title">{incident.title}</h1><div className="mt-3 flex flex-wrap items-center gap-2"><span className={`rounded-full border px-2.5 py-1 text-xs font-bold ${severityClass(incident.severity)}`}>{incident.severity}</span><span className={`rounded-full border px-2.5 py-1 text-xs font-bold ${statusClass(incident.status)}`} data-testid="status-incident-detail">{incident.status}</span><span className="text-xs text-[#82908d]">Cập nhật lúc {formatDate(incident.reportedAt)}</span></div></div>{incident.status === "Đang xử lý" && <PrimaryButton variant="danger" onClick={closeIncident} testId="button-close-incident"><Check size={17} /> Đóng sự cố</PrimaryButton>}</div>
       <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-6">
          <section className="rounded-2xl border border-[#d7e2de] bg-white p-5 shadow-[0_10px_35px_rgba(21,64,53,.05)] sm:p-7"><div className="mb-5 flex items-center gap-3"><div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#e5f2eb] text-[#176b53]"><CircleAlert size={18} /></div><h2 className="font-extrabold text-[#21453d]">Tóm tắt sự cố</h2></div><dl className="grid gap-5 sm:grid-cols-2"><div><dt className="text-xs font-bold uppercase tracking-[.08em] text-[#84928e]">Cơ sở liên quan</dt><dd className="mt-1.5 flex gap-2 text-sm font-bold text-[#31534b]"><MapPin size={15} className="mt-0.5 text-[#176b53]" />{incident.facility}</dd><p className="ml-5 mt-1 text-xs text-[#84928e]">{incident.address}</p></div><div><dt className="text-xs font-bold uppercase tracking-[.08em] text-[#84928e]">Thời điểm xảy ra</dt><dd className="mt-1.5 flex items-center gap-2 text-sm font-bold text-[#31534b]"><Clock3 size={15} className="text-[#176b53]" />{formatDate(incident.occurredAt)}</dd></div><div><dt className="text-xs font-bold uppercase tracking-[.08em] text-[#84928e]">Người báo tin</dt><dd className="mt-1.5 flex items-center gap-2 text-sm font-bold text-[#31534b]"><UserRound size={15} className="text-[#176b53]" />{incident.reporter}</dd><p className="ml-6 mt-1 text-xs text-[#84928e]">{incident.phone}</p></div><div><dt className="text-xs font-bold uppercase tracking-[.08em] text-[#84928e]">Thực phẩm liên quan</dt><dd className="mt-1.5 text-sm font-bold text-[#31534b]">{incident.foods}</dd></div></dl><div className="mt-6 border-t border-[#edf1ef] pt-5"><p className="text-xs font-bold uppercase tracking-[.08em] text-[#84928e]">Mô tả tình huống</p><p className="mt-2 text-sm leading-7 text-[#4e625d]" data-testid="text-incident-description">{incident.description}</p></div><div className="mt-5 rounded-xl bg-[#f4f8f5] p-4"><p className="text-xs font-bold uppercase tracking-[.08em] text-[#638077]">Biện pháp đã thực hiện</p><p className="mt-2 text-sm leading-6 text-[#31534b]">{incident.response}</p></div></section>
          <section className="rounded-2xl border border-[#d7e2de] bg-white p-5 shadow-[0_10px_35px_rgba(21,64,53,.05)] sm:p-7"><h2 className="font-extrabold text-[#21453d]">Dòng thời gian xử lý</h2><div className="mt-5 space-y-0">{incident.timeline.map((entry, index) => <div key={`${entry.time}-${entry.label}`} className="relative flex gap-4 pb-6 last:pb-0" data-testid={`timeline-incident-${index}`}><div className="relative z-10 mt-1 h-3 w-3 shrink-0 rounded-full border-2 border-white bg-[#176b53] shadow-[0_0_0_3px_#dcefe4]" />{index < incident.timeline.length - 1 && <div className="absolute bottom-0 left-[5px] top-4 w-px bg-[#c9ddd3]" />}<div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><p className="text-sm font-bold text-[#31534b]">{entry.label}</p><span className="font-mono text-[11px] text-[#8a9793]">{entry.time}</span></div><p className="mt-1 text-xs leading-5 text-[#83908c]">{entry.detail}</p></div></div>)}</div></section>
        </div>
        <aside className="space-y-6">
          <section className="rounded-2xl border border-[#d7e2de] bg-white p-5 shadow-[0_10px_35px_rgba(21,64,53,.05)]"><h2 className="font-extrabold text-[#21453d]">Tài liệu đính kèm</h2>{incident.attachments.length ? <div className="mt-4 space-y-2">{incident.attachments.map((file) => <div key={file} className="flex items-center gap-2 rounded-lg bg-[#f4f8f5] px-3 py-2.5 text-xs font-semibold text-[#31534b]" data-testid={`attachment-incident-${file}`}><FileText size={15} className="shrink-0 text-[#176b53]" /><span className="truncate">{file}</span></div>)}</div> : <p className="mt-3 text-sm text-[#83908c]">Chưa có tài liệu đính kèm.</p>}</section>
          <section className="rounded-2xl border border-[#d7e2de] bg-white p-5 shadow-[0_10px_35px_rgba(21,64,53,.05)]"><h2 className="font-extrabold text-[#21453d]">Thông báo đã chọn</h2><div className="mt-4 space-y-3 text-sm">{incident.notifyFacility && <p className="flex items-center gap-2 text-[#31534b]"><Check size={15} className="text-[#176b53]" /> Cơ sở liên quan</p>}{incident.notifyDistrict && <p className="flex items-center gap-2 text-[#31534b]"><Check size={15} className="text-[#176b53]" /> Phòng Y tế quận, huyện</p>}{!incident.notifyFacility && !incident.notifyDistrict && <p className="text-[#83908c]">Không chọn thông báo bổ sung.</p>}</div></section>
          <div className="rounded-2xl border border-[#cbded4] bg-[#eef7f1] p-5"><div className="flex gap-3"><ShieldCheck size={19} className="shrink-0 text-[#176b53]" /><div><p className="text-sm font-extrabold text-[#21553d]">Quy trình được ghi nhận</p><p className="mt-1 text-xs leading-5 text-[#557469]">Mọi thay đổi trạng thái được lưu lại trong nhật ký xử lý của sự cố.</p></div></div></div>
        </aside>
      </div>
    </PageFrame>
  );
}