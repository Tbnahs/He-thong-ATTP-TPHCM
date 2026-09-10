import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent, type ReactNode } from 'react';
import { Link, useLocation, useParams } from 'wouter';
import { useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, ArrowUpRight, BadgeCheck, BarChart3, Bell, Building2, Check, ChevronLeft, ChevronRight, ClipboardCheck, FileText, GripVertical, ImagePlus, Info, Layers3, ListChecks, LockKeyhole, LogIn, MapPin, Plus, RotateCcw, Search, Send, ShieldCheck, SlidersHorizontal, Store, Trash2, UserRound, Users, X } from 'lucide-react';
import {
  ApplicationType,
  CriteriaAnswerType,
  CriteriaConfigInput,
  CriteriaDefinition,
  CriteriaGroup,
  CriteriaSet,
  getGetCriteriaQueryKey,
  getGetAdminSummaryQueryKey,
  getGetApplicationQueryKey,
  getGetPublicRecordQueryKey,
  getGetPublicSummaryQueryKey,
  getListApplicationsQueryKey,
  getListPublicRecordsQueryKey,
  getListApprovedSuppliersQueryKey,
  ListPublicRecordsCategory,
  ReviewInputAction,
  useCreateApplication,
  useGetAdminSummary,
  useGetApplication,
  useGetCriteria,
  useGetPublicRecord,
  useGetPublicSummary,
  useListApplications,
  useListApprovedSuppliers,
  useListPublicRecords,
  useReviewApplication,
  useListCriteriaHistory,
  useUpdateCriteria,
  type ApplicationInput,
  type Attachment,
  type ListApplicationsParams,
  type ListPublicRecordsParams,
  type PublicRecord,
  type ReviewInputAction as ReviewAction,
} from '@workspace/api-client-react';
import { Button } from '@/components/ui/button';
import { AdminShell, ButtonLink, EmptyState, MetricCard, PublicShell, SectionHeading, StatusPill } from '@/components/portal-ui';
import heroFoodImage from '@assets/1788940094256_5613377993845818882_5613377993845818882_1e47059ddc5db7e9cbacbeb3495b9f36.jpg';

const categoryNames: Record<string, string> = {
  'eligible-facilities': 'Cơ sở đủ điều kiện',
  'self-declared-products': 'Sản phẩm tự công bố',
  'registered-products': 'Sản phẩm đã đăng ký bản công bố',
  'licensed-advertising': 'Quảng cáo được cấp phép',
  'testing-facilities': 'Cơ sở kiểm nghiệm',
};
const typeNames: Record<string, string> = { 'food-supplier': 'Đơn vị cung cấp thực phẩm', 'meal-provider': 'Đơn vị cung cấp suất ăn', school: 'Cơ sở giáo dục' };
const facilityTypeOptions: { value: ApplicationType; label: string }[] = [
  { value: 'food-supplier', label: 'Cung cấp thực phẩm' },
  { value: 'meal-provider', label: 'Cung cấp suất ăn' },
  { value: 'school', label: 'Cơ sở giáo dục' },
];
const formatDate = (value?: string) => value ? new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(value)) : '—';
const formatNumber = (value?: number) => typeof value === 'number' ? new Intl.NumberFormat('vi-VN').format(value) : '—';
type AccountRole = 'admin' | 'facility';
const inferAccountRole = (username: string): AccountRole => /^(admin|canbo|reviewer|xetduyet)/i.test(username.trim()) ? 'admin' : 'facility';
type CriteriaValue = string | string[] | Record<string, string | string[]>;
const answerTypeLabels: Record<CriteriaAnswerType, string> = {
  text: 'Nhập văn bản',
  number: 'Nhập số',
  date: 'Ngày tháng',
  'yes-no': 'Có / Không',
  select: 'Chọn phương án',
  'multi-select': 'Chọn phương án',
  file: 'Tải tệp / ảnh',
};
const getAnswerTypes = (item: CriteriaDefinition): CriteriaAnswerType[] => Array.from(new Set(item.answerTypes?.length ? item.answerTypes : [item.answerType]));
const getCriteriaValue = (value: CriteriaValue, answerType: CriteriaAnswerType, multiple: boolean): string | string[] => {
  if (!multiple) return value as string | string[];
  if (typeof value === 'object' && !Array.isArray(value)) return value[answerType] ?? '';
  return '';
};
const setCriteriaValue = (value: CriteriaValue, answerType: CriteriaAnswerType, next: string | string[], multiple: boolean): CriteriaValue => {
  if (!multiple) return next;
  const previous = typeof value === 'object' && !Array.isArray(value) ? value : {};
  return { ...previous, [answerType]: next };
};

function Notice({ message, onClose }: { message: string; onClose: () => void }) {
  return <div className="fixed bottom-5 right-5 z-50 flex max-w-sm items-start gap-3 rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-xl" role="status" data-testid="status-notice"><Check size={18} className="mt-0.5 shrink-0 text-accent" /><span>{message}</span><button onClick={onClose} aria-label="Đóng thông báo" data-testid="button-close-notice"><X size={16} /></button></div>;
}

export function HomePage() {
  const { data: summary, isLoading, isError } = useGetPublicSummary();
  const facilityAccount = sessionStorage.getItem('attp-session-role') === 'facility';
  const accountAction = facilityAccount
    ? { href: '/facility/profile', title: 'Hồ sơ cơ sở', text: 'Xem lại toàn bộ thông tin đã đăng ký và cập nhật khi có yêu cầu bổ sung.' }
    : { href: '/register', title: 'Nộp hồ sơ trực tuyến', text: 'Ba luồng đăng ký riêng cho nhà cung cấp, đơn vị suất ăn và cơ sở giáo dục.' };
  return <PublicShell><main>
    <section className="portal-grid relative overflow-hidden border-b border-border"><div className="mx-auto grid max-w-7xl gap-14 px-5 py-20 lg:grid-cols-[1.02fr_.98fr] lg:items-center lg:px-8 lg:py-28">
       <div className="rise-in"><div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-card/80 px-3.5 py-2 text-xs font-bold text-primary shadow-sm"><span className="status-dot bg-primary" /> CỔNG THÔNG TIN CHÍNH THỨC</div><h1 className="display-tight max-w-3xl text-5xl font-extrabold leading-[.98] tracking-tight md:text-7xl lg:text-[5.35rem]">Sở An Toàn Thực Phẩm.<br /><span className="text-primary">Thành Phố Hồ Chí Minh.</span></h1><p className="mt-8 max-w-xl text-base leading-8 text-muted-foreground md:text-lg">Tra cứu nhanh các cơ sở, sản phẩm và hoạt động quảng cáo đã được Sở An toàn thực phẩm Thành phố Hồ Chí Minh công khai.</p><div className="mt-10 flex flex-wrap gap-3"><ButtonLink href="/lookup">Bắt đầu tra cứu</ButtonLink><ButtonLink href={accountAction.href} variant="outline">{facilityAccount ? 'Hồ sơ cơ sở' : 'Đăng ký hồ sơ'}</ButtonLink></div><div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-semibold text-muted-foreground"><span className="flex items-center gap-2"><span className="status-dot bg-accent" /> Dữ liệu chính thức</span><span className="flex items-center gap-2"><span className="status-dot bg-primary" /> Cập nhật minh bạch</span></div></div>
       <div className="relative flex items-center justify-center lg:-mr-10 lg:justify-end"><img src={heroFoodImage} alt="Mâm thực phẩm tươi ngon với rau củ, trái cây và các loại hạt" className="relative w-full max-w-[min(44rem,calc(100%+4rem))] scale-[1.06] mix-blend-multiply rotate-1 object-contain transition-transform duration-500 hover:rotate-0 hover:scale-[1.1]" data-testid="img-home-hero-food" /></div>
    </div></section>
     <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-24"><SectionHeading eyebrow="Ba thao tác, một điểm đến" title="Dịch vụ được thiết kế cho đời sống thật." description="Từ một bữa ăn tại trường đến lựa chọn sản phẩm trong gia đình, thông tin chính thức luôn ở gần bạn." /><div className="grid gap-5 md:grid-cols-3"><HomeFeature icon={Search} number="01" title="Tra cứu công khai" text="Tìm theo tên, địa chỉ hoặc nhóm dữ liệu. Kết quả hiển thị tình trạng và ngày công bố." href="/lookup" /><HomeFeature icon={Send} number="02" title={accountAction.title} text={accountAction.text} href={accountAction.href} /><HomeFeature icon={ClipboardCheck} number="03" title="Quy trình có trách nhiệm" text="Mỗi hồ sơ được chấm điểm, ghi nhận ý kiến và lưu dấu quyết định của cán bộ chuyên môn." href="/admin" /></div></section>
    <HomeLookupSection />
    {isError && <div className="mx-auto max-w-7xl px-5 py-6 text-sm text-destructive" data-testid="status-summary-error">Không thể tải số liệu hiện tại. Bạn vẫn có thể sử dụng tra cứu công khai.</div>}
  </main></PublicShell>;
}

function HomeFeature({ icon: Icon, number, title, text, href }: { icon: typeof Search; number: string; title: string; text: string; href: string }) {
  return <Link href={href} className="lift group rounded-[1.5rem] border border-border bg-card/85 p-7 shadow-sm backdrop-blur-sm" data-testid={`link-feature-${number}`}><div className="flex items-center justify-between"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary font-mono text-xs font-bold text-primary">{number}</span><span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-secondary text-primary transition-all group-hover:bg-primary group-hover:text-primary-foreground"><Icon size={21} className="transition-transform group-hover:scale-110" /></span></div><h3 className="mt-12 text-lg font-extrabold">{title}</h3><p className="mt-3 text-sm leading-6 text-muted-foreground">{text}</p><span className="mt-6 inline-flex items-center gap-1 text-sm font-bold text-primary">Khám phá <ArrowUpRight size={15} /></span></Link>;
}

function HomeLookupSection() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [selected, setSelected] = useState<PublicRecord | null>(null);
  const params = useMemo<ListPublicRecordsParams>(() => ({ search: search || undefined, category: (category || undefined) as ListPublicRecordsCategory | undefined, page: 1, pageSize: 3 }), [search, category]);
  const { data, isLoading, isError } = useListPublicRecords(params);

  return <section className="border-y border-border bg-secondary/30"><div className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-24">
    <SectionHeading eyebrow="Tra cứu nhanh" title="Tìm thông tin công khai ngay trên trang tổng quan." description="Nhập tên cơ sở, sản phẩm hoặc chọn nhóm dữ liệu để xem nhanh các kết quả mới nhất." action={<Link href="/lookup" className="inline-flex items-center gap-2 text-sm font-bold text-primary">Xem toàn bộ dữ liệu <ArrowUpRight size={16} /></Link>} />
    <div className="rounded-[1.5rem] border border-primary/10 bg-card p-3 shadow-xl shadow-primary/5"><div className="flex flex-col gap-3 rounded-2xl bg-secondary/40 p-2 lg:flex-row">
      <label className="relative flex-1"><Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} /><input value={search} onChange={event => setSearch(event.target.value)} placeholder="Tìm theo tên, địa chỉ..." className="focus-ring h-12 w-full rounded-xl border border-input bg-background pl-11 pr-4 text-sm" data-testid="input-home-public-search" /></label>
      <select value={category} onChange={event => setCategory(event.target.value)} className="focus-ring h-12 rounded-xl border border-input bg-background px-4 text-sm font-semibold lg:w-80" data-testid="select-home-public-category"><option value="">Tất cả danh mục</option>{Object.entries(categoryNames).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select>
    </div></div>
    <div className="mt-6">{isLoading ? <LoadingRows /> : isError ? <EmptyState title="Không thể tải dữ liệu tra cứu" description="Vui lòng thử lại sau ít phút hoặc mở trang tra cứu đầy đủ." /> : data?.items?.length ? <div className="grid gap-3">{data.items.map(item => <RecordRow key={item.id} item={item} onOpen={() => setSelected(item)} />)}</div> : <EmptyState title="Chưa có kết quả phù hợp" description="Thử một từ khóa khác hoặc chọn lại danh mục." />}</div>
    {selected && <RecordDialog record={selected} onClose={() => setSelected(null)} />}
  </div></section>;
}

