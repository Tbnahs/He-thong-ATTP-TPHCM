import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Building2,
  Check,
  CheckCircle2,
  ChevronRight,
  Eye,
  Info,
  KeyRound,
  Lock,
  Mail,
  MapPin,
  Pencil,
  Plus,
  RotateCcw,
  Search,
  ShieldCheck,
  Trash2,
  Unlock,
  UserRound,
  Users,
  X,
} from "lucide-react";
import { AdminShell } from "@/components/portal-ui";

type AccountRole = "director" | "specialist" | "ward";
type AccountStatus = "Đang hoạt động" | "Đang khóa";
type AccountView = "list" | "create" | "detail";
type PermissionId =
  | "fullAdmin"
  | "evaluation"
  | "schedule"
  | "mealProviders"
  | "schools"
  | "reports";

type Permission = {
  id: PermissionId;
  label: string;
  description: string;
};

type Account = {
  id: string;
  organization: string;
  unitType: string;
  managementLevel: string;
  province: string;
  ward: string;
  oldLocality: string;
  responsibleName: string;
  position: string;
  phone: string;
  email: string;
  username: string;
  role: AccountRole;
  status: AccountStatus;
  permissions: Record<PermissionId, boolean>;
  managedFacilities: number;
  lastLogin: string;
  schools: Array<{
    name: string;
    address: string;
    status: "Đã thẩm định" | "Chờ tái thẩm định";
    attachedAt: string;
  }>;
};

type AccountForm = Pick<
  Account,
  | "organization"
  | "unitType"
  | "managementLevel"
  | "province"
  | "ward"
  | "oldLocality"
  | "responsibleName"
  | "position"
  | "phone"
  | "email"
  | "username"
  | "role"
  | "permissions"
>;

const permissionCatalog: Permission[] = [
  {
    id: "fullAdmin",
    label: "Toàn quyền quản trị hệ thống",
    description: "Quản lý tài khoản, cấu hình và toàn bộ dữ liệu hệ thống",
  },
  {
    id: "evaluation",
    label: "Cập nhật kết quả đánh giá",
    description: "Cập nhật kết quả thẩm định, đánh giá và trạng thái ATTP",
  },
  {
    id: "schedule",
    label: "Lập lịch kiểm tra",
    description: "Tạo, phân công và theo dõi lịch kiểm tra",
  },
  {
    id: "mealProviders",
    label: "Tra cứu cơ sở cung cấp suất ăn toàn thành phố",
    description: "Không giới hạn theo địa giới hành chính của đơn vị",
  },
  {
    id: "schools",
    label: "Tra cứu cơ sở giáo dục trong phạm vi quản lý",
    description: "Chỉ hiển thị trường học thuộc phạm vi được phân quyền",
  },
  {
    id: "reports",
    label: "Báo cáo và xuất file",
    description: "Xem báo cáo tổng hợp và xuất dữ liệu được phép",
  },
];

const wardOptions = [
  "Tất cả xã/phường",
  "phường Gò Vấp",
  "phường Thủ Đức",
  "phường Vũng Tàu",
  "phường Thủ Dầu Một",
  "phường Bến Thành",
  "xã Củ Chi",
];

const managementOptions = [
  "Tất cả cấp quản lý",
  "Cấp tỉnh/TP",
  "Phòng chuyên môn",
  "Phường/Xã",
];

const provinceOptions = [
  "Tất cả tỉnh/thành phố",
  "TP. Hồ Chí Minh",
  "Khu vực Bình Dương cũ",
  "Khu vực Vũng Tàu cũ",
];

function makePermissions(role: AccountRole): Record<PermissionId, boolean> {
  if (role === "director") {
    return {
      fullAdmin: true,
      evaluation: true,
      schedule: true,
      mealProviders: true,
      schools: true,
      reports: true,
    };
  }
  if (role === "specialist") {
    return {
      fullAdmin: false,
      evaluation: true,
      schedule: true,
      mealProviders: true,
      schools: true,
      reports: true,
    };
  }
  return {
    fullAdmin: false,
    evaluation: false,
    schedule: false,
    mealProviders: true,
    schools: true,
    reports: true,
  };
}

const sampleSchools = [
  {
    name: "Trường Tiểu học Phan Chu Trinh",
    address: "123 Quang Trung, phường Gò Vấp",
    status: "Đã thẩm định" as const,
    attachedAt: "15/10/2023",
  },
  {
    name: "Trường Mầm non Họa Mi 10",
    address: "45 Phan Văn Trị, phường Gò Vấp",
    status: "Chờ tái thẩm định" as const,
    attachedAt: "20/10/2023",
  },
];

