import { type ReactNode, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "wouter";
import {
  ArrowRight,
  BarChart3,
  Bell,
  Building2,
  CalendarDays,
  ClipboardCheck,
  ClipboardList,
  ChevronDown,
  FileSearch,
  Home,
  LayoutDashboard,
  LogIn,
  LogOut,
  Menu,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  TriangleAlert,
  Utensils,
  X,
  type LucideIcon,
} from "lucide-react";
import emblemPath from "../../../../.conversation/attached_assets/Emblem_of_Vietnam.svg_1788926527100.webp";
import {
  ADMIN_SESSION_PERMISSIONS_KEY,
  adminNavigationSections,
  findManagedAdminAccount,
  getSessionAdminPermissions,
  type AdminMenuPermissionId,
} from "@/lib/admin-permissions";

export function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <Link
      href="/"
      className="focus-ring flex items-center gap-3"
      data-testid="link-brand-home"
    >
      <img
        src={emblemPath}
        alt="Quốc huy Việt Nam"
        className={
          compact ? "h-11 w-11 object-contain" : "h-14 w-14 object-contain"
        }
        data-testid="img-national-emblem"
      />
      {!compact && (
        <span className="max-w-[270px] leading-tight">
          <span className="block text-xs font-bold text-foreground">
            Sở An Toàn Thực Phẩm TPHCM
          </span>
        </span>
      )}
    </Link>
  );
}

type Locale = "vi" | "en";

const localeOptions: Array<{
  code: Locale;
  shortCode: string;
  nativeLabel: string;
}> = [
  { code: "vi", shortCode: "VI", nativeLabel: "Tiếng Việt" },
  { code: "en", shortCode: "EN", nativeLabel: "English" },
];

