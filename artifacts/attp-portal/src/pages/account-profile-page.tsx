import { useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  KeyRound,
  LockKeyhole,
  Save,
  UserRound,
} from "lucide-react";
import { Link } from "wouter";
import { AdminShell } from "@/components/portal-ui";
import { findManagedAdminAccount } from "@/lib/admin-permissions";

type ManagedAccount = NonNullable<
  ReturnType<typeof findManagedAdminAccount>
>;

const roleLabels: Record<ManagedAccount["role"], string> = {
  director: "Quản trị viên cấp Sở",
  specialist: "Cán bộ chuyên môn",
  ward: "Cán bộ địa bàn",
};

function readCurrentAccount() {
  const username = sessionStorage.getItem("attp-session-username") || "";
  return username ? findManagedAdminAccount(username) : null;
}

function updateStoredAccount(
  username: string,
  patch: Record<string, string>,
) {
  try {
    const raw = localStorage.getItem("attp-admin-accounts");
    const accounts: unknown = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(accounts)) return false;
    const index = accounts.findIndex(
      (item) =>
        item &&
        typeof item === "object" &&
        String((item as Record<string, unknown>).username ?? "")
          .trim()
          .toLowerCase() === username.trim().toLowerCase(),
    );
    if (index < 0) return false;
    accounts[index] = { ...(accounts[index] as object), ...patch };
    localStorage.setItem("attp-admin-accounts", JSON.stringify(accounts));
    return true;
  } catch {
    return false;
  }
}

function ReadOnlyField({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-xs font-bold text-slate-500">{label}</p>
      <p className="mt-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-semibold text-slate-700">
        {value || "Chưa cập nhật"}
      </p>
    </div>
  );
}

