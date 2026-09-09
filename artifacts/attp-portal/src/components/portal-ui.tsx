import { type ReactNode, useState } from 'react';
import { Link, useLocation } from 'wouter';
import { ArrowRight, BarChart3, ClipboardCheck, FileSearch, Home, LogIn, LogOut, Menu, Search, ShieldCheck, X } from 'lucide-react';
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
  const [open, setOpen] = useState(false);
  const nav = [['/', 'Tổng quan'], ['/lookup', 'Tra cứu'], ['/register', 'Đăng ký hồ sơ']];
  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 lg:px-8">
        <BrandMark />
        <nav className="hidden items-center gap-1 md:flex" aria-label="Điều hướng chính">
          {nav.map(([href, label]) => <Link key={href} href={href} className={`focus-ring rounded-full px-4 py-2 text-sm font-semibold transition-colors ${location === href ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'}`} data-testid={`link-nav-${label}`}>{label}</Link>)}
        </nav>
         <div className="flex items-center gap-2">
           <Link href="/admin/login" className="focus-ring hidden items-center gap-2 rounded-full border border-primary/25 px-3 py-2 text-xs font-bold text-primary hover:bg-secondary sm:inline-flex" data-testid="link-reviewer-login"><LogIn size={15} /> Đăng nhập</Link>
           <button className="focus-ring rounded-lg p-2 md:hidden" onClick={() => setOpen(!open)} aria-label={open ? 'Đóng menu' : 'Mở menu'} data-testid="button-mobile-menu">{open ? <X size={21} /> : <Menu size={21} />}</button>
         </div>
      </div>
       {open && <nav className="border-t border-border px-5 py-3 md:hidden" aria-label="Điều hướng di động">{nav.map(([href, label]) => <Link key={href} href={href} onClick={() => setOpen(false)} className="block border-b border-border/60 py-3 text-sm font-semibold" data-testid={`link-mobile-${label}`}>{label}</Link>)}<Link href="/admin/login" onClick={() => setOpen(false)} className="block py-3 text-sm font-bold text-primary" data-testid="link-mobile-login">Đăng nhập</Link></nav>}
    </header>
  );
}

export function PublicFooter() {
  return <footer className="border-t border-border bg-primary py-10 text-primary-foreground"><div className="mx-auto flex max-w-7xl flex-col gap-8 px-5 md:flex-row md:items-end md:justify-between lg:px-8"><div><BrandMark compact /><p className="mt-3 max-w-sm text-sm leading-6 text-primary-foreground/75">Minh bạch hơn trong từng lựa chọn thực phẩm. Kênh thông tin chính thức của Sở An toàn thực phẩm Thành phố Hồ Chí Minh.</p></div><div className="text-sm text-primary-foreground/65"><p>Trụ sở: 18 Cách Mạng Tháng Tám, Quận 3, TP.HCM</p><p className="mt-1">Đường dây nóng: 1900 9095 · Cổng dữ liệu công khai</p></div></div></footer>;
}

export function PublicShell({ children }: { children: ReactNode }) { return <div className="portal-noise min-h-[100dvh] bg-background"><PublicHeader />{children}<PublicFooter /></div>; }