function LocaleFlag({ locale }: { locale: Locale }) {
  if (locale === "en") {
    return (
      <svg
        viewBox="0 0 28 20"
        role="img"
        aria-label="Cờ Hoa Kỳ"
        className="h-4 w-[22px] shrink-0 overflow-hidden rounded-[3px] shadow-sm"
      >
        <rect width="28" height="20" fill="#fff" />
        <path
          fill="#b22234"
          d="M0 0h28v2H0zm0 4h28v2H0zm0 4h28v2H0zm0 4h28v2H0zm0 4h28v2H0z"
        />
        <rect width="12" height="10.8" fill="#3c3b6e" />
        <path
          fill="#fff"
          d="M1.2 1.2h1v1h-1zm3 0h1v1h-1zm3 0h1v1h-1zm3 0h1v1h-1zM2.7 3.1h1v1h-1zm3 0h1v1h-1zm3 0h1v1h-1zm-7.5 1.9h1v1h-1zm3 0h1v1h-1zm3 0h1v1h-1zm3 0h1v1h-1zm-7.5 1.9h1v1h-1zm3 0h1v1h-1zm3 0h1v1h-1z"
        />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 28 20"
      role="img"
      aria-label="Cờ Việt Nam"
      className="h-4 w-[22px] shrink-0 overflow-hidden rounded-[3px] shadow-sm"
    >
      <rect width="28" height="20" fill="#da251d" />
      <path
        fill="#ffdd00"
        d="m14 3.1 1.2 3.7h3.9l-3.1 2.3 1.2 3.7-3.2-2.3-3.2 2.3 1.2-3.7-3.1-2.3h3.9z"
      />
    </svg>
  );
}

function LanguageSwitcher() {
  const [open, setOpen] = useState(false);
  const [locale, setLocale] = useState<Locale>(() => {
    const stored = sessionStorage.getItem("attp-locale");
    return stored === "en" ? "en" : "vi";
  });
  const containerRef = useRef<HTMLDivElement>(null);
  const selectedLocale =
    localeOptions.find((option) => option.code === locale) ?? localeOptions[0];

  useEffect(() => {
    document.documentElement.lang = locale === "vi" ? "vi" : "en";
    sessionStorage.setItem("attp-locale", locale);
  }, [locale]);

  useEffect(() => {
    if (!open) return;
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="focus-ring inline-flex h-9 items-center gap-1.5 rounded-full border border-border bg-card/80 px-2.5 text-xs font-extrabold tracking-[.04em] text-foreground shadow-sm transition-colors hover:border-primary/35 hover:bg-secondary"
        aria-label={`Ngôn ngữ: ${selectedLocale.nativeLabel}`}
        aria-expanded={open}
        aria-haspopup="listbox"
        data-testid="button-language-switcher"
      >
        <LocaleFlag locale={locale} />
        <span>{selectedLocale.shortCode}</span>
        <ChevronDown
          size={13}
          strokeWidth={2.5}
          className={`text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </button>
      {open && (
        <div
          className="absolute right-0 top-full z-50 mt-2 w-44 overflow-hidden rounded-xl border border-border bg-card p-1.5 text-left shadow-xl shadow-primary/10"
          role="listbox"
          aria-label="Chọn ngôn ngữ"
          data-testid="menu-language-options"
        >
          <p className="px-2.5 pb-1.5 pt-1 text-[10px] font-extrabold uppercase tracking-[.14em] text-muted-foreground">
            Ngôn ngữ
          </p>
          {localeOptions.map((option) => (
            <button
              key={option.code}
              type="button"
              role="option"
              aria-selected={locale === option.code}
              onClick={() => {
                setLocale(option.code);
                setOpen(false);
              }}
              className={`focus-ring flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left transition-colors ${
                locale === option.code
                  ? "bg-secondary text-primary"
                  : "text-foreground hover:bg-secondary/70"
              }`}
              data-testid={`button-language-${option.code}`}
            >
              <LocaleFlag locale={option.code} />
              <span className="min-w-0 flex-1">
                <span className="block text-xs font-extrabold">
                  {option.shortCode}
                </span>
                <span className="block text-[11px] text-muted-foreground">
                  {option.nativeLabel}
                </span>
              </span>
              {locale === option.code && (
                <span
                  className="h-1.5 w-1.5 rounded-full bg-primary"
                  aria-hidden="true"
                />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function PublicHeader() {
  const [location] = useLocation();
  const [, navigate] = useLocation();
  const [open, setOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [facilityAccount, setFacilityAccount] = useState(
    () => sessionStorage.getItem("attp-session-role") === "facility",
  );
  const notificationStorageKey = `attp-read-notifications:${sessionStorage.getItem("attp-session-username") || "coso.demo"}`;
  const notifications = [
    {
      id: "incident-update",
      title: "Cảnh báo ATTP cần cập nhật",
      text: "Sở vừa gửi cảnh báo. Vui lòng mở hồ sơ và gửi thông tin thực tế của nhà trường.",
      time: "Mới nhất",
      href: "/facility/incidents",
    },
  ];
  const [readNotifications, setReadNotifications] = useState<string[]>(() => {
    try {
      return JSON.parse(sessionStorage.getItem(notificationStorageKey) || "[]");
    } catch {
      return [];
    }
  });
  const unreadCount = notifications.filter(
    (item) => !readNotifications.includes(item.id),
  ).length;
  const nav = facilityAccount
    ? [
        ["/", "Tổng quan"],
        ["/lookup", "Tra cứu"],
        ["/news", "Tin tức & sự kiện"],
        ["/facility/incidents", "Cảnh báo ATTP"],
      ]
    : [
        ["/", "Tổng quan"],
        ["/lookup", "Tra cứu"],
        ["/news", "Tin tức & sự kiện"],
        ["/register", "Đăng ký hồ sơ"],
      ];
  useEffect(() => {
    const syncSession = () =>
      setFacilityAccount(
        sessionStorage.getItem("attp-session-role") === "facility",
      );
    window.addEventListener("storage", syncSession);
    return () => window.removeEventListener("storage", syncSession);
  }, []);
  const logout = () => {
    sessionStorage.removeItem("attp-session-role");
    sessionStorage.removeItem("attp-reviewer-session");
    setFacilityAccount(false);
    setNotificationsOpen(false);
    navigate("/");
  };
  const openNotification = (id: string) => {
    const nextRead = readNotifications.includes(id)
      ? readNotifications
      : [...readNotifications, id];
    setReadNotifications(nextRead);
    sessionStorage.setItem(notificationStorageKey, JSON.stringify(nextRead));
    setNotificationsOpen(false);
    const notification = notifications.find((item) => item.id === id);
    navigate(notification?.href ?? "/facility/incidents");
  };
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 shadow-[0_8px_30px_hsl(158_37%_15%/.04)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
        <BrandMark />
        <nav
          className="hidden items-center gap-1 md:flex"
          aria-label="Điều hướng chính"
        >
          {nav.map(([href, label]) => (
            <Link
              key={href}
              href={href}
              className={`focus-ring rounded-full px-4 py-2.5 text-sm font-semibold transition-all ${location === href ? "bg-primary text-primary-foreground shadow-md shadow-primary/20" : "text-muted-foreground hover:bg-secondary hover:text-foreground"}`}
              data-testid={`link-nav-${label}`}
            >
              {label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          {facilityAccount ? (
            <>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setNotificationsOpen((current) => !current)}
                  className="focus-ring relative rounded-full border border-primary/25 p-2 text-primary hover:bg-secondary"
                  aria-label="Thông báo hồ sơ cơ sở"
                  aria-expanded={notificationsOpen}
                  data-testid="button-facility-notifications"
                >
                  <Bell size={17} />
                  {unreadCount > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-extrabold text-destructive-foreground">
                      {unreadCount}
                    </span>
                  )}
                </button>
                {notificationsOpen && (
                  <div
                    className="absolute right-0 top-full z-50 mt-3 w-[min(21rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-border bg-card text-left shadow-2xl shadow-primary/10"
                    role="region"
                    aria-label="Danh sách thông báo"
                    data-testid="panel-facility-notifications"
                  >
                    <div className="flex items-center justify-between border-b border-border px-4 py-3">
                      <div>
                        <p className="text-sm font-extrabold">Thông báo</p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {unreadCount
                            ? `${unreadCount} thông báo chưa đọc`
                            : "Bạn đã xem hết thông báo"}
                        </p>
                      </div>
                      <Bell size={16} className="text-primary" />
                    </div>
                    <div className="divide-y divide-border">
                      {notifications.map((item) => (
                        <button
                          type="button"
                          key={item.id}
                          onClick={() => openNotification(item.id)}
                          className={`focus-ring block w-full px-4 py-3 text-left transition-colors hover:bg-secondary ${readNotifications.includes(item.id) ? "bg-card" : "bg-secondary/45"}`}
                          data-testid={`button-notification-${item.id}`}
                        >
                          <div className="flex items-start gap-3">
                            <span
                              className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${readNotifications.includes(item.id) ? "bg-border" : "bg-destructive"}`}
                            />
                            <span className="min-w-0">
                              <span className="flex items-center justify-between gap-3">
                                <span className="text-sm font-bold text-foreground">
                                  {item.title}
                                </span>
                                <span className="shrink-0 text-[11px] font-medium text-muted-foreground">
                                  {item.time}
                                </span>
                              </span>
                              <span className="mt-1 block text-xs leading-5 text-muted-foreground">
                                {item.text}
                              </span>
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                    <Link
                      href="/facility/incidents"
                      onClick={() => setNotificationsOpen(false)}
                      className="block border-t border-border px-4 py-3 text-center text-xs font-bold text-primary hover:bg-secondary"
                      data-testid="link-view-facility-alerts-from-notifications"
                    >
                      Xem cảnh báo ATTP
                    </Link>
                  </div>
                )}
              </div>
              <button
                onClick={logout}
                className="focus-ring hidden items-center gap-2 rounded-full border border-border px-3 py-2 text-xs font-bold text-muted-foreground hover:border-primary/30 hover:text-primary sm:inline-flex"
                data-testid="button-public-facility-logout"
              >
                <LogOut size={15} /> Đăng xuất
              </button>
            </>
          ) : (
            <Link
              href="/admin/login"
              className="focus-ring hidden items-center gap-2 rounded-full border border-primary/25 px-3 py-2 text-xs font-bold text-primary hover:bg-secondary sm:inline-flex"
              data-testid="link-reviewer-login"
            >
              <LogIn size={15} /> Đăng nhập
            </Link>
          )}
          <LanguageSwitcher />
          <button
            className="focus-ring rounded-lg p-2 md:hidden"
            onClick={() => setOpen(!open)}
            aria-label={open ? "Đóng menu" : "Mở menu"}
            data-testid="button-mobile-menu"
          >
            {open ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </div>
      {open && (
        <nav
          className="border-t border-border px-5 py-3 md:hidden"
          aria-label="Điều hướng di động"
        >
          {nav.map(([href, label]) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className="block border-b border-border/60 py-3 text-sm font-semibold"
              data-testid={`link-mobile-${label}`}
            >
              {label}
            </Link>
          ))}
          {facilityAccount ? (
            <button
              onClick={logout}
              className="block py-3 text-left text-sm font-bold text-destructive"
              data-testid="button-mobile-facility-logout"
            >
              Đăng xuất
            </button>
          ) : (
            <Link
              href="/admin/login"
              onClick={() => setOpen(false)}
              className="block py-3 text-sm font-bold text-primary"
              data-testid="link-mobile-login"
            >
              Đăng nhập
            </Link>
          )}
        </nav>
      )}
    </header>
  );
}