export function LookupPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string>('');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<string | null>(null);
  const params = useMemo<ListPublicRecordsParams>(() => ({ search: search || undefined, category: (category || undefined) as ListPublicRecordsCategory | undefined, page, pageSize: 8 }), [search, category, page]);
  const { data, isLoading, isError } = useListPublicRecords(params);
  const { data: record } = useGetPublicRecord(selected ?? '', { query: { enabled: Boolean(selected), queryKey: getGetPublicRecordQueryKey(selected ?? '') } });
  const totalPages = Math.max(1, Math.ceil((data?.total ?? 0) / (data?.pageSize ?? 8)));
  return <PublicShell><main className="mx-auto max-w-7xl px-5 py-12 lg:px-8 lg:py-16"><SectionHeading eyebrow="Danh mục công khai" title="Tra cứu dữ liệu an toàn thực phẩm." description="Tìm kiếm trong các danh sách đã được Sở công khai. Kết quả được cập nhật theo hồ sơ đã tiếp nhận." action={<div className="rounded-xl bg-secondary px-4 py-3 text-sm font-semibold text-primary"><span className="font-mono">{formatNumber(data?.total)}</span> bản ghi</div>} /><div className="rounded-2xl border border-border bg-card p-4 shadow-sm"><div className="flex flex-col gap-3 lg:flex-row"><label className="relative flex-1"><Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} /><input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Tìm theo tên, địa chỉ..." className="focus-ring h-12 w-full rounded-xl border border-input bg-background pl-11 pr-4 text-sm" data-testid="input-public-search" /></label><select value={category} onChange={e => { setCategory(e.target.value); setPage(1); }} className="focus-ring h-12 rounded-xl border border-input bg-background px-4 text-sm font-semibold lg:w-80" data-testid="select-public-category"><option value="">Tất cả danh mục</option>{Object.entries(categoryNames).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select><Button onClick={() => { setSearch(''); setCategory(''); setPage(1); }} variant="outline" className="h-12 rounded-xl" data-testid="button-reset-search">Đặt lại</Button></div></div><div className="mt-8">{isLoading ? <LoadingRows /> : isError ? <EmptyState title="Không thể tải dữ liệu" description="Hệ thống đang bận. Vui lòng thử lại sau ít phút." /> : data?.items?.length ? <div className="grid gap-3">{data.items.map(item => <RecordRow key={item.id} item={item} onOpen={() => setSelected(item.id)} />)}</div> : <EmptyState title="Chưa có kết quả phù hợp" description="Thử một từ khóa ngắn hơn hoặc chọn danh mục khác." />}</div>{data?.items?.length ? <div className="mt-8 flex items-center justify-between border-t border-border pt-5"><p className="text-sm text-muted-foreground">Trang <strong className="text-foreground">{page}</strong> / {totalPages}</p><div className="flex gap-2"><Button variant="outline" size="icon" disabled={page <= 1} onClick={() => setPage(p => p - 1)} data-testid="button-page-prev"><ChevronLeft size={18} /></Button><Button variant="outline" size="icon" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)} data-testid="button-page-next"><ChevronRight size={18} /></Button></div></div> : null}</main>{record && <RecordDialog record={record} onClose={() => setSelected(null)} />}</PublicShell>;
}
function LoadingRows() { return <div className="space-y-3">{[1, 2, 3, 4].map(i => <div key={i} className="h-28 animate-pulse rounded-2xl bg-muted" />)}</div>; }
function RecordRow({ item, onOpen }: { item: PublicRecord; onOpen: () => void }) { return <button onClick={onOpen} className="lift focus-ring flex w-full flex-col gap-4 rounded-2xl border border-border bg-card p-5 text-left sm:flex-row sm:items-center sm:justify-between" data-testid={`button-record-${item.id}`}><div className="flex min-w-0 items-start gap-4"><div className="mt-1 hidden h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary sm:flex"><Building2 size={19} /></div><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><span className="mono-label text-primary">{categoryNames[item.category] ?? item.category}</span><StatusPill status={item.status} /></div><h3 className="mt-2 truncate text-base font-bold">{item.title}</h3><p className="mt-1 truncate text-sm text-muted-foreground">{item.subtitle}</p></div></div><div className="flex shrink-0 items-center gap-3 text-sm text-muted-foreground"><span className="flex items-center gap-1"><MapPin size={14} />{item.location}</span><ArrowUpRight size={17} className="text-primary" /></div></button>; }
function RecordDialog({ record, onClose }: { record: PublicRecord; onClose: () => void }) { return <div className="fixed inset-0 z-50 flex items-end justify-center bg-primary/30 p-0 backdrop-blur-sm sm:items-center sm:p-5" onClick={onClose}><div className="max-h-[90vh] w-full max-w-2xl overflow-auto rounded-t-3xl border border-border bg-card p-6 shadow-2xl sm:rounded-3xl" onClick={e => e.stopPropagation()} role="dialog" aria-modal="true" data-testid="dialog-record-detail"><div className="flex items-start justify-between"><div><p className="mono-label text-primary">{categoryNames[record.category]}</p><h2 className="mt-2 text-2xl font-extrabold">{record.title}</h2></div><button className="focus-ring rounded-lg p-2 hover:bg-muted" onClick={onClose} aria-label="Đóng chi tiết" data-testid="button-close-record"><X size={19} /></button></div><div className="mt-5 grid gap-3 rounded-2xl bg-secondary/60 p-4 text-sm sm:grid-cols-2"><p><span className="block text-xs text-muted-foreground">Địa chỉ</span><strong>{record.location}</strong></p><p><span className="block text-xs text-muted-foreground">Ngày công bố</span><strong>{formatDate(record.publishedAt)}</strong></p><p><span className="block text-xs text-muted-foreground">Trạng thái</span><StatusPill status={record.status} /></p></div><div className="mt-6"><h3 className="font-bold">Thông tin hồ sơ</h3><dl className="mt-3 divide-y divide-border">{Object.entries(record.metadata ?? {}).map(([key, value]) => <div key={key} className="flex justify-between gap-5 py-3 text-sm"><dt className="text-muted-foreground">{key}</dt><dd className="text-right font-semibold">{value}</dd></div>)}</dl></div></div></div>; }

export function RegisterPage() {
  if (sessionStorage.getItem('attp-session-role') === 'facility') return <FacilityProfilePage />;
  return <PublicShell><main className="mx-auto max-w-7xl px-5 py-12 lg:px-8 lg:py-16"><ApplicationForm /></main></PublicShell>;
}

export function AdminLoginPage() {
  const [, navigate] = useLocation();
  const [username, setUsername] = useState('canbo.demo');
  const [password, setPassword] = useState('');
  const [notice, setNotice] = useState('');

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!username.trim() || !password.trim()) {
      setNotice('Vui lòng nhập tên đăng nhập và mật khẩu.');
      return;
    }
    const role = inferAccountRole(username);
    sessionStorage.setItem('attp-session-role', role);
    if (role === 'admin') {
      sessionStorage.setItem('attp-reviewer-session', 'active');
      navigate('/admin');
    } else {
      sessionStorage.removeItem('attp-reviewer-session');
      sessionStorage.setItem('attp-session-username', username.trim());
      navigate('/facility/profile');
    }
  };

  return <PublicShell><main className="portal-grid min-h-[calc(100dvh-170px)] px-5 py-12 lg:px-8 lg:py-20">
    <div className="mx-auto max-w-xl overflow-hidden rounded-[2rem] border border-border bg-card shadow-2xl shadow-primary/10">
      <div className="p-8 lg:p-12">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary text-primary"><ShieldCheck size={24} /></div>
         <p className="mono-label mt-7 text-primary">ĐĂNG NHẬP HỆ THỐNG</p>
         <h2 className="mt-2 text-3xl font-extrabold">Đăng nhập</h2>
         <p className="mt-3 text-sm leading-6 text-muted-foreground">Chọn đúng loại tài khoản để vào khu vực làm việc tương ứng.</p>
         <form onSubmit={submit} className="mt-8 space-y-5">
          <label className="block"><span className="mb-2 block text-sm font-semibold">Tên đăng nhập hoặc email</span><input value={username} onChange={e => setUsername(e.target.value)} autoComplete="username" className="focus-ring h-12 w-full rounded-xl border border-input bg-background px-4 text-sm" data-testid="input-reviewer-username" /></label>
          <label className="block"><span className="mb-2 block text-sm font-semibold">Mật khẩu</span><input type="password" value={password} onChange={e => setPassword(e.target.value)} autoComplete="current-password" placeholder="Nhập mật khẩu" className="focus-ring h-12 w-full rounded-xl border border-input bg-background px-4 text-sm" data-testid="input-reviewer-password" /></label>
          {notice && <p className="rounded-xl bg-red-50 px-3 py-2 text-sm font-semibold text-red-800" role="alert" data-testid="status-login-error">{notice}</p>}
           <Button type="submit" className="h-12 w-full rounded-xl" data-testid="button-reviewer-login"><LogIn size={17} /> Đăng nhập</Button>
        </form>
         <p className="mt-5 rounded-xl bg-secondary/70 p-3 text-xs leading-5 text-muted-foreground"><strong className="text-foreground">Bản mẫu:</strong> dùng tên `canbo.demo` để vào Admin hoặc `coso.demo` để vào portal cơ sở. Khi vận hành thật, hệ thống sẽ nhận diện vai trò từ tài khoản được cấp.</p>
        <Link href="/" className="focus-ring mt-6 inline-flex items-center gap-2 text-sm font-bold text-primary" data-testid="link-back-public-login"><ArrowLeft size={16} /> Về cổng công khai</Link>
      </div>
    </div>
  </main></PublicShell>;
}