export function AdminProfilePage() {
  const username = sessionStorage.getItem("attp-session-username") || "";
  const [account, setAccount] = useState<ManagedAccount | null>(
    readCurrentAccount,
  );
  const [profileForm, setProfileForm] = useState(() => ({
    responsibleName: account?.responsibleName || "",
    position: account?.position || "",
    phone: account?.phone || "",
    email: account?.email || "",
  }));
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  const updateProfileForm = (
    key: keyof typeof profileForm,
    value: string,
  ) => {
    setProfileForm((current) => ({ ...current, [key]: value }));
  };

  const updatePasswordForm = (
    key: keyof typeof passwordForm,
    value: string,
  ) => {
    setPasswordForm((current) => ({ ...current, [key]: value }));
  };

  const saveProfile = () => {
    setNotice("");
    setError("");
    if (!account) return;
    if (!profileForm.responsibleName.trim()) {
      setError("Vui lòng nhập họ tên người phụ trách.");
      return;
    }
    if (
      profileForm.email.trim() &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileForm.email.trim())
    ) {
      setError("Vui lòng nhập địa chỉ email hợp lệ.");
      return;
    }
    const saved = updateStoredAccount(username, {
      responsibleName: profileForm.responsibleName.trim(),
      position: profileForm.position.trim(),
      phone: profileForm.phone.trim(),
      email: profileForm.email.trim(),
    });
    if (!saved) {
      setError("Không thể cập nhật hồ sơ. Vui lòng thử lại.");
      return;
    }
    const refreshed = readCurrentAccount();
    setAccount(refreshed);
    sessionStorage.setItem(
      "attp-session-name",
      profileForm.responsibleName.trim(),
    );
    setNotice("Đã cập nhật thông tin cá nhân.");
  };

  const changePassword = () => {
    setNotice("");
    setError("");
    if (!account) return;
    if (account.password && passwordForm.currentPassword !== account.password) {
      setError("Mật khẩu hiện tại chưa đúng.");
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      setError("Mật khẩu mới phải có ít nhất 6 ký tự.");
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError("Mật khẩu xác nhận chưa khớp.");
      return;
    }
    const saved = updateStoredAccount(username, {
      password: passwordForm.newPassword,
    });
    if (!saved) {
      setError("Không thể đổi mật khẩu. Vui lòng thử lại.");
      return;
    }
    setAccount(readCurrentAccount());
    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setNotice("Đã đổi mật khẩu thành công.");
  };

  if (!account) {
    return (
      <AdminShell>
        <main className="mx-auto max-w-4xl px-5 py-8 lg:px-10">
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline"
          >
            <ArrowLeft size={16} /> Quay lại Dashboard
          </Link>
          <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <UserRound className="mx-auto text-slate-400" size={36} />
            <h1 className="mt-4 text-2xl font-extrabold text-slate-800">
              Hồ sơ tài khoản
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Hồ sơ cá nhân chỉ có sẵn cho tài khoản được tạo từ Quản lý tài
              khoản.
            </p>
          </section>
        </main>
      </AdminShell>
    );
  }

  return (
    <AdminShell>
      <main className="mx-auto max-w-5xl px-5 py-8 lg:px-10">
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline"
        >
          <ArrowLeft size={16} /> Quay lại Dashboard
        </Link>
        <div className="mt-5 flex flex-col gap-3 border-b border-slate-200 pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-orange-500">
              Tài khoản cá nhân
            </p>
            <h1 className="mt-1 text-3xl font-black tracking-tight text-slate-800">
              Hồ sơ tài khoản
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Xem thông tin tài khoản và tự cập nhật thông tin cá nhân.
            </p>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700">
            <CheckCircle2 size={15} /> {account.status}
          </span>
        </div>

        {(notice || error) && (
          <div
            className={`mt-5 flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold ${
              error
                ? "border-rose-200 bg-rose-50 text-rose-700"
                : "border-emerald-200 bg-emerald-50 text-emerald-700"
            }`}
          >
            {error || notice}
          </div>
        )}

        <div className="mt-6 space-y-5">
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <UserRound size={18} />
              </span>
              <div>
                <h2 className="font-extrabold text-slate-800">
                  Thông tin tài khoản
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  Thông tin đơn vị và quyền truy cập do quản trị viên quản lý.
                </p>
              </div>
            </div>
            <div className="grid gap-4 p-5 sm:grid-cols-2">
              <ReadOnlyField label="Tên đăng nhập" value={account.username} />
              <ReadOnlyField
                label="Vai trò"
                value={roleLabels[account.role]}
              />
              <ReadOnlyField label="Tên đơn vị" value={account.organization} />
              <ReadOnlyField label="Loại đơn vị" value={account.unitType} />
              <ReadOnlyField
                label="Cấp quản lý"
                value={account.managementLevel}
              />
              <ReadOnlyField label="Tỉnh/thành phố" value={account.province} />
              <ReadOnlyField label="Xã/phường quản lý" value={account.ward} />
              <ReadOnlyField
                label="Quyền truy cập"
                value={`${Object.values(account.permissions).filter(Boolean).length} chức năng`}
              />
            </div>
          </section>

          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <UserRound size={18} />
              </span>
              <div>
                <h2 className="font-extrabold text-slate-800">
                  Thông tin cá nhân
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  Bạn có thể tự cập nhật các thông tin liên hệ của mình.
                </p>
              </div>
            </div>
            <div className="grid gap-4 p-5 sm:grid-cols-2">
              <label className="text-sm font-bold text-slate-700">
                Họ tên người phụ trách
                <input
                  value={profileForm.responsibleName}
                  onChange={(event) =>
                    updateProfileForm("responsibleName", event.target.value)
                  }
                  className="mt-1.5 h-11 w-full rounded-xl border border-input bg-background px-3 text-sm font-medium outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
                />
              </label>
              <label className="text-sm font-bold text-slate-700">
                Chức vụ
                <input
                  value={profileForm.position}
                  onChange={(event) =>
                    updateProfileForm("position", event.target.value)
                  }
                  className="mt-1.5 h-11 w-full rounded-xl border border-input bg-background px-3 text-sm font-medium outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
                />
              </label>
              <label className="text-sm font-bold text-slate-700">
                Số điện thoại
                <input
                  value={profileForm.phone}
                  onChange={(event) =>
                    updateProfileForm("phone", event.target.value)
                  }
                  className="mt-1.5 h-11 w-full rounded-xl border border-input bg-background px-3 text-sm font-medium outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
                />
              </label>
              <label className="text-sm font-bold text-slate-700">
                Email
                <input
                  type="email"
                  value={profileForm.email}
                  onChange={(event) =>
                    updateProfileForm("email", event.target.value)
                  }
                  className="mt-1.5 h-11 w-full rounded-xl border border-input bg-background px-3 text-sm font-medium outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
                />
              </label>
              <div className="sm:col-span-2">
                <button
                  type="button"
                  onClick={saveProfile}
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground hover:bg-primary/90"
                >
                  <Save size={16} /> Lưu thông tin cá nhân
                </button>
              </div>
            </div>
          </section>

          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <KeyRound size={18} />
              </span>
              <div>
                <h2 className="font-extrabold text-slate-800">Đổi mật khẩu</h2>
                <p className="mt-1 text-xs text-slate-500">
                  Mật khẩu mới cần có ít nhất 6 ký tự.
                </p>
              </div>
            </div>
            <div className="grid gap-4 p-5 sm:grid-cols-2">
              {account.password ? (
                <label className="text-sm font-bold text-slate-700 sm:col-span-2">
                  Mật khẩu hiện tại
                  <input
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={(event) =>
                      updatePasswordForm(
                        "currentPassword",
                        event.target.value,
                      )
                    }
                    autoComplete="current-password"
                    className="mt-1.5 h-11 w-full rounded-xl border border-input bg-background px-3 text-sm font-medium outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 sm:max-w-md"
                  />
                </label>
              ) : (
                <div className="flex items-start gap-2 rounded-xl bg-amber-50 p-3 text-xs font-semibold text-amber-800 sm:col-span-2">
                  <LockKeyhole size={15} className="mt-0.5 shrink-0" />
                  Đây là lần đầu thiết lập mật khẩu cho tài khoản này, không cần
                  nhập mật khẩu hiện tại.
                </div>
              )}
              <label className="text-sm font-bold text-slate-700">
                Mật khẩu mới
                <input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(event) =>
                    updatePasswordForm("newPassword", event.target.value)
                  }
                  autoComplete="new-password"
                  className="mt-1.5 h-11 w-full rounded-xl border border-input bg-background px-3 text-sm font-medium outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
                />
              </label>
              <label className="text-sm font-bold text-slate-700">
                Xác nhận mật khẩu mới
                <input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(event) =>
                    updatePasswordForm(
                      "confirmPassword",
                      event.target.value,
                    )
                  }
                  autoComplete="new-password"
                  className="mt-1.5 h-11 w-full rounded-xl border border-input bg-background px-3 text-sm font-medium outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
                />
              </label>
              <div className="sm:col-span-2">
                <button
                  type="button"
                  onClick={changePassword}
                  className="inline-flex items-center gap-2 rounded-xl border border-primary/30 bg-primary/5 px-4 py-2.5 text-sm font-bold text-primary hover:bg-primary/10"
                >
                  <KeyRound size={16} /> Đổi mật khẩu
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>
    </AdminShell>
  );
}