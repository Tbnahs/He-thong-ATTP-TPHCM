import {
  Fragment,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
} from "react";
import { Link, useLocation, useParams } from "wouter";
import {
  ArrowLeft,
  ArrowUpRight,
  BadgeCheck,
  BarChart3,
  Bell,
  Building2,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  Copy,
  Download,
  Eye,
  FileSpreadsheet,
  FileText,
  GripVertical,
  ImagePlus,
  Info,
  Layers3,
  ListChecks,
  LockKeyhole,
  LogIn,
  Mail,
  MapPin,
  CalendarDays,
  Clock3,
  Newspaper,
  Plus,
  RotateCcw,
  Search,
  Send,
  ShieldCheck,
  SlidersHorizontal,
  Store,
  TriangleAlert,
  Trash2,
  UserRound,
  Users,
  X,
  XCircle,
  ZoomIn,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import NotFound from "@/pages/not-found";
import {
  AdminShell,
  ButtonLink,
  EmptyState,
  MetricCard,
  PublicShell,
  SectionHeading,
  StatusPill,
} from "@/components/portal-ui";
import {
  applications,
  criteriaHistory,
  getCriteriaSet,
  getPublicRecords,
  newsItems,
  regionalPublicRecords,
  suppliers,
  type Application,
  type ApplicationStatus,
  type ApplicationType,
  type Attachment,
  type CriteriaAnswerType,
  type CriteriaConfigInput,
  type CriteriaDefinition,
  type CriteriaGroup,
  type CriteriaSet,
  type ListApplicationsParams,
  type ListPublicRecordsCategory,
  type NewsCategory,
  type NewsItem,
  type PublicRecord,
  type ReviewAction,
} from "@/lib/mock-data";
import heroFoodImage from "@assets/1788940094256_5613377993845818882_5613377993845818882_1e47059ddc5db7e9cbacbeb3495b9f36.jpg";
import newsTrainingImage from "@assets/generated_images/news-training-workshop.jpg";
import newsMarketImage from "@assets/generated_images/news-market-inspection.jpg";
import newsFoodServiceImage from "@assets/generated_images/news-food-service-training.jpg";
import {
  vietnamMapFeatures,
  vietnamMapViewBox,
} from "@/lib/vietnam-map-data";

const categoryNames: Record<string, string> = {
  "eligible-facilities": "Cơ sở đủ điều kiện",
  "self-declared-products": "Sản phẩm tự công bố",
  "registered-products": "Sản phẩm đã đăng ký bản công bố",
  "licensed-advertising": "Quảng cáo được cấp phép",
  "testing-facilities": "Cơ sở kiểm nghiệm",
};
type ProvinceRegion = {
  id: string;
  name: string;
  focus: { x: number; y: number };
  color: string;
};

type RegionalFacility = {
  id: string;
  province: string;
  name: string;
  type: string;
  address: string;
  status: "Đang hoạt động" | "Đã công bố";
};

const provinceRegions: ProvinceRegion[] = [
  { id: "ha-giang", name: "Hà Giang", focus: { x: 18, y: 34 }, color: "#F2B86B" },
  { id: "cao-bang", name: "Cao Bằng", focus: { x: 20, y: 32 }, color: "#F28F8F" },
  { id: "lao-cai", name: "Lào Cai", focus: { x: 14, y: 35 }, color: "#75C9B4" },
  { id: "yen-bai", name: "Yên Bái", focus: { x: 14, y: 27 }, color: "#8E9FDC" },
  { id: "tuyen-quang", name: "Tuyên Quang", focus: { x: 15, y: 23 }, color: "#F6D779" },
  { id: "thai-nguyen", name: "Thái Nguyên", focus: { x: 9, y: 20 }, color: "#EB9C75" },
  { id: "bac-kan", name: "Bắc Kạn", focus: { x: 8, y: 28 }, color: "#A8C985" },
  { id: "phu-tho", name: "Phú Thọ", focus: { x: 8, y: 14 }, color: "#EFA3B7" },
  { id: "ha-noi", name: "Hà Nội", focus: { x: 1, y: 9 }, color: "#8DBFE2" },
  { id: "hai-phong", name: "Hải Phòng", focus: { x: -3, y: 6 }, color: "#F0B4CF" },
  { id: "quang-ninh", name: "Quảng Ninh", focus: { x: -5, y: 10 }, color: "#F5C85B" },
  { id: "ninh-binh", name: "Ninh Bình", focus: { x: 3, y: 1 }, color: "#9FD1A5" },
  { id: "thanh-hoa", name: "Thanh Hóa", focus: { x: 8, y: -2 }, color: "#F29F83" },
  { id: "nghe-an", name: "Nghệ An", focus: { x: 10, y: -7 }, color: "#F3A38D" },
  { id: "ha-tinh", name: "Hà Tĩnh", focus: { x: 9, y: -12 }, color: "#F4D36A" },
  { id: "quang-binh", name: "Quảng Bình", focus: { x: 10, y: -18 }, color: "#D6C1E9" },
  { id: "quang-tri", name: "Quảng Trị", focus: { x: 9, y: -24 }, color: "#AFCBE0" },
  { id: "hue", name: "Thừa Thiên Huế", focus: { x: 7, y: -30 }, color: "#A9CFAF" },
  { id: "da-nang", name: "Đà Nẵng", focus: { x: 3, y: -34 }, color: "#F4C678" },
  { id: "quang-nam", name: "Quảng Nam", focus: { x: 6, y: -37 }, color: "#86C6B8" },
  { id: "quang-ngai", name: "Quảng Ngãi", focus: { x: 7, y: -41 }, color: "#F59A83" },
  { id: "kon-tum", name: "Kon Tum", focus: { x: 14, y: -42 }, color: "#A7C2E5" },
  { id: "gia-lai", name: "Gia Lai", focus: { x: 14, y: -46 }, color: "#F3B38A" },
  { id: "binh-dinh", name: "Bình Định", focus: { x: 7, y: -47 }, color: "#EE8B8C" },
  { id: "phu-yen", name: "Phú Yên", focus: { x: 7, y: -52 }, color: "#F6D779" },
  { id: "dak-lak", name: "Đắk Lắk", focus: { x: 15, y: -53 }, color: "#E9A48A" },
  { id: "khanh-hoa", name: "Khánh Hòa", focus: { x: 2, y: -58 }, color: "#8BB7D8" },
  { id: "lam-dong", name: "Lâm Đồng", focus: { x: 11, y: -62 }, color: "#A6D0A7" },
  { id: "binh-thuan", name: "Bình Thuận", focus: { x: 4, y: -66 }, color: "#F4C578" },
  { id: "tay-ninh", name: "Tây Ninh", focus: { x: 13, y: -71 }, color: "#F19D8C" },
  { id: "binh-duong", name: "Bình Dương", focus: { x: 5, y: -73 }, color: "#9CC6D9" },
  { id: "dong-nai", name: "Đồng Nai", focus: { x: -3, y: -70 }, color: "#88C4A7" },
  { id: "tp-hcm", name: "TP. Hồ Chí Minh", focus: { x: 5, y: -78 }, color: "#E98E88" },
  { id: "long-an", name: "Long An", focus: { x: 15, y: -76 }, color: "#F2CA67" },
  { id: "tien-giang", name: "Tiền Giang", focus: { x: 7, y: -81 }, color: "#A9C6E2" },
  { id: "ben-tre", name: "Bến Tre", focus: { x: 0, y: -82 }, color: "#F1AD83" },
  { id: "vinh-long", name: "Vĩnh Long", focus: { x: 4, y: -86 }, color: "#A9D0A8" },
  { id: "tra-vinh", name: "Trà Vinh", focus: { x: -2, y: -86 }, color: "#C1A7D9" },
  { id: "dong-thap", name: "Đồng Tháp", focus: { x: 13, y: -82 }, color: "#8BC7BB" },
  { id: "an-giang", name: "An Giang", focus: { x: 16, y: -86 }, color: "#F39A87" },
  { id: "kien-giang", name: "Kiên Giang", focus: { x: 16, y: -91 }, color: "#F1D06B" },
  { id: "can-tho", name: "Cần Thơ", focus: { x: 9, y: -87 }, color: "#98B8DE" },
  { id: "hau-giang", name: "Hậu Giang", focus: { x: 8, y: -91 }, color: "#E89AB0" },
  { id: "soc-trang", name: "Sóc Trăng", focus: { x: 3, y: -91 }, color: "#F1B56A" },
  { id: "bac-lieu", name: "Bạc Liêu", focus: { x: -2, y: -94 }, color: "#A8CEA9" },
  { id: "ca-mau", name: "Cà Mau", focus: { x: 5, y: -96 }, color: "#F4B08A" },
];

const regionalFacilities: RegionalFacility[] = [
  { id: "regional-001", province: "ho_chi_minh", name: "Công ty TNHH Nông sản An Phú", type: "Đơn vị cung cấp thực phẩm", address: "184 Nguyễn Văn Linh, Quận 7", status: "Đang hoạt động" },
  { id: "regional-002", province: "ho_chi_minh", name: "Bếp ăn Trường Tiểu học Nguyễn Bỉnh Khiêm", type: "Cơ sở giáo dục", address: "25 Nguyễn Bỉnh Khiêm, Quận 1", status: "Đã công bố" },
  { id: "regional-003", province: "ho_chi_minh", name: "Trung tâm Kiểm nghiệm Nam Sài Gòn", type: "Cơ sở kiểm nghiệm", address: "56 Hoàng Diệu, Quận 4", status: "Đang hoạt động" },
  { id: "regional-004", province: "dong_nai", name: "Công ty CP Nông sản Hưng Thịnh", type: "Đơn vị cung cấp thực phẩm", address: "Khu công nghiệp Amata, Biên Hòa", status: "Đã công bố" },
  { id: "regional-005", province: "dong_nai", name: "HTX Cây ăn trái Long Hà", type: "Hợp tác xã", address: "Long Khánh, Đồng Nai", status: "Đang hoạt động" },
  { id: "regional-006", province: "ha_noi", name: "Công ty Thực phẩm sạch Thủ Đô", type: "Đơn vị cung cấp thực phẩm", address: "Cầu Giấy, Hà Nội", status: "Đang hoạt động" },
  { id: "regional-007", province: "ha_noi", name: "Bếp ăn Trường Tiểu học Ba Đình", type: "Cơ sở giáo dục", address: "Ba Đình, Hà Nội", status: "Đã công bố" },
  { id: "regional-008", province: "da_nang", name: "Cơ sở sản xuất Đặc sản Miền Trung", type: "Cơ sở sản xuất", address: "Hải Châu, Đà Nẵng", status: "Đang hoạt động" },
  { id: "regional-009", province: "da_nang", name: "Nhà hàng Biển Xanh", type: "Dịch vụ ăn uống", address: "Sơn Trà, Đà Nẵng", status: "Đã công bố" },
  { id: "regional-010", province: "hai_phong", name: "HTX Nông nghiệp Cát Hải", type: "Đơn vị cung cấp thực phẩm", address: "Cát Hải, Hải Phòng", status: "Đang hoạt động" },
  { id: "regional-011", province: "can_tho", name: "Cơ sở chế biến Mekong Farm", type: "Cơ sở sản xuất", address: "Ninh Kiều, Cần Thơ", status: "Đã công bố" },
  { id: "regional-012", province: "nghe_an", name: "Công ty TNHH Nông sản Xứ Nghệ", type: "Đơn vị cung cấp thực phẩm", address: "Vinh, Nghệ An", status: "Đang hoạt động" },
];
const typeNames: Record<string, string> = {
  "food-supplier": "Đơn vị cung cấp thực phẩm",
  "meal-provider": "Đơn vị cung cấp suất ăn",
  school: "Cơ sở giáo dục",
};
const facilityTypeOptions: { value: ApplicationType; label: string }[] = [
  { value: "food-supplier", label: "Cung cấp thực phẩm" },
  { value: "meal-provider", label: "Cung cấp suất ăn" },
  { value: "school", label: "Cơ sở giáo dục" },
];
const addressProvinceOptions = [
  "TP. Hồ Chí Minh",
  "Hà Nội",
  "Đà Nẵng",
  "Hải Phòng",
  "Cần Thơ",
  "Huế",
];
const addressWardOptions = [
  "Phường Bến Nghé",
  "Phường Tân Định",
  "Phường Đa Kao",
  "Phường Nguyễn Thái Bình",
  "Phường Cầu Ông Lãnh",
  "Phường Tân Phong",
  "Xã Củ Chi",
  "Xã Hóc Môn",
  "Khác",
];
const formatDate = (value?: string) =>
  value
    ? new Intl.DateTimeFormat("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }).format(new Date(value))
    : "—";
const formatNumber = (value?: number) =>
  typeof value === "number"
    ? new Intl.NumberFormat("vi-VN").format(value)
    : "—";
const newsImageMap: Record<string, string> = {
  "/generated_images/news-training-workshop.jpg": newsTrainingImage,
  "/generated_images/news-market-inspection.jpg": newsMarketImage,
  "/generated_images/news-food-service-training.jpg": newsFoodServiceImage,
};
const getNewsImage = (image: string) => newsImageMap[image] ?? image;
type AccountRole = "admin" | "facility";
const inferAccountRole = (username: string): AccountRole =>
  /^(admin|canbo|reviewer|xetduyet)/i.test(username.trim())
    ? "admin"
    : "facility";
type RepeatableValue = Record<string, string | string[]>[];
type CriteriaValue =
  | string
  | string[]
  | Record<string, string | string[]>
  | RepeatableValue;
type ApplicationInput = {
  type: ApplicationType;
  applicantName: string;
  address: string;
  contact: string;
  criteriaVersion: string;
  isThirdParty?: boolean;
  data: Record<string, unknown>;
  attachments: Attachment[];
};
type RegistrationSnapshot = {
  type: ApplicationType;
  fields: Record<string, CriteriaValue>;
  files: Attachment[];
  submittedAt: string;
};
type FacilityAccount = {
  email: string;
  password: string;
  username: string;
  registration: RegistrationSnapshot;
};
const facilityAccountsStorageKey = "attp-facility-accounts";
const readFacilityAccounts = (): FacilityAccount[] => {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(
      window.localStorage.getItem(facilityAccountsStorageKey) || "[]",
    ) as FacilityAccount[];
  } catch {
    return [];
  }
};
const saveFacilityAccounts = (accounts: FacilityAccount[]) => {
  window.localStorage.setItem(
    facilityAccountsStorageKey,
    JSON.stringify(accounts),
  );
};
const answerTypeLabels: Record<CriteriaAnswerType, string> = {
  text: "Nhập văn bản",
  number: "Nhập số",
  date: "Ngày tháng",
  "yes-no": "Có / Không",
  select: "Chọn phương án",
  "multi-select": "Chọn phương án",
  file: "Tải tệp / ảnh",
  repeatable: "Danh sách có thể thêm nhiều dòng",
};
const getCriteriaValue = (
  value: CriteriaValue,
  answerType: CriteriaAnswerType,
  multiple: boolean,
): string | string[] => {
  if (!multiple) return value as string | string[];
  if (typeof value === "object" && !Array.isArray(value))
    return value[answerType] ?? "";
  return "";
};

function Notice({
  message,
  onClose,
}: {
  message: string;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed bottom-5 right-5 z-50 flex max-w-sm items-start gap-3 rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-xl"
      role="status"
      data-testid="status-notice"
    >
      <Check size={18} className="mt-0.5 shrink-0 text-accent" />
      <span>{message}</span>
      <button
        onClick={onClose}
        aria-label="Đóng thông báo"
        data-testid="button-close-notice"
      >
        <X size={16} />
      </button>
    </div>
  );
}

function HomeRegionalDirectory() {
  const [, navigate] = useLocation();
  const [selectedId, setSelectedId] = useState("all");
  const [manualZoom, setManualZoom] = useState(1);
  const [mapOffset, setMapOffset] = useState({ x: 0, y: 0 });
  const dragStart = useRef<{ x: number; y: number } | null>(null);
  const selectedFeature =
    selectedId === "all"
      ? null
      : vietnamMapFeatures.find((feature) => feature.id === selectedId) ?? null;
  const selectedFacilities = selectedId === "all"
    ? regionalFacilities
    : regionalFacilities.filter((facility) => facility.province === selectedId);
  const mapScale = (selectedFeature ? 2.65 : 1) * manualZoom;
  const mapTranslate = selectedFeature
    ? `translate(${600 - selectedFeature.labelX * mapScale + mapOffset.x} ${620 - selectedFeature.labelY * mapScale + mapOffset.y}) scale(${mapScale})`
    : `translate(${mapOffset.x} ${mapOffset.y}) scale(${mapScale})`;
  const chooseRegion = (id: string) => {
    setSelectedId(id);
    setManualZoom(1);
    setMapOffset({ x: 0, y: 0 });
  };
  const changeZoom = (amount: number) => {
    setManualZoom((value) => Math.min(2.4, Math.max(0.7, value + amount)));
  };

  return (
    <section className="border-y border-border bg-[#edf8f8]">
      <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-24">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="mono-label font-semibold text-primary">Mạng lưới cơ sở</p>
            <h2 className="display-tight mt-3 text-4xl font-extrabold leading-tight md:text-5xl">
              <span className="text-primary">Bản đồ</span>
            </h2>
            <p className="mt-5 text-base leading-7 text-muted-foreground">
              Chọn một tỉnh/thành để bản đồ tự phóng to và danh sách cơ sở bên cạnh
              được lọc theo khu vực đó.
            </p>
          </div>
          <label className="w-full max-w-sm">
            <span className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">
              Chọn tỉnh / thành phố
            </span>
            <select
              value={selectedId}
              onChange={(event) => chooseRegion(event.target.value)}
              className="focus-ring h-12 w-full rounded-xl border border-primary/15 bg-white px-4 text-sm font-bold text-foreground shadow-sm"
              data-testid="select-home-region"
            >
              <option value="all">Tất cả tỉnh / thành phố</option>
              {vietnamMapFeatures.map((feature) => (
                <option key={feature.id} value={feature.id}>
                  {feature.fullName}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="mt-8 grid items-start overflow-hidden rounded-[1.75rem] border border-[#b8dddd] bg-white shadow-xl shadow-primary/10 lg:grid-cols-[1.15fr_.85fr]">
          <div
            className="relative h-[28rem] overflow-hidden border-b border-[#dceeee] bg-[#effbfc] lg:h-[34rem] lg:border-b-0 lg:border-r"
            onWheel={(event) => {
              event.preventDefault();
              changeZoom(event.deltaY < 0 ? 0.12 : -0.12);
            }}
            onPointerDown={(event) => {
              dragStart.current = { x: event.clientX, y: event.clientY };
              event.currentTarget.setPointerCapture(event.pointerId);
            }}
            onPointerMove={(event) => {
              if (!dragStart.current) return;
              const dx = event.clientX - dragStart.current.x;
              const dy = event.clientY - dragStart.current.y;
              dragStart.current = { x: event.clientX, y: event.clientY };
              setMapOffset((offset) => ({
                x: offset.x + dx * 1.35,
                y: offset.y + dy * 1.35,
              }));
            }}
            onPointerUp={() => {
              dragStart.current = null;
            }}
            onPointerCancel={() => {
              dragStart.current = null;
            }}
            style={{ touchAction: "none", cursor: dragStart.current ? "grabbing" : "grab" }}
          >
            <div className="absolute left-5 top-5 z-10 rounded-xl border border-white/80 bg-white/90 px-3 py-2 text-[11px] font-bold text-primary shadow-sm backdrop-blur">
              <span className="mr-2 inline-block h-2 w-2 rounded-full bg-primary align-middle" />
              Kéo để di chuyển · cuộn để zoom
            </div>
            <div className="absolute bottom-5 right-5 z-10 flex overflow-hidden rounded-xl border border-white/80 bg-white/95 shadow-sm backdrop-blur">
              <button
                type="button"
                className="flex h-9 w-9 items-center justify-center text-lg font-bold text-primary transition-colors hover:bg-secondary"
                onClick={() => changeZoom(0.18)}
                aria-label="Phóng to bản đồ"
                data-testid="button-map-zoom-in"
              >
                +
              </button>
              <button
                type="button"
                className="flex h-9 w-9 items-center justify-center border-l border-border text-lg font-bold text-primary transition-colors hover:bg-secondary"
                onClick={() => changeZoom(-0.18)}
                aria-label="Thu nhỏ bản đồ"
                data-testid="button-map-zoom-out"
              >
                −
              </button>
              <button
                type="button"
                className="border-l border-border px-3 text-[11px] font-bold text-muted-foreground transition-colors hover:bg-secondary"
                onClick={() => {
                  setManualZoom(1);
                  setMapOffset({ x: 0, y: 0 });
                }}
                aria-label="Đặt lại bản đồ"
              >
                Đặt lại
              </button>
            </div>
            <svg
              viewBox={vietnamMapViewBox}
              className="h-full w-full p-5"
              role="img"
              aria-label="Bản đồ Việt Nam theo ranh giới tỉnh thành"
            >
              <g transform={mapTranslate}>
                {vietnamMapFeatures.map((feature) => {
                  const isSelected = selectedId === feature.id;
                  return (
                    <path
                      key={feature.id}
                      d={feature.path}
                      fill={feature.color}
                      fillOpacity={selectedId === "all" || isSelected ? 0.9 : 0.25}
                      stroke={isSelected ? "#123d36" : "#ffffff"}
                      strokeWidth={isSelected ? 2.8 : 1.35}
                      vectorEffect="non-scaling-stroke"
                      className="cursor-pointer transition-[fill-opacity,stroke] duration-300 hover:brightness-105"
                      onPointerDown={(event) => {
                        event.stopPropagation();
                        chooseRegion(feature.id);
                      }}
                      onClick={() => chooseRegion(feature.id)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          setSelectedId(feature.id);
                        }
                      }}
                      role="button"
                      tabIndex={0}
                      aria-label={`Chọn ${feature.fullName}`}
                    >
                      <title>{feature.fullName}</title>
                    </path>
                  );
                })}
                {selectedFeature && (
                  <text
                    x={selectedFeature.labelX}
                    y={selectedFeature.labelY}
                    textAnchor="middle"
                    className="fill-[#123d36] text-[12px] font-extrabold"
                    style={{ paintOrder: "stroke", stroke: "white", strokeWidth: 3 }}
                  >
                    {selectedFeature.name}
                  </text>
                )}
              </g>
            </svg>
            <div className="absolute right-5 top-5 rounded-xl border border-white/80 bg-white/90 px-3 py-2 text-xs font-bold text-muted-foreground shadow-sm backdrop-blur">
              {selectedFeature ? "Đã phóng to khu vực" : "Bản đồ tổng quan"}
            </div>
          </div>

          <div className="flex max-h-[28rem] min-h-[28rem] flex-col bg-white lg:max-h-[34rem] lg:min-h-[34rem]">
            <div className="border-b border-border px-6 py-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">
                    Danh sách cơ sở
                  </p>
                  <h3 className="mt-2 text-xl font-extrabold">
                    {selectedFeature?.name ?? "Toàn quốc"}
                  </h3>
                </div>
                <span className="rounded-full bg-secondary px-3 py-1.5 text-xs font-extrabold text-primary">
                  {selectedFacilities.length} cơ sở
                </span>
              </div>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {selectedFeature
                  ? `Các cơ sở đang được công khai tại ${selectedFeature.fullName}.`
                  : "Các cơ sở mẫu đang được công khai trên cổng thông tin."}
              </p>
            </div>
            <div className="flex-1 overflow-y-auto">
              {selectedFacilities.length ? (
                <div className="divide-y divide-border">
                  {selectedFacilities.map((facility) => (
                    <button
                      type="button"
                      key={facility.id}
                      className="group block w-full px-6 py-5 text-left transition-colors hover:bg-secondary/45"
                      onClick={() =>
                        navigate(`/lookup?record=${encodeURIComponent(facility.id)}`)
                      }
                      data-testid={`button-regional-facility-${facility.id}`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <h4 className="text-sm font-extrabold leading-6">
                          {facility.name}
                        </h4>
                        <span className="mt-1 shrink-0 text-primary transition-transform group-hover:translate-x-1">
                          <ArrowUpRight size={16} />
                        </span>
                      </div>
                      <p className="mt-2 text-xs font-semibold text-primary">
                        {facility.type}
                      </p>
                      <p className="mt-2 flex items-start gap-2 text-xs leading-5 text-muted-foreground">
                        <MapPin size={14} className="mt-0.5 shrink-0" />
                        {facility.address}
                      </p>
                      <span className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-bold text-muted-foreground">
                        <span className={`h-1.5 w-1.5 rounded-full ${facility.status === "Đang hoạt động" ? "bg-emerald-500" : "bg-primary"}`} />
                        {facility.status}
                      </span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="flex h-full min-h-[18rem] items-center justify-center px-8 text-center">
                  <div>
                    <MapPin className="mx-auto text-primary/50" size={30} />
                    <p className="mt-4 text-sm font-bold">Chưa có dữ liệu mẫu</p>
                    <p className="mt-2 text-xs leading-5 text-muted-foreground">
                      Khu vực này đã có trên bản đồ. Danh sách sẽ hiển thị khi
                      dữ liệu cơ sở được cập nhật.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function HomePage() {
  const facilityAccount =
    sessionStorage.getItem("attp-session-role") === "facility";
  const accountAction = facilityAccount
    ? {
        href: "/facility/profile",
        title: "Hồ sơ cơ sở",
        text: "Xem lại toàn bộ thông tin đã đăng ký và cập nhật khi có yêu cầu bổ sung.",
      }
    : {
        href: "/register",
        title: "Nộp hồ sơ trực tuyến",
        text: "Ba luồng đăng ký riêng cho nhà cung cấp, đơn vị suất ăn và cơ sở giáo dục.",
      };
  return (
    <PublicShell>
      <main>
        <section className="portal-grid relative overflow-hidden border-b border-border">
          <div className="mx-auto grid max-w-7xl gap-14 px-5 py-20 lg:grid-cols-[1.02fr_.98fr] lg:items-center lg:px-8 lg:py-28">
            <div className="rise-in">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-card/80 px-3.5 py-2 text-xs font-bold text-primary shadow-sm">
                <span className="status-dot bg-primary" /> CỔNG THÔNG TIN CHÍNH
                THỨC
              </div>
              <h2 className="display-tight text-4xl font-extrabold leading-[1.05] tracking-tight md:text-6xl lg:text-[4.8rem]">
                Sở An Toàn Thực Phẩm.
                <br />
                <span className="text-primary">Thành Phố Hồ Chí Minh.</span>
              </h2>
              <p className="mt-8 max-w-xl text-base leading-8 text-muted-foreground md:text-lg">
                Tra cứu nhanh các cơ sở, sản phẩm và hoạt động quảng cáo đã được
                Sở An toàn thực phẩm Thành phố Hồ Chí Minh công khai.
              </p>
              <div className="mt-10 flex flex-wrap gap-3">
                <ButtonLink href="/lookup">Bắt đầu tra cứu</ButtonLink>
                <ButtonLink href={accountAction.href} variant="outline">
                  {facilityAccount ? "Hồ sơ cơ sở" : "Đăng ký hồ sơ"}
                </ButtonLink>
              </div>
              <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-semibold text-muted-foreground">
                <span className="flex items-center gap-2">
                  <span className="status-dot bg-accent" /> Dữ liệu chính thức
                </span>
                <span className="flex items-center gap-2">
                  <span className="status-dot bg-primary" /> Cập nhật minh bạch
                </span>
              </div>
            </div>
            <div className="relative flex items-center justify-center lg:-mr-10 lg:justify-end">
              <img
                src={heroFoodImage}
                alt="Mâm thực phẩm tươi ngon với rau củ, trái cây và các loại hạt"
                className="relative w-full max-w-[min(44rem,calc(100%+4rem))] scale-[1.06] mix-blend-multiply rotate-1 object-contain transition-transform duration-500 hover:rotate-0 hover:scale-[1.1]"
                data-testid="img-home-hero-food"
              />
            </div>
          </div>
        </section>
        <HomeRegionalDirectory />
        <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-24">
          <SectionHeading
            eyebrow="Ba thao tác, một điểm đến"
            title="Dịch vụ được thiết kế cho đời sống thật."
            description="Từ một bữa ăn tại trường đến lựa chọn sản phẩm trong gia đình, thông tin chính thức luôn ở gần bạn."
          />
          <div className="grid gap-5 md:grid-cols-3">
            <HomeFeature
              icon={Search}
              number="01"
              title="Tra cứu công khai"
              text="Tìm theo tên, địa chỉ hoặc nhóm dữ liệu. Kết quả hiển thị tình trạng và ngày công bố."
              href="/lookup"
            />
            <HomeFeature
              icon={Send}
              number="02"
              title={accountAction.title}
              text={accountAction.text}
              href={accountAction.href}
            />
            <HomeFeature
              icon={ClipboardCheck}
              number="03"
              title="Quy trình có trách nhiệm"
              text="Mỗi hồ sơ được đối chiếu thông tin, minh chứng và lưu dấu quyết định của cán bộ chuyên môn."
              href="/admin"
            />
          </div>
        </section>
        <HomeLookupSection />
      </main>
    </PublicShell>
  );
}

function HomeFeature({
  icon: Icon,
  number,
  title,
  text,
  href,
}: {
  icon: typeof Search;
  number: string;
  title: string;
  text: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="lift group rounded-[1.5rem] border border-border bg-card/85 p-7 shadow-sm backdrop-blur-sm"
      data-testid={`link-feature-${number}`}
    >
      <div className="flex items-center justify-between">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary font-mono text-xs font-bold text-primary">
          {number}
        </span>
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-secondary text-primary transition-all group-hover:bg-primary group-hover:text-primary-foreground">
          <Icon
            size={21}
            className="transition-transform group-hover:scale-110"
          />
        </span>
      </div>
      <h3 className="mt-12 text-lg font-extrabold">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">{text}</p>
      <span className="mt-6 inline-flex items-center gap-1 text-sm font-bold text-primary">
        Khám phá <ArrowUpRight size={15} />
      </span>
    </Link>
  );
}

function HomeLookupSection() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<PublicRecord | null>(null);
  const data = getPublicRecords(search).slice(0, 3);

  return (
    <section className="border-y border-border bg-secondary/30">
      <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-24">
        <SectionHeading
          eyebrow="Tra cứu nhanh"
          title="Tìm thông tin công khai ngay trên trang tổng quan."
          description="Nhập tên cơ sở hoặc sản phẩm để xem nhanh các kết quả mới nhất."
          action={
            <Link
              href="/lookup"
              className="inline-flex items-center gap-2 text-sm font-bold text-primary"
            >
              Xem toàn bộ dữ liệu <ArrowUpRight size={16} />
            </Link>
          }
        />
        <div className="rounded-[1.5rem] border border-primary/10 bg-card p-3 shadow-xl shadow-primary/5">
          <div className="flex flex-col gap-3 rounded-2xl bg-secondary/40 p-2 lg:flex-row">
            <label className="relative flex-1">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                size={18}
              />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Tìm theo tên, địa chỉ..."
                className="focus-ring h-12 w-full rounded-xl border border-input bg-background pl-11 pr-4 text-sm"
                data-testid="input-home-public-search"
              />
            </label>
          </div>
        </div>
        <div className="mt-6">
          {data.length ? (
            <div className="grid gap-3">
              {data.map((item) => (
                <RecordRow
                  key={item.id}
                  item={item}
                  onOpen={() => setSelected(item)}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              title="Chưa có kết quả phù hợp"
              description="Thử một từ khóa khác."
            />
          )}
        </div>
        {selected && (
          <RecordDialog record={selected} onClose={() => setSelected(null)} />
        )}
      </div>
    </section>
  );
}

export function LookupPage() {
  const [location] = useLocation();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<string | null>(() => {
    const recordId = new URLSearchParams(window.location.search).get("record");
    return recordId && regionalPublicRecords.some((item) => item.id === recordId)
      ? recordId
      : null;
  });
  const filtered = getPublicRecords(search);
  const pageSize = 8;
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const data = filtered.slice((page - 1) * pageSize, page * pageSize);
  const record = selected
    ? filtered.find((item) => item.id === selected)
    : undefined;
  useEffect(() => {
    const recordId = new URLSearchParams(location.split("?")[1] ?? "").get(
      "record",
    );
    setSelected(
      recordId && regionalPublicRecords.some((item) => item.id === recordId)
        ? recordId
        : null,
    );
  }, [location]);
  return (
    <PublicShell>
      <main className="mx-auto max-w-7xl px-5 py-12 lg:px-8 lg:py-16">
        <SectionHeading
          eyebrow="Danh mục công khai"
          title="Tra cứu dữ liệu an toàn thực phẩm."
          description="Tìm kiếm trong các danh sách đã được Sở công khai. Kết quả được cập nhật theo hồ sơ đã tiếp nhận."
          action={
            <div className="rounded-xl bg-secondary px-4 py-3 text-sm font-semibold text-primary">
              <span className="font-mono">{formatNumber(filtered.length)}</span>{" "}
              bản ghi
            </div>
          }
        />
        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row">
            <label className="relative flex-1">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                size={18}
              />
              <input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Tìm theo tên, địa chỉ..."
                className="focus-ring h-12 w-full rounded-xl border border-input bg-background pl-11 pr-4 text-sm"
                data-testid="input-public-search"
              />
            </label>
            <Button
              onClick={() => {
                setSearch("");
                setPage(1);
              }}
              variant="outline"
              className="h-12 rounded-xl"
              data-testid="button-reset-search"
            >
              Đặt lại
            </Button>
          </div>
        </div>
        <div className="mt-8">
          {data.length ? (
            <div className="grid gap-3">
              {data.map((item) => (
                <RecordRow
                  key={item.id}
                  item={item}
                  onOpen={() => setSelected(item.id)}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              title="Chưa có kết quả phù hợp"
              description="Thử một từ khóa ngắn hơn."
            />
          )}
        </div>
        {data.length ? (
          <div className="mt-8 flex items-center justify-between border-t border-border pt-5">
            <p className="text-sm text-muted-foreground">
              Trang <strong className="text-foreground">{page}</strong> /{" "}
              {totalPages}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                data-testid="button-page-prev"
              >
                <ChevronLeft size={18} />
              </Button>
              <Button
                variant="outline"
                size="icon"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                data-testid="button-page-next"
              >
                <ChevronRight size={18} />
              </Button>
            </div>
          </div>
        ) : null}
      </main>
      {record && (
        <RecordDialog record={record} onClose={() => setSelected(null)} />
      )}
    </PublicShell>
  );
}

const newsCategoryNames: Record<NewsCategory | "all", string> = {
  all: "Tất cả",
  activity: "Tin hoạt động",
  event: "Sự kiện",
};

export function NewsPage() {
  const [category, setCategory] = useState<NewsCategory | "all">("all");
  const [search, setSearch] = useState("");
  const featured = newsItems[0];
  const filtered = newsItems.filter((item) => {
    const matchesCategory = category === "all" || item.category === category;
    const matchesSearch =
      !search ||
      `${item.title} ${item.excerpt}`
        .toLowerCase()
        .includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <PublicShell>
      <main>
        <section className="portal-grid border-b border-border">
          <div className="mx-auto max-w-7xl px-5 py-14 lg:px-8 lg:py-20">
            <div className="max-w-3xl rise-in">
              <p className="mono-label font-semibold text-primary">
                Cập nhật từ Sở
              </p>
              <h1 className="display-tight mt-4 text-4xl font-extrabold leading-tight md:text-6xl">
                Tin tức & <span className="text-primary">sự kiện.</span>
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-muted-foreground md:text-lg">
                Những hoạt động mới nhất về quản lý, tập huấn và phối hợp bảo
                đảm an toàn thực phẩm trên địa bàn Thành phố Hồ Chí Minh.
              </p>
            </div>
            <div className="mt-10 grid gap-5 overflow-hidden rounded-[1.75rem] border border-primary/10 bg-card shadow-xl shadow-primary/5 lg:grid-cols-[1.08fr_.92fr]">
              <div className="relative min-h-[19rem] overflow-hidden lg:min-h-[23rem]">
                <img
                  src={getNewsImage(featured.image)}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#123d36]/90 via-[#123d36]/15 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white md:p-8">
                  <span className="inline-flex rounded-full bg-[#f4c95d] px-3 py-1.5 text-xs font-extrabold text-[#123d36]">
                    Tin mới nhất
                  </span>
                  <h2 className="mt-4 max-w-2xl text-2xl font-extrabold leading-tight md:text-3xl">
                    {featured.title}
                  </h2>
                  <Link
                    href={`/news/${featured.slug}`}
                    className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#f4c95d] hover:text-white"
                    data-testid="link-featured-news"
                  >
                    Đọc bài viết <ArrowUpRight size={16} />
                  </Link>
                </div>
              </div>
              <div className="flex flex-col justify-center p-6 md:p-8">
                <div className="flex items-center gap-2 text-sm font-bold text-primary">
                  <Newspaper size={18} /> Đáng chú ý
                </div>
                <p className="mt-5 text-lg font-bold leading-8">
                  Kết nối thông tin chính thức với cộng đồng cơ sở, nhà trường
                  và người dân.
                </p>
                <p className="mt-4 text-sm leading-7 text-muted-foreground">
                  Theo dõi các chương trình tập huấn, khảo sát thực tế và hoạt
                  động phối hợp để chủ động thực hiện đúng quy định.
                </p>
                <div className="mt-7 grid grid-cols-2 gap-3 border-t border-border pt-5">
                  <div>
                    <p className="text-2xl font-extrabold text-primary">
                      {newsItems.length}
                    </p>
                    <p className="mt-1 text-xs font-semibold text-muted-foreground">
                      bài viết mẫu
                    </p>
                  </div>
                  <div>
                    <p className="text-2xl font-extrabold text-primary">09/2026</p>
                    <p className="mt-1 text-xs font-semibold text-muted-foreground">
                      cập nhật gần nhất
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="mx-auto max-w-7xl px-5 py-14 lg:px-8 lg:py-20">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mono-label font-semibold text-primary">Thư viện nội dung</p>
              <h2 className="display-tight mt-3 text-3xl font-extrabold md:text-4xl">
                Mới đây tại Sở.
              </h2>
            </div>
            <label className="relative block w-full md:w-80">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                size={17}
              />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Tìm trong tin tức..."
                className="focus-ring h-11 w-full rounded-xl border border-input bg-card pl-10 pr-4 text-sm"
                data-testid="input-news-search"
              />
            </label>
          </div>
          <div className="mt-8 flex flex-wrap gap-2" role="tablist" aria-label="Lọc tin tức">
            {(Object.keys(newsCategoryNames) as Array<NewsCategory | "all">).map(
              (item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setCategory(item)}
                  className={`focus-ring rounded-full px-4 py-2.5 text-sm font-bold transition-all ${
                    category === item
                      ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                      : "border border-border bg-card text-muted-foreground hover:border-primary/30 hover:text-primary"
                  }`}
                  role="tab"
                  aria-selected={category === item}
                  data-testid={`button-news-filter-${item}`}
                >
                  {newsCategoryNames[item]}
                </button>
              ),
            )}
          </div>
          {filtered.length ? (
            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((item) => (
                <NewsCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <div className="mt-8">
              <EmptyState
                title="Chưa có tin phù hợp"
                description="Thử một từ khóa khác hoặc chọn lại nhóm nội dung."
              />
            </div>
          )}
        </section>
      </main>
    </PublicShell>
  );
}

function NewsCard({ item }: { item: NewsItem }) {
  return (
    <article className="lift group overflow-hidden rounded-[1.5rem] border border-border bg-card">
      <Link href={`/news/${item.slug}`} data-testid={`link-news-${item.id}`}>
        <div className="relative aspect-[1.65] overflow-hidden bg-secondary">
          <img
            src={getNewsImage(item.image)}
            alt=""
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <span className="absolute left-4 top-4 rounded-full bg-background/90 px-3 py-1.5 text-[11px] font-extrabold text-primary shadow-sm backdrop-blur">
            {newsCategoryNames[item.category]}
          </span>
        </div>
        <div className="p-5">
          <div className="flex items-center gap-3 text-xs font-semibold text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <CalendarDays size={14} className="text-primary" />
              {formatDate(item.publishedAt)}
            </span>
            <span className="flex items-center gap-1.5">
              <Eye size={14} /> {formatNumber(item.views)}
            </span>
          </div>
          <h3 className="mt-4 line-clamp-3 text-lg font-extrabold leading-7 group-hover:text-primary">
            {item.title}
          </h3>
          <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground">
            {item.excerpt}
          </p>
          <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-primary">
            Đọc tiếp <ArrowUpRight size={15} />
          </span>
        </div>
      </Link>
    </article>
  );
}

export function NewsDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const item = newsItems.find((news) => news.slug === slug);

  if (!item) {
    return <NotFound />;
  }

  return (
    <PublicShell>
      <main className="mx-auto max-w-5xl px-5 py-12 lg:px-8 lg:py-16">
        <Link
          href="/news"
          className="focus-ring inline-flex items-center gap-2 text-sm font-bold text-primary"
          data-testid="link-back-news"
        >
          <ArrowLeft size={16} /> Tất cả tin tức
        </Link>
        <article className="mt-8">
          <div className="flex flex-wrap items-center gap-3 text-xs font-bold text-primary">
            <span className="rounded-full bg-secondary px-3 py-1.5">
              {newsCategoryNames[item.category]}
            </span>
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <CalendarDays size={14} /> {formatDate(item.publishedAt)}
            </span>
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <Eye size={14} /> {formatNumber(item.views)} lượt xem
            </span>
          </div>
          <h1 className="display-tight mt-6 max-w-4xl text-4xl font-extrabold leading-tight md:text-6xl">
            {item.title}
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-muted-foreground">
            {item.excerpt}
          </p>
          <div className="mt-8 overflow-hidden rounded-[1.75rem] border border-border bg-secondary">
            <img
              src={getNewsImage(item.image)}
              alt=""
              className="aspect-[2/1] w-full object-cover md:aspect-[2.2/1]"
            />
          </div>
          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_18rem]">
            <div className="prose prose-lg max-w-none text-foreground">
              {item.content.split(". ").map((paragraph, index) => (
                <p key={`${item.id}-paragraph-${index}`}>
                  {paragraph}
                  {index < item.content.split(". ").length - 1 ? "." : ""}
                </p>
              ))}
            </div>
            <aside className="h-fit rounded-2xl border border-primary/10 bg-secondary/60 p-5">
              <p className="mono-label font-semibold text-primary">Thông tin bài viết</p>
              <div className="mt-5 space-y-4 text-sm">
                <div className="flex items-start gap-3">
                  <Clock3 size={17} className="mt-0.5 shrink-0 text-primary" />
                  <span>
                    <strong className="block">Thời gian đọc</strong>
                    <span className="text-muted-foreground">{item.readTime}</span>
                  </span>
                </div>
                {item.location && (
                  <div className="flex items-start gap-3">
                    <MapPin size={17} className="mt-0.5 shrink-0 text-primary" />
                    <span>
                      <strong className="block">Địa điểm</strong>
                      <span className="text-muted-foreground">{item.location}</span>
                    </span>
                  </div>
                )}
              </div>
            </aside>
          </div>
        </article>
      </main>
    </PublicShell>
  );
}

function LoadingRows() {
  return (
    <div className="space-y-3">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="h-28 animate-pulse rounded-2xl bg-muted" />
      ))}
    </div>
  );
}
function RecordRow({
  item,
  onOpen,
}: {
  item: PublicRecord;
  onOpen: () => void;
}) {
  return (
    <button
      onClick={onOpen}
      className="lift focus-ring flex w-full flex-col gap-4 rounded-2xl border border-border bg-card p-5 text-left sm:flex-row sm:items-center sm:justify-between"
      data-testid={`button-record-${item.id}`}
    >
      <div className="flex min-w-0 items-start gap-4">
        <div className="mt-1 hidden h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary sm:flex">
          <Building2 size={19} />
        </div>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="mono-label text-primary">
              {categoryNames[item.category] ?? item.category}
            </span>
            <StatusPill status={item.status} />
          </div>
          <h3 className="mt-2 truncate text-base font-bold">{item.title}</h3>
          <p className="mt-1 truncate text-sm text-muted-foreground">
            {item.subtitle}
          </p>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-3 text-sm text-muted-foreground">
        <span className="flex items-center gap-1">
          <MapPin size={14} />
          {item.location}
        </span>
        <ArrowUpRight size={17} className="text-primary" />
      </div>
    </button>
  );
}
function RecordDialog({
  record,
  onClose,
}: {
  record: PublicRecord;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-primary/30 p-0 backdrop-blur-sm sm:items-center sm:p-5"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-2xl overflow-auto rounded-t-3xl border border-border bg-card p-6 shadow-2xl sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        data-testid="dialog-record-detail"
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="mono-label text-primary">
              {categoryNames[record.category]}
            </p>
            <h2 className="mt-2 text-2xl font-extrabold">{record.title}</h2>
          </div>
          <button
            className="focus-ring rounded-lg p-2 hover:bg-muted"
            onClick={onClose}
            aria-label="Đóng chi tiết"
            data-testid="button-close-record"
          >
            <X size={19} />
          </button>
        </div>
        <div className="mt-5 grid gap-3 rounded-2xl bg-secondary/60 p-4 text-sm sm:grid-cols-2">
          <p>
            <span className="block text-xs text-muted-foreground">Địa chỉ</span>
            <strong>{record.location}</strong>
          </p>
          <p>
            <span className="block text-xs text-muted-foreground">
              Ngày công bố
            </span>
            <strong>{formatDate(record.publishedAt)}</strong>
          </p>
          <p>
            <span className="block text-xs text-muted-foreground">
              Trạng thái
            </span>
            <StatusPill status={record.status} />
          </p>
        </div>
        <div className="mt-6">
          <h3 className="font-bold">Thông tin hồ sơ</h3>
          <dl className="mt-3 divide-y divide-border">
            {Object.entries(record.metadata ?? {}).map(([key, value]) => (
              <div
                key={key}
                className="flex justify-between gap-5 py-3 text-sm"
              >
                <dt className="text-muted-foreground">{key}</dt>
                <dd className="text-right font-semibold">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}

export function RegisterPage() {
  if (sessionStorage.getItem("attp-session-role") === "facility")
    return <FacilityProfilePage />;
  return (
    <PublicShell>
      <main className="mx-auto max-w-7xl px-5 py-12 lg:px-8 lg:py-16">
        <ApplicationForm />
      </main>
    </PublicShell>
  );
}

export function AdminLoginPage() {
  const [, navigate] = useLocation();
  const [username, setUsername] = useState("canbo.demo");
  const [password, setPassword] = useState("");
  const [notice, setNotice] = useState("");

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!username.trim() || !password.trim()) {
      setNotice("Vui lòng nhập tên đăng nhập và mật khẩu.");
      return;
    }
    const role = inferAccountRole(username);
    const normalizedUsername = username.trim().toLowerCase();
    const facilityAccount = readFacilityAccounts().find(
      (account) =>
        account.email.toLowerCase() === normalizedUsername ||
        account.username.toLowerCase() === normalizedUsername,
    );
    if (
      role === "facility" &&
      normalizedUsername !== "coso.demo" &&
      (!facilityAccount || facilityAccount.password !== password)
    ) {
      setNotice("Email/tài khoản hoặc mật khẩu cơ sở chưa đúng.");
      return;
    }
    sessionStorage.setItem("attp-session-role", role);
    if (role === "admin") {
      sessionStorage.setItem("attp-reviewer-session", "active");
      navigate("/admin");
    } else {
      sessionStorage.removeItem("attp-reviewer-session");
      sessionStorage.setItem(
        "attp-session-username",
        facilityAccount?.username || username.trim(),
      );
      navigate("/facility/profile");
    }
  };

  return (
    <PublicShell>
      <main className="portal-grid min-h-[calc(100dvh-170px)] px-5 py-12 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-xl overflow-hidden rounded-[2rem] border border-border bg-card shadow-2xl shadow-primary/10">
          <div className="p-8 lg:p-12">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary text-primary">
              <ShieldCheck size={24} />
            </div>
            <p className="mono-label mt-7 text-primary">ĐĂNG NHẬP HỆ THỐNG</p>
            <h2 className="mt-2 text-3xl font-extrabold">Đăng nhập</h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Chọn đúng loại tài khoản để vào khu vực làm việc tương ứng.
            </p>
            <form onSubmit={submit} className="mt-8 space-y-5">
              <label className="block">
                <span className="mb-2 block text-sm font-semibold">
                  Tên đăng nhập hoặc email
                </span>
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                  className="focus-ring h-12 w-full rounded-xl border border-input bg-background px-4 text-sm"
                  data-testid="input-reviewer-username"
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-semibold">
                  Mật khẩu
                </span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  placeholder="Nhập mật khẩu"
                  className="focus-ring h-12 w-full rounded-xl border border-input bg-background px-4 text-sm"
                  data-testid="input-reviewer-password"
                />
              </label>
              {notice && (
                <p
                  className="rounded-xl bg-red-50 px-3 py-2 text-sm font-semibold text-red-800"
                  role="alert"
                  data-testid="status-login-error"
                >
                  {notice}
                </p>
              )}
              <Button
                type="submit"
                className="h-12 w-full rounded-xl"
                data-testid="button-reviewer-login"
              >
                <LogIn size={17} /> Đăng nhập
              </Button>
            </form>
            <p className="mt-5 rounded-xl bg-secondary/70 p-3 text-xs leading-5 text-muted-foreground">
              <strong className="text-foreground">Bản mẫu:</strong> dùng tên
              `canbo.demo` để vào Admin hoặc `coso.demo` để vào portal cơ sở.
              Khi vận hành thật, hệ thống sẽ nhận diện vai trò từ tài khoản được
              cấp.
            </p>
            <Link
              href="/"
              className="focus-ring mt-6 inline-flex items-center gap-2 text-sm font-bold text-primary"
              data-testid="link-back-public-login"
            >
              <ArrowLeft size={16} /> Về cổng công khai
            </Link>
          </div>
        </div>
      </main>
    </PublicShell>
  );
}

function LegacyFacilityProfilePage() {
  type FacilityProfile = {
    name: string;
    taxCode: string;
    address: string;
    addressProvince: string;
    addressWard: string;
    addressDetail: string;
    representative: string;
    phone: string;
    email: string;
    licenseNumber: string;
    licenseIssued: string;
    licenseExpires: string;
    productGroups: string;
    origin: string;
    safetyOfficer: string;
    operatingHours: string;
    notes: string;
  };
  const defaultProfile: FacilityProfile = {
    name: "Công ty TNHH Nông sản An Phú",
    taxCode: "0312345678",
    address: "184 Nguyễn Văn Linh, Quận 7, TP.HCM",
    addressProvince: "TP. Hồ Chí Minh",
    addressWard: "Phường Tân Phong",
    addressDetail: "184 Nguyễn Văn Linh",
    representative: "Nguyễn Hoàng Anh",
    phone: "0908 123 456",
    email: "",
    licenseNumber: "ATTP-2026-088",
    licenseIssued: "2026-06-12",
    licenseExpires: "2027-06-12",
    productGroups: "Rau củ quả, Thịt gia súc",
    origin: "Hợp tác xã rau sạch Củ Chi",
    safetyOfficer: "Lê Minh Trang",
    operatingHours: "06:00 - 17:00",
    notes: "",
  };
  const accountName =
    sessionStorage.getItem("attp-session-username") || "coso.demo";
  const profileStorageKey = `attp-facility-profile:${accountName}`;
  const attachmentStorageKey = `attp-facility-attachments:${accountName}`;
  const [profile, setProfile] = useState<FacilityProfile>(() => {
    const saved =
      sessionStorage.getItem(profileStorageKey) ||
      (accountName === "coso.demo"
        ? sessionStorage.getItem("attp-facility-profile")
        : null);
    if (!saved) return defaultProfile;
    try {
      return { ...defaultProfile, ...JSON.parse(saved) };
    } catch {
      return defaultProfile;
    }
  });
  const [attachments, setAttachments] = useState<string[]>(() => {
    const saved =
      sessionStorage.getItem(attachmentStorageKey) ||
      (accountName === "coso.demo"
        ? sessionStorage.getItem("attp-facility-attachments")
        : null);
    if (!saved)
      return ["giay-phep-attp.pdf", "giay-dkkd.pdf", "kho-bao-quan-01.jpg"];
    try {
      return JSON.parse(saved);
    } catch {
      return ["giay-phep-attp.pdf", "giay-dkkd.pdf", "kho-bao-quan-01.jpg"];
    }
  });
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const update = (key: keyof FacilityProfile, value: string) =>
    setProfile((current: FacilityProfile) => ({ ...current, [key]: value }));
  const addAttachments = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files ?? []);
    const invalid = selectedFiles.find(
      (file) =>
        !["application/pdf", "image/jpeg", "image/png"].includes(file.type) ||
        file.size > 5 * 1024 * 1024,
    );
    if (invalid) {
      setError("Chỉ nhận tệp PDF, JPG, PNG và mỗi tệp không quá 5MB.");
      event.target.value = "";
      return;
    }
    setAttachments((current) => [
      ...current,
      ...selectedFiles
        .map((file) => file.name)
        .filter((name) => !current.includes(name)),
    ]);
    event.target.value = "";
    setError("");
  };
  const removeAttachment = (name: string) =>
    setAttachments((current) => current.filter((file) => file !== name));
  const submit = (event: FormEvent) => {
    event.preventDefault();
    const required: Array<keyof FacilityProfile> = [
      "name",
      "taxCode",
      "addressProvince",
      "addressWard",
      "addressDetail",
      "representative",
      "phone",
      "licenseNumber",
      "licenseIssued",
      "licenseExpires",
      "productGroups",
    ];
    if (required.some((key) => !profile[key].trim())) {
      setError("Vui lòng điền đầy đủ các trường bắt buộc trước khi lưu.");
      setNotice("");
      return;
    }
    const nextProfile = {
      ...profile,
      address: [
        profile.addressDetail,
        profile.addressWard,
        profile.addressProvince,
      ]
        .filter(Boolean)
        .join(", "),
    };
    setProfile(nextProfile);
    sessionStorage.setItem(profileStorageKey, JSON.stringify(nextProfile));
    sessionStorage.setItem("attp-facility-profile", JSON.stringify(nextProfile));
    sessionStorage.setItem(attachmentStorageKey, JSON.stringify(attachments));
    sessionStorage.setItem(
      "attp-facility-attachments",
      JSON.stringify(attachments),
    );
    setError("");
    setNotice(
      "Thông tin bổ sung đã được lưu và chuyển tới cán bộ chuyên môn rà soát.",
    );
  };

  return (
    <PublicShell>
      <main className="mx-auto max-w-6xl px-5 py-9 lg:px-8 lg:py-12">
        <SectionHeading
          eyebrow={`Tài khoản cơ sở · ${accountName}`}
          title="Hồ sơ cơ sở"
          description="Thông tin này được lấy từ hồ sơ đã đăng ký. Bạn có thể cập nhật lại khi có thay đổi hoặc nhận yêu cầu bổ sung."
          action={<StatusPill status="pending" />}
        />
        <div className="mb-6 flex items-start gap-3 rounded-2xl border border-orange-200 bg-orange-50 p-4 text-sm text-orange-950">
          <Bell className="mt-0.5 shrink-0" size={19} />
          <p>
            <strong>Thông báo hồ sơ</strong>
            <br />
            Cán bộ chuyên môn yêu cầu rà soát lại ảnh khu vực bảo quản trước khi
            hồ sơ được duyệt.
          </p>
        </div>
        <form onSubmit={submit} className="space-y-6">
          <FormSection title="Thông tin pháp nhân" icon={Building2}>
            <div className="grid gap-4 md:grid-cols-2">
              <Field
                label="Tên cơ sở *"
                value={profile.name}
                onChange={(value) => update("name", value)}
                test="input-facility-name"
                wide
              />
              <Field
                label="Mã số thuế *"
                value={profile.taxCode}
                onChange={(value) => update("taxCode", value)}
                test="input-facility-tax-code"
              />
              <SelectField
                label="Chọn Tỉnh / Thành phố *"
                value={profile.addressProvince}
                onChange={(value) => update("addressProvince", value)}
                options={addressProvinceOptions}
                test="select-facility-address-province"
              />
              <SelectField
                label="Chọn Xã / Phường *"
                value={profile.addressWard}
                onChange={(value) => update("addressWard", value)}
                options={addressWardOptions}
                test="select-facility-address-ward"
              />
              <Field
                label="Địa chỉ chi tiết — số nhà, đường/thôn/ấp *"
                value={profile.addressDetail}
                onChange={(value) => update("addressDetail", value)}
                test="input-facility-address-detail"
                wide
              />
              <Field
                label="Người đại diện pháp luật *"
                value={profile.representative}
                onChange={(value) => update("representative", value)}
                test="input-facility-representative"
              />
              <Field
                label="Số điện thoại *"
                value={profile.phone}
                onChange={(value) => update("phone", value)}
                test="input-facility-phone"
              />
              <Field
                label="Email liên hệ"
                value={profile.email}
                onChange={(value) => update("email", value)}
                test="input-facility-email"
                type="email"
              />
            </div>
          </FormSection>
          <FormSection title="Giấy phép & nguồn gốc sản phẩm" icon={FileText}>
            <div className="grid gap-4 md:grid-cols-3">
              <Field
                label="Số giấy phép ATTP *"
                value={profile.licenseNumber}
                onChange={(value) => update("licenseNumber", value)}
                test="input-facility-license-number"
              />
              <Field
                label="Ngày cấp *"
                value={profile.licenseIssued}
                onChange={(value) => update("licenseIssued", value)}
                test="input-facility-license-issued"
                type="date"
              />
              <Field
                label="Ngày hết hạn *"
                value={profile.licenseExpires}
                onChange={(value) => update("licenseExpires", value)}
                test="input-facility-license-expires"
                type="date"
              />
              <Field
                label="Nhóm sản phẩm cung cấp *"
                value={profile.productGroups}
                onChange={(value) => update("productGroups", value)}
                test="input-facility-product-groups"
                wide
              />
              <Field
                label="Vùng trồng / nuôi / khai thác"
                value={profile.origin}
                onChange={(value) => update("origin", value)}
                test="input-facility-origin"
                wide
              />
            </div>
          </FormSection>
          <FormSection title="Thông tin bổ sung" icon={UserRound}>
            <div className="grid gap-4 md:grid-cols-2">
              <Field
                label="Người phụ trách an toàn thực phẩm"
                value={profile.safetyOfficer}
                onChange={(value) => update("safetyOfficer", value)}
                test="input-facility-safety-officer"
              />
              <Field
                label="Giờ hoạt động"
                value={profile.operatingHours}
                onChange={(value) => update("operatingHours", value)}
                test="input-facility-operating-hours"
              />
              <Field
                label="Ghi chú bổ sung cho cán bộ"
                value={profile.notes}
                onChange={(value) => update("notes", value)}
                test="input-facility-notes"
                wide
                placeholder="Ví dụ: thay đổi địa chỉ kho, bổ sung quy trình bảo quản..."
              />
            </div>
          </FormSection>
          <FormSection title="Tệp hồ sơ" icon={ImagePlus}>
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm text-muted-foreground">
                  Bổ sung tài liệu khi cán bộ yêu cầu. Nhận PDF, JPG, PNG, tối
                  đa 5MB mỗi tệp.
                </p>
                <label className="focus-ring inline-flex cursor-pointer items-center gap-2 rounded-xl border border-primary/25 px-4 py-2.5 text-sm font-bold text-primary hover:bg-secondary">
                  <Plus size={16} /> Thêm tệp
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    multiple
                    className="sr-only"
                    onChange={addAttachments}
                    data-testid="input-facility-attachments"
                  />
                </label>
              </div>
              <div className="space-y-2">
                {attachments.map((file) => (
                  <div
                    key={file}
                    className="flex items-center justify-between gap-3 rounded-xl bg-muted/70 px-3 py-3 text-sm"
                  >
                    <span className="flex min-w-0 items-center gap-2 truncate">
                      <FileText size={16} className="shrink-0 text-primary" />
                      {file}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeAttachment(file)}
                      className="shrink-0 text-xs font-bold text-muted-foreground hover:text-destructive"
                      data-testid={`button-remove-facility-attachment-${file}`}
                    >
                      Xóa
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </FormSection>
          {error && (
            <p
              className="rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-800"
              role="alert"
              data-testid="status-facility-profile-error"
            >
              {error}
            </p>
          )}
          <div className="flex flex-col gap-4 rounded-2xl border border-border bg-secondary/50 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-3 text-sm">
              <LockKeyhole className="mt-0.5 shrink-0 text-primary" size={18} />
              <p>
                <strong>Chỉ cập nhật thông tin cơ sở.</strong>
                <br />
                <span className="text-muted-foreground">
                  Sau khi gửi, thông tin bổ sung sẽ được chuyển lại cho cán bộ
                  chuyên môn rà soát.
                </span>
              </p>
            </div>
            <Button
              type="submit"
              className="h-11 rounded-xl px-6"
              data-testid="button-submit-facility-supplement"
            >
              Gửi bổ sung
            </Button>
          </div>
        </form>
        {notice && <Notice message={notice} onClose={() => setNotice("")} />}
      </main>
    </PublicShell>
  );
}

function FacilityProfileEditor() {
  const accountName =
    sessionStorage.getItem("attp-session-username") || "coso.demo";
  const account = readFacilityAccounts().find(
    (item) =>
      item.username.toLowerCase() === accountName.toLowerCase() ||
      item.email.toLowerCase() === accountName.toLowerCase(),
  );
  const fallbackApplication = applications[0];
  const initialSnapshot: RegistrationSnapshot =
    account?.registration || {
      type: fallbackApplication?.type || "food-supplier",
      fields: (fallbackApplication?.data || {}) as Record<
        string,
        CriteriaValue
      >,
      files: fallbackApplication?.attachments || [],
      submittedAt: "",
    };

  return (
    <PublicShell>
      <main className="mx-auto max-w-7xl px-5 py-9 lg:px-8 lg:py-12">
        <ApplicationForm
          mode="edit"
          account={account}
          initialSnapshot={initialSnapshot}
        />
      </main>
    </PublicShell>
  );
}

export function FacilityProfilePage() {
  return <FacilityProfileEditor />;
}

function ApplicationForm({
  mode = "register",
  account,
  initialSnapshot,
}: {
  mode?: "register" | "edit";
  account?: FacilityAccount | null;
  initialSnapshot?: RegistrationSnapshot;
}) {
  const [type, setType] = useState<ApplicationType>(
    initialSnapshot?.type || "food-supplier",
  );
  const [fields, setFields] = useState<Record<string, CriteriaValue>>(
    initialSnapshot?.fields || {},
  );
  const [files, setFiles] = useState<Attachment[]>(
    initialSnapshot?.files || [],
  );
  const [accountEmail, setAccountEmail] = useState(account?.email || "");
  const [accountPassword, setAccountPassword] = useState("");
  const [accountPasswordConfirm, setAccountPasswordConfirm] = useState("");
  const [notice, setNotice] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [credentials, setCredentials] = useState<{
    email: string;
    password: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);
  const formSet = getCriteriaSet(type);
  const update = (key: string, value: CriteriaValue) =>
    setFields((prev) => ({ ...prev, [key]: value }));
  const changeType = (nextType: ApplicationType) => {
    setType(nextType);
    setFields({});
    setFiles([]);
    setNotice("");
  };
  const addFiles = (event: ChangeEvent<HTMLInputElement>) => {
    const chosen = Array.from(event.target.files ?? []);
    const invalid = chosen.find(
      (file) =>
        !["application/pdf", "image/jpeg", "image/png"].includes(file.type) ||
        file.size > 5 * 1024 * 1024,
    );
    if (invalid) {
      setNotice("Chỉ nhận PDF, JPG, PNG và mỗi tệp không quá 5MB.");
      return;
    }
    setFiles((prev) => [
      ...prev,
      ...chosen.map((file) => ({
        name: file.name,
        kind: file.type,
        size: file.size,
      })),
    ]);
  };
  const addFilesFor = (
    fieldKey: string,
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const chosen = Array.from(event.target.files ?? []);
    const invalid = chosen.find(
      (file) =>
        !["application/pdf", "image/jpeg", "image/png"].includes(file.type) ||
        file.size > 5 * 1024 * 1024,
    );
    if (invalid) {
      setNotice("Chỉ nhận PDF, JPG, PNG và mỗi tệp không quá 5MB.");
      event.target.value = "";
      return;
    }
    setFiles((prev) => [
      ...prev,
      ...chosen.map((file) => ({
        name: file.name,
        kind: file.type,
        size: file.size,
        fieldKey,
      })),
    ]);
    event.target.value = "";
    setNotice("");
  };
  const isVisible = (item: CriteriaDefinition) => {
    if (!item.dependsOn) return true;
    const dependency = fields[item.dependsOn.key];
    const current = Array.isArray(dependency)
      ? dependency[0] ?? ""
      : typeof dependency === "string"
        ? dependency
        : "";
    if (
      item.dependsOn.equals !== undefined &&
      current !== item.dependsOn.equals
    )
      return false;
    if (
      item.dependsOn.notEquals !== undefined &&
      current === item.dependsOn.notEquals
    )
      return false;
    return true;
  };
  const removeFile = (name: string, fieldKey?: string) =>
    setFiles((prev) =>
      prev.filter(
        (file) =>
          !(file.name === name && (!fieldKey || file.fieldKey === fieldKey)),
      ),
    );
  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (mode === "register") {
      if (!accountEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(accountEmail.trim())) {
        setNotice("Vui lòng nhập email hợp lệ để tạo tài khoản cơ sở.");
        return;
      }
      if (accountPassword.length < 6) {
        setNotice("Mật khẩu phải có ít nhất 6 ký tự.");
        return;
      }
      if (accountPassword !== accountPasswordConfirm) {
        setNotice("Mật khẩu xác nhận chưa khớp.");
        return;
      }
      const existingAccount = readFacilityAccounts().some(
        (account) => account.email.toLowerCase() === accountEmail.trim().toLowerCase(),
      );
      if (existingAccount) {
        setNotice("Email này đã được đăng ký. Vui lòng dùng email khác hoặc đăng nhập.");
        return;
      }
    }
    const formFields =
      formSet?.criteria
        .filter((item) => item.active && isVisible(item))
        .sort((a, b) => a.order - b.order) ?? [];
    const missing = formFields.filter((item) => {
      if (!item.required) return false;
      if (item.answerType === "repeatable") {
        const rows = Array.isArray(fields[item.key])
          ? (fields[item.key] as RepeatableValue)
          : [];
        if (rows.length === 0) return true;
        return rows.some((row, index) =>
          (item.repeatableFields ?? []).some((field) => {
            if (!field.required) return false;
            if (field.answerType === "file")
              return !files.some(
                (file) =>
                  file.fieldKey === `${item.key}.${index}.${field.key}`,
              );
            const answer = row[field.key];
            return Array.isArray(answer)
              ? answer.length === 0
              : !String(answer ?? "").trim();
          }),
        );
      }
      if (item.answerType === "file")
        return !files.some((file) => file.fieldKey === item.key);
      const answer = fields[item.key] ?? "";
      return Array.isArray(answer)
        ? answer.length === 0
        : !String(answer).trim();
    });
    if (missing.length) {
      setNotice(
        `Vui lòng hoàn thiện: ${missing
          .slice(0, 3)
          .map((item) => item.label)
          .join(", ")}${missing.length > 3 ? "…" : ""}.`,
      );
      return;
    }
    const data = { ...fields } as Record<string, unknown>;
    formFields
      .filter((item) => item.answerType === "file")
      .forEach((item) => {
        data[item.key] = files
          .filter((file) => file.fieldKey === item.key)
          .map((file) => file.name);
      });
    const asText = (value: CriteriaValue | undefined) => {
      if (typeof value === "string") return value;
      if (Array.isArray(value)) {
        const first = value[0];
        return typeof first === "string" ? first : "";
      }
      return "";
    };
    const input: ApplicationInput = {
      type,
      applicantName: asText(fields.applicantName),
      address: [
        asText(fields.addressDetail),
        asText(fields.addressWard),
        asText(fields.addressProvince),
      ]
        .filter(Boolean)
        .join(", "),
      contact: asText(fields.contact),
      criteriaVersion: formSet?.version ?? "",
      isThirdParty:
        type === "school" &&
        fields.mealModel !== "Tự nấu",
      data,
      attachments: files,
    };
    const snapshot: RegistrationSnapshot = {
      type,
      fields: data as Record<string, CriteriaValue>,
      files,
      submittedAt: new Date().toISOString().slice(0, 10),
    };
    if (mode === "register") {
      const email = accountEmail.trim().toLowerCase();
      const accountRecord: FacilityAccount = {
        email,
        password: accountPassword,
        username: email,
        registration: snapshot,
      };
      saveFacilityAccounts([...readFacilityAccounts(), accountRecord]);
      setCredentials({ email, password: accountPassword });
    } else if (account) {
      saveFacilityAccounts(
        readFacilityAccounts().map((item) =>
          item.username === account.username
            ? { ...item, registration: snapshot }
            : item,
        ),
      );
    }
    void input;
    setSubmitted(true);
    setNotice(
      mode === "register"
        ? "Đăng ký thành công. Hãy lưu lại tài khoản và mật khẩu bên dưới."
        : "Hồ sơ đã được cập nhật và chuyển tới cán bộ chuyên môn rà soát.",
    );
  };
  if (submitted)
    return (
      <div className="mx-auto max-w-2xl py-10 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-secondary text-primary">
          <Check size={30} />
        </div>
        <p className="mono-label mt-7 text-primary">
          {mode === "register" ? "TẠO TÀI KHOẢN THÀNH CÔNG" : "ĐÃ CẬP NHẬT HỒ SƠ"}
        </p>
        <h1 className="display-tight mt-3 text-4xl font-extrabold">
          {mode === "register"
            ? "Đã tiếp nhận hồ sơ đăng ký."
            : "Thông tin đã được lưu."}
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-sm leading-6 text-muted-foreground">
          {mode === "register"
            ? "Hãy sao chép thông tin đăng nhập dưới đây. Cán bộ chuyên môn sẽ liên hệ qua email nếu cần bổ sung hồ sơ."
            : "Bạn có thể tiếp tục chỉnh sửa hồ sơ khi nhận yêu cầu bổ sung từ cán bộ chuyên môn."}
        </p>
        {mode === "register" && credentials && (
          <div className="mt-7 rounded-2xl border border-primary/20 bg-secondary/50 p-5 text-left">
            <div className="flex items-center gap-2 text-sm font-bold text-primary">
              <ShieldCheck size={17} /> Tài khoản cơ sở của bạn
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-border bg-card p-3">
                <p className="text-xs text-muted-foreground">Email / tên đăng nhập</p>
                <p className="mt-1 break-all font-mono text-sm font-bold">{credentials.email}</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-3">
                <p className="text-xs text-muted-foreground">Mật khẩu</p>
                <p className="mt-1 font-mono text-sm font-bold">{credentials.password}</p>
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              className="mt-4 w-full rounded-xl"
              onClick={async () => {
                const value = `Email: ${credentials.email}\nMật khẩu: ${credentials.password}`;
                try {
                  await navigator.clipboard.writeText(value);
                } catch {
                  const helper = document.createElement("textarea");
                  helper.value = value;
                  helper.style.position = "fixed";
                  helper.style.opacity = "0";
                  document.body.appendChild(helper);
                  helper.select();
                  document.execCommand("copy");
                  helper.remove();
                }
                setCopied(true);
              }}
            >
              <Copy size={16} /> {copied ? "Đã sao chép tài khoản và mật khẩu" : "Sao chép tài khoản và mật khẩu"}
            </Button>
          </div>
        )}
        <div className="mt-8 flex justify-center gap-3">
          {mode === "register" ? (
            <>
              <ButtonLink href="/admin/login">Đăng nhập ngay</ButtonLink>
              <ButtonLink href="/" variant="outline">Về trang chủ</ButtonLink>
            </>
          ) : (
            <Button
              type="button"
              onClick={() => {
                setSubmitted(false);
                setNotice("");
              }}
              className="rounded-xl"
            >
              Tiếp tục chỉnh sửa
            </Button>
          )}
        </div>
        {notice && <Notice message={notice} onClose={() => setNotice("")} />}
      </div>
    );
  const formFields = formSet.criteria
    .filter((item) => item.active && isVisible(item))
    .sort((a, b) => a.order - b.order);
  const groups = formSet.groups
    .slice()
    .sort((a, b) => a.order - b.order)
    .filter((group) => formFields.some((item) => item.groupId === group.id));
  return (
    <div className="mx-auto max-w-4xl">
      <SectionHeading
        eyebrow={
          mode === "register"
            ? "Đăng ký trực tuyến · Tạo tài khoản cơ sở"
            : `Chỉnh sửa hồ sơ · ${account?.email || "coso.demo"}`
        }
        title={mode === "register" ? "Thông tin đăng ký" : "Hồ sơ cơ sở của bạn"}
        description={
          mode === "register"
            ? "Chọn đúng loại cơ sở để điền biểu mẫu tương ứng. Mỗi loại cơ sở có bộ câu hỏi cố định riêng."
            : "Biểu mẫu dưới đây được nạp lại từ đúng thông tin bạn đã điền khi đăng ký."
        }
      />
      <form onSubmit={submit} className="space-y-6">
        <div className="rounded-2xl border border-primary/15 bg-secondary/40 p-5 shadow-sm sm:p-6">
          <div className="flex items-start gap-3">
            <Mail className="mt-0.5 shrink-0 text-primary" size={19} />
            <div className="w-full">
              <p className="text-sm font-bold">Tài khoản đăng nhập</p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                {mode === "register"
                  ? "Thông tin này dùng để đăng nhập vào khu vực hồ sơ cơ sở."
                  : "Email đăng ký được dùng làm tên đăng nhập và không thể đổi trong bản prototype."}
              </p>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <label>
                  <span className="mb-2 block text-sm font-semibold">Email *</span>
                  <input
                    type="email"
                    value={accountEmail}
                    onChange={(event) => setAccountEmail(event.target.value)}
                    readOnly={mode === "edit"}
                    autoComplete="email"
                    className={`focus-ring h-11 w-full rounded-xl border border-input px-3 text-sm ${mode === "edit" ? "bg-muted" : "bg-background"}`}
                    data-testid="input-registration-email"
                  />
                </label>
                {mode === "register" ? (
                  <>
                    <label>
                      <span className="mb-2 block text-sm font-semibold">Mật khẩu *</span>
                      <input
                        type="password"
                        value={accountPassword}
                        onChange={(event) => setAccountPassword(event.target.value)}
                        autoComplete="new-password"
                        placeholder="Ít nhất 6 ký tự"
                        className="focus-ring h-11 w-full rounded-xl border border-input bg-background px-3 text-sm"
                        data-testid="input-registration-password"
                      />
                    </label>
                    <label className="md:col-start-2">
                      <span className="mb-2 block text-sm font-semibold">Nhập lại mật khẩu *</span>
                      <input
                        type="password"
                        value={accountPasswordConfirm}
                        onChange={(event) => setAccountPasswordConfirm(event.target.value)}
                        autoComplete="new-password"
                        className="focus-ring h-11 w-full rounded-xl border border-input bg-background px-3 text-sm"
                        data-testid="input-registration-password-confirm"
                      />
                    </label>
                  </>
                ) : (
                  <div className="rounded-xl border border-border bg-card px-3 py-3 text-sm">
                    <p className="text-xs text-muted-foreground">Mật khẩu</p>
                    <p className="mt-1 font-semibold">•••••••• · Đã thiết lập</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
          <label
            htmlFor="registration-type"
            className="block text-sm font-bold"
          >
            Loại cơ sở đăng ký <span className="text-destructive">*</span>
          </label>
          <select
            id="registration-type"
            value={type}
            onChange={(event) =>
              changeType(event.target.value as ApplicationType)
            }
            className="focus-ring mt-2 h-12 w-full rounded-xl border border-input bg-background px-4 text-sm font-semibold"
            data-testid="select-registration-type"
          >
            <option value="food-supplier">Đơn vị cung cấp thực phẩm</option>
            <option value="meal-provider">Đơn vị cung cấp suất ăn</option>
            <option value="school">Cơ sở giáo dục</option>
          </select>
        </div>
        {groups.map((group) => (
          <FormSection
            key={group.id}
            title={group.name}
            icon={
              group.name.includes("Minh chứng")
                ? ImagePlus
                : group.name.includes("pháp lý")
                  ? FileText
                  : UserRound
            }
          >
            {formFields
              .filter((item) => item.groupId === group.id)
              .map((item) => (
                <DynamicQuestion
                  key={item.id}
                  item={item}
                  value={fields[item.key] ?? ""}
                  files={files.filter(
                    (file) =>
                      file.fieldKey === item.key ||
                      file.fieldKey?.startsWith(`${item.key}.`),
                  )}
                  suppliers={suppliers ?? []}
                  onChange={(value) => update(item.key, value)}
                  onFiles={(event) => addFilesFor(item.key, event)}
                  onFilesFor={addFilesFor}
                  onRemoveFile={(name, fieldKey) =>
                    removeFile(name, fieldKey ?? item.key)
                  }
                />
              ))}
          </FormSection>
        ))}
        <div className="flex flex-col gap-4 rounded-2xl border border-border bg-secondary/50 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-3 text-sm">
            <LockKeyhole className="mt-0.5 shrink-0 text-primary" size={18} />
            <p>
              <strong>Kiểm tra trước khi nộp.</strong>
              <br />
              <span className="text-muted-foreground">
                Sau khi gửi, hồ sơ sẽ khóa chỉnh sửa cho đến khi có yêu cầu bổ
                sung.
              </span>
            </p>
          </div>
             <Button
            type="submit"
            className="h-12 rounded-xl px-6"
            data-testid="button-submit-application"
          >
              {mode === "register" ? "Tạo tài khoản & nộp hồ sơ" : "Lưu thay đổi hồ sơ"} <Send size={16} />
          </Button>
        </div>
      </form>
      {notice && <Notice message={notice} onClose={() => setNotice("")} />}
    </div>
  );
}

function DynamicQuestion({
  item,
  value,
  files,
  suppliers,
  onChange,
  onFiles,
  onFilesFor,
  onRemoveFile,
}: {
  item: CriteriaDefinition;
  value: CriteriaValue;
  files: Attachment[];
  suppliers: { id: string; name: string; taxCode: string }[];
  onChange: (value: CriteriaValue) => void;
  onFiles: (event: ChangeEvent<HTMLInputElement>) => void;
  onFilesFor: (
    fieldKey: string,
    event: ChangeEvent<HTMLInputElement>,
  ) => void;
  onRemoveFile: (name: string, fieldKey?: string) => void;
}) {
  return (
    <DynamicQuestionControl
      item={item}
      value={value}
      files={files}
      suppliers={suppliers}
      onChange={onChange}
      onFiles={onFiles}
      onFilesFor={onFilesFor}
      onRemoveFile={onRemoveFile}
    />
  );
}

function DynamicQuestionControl({
  item,
  value,
  files,
  suppliers,
  onChange,
  onFiles,
  onFilesFor,
  onRemoveFile,
}: {
  item: CriteriaDefinition;
  value: CriteriaValue;
  files: Attachment[];
  suppliers: { id: string; name: string; taxCode: string }[];
  onChange: (value: CriteriaValue) => void;
  onFiles: (event: ChangeEvent<HTMLInputElement>) => void;
  onFilesFor: (
    fieldKey: string,
    event: ChangeEvent<HTMLInputElement>,
  ) => void;
  onRemoveFile: (name: string, fieldKey?: string) => void;
}) {
  const options =
    item.key === "supplierId"
      ? suppliers.map(
          (supplier) =>
            `${supplier.id} · ${supplier.name} · ${supplier.taxCode}`,
        )
      : item.options;
  const requiredMark = item.required ? (
    <span className="text-destructive"> *</span>
  ) : null;
  const sourceNote =
    item.sourceMaterials.length > 0 ? (
      <div className="mt-2 rounded-lg border border-primary/10 bg-secondary/50 px-3 py-2 text-xs text-muted-foreground">
        <span className="font-bold text-primary">Căn cứ:</span>{" "}
        {item.sourceMaterials.map((source) => source.name).join(", ")}
      </div>
    ) : null;
  if (item.answerType === "repeatable")
    return (
      <RepeatableQuestion
        item={item}
        value={value}
        files={files}
        onChange={onChange}
        onFilesFor={onFilesFor}
        onRemoveFile={onRemoveFile}
      />
    );
  if (item.answerType === "file")
    return (
      <div className="mt-5 first:mt-0">
        <label className="mb-2 block text-sm font-semibold">
          {item.label}
          {requiredMark}
        </label>
        {item.description && (
          <p className="mb-2 text-xs text-muted-foreground">
            {item.description}
          </p>
        )}
        {sourceNote}
        <p className="mb-2 mt-3 text-xs text-muted-foreground">
          PDF, JPG hoặc PNG · tối đa 5MB/tệp · có thể chọn nhiều tệp
        </p>
        <label className="focus-ring flex min-h-16 cursor-pointer items-center gap-3 rounded-xl border border-dashed border-primary/35 bg-secondary/30 px-4 text-sm font-semibold text-primary hover:bg-secondary">
          <Plus size={18} />
          <span>Chọn tệp minh chứng</span>
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
            multiple
            onChange={onFiles}
            className="sr-only"
            data-testid={`input-criteria-${item.key}`}
          />
        </label>
        {files.length > 0 && (
          <div className="mt-3 space-y-2">
            {files.map((file) => (
              <div
                key={file.name}
                className="flex items-center justify-between rounded-lg bg-muted px-3 py-2 text-sm"
              >
                <span className="flex min-w-0 items-center gap-2 truncate">
                  <FileText size={15} className="shrink-0 text-primary" />
                  {file.name}
                </span>
                <button
                  type="button"
                  onClick={() => onRemoveFile(file.name)}
                  className="focus-ring ml-3 shrink-0 text-muted-foreground hover:text-destructive"
                  aria-label={`Xóa ${file.name}`}
                >
                  <X size={15} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  if (item.answerType === "multi-select") {
    const selected: string[] = Array.isArray(value)
      ? value.filter((entry): entry is string => typeof entry === "string")
      : typeof value === "string" && value
        ? [value]
        : [];
    return (
      <fieldset className="mt-5 first:mt-0">
        <legend className="mb-2 block text-sm font-semibold">
          {item.label}
          {requiredMark}
        </legend>
        <div className="grid gap-2 sm:grid-cols-2">
          {options.map((option) => (
            <label
              key={option}
              className="flex cursor-pointer items-center gap-3 rounded-xl border border-input bg-background px-3 py-3 text-sm hover:bg-secondary"
            >
              <input
                type="checkbox"
                checked={selected.includes(option)}
                onChange={(event) =>
                  onChange(
                    event.target.checked
                      ? [...selected, option]
                      : selected.filter((current) => current !== option),
                  )
                }
                className="h-4 w-4 accent-primary"
                data-testid={`input-criteria-${item.key}-${option}`}
              />
              <span>{option}</span>
            </label>
          ))}
        </div>
        {item.description && (
          <span className="mt-2 block text-xs text-muted-foreground">
            {item.description}
          </span>
        )}
        {sourceNote}
      </fieldset>
    );
  }
  if (item.answerType === "yes-no" || item.answerType === "select")
    return (
      <label className="mt-5 block first:mt-0">
        <span className="mb-2 block text-sm font-semibold">
          {item.label}
          {requiredMark}
        </span>
        <select
          value={
            typeof value === "string"
              ? value
              : Array.isArray(value) && typeof value[0] === "string"
                ? value[0]
                : ""
          }
          onChange={(event) => onChange(event.target.value)}
          className="focus-ring h-11 w-full rounded-xl border border-input bg-background px-3 text-sm"
          data-testid={`input-criteria-${item.key}`}
        >
          <option value="">Chọn một phương án</option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        {item.description && (
          <span className="mt-1 block text-xs text-muted-foreground">
            {item.description}
          </span>
        )}
        {sourceNote}
      </label>
    );
  return (
    <label className="mt-5 block first:mt-0">
      <span className="mb-2 block text-sm font-semibold">
        {item.label}
        {requiredMark}
      </span>
      <input
        type={
          item.answerType === "number"
            ? "number"
            : item.answerType === "date"
              ? "date"
              : "text"
        }
        value={
          typeof value === "string"
            ? value
            : Array.isArray(value)
              ? value
                  .filter((entry): entry is string => typeof entry === "string")
                  .join(", ")
              : ""
        }
        onChange={(event) => onChange(event.target.value)}
        className="focus-ring h-11 w-full rounded-xl border border-input bg-background px-3 text-sm"
        data-testid={`input-criteria-${item.key}`}
      />
      {item.description && (
        <span className="mt-1 block text-xs text-muted-foreground">
          {item.description}
        </span>
      )}
      {sourceNote}
    </label>
  );
}

function RepeatableQuestion({
  item,
  value,
  files,
  onChange,
  onFilesFor,
  onRemoveFile,
}: {
  item: CriteriaDefinition;
  value: CriteriaValue;
  files: Attachment[];
  onChange: (value: CriteriaValue) => void;
  onFilesFor: (
    fieldKey: string,
    event: ChangeEvent<HTMLInputElement>,
  ) => void;
  onRemoveFile: (name: string, fieldKey?: string) => void;
}) {
  const rows: Record<string, string | string[]>[] =
    Array.isArray(value) &&
    value.every((row) => typeof row === "object" && !Array.isArray(row))
      ? (value as Record<string, string | string[]>[])
      : [];
  const fields = item.repeatableFields ?? [];
  const updateRow = (
    rowIndex: number,
    key: string,
    nextValue: string | string[],
  ) => {
    const nextRows = rows.map((row, index) =>
      index === rowIndex ? { ...row, [key]: nextValue } : row,
    );
    onChange(nextRows);
  };
  const addRow = () => onChange([...rows, {}]);
  const removeRow = (rowIndex: number) => onChange(rows.filter((_, index) => index !== rowIndex));

  return (
    <div className="mt-5 first:mt-0">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-sm font-semibold">
            {item.label}
            {item.required && <span className="text-destructive"> *</span>}
          </p>
          {item.description && (
            <p className="mt-1 text-xs text-muted-foreground">{item.description}</p>
          )}
        </div>
        <Button
          type="button"
          variant="outline"
          className="h-9 rounded-lg px-3 text-xs"
          onClick={addRow}
          data-testid={`button-add-${item.key}`}
        >
          <Plus size={14} /> Thêm {item.key === "products" ? "sản phẩm" : "nhà cung cấp"}
        </Button>
      </div>
      {rows.length === 0 && (
        <div className="rounded-xl border border-dashed border-primary/25 bg-secondary/20 px-4 py-4 text-sm text-muted-foreground">
          Chưa có dòng nào. Nhấn “Thêm” để khai báo.
        </div>
      )}
      <div className="space-y-4">
        {rows.map((row, rowIndex) => (
          <div
            key={`${item.key}-${rowIndex}`}
            className="rounded-xl border border-border bg-secondary/20 p-4"
          >
            <div className="mb-4 flex items-center justify-between gap-3">
              <p className="text-sm font-bold">
                {item.key === "products" ? "Sản phẩm" : "Nhà cung cấp"} {rowIndex + 1}
              </p>
              <button
                type="button"
                className="text-xs font-bold text-muted-foreground hover:text-destructive"
                onClick={() => removeRow(rowIndex)}
              >
                Xóa dòng
              </button>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {fields.map((field) => {
                const fieldKey = `${item.key}.${rowIndex}.${field.key}`;
                const fieldValue = row[field.key] ?? "";
                if (field.answerType === "file") {
                  const rowFiles = files.filter((file) => file.fieldKey === fieldKey);
                  return (
                    <div key={field.key} className="md:col-span-2">
                      <p className="mb-2 block text-sm font-semibold">
                        {field.label}
                        {field.required && <span className="text-destructive"> *</span>}
                      </p>
                      <label className="focus-ring flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border border-dashed border-primary/35 bg-background px-4 text-sm font-semibold text-primary hover:bg-secondary">
                        <Plus size={16} /> Chọn tệp
                        <input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
                          multiple
                          className="sr-only"
                          onChange={(event) => onFilesFor(fieldKey, event)}
                          data-testid={`input-criteria-${fieldKey}`}
                        />
                      </label>
                      {rowFiles.map((file) => (
                        <div
                          key={file.name}
                          className="mt-2 flex items-center justify-between rounded-lg bg-muted px-3 py-2 text-sm"
                        >
                          <span className="flex min-w-0 items-center gap-2 truncate">
                            <FileText size={15} className="shrink-0 text-primary" />
                            {file.name}
                          </span>
                          <button
                            type="button"
                            onClick={() => onRemoveFile(file.name, fieldKey)}
                            className="ml-3 shrink-0 text-muted-foreground hover:text-destructive"
                            aria-label={`Xóa ${file.name}`}
                          >
                            <X size={15} />
                          </button>
                        </div>
                      ))}
                    </div>
                  );
                }
                if (field.answerType === "select" || field.answerType === "yes-no")
                  return (
                    <label key={field.key} className="block">
                      <span className="mb-2 block text-sm font-semibold">
                        {field.label}
                        {field.required && <span className="text-destructive"> *</span>}
                      </span>
                      <select
                        value={Array.isArray(fieldValue) ? fieldValue[0] ?? "" : fieldValue}
                        onChange={(event) => updateRow(rowIndex, field.key, event.target.value)}
                        className="focus-ring h-11 w-full rounded-xl border border-input bg-background px-3 text-sm"
                        data-testid={`input-criteria-${fieldKey}`}
                      >
                        <option value="">Chọn một phương án</option>
                        {(field.options ?? []).map((option) => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    </label>
                  );
                return (
                  <label key={field.key} className="block">
                    <span className="mb-2 block text-sm font-semibold">
                      {field.label}
                      {field.required && <span className="text-destructive"> *</span>}
                    </span>
                    <input
                      type={field.answerType === "number" ? "number" : "text"}
                      value={Array.isArray(fieldValue) ? fieldValue.join(", ") : fieldValue}
                      onChange={(event) => updateRow(rowIndex, field.key, event.target.value)}
                      className="focus-ring h-11 w-full rounded-xl border border-input bg-background px-3 text-sm"
                      data-testid={`input-criteria-${fieldKey}`}
                    />
                  </label>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FormSection({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: typeof UserRound;
  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-border bg-card p-5 md:p-7">
      <div className="mb-6 flex items-center gap-3 border-b border-border pb-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary text-primary">
          <Icon size={18} />
        </div>
        <h2 className="text-lg font-extrabold">{title}</h2>
      </div>
      {children}
    </section>
  );
}
function Field({
  label,
  value = "",
  onChange,
  test,
  type = "text",
  placeholder,
  wide = false,
  hidden = false,
}: {
  label: string;
  value?: string;
  onChange: (value: string) => void;
  test: string;
  type?: string;
  placeholder?: string;
  wide?: boolean;
  hidden?: boolean;
}) {
  if (hidden) return null;
  return (
    <label className={wide ? "md:col-span-2" : ""}>
      <span className="mb-2 block text-sm font-semibold">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="focus-ring h-11 w-full rounded-xl border border-input bg-background px-3 text-sm"
        data-testid={test}
      />
    </label>
  );
}
function SelectField({
  label,
  value = "",
  onChange,
  options,
  test,
  wide = false,
}: {
  label: string;
  value?: string;
  onChange: (value: string) => void;
  options: string[];
  test: string;
  wide?: boolean;
}) {
  return (
    <label className={wide ? "md:col-span-2" : ""}>
      <span className="mb-2 block text-sm font-semibold">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="focus-ring h-11 w-full rounded-xl border border-input bg-background px-3 text-sm"
        data-testid={test}
      >
        <option value="">Chọn một phương án</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}
function FilePicker({
  label,
  files,
  onChange,
  onRemove,
  test,
  multiple = false,
}: {
  label: string;
  files: Attachment[];
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onRemove: (name: string) => void;
  test: string;
  multiple?: boolean;
}) {
  return (
    <div className="mt-5">
      <label className="mb-2 block text-sm font-semibold">{label}</label>
      <label className="focus-ring flex min-h-16 cursor-pointer items-center gap-3 rounded-xl border border-dashed border-primary/35 bg-secondary/30 px-4 text-sm font-semibold text-primary hover:bg-secondary">
        <Plus size={18} />
        <span>Chọn tệp {multiple ? "(có thể chọn nhiều)" : ""}</span>
        <input
          type="file"
          accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
          multiple={multiple}
          onChange={onChange}
          className="sr-only"
          data-testid={test}
        />
      </label>
      {files.length > 0 && (
        <div className="mt-3 space-y-2">
          {files.map((file) => (
            <div
              key={file.name}
              className="flex items-center justify-between rounded-lg bg-muted px-3 py-2 text-sm"
            >
              <span className="flex min-w-0 items-center gap-2 truncate">
                <FileText size={15} className="shrink-0 text-primary" />
                {file.name}
              </span>
              <button
                type="button"
                onClick={() => onRemove(file.name)}
                className="focus-ring ml-3 shrink-0 text-muted-foreground hover:text-destructive"
                aria-label={`Xóa ${file.name}`}
                data-testid={`button-remove-file-${file.name}`}
              >
                <X size={15} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function MealProviderFields({
  fields,
  update,
  suppliers,
}: {
  fields: Record<string, string>;
  update: (key: string, value: string) => void;
  suppliers: { id: string; name: string; taxCode: string }[];
}) {
  return (
    <>
      <FormSection title="Nhân lực & năng lực cung ứng" icon={Users}>
        <div className="grid gap-4 md:grid-cols-3">
          <Field
            label="Tổng nhân viên chế biến *"
            value={fields.staffTotal}
            onChange={(v) => update("staffTotal", v)}
            test="input-staff-total"
            type="number"
          />
          <Field
            label="Có chứng chỉ tập huấn ATTP *"
            value={fields.staffTrained}
            onChange={(v) => update("staffTrained", v)}
            test="input-staff-trained"
            type="number"
          />
          <Field
            label="Có khám sức khỏe còn hiệu lực *"
            value={fields.staffHealth}
            onChange={(v) => update("staffHealth", v)}
            test="input-staff-health"
            type="number"
          />
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <label>
            <span className="mb-2 block text-sm font-semibold">
              Nhà cung cấp thực phẩm *
            </span>
            <select
              value={fields.supplierId ?? ""}
              onChange={(e) => update("supplierId", e.target.value)}
              className="focus-ring h-11 w-full rounded-xl border border-input bg-background px-3 text-sm"
              data-testid="select-meal-supplier"
            >
              <option value="">Chọn từ danh sách đã đăng ký</option>
              {suppliers.map((supplier) => (
                <option key={supplier.id} value={supplier.id}>
                  {supplier.name} · {supplier.taxCode}
                </option>
              ))}
            </select>
          </label>
          <Field
            label="Công suất suất ăn / ngày *"
            value={fields.dailyCapacity}
            onChange={(v) => update("dailyCapacity", v)}
            test="input-daily-capacity"
            type="number"
          />
          <Field
            label="Số trường / đơn vị đang phục vụ *"
            value={fields.servingUnits}
            onChange={(v) => update("servingUnits", v)}
            test="input-serving-units"
            type="number"
            wide
          />
          <Field
            label="Tên các trường đang phục vụ (nếu có)"
            value={fields.servingNames}
            onChange={(v) => update("servingNames", v)}
            test="input-serving-names"
            wide
          />
        </div>
      </FormSection>
    </>
  );
}

function SchoolFields({
  fields,
  update,
  suppliers,
  files,
  addFiles,
  removeFile,
}: {
  fields: Record<string, string>;
  update: (key: string, value: string) => void;
  suppliers: { id: string; name: string; taxCode: string }[];
  files: Attachment[];
  addFiles: (event: ChangeEvent<HTMLInputElement>) => void;
  removeFile: (name: string) => void;
}) {
  return (
    <>
      <FormSection title="Trách nhiệm an toàn thực phẩm" icon={ShieldCheck}>
        <div className="grid gap-4 md:grid-cols-2">
          <SelectField
            label="Có cán bộ phụ trách ATTP? *"
            value={fields.hasFoodSafetyLead}
            onChange={(v) => update("hasFoodSafetyLead", v)}
            test="select-food-safety-lead"
            options={["Có", "Không"]}
          />
          <SelectField
            label="Hình thức tổ chức bữa ăn *"
            value={fields.mealModel}
            onChange={(v) => update("mealModel", v)}
            test="select-meal-model"
            options={[
              "Tự nấu",
              "Liên kết đơn vị suất ăn",
              "Thuê đơn vị nấu tại bếp trường",
            ]}
          />
        </div>
        {fields.hasFoodSafetyLead === "Có" && (
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <Field
              label="Họ tên người phụ trách *"
              value={fields.safetyLeadName}
              onChange={(v) => update("safetyLeadName", v)}
              test="input-safety-lead-name"
            />
            <FilePicker
              label="Chứng chỉ / tập huấn ATTP *"
              files={files.filter((f) => f.name.startsWith("lead-"))}
              onChange={addFiles}
              onRemove={removeFile}
              test="input-lead-certificate"
            />
          </div>
        )}
        {fields.mealModel && fields.mealModel !== "Tự nấu" && (
          <div className="mt-5 rounded-xl border border-accent/50 bg-accent/15 p-4">
            <p className="text-sm font-bold">Đơn vị cung cấp suất ăn</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Nếu chọn nhập trực tiếp, thông tin sẽ hiển thị nhãn “do bên thứ ba
              cung cấp, chưa xác minh trực tiếp”.
            </p>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <label>
                <span className="mb-2 block text-sm font-semibold">
                  Nguồn thông tin *
                </span>
                <select
                  value={fields.supplierSource ?? ""}
                  onChange={(e) => update("supplierSource", e.target.value)}
                  className="focus-ring h-11 w-full rounded-xl border border-input bg-background px-3 text-sm"
                  data-testid="select-school-supplier-source"
                >
                  <option value="">Chọn nguồn</option>
                  <option value="verified">Chọn đơn vị đã đăng ký</option>
                  <option value="manual">Nhập đơn vị trực tiếp</option>
                </select>
              </label>
              {fields.supplierSource === "verified" ? (
                <label>
                  <span className="mb-2 block text-sm font-semibold">
                    Đơn vị suất ăn *
                  </span>
                  <select
                    value={fields.supplierId ?? ""}
                    onChange={(e) => update("supplierId", e.target.value)}
                    className="focus-ring h-11 w-full rounded-xl border border-input bg-background px-3 text-sm"
                    data-testid="select-school-supplier"
                  >
                    <option value="">Chọn nhà cung cấp</option>
                    {suppliers.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </label>
              ) : (
                <>
                  <Field
                    label="Tên đơn vị *"
                    value={fields.supplierName}
                    onChange={(v) => update("supplierName", v)}
                    test="input-school-supplier-name"
                  />
                  <Field
                    label="Mã số thuế *"
                    value={fields.supplierTax}
                    onChange={(v) => update("supplierTax", v)}
                    test="input-school-supplier-tax"
                  />
                  <Field
                    label="Số điện thoại *"
                    value={fields.supplierPhone}
                    onChange={(v) => update("supplierPhone", v)}
                    test="input-school-supplier-phone"
                  />
                  <Field
                    label="Địa chỉ (không bắt buộc)"
                    value={fields.supplierAddress}
                    onChange={(v) => update("supplierAddress", v)}
                    test="input-school-supplier-address"
                  />
                </>
              )}
            </div>
          </div>
        )}
        {fields.mealModel === "Tự nấu" && (
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <Field
              label="Số nhân viên bếp *"
              value={fields.kitchenStaff}
              onChange={(v) => update("kitchenStaff", v)}
              test="input-kitchen-staff"
              type="number"
            />
            <SelectField
              label="Nhân viên có chứng chỉ ATTP? *"
              value={fields.kitchenCertified}
              onChange={(v) => update("kitchenCertified", v)}
              test="select-kitchen-certified"
              options={["Có", "Không"]}
            />
          </div>
        )}
      </FormSection>
      <FormSection title="Cơ sở vật chất sơ bộ" icon={Building2}>
        <div className="grid gap-4 md:grid-cols-2">
          <SelectField
            label="Bếp ăn theo nguyên tắc một chiều? *"
            value={fields.kitchenOneWay}
            onChange={(v) => update("kitchenOneWay", v)}
            test="select-kitchen-one-way"
            options={["Có", "Không"]}
          />
          <SelectField
            label="Có khu lưu mẫu thức ăn? *"
            value={fields.sampleStorage}
            onChange={(v) => update("sampleStorage", v)}
            test="select-sample-storage"
            options={["Có", "Không"]}
          />
        </div>
      </FormSection>
    </>
  );
}
function CriteriaAnswerTypeDropdown({
  item,
  labels,
  onTypeChange,
  onToggleOption,
}: {
  item: CriteriaDefinition;
  labels: Record<CriteriaAnswerType, string>;
  onTypeChange: (answerType: CriteriaAnswerType) => void;
  onToggleOption: (option: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const choiceType =
    item.answerType === "select" || item.answerType === "multi-select";
  const answerTypes = Object.entries(labels).filter(
    ([value]) => value !== "multi-select",
  ) as [CriteriaAnswerType, string][];
  const selectType = (answerType: CriteriaAnswerType) => {
    onTypeChange(answerType);
    if (answerType !== "select") setOpen(false);
  };
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="focus-ring flex h-11 w-full items-center justify-between rounded-xl border border-input bg-background px-3 text-left text-sm"
        aria-expanded={open}
        data-testid={`select-criteria-answer-type-${item.key}`}
      >
        <span>{labels[item.answerType]}</span>
        <ChevronDownIcon open={open} />
      </button>
      {open && (
        <div className="absolute inset-x-0 top-12 z-20 overflow-hidden rounded-xl border border-border bg-card p-1 shadow-xl">
          {answerTypes.map(([value, label]) => {
            const isChoice = value === "select" && choiceType;
            return (
              <div key={value}>
                <button
                  type="button"
                  onClick={() => selectType(value)}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm hover:bg-secondary"
                  data-testid={`answer-type-option-${item.key}-${value}`}
                >
                  <input
                    type="checkbox"
                    readOnly
                    checked={value === item.answerType || isChoice}
                    className="h-4 w-4 accent-primary"
                    tabIndex={-1}
                  />
                  <span
                    className={
                      value === item.answerType || isChoice
                        ? "font-semibold text-primary"
                        : ""
                    }
                  >
                    {label}
                  </span>
                </button>
                {isChoice && (
                  <div className="mb-1 border-t border-border px-2 pb-1 pt-1">
                    <p className="px-1 py-1 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                      Phương án có thể chọn
                    </p>
                    {item.options.length ? (
                      item.options.map((option) => (
                        <label
                          key={option}
                          className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2 text-sm hover:bg-secondary"
                        >
                          <input
                            type="checkbox"
                            checked={
                              item.answerType === "select" ||
                              item.options.includes(option)
                            }
                            onChange={() => onToggleOption(option)}
                            className="h-4 w-4 accent-primary"
                            data-testid={`checkbox-answer-option-${item.key}-${option}`}
                          />
                          <span>{option}</span>
                        </label>
                      ))
                    ) : (
                      <p className="px-1 py-2 text-xs text-muted-foreground">
                        Nhập phương án ở ô bên dưới trước.
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function ChevronDownIcon({ open }: { open: boolean }) {
  return (
    <svg
      aria-hidden="true"
      className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.168l3.71-3.938a.75.75 0 1 1 1.08 1.04l-4.25 4.51a.75.75 0 0 1-1.08 0l-4.25-4.51a.75.75 0 0 1 .02-1.06Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export function AdminDashboard() {
  const [status, setStatus] =
    useState<ListApplicationsParams["status"]>("pending");
  const [search, setSearch] = useState("");
  const filteredApplications = applications.filter(
    (app) =>
      (!status || app.status === status) &&
      (!search ||
        `${app.reference} ${app.applicantName}`
          .toLowerCase()
          .includes(search.toLowerCase())),
  );
  return (
    <AdminShell>
      <div className="mx-auto max-w-7xl px-5 py-9 lg:px-10">
        <SectionHeading
          eyebrow="Tổng quan nghiệp vụ"
          title="Bàn xét duyệt hồ sơ."
          description="Theo dõi luồng tiếp nhận và xử lý hồ sơ đăng ký của các cơ sở trên địa bàn."
          action={
            <button
              type="button"
              onClick={() => downloadApplicationListExcel(filteredApplications)}
              className="inline-flex items-center gap-2 rounded-xl border border-primary/20 bg-card px-3.5 py-2.5 text-sm font-bold text-primary shadow-sm hover:bg-secondary"
              data-testid="button-export-application-list-excel"
            >
              <Download size={16} /> Xuất danh sách Excel
            </button>
          }
        />
        <div className="mt-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mono-label text-primary">Hàng đợi xét duyệt</p>
            <h2 className="mt-2 text-2xl font-extrabold">Hồ sơ cần xử lý</h2>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <label className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm mã, tên đơn vị..."
                className="focus-ring h-10 rounded-lg border border-input bg-card pl-9 pr-3 text-sm"
                data-testid="input-admin-search"
              />
            </label>
            <select
              value={status}
              onChange={(e) =>
                setStatus(e.target.value as ListApplicationsParams["status"])
              }
              className="focus-ring h-10 rounded-lg border border-input bg-card px-3 text-sm font-semibold"
              data-testid="select-admin-status"
            >
              <option value="pending">Chờ duyệt</option>
              <option value="needs-more-info">Cần bổ sung</option>
              <option value="approved">PASS</option>
              <option value="warning">Cảnh báo / tạm dừng</option>
              <option value="stopped">Dừng hoạt động</option>
              <option value="rejected">Từ chối</option>
            </select>
          </div>
        </div>
        <div className="mt-5 overflow-hidden rounded-2xl border border-border bg-card">
          {filteredApplications.length ? (
            <div className="divide-y divide-border">
              {filteredApplications.map((app) => (
                <Link
                  key={app.id}
                  href={`/admin/applications/${app.id}`}
                  className="lift flex flex-col gap-3 p-5 hover:bg-secondary/30 sm:flex-row sm:items-center sm:justify-between"
                  data-testid={`link-application-${app.id}`}
                >
                  <div className="flex items-start gap-4">
                    <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary">
                      <ClipboardCheck size={18} />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs font-semibold text-primary">
                          {app.reference}
                        </span>
                        <StatusPill status={app.status} />
                      </div>
                      <h3 className="mt-1 font-bold">{app.applicantName}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {typeNames[app.type]} · {formatDate(app.submittedAt)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-6 sm:justify-end">
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">
                        Điểm hiện tại
                      </p>
                      <p className="font-mono font-bold">{app.score}/100</p>
                    </div>
                    <ArrowUpRight size={18} className="text-primary" />
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <EmptyState
              title="Không có hồ sơ trong hàng đợi"
              description="Bộ lọc hiện tại không trả về hồ sơ nào."
            />
          )}
        </div>
      </div>
    </AdminShell>
  );
}

export function AdminCriteriaPage() {
  const [type, setType] = useState<ApplicationType>("food-supplier");
  const criteriaSet = getCriteriaSet(type);
  const history = criteriaHistory[type];
  const [groups, setGroups] = useState<CriteriaGroup[]>([]);
  const [draft, setDraft] = useState<CriteriaDefinition[]>([]);
  const [effectiveFrom, setEffectiveFrom] = useState("");
  const [applyMode, setApplyMode] =
    useState<CriteriaConfigInput["applyMode"]>("now");
  const [notice, setNotice] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);

  const answerTypeLabels: Record<CriteriaAnswerType, string> = {
    text: "Nhập văn bản",
    number: "Nhập số",
    date: "Ngày tháng",
    "yes-no": "Có / Không",
    select: "Chọn phương án",
    "multi-select": "Chọn phương án",
    file: "Tải tệp / ảnh",
    repeatable: "Danh sách có thể thêm nhiều dòng",
  };

  useEffect(() => {
    if (!criteriaSet) return;
    setGroups(criteriaSet.groups.slice().sort((a, b) => a.order - b.order));
    setDraft(criteriaSet.criteria.map((item) => ({ ...item })));
    setEffectiveFrom(criteriaSet.effectiveFrom);
  }, [criteriaSet?.version]);

  const ordinaryTotal = draft
    .filter((item) => item.active)
    .reduce((sum, item) => sum + Number(item.maxScore || 0), 0);
  const updateItem = (id: string, patch: Partial<CriteriaDefinition>) =>
    setDraft((items) =>
      items.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    );
  const updateGroup = (id: string, patch: Partial<CriteriaGroup>) =>
    setGroups((items) =>
      items.map((group) => (group.id === id ? { ...group, ...patch } : group)),
    );
  const addGroup = () =>
    setGroups((items) => [
      ...items,
      {
        id: `group-${Date.now()}`,
        name: "Nhóm tiêu chí mới",
        order: items.length + 1,
      },
    ]);
  const removeGroup = (id: string) => {
    const group = groups.find((item) => item.id === id);
    const linkedCriteria = draft.filter((item) => item.groupId === id);
    if (!group) return;
    if (
      linkedCriteria.length &&
      !window.confirm(
        `Xóa “${group.name}” sẽ xóa luôn ${linkedCriteria.length} tiêu chí bên trong. Bạn có chắc không?`,
      )
    )
      return;
    setGroups((items) =>
      items
        .filter((item) => item.id !== id)
        .map((item, index) => ({ ...item, order: index + 1 })),
    );
    setDraft((items) =>
      items
        .filter((item) => item.groupId !== id)
        .map((item, index) => ({ ...item, order: index + 1 })),
    );
  };
  const addItem = () => {
    if (groups.length === 0) {
      setNotice("Hãy tạo nhóm trước khi thêm tiêu chí.");
      return;
    }
    setDraft((items) => [
      ...items,
      {
        id: `custom-${Date.now()}`,
        key: `custom_${Date.now()}`,
        label: "Tiêu chí mới",
        description: "",
        groupId: groups[0].id,
        answerType: "text",
        options: [],
        maxScore: 0,
        required: true,
        active: true,
        order: items.length + 1,
        sourceMaterials: [],
      },
    ]);
  };
  const removeItem = (id: string) => {
    const item = draft.find((current) => current.id === id);
    if (
      !item ||
      !window.confirm(
        `Xóa tiêu chí “${item.label}”? Thao tác này sẽ được ghi nhận trong phiên bản mới.`,
      )
    )
      return;
    setDraft((items) =>
      items
        .filter((current) => current.id !== id)
        .map((current, index) => ({ ...current, order: index + 1 })),
    );
  };
  const toggleItem = (id: string) =>
    updateItem(id, { active: !draft.find((item) => item.id === id)?.active });
  const defaultOptionsFor = (answerType: CriteriaAnswerType) =>
    answerType === "yes-no" ? ["Có", "Không"] : ["Lựa chọn 1", "Lựa chọn 2"];
  const updateAnswerType = (id: string, answerType: CriteriaAnswerType) => {
    const current = draft.find((item) => item.id === id);
    const needsOptions =
      answerType === "yes-no" ||
      answerType === "select" ||
      answerType === "multi-select";
    const options = needsOptions
      ? current?.options.length
        ? current.options
        : defaultOptionsFor(answerType)
      : [];
    updateItem(id, { answerType, options });
  };
  const updateOptions = (id: string, rawValue: string) => {
    const options = rawValue
      .split(/[\n,]/)
      .map((option) => option.trim())
      .filter(Boolean);
    updateItem(id, { options });
  };
  const toggleAnswerOption = (id: string, option: string) => {
    const current = draft.find((item) => item.id === id);
    if (!current) return;
    const selected = current.options.includes(option);
    updateItem(id, {
      answerType: "multi-select",
      options: selected
        ? current.options.filter((value) => value !== option)
        : [...current.options, option],
    });
  };
  const addSourceMaterials = (
    id: string,
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const selected = Array.from(event.target.files ?? []).filter(
      (file) =>
        ["application/pdf", "image/jpeg", "image/png"].includes(file.type) &&
        file.size <= 5 * 1024 * 1024,
    );
    const current = draft.find((item) => item.id === id);
    if (selected.length && current) {
      updateItem(id, {
        sourceMaterials: [
          ...current.sourceMaterials,
          ...selected.map((file, index) => ({
            id: `source-${Date.now()}-${index}`,
            name: file.name,
            kind: file.type,
            size: file.size,
          })),
        ],
      });
    }
    event.target.value = "";
  };
  const removeSourceMaterial = (itemId: string, sourceId: string) => {
    const item = draft.find((current) => current.id === itemId);
    if (item)
      updateItem(itemId, {
        sourceMaterials: item.sourceMaterials.filter(
          (source) => source.id !== sourceId,
        ),
      });
  };
  const hideItem = (id: string) => updateItem(id, { active: false });
  const save = () => {
    if (ordinaryTotal !== 100) {
      setNotice(
        `Chưa thể lưu: tổng điểm tiêu chí thường phải bằng 100, hiện tại là ${ordinaryTotal}.`,
      );
      return;
    }
    const emptyMultiSelect = draft.find(
      (item) =>
        item.active &&
        item.answerType === "multi-select" &&
        item.options.length === 0,
    );
    if (emptyMultiSelect) {
      setNotice(
        `Chưa thể lưu: hãy tick ít nhất một phương án cho “${emptyMultiSelect.label}”.`,
      );
      return;
    }
    setNotice(
      `Đã lưu bản xem trước phiên bản ${criteriaSet.version}. Form đăng ký sẽ dùng bộ tiêu chí mẫu.`,
    );
  };

  return (
    <AdminShell>
      <div className="mx-auto max-w-7xl px-5 py-9 lg:px-10">
        <div className="mb-8 overflow-hidden rounded-[1.75rem] bg-[#123d36] px-6 py-8 text-white shadow-xl shadow-[#123d36]/10 lg:px-9 lg:py-9">
          <div className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="mono-label text-[#f4c95d]">CẤU HÌNH BIỂU MẪU</p>
              <h1 className="display-tight mt-3 max-w-3xl text-4xl font-extrabold tracking-tight md:text-5xl">
                Cấu hình tiêu chí
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/65 md:text-base">
                Tạo nhóm, chỉnh sửa trường thông tin và thiết kế câu hỏi theo
                từng loại cơ sở. Mỗi lần lưu sẽ tạo một phiên bản mới.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setPreviewOpen(true)}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#f4c95d] px-4 py-3 text-sm font-extrabold text-[#123d36] shadow-lg shadow-black/10 hover:bg-[#f7d77d]"
              data-testid="button-preview-generated-form"
            >
              Xem form đang sinh <ArrowUpRight size={16} />
            </button>
          </div>
        </div>
        <div className="flex flex-col gap-4 rounded-[1.5rem] border border-slate-200 bg-white p-3 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-slate-400">
              Loại hình
            </span>
            {[
              ["food-supplier", "Cung cấp thực phẩm"],
              ["meal-provider", "Cung cấp suất ăn"],
              ["school", "Cơ sở giáo dục"],
            ].map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setType(value as ApplicationType)}
                className={`rounded-xl px-3.5 py-2.5 text-sm font-bold transition-colors ${type === value ? "bg-[#e7f2ef] text-[#16604f]" : "text-slate-500 hover:bg-slate-50"}`}
              >
                {label}
              </button>
            ))}
          </div>
          <div
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold ${ordinaryTotal === 100 ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-800"}`}
            data-testid="criteria-total-score"
          >
            <span className="h-2 w-2 rounded-full bg-current" /> Tổng điểm:{" "}
            {ordinaryTotal}/100{" "}
            {ordinaryTotal === 100 ? "· Hợp lệ" : "· Chưa thể lưu"}
          </div>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-muted-foreground">
                Nhóm tiêu chí
              </span>
              <Layers3 size={19} className="text-primary" />
            </div>
            <p className="mt-5 text-3xl font-extrabold">{groups.length}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Có thể thêm, sửa hoặc xóa
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-muted-foreground">
                Trường thông tin
              </span>
              <ListChecks size={19} className="text-primary" />
            </div>
            <p className="mt-5 text-3xl font-extrabold">
              {draft.filter((item) => item.active).length}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {draft.length - draft.filter((item) => item.active).length} trường
              đang ẩn
            </p>
          </div>
        </div>
        <div className="mt-8 rounded-[1.5rem] border border-primary/15 bg-secondary/35 p-5 shadow-sm md:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <Layers3 size={19} />
              </div>
              <div>
                <p className="text-lg font-extrabold">Nhóm tiêu chí</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Mỗi trường thông tin thuộc một nhóm để form đăng ký dễ đọc và
                  dễ quản lý.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={addGroup}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-bold text-primary-foreground shadow-sm hover:bg-primary/90"
            >
              <Plus size={16} /> Tạo nhóm mới
            </button>
          </div>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {groups.map((group, index) => (
              <div
                key={group.id}
                className="group flex items-center gap-3 rounded-2xl border border-border bg-card p-3 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary">
                  <GripVertical size={16} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                      Nhóm {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      {draft.filter((item) => item.groupId === group.id).length}{" "}
                      trường
                    </span>
                  </div>
                  <input
                    value={group.name}
                    onChange={(event) =>
                      updateGroup(group.id, { name: event.target.value })
                    }
                    className="focus-ring mt-1 h-10 w-full rounded-lg border border-input bg-background px-3 text-sm font-semibold"
                    aria-label={`Tên nhóm ${index + 1}`}
                    data-testid={`input-criteria-group-${group.id}`}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeGroup(group.id)}
                  className="focus-ring shrink-0 rounded-lg p-2 text-muted-foreground hover:bg-red-50 hover:text-destructive"
                  aria-label={`Xóa nhóm ${group.name}`}
                  data-testid={`button-delete-criteria-group-${group.id}`}
                >
                  <Trash2 size={17} />
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="mono-label text-primary">TRƯỜNG THÔNG TIN</p>
                <h2 className="mt-2 text-2xl font-extrabold">
                  Thiết kế câu hỏi
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Sửa trực tiếp từng trường, chọn kiểu trả lời và quản lý các
                  phương án.
                </p>
              </div>
              <button
                type="button"
                onClick={addItem}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-primary/25 bg-card px-4 text-sm font-bold text-primary shadow-sm hover:bg-secondary"
              >
                <Plus size={17} /> Thêm trường thông tin
              </button>
            </div>
            {draft
              .slice()
              .sort((a, b) => a.order - b.order)
              .map((item, index) => (
                <div
                  key={item.id}
                  className={`rounded-[1.5rem] border bg-card p-5 shadow-sm transition-all md:p-6 ${item.active ? "border-border" : "border-dashed border-border/70 bg-muted/35 opacity-75"}`}
                  data-testid={`criteria-row-${item.key}`}
                >
                  <div className="flex flex-col gap-4 xl:flex-row xl:items-start">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-secondary font-mono text-xs font-bold text-primary">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-bold text-primary">
                          {answerTypeLabels[item.answerType]}
                        </span>
                        {!item.active && (
                          <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-bold text-muted-foreground">
                            Đang ẩn
                          </span>
                        )}
                      </div>
                      <div className="mt-5 grid gap-4 md:grid-cols-2">
                        <label className="md:col-span-2">
                          <span className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                            Tên tiêu chí / câu hỏi
                          </span>
                          <input
                            value={item.label}
                            onChange={(event) =>
                              updateItem(item.id, { label: event.target.value })
                            }
                            className="focus-ring h-11 w-full rounded-xl border border-input bg-background px-3 text-sm font-semibold"
                            placeholder="Ví dụ: Tên cơ sở"
                            data-testid={`input-criteria-label-${item.key}`}
                          />
                        </label>
                        <label>
                          <span className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                            Nhóm tiêu chí
                          </span>
                          <select
                            value={item.groupId}
                            onChange={(event) =>
                              updateItem(item.id, {
                                groupId: event.target.value,
                              })
                            }
                            className="focus-ring h-11 w-full rounded-xl border border-input bg-background px-3 text-sm"
                            data-testid={`select-criteria-group-${item.key}`}
                          >
                            <option value="">Chọn nhóm</option>
                            {groups.map((group) => (
                              <option key={group.id} value={group.id}>
                                {group.name}
                              </option>
                            ))}
                          </select>
                        </label>
                        <label>
                          <span className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                            Loại trả lời
                          </span>
                          <CriteriaAnswerTypeDropdown
                            item={item}
                            labels={answerTypeLabels}
                            onTypeChange={(answerType) =>
                              updateAnswerType(item.id, answerType)
                            }
                            onToggleOption={(option) =>
                              toggleAnswerOption(item.id, option)
                            }
                          />
                        </label>
                        <label>
                          <span className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                            Điểm tối đa
                          </span>
                          <input
                            type="number"
                            min="0"
                            value={item.maxScore}
                            onChange={(event) =>
                              updateItem(item.id, {
                                maxScore: Math.max(
                                  0,
                                  Number(event.target.value),
                                ),
                              })
                            }
                            className="focus-ring h-11 w-full rounded-xl border border-input bg-background px-3 text-sm font-semibold"
                            data-testid={`input-criteria-score-${item.key}`}
                          />
                        </label>
                        <label className="flex items-center gap-2 self-end pb-2 text-sm font-semibold">
                          <input
                            type="checkbox"
                            checked={item.required}
                            onChange={(event) =>
                              updateItem(item.id, {
                                required: event.target.checked,
                              })
                            }
                            className="h-4 w-4 accent-primary"
                          />{" "}
                          Bắt buộc trả lời
                        </label>
                      </div>
                      <label className="mt-4 block">
                        <span className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                          Mô tả / hướng dẫn
                        </span>
                        <textarea
                          value={item.description}
                          onChange={(event) =>
                            updateItem(item.id, {
                              description: event.target.value,
                            })
                          }
                          className="focus-ring min-h-20 w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm"
                          placeholder="Nêu rõ người dùng cần khai báo hoặc cung cấp minh chứng gì..."
                          data-testid={`textarea-criteria-description-${item.key}`}
                        />
                      </label>
                      {(
                        [
                          "yes-no",
                          "select",
                          "multi-select",
                        ] as CriteriaAnswerType[]
                      ).includes(item.answerType) && (
                        <label className="mt-4 block rounded-2xl border border-primary/15 bg-secondary/35 p-4">
                          <span className="flex items-center justify-between gap-3 text-xs font-bold uppercase tracking-wider text-primary">
                            <span>Phương án trả lời</span>
                            <span className="normal-case tracking-normal text-muted-foreground">
                              Mỗi dòng là một phương án
                            </span>
                          </span>
                          <textarea
                            value={item.options.join("\n")}
                            onChange={(event) =>
                              updateOptions(item.id, event.target.value)
                            }
                            className="focus-ring mt-2 min-h-24 w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm"
                            placeholder="Nhập mỗi phương án trên một dòng..."
                            data-testid={`textarea-criteria-options-${item.key}`}
                          />
                          <p className="mt-2 text-xs text-muted-foreground">
                            Bạn có thể ngăn cách phương án bằng xuống dòng hoặc
                            dấu phẩy.
                          </p>
                        </label>
                      )}
                      {item.sourceMaterials.length > 0 ||
                      item.answerType === "file" ? (
                        <div className="mt-4 rounded-2xl border border-dashed border-primary/25 bg-secondary/25 p-4">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div>
                              <p className="text-sm font-bold">
                                Tài liệu căn cứ
                              </p>
                              <p className="text-xs text-muted-foreground">
                                PDF, JPG hoặc PNG · tối đa 5MB/tệp.
                              </p>
                            </div>
                            <label className="focus-ring inline-flex cursor-pointer items-center gap-2 rounded-lg border border-primary/25 px-3 py-2 text-xs font-bold text-primary hover:bg-secondary">
                              <Plus size={15} /> Thêm tài liệu
                              <input
                                type="file"
                                accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
                                multiple
                                onChange={(event) =>
                                  addSourceMaterials(item.id, event)
                                }
                                className="sr-only"
                                data-testid={`input-criteria-source-${item.key}`}
                              />
                            </label>
                          </div>
                          {item.sourceMaterials.length > 0 && (
                            <div className="mt-3 space-y-2">
                              {item.sourceMaterials.map((source) => (
                                <div
                                  key={source.id}
                                  className="flex items-center justify-between gap-3 rounded-lg bg-card px-3 py-2 text-xs"
                                >
                                  <span className="flex min-w-0 items-center gap-2 truncate">
                                    <FileText
                                      size={14}
                                      className="shrink-0 text-primary"
                                    />
                                    {source.name}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      removeSourceMaterial(item.id, source.id)
                                    }
                                    className="shrink-0 font-bold text-muted-foreground hover:text-destructive"
                                    data-testid={`button-remove-criteria-source-${source.id}`}
                                  >
                                    Xóa
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ) : null}
                    </div>
                    <div className="flex shrink-0 flex-row gap-2 border-t border-border pt-4 xl:w-32 xl:flex-col xl:border-0 xl:pt-0">
                      <button
                        type="button"
                        onClick={() => toggleItem(item.id)}
                        className="flex-1 rounded-xl border border-border px-3 py-2.5 text-xs font-bold hover:bg-secondary"
                      >
                        {item.active ? (
                          "Ẩn trường"
                        ) : (
                          <>
                            <RotateCcw size={14} className="mr-1 inline" /> Hiện
                            lại
                          </>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="flex-1 rounded-xl border border-red-200 px-3 py-2.5 text-xs font-bold text-destructive hover:bg-red-50"
                        data-testid={`button-delete-criteria-${item.key}`}
                      >
                        <Trash2 size={14} className="mr-1 inline" /> Xóa
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            {draft.length === 0 && (
              <div className="rounded-[1.5rem] border border-dashed border-primary/30 bg-secondary/25 p-12 text-center">
                <ListChecks className="mx-auto text-primary" size={34} />
                <h3 className="mt-4 font-bold">Chưa có trường thông tin</h3>
                <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
                  Tạo trường đầu tiên để bắt đầu dựng form đăng ký.
                </p>
              </div>
            )}
          </div>
          <aside className="h-fit space-y-4 lg:sticky lg:top-24">
            <div className="rounded-[1.5rem] border border-border bg-card p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="mono-label text-primary">PHIÊN BẢN HIỆN TẠI</p>
                </div>
                <div className="rounded-xl bg-secondary p-2 text-primary">
                  <Check size={18} />
                </div>
              </div>
              <div className="mt-5 space-y-4">
                <label className="block text-sm font-semibold">
                  Ngày áp dụng mới
                  <input
                    type="date"
                    value={effectiveFrom}
                    onChange={(event) => setEffectiveFrom(event.target.value)}
                    className="focus-ring mt-2 h-11 w-full rounded-xl border border-input bg-background px-3 text-sm"
                  />
                </label>
                <label className="block text-sm font-semibold">
                  Cách áp dụng
                  <select
                    value={applyMode}
                    onChange={(event) =>
                      setApplyMode(
                        event.target.value as CriteriaConfigInput["applyMode"],
                      )
                    }
                    className="focus-ring mt-2 h-11 w-full rounded-xl border border-input bg-background px-3 text-sm"
                  >
                    <option value="now">Áp dụng ngay</option>
                    <option value="scheduled">Áp dụng từ ngày đã chọn</option>
                  </select>
                </label>
              </div>
              <button
                type="button"
                onClick={save}
                disabled={ordinaryTotal !== 100}
                className="mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-bold text-primary-foreground shadow-sm disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Check size={16} />
                Lưu phiên bản tiêu chí
              </button>
              {ordinaryTotal !== 100 && (
                <p className="mt-3 text-xs leading-5 text-red-700">
                  Điều chỉnh điểm các tiêu chí thường để tổng đạt đúng 100 trước
                  khi lưu.
                </p>
              )}
            </div>
            <div className="rounded-[1.5rem] border border-border bg-card p-5 shadow-sm">
              <p className="mono-label text-primary">LỊCH SỬ THAY ĐỔI</p>
              <div className="mt-4 space-y-3">
                {history.length ? (
                  history.slice(0, 5).map((entry) => (
                    <div
                      key={entry.id}
                      className="border-l-2 border-primary/30 pl-3"
                    >
                      <p className="text-xs font-bold">{entry.summary}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {entry.changedBy} · {formatDate(entry.changedAt)} ·{" "}
                        {entry.version}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="mt-3 text-sm text-muted-foreground">
                    Chưa có thay đổi trong phiên làm việc này.
                  </p>
                )}
              </div>
            </div>
          </aside>
        </div>
        {notice && <Notice message={notice} onClose={() => setNotice("")} />}
      </div>
      {previewOpen && (
        <CriteriaPreviewDialog
          type={type}
          criteria={draft}
          groups={groups}
          onClose={() => setPreviewOpen(false)}
        />
      )}
    </AdminShell>
  );
}

function CriteriaPreviewDialog({
  type,
  criteria,
  groups,
  onClose,
}: {
  type: ApplicationType;
  criteria: CriteriaDefinition[];
  groups: CriteriaGroup[];
  onClose: () => void;
}) {
  const [previewType, setPreviewType] = useState<ApplicationType>(type);
  const [values, setValues] = useState<Record<string, string | string[]>>({});
  const previewSet = getCriteriaSet(previewType);
  const previewCriteria = previewType === type ? criteria : previewSet.criteria;
  const previewGroups = previewType === type ? groups : previewSet.groups;
  const activeCriteria = previewCriteria
    .filter((item) => item.active)
    .sort((a, b) => a.order - b.order);
  const updateValue = (key: string, value: string | string[]) =>
    setValues((previous) => ({ ...previous, [key]: value }));
  useEffect(() => {
    setValues({});
  }, [previewType]);
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-primary/35 p-0 backdrop-blur-sm sm:items-center sm:p-5"
      onClick={onClose}
    >
      <div
        className="flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-t-3xl border border-border bg-[#f5f7f8] shadow-2xl sm:rounded-3xl"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="criteria-preview-title"
        data-testid="dialog-generated-form-preview"
      >
        <div className="flex items-start justify-between gap-4 border-b border-border bg-card px-6 py-5">
          <div className="min-w-0">
            <p className="mono-label text-primary">XEM TRƯỚC FORM CƠ SỞ</p>
            <h2
              id="criteria-preview-title"
              className="mt-2 text-2xl font-extrabold"
            >
              Đăng ký hồ sơ
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {typeNames[previewType]} · {activeCriteria.length} trường thông
              tin đang hiển thị
            </p>
          </div>
          <button
            type="button"
            className="focus-ring shrink-0 rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
            onClick={onClose}
            aria-label="Đóng xem trước form"
            data-testid="button-close-generated-form-preview"
          >
            <X size={19} />
          </button>
        </div>
        <div className="overflow-y-auto px-5 py-6 sm:px-8">
          <div className="mx-auto max-w-3xl">
            <div className="mb-6 rounded-2xl border border-primary/15 bg-card p-5">
              <label className="block text-sm font-bold">
                Loại cơ sở xem trước
                <select
                  value={previewType}
                  onChange={(event) =>
                    setPreviewType(event.target.value as ApplicationType)
                  }
                  className="focus-ring mt-2 h-11 w-full rounded-xl border border-input bg-background px-3 text-sm font-semibold"
                  data-testid="select-preview-facility-type"
                >
                  {facilityTypeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                Mỗi loại cơ sở có bộ câu hỏi riêng. Chọn loại cơ sở để xem đúng
                form tương ứng.
              </p>
            </div>
            <div className="space-y-5">
              {previewGroups
                .slice()
                .sort((a, b) => a.order - b.order)
                .map((group) => {
                  const groupCriteria = activeCriteria.filter(
                    (item) => item.groupId === group.id,
                  );
                  return groupCriteria.length ? (
                    <section
                      key={group.id}
                      className="rounded-2xl border border-border bg-card p-5 sm:p-6"
                    >
                      <h3 className="border-b border-border pb-3 text-lg font-extrabold">
                        {group.name}
                      </h3>
                      <div className="mt-2">
                        {groupCriteria.map((item) => (
                          <PreviewQuestion
                            key={item.id}
                            item={item}
                            value={values[item.key] ?? ""}
                            onChange={(value) => updateValue(item.key, value)}
                          />
                        ))}
                      </div>
                    </section>
                  ) : null;
                })}
            </div>
          </div>
        </div>
        <div className="flex justify-end border-t border-border bg-card px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="h-11 rounded-xl bg-primary px-5 text-sm font-bold text-primary-foreground hover:bg-primary/90"
            data-testid="button-close-generated-form-preview-footer"
          >
            Đóng xem trước
          </button>
        </div>
      </div>
    </div>
  );
}

function PreviewQuestion({
  item,
  value,
  onChange,
}: {
  item: CriteriaDefinition;
  value: string | string[];
  onChange: (value: string | string[]) => void;
}) {
  const requiredMark = item.required ? (
    <span className="text-destructive"> *</span>
  ) : null;
  const options = item.options;
  if (item.answerType === "file")
    return (
      <div className="mt-5 first:mt-0">
        <label className="mb-2 block text-sm font-semibold">
          {item.label}
          {requiredMark}
        </label>
        <div className="flex min-h-14 items-center gap-2 rounded-xl border border-dashed border-primary/30 bg-secondary/30 px-4 text-sm font-semibold text-primary">
          <Plus size={17} /> Chọn tệp minh chứng
        </div>
      </div>
    );
  if (item.answerType === "multi-select") {
    const selected = Array.isArray(value) ? value : value ? [value] : [];
    return (
      <fieldset className="mt-5 first:mt-0">
        <legend className="mb-2 block text-sm font-semibold">
          {item.label}
          {requiredMark}
        </legend>
        <div className="grid gap-2 sm:grid-cols-2">
          {options.map((option) => (
            <label
              key={option}
              className="flex items-center gap-3 rounded-xl border border-input bg-background px-3 py-3 text-sm"
            >
              <input
                type="checkbox"
                checked={selected.includes(option)}
                onChange={(event) =>
                  onChange(
                    event.target.checked
                      ? [...selected, option]
                      : selected.filter((current) => current !== option),
                  )
                }
                className="h-4 w-4 accent-primary"
                data-testid={`preview-criteria-${item.key}-${option}`}
              />
              <span>{option}</span>
            </label>
          ))}
        </div>
        {item.description && (
          <span className="mt-2 block text-xs text-muted-foreground">
            {item.description}
          </span>
        )}
      </fieldset>
    );
  }
  if (item.answerType === "yes-no" || item.answerType === "select")
    return (
      <label className="mt-5 block first:mt-0">
        <span className="mb-2 block text-sm font-semibold">
          {item.label}
          {requiredMark}
        </span>
        <select
          value={Array.isArray(value) ? (value[0] ?? "") : value}
          onChange={(event) => onChange(event.target.value)}
          className="focus-ring h-11 w-full rounded-xl border border-input bg-background px-3 text-sm"
          data-testid={`preview-criteria-${item.key}`}
        >
          <option value="">Chọn một phương án</option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        {item.description && (
          <span className="mt-1 block text-xs text-muted-foreground">
            {item.description}
          </span>
        )}
      </label>
    );
  return (
    <label className="mt-5 block first:mt-0">
      <span className="mb-2 block text-sm font-semibold">
        {item.label}
        {requiredMark}
      </span>
      <input
        type={
          item.answerType === "number"
            ? "number"
            : item.answerType === "date"
              ? "date"
              : "text"
        }
        value={Array.isArray(value) ? value.join(", ") : value}
        onChange={(event) => onChange(event.target.value)}
        className="focus-ring h-11 w-full rounded-xl border border-input bg-background px-3 text-sm"
        data-testid={`preview-criteria-${item.key}`}
      />
      {item.description && (
        <span className="mt-1 block text-xs text-muted-foreground">
          {item.description}
        </span>
      )}
    </label>
  );
}

function formatAnswer(value: unknown) {
  if (Array.isArray(value)) return value.join(", ");
  if (value === undefined || value === null || value === "") return "—";
  return String(value);
}

function CriteriaReviewPanel({
  criteria,
  criteriaGroups,
  data,
  scores,
  notes,
  setScore,
  setNote,
}: {
  criteria: CriteriaDefinition[];
  criteriaGroups: CriteriaGroup[];
  data: Record<string, unknown>;
  scores: Record<string, number>;
  notes: Record<string, string>;
  setScore: (key: string, value: number) => void;
  setNote: (key: string, value: string) => void;
}) {
  const groups = criteriaGroups
    .slice()
    .sort((a, b) => a.order - b.order)
    .filter((group) => criteria.some((item) => item.groupId === group.id));
  const scoreCriteria = criteria.filter(
    (item) => item.active && item.maxScore > 0,
  );
  const maxScore = scoreCriteria.reduce((sum, item) => sum + item.maxScore, 0);
  const computedScore = Math.round(
    scoreCriteria.reduce(
      (sum, item) =>
        sum +
        Math.min(item.maxScore, Math.max(0, Number(scores[item.key] ?? 0))),
      0,
    ),
  );
  const hasAnyScore = scoreCriteria.some((item) =>
    Object.prototype.hasOwnProperty.call(scores, item.key),
  );
  const percentage = maxScore
    ? Math.round((computedScore / maxScore) * 100)
    : 0;
  const decision = !hasAnyScore
    ? {
        label: "Chưa đánh giá",
        description: "Nhập điểm từng tiêu chí để hệ thống tự tính kết quả.",
        className: "bg-slate-100 text-slate-700",
        bar: "bg-slate-300",
      }
    : percentage >= 100
      ? {
          label: "Đạt 100%",
          description: "Hồ sơ đạt đầy đủ điểm tiêu chí.",
          className: "bg-emerald-100 text-emerald-900",
          bar: "bg-emerald-500",
        }
      : percentage >= 80
        ? {
            label: `${percentage}% · Cần xem xét`,
            description:
              "Hồ sơ nằm trong ngưỡng 80–99%. Cán bộ có thể duyệt cảnh báo hoặc yêu cầu bổ sung.",
            className: "bg-amber-100 text-amber-900",
            bar: "bg-amber-500",
          }
        : {
            label: `${percentage}% · Không đạt`,
            description:
              "Hồ sơ dưới 80% và cần xử lý theo quyết định chuyên môn.",
            className: "bg-red-100 text-red-900",
            bar: "bg-red-500",
          };
  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <ClipboardCheck size={19} className="text-primary" />
          <h2 className="text-lg font-extrabold">Chấm từng tiêu chí</h2>
        </div>
        <span className="rounded-full bg-secondary px-3 py-1 text-xs font-bold text-primary">
          {criteria.length} tiêu chí trong snapshot
        </span>
      </div>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        Nhập điểm đạt được cho từng tiêu chí. Tổng điểm và trạng thái sẽ tự cập
        nhật.
      </p>
      <div
        className="mt-5 rounded-2xl border border-border bg-secondary/30 p-4"
        data-testid="review-score-summary"
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Kết quả tạm tính
            </p>
            <p className="mt-1 font-mono text-3xl font-extrabold text-primary">
              {computedScore}
              <span className="text-base text-muted-foreground">
                {" "}
                / {maxScore} điểm
              </span>
            </p>
          </div>
          <span
            className={`rounded-full px-3 py-1.5 text-xs font-extrabold ${decision.className}`}
          >
            {decision.label}
          </span>
        </div>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-border">
          <div
            className={`h-full rounded-full transition-all ${decision.bar}`}
            style={{ width: `${Math.min(100, percentage)}%` }}
          />
        </div>
        <p className="mt-3 text-xs leading-5 text-muted-foreground">
          {decision.description}
        </p>
        <div className="mt-3 grid gap-2 text-xs text-muted-foreground sm:grid-cols-3">
          <span>
            <strong className="text-emerald-700">100%</strong> · Đạt
          </span>
          <span>
            <strong className="text-amber-700">80–99%</strong> · Cần xem xét
          </span>
          <span>
            <strong className="text-red-700">&lt; 80%</strong> · Không đạt
          </span>
        </div>
      </div>
      <div className="mt-6 space-y-6">
        {groups.map((group) => (
          <div key={group.id}>
            <p className="mono-label border-b border-border pb-2 text-primary">
              Nhóm {group.name}
            </p>
            <div className="mt-3 space-y-3">
              {criteria
                .filter((item) => item.groupId === group.id)
                .map((item) => (
                  <div
                    key={item.key}
                    className="rounded-xl border border-border/80 bg-secondary/20 p-4"
                  >
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      <div className="min-w-0">
                        <p className="font-bold">
                          {item.label}
                          {item.required && (
                            <span className="text-destructive"> *</span>
                          )}
                        </p>
                        <p className="mt-1 break-words text-sm text-muted-foreground">
                          Khai báo: {formatAnswer(data[item.key])}
                        </p>
                        {item.sourceMaterials.length > 0 && (
                          <p className="mt-2 text-xs text-muted-foreground">
                            <span className="font-bold text-primary">
                              Căn cứ:
                            </span>{" "}
                            {item.sourceMaterials
                              .map((source) => source.name)
                              .join(", ")}
                          </p>
                        )}
                      </div>
                      {item.maxScore > 0 ? (
                        <div className="flex shrink-0 items-center gap-2">
                          <input
                            aria-label={`Điểm ${item.label}`}
                            type="number"
                            min="0"
                            max={item.maxScore}
                            value={scores[item.key] ?? 0}
                            onChange={(event) =>
                              setScore(
                                item.key,
                                Math.min(
                                  item.maxScore,
                                  Math.max(0, Number(event.target.value)),
                                ),
                              )
                            }
                            className="focus-ring h-10 w-20 rounded-lg border border-input bg-background px-2 text-right font-mono font-bold"
                          />
                          <span className="font-mono text-sm text-muted-foreground">
                            / {item.maxScore}
                          </span>
                        </div>
                      ) : (
                        <span className="rounded-lg bg-muted px-3 py-2 text-xs font-bold text-muted-foreground">
                          Không chấm điểm
                        </span>
                      )}
                    </div>
                    <label className="mt-3 block">
                      <span className="mb-1 block text-xs font-semibold text-muted-foreground">
                        Ghi chú tiêu chí
                      </span>
                      <input
                        value={notes[item.key] ?? ""}
                        onChange={(event) =>
                          setNote(item.key, event.target.value)
                        }
                        placeholder="Nhập nhận xét / căn cứ kiểm tra"
                        className="focus-ring h-9 w-full rounded-lg border border-input bg-background px-3 text-sm"
                      />
                    </label>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function LegacyAdminApplicationPage() {
  const { id = "" } = useParams<{ id: string }>();
  const application = applications.find((item) => item.id === id);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [criteriaNotes, setCriteriaNotes] = useState<Record<string, string>>(
    {},
  );
  const [note, setNote] = useState("");
  const [notice, setNotice] = useState("");
  useEffect(() => {
    if (!application) return;
    setScores(application.scoreBreakdown ?? {});
    setNote(application.reviewNote ?? "");
  }, [application?.id, application?.criteriaVersion]);
  const criteria =
    application?.criteriaSnapshot
      ?.filter((item) => item.active)
      .sort((a, b) => a.order - b.order) ?? [];
  const ordinaryCriteria = criteria;
  const computedScore = Math.round(
    ordinaryCriteria.reduce(
      (sum, item) =>
        sum +
        Math.min(item.maxScore, Math.max(0, Number(scores[item.key] ?? 0))),
      0,
    ),
  );
  const submitReview = (action: ReviewAction) => {
    const perCriterionNotes = Object.entries(criteriaNotes)
      .filter(([, value]) => value.trim())
      .map(
        ([key, value]) =>
          `${criteria.find((item) => item.key === key)?.label}: ${value}`,
      )
      .join("\n");
    setNotice(
      action === "approve"
        ? "Đã chấm điểm và xử lý hồ sơ."
        : action === "reject"
          ? "Hồ sơ đã được ghi nhận từ chối."
          : "Đã lưu yêu cầu bổ sung.",
    );
  };
  if (!application)
    return (
      <AdminShell>
        <div className="mx-auto max-w-6xl px-5 py-12">
          <EmptyState
            title="Không tìm thấy hồ sơ"
            description="Hồ sơ có thể đã được di chuyển hoặc không tồn tại."
          />
        </div>
      </AdminShell>
    );
  return (
    <AdminShell>
      <div className="mx-auto max-w-6xl px-5 py-9 lg:px-10">
        <Link
          href="/admin"
          className="focus-ring inline-flex items-center gap-2 text-sm font-bold text-primary"
          data-testid="link-back-admin"
        >
          <ArrowLeft size={16} /> Quay lại hàng đợi
        </Link>
        <div className="mt-7 flex flex-col gap-5 border-b border-border pb-7 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mono-label text-primary">
              {application.reference} · {typeNames[application.type]} ·{" "}
              {application.criteriaVersion}
            </p>
            <h1 className="display-tight mt-2 text-3xl font-extrabold md:text-5xl">
              {application.applicantName}
            </h1>
            <p className="mt-3 text-sm text-muted-foreground">
              {application.address} · {application.contact}
            </p>
          </div>
          <StatusPill status={application.status} />
        </div>
        <div className="mt-8 grid gap-6 lg:grid-cols-[1.25fr_.75fr]">
          <div className="space-y-6">
            <ReviewPanel application={application} />
            <CriteriaReviewPanel
              criteria={criteria}
              criteriaGroups={application.criteriaGroups ?? []}
              data={application.data}
              scores={scores}
              notes={criteriaNotes}
              setScore={(key, value) =>
                setScores((prev) => ({ ...prev, [key]: value }))
              }
              setNote={(key, value) =>
                setCriteriaNotes((prev) => ({ ...prev, [key]: value }))
              }
            />
            <AttachmentPanel attachments={application.attachments} />
            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="flex items-center gap-3">
                <SlidersHorizontal size={19} className="text-primary" />
                <h2 className="text-lg font-extrabold">Dữ liệu khai báo</h2>
              </div>
              <dl className="mt-4 grid gap-x-6 sm:grid-cols-2">
                {criteria
                  .filter((item) => item.answerType !== "file")
                  .map((item) => (
                    <div key={item.key} className="border-b border-border py-3">
                      <dt className="text-xs text-muted-foreground">
                        {item.label}
                      </dt>
                      <dd className="mt-1 break-words text-sm font-semibold">
                        {formatAnswer(application.data?.[item.key])}
                      </dd>
                    </div>
                  ))}
              </dl>
            </div>
          </div>
          <aside className="h-fit rounded-2xl border border-border bg-card p-6 lg:sticky lg:top-24">
            <p className="mono-label text-primary">QUYẾT ĐỊNH CHUYÊN MÔN</p>
            <h2 className="mt-3 text-xl font-extrabold">Chấm điểm & xử lý</h2>
            <div
              className={`mt-5 rounded-xl px-4 py-3 ${computedScore === 100 ? "bg-emerald-100 text-emerald-900" : computedScore >= 80 ? "bg-yellow-100 text-yellow-900" : "bg-red-100 text-red-900"}`}
            >
              <p className="text-xs font-bold uppercase tracking-wider">
                Điểm tự động tính
              </p>
              <p className="mt-1 font-mono text-3xl font-extrabold">
                {computedScore}
                <span className="text-base">/100</span>
              </p>
              <p className="mt-1 text-xs">
                Điểm được cộng từ các tiêu chí đang hoạt động trong phiên bản hồ
                sơ.
              </p>
            </div>
            <label className="mt-6 block">
              <span className="mb-2 block text-sm font-semibold">
                Ý kiến xử lý chung
              </span>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Ghi rõ căn cứ và nội dung cần lưu vết..."
                className="focus-ring min-h-32 w-full rounded-xl border border-input bg-background p-3 text-sm"
                data-testid="textarea-review-note"
              />
            </label>
            <div className="mt-6 grid gap-2">
              <Button
                onClick={() => submitReview("approve")}
                className="h-11 rounded-xl bg-primary"
                data-testid="button-review-approve"
              >
                <Check size={16} /> Lưu & duyệt hồ sơ
              </Button>
              <Button
                onClick={() => submitReview("needs-more-info")}
                variant="outline"
                className="h-11 rounded-xl"
                data-testid="button-review-more-info"
              >
                <Info size={16} /> Yêu cầu bổ sung
              </Button>
              <Button
                onClick={() => submitReview("reject")}
                variant="destructive"
                className="h-11 rounded-xl"
                data-testid="button-review-reject"
              >
                <X size={16} /> Từ chối hồ sơ
              </Button>
            </div>
            <p className="mt-4 text-xs leading-5 text-muted-foreground">
              Kết quả được tính từ từng tiêu chí trong snapshot{" "}
              {application.criteriaVersion}, không dùng bộ tiêu chí mới hơn.
            </p>
          </aside>
        </div>
      </div>
      {notice && <Notice message={notice} onClose={() => setNotice("")} />}
    </AdminShell>
  );
}

function escapeExcelCell(value: unknown) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function downloadExcel(
  filename: string,
  title: string,
  rows: Array<[string, unknown]>,
) {
  const body = rows
    .map(
      ([label, value]) =>
        `<tr><th>${escapeExcelCell(label)}</th><td>${escapeExcelCell(value)}</td></tr>`,
    )
    .join("");
  const html = `<html><head><meta charset="utf-8" /></head><body><h1>${escapeExcelCell(title)}</h1><table border="1"><tbody>${body}</tbody></table></body></html>`;
  const blob = new Blob([`\ufeff${html}`], {
    type: "application/vnd.ms-excel;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

function downloadApplicationListExcel(items: Application[]) {
  const headers = [
    "Mã hồ sơ",
    "Tên cơ sở",
    "Loại hình",
    "Ngày nộp",
    "Trạng thái",
    "Điểm",
  ];
  const body = items
    .map(
      (item) =>
        `<tr>${[item.reference, item.applicantName, typeNames[item.type], formatDate(item.submittedAt), item.status, `${item.score}/100`].map((value) => `<td>${escapeExcelCell(value)}</td>`).join("")}</tr>`,
    )
    .join("");
  const html = `<html><head><meta charset="utf-8" /></head><body><h1>Danh sách hồ sơ ATTP TP.HCM</h1><table border="1"><thead><tr>${headers.map((header) => `<th>${escapeExcelCell(header)}</th>`).join("")}</tr></thead><tbody>${body}</tbody></table></body></html>`;
  const blob = new Blob([`\ufeff${html}`], {
    type: "application/vnd.ms-excel;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `danh-sach-ho-so-${new Date().toISOString().slice(0, 10)}.xls`;
  anchor.click();
  URL.revokeObjectURL(url);
}

function EvidenceCell({
  item,
  data,
  attachments,
  onOpen,
}: {
  item: CriteriaDefinition;
  data: Record<string, unknown>;
  attachments: Attachment[];
  onOpen: (file: Attachment) => void;
}) {
  const files = attachments.filter((file) => file.fieldKey === item.key);
  const value = data[item.key];
  if (files.length)
    return (
      <div className="flex flex-wrap items-center gap-2">
        {files.map((file) =>
          file.kind.startsWith("image/") ? (
            <button
              type="button"
              key={file.name}
              onClick={() => onOpen(file)}
              className="group relative h-12 w-12 overflow-hidden rounded-lg border border-border bg-muted"
              title={`Xem ${file.name}`}
            >
              <img
                src={heroFoodImage}
                alt={file.name}
                className="h-full w-full object-cover transition-transform group-hover:scale-110"
              />
              <span className="absolute inset-0 flex items-center justify-center bg-primary/55 text-white opacity-0 transition-opacity group-hover:opacity-100">
                <ZoomIn size={15} />
              </span>
            </button>
          ) : (
            <button
              type="button"
              key={file.name}
              onClick={() => onOpen(file)}
              className="flex max-w-[10rem] items-center gap-1.5 rounded-lg border border-primary/15 bg-secondary/50 px-2 py-1.5 text-left text-xs font-semibold text-primary hover:bg-secondary"
            >
              <FileText size={14} className="shrink-0" />
              <span className="truncate">{file.name}</span>
            </button>
          ),
        )}
      </div>
    );
  return (
    <span
      className="block max-w-[16rem] truncate text-sm font-semibold text-slate-700"
      title={formatAnswer(value)}
    >
      {formatAnswer(value)}
    </span>
  );
}

function ScoreResult({
  percentage,
  computedScore,
  maxScore,
  hasAnyScore,
}: {
  percentage: number;
  computedScore: number;
  maxScore: number;
  hasAnyScore: boolean;
}) {
  const result = !hasAnyScore
    ? {
        label: "Chưa đánh giá",
        description:
          "Bắt đầu nhập điểm để hệ thống tính kết quả theo thời gian thực.",
        cls: "bg-slate-50 text-slate-700 border-slate-200",
        bar: "bg-slate-400",
      }
    : percentage >= 100
      ? {
          label: "PASS",
          description: "Hồ sơ đạt đủ 100% tổng điểm tiêu chí.",
          cls: "bg-emerald-50 text-emerald-800 border-emerald-200",
          bar: "bg-emerald-500",
        }
      : percentage >= 80
        ? {
            label: "Cảnh báo / tạm dừng",
            description:
              "Hồ sơ nằm trong ngưỡng 80–99% và cần thời hạn khắc phục.",
            cls: "bg-amber-50 text-amber-800 border-amber-200",
            bar: "bg-amber-500",
          }
        : {
            label: "Dừng hoạt động",
            description:
              "Tổng điểm dưới 80%. Cần xử lý theo quyết định chuyên môn.",
            cls: "bg-red-50 text-red-800 border-red-200",
            bar: "bg-red-500",
          };
  return (
    <div
      className={`rounded-2xl border p-5 ${result.cls}`}
      data-testid="review-score-summary"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[.14em] opacity-70">
            Kết quả realtime
          </p>
          <p className="mt-2 font-mono text-4xl font-extrabold">
            {percentage}
            <span className="text-lg opacity-60">%</span>
          </p>
          <p className="mt-1 text-xs font-semibold opacity-75">
            {computedScore}/{maxScore} điểm
          </p>
        </div>
        <span className="rounded-full bg-white/75 px-3 py-1.5 text-xs font-extrabold">
          {result.label}
        </span>
      </div>
      <div className="mt-5 h-2 overflow-hidden rounded-full bg-black/10">
        <div
          className={`h-full rounded-full transition-all duration-300 ${result.bar}`}
          style={{ width: `${Math.min(100, percentage)}%` }}
        />
      </div>
      <p className="mt-3 text-xs leading-5 opacity-80">{result.description}</p>
      <div className="mt-4 grid grid-cols-3 gap-2 border-t border-current/10 pt-3 text-[11px] font-semibold opacity-75">
        <span>
          <strong className="text-emerald-700">100%</strong>
          <br />
          PASS
        </span>
        <span>
          <strong className="text-amber-700">80–99%</strong>
          <br />
          Cảnh báo
        </span>
        <span>
          <strong className="text-red-700">&lt; 80%</strong>
          <br />
          Dừng
        </span>
      </div>
    </div>
  );
}

function ScoreStatusButton({
  score,
  maxScore,
  onToggle,
  mobile = false,
  itemKey,
}: {
  score: number;
  maxScore: number;
  onToggle: () => void;
  mobile?: boolean;
  itemKey: string;
}) {
  const passed = score === maxScore;
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`inline-flex items-center justify-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-bold transition-colors ${passed ? "bg-emerald-600 text-white shadow-sm shadow-emerald-200" : "border border-red-200 bg-red-50 text-red-700 hover:bg-red-100"} ${mobile ? "w-full" : ""}`}
      data-testid={`button-score-status-${itemKey}`}
      aria-pressed={passed}
    >
      {passed ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
      {passed ? "Đạt" : "Không đạt"}
    </button>
  );
}

function AdminCriteriaReviewTable({
  criteria,
  groups,
  data,
  attachments,
  scores,
  notes,
  setScore,
  setNote,
  onOpenAttachment,
}: {
  criteria: CriteriaDefinition[];
  groups: CriteriaGroup[];
  data: Record<string, unknown>;
  attachments: Attachment[];
  scores: Record<string, number>;
  notes: Record<string, string>;
  setScore: (key: string, value: number) => void;
  setNote: (key: string, value: string) => void;
  onOpenAttachment: (file: Attachment) => void;
}) {
  const orderedGroups = groups
    .slice()
    .sort((a, b) => a.order - b.order)
    .filter((group) => criteria.some((item) => item.groupId === group.id));
  const scoringCriteria = criteria.filter(
    (item) => item.active && item.maxScore > 0,
  );
  return (
    <div className="overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-5 py-5 sm:px-7">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.16em] text-[#16604f]">
              PHẦN 02 · ĐÁNH GIÁ
            </p>
            <h2 className="mt-2 text-2xl font-extrabold text-slate-900">
              Bảng chấm điểm theo tiêu chí
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Dữ liệu minh chứng lấy trực tiếp từ hồ sơ cơ sở. Điểm, kết quả và
              trạng thái cập nhật ngay khi cán bộ thao tác.
            </p>
          </div>
          <span className="rounded-full bg-[#e7f2ef] px-3 py-1.5 text-xs font-bold text-[#16604f]">
            {scoringCriteria.length} tiêu chí có điểm
          </span>
        </div>
      </div>
      <div className="hidden overflow-x-auto lg:block">
        <table className="w-full min-w-[980px] border-collapse text-left">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              <th className="w-[28%] px-5 py-3.5">Tên tiêu chí</th>
              <th className="w-20 px-3 py-3.5 text-center">Tối đa</th>
              <th className="w-[22%] px-3 py-3.5">Minh chứng</th>
              <th className="w-28 px-3 py-3.5 text-center">Trạng thái</th>
              <th className="w-28 px-3 py-3.5 text-center">Điểm chấm</th>
              <th className="w-[21%] px-3 py-3.5">Ghi chú</th>
            </tr>
          </thead>
          <tbody>
            {orderedGroups.map((group) => (
              <Fragment key={group.id}>
                <tr className="border-b border-slate-100 bg-[#f7faf9]">
                  <td
                    colSpan={6}
                    className="px-5 py-2.5 text-xs font-extrabold uppercase tracking-wider text-[#16604f]"
                  >
                    {group.name}
                  </td>
                </tr>
                {criteria
                  .filter(
                    (item) =>
                      item.groupId === group.id &&
                      item.active &&
                      item.maxScore > 0,
                  )
                  .map((item) => (
                    <tr
                      key={item.key}
                      className="border-b border-slate-100 align-top last:border-0 hover:bg-slate-50/70"
                    >
                      <td className="px-5 py-4">
                        <p className="text-sm font-bold text-slate-800">
                          {item.label}
                        </p>
                        {item.required && (
                          <span className="mt-1 inline-block text-[11px] font-semibold text-slate-400">
                            Bắt buộc
                          </span>
                        )}
                      </td>
                      <td className="px-3 py-4 text-center font-mono text-sm font-bold text-slate-500">
                        {item.maxScore}
                      </td>
                      <td className="px-3 py-4">
                        <EvidenceCell
                          item={item}
                          data={data}
                          attachments={attachments}
                          onOpen={onOpenAttachment}
                        />
                      </td>
                      <td className="px-3 py-4 text-center">
                        <ScoreStatusButton
                          score={scores[item.key] ?? 0}
                          maxScore={item.maxScore}
                          onToggle={() =>
                            setScore(
                              item.key,
                              scores[item.key] === item.maxScore
                                ? 0
                                : item.maxScore,
                            )
                          }
                          itemKey={item.key}
                        />
                      </td>
                      <td className="px-3 py-4 text-center">
                        <div className="inline-flex items-center gap-1">
                          <input
                            type="number"
                            min="0"
                            max={item.maxScore}
                            value={scores[item.key] ?? 0}
                            onChange={(event) =>
                              setScore(
                                item.key,
                                Math.min(
                                  item.maxScore,
                                  Math.max(0, Number(event.target.value)),
                                ),
                              )
                            }
                            className="focus-ring h-9 w-16 rounded-lg border border-slate-200 bg-white px-2 text-right font-mono text-sm font-bold"
                            aria-label={`Điểm ${item.label}`}
                            data-testid={`input-score-${item.key}`}
                          />
                          <span className="font-mono text-xs text-slate-400">
                            /{item.maxScore}
                          </span>
                        </div>
                      </td>
                      <td className="px-3 py-4">
                        <input
                          value={notes[item.key] ?? ""}
                          onChange={(event) =>
                            setNote(item.key, event.target.value)
                          }
                          placeholder="Nhận xét..."
                          className="focus-ring h-9 w-full min-w-28 rounded-lg border border-slate-200 bg-white px-2.5 text-xs"
                          aria-label={`Ghi chú ${item.label}`}
                          data-testid={`input-note-${item.key}`}
                        />
                      </td>
                    </tr>
                  ))}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
      <div className="space-y-3 p-4 lg:hidden">
        {orderedGroups.map((group) => (
          <section key={group.id}>
            <p className="mb-2 rounded-lg bg-[#f7faf9] px-3 py-2 text-xs font-extrabold uppercase tracking-wider text-[#16604f]">
              {group.name}
            </p>
            {criteria
              .filter(
                (item) =>
                  item.groupId === group.id && item.active && item.maxScore > 0,
              )
              .map((item) => (
                <div
                  key={item.key}
                  className="rounded-xl border border-slate-200 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm font-bold">{item.label}</p>
                    <span className="shrink-0 font-mono text-xs text-slate-500">
                      /{item.maxScore}
                    </span>
                  </div>
                  <div className="mt-3">
                    <p className="mb-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Minh chứng
                    </p>
                    <EvidenceCell
                      item={item}
                      data={data}
                      attachments={attachments}
                      onOpen={onOpenAttachment}
                    />
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <ScoreStatusButton
                      score={scores[item.key] ?? 0}
                      maxScore={item.maxScore}
                      onToggle={() =>
                        setScore(
                          item.key,
                          scores[item.key] === item.maxScore
                            ? 0
                            : item.maxScore,
                        )
                      }
                      mobile
                      itemKey={item.key}
                    />
                    <label className="flex items-center gap-1 rounded-lg border border-slate-200 px-2">
                      <span className="text-[11px] text-slate-400">Điểm</span>
                      <input
                        type="number"
                        min="0"
                        max={item.maxScore}
                        value={scores[item.key] ?? 0}
                        onChange={(event) =>
                          setScore(
                            item.key,
                            Math.min(
                              item.maxScore,
                              Math.max(0, Number(event.target.value)),
                            ),
                          )
                        }
                        className="h-8 w-full bg-transparent text-right font-mono text-sm font-bold outline-none"
                      />
                    </label>
                  </div>
                  <input
                    value={notes[item.key] ?? ""}
                    onChange={(event) => setNote(item.key, event.target.value)}
                    placeholder="Ghi chú tiêu chí..."
                    className="focus-ring mt-3 h-9 w-full rounded-lg border border-slate-200 px-2.5 text-xs"
                  />
                </div>
              ))}
          </section>
        ))}
      </div>
    </div>
  );
}

function AttachmentGalleryDialog({
  file,
  attachments,
  onClose,
  onSelect,
}: {
  file: Attachment;
  attachments: Attachment[];
  onClose: () => void;
  onSelect: (file: Attachment) => void;
}) {
  const imageFiles = attachments.filter((item) =>
    item.kind.startsWith("image/"),
  );
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-label="Xem minh chứng"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[#16604f]">
              THƯ VIỆN MINH CHỨNG
            </p>
            <h2 className="mt-1 max-w-[18rem] truncate font-extrabold text-slate-900">
              {file.name}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            aria-label="Đóng xem minh chứng"
          >
            <X size={19} />
          </button>
        </div>
        <div className="flex min-h-[22rem] items-center justify-center bg-slate-100 p-6">
          {file.kind.startsWith("image/") ? (
            <img
              src={heroFoodImage}
              alt={file.name}
              className="max-h-[55vh] max-w-full rounded-xl object-contain shadow-lg"
            />
          ) : (
            <div className="text-center">
              <FileText size={48} className="mx-auto text-[#16604f]" />
              <p className="mt-3 text-sm font-bold text-slate-700">
                Tài liệu PDF
              </p>
              <p className="mt-1 text-xs text-slate-500">{file.name}</p>
            </div>
          )}
        </div>
        {imageFiles.length > 1 && (
          <div className="flex gap-2 overflow-x-auto border-t border-slate-200 p-3">
            {imageFiles.map((item) => (
              <button
                type="button"
                key={item.name}
                onClick={() => onSelect(item)}
                className={`h-14 w-14 shrink-0 overflow-hidden rounded-lg border-2 ${item.name === file.name ? "border-[#16604f]" : "border-transparent"}`}
              >
                <img
                  src={heroFoodImage}
                  alt={item.name}
                  className="h-full w-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function SupplementDialog({
  note,
  setNote,
  onClose,
  onSubmit,
}: {
  note: string;
  setNote: (value: string) => void;
  onClose: () => void;
  onSubmit: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl rounded-2xl bg-white shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="supplement-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-amber-700">
              CHƯA ĐỦ CĂN CỨ ĐÁNH GIÁ
            </p>
            <h2
              id="supplement-title"
              className="mt-1 text-xl font-extrabold text-slate-900"
            >
              Yêu cầu cơ sở bổ sung
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Nhập nội dung cần gửi trực tiếp cho cơ sở.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
            aria-label="Đóng yêu cầu bổ sung"
          >
            <X size={18} />
          </button>
        </div>
        <div className="px-6 py-5">
          <label className="block">
            <span className="mb-2 block text-sm font-bold text-slate-800">
              Nội dung gửi cơ sở
            </span>
            <textarea
              autoFocus
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder="Ví dụ: Vui lòng bổ sung ảnh khu vực bảo quản, chụp rõ toàn bộ kệ hàng..."
              className="focus-ring min-h-36 w-full rounded-xl border border-slate-200 p-3 text-sm"
              data-testid="textarea-supplement-request"
            />
          </label>
        </div>
        <div className="flex justify-end gap-2 border-t border-slate-200 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-600"
          >
            Hủy
          </button>
          <button
            type="button"
            onClick={onSubmit}
            disabled={!note.trim()}
            className="rounded-xl bg-[#16604f] px-4 py-2.5 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-40"
            data-testid="button-confirm-supplement-request"
          >
            Gửi yêu cầu bổ sung
          </button>
        </div>
      </div>
    </div>
  );
}

export function AdminApplicationPage() {
  const { id = "" } = useParams<{ id: string }>();
  const application = applications.find((item) => item.id === id);
  const [evaluation, setEvaluation] = useState<"" | "passed" | "failed">("");
  const [supplementNote, setSupplementNote] = useState("");
  const [notice, setNotice] = useState("");
  useEffect(() => {
    if (!application) return;
    setEvaluation(
      application.status === "approved"
        ? "passed"
        : application.status === "needs-more-info"
          ? "failed"
          : "",
    );
    setSupplementNote(application.reviewNote ?? "");
  }, [application?.id, application?.status, application?.reviewNote]);
  const criteria =
    application?.criteriaSnapshot
      ?.filter((item) => item.active)
      .sort((a, b) => a.order - b.order) ?? [];
  const formGroups = (application?.criteriaGroups ?? [])
    .slice()
    .sort((a, b) => a.order - b.order);
  const publish = () => {
    if (!application || evaluation !== "passed") return;
    const publishedRecord: PublicRecord = {
      id: `application-${application.id}`,
      category: "eligible-facilities",
      title: application.applicantName,
      subtitle: typeNames[application.type],
      location: application.address,
      status: "active",
      publishedAt: new Date().toISOString().slice(0, 10),
      metadata: {
        "Mã hồ sơ": application.reference,
        "Loại hình": typeNames[application.type],
        "Liên hệ": application.contact,
        "Kết quả": "Đạt",
      },
    };
    const existingIndex = regionalPublicRecords.findIndex(
      (record) => record.id === publishedRecord.id,
    );
    if (existingIndex >= 0) regionalPublicRecords[existingIndex] = publishedRecord;
    else regionalPublicRecords.unshift(publishedRecord);
    const savedRecords = JSON.parse(
      sessionStorage.getItem("attp-published-records") || "[]",
    ) as PublicRecord[];
    sessionStorage.setItem(
      "attp-published-records",
      JSON.stringify([
        ...savedRecords.filter((record) => record.id !== publishedRecord.id),
        publishedRecord,
      ]),
    );
    application.status = "approved";
    application.reviewNote = null;
    application.published = true;
    setNotice("Đã lưu hồ sơ đạt và công bố trên cổng thông tin.");
  };
  const requestSupplement = () => {
    if (!application || !supplementNote.trim()) {
      setNotice("Vui lòng nhập nội dung yêu cầu bổ sung.");
      return;
    }
    application.status = "needs-more-info";
    application.reviewNote = supplementNote.trim();
    application.published = false;
    setEvaluation("failed");
    setNotice("Đã lưu yêu cầu bổ sung và chuyển hồ sơ về trạng thái cần bổ sung.");
  };
  if (!application)
    return (
      <AdminShell>
        <div className="mx-auto max-w-6xl px-5 py-12">
          <EmptyState
            title="Không tìm thấy hồ sơ"
            description="Hồ sơ có thể đã được di chuyển hoặc không tồn tại."
          />
        </div>
      </AdminShell>
    );
  return (
    <AdminShell>
      <div className="mx-auto max-w-[1480px] px-4 py-6 sm:px-6 lg:px-10 lg:py-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link
            href="/admin"
            className="focus-ring inline-flex items-center gap-2 text-sm font-bold text-[#16604f]"
            data-testid="link-back-admin"
          >
            <ArrowLeft size={16} /> Quay lại danh sách hồ sơ
          </Link>
          <StatusPill status={application.status} />
        </div>
        <section className="mt-5 overflow-hidden rounded-[1.5rem] bg-[#123d36] text-white shadow-xl shadow-[#123d36]/10">
          <div className="flex flex-col gap-6 px-5 py-6 sm:px-7 lg:flex-row lg:items-center lg:justify-between lg:px-9 lg:py-8">
            <div className="flex items-start gap-4">
              <div className="hidden h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-[#f4c95d] sm:flex">
                <Building2 size={27} />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-[#f4c95d]">
                  <span>{application.reference}</span>
                  <span className="text-white/35">•</span>
                  <span>{typeNames[application.type]}</span>
                  <span className="text-white/35">•</span>
                   <span>{application.published ? "Đã công bố" : "Chưa công bố"}</span>
                </div>
                <h1 className="mt-2 max-w-3xl text-2xl font-extrabold tracking-tight sm:text-4xl">
                  {application.applicantName}
                </h1>
                <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-white/65">
                  <span>{application.address}</span>
                  <span>•</span>
                  <span>{application.contact}</span>
                </p>
              </div>
            </div>
             <div className="grid grid-cols-2 gap-3 sm:w-auto sm:min-w-[270px]">
              <div className="rounded-xl bg-white/10 p-3">
                <p className="text-[11px] font-bold uppercase tracking-wider text-white/55">
                  Ngày nộp
                </p>
                <p className="mt-1 text-sm font-bold">
                  {formatDate(application.submittedAt)}
                </p>
              </div>
               <div className="rounded-xl bg-white/10 p-3">
                 <p className="text-[11px] font-bold uppercase tracking-wider text-white/55">
                   Đánh giá
                 </p>
                 <p className="mt-1 text-sm font-bold text-[#f4c95d]">
                   {application.status === "approved"
                     ? "Đạt"
                     : application.status === "needs-more-info"
                       ? "Không đạt"
                       : "Chưa đánh giá"}
                 </p>
               </div>
            </div>
          </div>
        </section>
        <section className="mt-7">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[.16em] text-[#16604f]">
                PHẦN 01 · TIẾP NHẬN
              </p>
              <h2 className="mt-2 text-2xl font-extrabold text-slate-900">
                Thông tin cơ sở đã khai báo
              </h2>
               <p className="mt-1 text-sm text-slate-500">
                 Nội dung được giữ nguyên theo form mà cơ sở đã điền khi đăng ký.
               </p>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600">
              <CheckCircle2 size={14} className="text-emerald-600" /> Đã tiếp
              nhận {formatDate(application.submittedAt)}
            </span>
          </div>
          <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
             <div className="space-y-7">
               {formGroups.map((group) => {
                 const groupCriteria = criteria.filter(
                   (item) => item.groupId === group.id,
                 );
                 if (!groupCriteria.length) return null;
                 return (
                   <div key={group.id}>
                     <h3 className="border-b border-slate-200 pb-2 text-sm font-extrabold text-[#16604f]">
                       {group.name}
                     </h3>
                     <dl className="mt-3 grid gap-x-7 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
                       {groupCriteria.map((item) => (
                         <div key={item.key} className="min-w-0">
                           <dt className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                             {item.label}
                           </dt>
                           <dd className="mt-1.5 break-words text-sm font-bold text-slate-800">
                             {item.answerType === "file"
                               ? application.attachments
                                   .filter((file) => file.fieldKey === item.key)
                                   .map((file) => file.name)
                                   .join(", ") || "—"
                               : formatAnswer(application.data?.[item.key])}
                           </dd>
                         </div>
                       ))}
                     </dl>
                   </div>
                 );
               })}
             </div>
            {application.reviewNote && (
              <div className="mt-6 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                <Info size={17} className="mt-0.5 shrink-0" />
                <p>
                  <strong>Ghi chú đang lưu:</strong> {application.reviewNote}
                </p>
              </div>
            )}
          </div>
        </section>
         <section className="mt-6 rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e7f2ef] text-[#16604f]">
                <ImagePlus size={19} />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-slate-900">
                  Thư viện minh chứng
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Bấm vào ảnh hoặc file để xem chi tiết.
                </p>
              </div>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
              {application.attachments.length} tệp
            </span>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
             {application.attachments.map((file) => (
              <button
                type="button"
                key={file.name}
                 onClick={() => setNotice(`Tệp minh chứng: ${file.name}`)}
                className="group flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 text-left transition hover:border-[#16604f]/30 hover:bg-[#f7faf9]"
                data-testid={`button-preview-attachment-${file.name}`}
              >
                <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-[#e7f2ef]">
                  {file.kind.startsWith("image/") ? (
                    <img
                      src={heroFoodImage}
                      alt={file.name}
                      className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-[#16604f]">
                      <FileText size={23} />
                    </div>
                  )}
                </div>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-bold text-slate-800">
                    {file.name}
                  </span>
                  <span className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                    <Eye size={13} /> {(file.size / 1024 / 1024).toFixed(1)}MB ·
                    Xem
                  </span>
                </span>
              </button>
            ))}
          </div>
        </section>
        <section className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_350px]">
           <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
             <p className="text-xs font-bold uppercase tracking-[.16em] text-[#16604f]">
               PHẦN 03 · ĐÁNH GIÁ
             </p>
             <h2 className="mt-2 text-xl font-extrabold text-slate-900">
               Kết quả xử lý hồ sơ
             </h2>
             <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
               Cán bộ chọn kết quả đánh giá dựa trên nội dung form và minh chứng
               cơ sở đã cung cấp.
             </p>
             <div className="mt-6 rounded-2xl border border-[#16604f]/15 bg-[#f7faf9] p-5">
               <label className="block">
                 <span className="mb-2 block text-sm font-bold text-slate-700">
                   Đánh giá
                 </span>
                 <select
                   value={evaluation}
                   onChange={(event) =>
                     setEvaluation(event.target.value as "" | "passed" | "failed")
                   }
                   className="focus-ring h-12 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-bold"
                   data-testid="select-application-evaluation"
                 >
                   <option value="">Chọn kết quả đánh giá</option>
                   <option value="passed">Đạt</option>
                   <option value="failed">Không đạt</option>
                 </select>
               </label>
             </div>
           </div>
          <aside className="h-fit rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm lg:sticky lg:top-6">
            <p className="text-xs font-bold uppercase tracking-[.16em] text-[#16604f]">
               THAO TÁC CÁN BỘ
            </p>
            <h2 className="mt-2 text-xl font-extrabold text-slate-900">
               Lưu và công bố
            </h2>
             {evaluation === "failed" && (
               <label className="mt-5 block">
                 <span className="mb-2 block text-sm font-bold text-slate-700">
                   Nội dung yêu cầu bổ sung
                 </span>
                 <textarea
                   value={supplementNote}
                   onChange={(event) => setSupplementNote(event.target.value)}
                   placeholder="Nhập rõ giấy tờ hoặc thông tin cơ sở cần bổ sung..."
                   className="focus-ring min-h-32 w-full rounded-xl border border-slate-200 p-3 text-sm"
                   data-testid="textarea-supplement-request"
                 />
               </label>
             )}
             <div className="mt-5 space-y-2">
              <button
                type="button"
                 onClick={() => {
                   if (!evaluation) {
                     setNotice("Vui lòng chọn kết quả trong trường Đánh giá.");
                     return;
                   }
                   if (evaluation === "passed") publish();
                   else requestSupplement();
                 }}
                className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#16604f] px-4 text-sm font-bold text-white shadow-sm hover:bg-[#123d36]"
                 data-testid="button-review-save-and-publish"
              >
                 <Check size={16} />{" "}
                 {evaluation === "passed" ? "Lưu hồ sơ và công bố" : "Lưu yêu cầu bổ sung"}
              </button>
            </div>
            <p className="mt-4 text-xs leading-5 text-slate-500">
               Nếu chọn “Đạt”, hồ sơ được lưu và xuất hiện trong danh sách công
               khai. Nếu chọn “Không đạt”, cán bộ phải nhập nội dung yêu cầu bổ
               sung.
            </p>
          </aside>
        </section>
      </div>
      {notice && <Notice message={notice} onClose={() => setNotice("")} />}
    </AdminShell>
  );
}

function ReviewPanel({
  application,
}: {
  application: { submittedAt: string; score: number; isThirdParty: boolean };
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ClipboardCheck size={19} className="text-primary" />
          <h2 className="text-lg font-extrabold">Tóm tắt xét duyệt</h2>
        </div>
        {application.isThirdParty && (
          <span className="rounded-full bg-accent/40 px-3 py-1 text-xs font-bold text-accent-foreground">
            Bên thứ ba chưa xác minh
          </span>
        )}
      </div>
      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        <div>
          <p className="text-xs text-muted-foreground">Ngày nộp</p>
          <p className="mt-1 font-semibold">
            {formatDate(application.submittedAt)}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Điểm đang có</p>
          <p className="mt-1 font-mono font-bold text-primary">
            {application.score}/100
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Tình trạng</p>
          <p className="mt-1 font-semibold">Cần cán bộ xử lý</p>
        </div>
      </div>
    </div>
  );
}
function AttachmentPanel({ attachments }: { attachments: Attachment[] }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="flex items-center gap-3">
        <FileText size={19} className="text-primary" />
        <h2 className="text-lg font-extrabold">Tệp đính kèm</h2>
        <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-bold text-primary">
          {attachments?.length ?? 0}
        </span>
      </div>
      <div className="mt-4 space-y-2">
        {attachments?.length ? (
          attachments.map((file) => (
            <div
              key={file.name}
              className="flex items-center justify-between rounded-xl bg-muted/70 px-3 py-3 text-sm"
            >
              <span className="flex min-w-0 items-center gap-2 truncate">
                <FileText size={16} className="shrink-0 text-primary" />
                {file.name}
              </span>
              <span className="ml-4 shrink-0 font-mono text-xs text-muted-foreground">
                {(file.size / 1024 / 1024).toFixed(1)}MB
              </span>
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground">
            Không có tệp đính kèm.
          </p>
        )}
      </div>
    </div>
  );
}

export function AdminPlaceholder({
  kind,
}: {
  kind: "accounts" | "reports" | "incidents";
}) {
  const isAccounts = kind === "accounts";
  const isIncidents = kind === "incidents";
  return (
    <AdminShell>
      <div className="mx-auto max-w-5xl px-5 py-12 lg:px-10">
        <SectionHeading
          eyebrow="Khu vực quản trị"
          title={
            isAccounts
              ? "Quản lý tài khoản"
              : isIncidents
                ? "Quản lý và xử lý sự cố ATTP"
                : "Báo cáo thống kê"
          }
          description={
            isAccounts
              ? "Quản lý tài khoản cán bộ và phân quyền truy cập hệ thống."
              : isIncidents
                ? "Theo dõi và xử lý sự cố an toàn thực phẩm."
                : "Tổng hợp số liệu tiếp nhận, xét duyệt và công khai hồ sơ."
          }
        />
        <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary text-primary">
            {isAccounts ? (
              <Users size={25} />
            ) : isIncidents ? (
              <TriangleAlertIcon size={25} />
            ) : (
              <BarChart3Icon size={25} />
            )}
          </div>
          <h2 className="mt-5 text-xl font-extrabold">
            Khu vực đang được hoàn thiện
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
            Mục menu đã sẵn sàng để kết nối với phân hệ{" "}
            {isAccounts
              ? "tài khoản và phân quyền"
              : isIncidents
                ? "xử lý sự cố ATTP"
                : "báo cáo, xuất dữ liệu"}{" "}
            trong phiên bản tiếp theo.
          </p>
        </div>
      </div>
    </AdminShell>
  );
}
function BarChart3Icon({ size }: { size: number }) {
  return <BarChart3 size={size} />;
}
function TriangleAlertIcon({ size }: { size: number }) {
  return <TriangleAlert size={size} />;
}