const initialAccounts: Account[] = [
  {
    id: "acct-director",
    organization: "Ban Giám đốc Sở An toàn thực phẩm TP.HCM",
    unitType: "Ban Giám đốc Sở",
    managementLevel: "Cấp tỉnh/TP",
    province: "TP. Hồ Chí Minh",
    ward: "Toàn thành phố",
    oldLocality: "",
    responsibleName: "Nguyễn Văn Quản Trị",
    position: "Quản trị viên hệ thống",
    phone: "028.3930.6001",
    email: "bangiamdoc@attp.hochiminhcity.gov.vn",
    username: "admin.attp",
    role: "director",
    status: "Đang hoạt động",
    permissions: makePermissions("director"),
    managedFacilities: 1038,
    lastLogin: "Hôm nay, 08:42",
    schools: [],
  },
  {
    id: "acct-inspection",
    organization: "Phòng Quản lý cơ sở",
    unitType: "Phòng chuyên môn",
    managementLevel: "Phòng chuyên môn",
    province: "TP. Hồ Chí Minh",
    ward: "Toàn thành phố",
    oldLocality: "",
    responsibleName: "Nguyễn Mạnh Hùng",
    position: "Trưởng phòng",
    phone: "0912.345.678",
    email: "hungnm@attp.hochiminhcity.gov.vn",
    username: "qlcoso.attp",
    role: "specialist",
    status: "Đang hoạt động",
    permissions: makePermissions("specialist"),
    managedFacilities: 256,
    lastLogin: "Hôm qua, 16:25",
    schools: [],
  },
  {
    id: "acct-food",
    organization: "Phòng Giám sát bếp ăn",
    unitType: "Phòng chuyên môn",
    managementLevel: "Phòng chuyên môn",
    province: "TP. Hồ Chí Minh",
    ward: "Toàn thành phố",
    oldLocality: "",
    responsibleName: "Lê Thị Mai",
    position: "Chuyên viên phụ trách",
    phone: "0987.654.321",
    email: "mailt@attp.hochiminhcity.gov.vn",
    username: "giamsat.bepan",
    role: "specialist",
    status: "Đang hoạt động",
    permissions: makePermissions("specialist"),
    managedFacilities: 128,
    lastLogin: "12/09/2026, 14:10",
    schools: [],
  },
  {
    id: "acct-govap",
    organization: "UBND phường Gò Vấp",
    unitType: "UBND Phường/Xã",
    managementLevel: "Phường/Xã",
    province: "TP. Hồ Chí Minh",
    ward: "phường Gò Vấp",
    oldLocality: "Khu vực Gò Vấp trước đây",
    responsibleName: "Trần Thị Thanh Vân",
    position: "Chuyên viên Y tế",
    phone: "0908.123.456",
    email: "van.ttt@phuonggovap.gov.vn",
    username: "gov_phuong_govap",
    role: "ward",
    status: "Đang hoạt động",
    permissions: makePermissions("ward"),
    managedFacilities: 8,
    lastLogin: "10/09/2026, 09:20",
    schools: sampleSchools,
  },
  {
    id: "acct-vungtau",
    organization: "UBND phường Vũng Tàu",
    unitType: "UBND Phường/Xã",
    managementLevel: "Phường/Xã",
    province: "Khu vực Vũng Tàu cũ",
    ward: "phường Vũng Tàu",
    oldLocality: "Tỉnh Bà Rịa - Vũng Tàu cũ",
    responsibleName: "Phạm Minh Anh",
    position: "Cán bộ phụ trách",
    phone: "0913.456.789",
    email: "anh.pm@phuongvungtau.gov.vn",
    username: "ubnd_vungtau",
    role: "ward",
    status: "Đang hoạt động",
    permissions: makePermissions("ward"),
    managedFacilities: 14,
    lastLogin: "09/09/2026, 11:05",
    schools: [],
  },
  {
    id: "acct-binhduong",
    organization: "UBND phường Thủ Dầu Một",
    unitType: "UBND Phường/Xã",
    managementLevel: "Phường/Xã",
    province: "Khu vực Bình Dương cũ",
    ward: "phường Thủ Dầu Một",
    oldLocality: "Tỉnh Bình Dương cũ",
    responsibleName: "Đỗ Minh Tâm",
    position: "Cán bộ văn hóa - xã hội",
    phone: "0905.222.333",
    email: "tam.dm@phuongthudaumot.gov.vn",
    username: "ubnd_thudaumot",
    role: "ward",
    status: "Đang khóa",
    permissions: makePermissions("ward"),
    managedFacilities: 19,
    lastLogin: "01/09/2026, 15:40",
    schools: [],
  },
];

function stripLocationPrefix(value: string) {
  return value.replace(/^(phường|xã|đặc khu)\s+/i, "");
}

