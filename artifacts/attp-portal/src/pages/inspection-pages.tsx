import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  ClipboardList,
  Clock3,
  Eye,
  FileText,
  Info,
  Plus,
  Upload,
  Save,
  Search,
  Settings2,
  SlidersHorizontal,
  Trash2,
  TriangleAlert,
  X,
  XCircle,
} from "lucide-react";
import { Link } from "wouter";
import {
  AdminShell,
  EmptyState,
  MetricCard,
  SectionHeading,
  StatusPill,
} from "@/components/portal-ui";
import { Button } from "@/components/ui/button";

type InspectionResult = "approved" | "warning" | "stopped";
type FacilityType =
  | "Đơn vị cung cấp thực phẩm"
  | "Đơn vị cung cấp thức ăn"
  | "Cơ sở giáo dục";

const facilityTypes: FacilityType[] = [
  "Đơn vị cung cấp thực phẩm",
  "Đơn vị cung cấp thức ăn",
  "Cơ sở giáo dục",
];

const facilitiesByType: Record<FacilityType, string[]> = {
  "Đơn vị cung cấp thực phẩm": [
    "Công ty TNHH Nông sản An Phú",
    "Hợp tác xã Rau sạch Củ Chi",
  ],
  "Đơn vị cung cấp thức ăn": [
    "Công ty Suất ăn Minh Tâm",
    "Bếp ăn tập thể An Phú",
  ],
  "Cơ sở giáo dục": [
    "Trường Tiểu học Lê Lợi",
    "Trường Tiểu học Thái Sơn",
    "Trường Mầm non Hoa Sen",
  ],
};

type InspectionSchedule = {
  id: string;
  date: string;
  time: string;
  facility: string;
  address: string;
  team: string;
  kind: "Định kỳ" | "Đột xuất";
  purpose: string;
  note?: string;
  facilityType?: FacilityType;
};

type InspectionMinute = {
  id: string;
  reference: string;
  facility: string;
  date: string;
  team: string;
  score: number;
  result: InspectionResult;
  note: string;
  findings: number;
  facilityType?: FacilityType;
  inspectionCount?: number;
  answers?: Record<string, InspectionAnswer>;
  signature?: string;
};

type InspectionCriterion = {
  id: string;
  category: string;
  name: string;
  description: string;
  weight: number;
  required: boolean;
};

type InspectionAnswer = {
  detail: string;
  score: number;
  evidence: string[];
};

const defaultCriteria: InspectionCriterion[] = [
  {
    id: "staff",
    category: "Nhân lực",
    name: "Có cán bộ phụ trách an toàn thực phẩm",
    description: "Có quyết định phân công và hồ sơ năng lực còn hiệu lực.",
    weight: 15,
    required: true,
  },
  {
    id: "certificate",
    category: "Nhân lực",
    name: "Bằng cấp / chứng chỉ tập huấn ATTP",
    description: "Nhân sự trực tiếp chế biến được tập huấn theo quy định.",
    weight: 10,
    required: false,
  },
  {
    id: "kitchen",
    category: "Cơ sở vật chất",
    name: "Khu vực chế biến một chiều",
    description: "Bố trí tách biệt, sạch, không giao cắt giữa thực phẩm sống và chín.",
    weight: 20,
    required: true,
  },
  {
    id: "fridge",
    category: "Trang thiết bị",
    name: "Tủ lạnh / thiết bị bảo quản đạt yêu cầu",
    description: "Có theo dõi nhiệt độ và phân khu bảo quản phù hợp.",
    weight: 15,
    required: true,
  },
  {
    id: "sample",
    category: "Trang thiết bị",
    name: "Hệ thống lưu mẫu thức ăn",
    description: "Lưu mẫu đủ thời gian, có sổ theo dõi và dụng cụ riêng.",
    weight: 20,
    required: true,
  },
  {
    id: "gloves",
    category: "Vệ sinh",
    name: "Găng tay và trang phục bảo hộ",
    description: "Có sẵn, sử dụng đúng cách, thay mới khi cần thiết.",
    weight: 10,
    required: false,
  },
  {
    id: "records",
    category: "Hồ sơ",
    name: "Sổ kiểm thực ba bước đầy đủ",
    description: "Ghi chép đầy đủ, trung thực và có thể truy xuất.",
    weight: 10,
    required: false,
  },
];

const initialSchedules: InspectionSchedule[] = [
  {
    id: "schedule-1",
    date: "2026-09-08",
    time: "08:30",
    facility: "Trường Tiểu học Thái Sơn",
    address: "12 Nguyễn Trãi, Phường Minh Khai",
    team: "Tổ ATTP số 01",
    kind: "Định kỳ",
    purpose: "Kiểm tra định kỳ quý III",
  },
  {
    id: "schedule-2",
    date: "2026-09-15",
    time: "09:00",
    facility: "Trường Tiểu học Lê Lợi",
    address: "85 Lê Lợi, Phường Bến Nghé",
    team: "Tổ ATTP số 02",
    kind: "Định kỳ",
    purpose: "Kiểm tra điều kiện bếp ăn",
  },
  {
    id: "schedule-3",
    date: "2026-09-22",
    time: "14:00",
    facility: "Công ty Suất ăn Minh Tâm",
    address: "Khu công nghiệp Tân Bình",
    team: "Tổ ATTP số 03",
    kind: "Đột xuất",
    purpose: "Xác minh phản ánh của cơ sở",
  },
  {
    id: "schedule-4",
    date: "2026-09-24",
    time: "08:00",
    facility: "Trường Mầm non Hoa Sen",
    address: "35 Nguyễn Du, Quận 1",
    team: "Tổ ATTP số 01",
    kind: "Định kỳ",
    purpose: "Đánh giá lại sau khắc phục",
  },
  {
    id: "schedule-5",
    date: "2026-09-29",
    time: "08:30",
    facility: "Bếp ăn tập thể An Phú",
    address: "184 Nguyễn Văn Linh, Quận 7",
    team: "Tổ ATTP số 02",
    kind: "Định kỳ",
    purpose: "Kiểm tra điều kiện ATTP",
  },
];