export function FacilityProfilePage() {
  type FacilityProfile = { name: string; taxCode: string; address: string; representative: string; phone: string; email: string; licenseNumber: string; licenseIssued: string; licenseExpires: string; productGroups: string; origin: string; safetyOfficer: string; operatingHours: string; notes: string };
  const defaultProfile: FacilityProfile = { name: 'Công ty TNHH Nông sản An Phú', taxCode: '0312345678', address: '184 Nguyễn Văn Linh, Quận 7, TP.HCM', representative: 'Nguyễn Hoàng Anh', phone: '0908 123 456', email: '', licenseNumber: 'ATTP-2026-088', licenseIssued: '2026-06-12', licenseExpires: '2027-06-12', productGroups: 'Rau củ quả, Thịt gia súc', origin: 'Hợp tác xã rau sạch Củ Chi', safetyOfficer: 'Lê Minh Trang', operatingHours: '06:00 - 17:00', notes: '' };
  const accountName = sessionStorage.getItem('attp-session-username') || 'coso.demo';
  const profileStorageKey = `attp-facility-profile:${accountName}`;
  const attachmentStorageKey = `attp-facility-attachments:${accountName}`;
  const [profile, setProfile] = useState<FacilityProfile>(() => {
    const saved = sessionStorage.getItem(profileStorageKey) || (accountName === 'coso.demo' ? sessionStorage.getItem('attp-facility-profile') : null);
    if (!saved) return defaultProfile;
    try { return { ...defaultProfile, ...JSON.parse(saved) }; } catch { return defaultProfile; }
  });
  const [attachments, setAttachments] = useState<string[]>(() => {
    const saved = sessionStorage.getItem(attachmentStorageKey) || (accountName === 'coso.demo' ? sessionStorage.getItem('attp-facility-attachments') : null);
    if (!saved) return ['giay-phep-attp.pdf', 'giay-dkkd.pdf', 'kho-bao-quan-01.jpg'];
    try { return JSON.parse(saved); } catch { return ['giay-phep-attp.pdf', 'giay-dkkd.pdf', 'kho-bao-quan-01.jpg']; }
  });
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  const update = (key: keyof FacilityProfile, value: string) => setProfile((current: FacilityProfile) => ({ ...current, [key]: value }));
  const addAttachments = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files ?? []);
    const invalid = selectedFiles.find(file => !['application/pdf', 'image/jpeg', 'image/png'].includes(file.type) || file.size > 5 * 1024 * 1024);
    if (invalid) {
      setError('Chỉ nhận tệp PDF, JPG, PNG và mỗi tệp không quá 5MB.');
      event.target.value = '';
      return;
    }
    setAttachments(current => [...current, ...selectedFiles.map(file => file.name).filter(name => !current.includes(name))]);
    event.target.value = '';
    setError('');
  };
  const removeAttachment = (name: string) => setAttachments(current => current.filter(file => file !== name));
  const submit = (event: FormEvent) => {
    event.preventDefault();
    const required: Array<keyof FacilityProfile> = ['name', 'taxCode', 'address', 'representative', 'phone', 'licenseNumber', 'licenseIssued', 'licenseExpires', 'productGroups'];
    if (required.some(key => !profile[key].trim())) {
      setError('Vui lòng điền đầy đủ các trường bắt buộc trước khi lưu.');
      setNotice('');
      return;
    }
    sessionStorage.setItem(profileStorageKey, JSON.stringify(profile));
    sessionStorage.setItem('attp-facility-profile', JSON.stringify(profile));
    sessionStorage.setItem(attachmentStorageKey, JSON.stringify(attachments));
    sessionStorage.setItem('attp-facility-attachments', JSON.stringify(attachments));
    setError('');
    setNotice('Thông tin bổ sung đã được lưu và chuyển tới cán bộ chuyên môn rà soát.');
  };

  return <PublicShell><main className="mx-auto max-w-6xl px-5 py-9 lg:px-8 lg:py-12"><SectionHeading eyebrow={`Tài khoản cơ sở · ${accountName}`} title="Hồ sơ cơ sở" description="Thông tin này được lấy từ hồ sơ đã đăng ký. Bạn có thể cập nhật lại khi có thay đổi hoặc nhận yêu cầu bổ sung." action={<StatusPill status="pending" />} /><div className="mb-6 flex items-start gap-3 rounded-2xl border border-orange-200 bg-orange-50 p-4 text-sm text-orange-950"><Bell className="mt-0.5 shrink-0" size={19} /><p><strong>Thông báo hồ sơ</strong><br />Cán bộ chuyên môn yêu cầu rà soát lại ảnh khu vực bảo quản trước khi hồ sơ được duyệt.</p></div><form onSubmit={submit} className="space-y-6">
    <FormSection title="Thông tin pháp nhân" icon={Building2}><div className="grid gap-4 md:grid-cols-2"><Field label="Tên cơ sở *" value={profile.name} onChange={value => update('name', value)} test="input-facility-name" wide /><Field label="Mã số thuế *" value={profile.taxCode} onChange={value => update('taxCode', value)} test="input-facility-tax-code" /><Field label="Địa chỉ đầy đủ *" value={profile.address} onChange={value => update('address', value)} test="input-facility-address" wide /><Field label="Người đại diện pháp luật *" value={profile.representative} onChange={value => update('representative', value)} test="input-facility-representative" /><Field label="Số điện thoại *" value={profile.phone} onChange={value => update('phone', value)} test="input-facility-phone" /><Field label="Email liên hệ" value={profile.email} onChange={value => update('email', value)} test="input-facility-email" type="email" /></div></FormSection>
    <FormSection title="Giấy phép & nguồn gốc sản phẩm" icon={FileText}><div className="grid gap-4 md:grid-cols-3"><Field label="Số giấy phép ATTP *" value={profile.licenseNumber} onChange={value => update('licenseNumber', value)} test="input-facility-license-number" /><Field label="Ngày cấp *" value={profile.licenseIssued} onChange={value => update('licenseIssued', value)} test="input-facility-license-issued" type="date" /><Field label="Ngày hết hạn *" value={profile.licenseExpires} onChange={value => update('licenseExpires', value)} test="input-facility-license-expires" type="date" /><Field label="Nhóm sản phẩm cung cấp *" value={profile.productGroups} onChange={value => update('productGroups', value)} test="input-facility-product-groups" wide /><Field label="Vùng trồng / nuôi / khai thác" value={profile.origin} onChange={value => update('origin', value)} test="input-facility-origin" wide /></div></FormSection>
    <FormSection title="Thông tin bổ sung" icon={UserRound}><div className="grid gap-4 md:grid-cols-2"><Field label="Người phụ trách an toàn thực phẩm" value={profile.safetyOfficer} onChange={value => update('safetyOfficer', value)} test="input-facility-safety-officer" /><Field label="Giờ hoạt động" value={profile.operatingHours} onChange={value => update('operatingHours', value)} test="input-facility-operating-hours" /><Field label="Ghi chú bổ sung cho cán bộ" value={profile.notes} onChange={value => update('notes', value)} test="input-facility-notes" wide placeholder="Ví dụ: thay đổi địa chỉ kho, bổ sung quy trình bảo quản..." /></div></FormSection>
    <FormSection title="Tệp hồ sơ" icon={ImagePlus}><div className="space-y-3"><div className="flex flex-wrap items-center justify-between gap-3"><p className="text-sm text-muted-foreground">Bổ sung tài liệu khi cán bộ yêu cầu. Nhận PDF, JPG, PNG, tối đa 5MB mỗi tệp.</p><label className="focus-ring inline-flex cursor-pointer items-center gap-2 rounded-xl border border-primary/25 px-4 py-2.5 text-sm font-bold text-primary hover:bg-secondary"><Plus size={16} /> Thêm tệp<input type="file" accept=".pdf,.jpg,.jpeg,.png" multiple className="sr-only" onChange={addAttachments} data-testid="input-facility-attachments" /></label></div><div className="space-y-2">{attachments.map(file => <div key={file} className="flex items-center justify-between gap-3 rounded-xl bg-muted/70 px-3 py-3 text-sm"><span className="flex min-w-0 items-center gap-2 truncate"><FileText size={16} className="shrink-0 text-primary" />{file}</span><button type="button" onClick={() => removeAttachment(file)} className="shrink-0 text-xs font-bold text-muted-foreground hover:text-destructive" data-testid={`button-remove-facility-attachment-${file}`}>Xóa</button></div>)}</div></div></FormSection>
    {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-800" role="alert" data-testid="status-facility-profile-error">{error}</p>}
    <div className="flex flex-col gap-4 rounded-2xl border border-border bg-secondary/50 p-5 sm:flex-row sm:items-center sm:justify-between"><div className="flex gap-3 text-sm"><LockKeyhole className="mt-0.5 shrink-0 text-primary" size={18} /><p><strong>Chỉ cập nhật thông tin cơ sở.</strong><br /><span className="text-muted-foreground">Sau khi gửi, thông tin bổ sung sẽ được chuyển lại cho cán bộ chuyên môn rà soát.</span></p></div><Button type="submit" className="h-11 rounded-xl px-6" data-testid="button-submit-facility-supplement">Gửi bổ sung</Button></div>
  </form>{notice && <Notice message={notice} onClose={() => setNotice('')} />}</main></PublicShell>;
}

function ApplicationForm() {
  const [type, setType] = useState<ApplicationType>('food-supplier');
  const [fields, setFields] = useState<Record<string, CriteriaValue>>({});
  const [files, setFiles] = useState<Attachment[]>([]);
  const [notice, setNotice] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const queryClient = useQueryClient();
  const create = useCreateApplication();
  const { data: suppliers } = useListApprovedSuppliers({ query: { queryKey: getListApprovedSuppliersQueryKey() } });
  const { data: criteriaSet, isLoading: loadingCriteria, isError: criteriaError } = useGetCriteria({ type });
   const update = (key: string, value: CriteriaValue) => setFields(prev => ({ ...prev, [key]: value }));
  const changeType = (nextType: ApplicationType) => {
    setType(nextType);
    setFields({});
    setFiles([]);
    setNotice('');
  };
  const addFiles = (event: ChangeEvent<HTMLInputElement>) => {
     const chosen = Array.from(event.target.files ?? []);
    const invalid = chosen.find(file => !['application/pdf', 'image/jpeg', 'image/png'].includes(file.type) || file.size > 5 * 1024 * 1024);
    if (invalid) { setNotice('Chỉ nhận PDF, JPG, PNG và mỗi tệp không quá 5MB.'); return; }
    setFiles(prev => [...prev, ...chosen.map(file => ({ name: file.name, kind: file.type, size: file.size }))]);
  };
   const addFilesFor = (fieldKey: string, event: ChangeEvent<HTMLInputElement>) => {
     const chosen = Array.from(event.target.files ?? []);
     const invalid = chosen.find(file => !['application/pdf', 'image/jpeg', 'image/png'].includes(file.type) || file.size > 5 * 1024 * 1024);
     if (invalid) { setNotice('Chỉ nhận PDF, JPG, PNG và mỗi tệp không quá 5MB.'); event.target.value = ''; return; }
     setFiles(prev => [...prev, ...chosen.map(file => ({ name: file.name, kind: file.type, size: file.size, fieldKey }))]);
     event.target.value = '';
     setNotice('');
   };
   const removeFile = (name: string, fieldKey?: string) => setFiles(prev => prev.filter(file => !(file.name === name && (!fieldKey || file.fieldKey === fieldKey))));
  const submit = (event: FormEvent) => {
    event.preventDefault();
     const criteria = criteriaSet?.criteria.filter(item => item.active).sort((a, b) => a.order - b.order) ?? [];
      const missing = criteria.filter(item => {
        if (!item.required) return false;
         const answerTypes = getAnswerTypes(item);
         if (answerTypes.includes('file') && !files.some(file => file.fieldKey === item.key)) return true;
        const value = fields[item.key];
         return answerTypes.some(answerType => {
           if (answerType === 'file') return false;
           const answer = getCriteriaValue(value ?? '', answerType, answerTypes.length > 1);
           return Array.isArray(answer) ? answer.length === 0 : !answer?.trim();
         });
      });
     if (missing.length) { setNotice(`Vui lòng hoàn thiện: ${missing.slice(0, 3).map(item => item.label).join(', ')}${missing.length > 3 ? '…' : ''}.`); return; }
     const data = { ...fields } as Record<string, unknown>;
      criteria.filter(item => getAnswerTypes(item).includes('file')).forEach(item => {
        const answerTypes = getAnswerTypes(item);
        const fileValue = files.filter(file => file.fieldKey === item.key).map(file => file.name);
        data[item.key] = answerTypes.length > 1
          ? setCriteriaValue(fields[item.key] ?? {}, 'file', fileValue, true)
          : fileValue;
     });
       const asText = (value: CriteriaValue | undefined) => typeof value === 'object' && !Array.isArray(value) ? String(value.text ?? '') : Array.isArray(value) ? value[0] ?? '' : value ?? '';
      const input: ApplicationInput = { type, applicantName: asText(fields.applicantName), address: asText(fields.address), contact: asText(fields.contact), criteriaVersion: criteriaSet?.version ?? '', isThirdParty: type === 'school' && fields.mealModel !== 'Tự nấu' && fields.supplierSource === 'manual', data, attachments: files };
    create.mutate({ data: input }, { onSuccess: () => { queryClient.invalidateQueries({ queryKey: getListApplicationsQueryKey() }); queryClient.invalidateQueries({ queryKey: getGetAdminSummaryQueryKey() }); setSubmitted(true); setNotice('Hồ sơ đã được tiếp nhận và chuyển sang trạng thái chờ duyệt.'); }, onError: () => setNotice('Không thể nộp hồ sơ lúc này. Vui lòng thử lại.') });
  };
  if (submitted) return <div className="mx-auto max-w-2xl py-10 text-center"><div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-secondary text-primary"><Check size={30} /></div><p className="mono-label mt-7 text-primary">ĐÃ TIẾP NHẬN HỒ SƠ</p><h1 className="display-tight mt-3 text-4xl font-extrabold">Hồ sơ đang chờ xét duyệt.</h1><p className="mx-auto mt-4 max-w-lg text-sm leading-6 text-muted-foreground">Thông tin đã được khóa để bảo đảm tính toàn vẹn. Cán bộ chuyên môn sẽ liên hệ qua thông tin bạn cung cấp nếu cần bổ sung.</p><div className="mt-8 flex justify-center gap-3"><ButtonLink href="/">Về trang chủ</ButtonLink><Button onClick={() => { setSubmitted(false); setFields({}); setFiles([]); setNotice(''); }} variant="outline" className="rounded-xl">Nộp hồ sơ khác</Button></div>{notice && <Notice message={notice} onClose={() => setNotice('')} />}</div>;
   if (loadingCriteria) return <div className="mx-auto max-w-4xl"><LoadingRows /></div>;
   if (criteriaError || !criteriaSet) return <EmptyState title="Không thể tải bộ câu hỏi" description="Vui lòng thử lại sau ít phút." />;
   const criteria = criteriaSet.criteria.filter(item => item.active).sort((a, b) => a.order - b.order);
    const groups = criteriaSet.groups.slice().sort((a, b) => a.order - b.order).filter(group => criteria.some(item => item.groupId === group.id));
   return <div className="mx-auto max-w-4xl"><SectionHeading eyebrow="Đăng ký trực tuyến · Form tự sinh" title="Thông tin đăng ký" description={`Các câu hỏi được sinh từ bộ tiêu chí ${criteriaSet.version}. Khi bộ tiêu chí thay đổi, form mới sẽ tự cập nhật mà không ảnh hưởng hồ sơ đã nộp.`} /><form onSubmit={submit} className="space-y-6">
     <div className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6"><label htmlFor="registration-type" className="block text-sm font-bold">Loại cơ sở đăng ký <span className="text-destructive">*</span></label><select id="registration-type" value={type} onChange={event => changeType(event.target.value as ApplicationType)} className="focus-ring mt-2 h-12 w-full rounded-xl border border-input bg-background px-4 text-sm font-semibold" data-testid="select-registration-type"><option value="food-supplier">Đơn vị cung cấp thực phẩm</option><option value="meal-provider">Đơn vị cung cấp suất ăn</option><option value="school">Cơ sở giáo dục</option></select><p className="mt-3 text-sm leading-6 text-muted-foreground">Bộ câu hỏi hiện có {criteria.length} tiêu chí active, phiên bản {criteriaSet.version}. Trường có dấu * là bắt buộc.</p></div>
      {groups.map(group => <FormSection key={group.id} title={group.name} icon={group.name.includes('Minh chứng') ? ImagePlus : group.name.includes('pháp lý') ? FileText : UserRound}>{criteria.filter(item => item.groupId === group.id).map(item => <DynamicQuestion key={item.id} item={item} value={fields[item.key] ?? ''} files={files.filter(file => file.fieldKey === item.key)} suppliers={suppliers ?? []} onChange={value => update(item.key, value)} onFiles={event => addFilesFor(item.key, event)} onRemoveFile={name => removeFile(name, item.key)} />)}</FormSection>)}
    <div className="flex flex-col gap-4 rounded-2xl border border-border bg-secondary/50 p-5 sm:flex-row sm:items-center sm:justify-between"><div className="flex gap-3 text-sm"><LockKeyhole className="mt-0.5 shrink-0 text-primary" size={18} /><p><strong>Kiểm tra trước khi nộp.</strong><br /><span className="text-muted-foreground">Sau khi gửi, hồ sơ sẽ khóa chỉnh sửa cho đến khi có yêu cầu bổ sung.</span></p></div><Button type="submit" disabled={create.isPending} className="h-12 rounded-xl px-6" data-testid="button-submit-application">{create.isPending ? 'Đang gửi...' : 'Nộp hồ sơ'} <Send size={16} /></Button></div>
  </form>{notice && <Notice message={notice} onClose={() => setNotice('')} />}</div>;
}

 function DynamicQuestion({ item, value, files, suppliers, onChange, onFiles, onRemoveFile }: { item: CriteriaDefinition; value: CriteriaValue; files: Attachment[]; suppliers: { id: string; name: string; taxCode: string }[]; onChange: (value: CriteriaValue) => void; onFiles: (event: ChangeEvent<HTMLInputElement>) => void; onRemoveFile: (name: string) => void }) {
   const answerTypes = getAnswerTypes(item);
   const multiple = answerTypes.length > 1;
   return <div className={multiple ? 'space-y-2' : undefined}>{answerTypes.map(answerType => {
     const renderedItem = multiple ? { ...item, answerType, answerTypes: [answerType], label: `${item.label} · ${answerTypeLabels[answerType]}` } : item;
     return <DynamicQuestionControl key={answerType} item={renderedItem} value={getCriteriaValue(value, answerType, multiple)} files={files} suppliers={suppliers} onChange={next => onChange(setCriteriaValue(value, answerType, next, multiple))} onFiles={onFiles} onRemoveFile={onRemoveFile} />;
   })}</div>;
 }

 function DynamicQuestionControl({ item, value, files, suppliers, onChange, onFiles, onRemoveFile }: { item: CriteriaDefinition; value: string | string[]; files: Attachment[]; suppliers: { id: string; name: string; taxCode: string }[]; onChange: (value: string | string[]) => void; onFiles: (event: ChangeEvent<HTMLInputElement>) => void; onRemoveFile: (name: string) => void }) {
  const options = item.key === 'supplierId' ? suppliers.map(supplier => `${supplier.id} · ${supplier.name} · ${supplier.taxCode}`) : item.options;
  const requiredMark = item.required ? <span className="text-destructive"> *</span> : null;
  const sourceNote = item.sourceMaterials.length > 0 ? <div className="mt-2 rounded-lg border border-primary/10 bg-secondary/50 px-3 py-2 text-xs text-muted-foreground"><span className="font-bold text-primary">Căn cứ:</span> {item.sourceMaterials.map(source => source.name).join(', ')}</div> : null;
  if (item.answerType === 'file') return <div className="mt-5 first:mt-0"><label className="mb-2 block text-sm font-semibold">{item.label}{requiredMark}</label>{item.description && <p className="mb-2 text-xs text-muted-foreground">{item.description}</p>}{sourceNote}<p className="mb-2 mt-3 text-xs text-muted-foreground">PDF, JPG hoặc PNG · tối đa 5MB/tệp · có thể chọn nhiều tệp</p><label className="focus-ring flex min-h-16 cursor-pointer items-center gap-3 rounded-xl border border-dashed border-primary/35 bg-secondary/30 px-4 text-sm font-semibold text-primary hover:bg-secondary"><Plus size={18} /><span>Chọn tệp minh chứng</span><input type="file" accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png" multiple onChange={onFiles} className="sr-only" data-testid={`input-criteria-${item.key}`} /></label>{files.length > 0 && <div className="mt-3 space-y-2">{files.map(file => <div key={file.name} className="flex items-center justify-between rounded-lg bg-muted px-3 py-2 text-sm"><span className="flex min-w-0 items-center gap-2 truncate"><FileText size={15} className="shrink-0 text-primary" />{file.name}</span><button type="button" onClick={() => onRemoveFile(file.name)} className="focus-ring ml-3 shrink-0 text-muted-foreground hover:text-destructive" aria-label={`Xóa ${file.name}`}><X size={15} /></button></div>)}</div>}</div>;
  if (item.answerType === 'multi-select') {
    const selected = Array.isArray(value) ? value : value ? [value] : [];
    return <fieldset className="mt-5 first:mt-0"><legend className="mb-2 block text-sm font-semibold">{item.label}{requiredMark}</legend><div className="grid gap-2 sm:grid-cols-2">{options.map(option => <label key={option} className="flex cursor-pointer items-center gap-3 rounded-xl border border-input bg-background px-3 py-3 text-sm hover:bg-secondary"><input type="checkbox" checked={selected.includes(option)} onChange={event => onChange(event.target.checked ? [...selected, option] : selected.filter(current => current !== option))} className="h-4 w-4 accent-primary" data-testid={`input-criteria-${item.key}-${option}`} /><span>{option}</span></label>)}</div>{item.description && <span className="mt-2 block text-xs text-muted-foreground">{item.description}</span>}{sourceNote}</fieldset>;
  }
  if (item.answerType === 'yes-no' || item.answerType === 'select') return <label className="mt-5 block first:mt-0"><span className="mb-2 block text-sm font-semibold">{item.label}{requiredMark}</span><select value={Array.isArray(value) ? value[0] ?? '' : value} onChange={event => onChange(event.target.value)} className="focus-ring h-11 w-full rounded-xl border border-input bg-background px-3 text-sm" data-testid={`input-criteria-${item.key}`}><option value="">Chọn một phương án</option>{options.map(option => <option key={option} value={option}>{option}</option>)}</select>{item.description && <span className="mt-1 block text-xs text-muted-foreground">{item.description}</span>}{sourceNote}</label>;
  return <label className="mt-5 block first:mt-0"><span className="mb-2 block text-sm font-semibold">{item.label}{requiredMark}</span><input type={item.answerType === 'number' ? 'number' : item.answerType === 'date' ? 'date' : 'text'} value={Array.isArray(value) ? value.join(', ') : value} onChange={event => onChange(event.target.value)} className="focus-ring h-11 w-full rounded-xl border border-input bg-background px-3 text-sm" data-testid={`input-criteria-${item.key}`} />{item.description && <span className="mt-1 block text-xs text-muted-foreground">{item.description}</span>}{sourceNote}</label>;
}

