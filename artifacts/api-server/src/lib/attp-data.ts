import {
  CreateApplicationBody,
  ReviewApplicationBody,
} from "@workspace/api-zod";
import type { CriteriaDefinition, CriteriaGroup } from "@workspace/api-zod";
import { getCriteria } from "./criteria-data";

export type Application = {
  id: string;
  reference: string;
  type: "food-supplier" | "meal-provider" | "school";
  applicantName: string;
  address: string;
  contact: string;
  submittedAt: string;
  status: "pending" | "needs-more-info" | "approved" | "warning" | "stopped" | "rejected";
  score: number;
  reviewNote: string | null;
  isThirdParty: boolean;
  data: Record<string, unknown>;
  attachments: Array<{ name: string; kind: string; size: number }>;
  criteriaVersion?: string;
  criteriaSnapshot?: CriteriaDefinition[];
  criteriaGroups?: CriteriaGroup[];
  scoreBreakdown?: Record<string, number>;
  prerequisiteResults?: Record<string, boolean>;
};

export type PublicRecord = {
  id: string;
  category:
    | "eligible-facilities"
    | "self-declared-products"
    | "registered-products"
    | "licensed-advertising"
    | "testing-facilities";
  title: string;
  subtitle: string;
  location: string;
  status: string;
  publishedAt: string;
  metadata: Record<string, string>;
};

const publicRecords: PublicRecord[] = [
  {
    id: "cs-001",
    category: "eligible-facilities",
    title: "Công ty TNHH Dịch vụ suất ăn Minh Tâm",
    subtitle: "Cơ sở cung cấp suất ăn công nghiệp",
    location: "TP. Thủ Đức",
    status: "Đang còn hiệu lực",
    publishedAt: "2026-05-30",
    metadata: { "Mã số": "ATTP-2026-001", "Ngày cấp": "30/05/2026" },
  },
  {
    id: "cs-002",
    category: "eligible-facilities",
    title: "Bếp ăn tập thể Trường THPT Nguyễn Du",
    subtitle: "Cơ sở giáo dục",
    location: "Quận 10",
    status: "Đang còn hiệu lực",
    publishedAt: "2026-05-26",
    metadata: { "Mã số": "ATTP-2026-008", "Ngày cấp": "26/05/2026" },
  },
  {
    id: "sp-001",
    category: "self-declared-products",
    title: "Nước ép trái cây nguyên chất Fresh Day",
    subtitle: "Công ty CP Thực phẩm Xanh Sài Gòn",
    location: "Quận Bình Thạnh",
    status: "Đã tiếp nhận tự công bố",
    publishedAt: "2026-05-22",
    metadata: { "Số bản tự công bố": "12/2026/CBSP", "Nhóm": "Đồ uống" },
  },
  {
    id: "sp-002",
    category: "registered-products",
    title: "Sữa dinh dưỡng học đường Grow Plus",
    subtitle: "Công ty TNHH Dinh dưỡng Việt",
    location: "Quận 1",
    status: "Đã cấp giấy tiếp nhận",
    publishedAt: "2026-05-15",
    metadata: { "Số tiếp nhận": "06/2026/ĐKSP", "Nhóm": "Sữa và sản phẩm sữa" },
  },
  {
    id: "qc-001",
    category: "licensed-advertising",
    title: "Thực phẩm bảo vệ sức khỏe Viên sáng mắt",
    subtitle: "Công ty CP Dược phẩm Thành phố",
    location: "Quận 3",
    status: "Được phép quảng cáo",
    publishedAt: "2026-05-11",
    metadata: { "Số giấy phép": "QC-44/2026", "Kênh": "Truyền hình" },
  },
  {
    id: "xn-001",
    category: "testing-facilities",
    title: "Trung tâm Kiểm nghiệm Tân Bình",
    subtitle: "Cơ sở kiểm nghiệm được chỉ định",
    location: "Quận Tân Bình",
    status: "Đang hoạt động",
    publishedAt: "2026-04-28",
    metadata: { "Phạm vi": "Vi sinh, hóa lý", "Số quyết định": "18/QĐ-SATTP" },
  },
];

