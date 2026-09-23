import { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Building2,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Database,
  FileCheck2,
  History,
  Link2,
  MapPin,
  PackageCheck,
  Search,
  ShieldAlert,
  Truck,
  Utensils,
} from "lucide-react";
import { Link, useParams } from "wouter";
import {
  AdminShell,
  EmptyState,
  MetricCard,
  SectionHeading,
  StatusPill,
} from "@/components/portal-ui";

type DeliveryKind = "Thức ăn" | "Nguyên liệu";

type DeliveryRecord = {
  id: string;
  date: string;
  kind: DeliveryKind;
  orderCode: string;
  partner: string;
  destination: string;
  quantity: string;
  status: "Đã nhận" | "Đã giao" | "Có sai lệch";
  sourceSystem: string;
};

type ViolationRecord = {
  id: string;
  date: string;
  type: string;
  severity: "Nhẹ" | "Trung bình" | "Nghiêm trọng";
  description: string;
  handling: string;
  status: "Đã khắc phục" | "Đang theo dõi";
  sourceSystem: string;
};

type FacilityProfile = {
  id: string;
  name: string;
  category: string;
  address: string;
  contact: string;
  taxCode: string;
  licenseNumber: string;
  approvedAt: string;
  reviewer: string;
  personInCharge: string;
  mealsPerDay: string;
  dataSource: "Cổng Sở" | "API bên ngoài";
  lastSyncedAt: string;
  connectedSystem: string;
  documents: string[];
  deliveries: DeliveryRecord[];
  violations: ViolationRecord[];
};

