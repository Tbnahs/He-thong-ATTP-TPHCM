import { useMemo, useState, type ChangeEvent, type FormEvent, type ReactNode } from 'react';
import { Link, useLocation, useParams } from 'wouter';
import { useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, ArrowUpRight, BadgeCheck, BarChart3, Bell, Building2, Check, ChevronLeft, ChevronRight, ClipboardCheck, FileText, ImagePlus, Info, LockKeyhole, LogIn, MapPin, Plus, Search, Send, ShieldCheck, SlidersHorizontal, Store, UserRound, Users, X } from 'lucide-react';
import {
  ApplicationType,
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
  useGetPublicRecord,
  useGetPublicSummary,
  useListApplications,
  useListApprovedSuppliers,
  useListPublicRecords,
  useReviewApplication,
  type ApplicationInput,
  type Attachment,
  type ListApplicationsParams,
  type ListPublicRecordsParams,
  type PublicRecord,
  type ReviewInputAction as ReviewAction,
} from '@workspace/api-client-react';
import { Button } from '@/components/ui/button';
import { AdminShell, ButtonLink, EmptyState, MetricCard, PublicShell, SectionHeading, StatusPill } from '@/components/portal-ui';
import heroFoodImage from '@assets/0_List_Of_Nucleic_Acid_Foods_1788929888254.jpg';

const categoryNames: Record<string, string> = {
  'eligible-facilities': 'Cơ sở đủ điều kiện',
  'self-declared-products': 'Sản phẩm tự công bố',
  'registered-products': 'Sản phẩm đã đăng ký bản công bố',
  'licensed-advertising': 'Quảng cáo được cấp phép',
  'testing-facilities': 'Cơ sở kiểm nghiệm',
};
const typeNames: Record<string, string> = { 'food-supplier': 'Đơn vị cung cấp thực phẩm', 'meal-provider': 'Đơn vị cung cấp suất ăn', school: 'Cơ sở giáo dục' };
const formatDate = (value?: string) => value ? new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(value)) : '—';
const formatNumber = (value?: number) => typeof value === 'number' ? new Intl.NumberFormat('vi-VN').format(value) : '—';
type AccountRole = 'admin' | 'facility';
const inferAccountRole = (username: string): AccountRole => /^(admin|canbo|reviewer|xetduyet)/i.test(username.trim()) ? 'admin' : 'facility';

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
    <section className="portal-grid overflow-hidden border-b border-border"><div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 lg:grid-cols-[1.05fr_.95fr] lg:px-8 lg:py-24">
       <div className="rise-in"><div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-secondary px-3 py-1.5 text-xs font-bold text-primary"><span className="status-dot bg-primary" /> CỔNG THÔNG TIN CHÍNH THỨC</div><h1 className="display-tight max-w-3xl text-5xl font-extrabold leading-[1.02] tracking-tight md:text-7xl">Biết rõ nguồn gốc.<br /><span className="text-primary">An tâm mỗi bữa ăn.</span></h1><p className="mt-7 max-w-xl text-base leading-7 text-muted-foreground md:text-lg">Tra cứu nhanh các cơ sở, sản phẩm và hoạt động quảng cáo đã được Sở An toàn thực phẩm Thành phố Hồ Chí Minh công khai.</p><div className="mt-9 flex flex-wrap gap-3"><ButtonLink href="/lookup">Bắt đầu tra cứu</ButtonLink><ButtonLink href={accountAction.href} variant="outline">{facilityAccount ? 'Hồ sơ cơ sở' : 'Đăng ký hồ sơ'}</ButtonLink></div></div>
      <div className="relative flex items-center justify-center lg:justify-end"><div className="absolute right-8 top-2 h-64 w-64 rounded-full bg-accent/30 blur-3xl" /><div className="relative w-full max-w-md overflow-hidden rounded-[2rem] border border-primary/15 bg-card p-4 shadow-2xl shadow-primary/10"><img src={heroFoodImage} alt="Mâm thực phẩm tươi ngon với rau củ, trái cây và các loại hạt" className="aspect-square w-full rounded-[1.5rem] object-cover" data-testid="img-home-hero-food" /></div></div>
    </div></section>
     <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8"><SectionHeading eyebrow="Ba thao tác, một điểm đến" title="Dịch vụ được thiết kế cho đời sống thật." description="Từ một bữa ăn tại trường đến lựa chọn sản phẩm trong gia đình, thông tin chính thức luôn ở gần bạn." /><div className="grid gap-4 md:grid-cols-3"><HomeFeature icon={Search} number="01" title="Tra cứu công khai" text="Tìm theo tên, địa chỉ hoặc nhóm dữ liệu. Kết quả hiển thị tình trạng và ngày công bố." href="/lookup" /><HomeFeature icon={Send} number="02" title={accountAction.title} text={accountAction.text} href={accountAction.href} /><HomeFeature icon={ClipboardCheck} number="03" title="Quy trình có trách nhiệm" text="Mỗi hồ sơ được chấm điểm, ghi nhận ý kiến và lưu dấu quyết định của cán bộ chuyên môn." href="/admin" /></div></section>
    <HomeLookupSection />
    {isError && <div className="mx-auto max-w-7xl px-5 py-6 text-sm text-destructive" data-testid="status-summary-error">Không thể tải số liệu hiện tại. Bạn vẫn có thể sử dụng tra cứu công khai.</div>}
  </main></PublicShell>;
}