export function PublicFooter() {
  return (
    <footer className="border-t border-border bg-primary py-10 text-primary-foreground">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-5 md:flex-row md:items-end md:justify-between lg:px-8">
        <div>
          <BrandMark compact />
          <p className="mt-3 max-w-sm text-sm leading-6 text-primary-foreground/75">
            Minh bạch hơn trong từng lựa chọn thực phẩm. Kênh thông tin chính
            thức của Sở An toàn thực phẩm Thành phố Hồ Chí Minh.
          </p>
        </div>
        <div className="text-sm leading-6 text-primary-foreground/75">
          <p className="font-bold text-primary-foreground">
            Sở An toàn thực phẩm Thành phố Hồ Chí Minh
          </p>
          <p>Trụ sở chính: 57 Nguyễn Thị Minh Khai, phường Bến Thành, TP.HCM</p>
          <p>Địa chỉ: 18 Cách Mạng Tháng 8, phường Bến Thành, TP.HCM</p>
          <p>Số điện thoại: 028 3930 6001 · Fax: 028 3930 703</p>
          <p>Đường dây nóng: 028 3930 1714</p>
        </div>
      </div>
    </footer>
  );
}

export function PublicShell({ children }: { children: ReactNode }) {
  return (
    <div className="portal-noise min-h-[100dvh] bg-background">
      <PublicHeader />
      {children}
      <PublicFooter />
    </div>
  );
}