function FormSection({ title, icon: Icon, children }: { title: string; icon: typeof UserRound; children: ReactNode }) { return <section className="rounded-2xl border border-border bg-card p-5 md:p-7"><div className="mb-6 flex items-center gap-3 border-b border-border pb-4"><div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary text-primary"><Icon size={18} /></div><h2 className="text-lg font-extrabold">{title}</h2></div>{children}</section>; }
function Field({ label, value = '', onChange, test, type = 'text', placeholder, wide = false, hidden = false }: { label: string; value?: string; onChange: (value: string) => void; test: string; type?: string; placeholder?: string; wide?: boolean; hidden?: boolean }) { if (hidden) return null; return <label className={wide ? 'md:col-span-2' : ''}><span className="mb-2 block text-sm font-semibold">{label}</span><input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className="focus-ring h-11 w-full rounded-xl border border-input bg-background px-3 text-sm" data-testid={test} /></label>; }
function FilePicker({ label, files, onChange, onRemove, test, multiple = false }: { label: string; files: Attachment[]; onChange: (event: ChangeEvent<HTMLInputElement>) => void; onRemove: (name: string) => void; test: string; multiple?: boolean }) { return <div className="mt-5"><label className="mb-2 block text-sm font-semibold">{label}</label><label className="focus-ring flex min-h-16 cursor-pointer items-center gap-3 rounded-xl border border-dashed border-primary/35 bg-secondary/30 px-4 text-sm font-semibold text-primary hover:bg-secondary"><Plus size={18} /><span>Chọn tệp {multiple ? '(có thể chọn nhiều)' : ''}</span><input type="file" accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png" multiple={multiple} onChange={onChange} className="sr-only" data-testid={test} /></label>{files.length > 0 && <div className="mt-3 space-y-2">{files.map(file => <div key={file.name} className="flex items-center justify-between rounded-lg bg-muted px-3 py-2 text-sm"><span className="flex min-w-0 items-center gap-2 truncate"><FileText size={15} className="shrink-0 text-primary" />{file.name}</span><button type="button" onClick={() => onRemove(file.name)} className="focus-ring ml-3 shrink-0 text-muted-foreground hover:text-destructive" aria-label={`Xóa ${file.name}`} data-testid={`button-remove-file-${file.name}`}><X size={15} /></button></div>)}</div>}</div>; }

function MealProviderFields({ fields, update, suppliers }: { fields: Record<string, string>; update: (key: string, value: string) => void; suppliers: { id: string; name: string; taxCode: string }[] }) { return <><FormSection title="Nhân lực & năng lực cung ứng" icon={Users}><div className="grid gap-4 md:grid-cols-3"><Field label="Tổng nhân viên chế biến *" value={fields.staffTotal} onChange={v => update('staffTotal', v)} test="input-staff-total" type="number" /><Field label="Có chứng chỉ tập huấn ATTP *" value={fields.staffTrained} onChange={v => update('staffTrained', v)} test="input-staff-trained" type="number" /><Field label="Có khám sức khỏe còn hiệu lực *" value={fields.staffHealth} onChange={v => update('staffHealth', v)} test="input-staff-health" type="number" /></div><div className="mt-4 grid gap-4 md:grid-cols-2"><label><span className="mb-2 block text-sm font-semibold">Nhà cung cấp thực phẩm *</span><select value={fields.supplierId ?? ''} onChange={e => update('supplierId', e.target.value)} className="focus-ring h-11 w-full rounded-xl border border-input bg-background px-3 text-sm" data-testid="select-meal-supplier"><option value="">Chọn từ danh sách đã đăng ký</option>{suppliers.map(supplier => <option key={supplier.id} value={supplier.id}>{supplier.name} · {supplier.taxCode}</option>)}</select></label><Field label="Công suất suất ăn / ngày *" value={fields.dailyCapacity} onChange={v => update('dailyCapacity', v)} test="input-daily-capacity" type="number" /><Field label="Số trường / đơn vị đang phục vụ *" value={fields.servingUnits} onChange={v => update('servingUnits', v)} test="input-serving-units" type="number" wide /><Field label="Tên các trường đang phục vụ (nếu có)" value={fields.servingNames} onChange={v => update('servingNames', v)} test="input-serving-names" wide /></div></FormSection></>; }

function SchoolFields({ fields, update, suppliers, files, addFiles, removeFile }: { fields: Record<string, string>; update: (key: string, value: string) => void; suppliers: { id: string; name: string; taxCode: string }[]; files: Attachment[]; addFiles: (event: ChangeEvent<HTMLInputElement>) => void; removeFile: (name: string) => void }) { return <><FormSection title="Trách nhiệm an toàn thực phẩm" icon={ShieldCheck}><div className="grid gap-4 md:grid-cols-2"><SelectField label="Có cán bộ phụ trách ATTP? *" value={fields.hasFoodSafetyLead} onChange={v => update('hasFoodSafetyLead', v)} test="select-food-safety-lead" options={['Có', 'Không']} /><SelectField label="Hình thức tổ chức bữa ăn *" value={fields.mealModel} onChange={v => update('mealModel', v)} test="select-meal-model" options={['Tự nấu', 'Liên kết đơn vị suất ăn', 'Thuê đơn vị nấu tại bếp trường']} /></div>{fields.hasFoodSafetyLead === 'Có' && <div className="mt-4 grid gap-4 md:grid-cols-2"><Field label="Họ tên người phụ trách *" value={fields.safetyLeadName} onChange={v => update('safetyLeadName', v)} test="input-safety-lead-name" /><FilePicker label="Chứng chỉ / tập huấn ATTP *" files={files.filter(f => f.name.startsWith('lead-'))} onChange={addFiles} onRemove={removeFile} test="input-lead-certificate" /></div>}{fields.mealModel && fields.mealModel !== 'Tự nấu' && <div className="mt-5 rounded-xl border border-accent/50 bg-accent/15 p-4"><p className="text-sm font-bold">Đơn vị cung cấp suất ăn</p><p className="mt-1 text-xs text-muted-foreground">Nếu chọn nhập trực tiếp, thông tin sẽ hiển thị nhãn “do bên thứ ba cung cấp, chưa xác minh trực tiếp”.</p><div className="mt-4 grid gap-4 md:grid-cols-2"><label><span className="mb-2 block text-sm font-semibold">Nguồn thông tin *</span><select value={fields.supplierSource ?? ''} onChange={e => update('supplierSource', e.target.value)} className="focus-ring h-11 w-full rounded-xl border border-input bg-background px-3 text-sm" data-testid="select-school-supplier-source"><option value="">Chọn nguồn</option><option value="verified">Chọn đơn vị đã đăng ký</option><option value="manual">Nhập đơn vị trực tiếp</option></select></label>{fields.supplierSource === 'verified' ? <label><span className="mb-2 block text-sm font-semibold">Đơn vị suất ăn *</span><select value={fields.supplierId ?? ''} onChange={e => update('supplierId', e.target.value)} className="focus-ring h-11 w-full rounded-xl border border-input bg-background px-3 text-sm" data-testid="select-school-supplier"><option value="">Chọn nhà cung cấp</option>{suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}</select></label> : <><Field label="Tên đơn vị *" value={fields.supplierName} onChange={v => update('supplierName', v)} test="input-school-supplier-name" /><Field label="Mã số thuế *" value={fields.supplierTax} onChange={v => update('supplierTax', v)} test="input-school-supplier-tax" /><Field label="Số điện thoại *" value={fields.supplierPhone} onChange={v => update('supplierPhone', v)} test="input-school-supplier-phone" /><Field label="Địa chỉ (không bắt buộc)" value={fields.supplierAddress} onChange={v => update('supplierAddress', v)} test="input-school-supplier-address" /></>}</div></div>}{fields.mealModel === 'Tự nấu' && <div className="mt-4 grid gap-4 md:grid-cols-2"><Field label="Số nhân viên bếp *" value={fields.kitchenStaff} onChange={v => update('kitchenStaff', v)} test="input-kitchen-staff" type="number" /><SelectField label="Nhân viên có chứng chỉ ATTP? *" value={fields.kitchenCertified} onChange={v => update('kitchenCertified', v)} test="select-kitchen-certified" options={['Có', 'Không']} /></div>}</FormSection><FormSection title="Cơ sở vật chất sơ bộ" icon={Building2}><div className="grid gap-4 md:grid-cols-2"><SelectField label="Bếp ăn theo nguyên tắc một chiều? *" value={fields.kitchenOneWay} onChange={v => update('kitchenOneWay', v)} test="select-kitchen-one-way" options={['Có', 'Không']} /><SelectField label="Có khu lưu mẫu thức ăn? *" value={fields.sampleStorage} onChange={v => update('sampleStorage', v)} test="select-sample-storage" options={['Có', 'Không']} /></div></FormSection></>; }
 function SelectField({ label, value = '', onChange, test, options }: { label: string; value?: string; onChange: (value: string) => void; test: string; options: string[] }) { return <label><span className="mb-2 block text-sm font-semibold">{label}</span><select value={value} onChange={e => onChange(e.target.value)} className="focus-ring h-11 w-full rounded-xl border border-input bg-background px-3 text-sm" data-testid={test}><option value="">Chọn một phương án</option>{options.map(option => <option key={option} value={option}>{option}</option>)}</select></label>; }

 function CriteriaAnswerTypeDropdown({ item, labels, onTypeChange, onToggleOption }: { item: CriteriaDefinition; labels: Record<CriteriaAnswerType, string>; onTypeChange: (answerType: CriteriaAnswerType) => void; onToggleOption: (option: string) => void }) {
   const [open, setOpen] = useState(false);
   const choiceType = item.answerType === 'select' || item.answerType === 'multi-select';
   const answerTypes = Object.entries(labels).filter(([value]) => value !== 'multi-select') as [CriteriaAnswerType, string][];
   const selectType = (answerType: CriteriaAnswerType) => {
     onTypeChange(answerType);
     if (answerType !== 'select') setOpen(false);
   };
   return <div className="relative">
     <button type="button" onClick={() => setOpen(value => !value)} className="focus-ring flex h-11 w-full items-center justify-between rounded-xl border border-input bg-background px-3 text-left text-sm" aria-expanded={open} data-testid={`select-criteria-answer-type-${item.key}`}>
       <span>{labels[item.answerType]}</span><ChevronDownIcon open={open} />
     </button>
     {open && <div className="absolute inset-x-0 top-12 z-20 overflow-hidden rounded-xl border border-border bg-card p-1 shadow-xl">
       {answerTypes.map(([value, label]) => {
         const isChoice = value === 'select' && choiceType;
         return <div key={value}>
           <button type="button" onClick={() => selectType(value)} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm hover:bg-secondary" data-testid={`answer-type-option-${item.key}-${value}`}>
             <input type="checkbox" readOnly checked={value === item.answerType || isChoice} className="h-4 w-4 accent-primary" tabIndex={-1} />
             <span className={value === item.answerType || isChoice ? 'font-semibold text-primary' : ''}>{label}</span>
           </button>
           {isChoice && <div className="mb-1 border-t border-border px-2 pb-1 pt-1">
             <p className="px-1 py-1 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Phương án có thể chọn</p>
             {item.options.length ? item.options.map(option => <label key={option} className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2 text-sm hover:bg-secondary">
               <input type="checkbox" checked={item.answerType === 'select' || item.options.includes(option)} onChange={() => onToggleOption(option)} className="h-4 w-4 accent-primary" data-testid={`checkbox-answer-option-${item.key}-${option}`} />
               <span>{option}</span>
             </label>) : <p className="px-1 py-2 text-xs text-muted-foreground">Nhập phương án ở ô bên dưới trước.</p>}
           </div>}
         </div>;
       })}
     </div>}
   </div>;
 }

 function ChevronDownIcon({ open }: { open: boolean }) {
   return <svg aria-hidden="true" className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.168l3.71-3.938a.75.75 0 1 1 1.08 1.04l-4.25 4.51a.75.75 0 0 1-1.08 0l-4.25-4.51a.75.75 0 0 1 .02-1.06Z" clipRule="evenodd" /></svg>;
 }

export function AdminDashboard() {
  const { data: summary, isLoading } = useGetAdminSummary();
  const [status, setStatus] = useState<ListApplicationsParams['status']>('pending');
  const [search, setSearch] = useState('');
  const params = useMemo<ListApplicationsParams>(() => ({ status, search: search || undefined }), [status, search]);
  const { data: applications, isLoading: loadingApps, isError } = useListApplications(params);
  return <AdminShell><div className="mx-auto max-w-7xl px-5 py-9 lg:px-10"><SectionHeading eyebrow="Tổng quan nghiệp vụ" title="Bàn xét duyệt hồ sơ." description="Theo dõi luồng tiếp nhận và xử lý hồ sơ đăng ký của các cơ sở trên địa bàn." action={<span className="mono-label text-muted-foreground">{new Date().toLocaleDateString('vi-VN')}</span>} /><div className="mt-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between"><div><p className="mono-label text-primary">Hàng đợi xét duyệt</p><h2 className="mt-2 text-2xl font-extrabold">Hồ sơ cần xử lý</h2></div><div className="flex flex-col gap-2 sm:flex-row"><label className="relative"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Tìm mã, tên đơn vị..." className="focus-ring h-10 rounded-lg border border-input bg-card pl-9 pr-3 text-sm" data-testid="input-admin-search" /></label><select value={status} onChange={e => setStatus(e.target.value as ListApplicationsParams['status'])} className="focus-ring h-10 rounded-lg border border-input bg-card px-3 text-sm font-semibold" data-testid="select-admin-status"><option value="pending">Chờ duyệt</option><option value="needs-more-info">Cần bổ sung</option><option value="approved">PASS</option><option value="warning">Cảnh báo / tạm dừng</option><option value="stopped">Dừng hoạt động</option><option value="rejected">Từ chối</option></select></div></div><div className="mt-5 overflow-hidden rounded-2xl border border-border bg-card">{loadingApps ? <LoadingRows /> : isError ? <EmptyState title="Không thể tải hàng đợi" description="Vui lòng thử tải lại trang." /> : applications?.length ? <div className="divide-y divide-border">{applications.map(app => <Link key={app.id} href={`/admin/applications/${app.id}`} className="lift flex flex-col gap-3 p-5 hover:bg-secondary/30 sm:flex-row sm:items-center sm:justify-between" data-testid={`link-application-${app.id}`}><div className="flex items-start gap-4"><div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary"><ClipboardCheck size={18} /></div><div><div className="flex flex-wrap items-center gap-2"><span className="font-mono text-xs font-semibold text-primary">{app.reference}</span><StatusPill status={app.status} /></div><h3 className="mt-1 font-bold">{app.applicantName}</h3><p className="mt-1 text-sm text-muted-foreground">{typeNames[app.type]} · {formatDate(app.submittedAt)}</p></div></div><div className="flex items-center justify-between gap-6 sm:justify-end"><div className="text-right"><p className="text-xs text-muted-foreground">Điểm hiện tại</p><p className="font-mono font-bold">{app.score}/100</p></div><ArrowUpRight size={18} className="text-primary" /></div></Link>)}</div> : <EmptyState title="Không có hồ sơ trong hàng đợi" description="Bộ lọc hiện tại không trả về hồ sơ nào." />}</div></div></AdminShell>;
}