const initialMinutes: InspectionMinute[] = [
  {
    id: "minute-1",
    reference: "BB-2026-021",
    facility: "Trường Tiểu học Lê Lợi",
    date: "2026-09-16",
    team: "Tổ ATTP số 01",
    score: 100,
    result: "approved",
    note: "Đủ điều kiện an toàn thực phẩm.",
    findings: 0,
  },
  {
    id: "minute-2",
    reference: "BB-2026-020",
    facility: "Trường Mầm non Hoa Sen",
    date: "2026-09-10",
    team: "Tổ ATTP số 02",
    score: 86,
    result: "warning",
    note: "Cần khắc phục khu vực lưu mẫu và bổ sung hồ sơ tập huấn.",
    findings: 2,
  },
  {
    id: "minute-3",
    reference: "BB-2026-018",
    facility: "Bếp ăn tập thể An Phú",
    date: "2026-09-05",
    team: "Tổ ATTP số 03",
    score: 72,
    result: "stopped",
    note: "Không bảo đảm điều kiện bảo quản và kiểm thực ba bước.",
    findings: 4,
  },
];

const resultMeta: Record<
  InspectionResult,
  { label: string; description: string; className: string }
> = {
  approved: {
    label: "Đạt · PASS",
    description: "Đủ điều kiện, đáp ứng toàn bộ tiêu chí.",
    className: "bg-emerald-100 text-emerald-900",
  },
  warning: {
    label: "Cảnh cáo / tạm dừng",
    description: "Tạm dừng để khắc phục và đánh giá lại.",
    className: "bg-amber-100 text-amber-900",
  },
  stopped: {
    label: "Đình chỉ / dừng hoạt động",
    description: "Dừng hoạt động do không bảo đảm điều kiện ATTP.",
    className: "bg-red-100 text-red-900",
  },
};

function readStored<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const stored = window.localStorage.getItem(key);
    return stored ? (JSON.parse(stored) as T) : fallback;
  } catch {
    return fallback;
  }
}

function readCriteriaForType(type: FacilityType) {
  const byType = readStored<Partial<Record<FacilityType, InspectionCriterion[]>>>(
    "attp-inspection-criteria-by-type",
    {},
  );
  return (
    byType[type] ??
    readStored<InspectionCriterion[]>("attp-inspection-criteria", defaultCriteria)
  );
}

function createAnswerMap(
  criteria: InspectionCriterion[],
  minute?: InspectionMinute,
): Record<string, InspectionAnswer> {
  if (minute?.answers) return minute.answers;
  let remaining = minute
    ? Math.round(
        (criteria.reduce((total, item) => total + item.weight, 0) *
          minute.score) /
          100,
      )
    : criteria.reduce((total, item) => total + item.weight, 0);
  return Object.fromEntries(
    criteria.map((item) => {
      const score = Math.min(item.weight, Math.max(0, remaining));
      remaining -= score;
      return [item.id, { detail: "", score, evidence: [] }];
    }),
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(`${value}T00:00:00`));
}

function classifyScore(score: number): InspectionResult {
  return score === 100 ? "approved" : score >= 80 ? "warning" : "stopped";
}

function facilityTypeForName(name: string): FacilityType {
  if (facilitiesByType["Đơn vị cung cấp thực phẩm"].includes(name)) {
    return "Đơn vị cung cấp thực phẩm";
  }
  if (facilitiesByType["Đơn vị cung cấp thức ăn"].includes(name)) {
    return "Đơn vị cung cấp thức ăn";
  }
  return "Cơ sở giáo dục";
}