function HomeFeature({ icon: Icon, number, title, text, href }: { icon: typeof Search; number: string; title: string; text: string; href: string }) {
  return <Link href={href} className="lift group rounded-2xl border border-border bg-card p-6" data-testid={`link-feature-${number}`}><div className="flex items-center justify-between"><span className="mono-label text-muted-foreground">{number}</span><Icon size={21} className="text-primary transition-transform group-hover:scale-110" /></div><h3 className="mt-14 text-lg font-extrabold">{title}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p><span className="mt-5 inline-flex items-center gap-1 text-sm font-bold text-primary">Khám phá <ArrowUpRight size={15} /></span></Link>;
}

function HomeLookupSection() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [selected, setSelected] = useState<PublicRecord | null>(null);
  const params = useMemo<ListPublicRecordsParams>(() => ({ search: search || undefined, category: (category || undefined) as ListPublicRecordsCategory | undefined, page: 1, pageSize: 3 }), [search, category]);
  const { data, isLoading, isError } = useListPublicRecords(params);

  return <section className="border-y border-border bg-secondary/35"><div className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
    <SectionHeading eyebrow="Tra cứu nhanh" title="Tìm thông tin công khai ngay trên trang tổng quan." description="Nhập tên cơ sở, sản phẩm hoặc chọn nhóm dữ liệu để xem nhanh các kết quả mới nhất." action={<Link href="/lookup" className="inline-flex items-center gap-2 text-sm font-bold text-primary">Xem toàn bộ dữ liệu <ArrowUpRight size={16} /></Link>} />
    <div className="rounded-2xl border border-border bg-card p-4 shadow-sm"><div className="flex flex-col gap-3 lg:flex-row">
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
    <div className="flex flex-col gap-4 rounded-2xl border border-border bg-secondary/50 p-5 sm:flex-row sm:items-center sm:justify-between"><div className="flex gap-3 text-sm"><LockKeyhole className="mt-0.5 shrink-0 text-primary" size={18} /><p><strong>Chỉ cập nhật thông tin cơ sở.</strong><br /><span className="text-muted-foreground">Sau khi lưu, thông tin sẽ được chuyển lại cho cán bộ chuyên môn rà soát.</span></p></div><Button type="submit" className="h-11 rounded-xl px-6" data-testid="button-save-facility-profile">Lưu thay đổi</Button></div>
  </form>{notice && <Notice message={notice} onClose={() => setNotice('')} />}</main></PublicShell>;
}

