import { type ReactNode, useEffect, useState } from 'react';
import { Link, useLocation } from 'wouter';
import { ArrowRight, BarChart3, Bell, ClipboardCheck, FileSearch, Home, LogIn, LogOut, Menu, Search, Settings2, ShieldCheck, X } from 'lucide-react';
import emblemPath from '../../../../.conversation/attached_assets/Emblem_of_Vietnam.svg_1788926527100.webp';

export function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="focus-ring flex items-center gap-3" data-testid="link-brand-home">
      <img src={emblemPath} alt="Quốc huy Việt Nam" className={compact ? 'h-11 w-11 object-contain' : 'h-14 w-14 object-contain'} data-testid="img-national-emblem" />
      {!compact && <span className="leading-tight"><strong className="block text-sm font-extrabold tracking-tight">SỞ AN TOÀN THỰC PHẨM</strong><span className="block text-xs text-muted-foreground">THÀNH PHỐ HỒ CHÍ MINH</span></span>}
    </Link>
  );
}

export function PublicHeader() {
  const [location] = useLocation();
  const [, navigate] = useLocation();
  const [open, setOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [facilityAccount, setFacilityAccount] = useState(() => sessionStorage.getItem('attp-session-role') === 'facility');
  const notificationStorageKey = `attp-read-notifications:${sessionStorage.getItem('attp-session-username') || 'coso.demo'}`;
  const notifications = [
    { id: 'review-request', title: 'Yêu cầu bổ sung hồ sơ', text: 'Vui lòng rà soát ảnh khu vực bảo quản trước khi hồ sơ được duyệt.', time: 'Mới nhất' },
    { id: 'profile-reminder', title: 'Cập nhật thông tin cơ sở', text: 'Kiểm tra lại giấy phép ATTP và thông tin người phụ trách.', time: 'Hôm nay' },
  ];
  const [readNotifications, setReadNotifications] = useState<string[]>(() => {
    try {
      return JSON.parse(sessionStorage.getItem(notificationStorageKey) || '[]');
    } catch {
      return [];
    }
  });
  const unreadCount = notifications.filter(item => !readNotifications.includes(item.id)).length;
  const nav = facilityAccount ? [['/', 'Tổng quan'], ['/lookup', 'Tra cứu'], ['/facility/profile', 'Hồ sơ cơ sở']] : [['/', 'Tổng quan'], ['/lookup', 'Tra cứu'], ['/register', 'Đăng ký hồ sơ']];
  useEffect(() => {
    const syncSession = () => setFacilityAccount(sessionStorage.getItem('attp-session-role') === 'facility');
    window.addEventListener('storage', syncSession);
    return () => window.removeEventListener('storage', syncSession);
  }, []);
  const logout = () => {
    sessionStorage.removeItem('attp-session-role');
    sessionStorage.removeItem('attp-reviewer-session');
    setFacilityAccount(false);
    setNotificationsOpen(false);
    navigate('/');
  };
  const openNotification = (id: string) => {
    const nextRead = readNotifications.includes(id) ? readNotifications : [...readNotifications, id];
    setReadNotifications(nextRead);
    sessionStorage.setItem(notificationStorageKey, JSON.stringify(nextRead));
    setNotificationsOpen(false);
    navigate('/facility/profile');
  };
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 shadow-[0_8px_30px_hsl(158_37%_15%/.04)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
        <BrandMark />
        <nav className="hidden items-center gap-1 md:flex" aria-label="Điều hướng chính">
          {nav.map(([href, label]) => <Link key={href} href={href} className={`focus-ring rounded-full px-4 py-2.5 text-sm font-semibold transition-all ${location === href ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'}`} data-testid={`link-nav-${label}`}>{label}</Link>)}
        </nav>
         <div className="flex items-center gap-2">
           {facilityAccount ? <><div className="relative"><button type="button" onClick={() => setNotificationsOpen(current => !current)} className="focus-ring relative rounded-full border border-primary/25 p-2 text-primary hover:bg-secondary" aria-label="Thông báo hồ sơ cơ sở" aria-expanded={notificationsOpen} data-testid="button-facility-notifications"><Bell size={17} />{unreadCount > 0 && <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-extrabold text-destructive-foreground">{unreadCount}</span>}</button>{notificationsOpen && <div className="absolute right-0 top-full z-50 mt-3 w-[min(21rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-border bg-card text-left shadow-2xl shadow-primary/10" role="region" aria-label="Danh sách thông báo" data-testid="panel-facility-notifications"><div className="flex items-center justify-between border-b border-border px-4 py-3"><div><p className="text-sm font-extrabold">Thông báo</p><p className="mt-0.5 text-xs text-muted-foreground">{unreadCount ? `${unreadCount} thông báo chưa đọc` : 'Bạn đã xem hết thông báo'}</p></div><Bell size={16} className="text-primary" /></div><div className="divide-y divide-border">{notifications.map(item => <button type="button" key={item.id} onClick={() => openNotification(item.id)} className={`focus-ring block w-full px-4 py-3 text-left transition-colors hover:bg-secondary ${readNotifications.includes(item.id) ? 'bg-card' : 'bg-secondary/45'}`} data-testid={`button-notification-${item.id}`}><div className="flex items-start gap-3"><span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${readNotifications.includes(item.id) ? 'bg-border' : 'bg-destructive'}`} /><span className="min-w-0"><span className="flex items-center justify-between gap-3"><span className="text-sm font-bold text-foreground">{item.title}</span><span className="shrink-0 text-[11px] font-medium text-muted-foreground">{item.time}</span></span><span className="mt-1 block text-xs leading-5 text-muted-foreground">{item.text}</span></span></div></button>)}</div><Link href="/facility/profile" onClick={() => setNotificationsOpen(false)} className="block border-t border-border px-4 py-3 text-center text-xs font-bold text-primary hover:bg-secondary" data-testid="link-view-facility-profile-from-notifications">Xem và cập nhật hồ sơ</Link></div>}</div><button onClick={logout} className="focus-ring hidden items-center gap-2 rounded-full border border-border px-3 py-2 text-xs font-bold text-muted-foreground hover:border-primary/30 hover:text-primary sm:inline-flex" data-testid="button-public-facility-logout"><LogOut size={15} /> Đăng xuất</button></> : <Link href="/admin/login" className="focus-ring hidden items-center gap-2 rounded-full border border-primary/25 px-3 py-2 text-xs font-bold text-primary hover:bg-secondary sm:inline-flex" data-testid="link-reviewer-login"><LogIn size={15} /> Đăng nhập</Link>}
           <button className="focus-ring rounded-lg p-2 md:hidden" onClick={() => setOpen(!open)} aria-label={open ? 'Đóng menu' : 'Mở menu'} data-testid="button-mobile-menu">{open ? <X size={21} /> : <Menu size={21} />}</button>
         </div>
      </div>
       {open && <nav className="border-t border-border px-5 py-3 md:hidden" aria-label="Điều hướng di động">{nav.map(([href, label]) => <Link key={href} href={href} onClick={() => setOpen(false)} className="block border-b border-border/60 py-3 text-sm font-semibold" data-testid={`link-mobile-${label}`}>{label}</Link>)}{facilityAccount ? <button onClick={logout} className="block py-3 text-left text-sm font-bold text-destructive" data-testid="button-mobile-facility-logout">Đăng xuất</button> : <Link href="/admin/login" onClick={() => setOpen(false)} className="block py-3 text-sm font-bold text-primary" data-testid="link-mobile-login">Đăng nhập</Link>}</nav>}
    </header>
  );
}

export function PublicFooter() {
  return <footer className="border-t border-border bg-primary py-10 text-primary-foreground"><div className="mx-auto flex max-w-7xl flex-col gap-8 px-5 md:flex-row md:items-end md:justify-between lg:px-8"><div><BrandMark compact /><p className="mt-3 max-w-sm text-sm leading-6 text-primary-foreground/75">Minh bạch hơn trong từng lựa chọn thực phẩm. Kênh thông tin chính thức của Sở An toàn thực phẩm Thành phố Hồ Chí Minh.</p></div><div className="text-sm leading-6 text-primary-foreground/75"><p className="font-bold text-primary-foreground">Sở An toàn thực phẩm Thành phố Hồ Chí Minh</p><p>Trụ sở chính: 57 Nguyễn Thị Minh Khai, phường Bến Thành, TP.HCM</p><p>Địa chỉ: 18 Cách Mạng Tháng 8, phường Bến Thành, TP.HCM</p><p>Số điện thoại: 028 3930 6001 · Fax: 028 3930 703</p><p>Đường dây nóng: 028 3930 1714</p></div></div></footer>;
}

export function PublicShell({ children }: { children: ReactNode }) { return <div className="portal-noise min-h-[100dvh] bg-background"><PublicHeader />{children}<PublicFooter /></div>; }

export function AdminShell({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const [, navigate] = useLocation();
  const items = [['/admin', 'Tổng quan', Home], ['/admin/applications/pending', 'Hồ sơ đăng ký', ClipboardCheck], ['/admin/criteria', 'Cấu hình tiêu chí', Settings2], ['/admin/accounts', 'Quản lý tài khoản', ShieldCheck], ['/admin/reports', 'Báo cáo thống kê', BarChart3]];
  const logout = () => {
    sessionStorage.removeItem('attp-reviewer-session');
    sessionStorage.removeItem('attp-session-role');
    navigate('/admin/login');
  };
  return <div className="portal-noise min-h-[100dvh] bg-[#f5f7f8] lg:grid lg:grid-cols-[252px_1fr]">
     <aside className="hidden min-h-[100dvh] bg-[#123d36] text-sidebar-foreground lg:flex lg:flex-col"><nav className="flex-1 space-y-1.5 p-4" aria-label="Điều hướng quản trị">{items.map(([href, label, Icon]) => <Link key={href as string} href={href as string} className={`focus-ring group flex items-center gap-3 rounded-2xl px-3.5 py-3 text-sm font-semibold transition-all ${location.startsWith(href as string) ? 'bg-[#f4c95d] text-[#123d36] shadow-lg shadow-black/10' : 'text-white/65 hover:bg-white/[.08] hover:text-white'}`} data-testid={`link-admin-${label}`}><span className={`flex h-8 w-8 items-center justify-center rounded-xl transition-colors ${location.startsWith(href as string) ? 'bg-[#123d36]/10' : 'bg-white/[.06] group-hover:bg-white/10'}`}><Icon size={17} /></span><span>{label as string}</span></Link>)}</nav><div className="border-t border-white/10 p-5 text-xs text-white/45">Phiên làm việc cán bộ<br /><span className="mt-1 inline-block font-semibold text-white/75">Phòng Quản lý cơ sở</span></div></aside>
      <main className="min-w-0"><div className="border-b border-slate-200/80 bg-white/90 px-5 py-4 shadow-[0_1px_0_rgba(15,23,42,.03)] backdrop-blur lg:px-10"><div className="flex items-center justify-between"><div className="flex items-center gap-3 lg:hidden"><BrandMark compact /><span className="text-sm font-bold">Bàn xét duyệt</span></div><div className="hidden text-xs font-bold uppercase tracking-[.18em] text-slate-400 lg:block">SỞ ATTP TP.HCM <span className="mx-2 text-slate-300">/</span> Không gian quản trị</div><div className="flex items-center gap-4"><Link href="/" className="focus-ring flex items-center gap-2 text-sm font-semibold text-primary" data-testid="link-back-public"><Home size={16} /> Cổng công khai</Link><button onClick={logout} className="focus-ring hidden items-center gap-2 text-sm font-semibold text-slate-500 hover:text-destructive sm:flex" data-testid="button-reviewer-logout"><LogOut size={16} /> Đăng xuất</button></div></div></div>{children}</main>
  </div>;
}

export function SectionHeading({ eyebrow, title, description, action }: { eyebrow: string; title: string; description?: string; action?: ReactNode }) {
  return <div className="mb-9 flex flex-col gap-5 md:flex-row md:items-end md:justify-between"><div><p className="mono-label font-semibold text-primary">{eyebrow}</p><h1 className="display-tight mt-3 max-w-4xl text-3xl font-extrabold leading-tight text-foreground md:text-5xl">{title}</h1>{description && <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground md:text-base">{description}</p>}</div>{action}</div>;
}

export function MetricCard({ label, value, tone = 'green', icon: Icon }: { label: string; value: number | string; tone?: 'green' | 'gold' | 'orange' | 'blue'; icon: typeof Search }) {
  const colors = { green: 'bg-primary text-primary-foreground', gold: 'bg-accent text-accent-foreground', orange: 'bg-orange-100 text-orange-900', blue: 'bg-sky-100 text-sky-900' };
  return <div className={`lift rounded-2xl p-5 ${colors[tone]}`} data-testid={`metric-${label}`}><div className="flex items-start justify-between"><span className="text-sm font-semibold opacity-75">{label}</span><Icon size={18} className="opacity-70" /></div><div className="mt-6 text-3xl font-extrabold tracking-tight">{value}</div></div>;
}

export function StatusPill({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string }> = { pending: { label: 'Chờ duyệt', cls: 'bg-amber-100 text-amber-900' }, 'needs-more-info': { label: 'Chờ bổ sung', cls: 'bg-orange-100 text-orange-900' }, approved: { label: 'PASS', cls: 'bg-emerald-100 text-emerald-900' }, warning: { label: 'Cảnh báo / tạm dừng', cls: 'bg-yellow-100 text-yellow-900' }, stopped: { label: 'Dừng hoạt động', cls: 'bg-red-100 text-red-900' }, rejected: { label: 'Từ chối', cls: 'bg-red-100 text-red-900' }, active: { label: 'Đang hiệu lực', cls: 'bg-emerald-100 text-emerald-900' } };
  const item = map[status] ?? { label: status, cls: 'bg-muted text-muted-foreground' };
  return <span className={`inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-xs font-bold ${item.cls}`} data-testid={`status-${status}`}><span className="status-dot bg-current" />{item.label}</span>;
}

export function EmptyState({ title, description }: { title: string; description: string }) { return <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center"><FileSearch className="mx-auto text-primary/50" size={34} /><h3 className="mt-4 font-bold">{title}</h3><p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">{description}</p></div>; }
export function ButtonLink({ href, children, variant = 'default' }: { href: string; children: ReactNode; variant?: 'default' | 'outline' }) { return <Link href={href} className={`focus-ring inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold transition-transform hover:-translate-y-0.5 ${variant === 'outline' ? 'border border-border bg-card text-foreground hover:border-primary/40' : 'bg-primary text-primary-foreground hover:bg-primary/90'}`} data-testid={`link-action-${href.replaceAll('/', '-')}`}>{children}<ArrowRight size={16} /></Link>; }