export function AdminCriteriaPage() {
  const [type, setType] = useState<ApplicationType>('food-supplier');
  const { data: criteriaSet, isLoading, isError } = useGetCriteria({ type });
  const { data: history } = useListCriteriaHistory(type);
  const updateCriteriaMutation = useUpdateCriteria();
  const [groups, setGroups] = useState<CriteriaGroup[]>([]);
  const [draft, setDraft] = useState<CriteriaDefinition[]>([]);
  const [effectiveFrom, setEffectiveFrom] = useState('');
  const [applyMode, setApplyMode] = useState<CriteriaConfigInput['applyMode']>('now');
  const [notice, setNotice] = useState('');
  const [previewOpen, setPreviewOpen] = useState(false);

  const answerTypeLabels: Record<CriteriaAnswerType, string> = {
    text: 'Nhập văn bản',
    number: 'Nhập số',
    date: 'Ngày tháng',
    'yes-no': 'Có / Không',
    select: 'Chọn phương án',
    'multi-select': 'Chọn phương án',
    file: 'Tải tệp / ảnh',
  };

  useEffect(() => {
    if (!criteriaSet) return;
    setGroups(criteriaSet.groups.slice().sort((a, b) => a.order - b.order));
    setDraft(criteriaSet.criteria.map(item => ({ ...item, prerequisite: false })));
    setEffectiveFrom(criteriaSet.effectiveFrom);
  }, [criteriaSet?.version]);

  const ordinaryTotal = draft.filter(item => item.active).reduce((sum, item) => sum + Number(item.maxScore || 0), 0);
  const updateItem = (id: string, patch: Partial<CriteriaDefinition>) => setDraft(items => items.map(item => item.id === id ? { ...item, ...patch } : item));
  const updateGroup = (id: string, patch: Partial<CriteriaGroup>) => setGroups(items => items.map(group => group.id === id ? { ...group, ...patch } : group));
  const addGroup = () => setGroups(items => [...items, { id: `group-${Date.now()}`, name: 'Nhóm tiêu chí mới', order: items.length + 1 }]);
  const removeGroup = (id: string) => {
    const group = groups.find(item => item.id === id);
    const linkedCriteria = draft.filter(item => item.groupId === id);
    if (!group) return;
    if (linkedCriteria.length && !window.confirm(`Xóa “${group.name}” sẽ xóa luôn ${linkedCriteria.length} tiêu chí bên trong. Bạn có chắc không?`)) return;
    setGroups(items => items.filter(item => item.id !== id).map((item, index) => ({ ...item, order: index + 1 })));
    setDraft(items => items.filter(item => item.groupId !== id).map((item, index) => ({ ...item, order: index + 1 })));
  };
  const addItem = () => {
    if (groups.length === 0) {
      setNotice('Hãy tạo nhóm trước khi thêm tiêu chí.');
      return;
    }
    setDraft(items => [...items, { id: `custom-${Date.now()}`, key: `custom_${Date.now()}`, label: 'Tiêu chí mới', description: '', groupId: groups[0].id, answerType: 'text', options: [], maxScore: 0, required: true, prerequisite: false, active: true, order: items.length + 1, sourceMaterials: [] }]);
  };
  const removeItem = (id: string) => {
    const item = draft.find(current => current.id === id);
    if (!item || !window.confirm(`Xóa tiêu chí “${item.label}”? Thao tác này sẽ được ghi nhận trong phiên bản mới.`)) return;
    setDraft(items => items.filter(current => current.id !== id).map((current, index) => ({ ...current, order: index + 1 })));
  };
  const toggleItem = (id: string) => updateItem(id, { active: !draft.find(item => item.id === id)?.active });
  const defaultOptionsFor = (answerType: CriteriaAnswerType) => answerType === 'yes-no' ? ['Có', 'Không'] : ['Lựa chọn 1', 'Lựa chọn 2'];
  const updateAnswerType = (id: string, answerType: CriteriaAnswerType) => {
    const current = draft.find(item => item.id === id);
    const needsOptions = answerType === 'yes-no' || answerType === 'select' || answerType === 'multi-select';
    const options = needsOptions ? (current?.options.length ? current.options : defaultOptionsFor(answerType)) : [];
    updateItem(id, { answerType, options });
  };
  const updateOptions = (id: string, rawValue: string) => {
    const options = rawValue.split(/[\n,]/).map(option => option.trim()).filter(Boolean);
    updateItem(id, { options });
  };
  const toggleAnswerOption = (id: string, option: string) => {
    const current = draft.find(item => item.id === id);
    if (!current) return;
    const selected = current.options.includes(option);
    updateItem(id, { answerType: 'multi-select', options: selected ? current.options.filter(value => value !== option) : [...current.options, option] });
  };
  const addSourceMaterials = (id: string, event: ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(event.target.files ?? []).filter(file => ['application/pdf', 'image/jpeg', 'image/png'].includes(file.type) && file.size <= 5 * 1024 * 1024);
    const current = draft.find(item => item.id === id);
    if (selected.length && current) {
      updateItem(id, { sourceMaterials: [...current.sourceMaterials, ...selected.map((file, index) => ({ id: `source-${Date.now()}-${index}`, name: file.name, kind: file.type, size: file.size }))] });
    }
    event.target.value = '';
  };
  const removeSourceMaterial = (itemId: string, sourceId: string) => {
    const item = draft.find(current => current.id === itemId);
    if (item) updateItem(itemId, { sourceMaterials: item.sourceMaterials.filter(source => source.id !== sourceId) });
  };
  const hideItem = (id: string) => updateItem(id, { active: false });
  const save = () => {
    if (ordinaryTotal !== 100) {
      setNotice(`Chưa thể lưu: tổng điểm tiêu chí thường phải bằng 100, hiện tại là ${ordinaryTotal}.`);
      return;
    }
    const emptyMultiSelect = draft.find(item => item.active && item.answerType === 'multi-select' && item.options.length === 0);
    if (emptyMultiSelect) {
      setNotice(`Chưa thể lưu: hãy tick ít nhất một phương án cho “${emptyMultiSelect.label}”.`);
      return;
    }
       updateCriteriaMutation.mutate({ type, data: { groups, criteria: draft.map(item => ({ ...item, prerequisite: false })), effectiveFrom, applyMode } }, {
      onSuccess: result => { setNotice(`Đã lưu phiên bản ${result.version}. Form đăng ký sẽ dùng bộ tiêu chí mới.`); },
      onError: error => setNotice(error instanceof Error ? error.message : 'Không thể lưu bộ tiêu chí.'),
    });
  };

  if (isLoading) return <AdminShell><div className="mx-auto max-w-7xl px-5 py-12 lg:px-10"><LoadingRows /></div></AdminShell>;
  if (isError || !criteriaSet) return <AdminShell><div className="mx-auto max-w-7xl px-5 py-12 lg:px-10"><EmptyState title="Không thể tải bộ tiêu chí" description="Vui lòng thử lại sau ít phút." /></div></AdminShell>;
  return <AdminShell><div className="mx-auto max-w-7xl px-5 py-9 lg:px-10">
       <div className="mb-8 overflow-hidden rounded-[1.75rem] bg-[#123d36] px-6 py-8 text-white shadow-xl shadow-[#123d36]/10 lg:px-9 lg:py-9"><div className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between"><div><p className="mono-label text-[#f4c95d]">CẤU HÌNH BIỂU MẪU</p><h1 className="display-tight mt-3 max-w-3xl text-4xl font-extrabold tracking-tight md:text-5xl">Cấu hình tiêu chí</h1><p className="mt-4 max-w-2xl text-sm leading-7 text-white/65 md:text-base">Tạo nhóm, chỉnh sửa trường thông tin và thiết kế câu hỏi theo từng loại cơ sở. Mỗi lần lưu sẽ tạo một phiên bản mới.</p></div><button type="button" onClick={() => setPreviewOpen(true)} className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#f4c95d] px-4 py-3 text-sm font-extrabold text-[#123d36] shadow-lg shadow-black/10 hover:bg-[#f7d77d]" data-testid="button-preview-generated-form">Xem form đang sinh <ArrowUpRight size={16} /></button></div></div>
      <div className="flex flex-col gap-4 rounded-[1.5rem] border border-slate-200 bg-white p-3 shadow-sm sm:flex-row sm:items-center sm:justify-between"><div className="flex flex-wrap gap-2"><span className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-slate-400">Loại hình</span>{[['food-supplier', 'Cung cấp thực phẩm'], ['meal-provider', 'Cung cấp suất ăn'], ['school', 'Cơ sở giáo dục']].map(([value, label]) => <button key={value} type="button" onClick={() => setType(value as ApplicationType)} className={`rounded-xl px-3.5 py-2.5 text-sm font-bold transition-colors ${type === value ? 'bg-[#e7f2ef] text-[#16604f]' : 'text-slate-500 hover:bg-slate-50'}`}>{label}</button>)}</div><div className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold ${ordinaryTotal === 100 ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-800'}`} data-testid="criteria-total-score"><span className="h-2 w-2 rounded-full bg-current" /> Tổng điểm: {ordinaryTotal}/100 {ordinaryTotal === 100 ? '· Hợp lệ' : '· Chưa thể lưu'}</div></div>
      <div className="mt-6 grid gap-4 sm:grid-cols-3"><div className="rounded-2xl border border-border bg-card p-5 shadow-sm"><div className="flex items-center justify-between"><span className="text-sm font-semibold text-muted-foreground">Nhóm tiêu chí</span><Layers3 size={19} className="text-primary" /></div><p className="mt-5 text-3xl font-extrabold">{groups.length}</p><p className="mt-1 text-xs text-muted-foreground">Có thể thêm, sửa hoặc xóa</p></div><div className="rounded-2xl border border-border bg-card p-5 shadow-sm"><div className="flex items-center justify-between"><span className="text-sm font-semibold text-muted-foreground">Trường thông tin</span><ListChecks size={19} className="text-primary" /></div><p className="mt-5 text-3xl font-extrabold">{draft.filter(item => item.active).length}</p><p className="mt-1 text-xs text-muted-foreground">{draft.length - draft.filter(item => item.active).length} trường đang ẩn</p></div><div className="rounded-2xl border border-border bg-primary p-5 text-primary-foreground shadow-sm"><div className="flex items-center justify-between"><span className="text-sm font-semibold text-primary-foreground/70">Phiên bản</span><Check size={19} className="text-accent" /></div><p className="mt-5 text-3xl font-extrabold">{criteriaSet.version}</p><p className="mt-1 text-xs text-primary-foreground/70">Áp dụng từ {formatDate(criteriaSet.effectiveFrom)}</p></div></div>
      <div className="mt-8 rounded-[1.5rem] border border-primary/15 bg-secondary/35 p-5 shadow-sm md:p-6"><div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div className="flex items-start gap-3"><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground"><Layers3 size={19} /></div><div><p className="text-lg font-extrabold">Nhóm tiêu chí</p><p className="mt-1 text-sm text-muted-foreground">Mỗi trường thông tin thuộc một nhóm để form đăng ký dễ đọc và dễ quản lý.</p></div></div><button type="button" onClick={addGroup} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-bold text-primary-foreground shadow-sm hover:bg-primary/90"><Plus size={16} /> Tạo nhóm mới</button></div><div className="mt-5 grid gap-3 md:grid-cols-2">{groups.map((group, index) => <div key={group.id} className="group flex items-center gap-3 rounded-2xl border border-border bg-card p-3 shadow-sm transition-shadow hover:shadow-md"><div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary"><GripVertical size={16} /></div><div className="min-w-0 flex-1"><div className="flex items-center justify-between gap-2"><span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Nhóm {String(index + 1).padStart(2, '0')}</span><span className="text-[11px] text-muted-foreground">{draft.filter(item => item.groupId === group.id).length} trường</span></div><input value={group.name} onChange={event => updateGroup(group.id, { name: event.target.value })} className="focus-ring mt-1 h-10 w-full rounded-lg border border-input bg-background px-3 text-sm font-semibold" aria-label={`Tên nhóm ${index + 1}`} data-testid={`input-criteria-group-${group.id}`} /></div><button type="button" onClick={() => removeGroup(group.id)} className="focus-ring shrink-0 rounded-lg p-2 text-muted-foreground hover:bg-red-50 hover:text-destructive" aria-label={`Xóa nhóm ${group.name}`} data-testid={`button-delete-criteria-group-${group.id}`}><Trash2 size={17} /></button></div>)}</div></div>
      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
       <div className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"><div><p className="mono-label text-primary">TRƯỜNG THÔNG TIN</p><h2 className="mt-2 text-2xl font-extrabold">Thiết kế câu hỏi</h2><p className="mt-1 text-sm text-muted-foreground">Sửa trực tiếp từng trường, chọn kiểu trả lời và quản lý các phương án.</p></div><button type="button" onClick={addItem} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-primary/25 bg-card px-4 text-sm font-bold text-primary shadow-sm hover:bg-secondary"><Plus size={17} /> Thêm trường thông tin</button></div>
          {draft.slice().sort((a, b) => a.order - b.order).map((item, index) => <div key={item.id} className={`rounded-[1.5rem] border bg-card p-5 shadow-sm transition-all md:p-6 ${item.active ? 'border-border' : 'border-dashed border-border/70 bg-muted/35 opacity-75'}`} data-testid={`criteria-row-${item.key}`}>
              <div className="flex flex-col gap-4 xl:flex-row xl:items-start"><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><span className="flex h-7 w-7 items-center justify-center rounded-lg bg-secondary font-mono text-xs font-bold text-primary">{String(index + 1).padStart(2, '0')}</span><span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-bold text-primary">{answerTypeLabels[item.answerType]}</span>{!item.active && <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-bold text-muted-foreground">Đang ẩn</span>}</div><div className="mt-5 grid gap-4 md:grid-cols-2"><label className="md:col-span-2"><span className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-muted-foreground">Tên tiêu chí / câu hỏi</span><input value={item.label} onChange={event => updateItem(item.id, { label: event.target.value })} className="focus-ring h-11 w-full rounded-xl border border-input bg-background px-3 text-sm font-semibold" placeholder="Ví dụ: Tên cơ sở" data-testid={`input-criteria-label-${item.key}`} /></label><label><span className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-muted-foreground">Nhóm tiêu chí</span><select value={item.groupId} onChange={event => updateItem(item.id, { groupId: event.target.value })} className="focus-ring h-11 w-full rounded-xl border border-input bg-background px-3 text-sm" data-testid={`select-criteria-group-${item.key}`}><option value="">Chọn nhóm</option>{groups.map(group => <option key={group.id} value={group.id}>{group.name}</option>)}</select></label><label><span className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-muted-foreground">Loại trả lời</span><CriteriaAnswerTypeDropdown item={item} labels={answerTypeLabels} onTypeChange={answerType => updateAnswerType(item.id, answerType)} onToggleOption={option => toggleAnswerOption(item.id, option)} /></label><label><span className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-muted-foreground">Điểm tối đa</span><input type="number" min="0" value={item.maxScore} onChange={event => updateItem(item.id, { maxScore: Math.max(0, Number(event.target.value)) })} className="focus-ring h-11 w-full rounded-xl border border-input bg-background px-3 text-sm font-semibold" data-testid={`input-criteria-score-${item.key}`} /></label><label className="flex items-center gap-2 self-end pb-2 text-sm font-semibold"><input type="checkbox" checked={item.required} onChange={event => updateItem(item.id, { required: event.target.checked })} className="h-4 w-4 accent-primary" /> Bắt buộc trả lời</label></div><label className="mt-4 block"><span className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-muted-foreground">Mô tả / hướng dẫn</span><textarea value={item.description} onChange={event => updateItem(item.id, { description: event.target.value })} className="focus-ring min-h-20 w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm" placeholder="Nêu rõ người dùng cần khai báo hoặc cung cấp minh chứng gì..." data-testid={`textarea-criteria-description-${item.key}`} /></label>{(['yes-no', 'select', 'multi-select'] as CriteriaAnswerType[]).includes(item.answerType) && <label className="mt-4 block rounded-2xl border border-primary/15 bg-secondary/35 p-4"><span className="flex items-center justify-between gap-3 text-xs font-bold uppercase tracking-wider text-primary"><span>Phương án trả lời</span><span className="normal-case tracking-normal text-muted-foreground">Mỗi dòng là một phương án</span></span><textarea value={item.options.join('\n')} onChange={event => updateOptions(item.id, event.target.value)} className="focus-ring mt-2 min-h-24 w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm" placeholder="Nhập mỗi phương án trên một dòng..." data-testid={`textarea-criteria-options-${item.key}`} /><p className="mt-2 text-xs text-muted-foreground">Bạn có thể ngăn cách phương án bằng xuống dòng hoặc dấu phẩy.</p></label>}{item.sourceMaterials.length > 0 || item.answerType === 'file' ? <div className="mt-4 rounded-2xl border border-dashed border-primary/25 bg-secondary/25 p-4"><div className="flex flex-wrap items-center justify-between gap-2"><div><p className="text-sm font-bold">Tài liệu căn cứ</p><p className="text-xs text-muted-foreground">PDF, JPG hoặc PNG · tối đa 5MB/tệp.</p></div><label className="focus-ring inline-flex cursor-pointer items-center gap-2 rounded-lg border border-primary/25 px-3 py-2 text-xs font-bold text-primary hover:bg-secondary"><Plus size={15} /> Thêm tài liệu<input type="file" accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png" multiple onChange={event => addSourceMaterials(item.id, event)} className="sr-only" data-testid={`input-criteria-source-${item.key}`} /></label></div>{item.sourceMaterials.length > 0 && <div className="mt-3 space-y-2">{item.sourceMaterials.map(source => <div key={source.id} className="flex items-center justify-between gap-3 rounded-lg bg-card px-3 py-2 text-xs"><span className="flex min-w-0 items-center gap-2 truncate"><FileText size={14} className="shrink-0 text-primary" />{source.name}</span><button type="button" onClick={() => removeSourceMaterial(item.id, source.id)} className="shrink-0 font-bold text-muted-foreground hover:text-destructive" data-testid={`button-remove-criteria-source-${source.id}`}>Xóa</button></div>)}</div>}</div> : null}</div><div className="flex shrink-0 flex-row gap-2 border-t border-border pt-4 xl:w-32 xl:flex-col xl:border-0 xl:pt-0"><button type="button" onClick={() => toggleItem(item.id)} className="flex-1 rounded-xl border border-border px-3 py-2.5 text-xs font-bold hover:bg-secondary">{item.active ? 'Ẩn trường' : <><RotateCcw size={14} className="mr-1 inline" /> Hiện lại</>}</button><button type="button" onClick={() => removeItem(item.id)} className="flex-1 rounded-xl border border-red-200 px-3 py-2.5 text-xs font-bold text-destructive hover:bg-red-50" data-testid={`button-delete-criteria-${item.key}`}><Trash2 size={14} className="mr-1 inline" /> Xóa</button></div></div>
         </div>)}
           {draft.length === 0 && <div className="rounded-[1.5rem] border border-dashed border-primary/30 bg-secondary/25 p-12 text-center"><ListChecks className="mx-auto text-primary" size={34} /><h3 className="mt-4 font-bold">Chưa có trường thông tin</h3><p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">Tạo trường đầu tiên để bắt đầu dựng form đăng ký.</p></div>}
       </div>
         <aside className="h-fit space-y-4 lg:sticky lg:top-24"><div className="rounded-[1.5rem] border border-border bg-card p-5 shadow-sm"><div className="flex items-start justify-between gap-3"><div><p className="mono-label text-primary">PHIÊN BẢN HIỆN TẠI</p></div><div className="rounded-xl bg-secondary p-2 text-primary"><Check size={18} /></div></div><div className="mt-5 space-y-4"><label className="block text-sm font-semibold">Ngày áp dụng mới<input type="date" value={effectiveFrom} onChange={event => setEffectiveFrom(event.target.value)} className="focus-ring mt-2 h-11 w-full rounded-xl border border-input bg-background px-3 text-sm" /></label><label className="block text-sm font-semibold">Cách áp dụng<select value={applyMode} onChange={event => setApplyMode(event.target.value as CriteriaConfigInput['applyMode'])} className="focus-ring mt-2 h-11 w-full rounded-xl border border-input bg-background px-3 text-sm"><option value="now">Áp dụng ngay</option><option value="scheduled">Áp dụng từ ngày đã chọn</option></select></label></div><button type="button" onClick={save} disabled={ordinaryTotal !== 100 || updateCriteriaMutation.isPending} className="mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-bold text-primary-foreground shadow-sm disabled:cursor-not-allowed disabled:opacity-50"><Check size={16} />{updateCriteriaMutation.isPending ? 'Đang lưu…' : 'Lưu phiên bản tiêu chí'}</button>{ordinaryTotal !== 100 && <p className="mt-3 text-xs leading-5 text-red-700">Điều chỉnh điểm các tiêu chí thường để tổng đạt đúng 100 trước khi lưu.</p>}</div><div className="rounded-[1.5rem] border border-border bg-card p-5 shadow-sm"><p className="mono-label text-primary">LỊCH SỬ THAY ĐỔI</p><div className="mt-4 space-y-3">{history?.length ? history.slice(0, 5).map(entry => <div key={entry.id} className="border-l-2 border-primary/30 pl-3"><p className="text-xs font-bold">{entry.summary}</p><p className="mt-1 text-xs text-muted-foreground">{entry.changedBy} · {formatDate(entry.changedAt)} · {entry.version}</p></div>) : <p className="mt-3 text-sm text-muted-foreground">Chưa có thay đổi trong phiên làm việc này.</p>}</div></div></aside>
     </div>
    {notice && <Notice message={notice} onClose={() => setNotice('')} />}
   </div>{previewOpen && <CriteriaPreviewDialog type={type} criteria={draft} groups={groups} onClose={() => setPreviewOpen(false)} />}</AdminShell>;
}

 function CriteriaPreviewDialog({ type, criteria, groups, onClose }: { type: ApplicationType; criteria: CriteriaDefinition[]; groups: CriteriaGroup[]; onClose: () => void }) {
   const [previewType, setPreviewType] = useState<ApplicationType>(type);
   const [values, setValues] = useState<Record<string, string | string[]>>({});
   const previewQuery = useGetCriteria({ type: previewType }, { query: { enabled: previewType !== type, queryKey: getGetCriteriaQueryKey({ type: previewType }) } });
   const previewCriteria = previewType === type ? criteria : previewQuery.data?.criteria ?? [];
   const previewGroups = previewType === type ? groups : previewQuery.data?.groups ?? [];
   const activeCriteria = previewCriteria.filter(item => item.active).sort((a, b) => a.order - b.order);
   const updateValue = (key: string, value: string | string[]) => setValues(previous => ({ ...previous, [key]: value }));
   useEffect(() => {
     setValues({});
   }, [previewType]);
   const loadingOtherType = previewType !== type && previewQuery.isLoading;
   return <div className="fixed inset-0 z-50 flex items-end justify-center bg-primary/35 p-0 backdrop-blur-sm sm:items-center sm:p-5" onClick={onClose}><div className="flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-t-3xl border border-border bg-[#f5f7f8] shadow-2xl sm:rounded-3xl" onClick={event => event.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="criteria-preview-title" data-testid="dialog-generated-form-preview"><div className="flex items-start justify-between gap-4 border-b border-border bg-card px-6 py-5"><div className="min-w-0"><p className="mono-label text-primary">XEM TRƯỚC FORM CƠ SỞ</p><h2 id="criteria-preview-title" className="mt-2 text-2xl font-extrabold">Đăng ký hồ sơ</h2><p className="mt-1 text-sm text-muted-foreground">{typeNames[previewType]} · {activeCriteria.length} trường thông tin đang hiển thị</p></div><button type="button" className="focus-ring shrink-0 rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground" onClick={onClose} aria-label="Đóng xem trước form" data-testid="button-close-generated-form-preview"><X size={19} /></button></div><div className="overflow-y-auto px-5 py-6 sm:px-8"><div className="mx-auto max-w-3xl"><div className="mb-6 rounded-2xl border border-primary/15 bg-card p-5"><label className="block text-sm font-bold">Loại cơ sở xem trước<select value={previewType} onChange={event => setPreviewType(event.target.value as ApplicationType)} className="focus-ring mt-2 h-11 w-full rounded-xl border border-input bg-background px-3 text-sm font-semibold" data-testid="select-preview-facility-type">{facilityTypeOptions.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label><p className="mt-3 text-sm leading-6 text-muted-foreground">Mỗi loại cơ sở có bộ câu hỏi riêng. Chọn loại cơ sở để xem đúng form tương ứng.</p></div>{loadingOtherType ? <LoadingRows /> : previewQuery.isError && previewType !== type ? <EmptyState title="Không thể tải form xem trước" description="Vui lòng thử lại sau ít phút." /> : <div className="space-y-5">{previewGroups.slice().sort((a, b) => a.order - b.order).map(group => { const groupCriteria = activeCriteria.filter(item => item.groupId === group.id); return groupCriteria.length ? <section key={group.id} className="rounded-2xl border border-border bg-card p-5 sm:p-6"><h3 className="border-b border-border pb-3 text-lg font-extrabold">{group.name}</h3><div className="mt-2">{groupCriteria.map(item => <PreviewQuestion key={item.id} item={item} value={values[item.key] ?? ''} onChange={value => updateValue(item.key, value)} />)}</div></section> : null; })}</div>}</div></div><div className="flex justify-end border-t border-border bg-card px-6 py-4"><button type="button" onClick={onClose} className="h-11 rounded-xl bg-primary px-5 text-sm font-bold text-primary-foreground hover:bg-primary/90" data-testid="button-close-generated-form-preview-footer">Đóng xem trước</button></div></div></div>;
 }

 function PreviewQuestion({ item, value, onChange }: { item: CriteriaDefinition; value: string | string[]; onChange: (value: string | string[]) => void }) {
   const requiredMark = item.required ? <span className="text-destructive"> *</span> : null;
   const options = item.options;
   if (item.answerType === 'file') return <div className="mt-5 first:mt-0"><label className="mb-2 block text-sm font-semibold">{item.label}{requiredMark}</label><div className="flex min-h-14 items-center gap-2 rounded-xl border border-dashed border-primary/30 bg-secondary/30 px-4 text-sm font-semibold text-primary"><Plus size={17} /> Chọn tệp minh chứng</div></div>;
   if (item.answerType === 'multi-select') {
     const selected = Array.isArray(value) ? value : value ? [value] : [];
     return <fieldset className="mt-5 first:mt-0"><legend className="mb-2 block text-sm font-semibold">{item.label}{requiredMark}</legend><div className="grid gap-2 sm:grid-cols-2">{options.map(option => <label key={option} className="flex items-center gap-3 rounded-xl border border-input bg-background px-3 py-3 text-sm"><input type="checkbox" checked={selected.includes(option)} onChange={event => onChange(event.target.checked ? [...selected, option] : selected.filter(current => current !== option))} className="h-4 w-4 accent-primary" data-testid={`preview-criteria-${item.key}-${option}`} /><span>{option}</span></label>)}</div>{item.description && <span className="mt-2 block text-xs text-muted-foreground">{item.description}</span>}</fieldset>;
   }
   if (item.answerType === 'yes-no' || item.answerType === 'select') return <label className="mt-5 block first:mt-0"><span className="mb-2 block text-sm font-semibold">{item.label}{requiredMark}</span><select value={Array.isArray(value) ? value[0] ?? '' : value} onChange={event => onChange(event.target.value)} className="focus-ring h-11 w-full rounded-xl border border-input bg-background px-3 text-sm" data-testid={`preview-criteria-${item.key}`}><option value="">Chọn một phương án</option>{options.map(option => <option key={option} value={option}>{option}</option>)}</select>{item.description && <span className="mt-1 block text-xs text-muted-foreground">{item.description}</span>}</label>;
   return <label className="mt-5 block first:mt-0"><span className="mb-2 block text-sm font-semibold">{item.label}{requiredMark}</span><input type={item.answerType === 'number' ? 'number' : item.answerType === 'date' ? 'date' : 'text'} value={Array.isArray(value) ? value.join(', ') : value} onChange={event => onChange(event.target.value)} className="focus-ring h-11 w-full rounded-xl border border-input bg-background px-3 text-sm" data-testid={`preview-criteria-${item.key}`} />{item.description && <span className="mt-1 block text-xs text-muted-foreground">{item.description}</span>}</label>;
 }

 function formatAnswer(value: unknown) {
  if (Array.isArray(value)) return value.join(', ');
  if (value === undefined || value === null || value === '') return '—';
  return String(value);
}

function CriteriaReviewPanel({ criteria, criteriaGroups, data, scores, notes, setScore, setNote }: { criteria: CriteriaDefinition[]; criteriaGroups: CriteriaGroup[]; data: Record<string, unknown>; scores: Record<string, number>; notes: Record<string, string>; setScore: (key: string, value: number) => void; setNote: (key: string, value: string) => void }) {
  const groups = criteriaGroups.slice().sort((a, b) => a.order - b.order).filter(group => criteria.some(item => item.groupId === group.id));
  const scoreCriteria = criteria.filter(item => item.active && item.maxScore > 0);
  const maxScore = scoreCriteria.reduce((sum, item) => sum + item.maxScore, 0);
  const computedScore = Math.round(scoreCriteria.reduce((sum, item) => sum + Math.min(item.maxScore, Math.max(0, Number(scores[item.key] ?? 0))), 0));
  const hasAnyScore = scoreCriteria.some(item => Object.prototype.hasOwnProperty.call(scores, item.key));
  const percentage = maxScore ? Math.round((computedScore / maxScore) * 100) : 0;
  const decision = !hasAnyScore
    ? { label: 'Chưa đánh giá', description: 'Nhập điểm từng tiêu chí để hệ thống tự tính kết quả.', className: 'bg-slate-100 text-slate-700', bar: 'bg-slate-300' }
    : percentage >= 100
      ? { label: 'Đạt 100%', description: 'Hồ sơ đạt đầy đủ điểm tiêu chí.', className: 'bg-emerald-100 text-emerald-900', bar: 'bg-emerald-500' }
      : percentage >= 80
        ? { label: `${percentage}% · Cần xem xét`, description: 'Hồ sơ nằm trong ngưỡng 80–99%. Cán bộ có thể duyệt cảnh báo hoặc yêu cầu bổ sung.', className: 'bg-amber-100 text-amber-900', bar: 'bg-amber-500' }
        : { label: `${percentage}% · Không đạt`, description: 'Hồ sơ dưới 80% và cần xử lý theo quyết định chuyên môn.', className: 'bg-red-100 text-red-900', bar: 'bg-red-500' };
  return <div className="rounded-2xl border border-border bg-card p-6"><div className="flex items-center justify-between gap-3"><div className="flex items-center gap-3"><ClipboardCheck size={19} className="text-primary" /><h2 className="text-lg font-extrabold">Chấm từng tiêu chí</h2></div><span className="rounded-full bg-secondary px-3 py-1 text-xs font-bold text-primary">{criteria.length} tiêu chí trong snapshot</span></div><p className="mt-2 text-sm leading-6 text-muted-foreground">Nhập điểm đạt được cho từng tiêu chí. Tổng điểm và trạng thái sẽ tự cập nhật.</p><div className="mt-5 rounded-2xl border border-border bg-secondary/30 p-4" data-testid="review-score-summary"><div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Kết quả tạm tính</p><p className="mt-1 font-mono text-3xl font-extrabold text-primary">{computedScore}<span className="text-base text-muted-foreground"> / {maxScore} điểm</span></p></div><span className={`rounded-full px-3 py-1.5 text-xs font-extrabold ${decision.className}`}>{decision.label}</span></div><div className="mt-4 h-2 overflow-hidden rounded-full bg-border"><div className={`h-full rounded-full transition-all ${decision.bar}`} style={{ width: `${Math.min(100, percentage)}%` }} /></div><p className="mt-3 text-xs leading-5 text-muted-foreground">{decision.description}</p><div className="mt-3 grid gap-2 text-xs text-muted-foreground sm:grid-cols-3"><span><strong className="text-emerald-700">100%</strong> · Đạt</span><span><strong className="text-amber-700">80–99%</strong> · Cần xem xét</span><span><strong className="text-red-700">&lt; 80%</strong> · Không đạt</span></div></div><div className="mt-6 space-y-6">{groups.map(group => <div key={group.id}><p className="mono-label border-b border-border pb-2 text-primary">Nhóm {group.name}</p><div className="mt-3 space-y-3">{criteria.filter(item => item.groupId === group.id).map(item => <div key={item.key} className="rounded-xl border border-border/80 bg-secondary/20 p-4"><div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between"><div className="min-w-0"><p className="font-bold">{item.label}{item.required && <span className="text-destructive"> *</span>}</p><p className="mt-1 break-words text-sm text-muted-foreground">Khai báo: {formatAnswer(data[item.key])}</p>{item.sourceMaterials.length > 0 && <p className="mt-2 text-xs text-muted-foreground"><span className="font-bold text-primary">Căn cứ:</span> {item.sourceMaterials.map(source => source.name).join(', ')}</p>}</div>{item.maxScore > 0 ? <div className="flex shrink-0 items-center gap-2"><input aria-label={`Điểm ${item.label}`} type="number" min="0" max={item.maxScore} value={scores[item.key] ?? 0} onChange={event => setScore(item.key, Math.min(item.maxScore, Math.max(0, Number(event.target.value))))} className="focus-ring h-10 w-20 rounded-lg border border-input bg-background px-2 text-right font-mono font-bold" /><span className="font-mono text-sm text-muted-foreground">/ {item.maxScore}</span></div> : <span className="rounded-lg bg-muted px-3 py-2 text-xs font-bold text-muted-foreground">Không chấm điểm</span>}</div><label className="mt-3 block"><span className="mb-1 block text-xs font-semibold text-muted-foreground">Ghi chú tiêu chí</span><input value={notes[item.key] ?? ''} onChange={event => setNote(item.key, event.target.value)} placeholder="Nhập nhận xét / căn cứ kiểm tra" className="focus-ring h-9 w-full rounded-lg border border-input bg-background px-3 text-sm" /></label></div>)}</div></div>)}</div></div>;
}

export function AdminApplicationPage() {
  const { id = '' } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const { data: application, isLoading, isError } = useGetApplication(id, { query: { enabled: Boolean(id), queryKey: getGetApplicationQueryKey(id) } });
  const review = useReviewApplication();
  const [scores, setScores] = useState<Record<string, number>>({});
  const [criteriaNotes, setCriteriaNotes] = useState<Record<string, string>>({});
  const [note, setNote] = useState('');
  const [notice, setNotice] = useState('');
  useEffect(() => {
    if (!application) return;
    setScores(application.scoreBreakdown ?? {});
    setNote(application.reviewNote ?? '');
  }, [application?.id, application?.criteriaVersion]);
  const criteria = application?.criteriaSnapshot?.filter(item => item.active).sort((a, b) => a.order - b.order) ?? [];
  const ordinaryCriteria = criteria;
  const computedScore = Math.round(ordinaryCriteria.reduce((sum, item) => sum + Math.min(item.maxScore, Math.max(0, Number(scores[item.key] ?? 0))), 0));
  const submitReview = (action: ReviewAction) => {
    const perCriterionNotes = Object.entries(criteriaNotes).filter(([, value]) => value.trim()).map(([key, value]) => `${criteria.find(item => item.key === key)?.label}: ${value}`).join('\n');
    review.mutate({ id, data: { action: action as ReviewInputAction, score: computedScore, note: [note, perCriterionNotes].filter(Boolean).join('\n'), criteriaScores: scores, prerequisiteResults: {} } }, { onSuccess: result => { queryClient.setQueryData(getGetApplicationQueryKey(id), result); queryClient.invalidateQueries({ queryKey: getListApplicationsQueryKey() }); queryClient.invalidateQueries({ queryKey: getGetAdminSummaryQueryKey() }); if (action === 'approve') { queryClient.invalidateQueries({ queryKey: getGetPublicSummaryQueryKey() }); queryClient.invalidateQueries({ queryKey: getListPublicRecordsQueryKey() }); } setNotice(action === 'approve' ? 'Đã chấm điểm và xử lý hồ sơ.' : action === 'reject' ? 'Hồ sơ đã được ghi nhận từ chối.' : 'Đã lưu yêu cầu bổ sung.'); }, onError: () => setNotice('Không thể cập nhật quyết định. Vui lòng thử lại.') });
  };
  if (isLoading) return <AdminShell><div className="mx-auto max-w-6xl px-5 py-12"><LoadingRows /></div></AdminShell>;
  if (isError || !application) return <AdminShell><div className="mx-auto max-w-6xl px-5 py-12"><EmptyState title="Không tìm thấy hồ sơ" description="Hồ sơ có thể đã được di chuyển hoặc không tồn tại." /></div></AdminShell>;
   return <AdminShell><div className="mx-auto max-w-6xl px-5 py-9 lg:px-10"><Link href="/admin" className="focus-ring inline-flex items-center gap-2 text-sm font-bold text-primary" data-testid="link-back-admin"><ArrowLeft size={16} /> Quay lại hàng đợi</Link><div className="mt-7 flex flex-col gap-5 border-b border-border pb-7 md:flex-row md:items-end md:justify-between"><div><p className="mono-label text-primary">{application.reference} · {typeNames[application.type]} · {application.criteriaVersion}</p><h1 className="display-tight mt-2 text-3xl font-extrabold md:text-5xl">{application.applicantName}</h1><p className="mt-3 text-sm text-muted-foreground">{application.address} · {application.contact}</p></div><StatusPill status={application.status} /></div><div className="mt-8 grid gap-6 lg:grid-cols-[1.25fr_.75fr]"><div className="space-y-6"><ReviewPanel application={application} /><CriteriaReviewPanel criteria={criteria} criteriaGroups={application.criteriaGroups ?? []} data={application.data} scores={scores} notes={criteriaNotes} setScore={(key, value) => setScores(prev => ({ ...prev, [key]: value }))} setNote={(key, value) => setCriteriaNotes(prev => ({ ...prev, [key]: value }))} /><AttachmentPanel attachments={application.attachments} /><div className="rounded-2xl border border-border bg-card p-6"><div className="flex items-center gap-3"><SlidersHorizontal size={19} className="text-primary" /><h2 className="text-lg font-extrabold">Dữ liệu khai báo</h2></div><dl className="mt-4 grid gap-x-6 sm:grid-cols-2">{criteria.filter(item => item.answerType !== 'file').map(item => <div key={item.key} className="border-b border-border py-3"><dt className="text-xs text-muted-foreground">{item.label}</dt><dd className="mt-1 break-words text-sm font-semibold">{formatAnswer(application.data?.[item.key])}</dd></div>)}</dl></div></div><aside className="h-fit rounded-2xl border border-border bg-card p-6 lg:sticky lg:top-24"><p className="mono-label text-primary">QUYẾT ĐỊNH CHUYÊN MÔN</p><h2 className="mt-3 text-xl font-extrabold">Chấm điểm & xử lý</h2><div className={`mt-5 rounded-xl px-4 py-3 ${computedScore === 100 ? 'bg-emerald-100 text-emerald-900' : computedScore >= 80 ? 'bg-yellow-100 text-yellow-900' : 'bg-red-100 text-red-900'}`}><p className="text-xs font-bold uppercase tracking-wider">Điểm tự động tính</p><p className="mt-1 font-mono text-3xl font-extrabold">{computedScore}<span className="text-base">/100</span></p><p className="mt-1 text-xs">Điểm được cộng từ các tiêu chí đang hoạt động trong phiên bản hồ sơ.</p></div><label className="mt-6 block"><span className="mb-2 block text-sm font-semibold">Ý kiến xử lý chung</span><textarea value={note} onChange={e => setNote(e.target.value)} placeholder="Ghi rõ căn cứ và nội dung cần lưu vết..." className="focus-ring min-h-32 w-full rounded-xl border border-input bg-background p-3 text-sm" data-testid="textarea-review-note" /></label><div className="mt-6 grid gap-2"><Button onClick={() => submitReview('approve')} disabled={review.isPending} className="h-11 rounded-xl bg-primary" data-testid="button-review-approve"><Check size={16} /> Lưu & duyệt hồ sơ</Button><Button onClick={() => submitReview('needs-more-info')} disabled={review.isPending} variant="outline" className="h-11 rounded-xl" data-testid="button-review-more-info"><Info size={16} /> Yêu cầu bổ sung</Button><Button onClick={() => submitReview('reject')} disabled={review.isPending} variant="destructive" className="h-11 rounded-xl" data-testid="button-review-reject"><X size={16} /> Từ chối hồ sơ</Button></div><p className="mt-4 text-xs leading-5 text-muted-foreground">Kết quả được tính từ từng tiêu chí trong snapshot {application.criteriaVersion}, không dùng bộ tiêu chí mới hơn.</p></aside></div></div>{notice && <Notice message={notice} onClose={() => setNotice('')} />}</AdminShell>;
}
function ReviewPanel({ application }: { application: { submittedAt: string; score: number; isThirdParty: boolean } }) { return <div className="rounded-2xl border border-border bg-card p-6"><div className="flex items-center justify-between"><div className="flex items-center gap-3"><ClipboardCheck size={19} className="text-primary" /><h2 className="text-lg font-extrabold">Tóm tắt xét duyệt</h2></div>{application.isThirdParty && <span className="rounded-full bg-accent/40 px-3 py-1 text-xs font-bold text-accent-foreground">Bên thứ ba chưa xác minh</span>}</div><div className="mt-5 grid gap-4 sm:grid-cols-3"><div><p className="text-xs text-muted-foreground">Ngày nộp</p><p className="mt-1 font-semibold">{formatDate(application.submittedAt)}</p></div><div><p className="text-xs text-muted-foreground">Điểm đang có</p><p className="mt-1 font-mono font-bold text-primary">{application.score}/100</p></div><div><p className="text-xs text-muted-foreground">Tình trạng</p><p className="mt-1 font-semibold">Cần cán bộ xử lý</p></div></div></div>; }
function AttachmentPanel({ attachments }: { attachments: Attachment[] }) { return <div className="rounded-2xl border border-border bg-card p-6"><div className="flex items-center gap-3"><FileText size={19} className="text-primary" /><h2 className="text-lg font-extrabold">Tệp đính kèm</h2><span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-bold text-primary">{attachments?.length ?? 0}</span></div><div className="mt-4 space-y-2">{attachments?.length ? attachments.map(file => <div key={file.name} className="flex items-center justify-between rounded-xl bg-muted/70 px-3 py-3 text-sm"><span className="flex min-w-0 items-center gap-2 truncate"><FileText size={16} className="shrink-0 text-primary" />{file.name}</span><span className="ml-4 shrink-0 font-mono text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(1)}MB</span></div>) : <p className="text-sm text-muted-foreground">Không có tệp đính kèm.</p>}</div></div>; }

export function AdminPlaceholder({ kind }: { kind: 'accounts' | 'reports' }) { const isAccounts = kind === 'accounts'; return <AdminShell><div className="mx-auto max-w-5xl px-5 py-12 lg:px-10"><SectionHeading eyebrow="Khu vực quản trị" title={isAccounts ? 'Quản lý tài khoản' : 'Báo cáo thống kê'} description={isAccounts ? 'Quản lý tài khoản cán bộ và phân quyền truy cập hệ thống.' : 'Tổng hợp số liệu tiếp nhận, xét duyệt và công khai hồ sơ.'} /><div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center"><div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary text-primary">{isAccounts ? <Users size={25} /> : <BarChart3Icon size={25} />}</div><h2 className="mt-5 text-xl font-extrabold">Khu vực đang được hoàn thiện</h2><p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">Mục menu đã sẵn sàng để kết nối với phân hệ {isAccounts ? 'tài khoản và phân quyền' : 'báo cáo, xuất dữ liệu'} trong phiên bản tiếp theo.</p></div></div></AdminShell>; }
function BarChart3Icon({ size }: { size: number }) { return <BarChart3 size={size} />; }