function ApplicationForm() {
  const [type, setType] = useState<ApplicationType>('food-supplier');
  const [fields, setFields] = useState<Record<string, string>>({});
  const [files, setFiles] = useState<Attachment[]>([]);
  const [notice, setNotice] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const queryClient = useQueryClient();
  const create = useCreateApplication();
  const { data: suppliers } = useListApprovedSuppliers({ query: { queryKey: getListApprovedSuppliersQueryKey() } });
  const update = (key: string, value: string) => setFields(prev => ({ ...prev, [key]: value }));
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
  const removeFile = (name: string) => setFiles(prev => prev.filter(file => file.name !== name));
  const submit = (event: FormEvent) => {
    event.preventDefault();
    const required = type === 'school' ? ['applicantName', 'address', 'contact', 'schoolLevel', 'mealModel', 'kitchenOneWay', 'sampleStorage'] : ['applicantName', 'address', 'contact', 'taxCode', 'licenseNumber', 'licenseIssued', 'licenseExpires'];
    if (type === 'food-supplier') required.push('productGroups');
    if (type === 'meal-provider') required.push('staffTotal', 'staffTrained', 'staffHealth', 'supplierId', 'dailyCapacity', 'servingUnits');
    if (type === 'school' && fields.hasFoodSafetyLead === 'Có') required.push('safetyLeadName');
    if (type === 'school' && fields.mealModel === 'Tự nấu') required.push('kitchenStaff', 'kitchenCertified');
    if (type === 'school' && fields.mealModel !== 'Tự nấu') {
      required.push('supplierSource');
      if (fields.supplierSource === 'verified') required.push('supplierId');
      if (fields.supplierSource === 'manual') required.push('supplierName', 'supplierTax', 'supplierPhone');
    }
    if (required.some(key => !fields[key]?.trim())) { setNotice('Vui lòng hoàn thiện các trường bắt buộc trước khi nộp hồ sơ.'); return; }
    if (type !== 'school' && files.length < 2) { setNotice('Vui lòng đính kèm đủ hồ sơ pháp lý bắt buộc.'); return; }
    const input: ApplicationInput = { type, applicantName: fields.applicantName, address: fields.address, contact: fields.contact, isThirdParty: type === 'school' && fields.mealModel !== 'self-cook' && fields.supplierSource === 'manual', data: fields, attachments: files };
    create.mutate({ data: input }, { onSuccess: () => { queryClient.invalidateQueries({ queryKey: getListApplicationsQueryKey() }); queryClient.invalidateQueries({ queryKey: getGetAdminSummaryQueryKey() }); setSubmitted(true); setNotice('Hồ sơ đã được tiếp nhận và chuyển sang trạng thái chờ duyệt.'); }, onError: () => setNotice('Không thể nộp hồ sơ lúc này. Vui lòng thử lại.') });
  };
  if (submitted) return <div className="mx-auto max-w-2xl py-10 text-center"><div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-secondary text-primary"><Check size={30} /></div><p className="mono-label mt-7 text-primary">ĐÃ TIẾP NHẬN HỒ SƠ</p><h1 className="display-tight mt-3 text-4xl font-extrabold">Hồ sơ đang chờ xét duyệt.</h1><p className="mx-auto mt-4 max-w-lg text-sm leading-6 text-muted-foreground">Thông tin đã được khóa để bảo đảm tính toàn vẹn. Cán bộ chuyên môn sẽ liên hệ qua thông tin bạn cung cấp nếu cần bổ sung.</p><div className="mt-8 flex justify-center gap-3"><ButtonLink href="/">Về trang chủ</ButtonLink><Button onClick={() => { setSubmitted(false); setFields({}); setFiles([]); setNotice(''); }} variant="outline" className="rounded-xl">Nộp hồ sơ khác</Button></div>{notice && <Notice message={notice} onClose={() => setNotice('')} />}</div>;
  return <div className="mx-auto max-w-4xl"><SectionHeading eyebrow="Đăng ký trực tuyến" title="Thông tin đăng ký" description="Chọn loại cơ sở ngay trong biểu mẫu. Các phần thông tin bên dưới sẽ tự động thay đổi theo loại hồ sơ." /><form onSubmit={submit} className="space-y-6">
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6"><label htmlFor="registration-type" className="block text-sm font-bold">Loại cơ sở đăng ký <span className="text-destructive">*</span></label><select id="registration-type" value={type} onChange={event => changeType(event.target.value as ApplicationType)} className="focus-ring mt-2 h-12 w-full rounded-xl border border-input bg-background px-4 text-sm font-semibold" data-testid="select-registration-type"><option value="food-supplier">Đơn vị cung cấp thực phẩm</option><option value="meal-provider">Đơn vị cung cấp suất ăn</option><option value="school">Cơ sở giáo dục</option></select><p className="mt-3 text-sm leading-6 text-muted-foreground">Mỗi loại hình có bộ câu hỏi và tiêu chí riêng. Bạn có thể đổi lựa chọn để chuyển sang biểu mẫu khác.</p></div>
    <FormSection title="Thông tin pháp nhân" icon={UserRound}><div className="grid gap-4 md:grid-cols-2"><Field label={type === 'school' ? 'Tên trường *' : 'Tên đơn vị *'} value={fields.applicantName} onChange={v => update('applicantName', v)} test="input-applicant-name" /><Field label="Mã số thuế *" value={fields.taxCode} onChange={v => update('taxCode', v)} test="input-tax-code" hidden={type === 'school'} /><Field label="Địa chỉ đầy đủ *" value={fields.address} onChange={v => update('address', v)} test="input-address" wide /><Field label="Số điện thoại / email *" value={fields.contact} onChange={v => update('contact', v)} test="input-contact" /><Field label="Người đại diện pháp luật" value={fields.legalRep} onChange={v => update('legalRep', v)} test="input-legal-rep" hidden={type === 'school'} /><Field label="Email liên hệ" value={fields.email} onChange={v => update('email', v)} test="input-email" type="email" hidden={type === 'school'} /></div>{type === 'school' && <div className="mt-4 grid gap-4 md:grid-cols-2"><Field label="Cấp học *" value={fields.schoolLevel} onChange={v => update('schoolLevel', v)} test="input-school-level" placeholder="Mầm non, tiểu học..." /><Field label="Sức chứa căn tin (học sinh/lượt)" value={fields.canteenCapacity} onChange={v => update('canteenCapacity', v)} test="input-canteen-capacity" type="number" /></div>}</FormSection>
    {type !== 'school' && <><FormSection title="Giấy phép an toàn thực phẩm" icon={FileText}><div className="grid gap-4 md:grid-cols-3"><Field label="Số giấy phép ATTP *" value={fields.licenseNumber} onChange={v => update('licenseNumber', v)} test="input-license-number" /><Field label="Ngày cấp *" value={fields.licenseIssued} onChange={v => update('licenseIssued', v)} test="input-license-issued" type="date" /><Field label="Ngày hết hạn *" value={fields.licenseExpires} onChange={v => update('licenseExpires', v)} test="input-license-expires" type="date" /></div><FilePicker label="Tệp pháp lý (giấy phép ATTP + đăng ký kinh doanh) *" files={files} onChange={addFiles} onRemove={removeFile} test="input-legal-files" /></FormSection>{type === 'food-supplier' ? <FormSection title="Nguồn gốc sản phẩm" icon={Store}><Field label="Nhóm sản phẩm cung cấp *" value={fields.productGroups} onChange={v => update('productGroups', v)} test="input-product-groups" placeholder="Rau củ, thịt, thủy sản..." /><Field label="Vùng trồng / nuôi / khai thác" value={fields.origin} onChange={v => update('origin', v)} test="input-origin" /><FilePicker label="Chứng nhận chất lượng (nếu có)" files={files.filter(f => f.name.startsWith('quality-'))} onChange={addFiles} onRemove={removeFile} test="input-quality-files" /></FormSection> : <MealProviderFields fields={fields} update={update} suppliers={suppliers ?? []} />}</>}
    {type === 'school' && <SchoolFields fields={fields} update={update} suppliers={suppliers ?? []} files={files} addFiles={addFiles} removeFile={removeFile} />}
    <FormSection title="Ảnh minh chứng" icon={ImagePlus}><p className="mb-4 text-sm text-muted-foreground">Có thể chọn nhiều ảnh cùng lúc. Mỗi loại ảnh bắt buộc được ghi rõ bên dưới.</p><FilePicker label={type === 'food-supplier' ? 'Ảnh khu vực bảo quản / kho chứa *' : type === 'meal-provider' ? 'Ảnh khu chế biến, thiết bị, khu rửa tay và nhân viên bảo hộ *' : 'Ảnh bếp ăn / căn tin và khu lưu mẫu *'} files={files} onChange={addFiles} onRemove={removeFile} test="input-evidence-files" multiple /></FormSection>
    <div className="flex flex-col gap-4 rounded-2xl border border-border bg-secondary/50 p-5 sm:flex-row sm:items-center sm:justify-between"><div className="flex gap-3 text-sm"><LockKeyhole className="mt-0.5 shrink-0 text-primary" size={18} /><p><strong>Kiểm tra trước khi nộp.</strong><br /><span className="text-muted-foreground">Sau khi gửi, hồ sơ sẽ khóa chỉnh sửa cho đến khi có yêu cầu bổ sung.</span></p></div><Button type="submit" disabled={create.isPending} className="h-12 rounded-xl px-6" data-testid="button-submit-application">{create.isPending ? 'Đang gửi...' : 'Nộp hồ sơ'} <Send size={16} /></Button></div>
  </form>{notice && <Notice message={notice} onClose={() => setNotice('')} />}</div>;
}

