import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import { ArrowLeft, Check, CheckCircle2, Download, FileText, Info, PackageCheck, Plus, Search, Send, ShieldCheck, X, XCircle } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { AdminShell, ButtonLink, EmptyState, MetricCard, PublicShell, SectionHeading } from "@/components/portal-ui";
import { type PublicRecord } from "@/lib/mock-data";

export type ProductType = "self-declared" | "registered";
export type ProductStatus =
  | "published"
  | "under-review"
  | "approved"
  | "needs-more-info"
  | "rejected";

export type ProductApplication = {
  id: string;
  reference: string;
  facilityName: string;
  facilityReference: string;
  type: ProductType;
  status: ProductStatus;
  productName: string;
  category: string;
  ingredients: string;
  testReport: string;
  labelFile: string;
  attachments: string[];
  submittedAt: string;
  reviewNote: string | null;
  receiptNumber: string | null;
  published: boolean;
};

const storageKey = "attp-product-applications";
const publicRecordKey = "attp-published-records";
const demoFacility = "Công ty TNHH Nông sản An Phú";
const demoFacilityReference = "HS-2026-0042";

const initialProducts: ProductApplication[] = [
  {
    id: "product-001",
    reference: "SP-2026-0031",
    facilityName: demoFacility,
    facilityReference: demoFacilityReference,
    type: "self-declared",
    status: "published",
    productName: "Nước ép trái cây Green Farm",
    category: "Thực phẩm thông thường",
    ingredients: "Cam tươi, nước tinh khiết, đường mía",
    testReport: "phieu-kiem-nghiem-green-farm.pdf",
    labelFile: "nhan-san-pham-green-farm.png",
    attachments: ["ban-tu-cong-bo-green-farm.pdf"],
    submittedAt: "2026-08-20",
    reviewNote: null,
    receiptNumber: "TCCB-2026-031",
    published: true,
  },
  {
    id: "product-002",
    reference: "SP-2026-0034",
    facilityName: "Công ty Suất ăn Minh Tâm",
    facilityReference: "HS-2026-0048",
    type: "registered",
    status: "under-review",
    productName: "Sữa hạt dinh dưỡng Oat & Seed",
    category: "Thực phẩm dinh dưỡng y học",
    ingredients: "Yến mạch, hạt điều, hạt chia, vitamin B12",
    testReport: "kiem-nghiem-oat-seed.pdf",
    labelFile: "nhan-oat-seed.pdf",
    attachments: ["ban-cong-bo-oat-seed.pdf", "ho-so-an-toan-oat-seed.pdf"],
    submittedAt: "2026-09-05",
    reviewNote: null,
    receiptNumber: null,
    published: false,
  },
  {
    id: "product-003",
    reference: "SP-2026-0027",
    facilityName: "Trường Mầm non Hoa Sen",
    facilityReference: "HS-2026-0037",
    type: "registered",
    status: "needs-more-info",
    productName: "Bột dinh dưỡng cho trẻ Hoa Sen",
    category: "Sản phẩm cho trẻ dưới 36 tháng",
    ingredients: "Gạo lứt, đậu xanh, sữa bột",
    testReport: "phieu-kiem-nghiem-hoa-sen.pdf",
    labelFile: "mau-nhan-hoa-sen.pdf",
    attachments: ["ban-cong-bo-hoa-sen.pdf"],
    submittedAt: "2026-08-28",
    reviewNote: "Bổ sung bản gốc phiếu kiểm nghiệm và làm rõ chỉ tiêu vi sinh.",
    receiptNumber: null,
    published: false,
  },
];

const productTypeLabels: Record<ProductType, string> = {
  "self-declared": "Tự công bố",
  registered: "Đăng ký bản công bố",
};

const productStatusLabels: Record<ProductStatus, string> = {
  published: "Đã công khai",
  "under-review": "Chờ thẩm định",
  approved: "Đã cấp giấy tiếp nhận",
  "needs-more-info": "Cần bổ sung",
  rejected: "Từ chối",
};