function accountToForm(account?: Account): AccountForm {
  if (account) {
    return {
      organization: account.organization,
      unitType: account.unitType,
      managementLevel: account.managementLevel,
      province: account.province,
      ward: account.ward,
      oldLocality: account.oldLocality,
      responsibleName: account.responsibleName,
      position: account.position,
      phone: account.phone,
      email: account.email,
      username: account.username,
      role: account.role,
      permissions: account.permissions,
    };
  }
  return {
    organization: "",
    unitType: "UBND Phường/Xã",
    managementLevel: "Phường/Xã",
    province: "TP. Hồ Chí Minh",
    ward: "phường Gò Vấp",
    oldLocality: "",
    responsibleName: "",
    position: "",
    phone: "",
    email: "",
    username: "",
    role: "ward",
    permissions: makePermissions("ward"),
  };
}

function StatusBadge({ status }: { status: AccountStatus }) {
  const active = status === "Đang hoạt động";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold ${
        active
          ? "bg-emerald-50 text-emerald-700"
          : "bg-rose-50 text-rose-700"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          active ? "bg-emerald-500" : "bg-rose-500"
        }`}
      />
      {status}
    </span>
  );
}

function LegacyLocalityBadge({
  value,
  compact = false,
}: {
  value: string;
  compact?: boolean;
}) {
  if (!value) return null;
  return (
    <span
      title={`Địa danh cũ: ${value}`}
      className={`inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 font-semibold text-amber-800 ${
        compact ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-[11px]"
      }`}
    >
      <Info size={compact ? 11 : 12} />
      {compact ? "Địa danh cũ" : value}
    </span>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  required = false,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-[11px] font-extrabold uppercase tracking-[0.08em] text-slate-500">
        {label} {required && <span className="text-orange-500">*</span>}
      </span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-11 w-full rounded-xl border border-slate-200 bg-[#fbfcfd] px-3 text-sm font-semibold text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
      />
    </label>
  );
}

function SelectField({
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
      <span className="mb-2 block text-[11px] font-extrabold uppercase tracking-[0.08em] text-slate-500">
        {label}
      </span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 w-full rounded-xl border border-slate-200 bg-[#fbfcfd] px-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
      >
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </label>
  );
}

function SectionCard({
  title,
  children,
  action,
}: {
  title: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_4px_18px_rgba(15,23,42,.035)]">
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
        <h2 className="flex items-center gap-2 text-sm font-extrabold uppercase tracking-[0.06em] text-slate-700">
          <span className="h-5 w-1 rounded-full bg-orange-500" />
          {title}
        </h2>
        {action}
      </div>
      {children}
    </section>
  );
}

export function AdminAccountsPage() {
  const [accounts, setAccounts] = useState<Account[]>(() => {
    try {
      const stored = localStorage.getItem("attp-admin-accounts");
      return stored ? (JSON.parse(stored) as Account[]) : initialAccounts;
    } catch {
      return initialAccounts;
    }
  });
  const [view, setView] = useState<AccountView>("list");
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [managementLevel, setManagementLevel] = useState(
    "Tất cả cấp quản lý",
  );
  const [province, setProvince] = useState("Tất cả tỉnh/thành phố");
  const [ward, setWard] = useState("Tất cả xã/phường");
  const [form, setForm] = useState<AccountForm>(accountToForm());
  const [formError, setFormError] = useState("");
  const [notice, setNotice] = useState("");
  const [deletePending, setDeletePending] = useState(false);

  useEffect(() => {
    localStorage.setItem("attp-admin-accounts", JSON.stringify(accounts));
  }, [accounts]);

  const filteredAccounts = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    return accounts.filter((account) => {
      const matchesSearch =
        !normalizedSearch ||
        `${account.organization} ${account.responsibleName} ${account.username} ${account.email}`
          .toLowerCase()
          .includes(normalizedSearch);
      const matchesManagement =
        managementLevel === "Tất cả cấp quản lý" ||
        account.managementLevel === managementLevel;
      const matchesProvince =
        province === "Tất cả tỉnh/thành phố" ||
        account.province === province;
      const matchesWard =
        ward === "Tất cả xã/phường" ||
        account.ward === ward ||
        stripLocationPrefix(account.ward) === stripLocationPrefix(ward);
      return (
        matchesSearch && matchesManagement && matchesProvince && matchesWard
      );
    });
  }, [accounts, managementLevel, province, search, ward]);

  const updateForm = <K extends keyof AccountForm>(
    key: K,
    value: AccountForm[K],
  ) => setForm((current) => ({ ...current, [key]: value }));

  const openCreate = () => {
    setEditingId(null);
    setForm(accountToForm());
    setFormError("");
    setNotice("");
    setView("create");
  };

  const openEdit = (account: Account) => {
    setEditingId(account.id);
    setForm(accountToForm(account));
    setFormError("");
    setNotice("");
    setView("create");
  };

  const openDetail = (account: Account) => {
    setSelectedAccount(account);
    setDeletePending(false);
    setView("detail");
  };

  const closeToList = () => {
    setView("list");
    setSelectedAccount(null);
    setEditingId(null);
    setDeletePending(false);
  };

  const saveAccount = () => {
    if (!form.organization.trim() || !form.responsibleName.trim()) {
      setFormError("Vui lòng nhập tên đơn vị và người phụ trách.");
      return;
    }
    if (!form.username.trim()) {
      setFormError("Vui lòng nhập tên đăng nhập.");
      return;
    }
    const existing = editingId
      ? accounts.find((account) => account.id === editingId)
      : undefined;
    const saved: Account = {
      id: editingId || `acct-${Date.now()}`,
      ...form,
      managedFacilities: existing?.managedFacilities || 0,
      lastLogin: existing?.lastLogin || "Chưa đăng nhập",
      status: existing?.status || "Đang hoạt động",
      schools: existing?.schools || [],
    };
    setAccounts((current) =>
      editingId
        ? current.map((account) => (account.id === editingId ? saved : account))
        : [saved, ...current],
    );
    setSelectedAccount(saved);
    setNotice(editingId ? "Đã cập nhật tài khoản." : "Đã tạo tài khoản mới.");
    setView("detail");
    setFormError("");
  };

  const toggleLock = (account: Account) => {
    const nextStatus: AccountStatus =
      account.status === "Đang hoạt động" ? "Đang khóa" : "Đang hoạt động";
    const updated = { ...account, status: nextStatus };
    setAccounts((current) =>
      current.map((item) => (item.id === account.id ? updated : item)),
    );
    setSelectedAccount(updated);
    setNotice(
      nextStatus === "Đang khóa"
        ? "Tài khoản đã được khóa."
        : "Tài khoản đã được mở khóa.",
    );
  };

  const removeAccount = (account: Account) => {
    setAccounts((current) => current.filter((item) => item.id !== account.id));
    setNotice("Đã gỡ tài khoản khỏi hệ thống.");
    closeToList();
  };

  const resetPassword = (account: Account) => {
    setNotice(`Đã tạo yêu cầu đặt lại mật khẩu cho ${account.username}.`);
  };

  const changeUnitType = (value: string) => {
    const role: AccountRole =
      value === "Ban Giám đốc Sở"
        ? "director"
        : value === "Phòng chuyên môn"
          ? "specialist"
          : "ward";
    updateForm("unitType", value);
    updateForm("role", role);
    updateForm("managementLevel", role === "ward" ? "Phường/Xã" : role === "specialist" ? "Phòng chuyên môn" : "Cấp tỉnh/TP");
    updateForm("permissions", makePermissions(role));
  };

  if (view === "create") {
    return (
      <AdminShell>
        <main className="mx-auto max-w-[1320px] px-5 py-6 lg:px-10">
          <button
            type="button"
            onClick={closeToList}
            className="mb-4 inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-primary"
          >
            <ArrowLeft size={16} /> Danh sách tài khoản
          </button>
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-orange-500">
                {editingId ? "Cập nhật tài khoản" : "Tạo tài khoản địa bàn mới"}
              </p>
              <h1 className="mt-1 text-2xl font-black text-slate-800">
                {editingId ? "Chỉnh sửa tài khoản" : "Tạo tài khoản"}
              </h1>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Các trường có dấu * là bắt buộc
            </div>
          </div>

          {formError && (
            <div className="mb-4 flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
              <Info size={16} /> {formError}
            </div>
          )}
          <div className="grid items-start gap-5 xl:grid-cols-[1.45fr_.8fr]">
            <div className="space-y-5">
              <SectionCard title="Thông tin đơn vị">
                <div className="grid gap-4 p-5 md:grid-cols-2">
                  <div className="md:col-span-2">
                    <Field
                      label="Tên đơn vị"
                      required
                      value={form.organization}
                      onChange={(value) => updateForm("organization", value)}
                      placeholder="Nhập tên đơn vị địa bàn"
                    />
                  </div>
                  <SelectField
                    label="Loại đơn vị"
                    value={form.unitType}
                    options={[
                      "Ban Giám đốc Sở",
                      "Phòng chuyên môn",
                      "UBND Phường/Xã",
                    ]}
                    onChange={changeUnitType}
                  />
                  <SelectField
                    label="Cấp quản lý"
                    value={form.managementLevel}
                    options={["Cấp tỉnh/TP", "Phòng chuyên môn", "Phường/Xã"]}
                    onChange={(value) => updateForm("managementLevel", value)}
                  />
                  <SelectField
                    label="Tỉnh/thành phố"
                    value={form.province}
                    options={provinceOptions.slice(1)}
                    onChange={(value) => updateForm("province", value)}
                  />
                  <SelectField
                    label="Xã/phường quản lý"
                    value={form.ward}
                    options={wardOptions.slice(1)}
                    onChange={(value) => updateForm("ward", value)}
                  />
                  <div className="md:col-span-2">
                    <Field
                      label="Địa danh cũ hiển thị"
                      value={form.oldLocality}
                      onChange={(value) => updateForm("oldLocality", value)}
                      placeholder="Ví dụ: Tỉnh Bình Dương cũ"
                    />
                    <p className="mt-2 flex items-center gap-1.5 text-xs text-slate-500">
                      <Info size={13} className="text-amber-600" />
                      Nhãn này sẽ hiển thị dạng tooltip ở các màn hình có địa
                      danh.
                    </p>
                  </div>
                </div>
              </SectionCard>

              <SectionCard title="Người phụ trách">
                <div className="grid gap-4 p-5 md:grid-cols-2">
                  <Field
                    label="Họ tên"
                    required
                    value={form.responsibleName}
                    onChange={(value) => updateForm("responsibleName", value)}
                    placeholder="Nhập họ tên đầy đủ"
                  />
                  <Field
                    label="Chức vụ"
                    value={form.position}
                    onChange={(value) => updateForm("position", value)}
                    placeholder="Nhập chức vụ"
                  />
                  <Field
                    label="Số điện thoại"
                    value={form.phone}
                    onChange={(value) => updateForm("phone", value)}
                    placeholder="Nhập số điện thoại"
                    type="tel"
                  />
                  <Field
                    label="Email"
                    value={form.email}
                    onChange={(value) => updateForm("email", value)}
                    placeholder="Nhập địa chỉ email"
                    type="email"
                  />
                </div>
              </SectionCard>
            </div>

            <div className="space-y-5">
              <SectionCard title="Tài khoản đăng nhập">
                <div className="p-5">
                  <Field
                    label="Tên đăng nhập"
                    required
                    value={form.username}
                    onChange={(value) => updateForm("username", value)}
                    placeholder="Ví dụ: ubnd_phuong_go_vap"
                  />
                  <p className="mt-2 text-xs leading-5 text-slate-500">
                    Tên đăng nhập được cấp cho cán bộ phụ trách đơn vị.
                  </p>
                </div>
              </SectionCard>

              <SectionCard
                title="Phân quyền chức năng"
                action={
                  <span className="rounded-full bg-orange-50 px-2.5 py-1 text-[10px] font-extrabold text-orange-700">
                    {form.role === "director"
                      ? "ADMIN"
                      : form.role === "specialist"
                        ? "PHÒNG CHUYÊN MÔN"
                        : "UBND PHƯỜNG/XÃ"}
                  </span>
                }
              >
                <div className="divide-y divide-slate-100 p-2">
                  {permissionCatalog.map((permission) => {
                    const locked =
                      form.role === "director" && permission.id === "fullAdmin";
                    return (
                      <label
                        key={permission.id}
                        className={`flex cursor-pointer gap-3 rounded-xl px-3 py-3 transition hover:bg-slate-50 ${
                          locked ? "bg-orange-50/50" : ""
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={form.permissions[permission.id]}
                          disabled={locked}
                          onChange={(event) =>
                            updateForm("permissions", {
                              ...form.permissions,
                              [permission.id]: event.target.checked,
                            })
                          }
                          className="mt-0.5 h-4 w-4 accent-orange-500"
                        />
                        <span className="min-w-0">
                          <span className="flex items-center gap-2 text-sm font-bold text-slate-700">
                            {permission.label}
                            {locked && (
                              <Lock size={12} className="text-slate-400" />
                            )}
                          </span>
                          <span className="mt-1 block text-xs leading-5 text-slate-500">
                            {permission.description}
                          </span>
                        </span>
                      </label>
                    );
                  })}
                </div>
              </SectionCard>
            </div>
          </div>
          <div className="mt-6 flex flex-col-reverse justify-end gap-3 border-t border-slate-200 pt-5 sm:flex-row">
            <button
              type="button"
              onClick={closeToList}
              className="h-11 rounded-xl border border-slate-200 bg-white px-6 text-sm font-bold text-slate-600 hover:bg-slate-50"
            >
              Hủy
            </button>
            <button
              type="button"
              onClick={saveAccount}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-orange-500 px-7 text-sm font-extrabold text-white shadow-lg shadow-orange-500/20 hover:bg-orange-600"
              data-testid="button-save-account"
            >
              <Check size={17} /> Lưu tài khoản
            </button>
          </div>
        </main>
      </AdminShell>
    );
  }

  if (view === "detail" && selectedAccount) {
    return (
      <AdminShell>
        <main className="mx-auto max-w-[1320px] px-5 py-6 lg:px-10">
          <button
            type="button"
            onClick={closeToList}
            className="mb-4 inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-primary"
          >
            <ArrowLeft size={16} /> Danh sách tài khoản
          </button>
          <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-orange-500">
                Chi tiết tài khoản
              </p>
              <div className="mt-1 flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-black text-slate-800">
                  {selectedAccount.organization}
                </h1>
                <StatusBadge status={selectedAccount.status} />
              </div>
            </div>
            <button
              type="button"
              onClick={() => openEdit(selectedAccount)}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-orange-200 bg-orange-50 px-4 text-sm font-extrabold text-orange-700 hover:bg-orange-100"
            >
              <Pencil size={15} /> Sửa thông tin
            </button>
          </div>

          {notice && (
            <div className="mb-4 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
              <CheckCircle2 size={16} /> {notice}
            </div>
          )}

          <div className="space-y-5">
            <SectionCard title="Thông tin chung">
              <div className="grid gap-x-8 gap-y-5 p-5 md:grid-cols-3">
                <div>
                  <p className="detail-label">Tên đơn vị</p>
                  <p className="detail-value">{selectedAccount.organization}</p>
                </div>
                <div>
                  <p className="detail-label">Họ tên người phụ trách</p>
                  <p className="detail-value">
                    {selectedAccount.responsibleName}
                  </p>
                </div>
                <div>
                  <p className="detail-label">Chức vụ</p>
                  <p className="detail-value">{selectedAccount.position}</p>
                </div>
                <div>
                  <p className="detail-label">Loại đơn vị</p>
                  <p className="detail-value">{selectedAccount.unitType}</p>
                </div>
                <div>
                  <p className="detail-label">Cấp quản lý</p>
                  <p className="detail-value">
                    {selectedAccount.managementLevel}
                  </p>
                </div>
                <div>
                  <p className="detail-label">Số điện thoại</p>
                  <p className="detail-value">{selectedAccount.phone}</p>
                </div>
                <div>
                  <p className="detail-label">Email liên hệ</p>
                  <p className="detail-value text-orange-600">
                    {selectedAccount.email}
                  </p>
                </div>
                <div>
                  <p className="detail-label">Tài khoản</p>
                  <p className="inline-flex rounded-lg bg-orange-50 px-2 py-1 text-sm font-bold text-orange-700">
                    {selectedAccount.username}
                  </p>
                </div>
                <div>
                  <p className="detail-label">Phạm vi quản lý</p>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600">
                      {selectedAccount.ward}
                    </span>
                    {selectedAccount.oldLocality && (
                      <LegacyLocalityBadge value={selectedAccount.oldLocality} />
                    )}
                  </div>
                </div>
              </div>
            </SectionCard>

            <SectionCard
              title={`Trường học thuộc phạm vi quản lý (${String(selectedAccount.schools.length).padStart(2, "0")})`}
              action={
                <span className="text-xs font-bold text-orange-600">
                  Xem tất cả
                </span>
              }
            >
              {selectedAccount.schools.length ? (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[700px] text-left text-sm">
                    <thead className="bg-slate-50 text-[10px] font-extrabold uppercase tracking-[0.08em] text-slate-400">
                      <tr>
                        <th className="px-5 py-3">Tên trường</th>
                        <th className="px-4 py-3">Loại hình</th>
                        <th className="px-4 py-3">Trạng thái ATTP</th>
                        <th className="px-4 py-3">Ngày gắn</th>
                        <th className="px-5 py-3 text-right">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {selectedAccount.schools.map((school) => (
                        <tr key={school.name} className="hover:bg-slate-50/70">
                          <td className="px-5 py-4">
                            <p className="font-bold text-slate-700">
                              {school.name}
                            </p>
                            <p className="mt-1 text-xs text-slate-400">
                              {school.address}
                            </p>
                          </td>
                          <td className="px-4 py-4 text-xs font-semibold text-slate-500">
                            Đa điểm
                          </td>
                          <td className="px-4 py-4">
                            <span
                              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold ${
                                school.status === "Đã thẩm định"
                                  ? "bg-emerald-50 text-emerald-700"
                                  : "bg-amber-50 text-amber-700"
                              }`}
                            >
                              <span className="h-1.5 w-1.5 rounded-full bg-current" />
                              {school.status}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-xs font-semibold text-slate-500">
                            {school.attachedAt}
                          </td>
                          <td className="px-5 py-4 text-right">
                            <button
                              type="button"
                              className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-primary"
                              title="Xem cơ sở"
                              aria-label={`Xem ${school.name}`}
                            >
                              <Eye size={17} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="px-5 py-10 text-center text-sm text-slate-500">
                  Tài khoản này chưa có trường học trong phạm vi quản lý.
                </div>
              )}
            </SectionCard>

            <SectionCard title="Quyền đang được cấp">
              <div className="grid gap-3 p-5 md:grid-cols-2">
                {permissionCatalog
                  .filter((permission) => selectedAccount.permissions[permission.id])
                  .map((permission) => (
                    <div
                      key={permission.id}
                      className="flex gap-3 rounded-xl border border-slate-100 bg-slate-50/70 p-3"
                    >
                      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                        <Check size={14} />
                      </span>
                      <div>
                        <p className="text-sm font-bold text-slate-700">
                          {permission.label}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          {permission.description}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </SectionCard>
          </div>

          <div className="mt-6 flex flex-col gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={() => toggleLock(selectedAccount)}
              className={`inline-flex h-10 items-center justify-center gap-2 rounded-xl border px-4 text-sm font-bold ${
                selectedAccount.status === "Đang hoạt động"
                  ? "border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100"
                  : "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
              }`}
            >
              {selectedAccount.status === "Đang hoạt động" ? (
                <Lock size={15} />
              ) : (
                <Unlock size={15} />
              )}
              {selectedAccount.status === "Đang hoạt động"
                ? "Khóa tài khoản"
                : "Mở khóa tài khoản"}
            </button>
            <button
              type="button"
              onClick={() => resetPassword(selectedAccount)}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-600 hover:bg-slate-50"
            >
              <KeyRound size={15} /> Reset mật khẩu
            </button>
            <div className="sm:ml-auto">
              {deletePending ? (
                <div className="flex items-center gap-2 text-xs font-semibold text-rose-700">
                  <span>Gỡ tài khoản này?</span>
                  <button
                    type="button"
                    onClick={() => removeAccount(selectedAccount)}
                    className="rounded-lg bg-rose-600 px-3 py-2 font-bold text-white"
                  >
                    Xác nhận
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeletePending(false)}
                    className="rounded-lg border border-slate-200 px-3 py-2 text-slate-600"
                  >
                    Hủy
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setDeletePending(true)}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-rose-600 px-4 text-sm font-bold text-white hover:bg-rose-700"
                >
                  <Trash2 size={15} /> Gỡ khỏi hệ thống
                </button>
              )}
            </div>
          </div>
        </main>
      </AdminShell>
    );
  }

  return (
    <AdminShell>
      <main className="mx-auto max-w-[1400px] px-5 py-6 lg:px-10">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-orange-500">
              Hệ thống quản trị
            </p>
            <h1 className="mt-1 text-2xl font-black text-slate-800">
              Danh sách tài khoản địa bàn
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-500">
              Quản lý tài khoản cán bộ, phạm vi dữ liệu và quyền truy cập theo
              từng cấp quản lý.
            </p>
          </div>
          <button
            type="button"
            onClick={openCreate}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 text-sm font-extrabold text-white shadow-lg shadow-orange-500/20 hover:bg-orange-600"
            data-testid="button-create-account"
          >
            <Plus size={17} /> Tạo tài khoản mới
          </button>
        </div>

        <section className="mb-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_4px_18px_rgba(15,23,42,.035)]">
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-[1.5fr_1fr_1fr_1fr_auto]">
            <label className="relative block">
              <span className="sr-only">Tìm kiếm tài khoản</span>
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Tên đơn vị / người phụ trách..."
                className="h-11 w-full rounded-xl border border-slate-200 bg-[#fbfcfd] pl-9 pr-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                data-testid="input-account-search"
              />
            </label>
            <SelectField
              label=""
              value={managementLevel}
              options={managementOptions}
              onChange={setManagementLevel}
            />
            <SelectField
              label=""
              value={province}
              options={provinceOptions}
              onChange={setProvince}
            />
            <SelectField
              label=""
              value={ward}
              options={wardOptions}
              onChange={setWard}
            />
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setManagementLevel("Tất cả cấp quản lý");
                setProvince("Tất cả tỉnh/thành phố");
                setWard("Tất cả xã/phường");
              }}
              className="h-11 rounded-xl border border-slate-200 px-4 text-sm font-bold text-slate-500 hover:bg-slate-50"
            >
              Xóa lọc
            </button>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-500">
            <Users size={14} className="text-orange-500" />
            Hiển thị <strong className="text-slate-700">{filteredAccounts.length}</strong>{" "}
            trên tổng số <strong className="text-slate-700">{accounts.length}</strong>{" "}
            tài khoản
            <span className="mx-1 text-slate-300">·</span>
            <span title="Địa danh cũ được hiển thị trong tooltip khi rê chuột">
              <Info size={13} className="mr-1 inline text-amber-600" />
              Có hỗ trợ tra cứu địa danh cũ
            </span>
          </div>
        </section>

        {notice && (
          <div className="mb-4 flex items-center justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
            <span className="flex items-center gap-2">
              <CheckCircle2 size={16} /> {notice}
            </span>
            <button type="button" onClick={() => setNotice("")} aria-label="Đóng thông báo">
              <X size={16} />
            </button>
          </div>
        )}

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_4px_18px_rgba(15,23,42,.035)]">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1120px] text-left text-sm">
              <thead className="bg-slate-50 text-[10px] font-extrabold uppercase tracking-[0.08em] text-slate-400">
                <tr>
                  <th className="px-5 py-4">Tên đơn vị</th>
                  <th className="px-4 py-4">Cấp / loại</th>
                  <th className="px-4 py-4">Phạm vi</th>
                  <th className="px-4 py-4">Người phụ trách</th>
                  <th className="px-4 py-4">SĐT / Email</th>
                  <th className="px-4 py-4 text-center">Cơ sở quản lý</th>
                  <th className="px-4 py-4">Tài khoản</th>
                  <th className="px-5 py-4 text-right">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredAccounts.map((account) => (
                  <tr key={account.id} className="transition-colors hover:bg-slate-50/70">
                    <td className="px-5 py-4">
                      <button
                        type="button"
                        onClick={() => openDetail(account)}
                        className="text-left font-extrabold text-slate-700 hover:text-orange-600"
                      >
                        {account.organization}
                      </button>
                      {account.oldLocality && (
                        <div className="mt-2">
                          <LegacyLocalityBadge value={account.oldLocality} compact />
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-xs font-bold text-slate-600">
                        {account.managementLevel}
                      </p>
                      <span className="mt-1 inline-flex rounded-md bg-sky-50 px-2 py-1 text-[10px] font-bold text-sky-700">
                        {account.unitType}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-xs font-semibold text-slate-600">
                        {account.ward}
                      </p>
                      <p className="mt-1 text-[10px] text-slate-400">
                        {account.province}
                      </p>
                    </td>
                    <td className="px-4 py-4">
                      <p className="font-semibold text-slate-600">
                        {account.responsibleName}
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        {account.position}
                      </p>
                    </td>
                    <td className="px-4 py-4 text-xs text-slate-500">
                      <p>{account.phone}</p>
                      <p className="mt-1 max-w-[170px] truncate">{account.email}</p>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <button
                        type="button"
                        onClick={() => openDetail(account)}
                        className="font-extrabold text-orange-600 underline decoration-orange-200 underline-offset-2"
                      >
                        {account.managedFacilities}
                      </button>
                    </td>
                    <td className="px-4 py-4">
                      <p className="font-bold text-slate-600">{account.username}</p>
                      <div className="mt-1">
                        <StatusBadge status={account.status} />
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => openDetail(account)}
                          className="rounded-lg p-2 text-sky-600 hover:bg-sky-50"
                          title="Xem chi tiết"
                          aria-label={`Xem ${account.organization}`}
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => openEdit(account)}
                          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
                          title="Chỉnh sửa"
                          aria-label={`Sửa ${account.organization}`}
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleLock(account)}
                          className={`rounded-lg p-2 ${
                            account.status === "Đang hoạt động"
                              ? "text-rose-500 hover:bg-rose-50"
                              : "text-emerald-600 hover:bg-emerald-50"
                          }`}
                          title={
                            account.status === "Đang hoạt động"
                              ? "Khóa tài khoản"
                              : "Mở khóa tài khoản"
                          }
                          aria-label={`Đổi trạng thái ${account.organization}`}
                        >
                          {account.status === "Đang hoạt động" ? (
                            <Lock size={16} />
                          ) : (
                            <Unlock size={16} />
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => resetPassword(account)}
                          className="rounded-lg p-2 text-orange-500 hover:bg-orange-50"
                          title="Reset mật khẩu"
                          aria-label={`Reset mật khẩu ${account.organization}`}
                        >
                          <RotateCcw size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!filteredAccounts.length && (
              <div className="px-5 py-16 text-center">
                <Building2 className="mx-auto text-slate-300" size={32} />
                <p className="mt-3 text-sm font-bold text-slate-600">
                  Không tìm thấy tài khoản phù hợp
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  Thử thay đổi điều kiện lọc hoặc tạo tài khoản mới.
                </p>
              </div>
            )}
          </div>
          <div className="flex flex-col gap-3 border-t border-slate-100 px-5 py-4 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
            <span>
              Hiển thị 1–{filteredAccounts.length} trong số {filteredAccounts.length}{" "}
              đơn vị
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled
                className="rounded-lg border border-slate-200 p-2 text-slate-300"
                aria-label="Trang trước"
              >
                <ChevronRight className="rotate-180" size={15} />
              </button>
              <span className="rounded-lg bg-orange-500 px-3 py-2 font-bold text-white">
                1
              </span>
              <button
                type="button"
                disabled
                className="rounded-lg border border-slate-200 p-2 text-slate-300"
                aria-label="Trang sau"
              >
                <ChevronRight size={15} />
              </button>
            </div>
          </div>
        </section>
      </main>
    </AdminShell>
  );
}