const facilityProfiles: FacilityProfile[] = [
  {
    id: "facility-001",
    name: "Trường Tiểu học Lê Lợi",
    category: "Cơ sở giáo dục",
    address: "85 Lê Lợi, phường Bến Nghé, TP. Hồ Chí Minh",
    contact: "028 3822 4567",
    taxCode: "0301123456",
    licenseNumber: "ATTP-HCM-2026-0018",
    approvedAt: "18/08/2026",
    reviewer: "Nguyễn Minh Anh",
    personInCharge: "Lê Thị Hạnh",
    mealsPerDay: "320 suất/ngày",
    dataSource: "API bên ngoài",
    lastSyncedAt: "23/09/2026 08:42",
    connectedSystem: "SchoolMeal Pro · API v1",
    documents: [
      "Giấy chứng nhận đủ điều kiện ATTP.pdf",
      "Hợp đồng cung cấp suất ăn 2026.pdf",
      "Quy trình tiếp nhận và lưu mẫu.pdf",
    ],
    deliveries: [
      {
        id: "delivery-001",
        date: "23/09/2026",
        kind: "Thức ăn",
        orderCode: "DH-LL-230926",
        partner: "Công ty Suất ăn Minh Tâm",
        destination: "Bếp ăn Trường Tiểu học Lê Lợi",
        quantity: "320 suất",
        status: "Đã nhận",
        sourceSystem: "SchoolMeal Pro",
      },
      {
        id: "delivery-002",
        date: "22/09/2026",
        kind: "Nguyên liệu",
        orderCode: "NL-LL-220926",
        partner: "Công ty TNHH Nông sản An Phú",
        destination: "Kho tiếp nhận nhà trường",
        quantity: "185 kg",
        status: "Đã nhận",
        sourceSystem: "SchoolMeal Pro",
      },
      {
        id: "delivery-003",
        date: "21/09/2026",
        kind: "Thức ăn",
        orderCode: "DH-LL-210926",
        partner: "Công ty Suất ăn Minh Tâm",
        destination: "Bếp ăn Trường Tiểu học Lê Lợi",
        quantity: "320 suất",
        status: "Đã nhận",
        sourceSystem: "SchoolMeal Pro",
      },
    ],
    violations: [
      {
        id: "violation-001",
        date: "14/07/2026",
        type: "Thiếu thông tin thời gian giao nhận",
        severity: "Nhẹ",
        description: "Một số phiếu giao nhận chưa ghi đủ giờ giao thực tế.",
        handling: "Đã yêu cầu bổ sung biểu mẫu và hướng dẫn lại nhân sự.",
        status: "Đã khắc phục",
        sourceSystem: "Cán bộ Sở cập nhật",
      },
    ],
  },
  {
    id: "facility-003",
    name: "Công ty TNHH Nông sản An Phú",
    category: "Cơ sở cung cấp thực phẩm",
    address: "184 Nguyễn Văn Linh, Quận 7, TP. Hồ Chí Minh",
    contact: "0908 123 456",
    taxCode: "0312345678",
    licenseNumber: "ATTP-HCM-2026-0041",
    approvedAt: "12/08/2026",
    reviewer: "Trần Anh Tuấn",
    personInCharge: "Lê Minh Trang",
    mealsPerDay: "Năng lực 3.000 kg/ngày",
    dataSource: "API bên ngoài",
    lastSyncedAt: "23/09/2026 07:55",
    connectedSystem: "An Phú Trace · REST API",
    documents: [
      "Giấy chứng nhận cơ sở đủ điều kiện ATTP.pdf",
      "Danh mục sản phẩm và vùng nguyên liệu.xlsx",
      "Chứng nhận chuỗi cung ứng.pdf",
    ],
    deliveries: [
      {
        id: "delivery-004",
        date: "23/09/2026",
        kind: "Nguyên liệu",
        orderCode: "AP-PO-230926",
        partner: "HTX Rau sạch Củ Chi",
        destination: "Kho nguyên liệu An Phú",
        quantity: "1.240 kg",
        status: "Đã giao",
        sourceSystem: "An Phú Trace",
      },
      {
        id: "delivery-005",
        date: "22/09/2026",
        kind: "Nguyên liệu",
        orderCode: "AP-PO-220926",
        partner: "Trang trại Green Farm",
        destination: "Kho nguyên liệu An Phú",
        quantity: "860 kg",
        status: "Có sai lệch",
        sourceSystem: "An Phú Trace",
      },
    ],
    violations: [
      {
        id: "violation-002",
        date: "28/06/2026",
        type: "Chứng từ truy xuất chưa đầy đủ",
        severity: "Trung bình",
        description: "Một lô rau củ thiếu bản scan phiếu kiểm nghiệm kèm theo.",
        handling: "Tạm giữ lô hàng, yêu cầu bổ sung chứng từ trước khi phân phối.",
        status: "Đã khắc phục",
        sourceSystem: "Cán bộ Sở cập nhật",
      },
      {
        id: "violation-003",
        date: "09/03/2026",
        type: "Sai lệch khối lượng giao nhận",
        severity: "Nhẹ",
        description: "Khối lượng thực nhận thấp hơn đơn hàng 2,5%.",
        handling: "Cơ sở đã điều chỉnh quy trình cân đối chiếu tại điểm giao.",
        status: "Đã khắc phục",
        sourceSystem: "An Phú Trace",
      },
    ],
  },
  {
    id: "facility-004",
    name: "Hợp tác xã Rau sạch Củ Chi",
    category: "Cơ sở cung cấp thực phẩm",
    address: "Đường Tỉnh lộ 8, Củ Chi, TP. Hồ Chí Minh",
    contact: "0903 456 789",
    taxCode: "0319876543",
    licenseNumber: "ATTP-HCM-2026-0056",
    approvedAt: "05/08/2026",
    reviewer: "Nguyễn Minh Anh",
    personInCharge: "Phạm Quốc Hưng",
    mealsPerDay: "Năng lực 1.800 kg/ngày",
    dataSource: "Cổng Sở",
    lastSyncedAt: "23/09/2026 06:30",
    connectedSystem: "Nhập trực tiếp trên Cổng Sở",
    documents: [
      "Giấy chứng nhận đủ điều kiện ATTP.pdf",
      "Danh sách vùng trồng được kiểm soát.pdf",
    ],
    deliveries: [
      {
        id: "delivery-006",
        date: "22/09/2026",
        kind: "Nguyên liệu",
        orderCode: "CC-220926-01",
        partner: "Công ty TNHH Nông sản An Phú",
        destination: "Kho đóng gói Củ Chi",
        quantity: "920 kg",
        status: "Đã giao",
        sourceSystem: "Cổng Sở",
      },
      {
        id: "delivery-007",
        date: "20/09/2026",
        kind: "Nguyên liệu",
        orderCode: "CC-200926-01",
        partner: "Công ty TNHH Nông sản An Phú",
        destination: "Kho đóng gói Củ Chi",
        quantity: "780 kg",
        status: "Đã giao",
        sourceSystem: "Cổng Sở",
      },
    ],
    violations: [],
  },
  {
    id: "facility-005",
    name: "Công ty Suất ăn Minh Tâm",
    category: "Cơ sở cung cấp suất ăn",
    address: "Khu công nghiệp Tân Bình, TP. Hồ Chí Minh",
    contact: "028 3812 8899",
    taxCode: "0314567890",
    licenseNumber: "ATTP-HCM-2026-0068",
    approvedAt: "28/07/2026",
    reviewer: "Trần Anh Tuấn",
    personInCharge: "Võ Hoàng Nam",
    mealsPerDay: "1.200 suất/ngày",
    dataSource: "API bên ngoài",
    lastSyncedAt: "23/09/2026 08:16",
    connectedSystem: "MealFlow Minh Tâm · API v1",
    documents: [
      "Giấy chứng nhận đủ điều kiện ATTP.pdf",
      "Danh sách phương tiện vận chuyển.xlsx",
      "Quy trình giao nhận và lưu mẫu.pdf",
    ],
    deliveries: [
      {
        id: "delivery-008",
        date: "23/09/2026",
        kind: "Thức ăn",
        orderCode: "MT-LL-230926",
        partner: "Công ty Suất ăn Minh Tâm",
        destination: "Trường Tiểu học Lê Lợi",
        quantity: "320 suất",
        status: "Đã giao",
        sourceSystem: "MealFlow Minh Tâm",
      },
      {
        id: "delivery-009",
        date: "23/09/2026",
        kind: "Nguyên liệu",
        orderCode: "MT-NL-230926",
        partner: "Công ty TNHH Nông sản An Phú",
        destination: "Bếp trung tâm Minh Tâm",
        quantity: "620 kg",
        status: "Đã nhận",
        sourceSystem: "MealFlow Minh Tâm",
      },
      {
        id: "delivery-010",
        date: "19/08/2026",
        kind: "Thức ăn",
        orderCode: "MT-LL-190826",
        partner: "Công ty Suất ăn Minh Tâm",
        destination: "Trường Tiểu học Lê Lợi",
        quantity: "320 suất",
        status: "Có sai lệch",
        sourceSystem: "MealFlow Minh Tâm",
      },
    ],
    violations: [
      {
        id: "violation-004",
        date: "17/08/2026",
        type: "Giao suất ăn trễ khung giờ",
        severity: "Trung bình",
        description: "Một chuyến giao đến sau khung giờ cam kết 25 phút.",
        handling: "Yêu cầu cơ sở bổ sung phương án dự phòng phương tiện vận chuyển.",
        status: "Đang theo dõi",
        sourceSystem: "MealFlow Minh Tâm",
      },
    ],
  },
];

