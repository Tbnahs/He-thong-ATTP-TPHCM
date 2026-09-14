import { useMemo, useState, type ChangeEvent, type FormEvent, type ReactNode } from "react";
import {
  ArrowLeft,
  Bell,
  Check,
  ChevronRight,
  CircleAlert,
  Clock3,
  FileText,
  Filter,
  MapPin,
  Paperclip,
  Plus,
  Search,
  ShieldCheck,
  Siren,
  Upload,
  UserRound,
  X,
} from "lucide-react";
import { Link, useLocation, useParams } from "wouter";
import { AdminShell } from "@/components/portal-ui";

type IncidentStatus = "Đang xử lý" | "Đã đóng";
type IncidentSeverity = "Khẩn cấp" | "Cao" | "Trung bình";

type Incident = {
  id: string;
  code: string;
  title: string;
  facility: string;
  address: string;
  occurredAt: string;
  reportedAt: string;
  reporter: string;
  phone: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
  description: string;
  response: string;
  foods: string;
  attachments: string[];
  notifyFacility: boolean;
  notifyDistrict: boolean;
  closedAt?: string;
  timeline: Array<{ time: string; label: string; detail: string; tone: string }>;
};

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
    timeline: [
      { time: "13:08", label: "Tiếp nhận cảnh báo", detail: "Cán bộ trực ban ghi nhận thông tin từ nhà trường.", tone: "amber" },
      { time: "13:21", label: "Phân công xử lý", detail: "Tổ ATTP số 02 được phân công xác minh tại hiện trường.", tone: "blue" },
      { time: "14:05", label: "Đã yêu cầu bảo toàn mẫu", detail: "Cơ sở xác nhận đã niêm phong thức ăn lưu mẫu.", tone: "green" },
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
    if (stored) return JSON.parse(stored) as Incident[];
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
      <div className="min-h-[calc(100dvh-73px)] bg-[#f5f7f8] px-4 py-6 sm:px-6 lg:px-10 lg:py-8">
        <div className="mx-auto max-w-[1420px]">{children}</div>
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
}: {
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  testId: string;
  variant?: "primary" | "quiet" | "danger";
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
      className={`focus-ring inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold shadow-sm transition-all hover:-translate-y-0.5 ${styles[variant]}`}
      data-testid={testId}
    >
      {children}
    </button>
  );
}

