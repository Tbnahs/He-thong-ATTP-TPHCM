import "./_group.css";
import {
  ArrowLeft,
  CheckCircle2,
  Eye,
  FileText,
  ImagePlus,
  MapPin,
  Phone,
  UserRound,
  X,
} from "lucide-react";

const groups = [
  {
    name: "Thông tin chung cơ sở giáo dục",
    fields: [
      ["Tên cơ sở giáo dục", "Trường Mầm non Hoa Sen"],
      ["Địa chỉ điểm chính", "35 Nguyễn Du, phường Sài Gòn, TP. Hồ Chí Minh"],
      ["Cấp học", "Mầm non"],
      ["Tổng số học sinh", "420"],
      ["Số học sinh bán trú", "286"],
      ["Hiệu trưởng", "Nguyễn Thị Thanh Hà"],
    ],
  },
  {
    name: "Mô hình và quy mô hoạt động bếp ăn",
    fields: [
      ["Mô hình hoạt động", "Bếp ăn tập thể — hợp đồng"],
      ["Công suất", "300 suất/ngày"],
      ["Đơn vị cung cấp suất ăn", "Công ty Suất ăn Minh Tâm"],
    ],
  },
  {
    name: "Hồ sơ pháp lý và người phụ trách ATTP",
    fields: [
      ["Mã số thuế", "0309123456"],
      ["Giấy chứng nhận ATTP", "ATTP-HCM-2026-0084"],
      ["Ngày hết hạn", "12/08/2027"],
      ["Người phụ trách ATTP", "Trần Minh Ngọc · 0908 456 321"],
    ],
  },
  {
    name: "Nhân sự, điều kiện cơ sở và trang thiết bị",
    fields: [
      ["Nhân sự bếp ăn", "12 người"],
      ["Bếp một chiều", "Có"],
      ["Tủ lưu mẫu thức ăn", "Có · 02 tủ"],
    ],
  },
  {
    name: "Thực hành ATTP, kiểm thực và lưu mẫu",
    fields: [
      ["Thực hiện kiểm thực ba bước", "Có"],
      ["Thời gian lưu mẫu", "24 giờ"],
      ["Quy trình vệ sinh dụng cụ", "Có quy trình, cập nhật 08/2026"],
    ],
  },
  {
    name: "Khu vực ăn uống",
    fields: [
      ["Khu vực ăn riêng", "Có"],
      ["Số chỗ ngồi", "210"],
    ],
  },
  {
    name: "Nguồn nước, nguyên liệu và nước uống",
    fields: [
      ["Nguồn nước sử dụng", "Nước máy thành phố"],
      ["Nhà cung cấp thực phẩm", "Công ty TNHH Nông sản An Phú"],
      ["Hồ sơ truy xuất nguồn gốc", "Đã kê khai"],
    ],
  },
  {
    name: "Nội dung khác và xác nhận",
    fields: [
      ["Ghi chú của cơ sở", "Bếp ăn vận hành theo hợp đồng với đơn vị cung cấp suất ăn."],
      ["Người xác nhận", "Nguyễn Thị Thanh Hà · Hiệu trưởng"],
    ],
  },
];

const files = [
  { name: "quyet-dinh-thanh-lap.pdf", size: "0,5 MB", icon: FileText },
  { name: "giay-chung-nhan-attp.pdf", size: "0,8 MB", icon: FileText },
  { name: "hop-dong-suat-an.pdf", size: "0,6 MB", icon: FileText },
  { name: "khu-bep-hoa-sen.jpg", size: "1,8 MB", icon: ImagePlus },
];

function ReadonlyField({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 rounded-xl border border-border/80 bg-background p-3">
      <dt className="text-xs font-bold leading-5 text-muted-foreground">{label}</dt>
      <dd className="mt-1.5 break-words text-sm font-semibold leading-6 text-foreground">
        {value}
      </dd>
    </div>
  );
}