const applications: Application[] = [
  {
    id: "app-1001",
    reference: "HS-2026-0618",
    type: "food-supplier",
    applicantName: "Công ty TNHH Nông sản An Phú",
    address: "184 Nguyễn Văn Linh, Quận 7, TP.HCM",
    contact: "0908 123 456",
    submittedAt: "2026-06-18T08:45:00.000Z",
    status: "pending",
    score: 0,
    reviewNote: null,
    isThirdParty: false,
    data: {
      taxCode: "0312345678",
      representative: "Nguyễn Hoàng Anh",
      productTypes: ["Rau củ quả", "Thịt gia súc"],
      atppLicense: "ATTP-2026-088",
      atppLicenseExpiry: "2027-06-12",
      growingArea: "Hợp tác xã rau sạch Củ Chi",
    },
    attachments: [
      { name: "giay-phep-attp.pdf", kind: "application/pdf", size: 1834000 },
      { name: "giay-dkkd.pdf", kind: "application/pdf", size: 962000 },
      { name: "kho-bao-quan-01.jpg", kind: "image/jpeg", size: 1240000 },
    ],
  },
  {
    id: "app-1002",
    reference: "HS-2026-0612",
    type: "meal-provider",
    applicantName: "Công ty CP Suất ăn Hướng Dương",
    address: "62 Lê Văn Việt, TP. Thủ Đức, TP.HCM",
    contact: "028 3838 8899",
    submittedAt: "2026-06-17T03:30:00.000Z",
    status: "needs-more-info",
    score: 72,
    reviewNote: "Bổ sung ảnh khu rửa tay và giấy khám sức khỏe còn hiệu lực.",
    isThirdParty: false,
    data: {
      taxCode: "0319876543",
      representative: "Trần Minh Khôi",
      staffCount: 42,
      trainedStaffCount: 39,
      healthCheckedStaffCount: 36,
      dailyCapacity: 3200,
      servedUnits: 8,
    },
    attachments: [
      { name: "giay-phep-attp.pdf", kind: "application/pdf", size: 2140000 },
      { name: "quy-trinh-mot-chieu.jpg", kind: "image/jpeg", size: 1900000 },
      { name: "thiet-bi-luu-mau.png", kind: "image/png", size: 1430000 },
    ],
  },
  {
    id: "app-1003",
    reference: "HS-2026-0604",
    type: "school",
    applicantName: "Trường Tiểu học Lê Quý Đôn",
    address: "12B Võ Văn Tần, Quận 3, TP.HCM",
    contact: "028 3930 1122",
    submittedAt: "2026-06-16T09:10:00.000Z",
    status: "approved",
    score: 91,
    reviewNote: "Hồ sơ đạt yêu cầu.",
    isThirdParty: false,
    data: {
      level: "Tiểu học",
      hasFoodSafetyLead: true,
      foodServiceMode: "linked-provider",
      providerName: "Công ty CP Suất ăn Hướng Dương",
      oneWayKitchen: true,
      sampleStorage: true,
      cafeteriaCapacity: 280,
    },
    attachments: [
      { name: "chung-nhan-tap-huan.pdf", kind: "application/pdf", size: 702000 },
      { name: "bep-an-truong.jpg", kind: "image/jpeg", size: 1350000 },
      { name: "khu-luu-mau.jpg", kind: "image/jpeg", size: 980000 },
    ],
  },
  {
    id: "app-1004",
    reference: "HS-2026-0598",
    type: "school",
    applicantName: "Trường Mầm non Hoa Sen",
    address: "39 Phan Đăng Lưu, Quận Bình Thạnh, TP.HCM",
    contact: "028 3841 6700",
    submittedAt: "2026-06-15T02:20:00.000Z",
    status: "pending",
    score: 0,
    reviewNote: null,
    isThirdParty: true,
    data: {
      level: "Mầm non",
      hasFoodSafetyLead: false,
      foodServiceMode: "external",
      providerName: "Cơ sở Suất ăn Cô Ba",
      providerTaxCode: "Chưa cung cấp",
      oneWayKitchen: false,
      sampleStorage: true,
    },
    attachments: [
      { name: "hop-dong-suat-an.pdf", kind: "application/pdf", size: 1200000 },
      { name: "can-tin.jpg", kind: "image/jpeg", size: 1150000 },
      { name: "khu-luu-mau.jpg", kind: "image/jpeg", size: 860000 },
    ],
  },
];

export function getPublicRecords() {
  return publicRecords;
}

export function getApplications() {
  return applications.map(normalizeApplication);
}

function normalizeApplication(application: Application): Application {
  const criteria = application.criteriaSnapshot ?? getCriteria(application.type).criteria;
  return {
    ...application,
    criteriaVersion: application.criteriaVersion ?? getCriteria(application.type).version,
    criteriaSnapshot: criteria,
    criteriaGroups: application.criteriaGroups ?? getCriteria(application.type).groups,
    scoreBreakdown: application.scoreBreakdown ?? {},
    prerequisiteResults: application.prerequisiteResults ?? {},
  };
}

export function createApplication(
  input: ReturnType<typeof CreateApplicationBody.parse>,
): Application {
  const id = `app-${Math.floor(1000 + Math.random() * 9000)}`;
  const created: Application = {
    id,
    reference: `HS-2026-${String(620 + applications.length).padStart(4, "0")}`,
    type: input.type,
    applicantName: input.applicantName,
    address: input.address,
    contact: input.contact,
    submittedAt: new Date().toISOString(),
    status: "pending",
    score: 0,
    reviewNote: null,
    isThirdParty: input.isThirdParty,
    data: input.data,
    attachments: input.attachments,
    criteriaVersion: input.criteriaVersion,
    criteriaSnapshot: getCriteria(input.type, input.criteriaVersion).criteria,
    criteriaGroups: getCriteria(input.type, input.criteriaVersion).groups,
    scoreBreakdown: {},
    prerequisiteResults: {},
  };
  applications.unshift(created);
  return normalizeApplication(created);
}

export function reviewApplication(
  id: string,
  input: ReturnType<typeof ReviewApplicationBody.parse>,
) {
  const app = applications.find((item) => item.id === id);
  if (!app) return undefined;
  const criteria = app.criteriaSnapshot ?? getCriteria(app.type).criteria;
  const ordinaryCriteria = criteria.filter((item) => item.active && !item.prerequisite);
  const prerequisiteResults = input.prerequisiteResults ?? {};
  const scoreBreakdown = input.criteriaScores ?? {};
  const computedScore = ordinaryCriteria.reduce(
    (sum, item) => sum + Math.min(item.maxScore, Math.max(0, Number(scoreBreakdown[item.key] ?? 0))),
    0,
  );
  const prerequisiteFailed = criteria.some(
    (item) => item.prerequisite && prerequisiteResults[item.key] === false,
  );
  app.status =
    input.action === "needs-more-info"
      ? "needs-more-info"
      : input.action === "reject"
        ? "rejected"
        : prerequisiteFailed
          ? "stopped"
          : computedScore === 100
            ? "approved"
            : computedScore >= 80
              ? "warning"
              : "stopped";
  app.score = input.action === "needs-more-info" ? input.score : Math.round(computedScore);
  app.reviewNote = input.note || null;
  app.scoreBreakdown = scoreBreakdown;
  app.prerequisiteResults = prerequisiteResults;
  return normalizeApplication(app);
}