export function AdminShell({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const [, navigate] = useLocation();
  const items = [['/admin', 'Tổng quan', Home], ['/admin/applications/pending', 'Hồ sơ đăng ký', ClipboardCheck], ['/admin/accounts', 'Quản lý tài khoản', ShieldCheck], ['/admin/reports', 'Báo cáo thống kê', BarChart3]];
  const logout = () => {
    sessionStorage.removeItem('attp-reviewer-session');
    navigate('/admin/login');
  };
  return <div className="portal-noise min-h-[100dvh] bg-background lg:grid lg:grid-cols-[270px_1fr]">
    <aside className="hidden min-h-[100dvh] bg-sidebar text-sidebar-foreground lg:flex lg:flex-col"><div className="border-b border-sidebar-border p-6"><BrandMark compact /><div className="mt-4"><p className="mono-label text-sidebar-primary">Không gian nghiệp vụ</p><p className="mt-1 text-lg font-bold">Bàn xét duyệt</p></div></div><nav className="flex-1 space-y-1 p-4" aria-label="Điều hướng quản trị">{items.map(([href, label, Icon]) => <Link key={href as string} href={href as string} className={`focus-ring flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition-colors ${location.startsWith(href as string) ? 'bg-sidebar-primary text-sidebar-primary-foreground' : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground'}`} data-testid={`link-admin-${label}`}><Icon size={18} /><span>{label as string}</span></Link>)}</nav><div className="border-t border-sidebar-border p-5 text-xs text-sidebar-foreground/55">Phiên làm việc cán bộ<br /><span className="mt-1 inline-block font-semibold text-sidebar-foreground/80">Phòng Quản lý cơ sở</span></div></aside>
     <main className="min-w-0"><div className="border-b border-border bg-card px-5 py-4 lg:px-10"><div className="flex items-center justify-between"><div className="flex items-center gap-3 lg:hidden"><BrandMark compact /><span className="text-sm font-bold">Bàn xét duyệt</span></div><div className="hidden text-sm text-muted-foreground lg:block">SỞ ATTP TP.HCM / KHÔNG GIAN QUẢN TRỊ</div><div className="flex items-center gap-4"><Link href="/" className="focus-ring flex items-center gap-2 text-sm font-semibold text-primary" data-testid="link-back-public"><Home size={16} /> Cổng công khai</Link><button onClick={logout} className="focus-ring hidden items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-destructive sm:flex" data-testid="button-reviewer-logout"><LogOut size={16} /> Đăng xuất</button></div></div></div>{children}</main>
  </div>;
}

export function SectionHeading({ eyebrow, title, description, action }: { eyebrow: string; title: string; description?: string; action?: ReactNode }) {
  return <div className="mb-7 flex flex-col gap-4 md:flex-row md:items-end md:justify-between"><div><p className="mono-label font-semibold text-primary">{eyebrow}</p><h1 className="display-tight mt-2 text-3xl font-extrabold text-foreground md:text-5xl">{title}</h1>{description && <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground md:text-base">{description}</p>}</div>{action}</div>;
}

export function MetricCard({ label, value, tone = 'green', icon: Icon }: { label: string; value: number | string; tone?: 'green' | 'gold' | 'orange' | 'blue'; icon: typeof Search }) {
  const colors = { green: 'bg-primary text-primary-foreground', gold: 'bg-accent text-accent-foreground', orange: 'bg-orange-100 text-orange-900', blue: 'bg-sky-100 text-sky-900' };
  return <div className={`lift rounded-2xl p-5 ${colors[tone]}`} data-testid={`metric-${label}`}><div className="flex items-start justify-between"><span className="text-sm font-semibold opacity-75">{label}</span><Icon size={18} className="opacity-70" /></div><div className="mt-6 text-3xl font-extrabold tracking-tight">{value}</div></div>;
}

export function StatusPill({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string }> = { pending: { label: 'Chờ duyệt', cls: 'bg-amber-100 text-amber-900' }, 'needs-more-info': { label: 'Cần bổ sung', cls: 'bg-orange-100 text-orange-900' }, approved: { label: 'Đã duyệt', cls: 'bg-emerald-100 text-emerald-900' }, rejected: { label: 'Từ chối', cls: 'bg-red-100 text-red-900' }, active: { label: 'Đang hiệu lực', cls: 'bg-emerald-100 text-emerald-900' } };
  const item = map[status] ?? { label: status, cls: 'bg-muted text-muted-foreground' };
  return <span className={`inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-xs font-bold ${item.cls}`} data-testid={`status-${status}`}><span className="status-dot bg-current" />{item.label}</span>;
}

export function EmptyState({ title, description }: { title: string; description: string }) { return <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center"><FileSearch className="mx-auto text-primary/50" size={34} /><h3 className="mt-4 font-bold">{title}</h3><p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">{description}</p></div>; }
export function ButtonLink({ href, children, variant = 'default' }: { href: string; children: ReactNode; variant?: 'default' | 'outline' }) { return <Link href={href} className={`focus-ring inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold transition-transform hover:-translate-y-0.5 ${variant === 'outline' ? 'border border-border bg-card text-foreground hover:border-primary/40' : 'bg-primary text-primary-foreground hover:bg-primary/90'}`} data-testid={`link-action-${href.replaceAll('/', '-')}`}>{children}<ArrowRight size={16} /></Link>; }