export function Current() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <a
          href="#danh-sach-ho-so"
          className="inline-flex items-center gap-2 text-sm font-bold text-primary"
        >
          <ArrowLeft size={16} /> Quay lại Duyệt hồ sơ
        </a>

        <header className="mt-5 flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] font-bold tracking-[.12em] text-primary">
              THÔNG TIN CHI TIẾT CƠ SỞ
            </p>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight">
              Trường Mầm non Hoa Sen
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Cơ sở giáo dục · Cập nhật 12/08/2026
            </p>
          </div>
          <span className="inline-flex w-fit items-center rounded-full bg-amber-100 px-3 py-1.5 text-xs font-extrabold text-amber-900">
            Cần bổ sung
          </span>
        </header>

        <section className="mt-6 overflow-hidden rounded-3xl bg-[#123d36] text-white shadow-sm">
          <div className="grid gap-5 px-5 py-6 sm:grid-cols-[1fr_auto] sm:px-7">
            <div>
              <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-[#f4c95d]">
                <span>HS-2026-0037</span>
                <span className="text-white/35">•</span>
                <span>Cơ sở giáo dục</span>
                <span className="text-white/35">•</span>
                <span>Hồ sơ đăng ký</span>
              </div>
              <h2 className="mt-2 text-2xl font-extrabold">Trường Mầm non Hoa Sen</h2>
              <p className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-sm text-white/70">
                <span className="inline-flex items-center gap-1"><MapPin size={14} /> 35 Nguyễn Du, phường Sài Gòn, TP. Hồ Chí Minh</span>
                <span className="inline-flex items-center gap-1"><Phone size={14} /> 028 3822 4567</span>
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:min-w-[270px]">
              <div className="rounded-xl bg-white/10 p-3">
                <p className="text-[10px] font-bold uppercase tracking-wider text-white/55">Ngày nộp</p>
                <p className="mt-1 text-sm font-bold">12/08/2026</p>
              </div>
              <div className="rounded-xl bg-white/10 p-3">
                <p className="text-[10px] font-bold uppercase tracking-wider text-white/55">Đánh giá</p>
                <p className="mt-1 text-sm font-bold text-[#f4c95d]">Cần bổ sung · 82/100</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-6 rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-[10px] font-bold tracking-[.12em] text-primary">HỒ SƠ CƠ SỞ</p>
              <h2 className="mt-1 text-xl font-extrabold">Thông tin cơ sở đã khai báo</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Hiển thị đầy đủ theo đúng các nhóm và trường trong form đăng ký.
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5 text-xs font-bold text-muted-foreground">
              <CheckCircle2 size={14} className="text-emerald-600" /> Đã tiếp nhận 12/08/2026
            </span>
          </div>
          <div className="mt-5 space-y-4">
            {groups.map((group, index) => (
              <article
                key={group.name}
                className="overflow-hidden rounded-2xl border border-border bg-card"
              >
                <header className="flex flex-col gap-3 border-b border-border bg-secondary/35 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                  <div className="flex min-w-0 items-start gap-3">
                    <span className="inline-flex h-8 min-w-8 shrink-0 items-center justify-center rounded-md border border-primary/25 bg-card px-2 text-xs font-extrabold text-primary">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <p className="text-[10px] font-extrabold uppercase tracking-[.12em] text-primary">
                        Phần {String(index + 1).padStart(2, "0")}
                      </p>
                      <h3 className="mt-0.5 font-extrabold leading-5">{group.name}</h3>
                    </div>
                  </div>
                  <span className="shrink-0 text-xs font-semibold text-muted-foreground">
                    {group.fields.length} nội dung kê khai
                  </span>
                </header>
                <dl className="grid gap-3 p-3 sm:grid-cols-2 sm:p-4 lg:grid-cols-3">
                  {group.fields.map(([label, value]) => (
                    <ReadonlyField key={label} label={label} value={value} />
                  ))}
                </dl>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-6 rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary">
              <UserRound size={18} />
            </span>
            <div>
              <p className="text-[10px] font-bold tracking-[.12em] text-primary">TÀI KHOẢN HỒ SƠ</p>
              <h2 className="mt-1 text-xl font-extrabold">Người đăng ký và liên hệ</h2>
            </div>
          </div>
          <dl className="mt-5 grid gap-x-6 gap-y-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["Người đại diện", "Nguyễn Thị Thanh Hà"],
              ["Tên đăng nhập", "hoasen.admin"],
              ["Email", "vanthu@hoasen.edu.vn"],
              ["Số điện thoại", "028 3822 4567"],
              ["Ngày nộp hồ sơ", "12/08/2026"],
              ["Hình thức đăng ký", "Cơ sở giáo dục"],
            ].map(([label, value]) => (
              <div key={label}>
                <dt className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">{label}</dt>
                <dd className="mt-1 break-words text-sm font-bold">{value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="mt-6 rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[10px] font-bold tracking-[.12em] text-primary">MINH CHỨNG</p>
              <h2 className="mt-1 text-xl font-extrabold">Tệp hồ sơ đính kèm</h2>
            </div>
            <span className="rounded-full bg-secondary px-3 py-1 text-xs font-bold text-muted-foreground">
              {files.length} tệp
            </span>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {files.map(({ name, size, icon: Icon }) => (
              <button
                key={name}
                type="button"
                className="flex min-w-0 items-center gap-3 rounded-xl border border-border p-3 text-left hover:bg-secondary/40"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary">
                  <Icon size={20} />
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-bold">{name}</span>
                  <span className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                    <Eye size={13} /> {size} · Xem
                  </span>
                </span>
              </button>
            ))}
          </div>
        </section>

        <section className="mt-6 rounded-2xl border border-primary/15 bg-secondary/30 p-5 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-[10px] font-bold tracking-[.12em] text-primary">XỬ LÝ HỒ SƠ</p>
              <h2 className="mt-1 text-xl font-extrabold">Cập nhật kết quả xét duyệt</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Cán bộ có thể duyệt hồ sơ hoặc hủy bỏ hồ sơ ngay tại trang này.
              </p>
            </div>
            <span className="rounded-full bg-amber-100 px-3 py-1.5 text-xs font-extrabold text-amber-900">
              Cần bổ sung
            </span>
          </div>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-end">
            <button type="button" className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-rose-300 bg-rose-50 px-4 text-sm font-bold text-rose-800">
              <X size={16} /> Hủy bỏ
            </button>
            <button type="button" className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-bold text-primary-foreground">
              <CheckCircle2 size={16} /> Duyệt hồ sơ
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}