function FormSection({ title, icon: Icon, children }: { title: string; icon: typeof UserRound; children: ReactNode }) { return <section className="rounded-2xl border border-border bg-card p-5 md:p-7"><div className="mb-6 flex items-center gap-3 border-b border-border pb-4"><div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary text-primary"><Icon size={18} /></div><h2 className="text-lg font-extrabold">{title}</h2></div>{children}</section>; }
function Field({ label, value = '', onChange, test, type = 'text', placeholder, wide = false, hidden = false }: { label: string; value?: string; onChange: (value: string) => void; test: string; type?: string; placeholder?: string; wide?: boolean; hidden?: boolean }) { if (hidden) return null; return <label className={wide ? 'md:col-span-2' : ''}><span className="mb-2 block text-sm font-semibold">{label}</span><input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className="focus-ring h-11 w-full rounded-xl border border-input bg-background px-3 text-sm" data-testid={test} /></label>; }
function FilePicker({ label, files, onChange, onRemove, test, multiple = false }: { label: string; files: Attachment[]; onChange: (event: ChangeEvent<HTMLInputElement>) => void; onRemove: (name: string) => void; test: string; multiple?: boolean }) { return <div className="mt-5"><label className="mb-2 block text-sm font-semibold">{label}</label><label className="focus-ring flex min-h-16 cursor-pointer items-center gap-3 rounded-xl border border-dashed border-primary/35 bg-secondary/30 px-4 text-sm font-semibold text-primary hover:bg-secondary"><Plus size={18} /><span>Chọn tệp {multiple ? '(có thể chọn nhiều)' : ''}</span><input type="file" accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png" multiple={multiple} onChange={onChange} className="sr-only" data-testid={test} /></label>{files.length > 0 && <div className="mt-3 space-y-2">{files.map(file => <div key={file.name} className="flex items-center justify-between rounded-lg bg-muted px-3 py-2 text-sm"><span className="flex min-w-0 items-center gap-2 truncate"><FileText size={15} className="shrink-0 text-primary" />{file.name}</span><button type="button" onClick={() => onRemove(file.name)} className="focus-ring ml-3 shrink-0 text-muted-foreground hover:text-destructive" aria-label={`Xóa ${file.name}`} data-testid={`button-remove-file-${file.name}`}><X size={15} /></button></div>)}</div>}</div>; }

function MealProviderFields({ fields, update, suppliers }: { fields: Record<string, string>; update: (key: string, value: string) => void; suppliers: { id: string; name: string; taxCode: string }[] }) { return <><FormSection title="Nhân lực & năng lực cung ứng" icon={Users}><div className="grid gap-4 md:grid-cols-3"><Field label="Tổng nhân viên chế biến *" value={fields.staffTotal} onChange={v => update('staffTotal', v)} test="input-staff-total" type="number" /><Field label="Có chứng chỉ tập huấn ATTP *" value={fields.staffTrained} onChange={v => update('staffTrained', v)} test="input-staff-trained" type="number" /><Field label="Có khám sức khỏe còn hiệu lực *" value={fields.staffHealth} onChange={v => update('staffHealth', v)} test="input-staff-health" type="number" /></div><div className="mt-4 grid gap-4 md:grid-cols-2"><label><span className="mb-2 block text-sm font-semibold">Nhà cung cấp thực phẩm *</span><select value={fields.supplierId ?? ''} onChange={e => update('supplierId', e.target.value)} className="focus-ring h-11 w-full rounded-xl border border-input bg-background px-3 text-sm" data-testid="select-meal-supplier"><option value="">Chọn từ danh sách đã đăng ký</option>{suppliers.map(supplier => <option key={supplier.id} value={supplier.id}>{supplier.name} · {supplier.taxCode}</option>)}</select></label><Field label="Công suất suất ăn / ngày *" value={fields.dailyCapacity} onChange={v => update('dailyCapacity', v)} test="input-daily-capacity" type="number" /><Field label="Số trường / đơn vị đang phục vụ *" value={fields.servingUnits} onChange={v => update('servingUnits', v)} test="input-serving-units" type="number" wide /><Field label="Tên các trường đang phục vụ (nếu có)" value={fields.servingNames} onChange={v => update('servingNames', v)} test="input-serving-names" wide /></div></FormSection></>; }

function SchoolFields({ fields, update, suppliers, files, addFiles, removeFile }: { fields: Record<string, string>; update: (key: string, value: string) => void; suppliers: { id: string; name: string; taxCode: string }[]; files: Attachment[]; addFiles: (event: ChangeEvent<HTMLInputElement>) => void; removeFile: (name: string) => void }) { return <><FormSection title="Trách nhiệm an toàn thực phẩm" icon={ShieldCheck}><div className="grid gap-4 md:grid-cols-2"><SelectField label="Có cán bộ phụ trách ATTP? *" value={fields.hasFoodSafetyLead} onChange={v => update('hasFoodSafetyLead', v)} test="select-food-safety-lead" options={['Có', 'Không']} /><SelectField label="Hình thức tổ chức bữa ăn *" value={fields.mealModel} onChange={v => update('mealModel', v)} test="select-meal-model" options={['Tự nấu', 'Liên kết đơn vị suất ăn', 'Thuê đơn vị nấu tại bếp trường']} /></div>{fields.hasFoodSafetyLead === 'Có' && <div className="mt-4 grid gap-4 md:grid-cols-2"><Field label="Họ tên người phụ trách *" value={fields.safetyLeadName} onChange={v => update('safetyLeadName', v)} test="input-safety-lead-name" /><FilePicker label="Chứng chỉ / tập huấn ATTP *" files={files.filter(f => f.name.startsWith('lead-'))} onChange={addFiles} onRemove={removeFile} test="input-lead-certificate" /></div>}{fields.mealModel && fields.mealModel !== 'Tự nấu' && <div className="mt-5 rounded-xl border border-accent/50 bg-accent/15 p-4"><p className="text-sm font-bold">Đơn vị cung cấp suất ăn</p><p className="mt-1 text-xs text-muted-foreground">Nếu chọn nhập trực tiếp, thông tin sẽ hiển thị nhãn “do bên thứ ba cung cấp, chưa xác minh trực tiếp”.</p><div className="mt-4 grid gap-4 md:grid-cols-2"><label><span className="mb-2 block text-sm font-semibold">Nguồn thông tin *</span><select value={fields.supplierSource ?? ''} onChange={e => update('supplierSource', e.target.value)} className="focus-ring h-11 w-full rounded-xl border border-input bg-background px-3 text-sm" data-testid="select-school-supplier-source"><option value="">Chọn nguồn</option><option value="verified">Chọn đơn vị đã đăng ký</option><option value="manual">Nhập đơn vị trực tiếp</option></select></label>{fields.supplierSource === 'verified' ? <label><span className="mb-2 block text-sm font-semibold">Đơn vị suất ăn *</span><select value={fields.supplierId ?? ''} onChange={e => update('supplierId', e.target.value)} className="focus-ring h-11 w-full rounded-xl border border-input bg-background px-3 text-sm" data-testid="select-school-supplier"><option value="">Chọn nhà cung cấp</option>{suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}</select></label> : <><Field label="Tên đơn vị *" value={fields.supplierName} onChange={v => update('supplierName', v)} test="input-school-supplier-name" /><Field label="Mã số thuế *" value={fields.supplierTax} onChange={v => update('supplierTax', v)} test="input-school-supplier-tax" /><Field label="Số điện thoại *" value={fields.supplierPhone} onChange={v => update('supplierPhone', v)} test="input-school-supplier-phone" /><Field label="Địa chỉ (không bắt buộc)" value={fields.supplierAddress} onChange={v => update('supplierAddress', v)} test="input-school-supplier-address" /></>}</div></div>}{fields.mealModel === 'Tự nấu' && <div className="mt-4 grid gap-4 md:grid-cols-2"><Field label="Số nhân viên bếp *" value={fields.kitchenStaff} onChange={v => update('kitchenStaff', v)} test="input-kitchen-staff" type="number" /><SelectField label="Nhân viên có chứng chỉ ATTP? *" value={fields.kitchenCertified} onChange={v => update('kitchenCertified', v)} test="select-kitchen-certified" options={['Có', 'Không']} /></div>}</FormSection><FormSection title="Cơ sở vật chất sơ bộ" icon={Building2}><div className="grid gap-4 md:grid-cols-2"><SelectField label="Bếp ăn theo nguyên tắc một chiều? *" value={fields.kitchenOneWay} onChange={v => update('kitchenOneWay', v)} test="select-kitchen-one-way" options={['Có', 'Không']} /><SelectField label="Có khu lưu mẫu thức ăn? *" value={fields.sampleStorage} onChange={v => update('sampleStorage', v)} test="select-sample-storage" options={['Có', 'Không']} /></div></FormSection></>; }
function SelectField({ label, value = '', onChange, test, options }: { label: string; value?: string; onChange: (value: string) => void; test: string; options: string[] }) { return <label><span className="mb-2 block text-sm font-semibold">{label}</span><select value={value} onChange={e => onChange(e.target.value)} className="focus-ring h-11 w-full rounded-xl border border-input bg-background px-3 text-sm" data-testid={test}><option value="">Chọn một phương án</option>{options.map(option => <option key={option} value={option}>{option}</option>)}</select></label>; }

export function AdminDashboard() {
  const { data: summary, isLoading } = useGetAdminSummary();
  const [status, setStatus] = useState<ListApplicationsParams['status']>('pending');
  const [search, setSearch] = useState('');
  const params = useMemo<ListApplicationsParams>(() => ({ status, search: search || undefined }), [status, search]);
  const { data: applications, isLoading: loadingApps, isError } = useListApplications(params);
  return <AdminShell><div className="mx-auto max-w-7xl px-5 py-9 lg:px-10"><SectionHeading eyebrow="Tổng quan nghiệp vụ" title="Bàn xét duyệt hồ sơ." description="Theo dõi luồng tiếp nhận và xử lý hồ sơ đăng ký của các cơ sở trên địa bàn." action={<span className="mono-label text-muted-foreground">{new Date().toLocaleDateString('vi-VN')}</span>} /><div className="grid grid-cols-2 gap-3 lg:grid-cols-5">{[['Chờ duyệt', summary?.pending, 'green', ClipboardCheck], ['Cần bổ sung', summary?.needsMoreInfo, 'orange', Info], ['Đã duyệt', summary?.approved, 'gold', BadgeCheck], ['Từ chối', summary?.rejected, 'blue', X], ['Tổng hồ sơ', summary?.total, 'green', FileText]].map(([label, value, tone, Icon]) => <MetricCard key={label as string} label={label as string} value={isLoading ? '…' : formatNumber(value as number)} tone={tone as 'green' | 'gold' | 'orange' | 'blue'} icon={Icon as typeof Search} />)}</div><div className="mt-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between"><div><p className="mono-label text-primary">Hàng đợi xét duyệt</p><h2 className="mt-2 text-2xl font-extrabold">Hồ sơ cần xử lý</h2></div><div className="flex flex-col gap-2 sm:flex-row"><label className="relative"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Tìm mã, tên đơn vị..." className="focus-ring h-10 rounded-lg border border-input bg-card pl-9 pr-3 text-sm" data-testid="input-admin-search" /></label><select value={status} onChange={e => setStatus(e.target.value as ListApplicationsParams['status'])} className="focus-ring h-10 rounded-lg border border-input bg-card px-3 text-sm font-semibold" data-testid="select-admin-status"><option value="pending">Chờ duyệt</option><option value="needs-more-info">Cần bổ sung</option><option value="approved">Đã duyệt</option><option value="rejected">Từ chối</option></select></div></div><div className="mt-5 overflow-hidden rounded-2xl border border-border bg-card">{loadingApps ? <LoadingRows /> : isError ? <EmptyState title="Không thể tải hàng đợi" description="Vui lòng thử tải lại trang." /> : applications?.length ? <div className="divide-y divide-border">{applications.map(app => <Link key={app.id} href={`/admin/applications/${app.id}`} className="lift flex flex-col gap-3 p-5 hover:bg-secondary/30 sm:flex-row sm:items-center sm:justify-between" data-testid={`link-application-${app.id}`}><div className="flex items-start gap-4"><div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary"><ClipboardCheck size={18} /></div><div><div className="flex flex-wrap items-center gap-2"><span className="font-mono text-xs font-semibold text-primary">{app.reference}</span><StatusPill status={app.status} /></div><h3 className="mt-1 font-bold">{app.applicantName}</h3><p className="mt-1 text-sm text-muted-foreground">{typeNames[app.type]} · {formatDate(app.submittedAt)}</p></div></div><div className="flex items-center justify-between gap-6 sm:justify-end"><div className="text-right"><p className="text-xs text-muted-foreground">Điểm hiện tại</p><p className="font-mono font-bold">{app.score}/100</p></div><ArrowUpRight size={18} className="text-primary" /></div></Link>)}</div> : <EmptyState title="Không có hồ sơ trong hàng đợi" description="Bộ lọc hiện tại không trả về hồ sơ nào." />}</div></div></AdminShell>;
}