const adminMenuIcons: Record<AdminMenuPermissionId, LucideIcon> = {
  schedule: CalendarDays,
  minutes: ClipboardList,
  criteria: SlidersHorizontal,
  incidents: TriangleAlert,
  dashboard: LayoutDashboard,
  facilities: Building2,
  facilityProfiles: FileSearch,
  threeStep: ClipboardCheck,
  menus: Utensils,
  recipes: FileSearch,
  accounts: ShieldCheck,
  reports: BarChart3,
};

export function AdminShell({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const [, navigate] = useLocation();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const menuPermissions = getSessionAdminPermissions();
  const visibleAdminNavSections = adminNavigationSections
    .map((section) => ({
      ...section,
      items: section.items.filter(
        (item) => menuPermissions[item.permissionId],
      ),
    }))
    .filter((section) => section.items.length > 0);
  const sessionUsername = sessionStorage.getItem("attp-session-username") || "";
  const hasManagedAccount = Boolean(
    sessionUsername && findManagedAdminAccount(sessionUsername),
  );
  const logout = () => {
    sessionStorage.removeItem("attp-reviewer-session");
    sessionStorage.removeItem("attp-session-role");
    sessionStorage.removeItem("attp-session-username");
    sessionStorage.removeItem("attp-session-name");
    sessionStorage.removeItem(ADMIN_SESSION_PERMISSIONS_KEY);
    navigate("/admin/login");
  };
  const isActive = (href: string) =>
    href === "/admin"
      ? location === href
      : location === href || location.startsWith(`${href}/`);
  const closeMobileNav = () => setMobileNavOpen(false);
  const adminPageTitle =
    location.startsWith("/admin/meals/menus")
      ? "Danh sách món ăn"
      : location.startsWith("/admin/meals/recipes")
        ? "Danh sách món ăn"
        : location.startsWith("/admin/meals")
          ? "Kiểm thực 3 bước"
            : location.startsWith("/admin/facility-profiles")
              ? "Hồ sơ cơ sở"
              : location.startsWith("/admin/facilities")
                ? "Duyệt cơ sở"
            : location.startsWith("/admin/inspections")
                ? "Quản lý kiểm tra"
                  : location.startsWith("/admin/reports")
                    ? "Báo cáo thống kê"
                : location === "/admin"
                  ? "Dashboard giám sát"
                  : "Bàn xét duyệt";
  return (
    <div className="admin-shell portal-noise min-h-[100dvh] bg-[#f9fafb] lg:grid lg:grid-cols-[252px_1fr]">
      <aside className="hidden min-h-[100dvh] bg-[#123d36] text-sidebar-foreground lg:flex lg:flex-col">
        <div className="border-b border-white/10 px-5 py-5">
          <Link
            href="/"
            className="focus-ring flex items-center gap-3"
            data-testid="link-admin-brand-home"
          >
            <img
              src={emblemPath}
              alt="Quốc huy Việt Nam"
              className="h-12 w-12 object-contain"
            />
            <span className="leading-tight">
              <strong className="block text-[11px] font-extrabold tracking-tight text-white">
                SỞ AN TOÀN THỰC PHẨM
              </strong>
              <span className="mt-1 block text-[10px] font-semibold text-white/60">
                THÀNH PHỐ HỒ CHÍ MINH
              </span>
              <span className="mt-3 block text-[10px] font-bold uppercase tracking-[.16em] text-[#f4c95d]">
                Không gian quản trị
              </span>
            </span>
          </Link>
        </div>
        <nav
          className="flex flex-1 flex-col overflow-y-auto p-4"
          aria-label="Điều hướng quản trị"
        >
          {visibleAdminNavSections.map((section, sectionIndex) => (
            <div
              key={section.title}
              className={sectionIndex === 0 ? "" : "mt-5"}
            >
              <p className="px-3.5 pb-1 text-[10px] font-extrabold uppercase tracking-[.16em] text-[#f4c95d]">
                {section.title}
              </p>
              <div className="flex flex-col gap-1.5">
                {section.items.map((item) => {
                  const Icon = adminMenuIcons[item.permissionId];
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`focus-ring group flex items-center gap-3 rounded-2xl px-3.5 py-2.5 text-[13px] font-semibold transition-all ${
                        active
                          ? "bg-[#f4c95d] text-[#123d36] shadow-lg shadow-black/10"
                          : "text-white/65 hover:bg-white/[.08] hover:text-white"
                      }`}
                      data-testid={`link-admin-${item.label}`}
                    >
                      <span
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl transition-colors ${
                          active
                            ? "bg-[#123d36]/10"
                            : "bg-white/[.06] group-hover:bg-white/10"
                        }`}
                      >
                        <Icon size={16} />
                      </span>
                      <span className="leading-5">{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
        <div className="border-t border-white/10 p-5 text-xs text-white/45">
          Phiên làm việc cán bộ
          <br />
          <span className="mt-1 inline-block font-semibold text-white/75">
            Admin
          </span>
        </div>
      </aside>
      <main className="admin-shell__main min-w-0">
        <div className="admin-shell__header border-b border-slate-200/80 bg-white/90 px-5 py-4 shadow-[0_1px_0_rgba(15,23,42,.03)] backdrop-blur lg:px-10">
          <div className="flex items-center justify-between">
            <div className="flex min-w-0 items-center gap-3 lg:hidden">
              <BrandMark compact />
              <span className="truncate text-sm font-bold">{adminPageTitle}</span>
              <button
                type="button"
                onClick={() => setMobileNavOpen((open) => !open)}
                className="focus-ring ml-1 rounded-xl border border-slate-200 p-2 text-slate-600"
                aria-label={
                  mobileNavOpen ? "Đóng menu cán bộ" : "Mở menu cán bộ"
                }
                aria-expanded={mobileNavOpen}
                data-testid="button-mobile-admin-menu"
              >
                {mobileNavOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
            <div className="admin-shell__page-title hidden min-w-0 lg:block">
             
            </div>
            <div className="admin-shell__actions flex items-center gap-4">
              <Link
                href="/"
                className="admin-shell__public-link focus-ring flex items-center gap-2 text-sm font-semibold text-primary"
                data-testid="link-back-public"
              >
                <Home size={16} /> Cổng công khai
              </Link>
              <button
                type="button"
                className="admin-shell__notification focus-ring"
                aria-label="Thông báo"
                data-testid="button-admin-notifications"
              >
                <Bell size={16} />
                <span aria-hidden="true" />
              </button>
              {hasManagedAccount ? (
                <Link
                  href="/admin/profile"
                  className="admin-shell__profile focus-ring"
                  data-testid="link-admin-profile"
                  title="Hồ sơ tài khoản"
                >
                  <div className="admin-shell__profile-copy">
                    <strong>Admin</strong>
                    <span>Hồ sơ tài khoản</span>
                  </div>
                </Link>
              ) : (
                <div className="admin-shell__profile">
                  <div className="admin-shell__profile-copy">
                    <strong>Admin</strong>
                  </div>
                </div>
              )}
              <button
                onClick={logout}
                className="admin-shell__logout focus-ring hidden items-center gap-2 text-sm font-semibold text-slate-500 hover:text-destructive sm:flex"
                data-testid="button-reviewer-logout"
              >
                <LogOut size={16} /> Đăng xuất
              </button>
            </div>
          </div>
        </div>
        {mobileNavOpen && (
          <nav
            className="border-b border-slate-200 bg-white px-4 py-3 shadow-sm lg:hidden"
            aria-label="Điều hướng cán bộ trên điện thoại"
          >
            <div className="max-h-[calc(100dvh-5rem)] overflow-y-auto">
              {visibleAdminNavSections.map((section) => (
                <div
                  key={section.title}
                  className="border-b border-slate-100 py-2 last:border-b-0"
                >
                  <p className="px-2 pb-1 pt-1 text-[10px] font-extrabold uppercase tracking-[.16em] text-primary">
                    {section.title}
                  </p>
                  <div className="grid gap-1 sm:grid-cols-2">
                    {section.items.map((item) => {
                      const Icon = adminMenuIcons[item.permissionId];
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={closeMobileNav}
                          className={`focus-ring flex min-w-0 items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold ${
                            isActive(item.href)
                              ? "bg-primary text-primary-foreground"
                              : "text-slate-600 hover:bg-slate-50 hover:text-primary"
                          }`}
                          data-testid={`link-mobile-admin-${item.label}`}
                        >
                          <Icon size={16} className="shrink-0" />
                          <span className="min-w-0 break-words">
                            {item.label}
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </nav>
        )}
        {children}
      </main>
    </div>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-9 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
      <div>
        <h1 className="display-tight mt-3 max-w-4xl text-3xl font-extrabold leading-tight text-foreground md:text-5xl">
          {title}
        </h1>
       
      </div>
      {action}
    </div>
  );
}

export function MetricCard({
  label,
  value,
  tone = "green",
  icon: Icon,
}: {
  label: string;
  value: number | string;
  tone?: "green" | "gold" | "orange" | "blue";
  icon: typeof Search;
}) {
  const colors = {
    green: "bg-primary text-primary-foreground",
    gold: "bg-accent text-accent-foreground",
    orange: "bg-orange-100 text-orange-900",
    blue: "bg-sky-100 text-sky-900",
  };
  return (
    <div
      className={`lift rounded-2xl p-5 ${colors[tone]}`}
      data-testid={`metric-${label}`}
    >
      <div className="flex items-start justify-between">
        <span className="text-sm font-semibold opacity-75">{label}</span>
        <Icon size={18} className="opacity-70" />
      </div>
      <div className="mt-6 text-3xl font-extrabold tracking-tight">{value}</div>
    </div>
  );
}

export function StatusPill({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    pending: { label: "Chờ duyệt", cls: "bg-amber-100 text-amber-900" },
    "needs-more-info": {
      label: "Chưa đánh giá · chờ bổ sung",
      cls: "bg-orange-100 text-orange-900",
    },
    approved: { label: "PASS", cls: "bg-emerald-100 text-emerald-900" },
    warning: {
      label: "Cảnh báo / tạm dừng",
      cls: "bg-yellow-100 text-yellow-900",
    },
    stopped: { label: "Dừng hoạt động", cls: "bg-red-100 text-red-900" },
    rejected: { label: "Từ chối", cls: "bg-red-100 text-red-900" },
    active: { label: "Đang hiệu lực", cls: "bg-emerald-100 text-emerald-900" },
  };
  const item = map[status] ?? {
    label: status,
    cls: "bg-muted text-muted-foreground",
  };
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-xs font-bold ${item.cls}`}
      data-testid={`status-${status}`}
    >
      <span className="status-dot bg-current" />
      {item.label}
    </span>
  );
}

export function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center">
      <FileSearch className="mx-auto text-primary/50" size={34} />
      <h3 className="mt-4 font-bold">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
        {description}
      </p>
    </div>
  );
}
export function ButtonLink({
  href,
  children,
  variant = "default",
}: {
  href: string;
  children: ReactNode;
  variant?: "default" | "outline";
}) {
  return (
    <Link
      href={href}
      className={`focus-ring inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold transition-transform hover:-translate-y-0.5 ${variant === "outline" ? "border border-border bg-card text-foreground hover:border-primary/40" : "bg-primary text-primary-foreground hover:bg-primary/90"}`}
      data-testid={`link-action-${href.replaceAll("/", "-")}`}
    >
      {children}
      <ArrowRight size={16} />
    </Link>
  );
}