function ResultBadge({ result }: { result: InspectionResult }) {
  const meta = resultMeta[result];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-extrabold ${meta.className}`}
    >
      {result === "approved" ? (
        <CheckCircle2 size={14} />
      ) : result === "warning" ? (
        <TriangleAlert size={14} />
      ) : (
        <XCircle size={14} />
      )}
      {meta.label}
    </span>
  );
}

function Dialog({
  title,
  children,
  onClose,
  wide = false,
}: {
  title: string;
  children: ReactNode;
  onClose: () => void;
  wide?: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
      <div
        className={`max-h-[90vh] w-full overflow-y-auto rounded-3xl border border-border bg-card shadow-2xl ${wide ? "max-w-3xl" : "max-w-xl"}`}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-card px-6 py-5">
          <h2 className="text-xl font-extrabold">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="focus-ring rounded-xl p-2 text-muted-foreground hover:bg-secondary hover:text-foreground"
            aria-label="Đóng"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

function ScheduleForm({
  onClose,
  onSave,
}: {
  onClose: () => void;
  onSave: (schedule: InspectionSchedule) => void;
}) {
  const [form, setForm] = useState({
    facilityType: "Cơ sở giáo dục" as FacilityType,
    facility: "",
    date: "2026-09-30",
    time: "08:30",
    team: "Tổ ATTP số 01",
    address: "",
    kind: "Định kỳ" as InspectionSchedule["kind"],
    purpose: "Kiểm tra điều kiện an toàn thực phẩm",
    note: "",
  });
  const update = (key: keyof typeof form, value: string) =>
    setForm((current) => ({ ...current, [key]: value }));
  return (
    <Dialog title="Tạo lịch kiểm tra" onClose={onClose}>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-sm font-semibold">
          Loại kiểm tra
          <select
            value={form.kind}
            onChange={(event) =>
              update("kind", event.target.value as InspectionSchedule["kind"])
            }
            className="focus-ring mt-2 h-11 w-full rounded-xl border border-input bg-background px-3 font-normal"
          >
            <option>Định kỳ</option>
            <option>Đột xuất</option>
          </select>
        </label>
        <label className="text-sm font-semibold">
          Loại cơ sở <span className="text-destructive">*</span>
          <select
            value={form.facilityType}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                facilityType: event.target.value as FacilityType,
                facility: "",
              }))
            }
            className="focus-ring mt-2 h-11 w-full rounded-xl border border-input bg-background px-3 font-normal"
          >
            {facilityTypes.map((type) => (
              <option key={type}>{type}</option>
            ))}
          </select>
        </label>
        <label className="text-sm font-semibold">
          Tên cơ sở <span className="text-destructive">*</span>
          <select
            value={form.facility}
            onChange={(event) => update("facility", event.target.value)}
            className="focus-ring mt-2 h-11 w-full rounded-xl border border-input bg-background px-3 font-normal"
          >
            <option value="">Chọn tên cơ sở</option>
            {facilitiesByType[form.facilityType].map((facility) => (
              <option key={facility}>{facility}</option>
            ))}
          </select>
        </label>
        <label className="text-sm font-semibold">
          Ngày kiểm tra
          <input
            type="date"
            value={form.date}
            onChange={(event) => update("date", event.target.value)}
            className="focus-ring mt-2 h-11 w-full rounded-xl border border-input bg-background px-3 font-normal"
          />
        </label>
        <label className="text-sm font-semibold">
          Giờ bắt đầu
          <input
            type="time"
            value={form.time}
            onChange={(event) => update("time", event.target.value)}
            className="focus-ring mt-2 h-11 w-full rounded-xl border border-input bg-background px-3 font-normal"
          />
        </label>
        <label className="text-sm font-semibold">
          Tổ kiểm tra
          <select
            value={form.team}
            onChange={(event) => update("team", event.target.value)}
            className="focus-ring mt-2 h-11 w-full rounded-xl border border-input bg-background px-3 font-normal"
          >
            <option>Tổ ATTP số 01</option>
            <option>Tổ ATTP số 02</option>
            <option>Tổ ATTP số 03</option>
          </select>
        </label>
        <label className="text-sm font-semibold">
          Địa chỉ
          <input
            value={form.address}
            onChange={(event) => update("address", event.target.value)}
            placeholder="Số nhà, đường, phường"
            className="focus-ring mt-2 h-11 w-full rounded-xl border border-input bg-background px-3 font-normal"
          />
        </label>
        <label className="text-sm font-semibold sm:col-span-2">
          Mục đích
          <input
            value={form.purpose}
            onChange={(event) => update("purpose", event.target.value)}
            className="focus-ring mt-2 h-11 w-full rounded-xl border border-input bg-background px-3 font-normal"
          />
        </label>
        <label className="text-sm font-semibold sm:col-span-2">
          Ghi chú
          <textarea
            value={form.note}
            onChange={(event) => update("note", event.target.value)}
            className="focus-ring mt-2 min-h-24 w-full rounded-xl border border-input bg-background p-3 font-normal"
            placeholder="Nội dung cần lưu ý cho tổ kiểm tra..."
          />
        </label>
      </div>
      <div className="mt-6 flex justify-end gap-3 border-t border-border pt-5">
        <Button variant="outline" onClick={onClose} className="rounded-xl">
          Hủy
        </Button>
        <Button
          onClick={() => {
            if (!form.facility.trim()) return;
            onSave({ ...form, id: `schedule-${Date.now()}` });
          }}
          disabled={!form.facility.trim()}
          className="rounded-xl"
        >
          <Save size={16} /> Lưu lịch kiểm tra
        </Button>
      </div>
    </Dialog>
  );
}

export function InspectionSchedulePage() {
  const [month, setMonth] = useState(new Date(2026, 8, 1));
  const [schedules, setSchedules] = useState(() =>
    readStored("attp-inspection-schedules", initialSchedules),
  );
  const [createOpen, setCreateOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] =
    useState<InspectionSchedule | null>(null);
  useEffect(() => {
    window.localStorage.setItem(
      "attp-inspection-schedules",
      JSON.stringify(schedules),
    );
  }, [schedules]);
  const year = month.getFullYear();
  const monthIndex = month.getMonth();
  const monthLabel = new Intl.DateTimeFormat("vi-VN", {
    month: "long",
    year: "numeric",
  }).format(month);
  const firstDay = new Date(year, monthIndex, 1).getDay();
  const offset = firstDay === 0 ? 6 : firstDay - 1;
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const cells = Array.from({ length: Math.ceil((offset + daysInMonth) / 7) * 7 });
  const byDay = useMemo(
    () =>
      schedules.reduce<Record<string, InspectionSchedule[]>>((acc, item) => {
        (acc[item.date] ||= []).push(item);
        return acc;
      }, {}),
    [schedules],
  );
  const upcoming = schedules
    .filter((item) => item.date >= "2026-09-01")
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 3);
  return (
    <AdminShell>
      <div className="mx-auto max-w-7xl px-5 py-9 lg:px-10">
        <SectionHeading
          eyebrow="Thanh tra, kiểm tra"
          title="Lịch kiểm tra"
          description="Lập kế hoạch, phân công tổ kiểm tra và theo dõi các đợt làm việc tại cơ sở."
          action={
            <Button
              onClick={() => setCreateOpen(true)}
              className="rounded-xl bg-primary px-4 py-3 font-bold"
            >
              <Plus size={17} /> Tạo lịch kiểm tra
            </Button>
          }
        />
        <div className="grid gap-6 xl:grid-cols-[1fr_330px]">
          <section className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setMonth(new Date(year, monthIndex - 1, 1))}
                  className="focus-ring rounded-lg border border-border p-2 hover:bg-secondary"
                  aria-label="Tháng trước"
                >
                  <ChevronLeft size={17} />
                </button>
                <h2 className="min-w-40 text-center text-lg font-extrabold capitalize">
                  {monthLabel}
                </h2>
                <button
                  type="button"
                  onClick={() => setMonth(new Date(year, monthIndex + 1, 1))}
                  className="focus-ring rounded-lg border border-border p-2 hover:bg-secondary"
                  aria-label="Tháng sau"
                >
                  <ChevronRight size={17} />
                </button>
              </div>
              <div className="flex items-center gap-4 text-xs font-semibold text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <i className="h-2.5 w-2.5 rounded-full bg-sky-500" /> Định kỳ
                </span>
                <span className="flex items-center gap-1.5">
                  <i className="h-2.5 w-2.5 rounded-full bg-orange-500" /> Đột xuất
                </span>
              </div>
            </div>
            <div className="grid grid-cols-7 border-b border-border bg-secondary/40">
              {["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "CN"].map(
                (day) => (
                  <div
                    key={day}
                    className="px-2 py-3 text-center text-xs font-extrabold text-muted-foreground"
                  >
                    {day}
                  </div>
                ),
              )}
            </div>
            <div className="grid grid-cols-7">
              {cells.map((_, index) => {
                const day = index - offset + 1;
                const date =
                  day > 0 && day <= daysInMonth
                    ? `${year}-${String(monthIndex + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
                    : "";
                const items = date ? byDay[date] ?? [] : [];
                return (
                  <div
                    key={`${date}-${index}`}
                    className={`min-h-28 border-b border-r border-border p-2 ${!date ? "bg-secondary/20" : ""}`}
                  >
                    {date && (
                      <>
                        <span className="text-xs font-bold text-muted-foreground">
                          {day}
                        </span>
                        <div className="mt-2 space-y-1">
                          {items.map((item) => (
                            <div
                              key={item.id}
                              className={`rounded-lg border-l-2 px-2 py-1.5 text-[10px] font-bold leading-tight ${item.kind === "Đột xuất" ? "border-orange-500 bg-orange-50 text-orange-900" : "border-sky-500 bg-sky-50 text-sky-900"}`}
                            >
                              {item.kind === "Đột xuất" ? "ĐX" : "ĐK"}:{" "}
                              {item.facility.replace("Trường ", "")}
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
          <aside className="rounded-3xl border border-border bg-card shadow-sm">
            <div className="border-b border-border px-5 py-5">
              <p className="mono-label text-primary">LỊCH ĐÃ LẬP</p>
              <h2 className="mt-2 text-xl font-extrabold">Kiểm tra sắp tới</h2>
            </div>
            <div className="space-y-3 p-4">
              {upcoming.map((item) => (
                <div key={item.id} className="rounded-2xl border border-border p-4">
                  <div className="flex items-center justify-between gap-3">
                    <span
                      className={`rounded-md px-2 py-1 text-[10px] font-extrabold ${item.kind === "Đột xuất" ? "bg-orange-100 text-orange-800" : "bg-sky-100 text-sky-800"}`}
                    >
                      {item.kind.toUpperCase()}
                    </span>
                    <span className="text-xs font-bold text-muted-foreground">
                      {formatDate(item.date)}
                    </span>
                  </div>
                  <h3 className="mt-3 font-extrabold">{item.facility}</h3>
                  <p className="mt-1 flex items-start gap-1.5 text-xs leading-5 text-muted-foreground">
                    <CalendarDays size={14} className="mt-0.5 shrink-0" />{" "}
                    {item.time} · {item.address}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs">
                    <span className="font-semibold text-muted-foreground">
                      {item.team}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          setSchedules((items) =>
                            items.filter((x) => x.id !== item.id),
                          )
                        }
                        className="rounded-lg border border-border px-3 py-2 font-bold text-foreground hover:bg-secondary"
                      >
                        Xóa
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedSchedule(item)}
                        className="rounded-lg bg-primary px-3 py-2 font-bold text-primary-foreground hover:bg-primary/90"
                      >
                        Chi tiết
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </div>
      {createOpen && (
        <ScheduleForm
          onClose={() => setCreateOpen(false)}
          onSave={(schedule) => {
            setSchedules((items) => [...items, schedule]);
            setCreateOpen(false);
          }}
        />
      )}
      {selectedSchedule && (
        <Dialog
          title="Chi tiết lịch kiểm tra"
          onClose={() => setSelectedSchedule(null)}
        >
          <div className="rounded-2xl border border-border bg-secondary/30 p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="mono-label text-primary">LỊCH CÔNG TÁC</p>
                <h3 className="mt-2 text-xl font-extrabold">
                  {selectedSchedule.facility}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {selectedSchedule.purpose}
                </p>
              </div>
              <span
                className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${
                  selectedSchedule.kind === "Đột xuất"
                    ? "bg-orange-100 text-orange-900"
                    : "bg-emerald-100 text-emerald-900"
                }`}
              >
                {selectedSchedule.kind}
              </span>
            </div>
          </div>
          <dl className="mt-6 grid gap-x-6 gap-y-5 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-extrabold">Ngày kiểm tra</dt>
              <dd className="mt-1 text-sm text-muted-foreground">
                {formatDate(selectedSchedule.date)}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-extrabold">Thời gian</dt>
              <dd className="mt-1 text-sm text-muted-foreground">
                {selectedSchedule.time}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-extrabold">Tổ kiểm tra</dt>
              <dd className="mt-1 text-sm text-muted-foreground">
                {selectedSchedule.team}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-extrabold">Trạng thái</dt>
              <dd className="mt-1 text-sm text-muted-foreground">Đã lên lịch</dd>
            </div>
          <div>
            <dt className="text-sm font-extrabold">Loại cơ sở</dt>
            <dd className="mt-1 text-sm text-muted-foreground">
              {selectedSchedule.facilityType ??
                facilityTypeForName(selectedSchedule.facility)}
            </dd>
          </div>
            <div>
              <dt className="text-sm font-extrabold">Địa điểm</dt>
              <dd className="mt-1 text-sm text-muted-foreground">
                {selectedSchedule.address || "Chưa cập nhật"}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-extrabold">Ghi chú</dt>
              <dd className="mt-1 text-sm text-muted-foreground">
                {selectedSchedule.note || "Không có ghi chú"}
              </dd>
            </div>
          </dl>
          <div className="mt-6 flex flex-wrap justify-end gap-3 border-t border-border pt-5">
            <Button
              variant="outline"
              onClick={() => setSelectedSchedule(null)}
              className="rounded-xl"
            >
              Đóng
            </Button>
            <Link
              href="/admin/inspections/minutes"
              onClick={() => setSelectedSchedule(null)}
              className="inline-flex h-10 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-bold text-primary-foreground hover:bg-primary/90"
            >
              <ClipboardCheck size={16} /> Biên bản kiểm tra
            </Link>
          </div>
        </Dialog>
      )}
    </AdminShell>
  );
}

function InspectionMinuteForm({
  onClose,
  onSave,
  initialMinute,
  readOnly = false,
}: {
  onClose: () => void;
  onSave: (minute: InspectionMinute) => void;
  initialMinute?: InspectionMinute;
  readOnly?: boolean;
}) {
  const initialFacilityType =
    initialMinute?.facilityType ??
    facilityTypeForName(initialMinute?.facility ?? "");
  const [facilityType, setFacilityType] =
    useState<FacilityType>(initialFacilityType);
  const [facility, setFacility] = useState(initialMinute?.facility ?? "");
  const [date, setDate] = useState(initialMinute?.date ?? "2026-09-30");
  const [team, setTeam] = useState(initialMinute?.team ?? "Tổ ATTP số 01");
  const [inspectionCount, setInspectionCount] = useState(
    initialMinute?.inspectionCount ?? 1,
  );
  const [criteria, setCriteria] = useState<InspectionCriterion[]>(() =>
    readCriteriaForType(facilityType),
  );
  const [answers, setAnswers] = useState<Record<string, InspectionAnswer>>(() =>
    createAnswerMap(criteria, initialMinute),
  );
  const [note, setNote] = useState(initialMinute?.note ?? "");
  const [signature, setSignature] = useState(initialMinute?.signature ?? "");
  const totalMax = criteria.reduce((total, item) => total + item.weight, 0);
  const totalScore = criteria.reduce(
    (total, item) => total + Math.min(answers[item.id]?.score ?? 0, item.weight),
    0,
  );
  const score =
    totalMax > 0 ? Math.round((totalScore / totalMax) * 100) : 0;
  const result = classifyScore(score);
  const updateAnswer = (
    id: string,
    patch: Partial<{ detail: string; score: number; evidence: string[] }>,
  ) =>
    setAnswers((current) => ({
      ...current,
      [id]: { ...current[id], ...patch },
    }));
  const changeFacilityType = (nextType: FacilityType) => {
    setFacilityType(nextType);
    setFacility("");
    const nextCriteria = readCriteriaForType(nextType);
    setCriteria(nextCriteria);
    setAnswers(createAnswerMap(nextCriteria));
  };
  return (
    <Dialog
      title={
        initialMinute
          ? `Chi tiết ${initialMinute.reference}`
          : "Tạo biên bản kiểm tra"
      }
      onClose={onClose}
      wide
    >
      <div className="mb-6 rounded-2xl border border-border bg-secondary/20 p-4">
        <p className="mono-label text-primary">BƯỚC 1 · XÁC ĐỊNH HỒ SƠ</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Chọn loại cơ sở để hiển thị đúng danh sách và bộ nội dung kiểm tra.
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-semibold">
            Loại cơ sở <span className="text-destructive">*</span>
            <select
              value={facilityType}
              onChange={(event) =>
                changeFacilityType(event.target.value as FacilityType)
              }
              disabled={readOnly}
              className="focus-ring mt-2 h-11 w-full rounded-xl border border-input bg-background px-3 font-normal"
            >
              {facilityTypes.map((type) => (
                <option key={type}>{type}</option>
              ))}
            </select>
          </label>
          <label className="text-sm font-semibold">
            Tên đơn vị / cơ sở <span className="text-destructive">*</span>
            <select
              value={facility}
              onChange={(event) => setFacility(event.target.value)}
              disabled={readOnly}
              className="focus-ring mt-2 h-11 w-full rounded-xl border border-input bg-background px-3 font-normal"
            >
              <option value="">Chọn tên đơn vị / cơ sở</option>
              {facilitiesByType[facilityType].map((name) => (
                <option key={name}>{name}</option>
              ))}
            </select>
          </label>
          <label className="text-sm font-semibold">
            Ngày lập <span className="text-destructive">*</span>
            <input
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
              disabled={readOnly}
              className="focus-ring mt-2 h-11 w-full rounded-xl border border-input bg-background px-3 font-normal"
            />
          </label>
          <label className="text-sm font-semibold">
            Loại kiểm tra
            <select
              name="inspectionType"
              defaultValue="DINH_KY"
              disabled={readOnly}
              className="focus-ring mt-2 h-11 w-full rounded-xl border border-input bg-background px-3 font-normal"
            >
              <option value="DINH_KY">Định kỳ</option>
              <option value="DOT_XUAT">Đột xuất</option>
            </select>
          </label>
          <label className="text-sm font-semibold sm:col-span-2">
            Tổ kiểm tra <span className="text-destructive">*</span>
            <input
              value={team}
              onChange={(event) => setTeam(event.target.value)}
              disabled={readOnly}
              placeholder="Nhập tên tổ kiểm tra"
            className="focus-ring mt-2 h-11 w-full rounded-xl border border-input bg-background px-3 font-normal"
            />
          </label>
        </div>
      </div>
      <div className="rounded-2xl border border-border">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-secondary/40 px-4 py-4">
          <div>
            <p className="mono-label text-primary">BƯỚC 2 · NỘI DUNG KIỂM TRA</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Nội dung lấy từ bộ tiêu chí đã cấu hình cho hệ thống.
            </p>
          </div>
          <span className="rounded-xl bg-primary px-3 py-2 font-mono text-xl font-extrabold text-primary-foreground">
            {totalScore}/{totalMax} điểm
          </span>
        </div>
        <div className="border-b border-border bg-primary/5 px-4 py-4 text-sm">
          <div className="flex items-start gap-2">
            <Info className="mt-0.5 shrink-0 text-primary" size={17} />
            <div>
              <p className="font-extrabold text-primary">Cách tính điểm (%)</p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                Mỗi tiêu chí có một mức điểm tối đa theo trọng số. Điểm nhập
                thực tế của tiêu chí nằm trong khoảng từ 0 đến mức tối đa đó.
              </p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                <strong className="text-foreground">Tỷ lệ đạt</strong> = Tổng
                điểm thực tế ÷ Tổng điểm tối đa × 100.
              </p>
              <div className="mt-3 grid gap-2 text-xs sm:grid-cols-3">
                <span className="rounded-lg bg-emerald-50 px-3 py-2 text-emerald-800">
                  <strong>100%</strong> · Đạt
                </span>
                <span className="rounded-lg bg-amber-50 px-3 py-2 text-amber-800">
                  <strong>80–99%</strong> · Cần xem xét
                </span>
                <span className="rounded-lg bg-red-50 px-3 py-2 text-red-800">
                  <strong>Dưới 80%</strong> · Không đạt
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="space-y-3 bg-secondary/20 p-3">
          {criteria.map((item, index) => {
            const answer = answers[item.id] ?? {
              detail: "",
              score: 0,
              evidence: [],
            };
            return (
            <div
              key={item.id}
              className="rounded-2xl border border-border bg-card p-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-[11px] font-extrabold uppercase tracking-wide text-primary">
                    {index + 1}. {item.category}
                  </p>
                  <h3 className="mt-1 text-sm font-extrabold">{item.name}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {item.description}
                  </p>
                </div>
                <span className="rounded-lg bg-primary/10 px-2.5 py-1 font-mono text-xs font-extrabold text-primary">
                  Tối đa {item.weight} điểm
                </span>
              </div>
              <div className="mt-4 grid gap-3 lg:grid-cols-[1fr_150px]">
                <label className="text-xs font-bold">
                  Chi tiết nội dung kiểm tra
                  <textarea
                    value={answer.detail}
                    onChange={(event) =>
                      updateAnswer(item.id, { detail: event.target.value })
                    }
                    disabled={readOnly}
                    placeholder="Nhập nhận xét, kết quả kiểm tra thực tế..."
                    className="focus-ring mt-2 min-h-20 w-full rounded-xl border border-input bg-background p-3 text-sm font-normal"
                  />
                </label>
                <label className="text-xs font-bold">
                  Điểm đánh giá
                  <div className="mt-2 flex items-center gap-2">
                    <input
                      type="number"
                      min="0"
                      max={item.weight}
                      value={answer.score}
                      onChange={(event) =>
                        updateAnswer(item.id, {
                          score: Math.max(
                            0,
                            Math.min(item.weight, Number(event.target.value) || 0),
                          ),
                        })
                      }
                      disabled={readOnly}
                      className="focus-ring h-11 w-full rounded-xl border border-input bg-background px-3 font-mono text-sm font-bold"
                    />
                    <span className="shrink-0 text-muted-foreground">
                      / {item.weight}
                    </span>
                  </div>
                </label>
              </div>
              <label className={`mt-3 inline-flex items-center gap-2 rounded-xl border border-dashed border-primary/40 bg-primary/5 px-3 py-2 text-xs font-bold text-primary ${readOnly ? "opacity-60" : "cursor-pointer hover:bg-primary/10"}`}>
                <Upload size={15} /> Upload hình ảnh, tài liệu minh chứng
                <input
                  type="file"
                  multiple
                  accept="image/*,.pdf,.doc,.docx"
                  className="sr-only"
                  disabled={readOnly}
                  onChange={(event) =>
                    updateAnswer(item.id, {
                      evidence: Array.from(event.target.files ?? []).map(
                        (file) => file.name,
                      ),
                    })
                  }
                />
              </label>
              {answer.evidence.length > 0 && (
                <p className="mt-2 text-xs text-muted-foreground">
                  Minh chứng: {answer.evidence.join(", ")}
                </p>
              )}
            </div>
            );
          })}
        </div>
      </div>
      <div className={`mt-5 rounded-2xl p-4 ${resultMeta[result].className}`}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-wider">KẾT LUẬN</p>
            <p className="mt-1 text-lg font-extrabold">
              {resultMeta[result].label}
            </p>
            <p className="mt-1 max-w-2xl text-xs">{resultMeta[result].description}</p>
          </div>
          <p className="font-mono text-3xl font-extrabold">{score}/100</p>
        </div>
      </div>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-semibold">
          Ghi nhận / kiến nghị khắc phục
          <textarea
            value={note}
            onChange={(event) => setNote(event.target.value)}
            disabled={readOnly}
            placeholder="Nội dung chưa đạt, thời hạn khắc phục..."
            className="focus-ring mt-2 min-h-24 w-full rounded-xl border border-input bg-background p-3 font-normal"
          />
        </label>
        <label className="block text-sm font-semibold">
          Chữ ký tay
          <textarea
            value={signature}
            onChange={(event) => setSignature(event.target.value)}
            disabled={readOnly}
            placeholder="Ký tên tại đây"
            className="focus-ring mt-2 min-h-24 w-full rounded-xl border border-input bg-background p-3 font-[cursive] text-lg font-normal"
          />
          <span className="mt-1 block text-xs font-normal text-muted-foreground">
            Có thể ký trực tiếp hoặc nhập tên người lập biên bản.
          </span>
        </label>
      </div>
      <div className="mt-6 flex justify-end gap-3 border-t border-border pt-5">
        <Button variant="outline" onClick={onClose} className="rounded-xl">
          {readOnly ? "Đóng" : "Hủy bỏ"}
        </Button>
        {!readOnly && <Button
          onClick={() => {
            if (!facility.trim()) return;
            onSave({
              id: initialMinute?.id ?? `minute-${Date.now()}`,
              reference:
                initialMinute?.reference ??
                `BB-2026-${String(initialMinutes.length + 20).padStart(3, "0")}`,
              facility,
              date,
              team,
              score,
              result,
              note: note || resultMeta[result].description,
              findings: criteria.filter(
                (item) => (answers[item.id]?.score ?? 0) < item.weight,
              ).length,
              facilityType,
              inspectionCount,
              answers,
              signature,
            });
          }}
          disabled={!facility.trim() || !team.trim()}
          className="rounded-xl"
        >
          <Save size={16} />{" "}
          {initialMinute ? "Lưu cập nhật biên bản" : "Lưu & hoàn tất biên bản"}
        </Button>}
      </div>
    </Dialog>
  );
}

export function InspectionMinutesPage() {
  const [minutes, setMinutes] = useState(() =>
    readStored("attp-inspection-minutes", initialMinutes),
  );
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"all" | InspectionResult>("all");
  const [createOpen, setCreateOpen] = useState(false);
  const [selected, setSelected] = useState<InspectionMinute | null>(null);
  useEffect(() => {
    window.localStorage.setItem("attp-inspection-minutes", JSON.stringify(minutes));
  }, [minutes]);
  const filtered = minutes.filter(
    (item) =>
      (status === "all" || item.result === status) &&
      `${item.reference} ${item.facility} ${item.team}`
        .toLowerCase()
        .includes(search.toLowerCase()),
  );
  return (
    <AdminShell>
      <div className="mx-auto max-w-7xl px-5 py-9 lg:px-10">
        <SectionHeading
          eyebrow="Thanh tra, kiểm tra"
          title="Biên bản kiểm tra"
          description="Ghi nhận nội dung kiểm tra, chấm điểm theo bộ tiêu chí và ban hành kết luận."
          action={
            <Button onClick={() => setCreateOpen(true)} className="rounded-xl">
              <Plus size={17} /> Tạo biên bản
            </Button>
          }
        />
        <div className="grid gap-4 md:grid-cols-3">
          <MetricCard
            label="Tổng biên bản"
            value={minutes.length}
            icon={ClipboardList}
            tone="green"
          />
          <MetricCard
            label="Đạt · PASS"
            value={minutes.filter((item) => item.result === "approved").length}
            icon={CheckCircle2}
            tone="blue"
          />
          <MetricCard
            label="Cần xử lý"
            value={minutes.filter((item) => item.result !== "approved").length}
            icon={TriangleAlert}
            tone="orange"
          />
        </div>
        <div className="mt-8 overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
          <div className="flex flex-col gap-3 border-b border-border p-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative max-w-md flex-1">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Tìm cơ sở, mã biên bản..."
                className="focus-ring h-11 w-full rounded-xl border border-input bg-background pl-9 pr-3 text-sm"
              />
            </div>
            <select
              value={status}
              onChange={(event) =>
                setStatus(event.target.value as "all" | InspectionResult)
              }
              className="focus-ring h-11 rounded-xl border border-input bg-background px-3 text-sm font-semibold"
            >
              <option value="all">Tất cả kết luận</option>
              <option value="approved">Đạt · PASS</option>
              <option value="warning">Cảnh cáo / tạm dừng</option>
              <option value="stopped">Đình chỉ / dừng hoạt động</option>
            </select>
          </div>
          {filtered.length ? (
            <div className="divide-y divide-border">
              {filtered.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col gap-4 px-5 py-5 lg:flex-row lg:items-center lg:justify-between"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="font-mono text-xs font-bold text-muted-foreground">
                        {item.reference}
                      </span>
                      <ResultBadge result={item.result} />
                    </div>
                    <h3 className="mt-2 text-base font-extrabold">
                      {item.facility}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {formatDate(item.date)} · {item.team} · {item.findings} tiêu
                      chí chưa đạt
                    </p>
                    <p className="mt-2 text-sm text-muted-foreground">{item.note}</p>
                  </div>
                  <div className="flex items-center justify-between gap-5 lg:justify-end">
                    <div className="text-right">
                      <p className="text-xs font-semibold text-muted-foreground">
                        Điểm đánh giá
                      </p>
                      <p className="font-mono text-2xl font-extrabold text-primary">
                        {item.score}%
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => setSelected(item)}
                      className="rounded-xl"
                    >
                      <Eye size={16} /> Chi tiết
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              title="Không có biên bản phù hợp"
              description="Thử thay đổi từ khóa hoặc bộ lọc kết luận."
            />
          )}
        </div>
      </div>
      {createOpen && (
        <InspectionMinuteForm
          onClose={() => setCreateOpen(false)}
          onSave={(minute) => {
            setMinutes((items) => [minute, ...items]);
            setCreateOpen(false);
          }}
        />
      )}
      {selected && (
        <InspectionMinuteForm
          initialMinute={selected}
          readOnly={selected.result === "approved"}
          onClose={() => setSelected(null)}
          onSave={(updatedMinute) => {
            setMinutes((items) =>
              items.map((item) =>
                item.id === updatedMinute.id ? updatedMinute : item,
              ),
            );
            setSelected(null);
          }}
        />
      )}
    </AdminShell>
  );
}

function CriteriaEditor({
  items,
  onChange,
  onDelete,
}: {
  items: InspectionCriterion[];
  onChange: (id: string, patch: Partial<InspectionCriterion>) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
      <div className="grid grid-cols-[1fr_100px_48px] gap-4 border-b border-border bg-secondary/40 px-5 py-3 text-xs font-extrabold uppercase tracking-wide text-muted-foreground">
        <span>Tiêu chí đánh giá</span>
        <span>Trọng số</span>
        <span />
      </div>
      <div className="divide-y divide-border">
        {items.map((item) => (
          <div
            key={item.id}
            className="grid gap-3 px-5 py-4 md:grid-cols-[1fr_170px_100px_48px] md:items-center"
          >
            <div>
              <input
                value={item.name}
                onChange={(event) => onChange(item.id, { name: event.target.value })}
                className="focus-ring h-10 w-full rounded-lg border border-input bg-background px-3 text-sm font-bold"
              />
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <input
                  value={item.category}
                  onChange={(event) =>
                    onChange(item.id, { category: event.target.value })
                  }
                  className="focus-ring h-8 rounded-md border border-input bg-background px-2 text-xs"
                  aria-label={`Nhóm của ${item.name}`}
                />
                {item.required && (
                  <span className="rounded-full bg-red-100 px-2 py-1 text-[10px] font-bold text-red-800">
                    Tiêu chí trọng yếu
                  </span>
                )}
              </div>
            </div>
            <input
              type="number"
              min="0"
              max="100"
              value={item.weight}
              onChange={(event) =>
                onChange(item.id, { weight: Number(event.target.value) })
              }
              className="focus-ring h-10 rounded-lg border border-input bg-background px-3 font-mono text-sm font-bold"
              aria-label={`Trọng số ${item.name}`}
            />
            <label className="flex items-center gap-2 text-xs font-semibold">
              <input
                type="checkbox"
                checked={item.required}
                onChange={(event) =>
                  onChange(item.id, { required: event.target.checked })
                }
                className="h-4 w-4 accent-primary"
              />
              Bắt buộc
            </label>
            <button
              type="button"
              onClick={() => onDelete(item.id)}
              className="focus-ring rounded-lg p-2 text-muted-foreground hover:bg-red-50 hover:text-red-700"
              aria-label={`Xóa ${item.name}`}
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export function InspectionCriteriaPage() {
  const [facilityType, setFacilityType] =
    useState<FacilityType>("Cơ sở giáo dục");
  const [criteriaByType, setCriteriaByType] = useState<
    Partial<Record<FacilityType, InspectionCriterion[]>>
  >(() => {
    const shared = readStored<InspectionCriterion[]>(
      "attp-inspection-criteria",
      defaultCriteria,
    );
    return readStored("attp-inspection-criteria-by-type", {
      "Đơn vị cung cấp thực phẩm": shared,
      "Đơn vị cung cấp thức ăn": shared,
      "Cơ sở giáo dục": shared,
    });
  });
  const items = criteriaByType[facilityType] ?? defaultCriteria;
  const [saved, setSaved] = useState(false);
  useEffect(() => {
    window.localStorage.setItem(
      "attp-inspection-criteria-by-type",
      JSON.stringify(criteriaByType),
    );
  }, [criteriaByType]);
  const total = items.reduce((sum, item) => sum + (Number(item.weight) || 0), 0);
  const groups = Array.from(new Set(items.map((item) => item.category)));
  const update = (id: string, patch: Partial<InspectionCriterion>) => {
    setSaved(false);
    setCriteriaByType((current) => ({
      ...current,
      [facilityType]: items.map((item) =>
        item.id === id ? { ...item, ...patch } : item,
      ),
    }));
  };
  const add = () => {
    setSaved(false);
    setCriteriaByType((current) => ({
      ...current,
      [facilityType]: [
        ...items,
        {
          id: `criterion-${Date.now()}`,
          category: "Nhóm mới",
          name: "Tiêu chí mới",
          description: "Mô tả tiêu chí cần kiểm tra.",
          weight: 0,
          required: false,
        },
      ],
    }));
  };
  return (
    <AdminShell>
      <div className="mx-auto max-w-7xl px-5 py-9 lg:px-10">
        <SectionHeading
          eyebrow="Thanh tra, kiểm tra"
          title="Cấu hình tiêu chí đánh giá"
           description="Thiết lập bộ nội dung và trọng số riêng cho từng loại cơ sở."
          action={
            <Button onClick={add} variant="outline" className="rounded-xl">
              <Plus size={17} /> Thêm tiêu chí
            </Button>
          }
        />
        <div className="grid gap-6 xl:grid-cols-[1fr_340px]">
          <div>
            <div className="mb-5 flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-extrabold">Bộ tiêu chí đang chỉnh sửa</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Phiên bản dự thảo · cập nhật lần cuối hôm nay bởi cán bộ quản trị
                </p>
              </div>
              <select
                value={facilityType}
                 onChange={(event) => {
                   setFacilityType(event.target.value as FacilityType);
                   setSaved(false);
                 }}
                className="focus-ring h-10 rounded-xl border border-input bg-background px-3 text-sm font-semibold"
              >
                <option>Cơ sở giáo dục</option>
                <option>Đơn vị cung cấp thực phẩm</option>
                 <option>Đơn vị cung cấp thức ăn</option>
              </select>
            </div>
            <CriteriaEditor
              items={items}
              onChange={update}
              onDelete={(id) => {
                setSaved(false);
                 setCriteriaByType((current) => ({
                   ...current,
                   [facilityType]: items.filter((item) => item.id !== id),
                 }));
              }}
            />
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-card p-4">
              <p className="text-sm text-muted-foreground">
                {items.length} tiêu chí · {groups.length} nhóm đánh giá
              </p>
              <Button
                onClick={() => setSaved(true)}
                disabled={total !== 100}
                className="rounded-xl"
              >
                <Save size={16} /> Lưu cấu hình
              </Button>
            </div>
            {saved && (
              <div className="mt-4 flex items-center gap-2 rounded-2xl bg-emerald-100 p-4 text-sm font-bold text-emerald-900">
                <CheckCircle2 size={18} /> Đã lưu cấu hình tiêu chí cho {facilityType}.
              </div>
            )}
          </div>
          <aside className="space-y-4">
            <div
              className={`rounded-3xl border p-5 ${total === 100 ? "border-emerald-200 bg-emerald-50" : "border-red-200 bg-red-50"}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-extrabold uppercase tracking-wider">
                    Tổng trọng số
                  </p>
                  <p className="mt-2 font-mono text-4xl font-extrabold">
                    {total}%
                  </p>
                </div>
                {total === 100 ? (
                  <CheckCircle2 className="text-emerald-700" />
                ) : (
                  <TriangleAlert className="text-red-700" />
                )}
              </div>
              <p className="mt-3 text-sm leading-6">
                {total === 100
                  ? "Cấu hình hợp lệ. Hệ thống có thể tự động tính điểm."
                  : "Tổng trọng số phải bằng đúng 100% mới được lưu cấu hình."}
              </p>
            </div>
            <div className="rounded-3xl border border-border bg-card p-5 shadow-sm">
              <div className="flex items-center gap-2">
                <Settings2 size={18} className="text-primary" />
                <h2 className="font-extrabold">Quy tắc xử lý tự động</h2>
              </div>
              <div className="mt-5 space-y-3">
                {[
                  ["100%", "Đạt · PASS", "bg-emerald-100 text-emerald-900"],
                  [
                    "80–99%",
                    "Cảnh cáo / tạm dừng",
                    "bg-amber-100 text-amber-900",
                  ],
                  [
                    "< 80%",
                    "Đình chỉ / dừng hoạt động",
                    "bg-red-100 text-red-900",
                  ],
                ].map(([range, label, className]) => (
                  <div
                    key={range}
                    className={`rounded-xl p-3 ${className}`}
                  >
                    <p className="font-mono text-sm font-extrabold">{range}</p>
                    <p className="mt-1 text-sm font-bold">{label}</p>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-xs leading-5 text-muted-foreground">
                Điểm được cộng từ các tiêu chí đạt trong biên bản. Kết quả được
                hiển thị tại báo cáo thống kê và cổng thông tin tra cứu.
              </p>
            </div>
            <div className="rounded-3xl border border-border bg-card p-5 shadow-sm">
              <div className="flex items-center gap-2">
                <FileText size={18} className="text-primary" />
                <h2 className="font-extrabold">Luồng áp dụng</h2>
              </div>
              <ol className="mt-4 space-y-3 text-sm">
                {[
                  "Admin cấu hình nhóm và trọng số",
                  "Cán bộ lập biên bản trên bộ tiêu chí hiện hành",
                  "Hệ thống tính % và đưa ra kết luận",
                  "Kết quả hiển thị ở báo cáo và portal",
                ].map((step, index) => (
                  <li key={step} className="flex gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-extrabold text-primary-foreground">
                      {index + 1}
                    </span>
                    <span className="pt-1 text-muted-foreground">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </aside>
        </div>
      </div>
    </AdminShell>
  );
}