function readProducts() {
  if (typeof window === "undefined") return initialProducts;
  try {
    const value = window.localStorage.getItem(storageKey);
    return value ? (JSON.parse(value) as ProductApplication[]) : initialProducts;
  } catch {
    return initialProducts;
  }
}

function productDate(value: string) {
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(`${value}T00:00:00`));
}

function productStatusClass(status: ProductStatus) {
  if (status === "published" || status === "approved") return "bg-emerald-100 text-emerald-900";
  if (status === "under-review") return "bg-amber-100 text-amber-900";
  if (status === "needs-more-info") return "bg-orange-100 text-orange-900";
  return "bg-red-100 text-red-900";
}

function ProductStatusBadge({ status }: { status: ProductStatus }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ${productStatusClass(status)}`}>
      <span className="status-dot bg-current" />
      {productStatusLabels[status]}
    </span>
  );
}

function writeProducts(products: ProductApplication[]) {
  window.localStorage.setItem(storageKey, JSON.stringify(products));
  window.dispatchEvent(new Event("attp-products-updated"));
}

function publishProductRecord(product: ProductApplication, receiptNumber: string) {
  const record: PublicRecord = {
    id: `product-${product.id}`,
    category: product.type === "self-declared" ? "self-declared-products" : "registered-products",
    title: product.productName,
    subtitle: product.type === "self-declared" ? "Sản phẩm tự công bố" : "Sản phẩm đã đăng ký bản công bố",
    location: "TP. Hồ Chí Minh",
    status: "active",
    publishedAt: new Date().toISOString().slice(0, 10),
    metadata: {
      "Đơn vị công bố": product.facilityName,
      "Số tiếp nhận": receiptNumber,
      "Nhóm sản phẩm": product.category,
    },
  };
  const saved = JSON.parse(window.sessionStorage.getItem(publicRecordKey) || "[]") as PublicRecord[];
  window.sessionStorage.setItem(
    publicRecordKey,
    JSON.stringify([...saved.filter((item) => item.id !== record.id), record]),
  );
}

function ProductForm({
  onDone,
  onCancel,
}: {
  onDone: (product: ProductApplication) => void;
  onCancel: () => void;
}) {
  const [type, setType] = useState<ProductType>("self-declared");
  const [productName, setProductName] = useState("");
  const [category, setCategory] = useState("Thực phẩm thông thường");
  const [ingredients, setIngredients] = useState("");
  const [testReport, setTestReport] = useState("");
  const [labelFile, setLabelFile] = useState("");
  const [attachments, setAttachments] = useState<string[]>([]);
  const [error, setError] = useState("");

  const addFiles = (event: ChangeEvent<HTMLInputElement>, multiple = false) => {
    const files = Array.from(event.target.files ?? []);
    setAttachments((current) => [
      ...current,
      ...files.map((file) => file.name).filter((name) => multiple || !current.includes(name)),
    ]);
    event.target.value = "";
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!productName.trim() || !category.trim() || !ingredients.trim() || !testReport || !labelFile) {
      setError("Vui lòng điền tên, nhóm sản phẩm, thành phần, phiếu kiểm nghiệm và mẫu nhãn.");
      return;
    }
    const isSelfDeclared = type === "self-declared";
    const product: ProductApplication = {
      id: `product-${Date.now()}`,
      reference: `SP-2026-${String(Math.floor(Math.random() * 900) + 100)}`,
      facilityName: demoFacility,
      facilityReference: demoFacilityReference,
      type,
      status: isSelfDeclared ? "published" : "under-review",
      productName: productName.trim(),
      category: category.trim(),
      ingredients: ingredients.trim(),
      testReport,
      labelFile,
      attachments,
      submittedAt: new Date().toISOString().slice(0, 10),
      reviewNote: null,
      receiptNumber: isSelfDeclared ? `TCCB-2026-${String(Math.floor(Math.random() * 900) + 100)}` : null,
      published: isSelfDeclared,
    };
    if (product.published && product.receiptNumber) publishProductRecord(product, product.receiptNumber);
    onDone(product);
  };

  return (
    <form onSubmit={submit} className="space-y-6">
      <div className="rounded-2xl border border-primary/15 bg-secondary/40 p-5">
        <p className="mono-label text-primary">BƯỚC 01 · CHỌN THỦ TỤC</p>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {(["self-declared", "registered"] as ProductType[]).map((option) => (
            <label key={option} className={`cursor-pointer rounded-2xl border p-4 transition ${type === option ? "border-primary bg-white shadow-sm" : "border-border bg-card"}`}>
              <input type="radio" className="sr-only" checked={type === option} onChange={() => setType(option)} />
              <div className="flex items-start gap-3">
                <span className={`mt-1 h-4 w-4 rounded-full border-4 ${type === option ? "border-primary" : "border-slate-300"}`} />
                <span>
                  <strong className="block">{productTypeLabels[option]}</strong>
                  <span className="mt-1 block text-xs leading-5 text-muted-foreground">
                    {option === "self-declared"
                      ? "Sản phẩm thông thường · nộp xong công khai ngay · Sở hậu kiểm."
                      : "Sản phẩm nguy cơ cao · chờ Admin thẩm định và cấp giấy tiếp nhận."}
                  </span>
                </span>
              </div>
            </label>
          ))}
        </div>
      </div>
      <div className="grid gap-4 rounded-2xl border border-border bg-card p-5 md:grid-cols-2">
        <label className="md:col-span-2">
          <span className="mb-2 block text-sm font-semibold">Tên sản phẩm *</span>
          <input value={productName} onChange={(event) => setProductName(event.target.value)} className="focus-ring h-11 w-full rounded-xl border border-input bg-background px-3 text-sm" placeholder="Ví dụ: Nước ép cam nguyên chất" />
        </label>
        <label>
          <span className="mb-2 block text-sm font-semibold">Nhóm sản phẩm *</span>
          <select value={category} onChange={(event) => setCategory(event.target.value)} className="focus-ring h-11 w-full rounded-xl border border-input bg-background px-3 text-sm">
            <option>Thực phẩm thông thường</option>
            <option>Thực phẩm bảo vệ sức khỏe</option>
            <option>Thực phẩm dinh dưỡng y học</option>
            <option>Sản phẩm cho trẻ dưới 36 tháng</option>
            <option>Sản phẩm dùng cho chế độ ăn đặc biệt</option>
          </select>
        </label>
        <label>
          <span className="mb-2 block text-sm font-semibold">Phiếu kết quả kiểm nghiệm ATTP trong 12 tháng *</span>
          <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(event) => setTestReport(event.target.files?.[0]?.name ?? "")} className="focus-ring block h-11 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm" />
          {testReport && <span className="mt-1 block text-xs text-primary">{testReport}</span>}
        </label>
        <label className="md:col-span-2">
          <span className="mb-2 block text-sm font-semibold">Thành phần sản phẩm *</span>
          <textarea value={ingredients} onChange={(event) => setIngredients(event.target.value)} className="focus-ring min-h-24 w-full rounded-xl border border-input bg-background p-3 text-sm" placeholder="Khai báo thành phần theo thứ tự khối lượng..." />
        </label>
        <label>
          <span className="mb-2 block text-sm font-semibold">Mẫu nhãn sản phẩm *</span>
          <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(event) => setLabelFile(event.target.files?.[0]?.name ?? "")} className="focus-ring block h-11 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm" />
          {labelFile && <span className="mt-1 block text-xs text-primary">{labelFile}</span>}
        </label>
        <label>
          <span className="mb-2 block text-sm font-semibold">Hồ sơ đính kèm</span>
          <input type="file" accept=".pdf,.jpg,.jpeg,.png" multiple onChange={(event) => addFiles(event, true)} className="focus-ring block h-11 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm" />
          {attachments.length > 0 && <span className="mt-1 block text-xs text-primary">{attachments.join(", ")}</span>}
        </label>
      </div>
      {type === "registered" ? (
        <div className="flex gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
          <Info size={18} className="mt-0.5 shrink-0" />
          <p>Sau khi nộp, hồ sơ chuyển sang trạng thái <strong>Chờ thẩm định</strong> và chưa xuất hiện trên portal công khai.</p>
        </div>
      ) : (
        <div className="flex gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-950">
          <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
          <p>Sản phẩm tự công bố sẽ hiển thị ngay trên danh sách công khai. Cơ sở tự chịu trách nhiệm và Sở thực hiện hậu kiểm.</p>
        </div>
      )}
      {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-800">{error}</p>}
      <div className="flex flex-wrap justify-end gap-3 border-t border-border pt-5">
        <Button type="button" variant="outline" onClick={onCancel} className="rounded-xl">Hủy</Button>
        <Button type="submit" className="rounded-xl"><Send size={16} /> Nộp hồ sơ sản phẩm</Button>
      </div>
    </form>
  );
}

export function FacilityProductsPage() {
  const [products, setProducts] = useState<ProductApplication[]>(readProducts);
  const [formOpen, setFormOpen] = useState(false);
  const facilityProducts = products.filter((item) => item.facilityName === demoFacility);
  const refresh = () => setProducts(readProducts());
  const addProduct = (product: ProductApplication) => {
    const next = [...readProducts(), product];
    writeProducts(next);
    setProducts(next);
    setFormOpen(false);
  };

  return (
    <PublicShell>
      <main className="mx-auto max-w-6xl px-5 py-9 lg:px-8 lg:py-12">
        <SectionHeading
          eyebrow="Tài khoản cơ sở · coso.demo"
          title="Hồ sơ sản phẩm"
          description="Chỉ cơ sở đã đạt PASS mới được tạo hồ sơ sản phẩm. Mỗi sản phẩm là một hồ sơ riêng và có trạng thái xử lý độc lập."
          action={<Link href="/facility/profile" className="inline-flex items-center gap-2 text-sm font-bold text-primary"><ArrowLeft size={16} /> Hồ sơ cơ sở</Link>}
        />
        <div className="mb-6 grid gap-4 md:grid-cols-3">
          <MetricCard label="Trạng thái hồ sơ cơ sở" value="PASS" icon={ShieldCheck} tone="green" />
          <MetricCard label="Sản phẩm đã khai báo" value={facilityProducts.length} icon={PackageCheck} tone="blue" />
          <MetricCard label="Đang chờ thẩm định" value={facilityProducts.filter((item) => item.status === "under-review").length} icon={FileText} tone="gold" />
        </div>
        {formOpen ? (
          <section className="rounded-3xl border border-border bg-card p-5 shadow-sm md:p-7">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <p className="mono-label text-primary">KHAI BÁO SẢN PHẨM</p>
                <h2 className="mt-2 text-2xl font-extrabold">Tạo hồ sơ sản phẩm</h2>
              </div>
              <button type="button" onClick={() => setFormOpen(false)} aria-label="Đóng form" className="rounded-lg p-2 text-muted-foreground hover:bg-secondary"><X size={18} /></button>
            </div>
            <ProductForm onDone={addProduct} onCancel={() => setFormOpen(false)} />
          </section>
        ) : (
          <>
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="mono-label text-primary">DANH SÁCH HỒ SƠ</p>
                <h2 className="mt-2 text-2xl font-extrabold">Sản phẩm của cơ sở</h2>
              </div>
              <Button onClick={() => setFormOpen(true)} className="rounded-xl"><Plus size={17} /> Tạo hồ sơ sản phẩm</Button>
            </div>
            <div className="space-y-3">
              {facilityProducts.map((product) => (
                <article key={product.id} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs font-bold text-primary">{product.reference}</span>
                        <ProductStatusBadge status={product.status} />
                        <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-bold text-primary">{productTypeLabels[product.type]}</span>
                      </div>
                      <h3 className="mt-2 text-lg font-extrabold">{product.productName}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{product.category} · Nộp ngày {productDate(product.submittedAt)}</p>
                    </div>
                    <div className="text-left md:text-right">
                      <p className="text-xs text-muted-foreground">Số tiếp nhận</p>
                      <p className="font-mono text-sm font-bold">{product.receiptNumber ?? "Đang chờ cấp"}</p>
                    </div>
                  </div>
                  {product.reviewNote && <p className="mt-4 rounded-xl bg-orange-50 px-4 py-3 text-sm font-semibold text-orange-950"><Info className="mr-2 inline" size={15} />{product.reviewNote}</p>}
                </article>
              ))}
            </div>
            {!facilityProducts.length && <EmptyState title="Chưa có hồ sơ sản phẩm" description="Tạo hồ sơ đầu tiên sau khi cơ sở đã đạt PASS." />}
          </>
        )}
        <div className="mt-6 flex gap-3 rounded-2xl border border-primary/15 bg-secondary/40 p-4 text-sm text-muted-foreground">
          <ShieldCheck size={18} className="mt-0.5 shrink-0 text-primary" />
          <p><strong className="text-foreground">Luồng demo frontend:</strong> dữ liệu đang lưu trong trình duyệt. Khi kết nối backend thật, cần chuyển hồ sơ và tệp minh chứng sang API + database/object storage.</p>
        </div>
      </main>
    </PublicShell>
  );
}

function exportProducts(products: ProductApplication[]) {
  const headers = ["Mã hồ sơ", "Tên sản phẩm", "Đơn vị", "Loại", "Trạng thái", "Ngày nộp", "Số tiếp nhận"];
  const escape = (value: unknown) => String(value ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  const body = products.map((item) => `<tr>${[item.reference, item.productName, item.facilityName, productTypeLabels[item.type], productStatusLabels[item.status], productDate(item.submittedAt), item.receiptNumber ?? ""].map((value) => `<td>${escape(value)}</td>`).join("")}</tr>`).join("");
  const html = `<html><head><meta charset="utf-8" /></head><body><h1>Danh sách hồ sơ sản phẩm ATTP</h1><table border="1"><thead><tr>${headers.map((header) => `<th>${escape(header)}</th>`).join("")}</tr></thead><tbody>${body}</tbody></table></body></html>`;
  const url = URL.createObjectURL(new Blob([`\ufeff${html}`], { type: "application/vnd.ms-excel;charset=utf-8" }));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `danh-sach-ho-so-san-pham-${new Date().toISOString().slice(0, 10)}.xls`;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function AdminProductApplicationsPage() {
  const [products, setProducts] = useState<ProductApplication[]>(readProducts);
  const [type, setType] = useState<"all" | ProductType>("all");
  const [status, setStatus] = useState<"all" | ProductStatus>("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<ProductApplication | null>(null);
  const [notice, setNotice] = useState("");
  useEffect(() => {
    const refresh = () => setProducts(readProducts());
    window.addEventListener("attp-products-updated", refresh);
    return () => window.removeEventListener("attp-products-updated", refresh);
  }, []);
  const filtered = useMemo(
    () => products.filter((item) => (type === "all" || item.type === type) && (status === "all" || item.status === status) && `${item.reference} ${item.productName} ${item.facilityName}`.toLowerCase().includes(search.toLowerCase())),
    [products, type, status, search],
  );
  const updateProduct = (nextProduct: ProductApplication) => {
    const next = products.map((item) => item.id === nextProduct.id ? nextProduct : item);
    setProducts(next);
    writeProducts(next);
    setSelected(nextProduct);
  };
  const approve = () => {
    if (!selected) return;
    const receipt = `CB-2026-${String(Math.floor(Math.random() * 900) + 100)}`;
    const next = { ...selected, status: "approved" as ProductStatus, receiptNumber: receipt, published: true, reviewNote: null };
    publishProductRecord(next, receipt);
    updateProduct(next);
    setNotice(`Đã cấp giấy tiếp nhận ${receipt} và công khai sản phẩm.`);
  };
  const requestMoreInfo = () => {
    if (!selected) return;
    const note = window.prompt("Nội dung yêu cầu bổ sung", selected.reviewNote ?? "Vui lòng bổ sung hồ sơ theo quy định.");
    if (!note?.trim()) return;
    updateProduct({ ...selected, status: "needs-more-info", reviewNote: note.trim(), published: false });
    setNotice("Đã gửi yêu cầu bổ sung cho cơ sở.");
  };
  const reject = () => {
    if (!selected) return;
    const note = window.prompt("Lý do từ chối", "Hồ sơ chưa đáp ứng yêu cầu thẩm định.");
    if (!note?.trim()) return;
    updateProduct({ ...selected, status: "rejected", reviewNote: note.trim(), published: false });
    setNotice("Đã ghi nhận từ chối hồ sơ.");
  };

  return (
    <AdminShell>
      <div className="mx-auto max-w-7xl px-5 py-9 lg:px-10">
        <SectionHeading
          eyebrow="Hồ sơ sản phẩm"
          title="Thẩm định và công khai sản phẩm."
          description="Tách riêng luồng tự công bố và đăng ký bản công bố. Sản phẩm tự công bố chỉ hậu kiểm; sản phẩm đăng ký phải được duyệt trước khi công khai."
          action={<button type="button" onClick={() => exportProducts(filtered)} className="inline-flex items-center gap-2 rounded-xl border border-primary/20 bg-card px-3.5 py-2.5 text-sm font-bold text-primary shadow-sm hover:bg-secondary"><Download size={16} /> Xuất Excel</button>}
        />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard label="Tổng hồ sơ" value={products.length} icon={PackageCheck} tone="green" />
          <MetricCard label="Tự công bố · hậu kiểm" value={products.filter((item) => item.type === "self-declared").length} icon={CheckCircle2} tone="blue" />
          <MetricCard label="Chờ thẩm định" value={products.filter((item) => item.status === "under-review").length} icon={FileText} tone="gold" />
          <MetricCard label="Cần bổ sung" value={products.filter((item) => item.status === "needs-more-info").length} icon={Info} tone="orange" />
        </div>
        <div className="mt-8 flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 lg:flex-row">
          <label className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Tìm mã, sản phẩm, đơn vị..." className="focus-ring h-11 w-full rounded-xl border border-input bg-background pl-9 pr-3 text-sm" />
          </label>
          <select value={type} onChange={(event) => setType(event.target.value as "all" | ProductType)} className="focus-ring h-11 rounded-xl border border-input bg-background px-3 text-sm font-semibold">
            <option value="all">Tất cả loại hồ sơ</option>
            <option value="self-declared">Tự công bố</option>
            <option value="registered">Đăng ký bản công bố</option>
          </select>
          <select value={status} onChange={(event) => setStatus(event.target.value as "all" | ProductStatus)} className="focus-ring h-11 rounded-xl border border-input bg-background px-3 text-sm font-semibold">
            <option value="all">Tất cả trạng thái</option>
            {Object.entries(productStatusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
        </div>
        <div className="mt-5 overflow-hidden rounded-2xl border border-border bg-card">
          {filtered.length ? (
            <div className="divide-y divide-border">
              {filtered.map((product) => (
                <button type="button" key={product.id} onClick={() => setSelected(product)} className="flex w-full flex-col gap-3 p-5 text-left transition hover:bg-secondary/30 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start gap-4">
                    <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary"><PackageCheck size={18} /></div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2"><span className="font-mono text-xs font-bold text-primary">{product.reference}</span><ProductStatusBadge status={product.status} /></div>
                      <h3 className="mt-1 font-bold">{product.productName}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{product.facilityName} · {productTypeLabels[product.type]} · {productDate(product.submittedAt)}</p>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-primary">Xem thẩm định →</span>
                </button>
              ))}
            </div>
          ) : <EmptyState title="Không có hồ sơ phù hợp" description="Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm." />}
        </div>
      </div>
      {selected && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/45 p-0 backdrop-blur-sm sm:items-center sm:p-5" onClick={() => setSelected(null)}>
          <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-t-3xl border border-border bg-card p-6 shadow-2xl sm:rounded-3xl" onClick={(event) => event.stopPropagation()}>
            <div className="flex items-start justify-between gap-4 border-b border-border pb-5">
              <div><p className="mono-label text-primary">{selected.reference} · {productTypeLabels[selected.type]}</p><h2 className="mt-2 text-2xl font-extrabold">{selected.productName}</h2><p className="mt-1 text-sm text-muted-foreground">{selected.facilityName}</p></div>
              <button type="button" onClick={() => setSelected(null)} className="rounded-lg p-2 text-muted-foreground hover:bg-secondary" aria-label="Đóng"><X size={18} /></button>
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {[
                ["Nhóm sản phẩm", selected.category],
                ["Ngày nộp", productDate(selected.submittedAt)],
                ["Số giấy tiếp nhận", selected.receiptNumber ?? "Chưa cấp"],
                ["Công khai", selected.published ? "Đã công khai" : "Chưa công khai"],
              ].map(([label, value]) => <div key={label} className="rounded-xl bg-secondary/50 p-3"><p className="text-xs text-muted-foreground">{label}</p><p className="mt-1 text-sm font-bold">{value}</p></div>)}
            </div>
            <dl className="mt-5 divide-y divide-border rounded-2xl border border-border px-4">
              <div className="grid gap-1 py-4 sm:grid-cols-[180px_1fr]"><dt className="text-sm text-muted-foreground">Thành phần</dt><dd className="text-sm font-semibold">{selected.ingredients}</dd></div>
              <div className="grid gap-1 py-4 sm:grid-cols-[180px_1fr]"><dt className="text-sm text-muted-foreground">Phiếu kiểm nghiệm</dt><dd className="text-sm font-semibold">{selected.testReport}</dd></div>
              <div className="grid gap-1 py-4 sm:grid-cols-[180px_1fr]"><dt className="text-sm text-muted-foreground">Mẫu nhãn</dt><dd className="text-sm font-semibold">{selected.labelFile}</dd></div>
              <div className="grid gap-1 py-4 sm:grid-cols-[180px_1fr]"><dt className="text-sm text-muted-foreground">Hồ sơ đính kèm</dt><dd className="text-sm font-semibold">{selected.attachments.join(", ") || "—"}</dd></div>
            </dl>
            {selected.reviewNote && <p className="mt-4 rounded-xl bg-orange-50 px-4 py-3 text-sm font-semibold text-orange-950"><Info className="mr-2 inline" size={15} />{selected.reviewNote}</p>}
            {selected.type === "self-declared" ? (
              <div className="mt-5 flex gap-3 rounded-2xl border border-sky-200 bg-sky-50 p-4 text-sm text-sky-950"><ShieldCheck size={18} className="mt-0.5 shrink-0" /><p>Đây là hồ sơ <strong>tự công bố</strong>. Không có bước duyệt trước; cán bộ chỉ xem để hậu kiểm. Hồ sơ đã được công khai ngay khi cơ sở nộp.</p></div>
            ) : (
              <div className="mt-6 flex flex-wrap justify-end gap-2 border-t border-border pt-5">
                <Button variant="outline" onClick={requestMoreInfo} className="rounded-xl"><Info size={16} /> Yêu cầu bổ sung</Button>
                <Button variant="destructive" onClick={reject} className="rounded-xl"><XCircle size={16} /> Từ chối</Button>
                <Button onClick={approve} disabled={selected.status === "approved"} className="rounded-xl"><Check size={16} /> Duyệt & cấp giấy</Button>
              </div>
            )}
          </div>
        </div>
      )}
      {notice && <div className="fixed bottom-5 right-5 z-[60] max-w-sm rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-xl">{notice}</div>}
    </AdminShell>
  );
}