export function AdminApplicationPage() {
  const { id = '' } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const { data: application, isLoading, isError } = useGetApplication(id, { query: { enabled: Boolean(id), queryKey: getGetApplicationQueryKey(id) } });
  const review = useReviewApplication();
  const [score, setScore] = useState(80);
  const [note, setNote] = useState('');
  const [notice, setNotice] = useState('');
  const submitReview = (action: ReviewAction) => {
    review.mutate({ id, data: { action: action as ReviewInputAction, score: Number(score), note } }, { onSuccess: result => { queryClient.setQueryData(getGetApplicationQueryKey(id), result); queryClient.invalidateQueries({ queryKey: getListApplicationsQueryKey() }); queryClient.invalidateQueries({ queryKey: getGetAdminSummaryQueryKey() }); if (action === 'approve') { queryClient.invalidateQueries({ queryKey: getGetPublicSummaryQueryKey() }); queryClient.invalidateQueries({ queryKey: getListPublicRecordsQueryKey() }); } setNotice(action === 'approve' ? 'Hồ sơ đã được duyệt và sẵn sàng công khai.' : action === 'reject' ? 'Hồ sơ đã được ghi nhận từ chối.' : 'Đã gửi yêu cầu bổ sung cho người nộp hồ sơ.'); }, onError: () => setNotice('Không thể cập nhật quyết định. Vui lòng thử lại.') });
  };
  if (isLoading) return <AdminShell><div className="mx-auto max-w-6xl px-5 py-12"><LoadingRows /></div></AdminShell>;
  if (isError || !application) return <AdminShell><div className="mx-auto max-w-6xl px-5 py-12"><EmptyState title="Không tìm thấy hồ sơ" description="Hồ sơ có thể đã được di chuyển hoặc không tồn tại." /></div></AdminShell>;
  return <AdminShell><div className="mx-auto max-w-6xl px-5 py-9 lg:px-10"><Link href="/admin" className="focus-ring inline-flex items-center gap-2 text-sm font-bold text-primary" data-testid="link-back-admin"><ArrowLeft size={16} /> Quay lại hàng đợi</Link><div className="mt-7 flex flex-col gap-5 border-b border-border pb-7 md:flex-row md:items-end md:justify-between"><div><p className="mono-label text-primary">{application.reference} · {typeNames[application.type]}</p><h1 className="display-tight mt-2 text-3xl font-extrabold md:text-5xl">{application.applicantName}</h1><p className="mt-3 text-sm text-muted-foreground">{application.address} · {application.contact}</p></div><StatusPill status={application.status} /></div><div className="mt-8 grid gap-6 lg:grid-cols-[1.25fr_.75fr]"><div className="space-y-6"><ReviewPanel application={application} /><AttachmentPanel attachments={application.attachments} /><div className="rounded-2xl border border-border bg-card p-6"><div className="flex items-center gap-3"><SlidersHorizontal size={19} className="text-primary" /><h2 className="text-lg font-extrabold">Dữ liệu khai báo</h2></div><dl className="mt-4 grid gap-x-6 sm:grid-cols-2">{Object.entries(application.data ?? {}).filter(([, value]) => typeof value !== 'object').map(([key, value]) => <div key={key} className="border-b border-border py-3"><dt className="text-xs text-muted-foreground">{key}</dt><dd className="mt-1 break-words text-sm font-semibold">{String(value || '—')}</dd></div>)}</dl></div></div><aside className="h-fit rounded-2xl border border-border bg-card p-6 lg:sticky lg:top-24"><p className="mono-label text-primary">QUYẾT ĐỊNH CHUYÊN MÔN</p><h2 className="mt-3 text-xl font-extrabold">Chấm điểm & xử lý</h2><label className="mt-6 block"><span className="mb-2 flex justify-between text-sm font-semibold"><span>Điểm tiêu chí</span><strong className="font-mono text-primary">{score}/100</strong></span><input type="range" min="0" max="100" value={score} onChange={e => setScore(Number(e.target.value))} className="w-full accent-[hsl(var(--primary))]" data-testid="input-review-score" /></label><label className="mt-6 block"><span className="mb-2 block text-sm font-semibold">Ý kiến xử lý</span><textarea value={note} onChange={e => setNote(e.target.value)} placeholder="Ghi rõ căn cứ và nội dung cần lưu vết..." className="focus-ring min-h-32 w-full rounded-xl border border-input bg-background p-3 text-sm" data-testid="textarea-review-note" /></label><div className="mt-6 grid gap-2"><Button onClick={() => submitReview('approve')} disabled={review.isPending} className="h-11 rounded-xl bg-primary" data-testid="button-review-approve"><Check size={16} /> Duyệt hồ sơ</Button><Button onClick={() => submitReview('needs-more-info')} disabled={review.isPending} variant="outline" className="h-11 rounded-xl" data-testid="button-review-more-info"><Info size={16} /> Yêu cầu bổ sung</Button><Button onClick={() => submitReview('reject')} disabled={review.isPending} variant="destructive" className="h-11 rounded-xl" data-testid="button-review-reject"><X size={16} /> Từ chối hồ sơ</Button></div><p className="mt-4 text-xs leading-5 text-muted-foreground">Mọi quyết định sẽ được lưu cùng điểm số và ý kiến để bảo đảm khả năng truy vết.</p></aside></div></div>{notice && <Notice message={notice} onClose={() => setNotice('')} />}</AdminShell>;
}
function ReviewPanel({ application }: { application: { submittedAt: string; score: number; isThirdParty: boolean } }) { return <div className="rounded-2xl border border-border bg-card p-6"><div className="flex items-center justify-between"><div className="flex items-center gap-3"><ClipboardCheck size={19} className="text-primary" /><h2 className="text-lg font-extrabold">Tóm tắt xét duyệt</h2></div>{application.isThirdParty && <span className="rounded-full bg-accent/40 px-3 py-1 text-xs font-bold text-accent-foreground">Bên thứ ba chưa xác minh</span>}</div><div className="mt-5 grid gap-4 sm:grid-cols-3"><div><p className="text-xs text-muted-foreground">Ngày nộp</p><p className="mt-1 font-semibold">{formatDate(application.submittedAt)}</p></div><div><p className="text-xs text-muted-foreground">Điểm đang có</p><p className="mt-1 font-mono font-bold text-primary">{application.score}/100</p></div><div><p className="text-xs text-muted-foreground">Tình trạng</p><p className="mt-1 font-semibold">Cần cán bộ xử lý</p></div></div></div>; }
function AttachmentPanel({ attachments }: { attachments: Attachment[] }) { return <div className="rounded-2xl border border-border bg-card p-6"><div className="flex items-center gap-3"><FileText size={19} className="text-primary" /><h2 className="text-lg font-extrabold">Tệp đính kèm</h2><span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-bold text-primary">{attachments?.length ?? 0}</span></div><div className="mt-4 space-y-2">{attachments?.length ? attachments.map(file => <div key={file.name} className="flex items-center justify-between rounded-xl bg-muted/70 px-3 py-3 text-sm"><span className="flex min-w-0 items-center gap-2 truncate"><FileText size={16} className="shrink-0 text-primary" />{file.name}</span><span className="ml-4 shrink-0 font-mono text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(1)}MB</span></div>) : <p className="text-sm text-muted-foreground">Không có tệp đính kèm.</p>}</div></div>; }

export function AdminPlaceholder({ kind }: { kind: 'accounts' | 'reports' }) { const isAccounts = kind === 'accounts'; return <AdminShell><div className="mx-auto max-w-5xl px-5 py-12 lg:px-10"><SectionHeading eyebrow="Khu vực quản trị" title={isAccounts ? 'Quản lý tài khoản' : 'Báo cáo thống kê'} description={isAccounts ? 'Quản lý tài khoản cán bộ và phân quyền truy cập hệ thống.' : 'Tổng hợp số liệu tiếp nhận, xét duyệt và công khai hồ sơ.'} /><div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center"><div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary text-primary">{isAccounts ? <Users size={25} /> : <BarChart3Icon size={25} />}</div><h2 className="mt-5 text-xl font-extrabold">Khu vực đang được hoàn thiện</h2><p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">Mục menu đã sẵn sàng để kết nối với phân hệ {isAccounts ? 'tài khoản và phân quyền' : 'báo cáo, xuất dữ liệu'} trong phiên bản tiếp theo.</p></div></div></AdminShell>; }
function BarChart3Icon({ size }: { size: number }) { return <BarChart3 size={size} />; }