export function IncidentListPage() {
  const [, navigate] = useLocation();
  const [incidents] = useState<Incident[]>(readIncidents);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"Tất cả" | IncidentStatus>("Tất cả");
  const [severity, setSeverity] = useState<"Tất cả" | IncidentSeverity>("Tất cả");

  const filtered = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase("vi");
    return incidents.filter((item) => {
      const matchesQuery =
        !normalized ||
        [item.code, item.title, item.facility, item.address]
          .join(" ")
          .toLocaleLowerCase("vi")
          .includes(normalized);
      return (
        matchesQuery &&
        (status === "Tất cả" || item.status === status) &&
        (severity === "Tất cả" || item.severity === severity)
      );
    });
  }, [incidents, query, severity, status]);

  const activeCount = incidents.filter((item) => item.status === "Đang xử lý").length;
  const urgentCount = incidents.filter((item) => item.severity === "Khẩn cấp" && item.status === "Đang xử lý").length;

  return (
    <PageFrame>
      <TopBar
        title="Quản lý và xử lý sự cố ATTP"
        description="Tiếp nhận cảnh báo, điều phối xác minh và theo dõi khắc phục tại các cơ sở giáo dục trên địa bàn."
        action={
          <PrimaryButton onClick={() => navigate("/admin/inspections/incidents/new")} testId="button-create-incident">
            <Plus size={17} /> Cảnh báo ATTP
          </PrimaryButton>
        }
      />

      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-[#d7e2de] bg-white p-4 shadow-[0_8px_25px_rgba(21,64,53,.04)]">
          <p className="text-xs font-bold uppercase tracking-[.12em] text-[#71817d]">Tổng sự cố</p>
          <p className="mt-2 text-2xl font-extrabold text-[#143b35]" data-testid="metric-incident-total">{incidents.length}</p>
        </div>
        <div className="rounded-2xl border border-[#ebd8a5] bg-[#fff9e9] p-4 shadow-[0_8px_25px_rgba(115,85,15,.04)]">
          <p className="text-xs font-bold uppercase tracking-[.12em] text-[#917023]">Đang xử lý</p>
          <p className="mt-2 text-2xl font-extrabold text-[#805b05]" data-testid="metric-incident-active">{activeCount}</p>
        </div>
        <div className="rounded-2xl border border-[#f1c9bf] bg-[#fff3f0] p-4 shadow-[0_8px_25px_rgba(163,59,39,.04)]">
          <p className="text-xs font-bold uppercase tracking-[.12em] text-[#aa4c37]">Khẩn cấp cần chú ý</p>
          <p className="mt-2 text-2xl font-extrabold text-[#a33b27]" data-testid="metric-incident-urgent">{urgentCount}</p>
        </div>
      </div>

      <section className="overflow-hidden rounded-2xl border border-[#d7e2de] bg-white shadow-[0_10px_35px_rgba(21,64,53,.05)]" data-testid="panel-incident-list">
        <div className="flex flex-col gap-3 border-b border-[#e4ebe8] p-4 lg:flex-row lg:items-center">
          <label className="relative min-w-0 flex-1">
            <Search size={17} className="absolute left-3.5 top-3 text-[#82908d]" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Tìm theo mã, tên sự cố hoặc cơ sở..."
              className="focus-ring h-10 w-full rounded-xl border border-[#d4dfdb] bg-[#f9fbfa] pl-10 pr-3 text-sm outline-none transition-colors placeholder:text-[#9aa7a3] focus:border-[#176b53]"
              data-testid="input-incident-search"
            />
          </label>
          <div className="flex flex-wrap items-center gap-2">
            <Filter size={16} className="ml-1 text-[#71817d]" />
            <select value={status} onChange={(event) => setStatus(event.target.value as typeof status)} className="focus-ring h-10 rounded-xl border border-[#d4dfdb] bg-[#f9fbfa] px-3 text-sm font-semibold text-[#31534b]" data-testid="select-incident-status">
              <option>Tất cả</option><option>Đang xử lý</option><option>Đã đóng</option>
            </select>
            <select value={severity} onChange={(event) => setSeverity(event.target.value as typeof severity)} className="focus-ring h-10 rounded-xl border border-[#d4dfdb] bg-[#f9fbfa] px-3 text-sm font-semibold text-[#31534b]" data-testid="select-incident-severity">
              <option>Tất cả</option><option>Khẩn cấp</option><option>Cao</option><option>Trung bình</option>
            </select>
          </div>
        </div>
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[900px] text-left">
            <thead className="bg-[#f6f9f8] text-[11px] uppercase tracking-[.1em] text-[#71817d]">
              <tr><th className="px-5 py-3 font-extrabold">Mã sự cố</th><th className="px-5 py-3 font-extrabold">Thông tin sự cố</th><th className="px-5 py-3 font-extrabold">Cơ sở</th><th className="px-5 py-3 font-extrabold">Mức độ</th><th className="px-5 py-3 font-extrabold">Trạng thái</th><th className="px-5 py-3 text-right font-extrabold">Xem</th></tr>
            </thead>
            <tbody className="divide-y divide-[#edf1ef]">
              {filtered.map((item) => (
                <tr key={item.id} className="group transition-colors hover:bg-[#fbfcfb]" data-testid={`row-incident-${item.id}`}>
                  <td className="px-5 py-4 align-top"><span className="font-mono text-xs font-bold text-[#176b53]" data-testid={`text-incident-code-${item.id}`}>{item.code}</span><span className="mt-1 block text-xs text-[#8a9793]">{formatDate(item.reportedAt)}</span></td>
                  <td className="max-w-[300px] px-5 py-4 align-top"><p className="font-bold text-[#21453d]">{item.title}</p><p className="mt-1 line-clamp-2 text-xs leading-5 text-[#76837f]">{item.description}</p></td>
                  <td className="px-5 py-4 align-top"><p className="text-sm font-semibold text-[#31534b]">{item.facility}</p><p className="mt-1 flex items-start gap-1 text-xs text-[#8a9793]"><MapPin size={12} className="mt-0.5 shrink-0" />{item.address}</p></td>
                  <td className="px-5 py-4 align-top"><span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-bold ${severityClass(item.severity)}`}>{item.severity}</span></td>
                  <td className="px-5 py-4 align-top"><span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-bold ${statusClass(item.status)}`} data-testid={`status-incident-${item.id}`}>{item.status}</span></td>
                  <td className="px-5 py-4 text-right align-top"><Link href={`/admin/inspections/incidents/${item.id}`} className="focus-ring inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-sm font-bold text-[#176b53] transition-colors hover:bg-[#e9f3ee]" data-testid={`link-view-incident-${item.id}`}>Xem chi tiết <ChevronRight size={15} /></Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="divide-y divide-[#edf1ef] md:hidden">
          {filtered.map((item) => (
            <Link key={item.id} href={`/admin/inspections/incidents/${item.id}`} className="block p-4 transition-colors hover:bg-[#fbfcfb]" data-testid={`card-incident-${item.id}`}>
              <div className="flex items-start justify-between gap-3"><span className="font-mono text-xs font-bold text-[#176b53]">{item.code}</span><span className={`rounded-full border px-2 py-1 text-[11px] font-bold ${statusClass(item.status)}`}>{item.status}</span></div>
              <p className="mt-3 font-bold text-[#21453d]">{item.title}</p><p className="mt-2 text-xs font-semibold text-[#58706a]">{item.facility}</p>
              <div className="mt-3 flex items-center justify-between"><span className={`rounded-full border px-2 py-1 text-[11px] font-bold ${severityClass(item.severity)}`}>{item.severity}</span><span className="flex items-center gap-1 text-xs font-bold text-[#176b53]">Xem chi tiết <ChevronRight size={14} /></span></div>
            </Link>
          ))}
        </div>
        {filtered.length === 0 && <div className="p-14 text-center" data-testid="empty-incident-results"><CircleAlert className="mx-auto text-[#c6d3cf]" size={34} /><p className="mt-3 font-bold text-[#31534b]">Không tìm thấy sự cố phù hợp</p><p className="mt-1 text-sm text-[#81908b]">Thử thay đổi từ khóa hoặc bộ lọc đang chọn.</p></div>}
        <div className="border-t border-[#e4ebe8] px-5 py-3 text-xs text-[#7c8b86]">Hiển thị <strong className="text-[#31534b]">{filtered.length}</strong> trên {incidents.length} sự cố</div>
      </section>
    </PageFrame>
  );
}

const fieldClass = "focus-ring mt-1.5 h-11 w-full rounded-xl border border-[#d4dfdb] bg-[#fbfcfb] px-3.5 text-sm text-[#21453d] outline-none transition-colors placeholder:text-[#a1ada9] focus:border-[#176b53]";
const areaClass = "focus-ring mt-1.5 w-full rounded-xl border border-[#d4dfdb] bg-[#fbfcfb] px-3.5 py-3 text-sm leading-6 text-[#21453d] outline-none transition-colors placeholder:text-[#a1ada9] focus:border-[#176b53]";

export function IncidentCreatePage() {
  const [, navigate] = useLocation();
  const [files, setFiles] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    title: "",
    facility: "",
    occurredAt: "",
    severity: "Cao" as IncidentSeverity,
    reporter: "",
    phone: "",
    foods: "",
    description: "",
    response: "",
    notifyFacility: true,
    notifyDistrict: false,
  });

  const update = (key: string, value: string | boolean) => setForm((current) => ({ ...current, [key]: value }));
  const handleFiles = (event: ChangeEvent<HTMLInputElement>) => setFiles(Array.from(event.target.files ?? []).map((file) => file.name));
  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!form.title || !form.facility || !form.occurredAt || !form.description || !form.reporter) {
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
      facility: form.facility,
      address: "Chưa cập nhật địa chỉ",
      occurredAt: form.occurredAt,
      reportedAt: now,
      reporter: form.reporter,
      phone: form.phone,
      severity: form.severity,
      status: "Đang xử lý",
      description: form.description,
      response: form.response || "Chưa có biện pháp xử lý được ghi nhận.",
      foods: form.foods || "Chưa cập nhật",
      attachments: files,
      notifyFacility: form.notifyFacility,
      notifyDistrict: form.notifyDistrict,
      timeline: [{ time: new Intl.DateTimeFormat("vi-VN", { hour: "2-digit", minute: "2-digit" }).format(new Date()), label: "Tiếp nhận cảnh báo", detail: "Cảnh báo mới được tạo bởi cán bộ phụ trách.", tone: "amber" }],
    };
    persistIncidents([incident, ...current]);
    navigate(`/admin/inspections/incidents/${incident.id}`);
  };

  return (
    <PageFrame>
      <div className="mb-6"><Link href="/admin/inspections/incidents" className="focus-ring inline-flex items-center gap-2 text-sm font-bold text-[#176b53] hover:text-[#125943]" data-testid="link-back-incidents"><ArrowLeft size={16} /> Danh sách sự cố</Link></div>
      <TopBar title="Tạo cảnh báo sự cố" description="Ghi nhận nhanh thông tin ban đầu để kích hoạt quy trình xác minh và phối hợp xử lý." />
      <form onSubmit={submit} className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]" data-testid="form-create-incident">
        <div className="space-y-6">
          <section className="rounded-2xl border border-[#d7e2de] bg-white p-5 shadow-[0_10px_35px_rgba(21,64,53,.05)] sm:p-7">
            <div className="mb-5 flex items-start gap-3"><div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#e5f2eb] text-[#176b53]"><Siren size={18} /></div><div><h2 className="font-extrabold text-[#21453d]">Thông tin sự cố</h2><p className="mt-1 text-xs text-[#83908c]">Các trường có dấu <span className="text-[#a33b27]">*</span> là bắt buộc.</p></div></div>
            <div className="grid gap-5 md:grid-cols-2">
              <label className="md:col-span-2 text-sm font-bold text-[#31534b]">Tiêu đề sự cố <span className="text-[#a33b27]">*</span><input value={form.title} onChange={(e) => update("title", e.target.value)} className={fieldClass} placeholder="Ví dụ: Nghi ngờ ngộ độc sau bữa trưa" data-testid="input-incident-title" />{submitted && !form.title && <span className="mt-1 block text-xs font-medium text-[#a33b27]">Vui lòng nhập tiêu đề.</span>}</label>
              <label className="text-sm font-bold text-[#31534b]">Cơ sở liên quan <span className="text-[#a33b27]">*</span><select value={form.facility} onChange={(e) => update("facility", e.target.value)} className={fieldClass} data-testid="select-incident-facility"><option value="">Chọn cơ sở</option><option>Trường Tiểu học Lê Lợi</option><option>Trường Tiểu học Thái Sơn</option><option>Trường Mầm non Hoa Sen</option><option>Bếp ăn tập thể An Phú</option><option>Công ty Suất ăn Minh Tâm</option></select>{submitted && !form.facility && <span className="mt-1 block text-xs font-medium text-[#a33b27]">Vui lòng chọn cơ sở.</span>}</label>
              <label className="text-sm font-bold text-[#31534b]">Thời điểm xảy ra <span className="text-[#a33b27]">*</span><input type="datetime-local" value={form.occurredAt} onChange={(e) => update("occurredAt", e.target.value)} className={fieldClass} data-testid="input-incident-occurred-at" />{submitted && !form.occurredAt && <span className="mt-1 block text-xs font-medium text-[#a33b27]">Vui lòng chọn thời điểm.</span>}</label>
              <label className="text-sm font-bold text-[#31534b]">Mức độ ưu tiên<select value={form.severity} onChange={(e) => update("severity", e.target.value)} className={fieldClass} data-testid="select-incident-priority"><option>Khẩn cấp</option><option>Cao</option><option>Trung bình</option></select></label>
              <label className="text-sm font-bold text-[#31534b]">Người báo tin <span className="text-[#a33b27]">*</span><input value={form.reporter} onChange={(e) => update("reporter", e.target.value)} className={fieldClass} placeholder="Họ và tên" data-testid="input-incident-reporter" />{submitted && !form.reporter && <span className="mt-1 block text-xs font-medium text-[#a33b27]">Vui lòng nhập người báo tin.</span>}</label>
              <label className="text-sm font-bold text-[#31534b]">Số điện thoại<input value={form.phone} onChange={(e) => update("phone", e.target.value)} className={fieldClass} placeholder="0900 000 000" data-testid="input-incident-phone" /></label>
              <label className="text-sm font-bold text-[#31534b] md:col-span-2">Thực phẩm / món ăn liên quan<input value={form.foods} onChange={(e) => update("foods", e.target.value)} className={fieldClass} placeholder="Tên món ăn, nguyên liệu hoặc lô hàng..." data-testid="input-incident-foods" /></label>
              <label className="text-sm font-bold text-[#31534b] md:col-span-2">Mô tả tình huống <span className="text-[#a33b27]">*</span><textarea value={form.description} onChange={(e) => update("description", e.target.value)} rows={5} className={areaClass} placeholder="Mô tả ngắn gọn diễn biến, số người bị ảnh hưởng và thông tin đã xác minh..." data-testid="textarea-incident-description" />{submitted && !form.description && <span className="mt-1 block text-xs font-medium text-[#a33b27]">Vui lòng mô tả tình huống.</span>}</label>
              <label className="text-sm font-bold text-[#31534b] md:col-span-2">Biện pháp đã thực hiện<textarea value={form.response} onChange={(e) => update("response", e.target.value)} rows={3} className={areaClass} placeholder="Ví dụ: tạm dừng phục vụ, niêm phong mẫu lưu..." data-testid="textarea-incident-response" /></label>
            </div>
          </section>
          <section className="rounded-2xl border border-[#d7e2de] bg-white p-5 shadow-[0_10px_35px_rgba(21,64,53,.05)] sm:p-7">
            <div className="mb-4 flex items-center gap-3"><div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#eef3f2] text-[#176b53]"><Paperclip size={18} /></div><div><h2 className="font-extrabold text-[#21453d]">Tài liệu đính kèm</h2><p className="mt-1 text-xs text-[#83908c]">Đính kèm biên bản, hình ảnh hoặc tài liệu liên quan.</p></div></div>
            <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-[#b9cbc4] bg-[#f8fbf9] px-5 py-7 text-center transition-colors hover:border-[#176b53] hover:bg-[#f1f8f3]" data-testid="label-upload-incident-files"><UploadIcon /><span className="mt-2 text-sm font-bold text-[#31534b]">Chọn tệp từ máy tính</span><span className="mt-1 text-xs text-[#8a9793]">PDF, JPG, PNG · tối đa 10MB / tệp</span><input type="file" accept=".pdf,.jpg,.jpeg,.png" multiple className="sr-only" onChange={handleFiles} data-testid="input-incident-files" /></label>
            {files.length > 0 && <div className="mt-3 space-y-2">{files.map((file) => <div key={file} className="flex items-center justify-between rounded-lg bg-[#f1f7f3] px-3 py-2 text-xs font-semibold text-[#31534b]" data-testid={`file-incident-${file}`}><span className="flex items-center gap-2 truncate"><FileText size={14} />{file}</span><button type="button" onClick={() => setFiles((current) => current.filter((name) => name !== file))} className="focus-ring rounded p-1 text-[#7f918b] hover:text-[#a33b27]" aria-label={`Xóa tệp ${file}`} data-testid={`button-remove-file-${file}`}><X size={14} /></button></div>)}</div>}
          </section>
        </div>
        <aside className="space-y-6">
          <section className="rounded-2xl border border-[#d7e2de] bg-white p-5 shadow-[0_10px_35px_rgba(21,64,53,.05)]"><div className="flex items-center gap-3"><Bell size={18} className="text-[#176b53]" /><h2 className="font-extrabold text-[#21453d]">Thông báo xử lý</h2></div><p className="mt-2 text-xs leading-5 text-[#83908c]">Chọn các đầu mối cần nhận thông báo ngay khi cảnh báo được tạo.</p><div className="mt-5 space-y-3"><label className="flex cursor-pointer items-start gap-3 rounded-xl border border-[#e0e9e5] p-3 transition-colors hover:bg-[#f7faf8]"><input type="checkbox" checked={form.notifyFacility} onChange={(e) => update("notifyFacility", e.target.checked)} className="mt-0.5 h-4 w-4 accent-[#176b53]" data-testid="checkbox-notify-facility" /><span><strong className="block text-sm text-[#31534b]">Cơ sở liên quan</strong><span className="mt-1 block text-xs leading-5 text-[#83908c]">Người phụ trách ATTP tại cơ sở</span></span></label><label className="flex cursor-pointer items-start gap-3 rounded-xl border border-[#e0e9e5] p-3 transition-colors hover:bg-[#f7faf8]"><input type="checkbox" checked={form.notifyDistrict} onChange={(e) => update("notifyDistrict", e.target.checked)} className="mt-0.5 h-4 w-4 accent-[#176b53]" data-testid="checkbox-notify-district" /><span><strong className="block text-sm text-[#31534b]">Phòng Y tế quận, huyện</strong><span className="mt-1 block text-xs leading-5 text-[#83908c]">Đầu mối giám sát địa bàn</span></span></label></div></section>
          <div className="rounded-2xl border border-[#e6d39d] bg-[#fff9e9] p-5"><div className="flex gap-3"><ShieldCheck size={19} className="shrink-0 text-[#97731e]" /><p className="text-xs leading-5 text-[#70591e]">Sau khi gửi, sự cố sẽ ở trạng thái <strong>Đang xử lý</strong>. Cán bộ được phân công có thể cập nhật tiến độ và đóng sự cố tại trang chi tiết.</p></div></div>
          <div className="flex flex-col gap-2 sm:flex-row lg:flex-col"><PrimaryButton type="submit" testId="button-submit-incident"><Siren size={16} /> Gửi cảnh báo</PrimaryButton><Link href="/admin/inspections/incidents" className="focus-ring inline-flex items-center justify-center rounded-xl border border-[#cbdad5] bg-white px-4 py-2.5 text-sm font-bold text-[#31534b] transition-colors hover:border-[#176b53] hover:text-[#176b53]" data-testid="link-cancel-create-incident">Hủy bỏ</Link></div>
        </aside>
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