const severityClass: Record<ViolationRecord["severity"], string> = {
  Nhẹ: "bg-slate-100 text-slate-700",
  "Trung bình": "bg-amber-100 text-amber-900",
  "Nghiêm trọng": "bg-red-100 text-red-900",
};

function DataSourceBadge({ source }: { source: FacilityProfile["dataSource"] }) {
  const isApi = source === "API bên ngoài";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ${
        isApi ? "bg-sky-100 text-sky-800" : "bg-emerald-100 text-emerald-800"
      }`}
    >
      {isApi ? <Link2 size={13} /> : <Database size={13} />}
      {source}
    </span>
  );
}

function DeliveryStatus({ status }: { status: DeliveryRecord["status"] }) {
  const className =
    status === "Có sai lệch"
      ? "bg-amber-100 text-amber-900"
      : "bg-emerald-100 text-emerald-800";
  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${className}`}>
      {status}
    </span>
  );
}

export function FacilityProfilesPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Tất cả loại hình");
  const [source, setSource] = useState("Tất cả nguồn dữ liệu");

  const filteredProfiles = useMemo(
    () =>
      facilityProfiles.filter((profile) => {
        const haystack =
          `${profile.name} ${profile.address} ${profile.taxCode}`.toLowerCase();
        return (
          haystack.includes(search.trim().toLowerCase()) &&
          (category === "Tất cả loại hình" || profile.category === category) &&
          (source === "Tất cả nguồn dữ liệu" || profile.dataSource === source)
        );
      }),
    [category, search, source],
  );

  const totalDeliveries = facilityProfiles.reduce(
    (total, profile) => total + profile.deliveries.length,
    0,
  );
  const totalViolations = facilityProfiles.reduce(
    (total, profile) => total + profile.violations.length,
    0,
  );

  return (
    <AdminShell>
      <div className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Hồ sơ cơ sở"
          title="Theo dõi độ tin cậy của từng cơ sở."
          description="Tra cứu hồ sơ đã được duyệt, lịch sử giao nhận thức ăn/nguyên liệu và lịch sử vi phạm theo thời gian."
          action={
            <div className="rounded-2xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-950">
              <div className="flex items-center gap-2 font-bold">
                <Link2 size={16} /> Sẵn sàng nhận dữ liệu từ hệ thống ngoài
              </div>
              <p className="mt-1 max-w-sm text-xs leading-5 text-sky-800">
                Cơ sở có thể gửi bản ghi giao nhận và vi phạm qua API sau khi
                được cấp mã kết nối.
              </p>
            </div>
          }
        />

        <div className="grid gap-4 md:grid-cols-3">
          <MetricCard label="Cơ sở đã duyệt" value={facilityProfiles.length} icon={BadgeCheck} />
          <MetricCard label="Bản ghi giao nhận" value={totalDeliveries} tone="blue" icon={Truck} />
          <MetricCard label="Lịch sử vi phạm" value={totalViolations} tone="orange" icon={ShieldAlert} />
        </div>

        <section className="mt-6 rounded-2xl border border-border bg-card p-4 shadow-sm">
          <div className="grid gap-3 lg:grid-cols-[1fr_240px_220px]">
            <label className="relative block">
              <span className="sr-only">Tìm cơ sở</span>
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Tìm theo tên, mã số thuế hoặc địa chỉ..."
                className="h-11 w-full rounded-xl border border-input bg-background pl-10 pr-3 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
              />
            </label>
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="h-11 rounded-xl border border-input bg-background px-3 text-sm font-semibold outline-none focus:border-primary"
              aria-label="Lọc theo loại hình"
            >
              <option>Tất cả loại hình</option>
              <option>Cơ sở giáo dục</option>
              <option>Cơ sở cung cấp thực phẩm</option>
              <option>Cơ sở cung cấp suất ăn</option>
            </select>
            <select
              value={source}
              onChange={(event) => setSource(event.target.value)}
              className="h-11 rounded-xl border border-input bg-background px-3 text-sm font-semibold outline-none focus:border-primary"
              aria-label="Lọc theo nguồn dữ liệu"
            >
              <option>Tất cả nguồn dữ liệu</option>
              <option>Cổng Sở</option>
              <option>API bên ngoài</option>
            </select>
          </div>
        </section>

        <section className="mt-6 overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <div className="flex flex-col gap-2 border-b border-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-extrabold text-foreground">Danh sách cơ sở đã duyệt</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {filteredProfiles.length} cơ sở phù hợp bộ lọc
              </p>
            </div>
            <span className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground">
              <Clock3 size={14} /> Cập nhật dữ liệu gần nhất: 23/09/2026
            </span>
          </div>
          {filteredProfiles.length ? (
            <div className="divide-y divide-border">
              {filteredProfiles.map((profile) => (
                <div
                  key={profile.id}
                  className="flex flex-col gap-4 px-5 py-5 transition-colors hover:bg-secondary/30 lg:flex-row lg:items-center lg:justify-between"
                >
                  <div className="flex min-w-0 gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      {profile.category === "Cơ sở giáo dục" ? (
                        <Building2 size={21} />
                      ) : (
                        <PackageCheck size={21} />
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-extrabold text-foreground">{profile.name}</h3>
                        <StatusPill status="approved" />
                        <DataSourceBadge source={profile.dataSource} />
                      </div>
                      <p className="mt-1 flex items-start gap-1.5 text-sm text-muted-foreground">
                        <MapPin size={15} className="mt-0.5 shrink-0" /> {profile.address}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs font-semibold text-muted-foreground">
                        <span>{profile.category}</span>
                        <span>Duyệt ngày {profile.approvedAt}</span>
                        <span>{profile.deliveries.length} giao nhận · {profile.violations.length} vi phạm</span>
                      </div>
                    </div>
                  </div>
                  <Link
                    href={`/admin/facility-profiles/${profile.id}`}
                    className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground hover:bg-primary/90"
                    data-testid={`link-facility-profile-${profile.id}`}
                  >
                    Xem hồ sơ <ArrowRight size={16} />
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-5">
              <EmptyState
                title="Không có cơ sở phù hợp"
                description="Thử thay đổi từ khóa hoặc bộ lọc nguồn dữ liệu."
              />
            </div>
          )}
        </section>
      </div>
    </AdminShell>
  );
}

export function FacilityProfileDetailPage() {
  const { facilityId = "" } = useParams<{ facilityId: string }>();
  const [deliveryKind, setDeliveryKind] = useState<"Tất cả" | DeliveryKind>("Tất cả");
  const profile = facilityProfiles.find((item) => item.id === facilityId);

  if (!profile) {
    return (
      <AdminShell>
        <div className="mx-auto max-w-4xl px-5 py-12 lg:px-10">
          <Link href="/admin/facility-profiles" className="inline-flex items-center gap-2 text-sm font-bold text-primary">
            <ArrowLeft size={16} /> Quay lại Hồ sơ cơ sở
          </Link>
          <div className="mt-8 rounded-3xl border border-border bg-card p-8 text-center shadow-sm">
            <h1 className="text-2xl font-extrabold">Không tìm thấy hồ sơ cơ sở</h1>
            <p className="mt-2 text-sm text-muted-foreground">Hồ sơ có thể đã được di chuyển hoặc không tồn tại.</p>
          </div>
        </div>
      </AdminShell>
    );
  }

  const deliveries = profile.deliveries.filter(
    (delivery) => deliveryKind === "Tất cả" || delivery.kind === deliveryKind,
  );

  return (
    <AdminShell>
      <div className="mx-auto max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8">
        <Link
          href="/admin/facility-profiles"
          className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline"
          data-testid="link-back-to-facility-profiles"
        >
          <ArrowLeft size={16} /> Quay lại Hồ sơ cơ sở
        </Link>

        <div className="mt-5 flex flex-col gap-4 border-b border-border pb-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mono-label text-primary">HỒ SƠ CƠ SỞ ĐÃ DUYỆT</p>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight">{profile.name}</h1>
            <p className="mt-2 flex items-start gap-1.5 text-sm text-muted-foreground">
              <MapPin size={15} className="mt-0.5 shrink-0" /> {profile.address}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <StatusPill status="approved" />
            <DataSourceBadge source={profile.dataSource} />
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard label="Ngày duyệt" value={profile.approvedAt} icon={BadgeCheck} />
          <MetricCard label="Bản ghi giao nhận" value={profile.deliveries.length} tone="blue" icon={Truck} />
          <MetricCard label="Lịch sử vi phạm" value={profile.violations.length} tone="orange" icon={ShieldAlert} />
          <MetricCard label="Quy mô hoạt động" value={profile.mealsPerDay} tone="gold" icon={Utensils} />
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[.8fr_1.2fr]">
          <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center gap-2">
              <FileCheck2 size={18} className="text-primary" />
              <h2 className="font-extrabold">Thông tin hồ sơ</h2>
            </div>
            <dl className="mt-4 divide-y divide-border text-sm">
              {[
                ["Loại hình", profile.category],
                ["Mã số thuế", profile.taxCode],
                ["Giấy chứng nhận ATTP", profile.licenseNumber],
                ["Người phụ trách ATTP", profile.personInCharge],
                ["Số điện thoại", profile.contact],
                ["Cán bộ duyệt", profile.reviewer],
              ].map(([label, value]) => (
                <div key={label} className="grid grid-cols-[150px_1fr] gap-3 py-3">
                  <dt className="text-muted-foreground">{label}</dt>
                  <dd className="font-semibold text-foreground">{value}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center gap-2">
              <FileCheck2 size={18} className="text-primary" />
              <h2 className="font-extrabold">Tài liệu trong hồ sơ</h2>
            </div>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {profile.documents.map((document) => (
                <div key={document} className="flex items-center gap-3 rounded-xl border border-border bg-secondary/30 p-3 text-sm">
                  <FileCheck2 size={16} className="shrink-0 text-primary" />
                  <span className="min-w-0 truncate font-semibold">{document}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
              <div className="flex items-center gap-2 text-sm font-extrabold text-emerald-950">
                <CheckCircle2 size={16} /> Trạng thái hồ sơ
              </div>
              <p className="mt-1 text-sm text-emerald-900">
                Hồ sơ đã được duyệt và đang được theo dõi trong danh sách cơ sở hoạt động.
              </p>
            </div>
          </section>
        </div>

        <section className="mt-6 overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <div className="flex flex-col gap-3 border-b border-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <History size={18} className="text-primary" />
              <div>
                <h2 className="font-extrabold">Lịch sử giao nhận</h2>
                <p className="mt-1 text-sm text-muted-foreground">Theo dõi từng đơn hàng/ngày, gồm thức ăn và nguyên liệu.</p>
              </div>
            </div>
            <select
              value={deliveryKind}
              onChange={(event) => setDeliveryKind(event.target.value as "Tất cả" | DeliveryKind)}
              className="h-10 rounded-xl border border-input bg-background px-3 text-sm font-semibold outline-none focus:border-primary"
              aria-label="Lọc loại giao nhận"
            >
              <option>Tất cả</option>
              <option>Thức ăn</option>
              <option>Nguyên liệu</option>
            </select>
          </div>
          {deliveries.length ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] text-left text-sm">
                <thead className="bg-secondary/45 text-xs uppercase tracking-wide text-muted-foreground">
                  <tr>
                    <th className="px-5 py-3">Ngày / đơn hàng</th>
                    <th className="px-5 py-3">Loại</th>
                    <th className="px-5 py-3">Đối tác</th>
                    <th className="px-5 py-3">Điểm giao nhận</th>
                    <th className="px-5 py-3">Khối lượng</th>
                    <th className="px-5 py-3">Trạng thái</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {deliveries.map((delivery) => (
                    <tr key={delivery.id} className="hover:bg-secondary/20">
                      <td className="px-5 py-4">
                        <p className="font-bold">{delivery.date}</p>
                        <p className="mt-1 text-xs text-muted-foreground">{delivery.orderCode}</p>
                      </td>
                      <td className="px-5 py-4">
                        <span className="inline-flex items-center gap-1.5 font-semibold">
                          {delivery.kind === "Thức ăn" ? <Utensils size={15} className="text-primary" /> : <PackageCheck size={15} className="text-amber-700" />}
                          {delivery.kind}
                        </span>
                      </td>
                      <td className="px-5 py-4 font-semibold">{delivery.partner}</td>
                      <td className="px-5 py-4 text-muted-foreground">{delivery.destination}</td>
                      <td className="px-5 py-4 font-semibold">{delivery.quantity}</td>
                      <td className="px-5 py-4">
                        <DeliveryStatus status={delivery.status} />
                        <p className="mt-1 text-[11px] text-muted-foreground">{delivery.sourceSystem}</p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-5">
              <EmptyState title="Chưa có bản ghi giao nhận" description="Dữ liệu sẽ xuất hiện khi cơ sở nhập hoặc đồng bộ đơn hàng." />
            </div>
          )}
        </section>

        <section className="mt-6 overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <div className="flex items-center gap-2 border-b border-border px-5 py-4">
            <ShieldAlert size={18} className="text-orange-600" />
            <div>
              <h2 className="font-extrabold">Lịch sử vi phạm và xử lý</h2>
              <p className="mt-1 text-sm text-muted-foreground">Theo dõi loại vi phạm, thời điểm, biện pháp xử lý và trạng thái khắc phục.</p>
            </div>
          </div>
          {profile.violations.length ? (
            <div className="divide-y divide-border">
              {profile.violations.map((violation) => (
                <article key={violation.id} className="grid gap-4 px-5 py-5 lg:grid-cols-[145px_1fr_auto]">
                  <div>
                    <p className="flex items-center gap-1.5 text-sm font-bold">
                      <CalendarDays size={15} className="text-muted-foreground" /> {violation.date}
                    </p>
                    <span className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${severityClass[violation.severity]}`}>
                      {violation.severity}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-extrabold">{violation.type}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{violation.description}</p>
                    <div className="mt-3 rounded-xl bg-secondary/45 p-3 text-sm">
                      <span className="font-bold">Cách xử lý: </span>{violation.handling}
                    </div>
                  </div>
                  <div className="lg:text-right">
                    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${violation.status === "Đã khắc phục" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-900"}`}>
                      {violation.status}
                    </span>
                    <p className="mt-2 text-xs text-muted-foreground">{violation.sourceSystem}</p>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="flex items-center gap-3 p-6 text-sm text-emerald-800">
              <CheckCircle2 size={19} />
              Cơ sở chưa có lịch sử vi phạm được ghi nhận.
            </div>
          )}
        </section>
      </div>
    </AdminShell>
  );
}