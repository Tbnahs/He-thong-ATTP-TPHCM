export type ApplicationType = "food-supplier" | "meal-provider" | "school";
export type CriteriaAnswerType =
  | "text"
  | "number"
  | "date"
  | "yes-no"
  | "select"
  | "multi-select"
  | "file"
  | "repeatable";
export type ListPublicRecordsCategory =
  | "eligible-facilities"
  | "self-declared-products"
  | "registered-products"
  | "licensed-advertising"
  | "testing-facilities";
export type ApplicationStatus =
  | "pending"
  | "needs-more-info"
  | "approved"
  | "warning"
  | "stopped"
  | "rejected";
export type ReviewAction = "approve" | "needs-more-info" | "reject";

export interface Attachment {
  name: string;
  kind: string;
  size: number;
  fieldKey?: string;
}
export interface CriteriaSource {
  id: string;
  name: string;
  kind: string;
  size: number;
}
export interface CriteriaGroup {
  id: string;
  name: string;
  order: number;
}
export interface CriteriaDefinition {
  id: string;
  key: string;
  label: string;
  description: string;
  groupId: string;
  answerType: CriteriaAnswerType;
  options: string[];
  maxScore: number;
  required: boolean;
  active: boolean;
  order: number;
  sourceMaterials: CriteriaSource[];
  dependsOn?: {
    key: string;
    equals?: string;
    notEquals?: string;
  };
  repeatableFields?: {
    key: string;
    label: string;
    answerType: Exclude<CriteriaAnswerType, "repeatable">;
    options?: string[];
    required?: boolean;
  }[];
}
export interface CriteriaSet {
  type: ApplicationType;
  version: string;
  effectiveFrom: string;
  totalScore: number;
  groups: CriteriaGroup[];
  criteria: CriteriaDefinition[];
}
export interface CriteriaHistoryEntry {
  id: string;
  type: ApplicationType;
  version: string;
  changedAt: string;
  changedBy: string;
  summary: string;
}
export interface PublicRecord {
  id: string;
  category: ListPublicRecordsCategory;
  title: string;
  subtitle: string;
  location: string;
  status: string;
  publishedAt: string;
  metadata: Record<string, string | number>;
}
export type NewsCategory = "activity" | "event";
export interface NewsItem {
  id: string;
  slug: string;
  category: NewsCategory;
  title: string;
  excerpt: string;
  content: string;
  publishedAt: string;
  views: number;
  image: string;
  readTime: string;
  location?: string;
}
export interface SupplierOption {
  id: string;
  name: string;
  taxCode: string;
}
export interface Application {
  id: string;
  reference: string;
  type: ApplicationType;
  applicantName: string;
  address: string;
  contact: string;
  submittedAt: string;
  status: ApplicationStatus;
  score: number;
  reviewNote: string | null;
  isThirdParty: boolean;
  data: Record<string, unknown>;
  attachments: Attachment[];
  criteriaVersion: string;
  criteriaSnapshot: CriteriaDefinition[];
  criteriaGroups: CriteriaGroup[];
  scoreBreakdown: Record<string, number>;
}
export interface ListApplicationsParams {
  status?: ApplicationStatus;
  search?: string;
}
export interface CriteriaConfigInput {
  applyMode: "now" | "scheduled";
}

const source = (id: string, name: string): CriteriaSource => ({
  id,
  name,
  kind: "text/plain",
  size: 0,
});
const criterion = (
  type: ApplicationType,
  key: string,
  label: string,
  groupId: string,
  answerType: CriteriaAnswerType,
  maxScore: number,
  options: string[] = [],
  extra: Partial<CriteriaDefinition> = {},
): CriteriaDefinition => ({
  id: `${type}-${key}`,
  key,
  label,
  description: "",
  groupId,
  answerType,
  options,
  maxScore,
  required: true,
  active: true,
  order: 0,
  sourceMaterials: [],
  ...extra,
});
const groupList = (type: ApplicationType, names: string[]) =>
  names.map((name, index) => ({
    id: `${type}-group-${index + 1}`,
    name,
    order: index + 1,
  }));

const criteria: Record<ApplicationType, CriteriaSet> = {
  "food-supplier": {
    type: "food-supplier",
    version: "FS-2026.1",
    effectiveFrom: "2026-01-01",
    totalScore: 100,
    groups: groupList("food-supplier", [
      "Thông tin pháp nhân",
      "Hồ sơ pháp lý",
      "Nguồn gốc sản phẩm",
      "Cơ sở vật chất",
      "Quy trình vận hành",
    ]),
    criteria: [
      criterion(
        "food-supplier",
        "applicantName",
        "Tên đơn vị",
        "food-supplier-group-1",
        "text",
        0,
        [],
        { order: 1 },
      ),
      criterion(
        "food-supplier",
        "taxCode",
        "Mã số thuế",
        "food-supplier-group-1",
        "text",
        0,
        [],
        { order: 2 },
      ),
      criterion(
        "food-supplier",
        "address",
        "Địa chỉ đầy đủ",
        "food-supplier-group-1",
        "text",
        0,
        [],
        { order: 3 },
      ),
      criterion(
        "food-supplier",
        "contact",
        "Số điện thoại liên hệ",
        "food-supplier-group-1",
        "text",
        0,
        [],
        { order: 4 },
      ),
      criterion(
        "food-supplier",
        "licenseNumber",
        "Số giấy phép ATTP",
        "food-supplier-group-2",
        "text",
        0,
        [],
        { order: 5 },
      ),
      criterion(
        "food-supplier",
        "licenseIssued",
        "Ngày cấp giấy phép",
        "food-supplier-group-2",
        "date",
        0,
        [],
        { order: 6 },
      ),
      criterion(
        "food-supplier",
        "licenseExpires",
        "Ngày hết hạn giấy phép",
        "food-supplier-group-2",
        "date",
        0,
        [],
        { order: 7 },
      ),
      criterion(
        "food-supplier",
        "businessLicense",
        "Giấy đăng ký kinh doanh",
        "food-supplier-group-2",
        "file",
        0,
        [],
        { order: 8 },
      ),
      criterion(
        "food-supplier",
        "products",
        "Sản phẩm",
        "food-supplier-group-3",
        "repeatable",
        20,
        [],
        {
          order: 9,
          description: "Có thể thêm nhiều sản phẩm. Mỗi sản phẩm cần khai báo đầy đủ thông tin bên dưới.",
          repeatableFields: [
            {
              key: "category",
              label: "Danh mục sản phẩm",
              answerType: "select",
              options: ["Rau củ quả", "Thịt gia súc", "Thủy sản", "Thực phẩm chế biến"],
              required: true,
            },
            { key: "name", label: "Tên sản phẩm", answerType: "text", required: true },
            { key: "gtin", label: "Mã GTIN", answerType: "text" },
            { key: "origin", label: "Vùng trồng / nuôi / khai thác", answerType: "text" },
            { key: "qualityCertificate", label: "Chứng nhận chất lượng", answerType: "file" },
            { key: "supplyContract", label: "Hợp đồng cung cấp", answerType: "file" },
            {
              key: "traceability",
              label: "Có thực hiện truy xuất nguồn gốc (TXNG)",
              answerType: "yes-no",
              options: ["Có", "Không"],
              required: true,
            },
          ],
        },
      ),
      criterion(
        "food-supplier",
        "storageEvidence",
        "Ảnh khu vực bảo quản / kho chứa",
        "food-supplier-group-4",
        "file",
        25,
        [],
        { order: 10 },
      ),
      criterion(
        "food-supplier",
        "transportEvidence",
        "Ảnh phương tiện vận chuyển",
        "food-supplier-group-4",
        "file",
        10,
        [],
        { order: 11, required: false },
      ),
      criterion(
        "food-supplier",
        "safetyProcess",
        "Có quy trình kiểm soát an toàn thực phẩm",
        "food-supplier-group-5",
        "yes-no",
        25,
        ["Có", "Không"],
        { order: 12 },
      ),
    ],
  },
  "meal-provider": {
    type: "meal-provider",
    version: "MP-2026.1",
    effectiveFrom: "2026-01-01",
    totalScore: 100,
    groups: groupList("meal-provider", [
      "Thông tin pháp nhân",
      "Hồ sơ pháp lý",
      "Nhân lực",
      "Nguồn nhập",
      "Năng lực cung ứng & vận chuyển",
      "Minh chứng",
    ]),
    criteria: [
      criterion(
        "meal-provider",
        "applicantName",
        "Tên đơn vị",
        "meal-provider-group-1",
        "text",
        0,
        [],
        { order: 1 },
      ),
      criterion(
        "meal-provider",
        "taxCode",
        "Mã số thuế",
        "meal-provider-group-1",
        "text",
        0,
        [],
        { order: 2 },
      ),
      criterion(
        "meal-provider",
        "address",
        "Địa chỉ đầy đủ",
        "meal-provider-group-1",
        "text",
        0,
        [],
        { order: 3 },
      ),
      criterion(
        "meal-provider",
        "contact",
        "Số điện thoại liên hệ",
        "meal-provider-group-1",
        "text",
        0,
        [],
        { order: 4 },
      ),
      criterion(
        "meal-provider",
        "licenseNumber",
        "Số giấy phép ATTP",
        "meal-provider-group-2",
        "text",
        0,
        [],
        { order: 5 },
      ),
      criterion(
        "meal-provider",
        "licenseIssued",
        "Ngày cấp giấy phép",
        "meal-provider-group-2",
        "date",
        0,
        [],
        { order: 6 },
      ),
      criterion(
        "meal-provider",
        "licenseExpires",
        "Ngày hết hạn giấy phép",
        "meal-provider-group-2",
        "date",
        0,
        [],
        { order: 7 },
      ),
      criterion(
        "meal-provider",
        "businessLicense",
        "Giấy đăng ký kinh doanh",
        "meal-provider-group-2",
        "file",
        0,
        [],
        { order: 8 },
      ),
      criterion(
        "meal-provider",
        "staffTotal",
        "Tổng số nhân viên chế biến",
        "meal-provider-group-3",
        "number",
        20,
        [],
        { order: 9 },
      ),
      criterion(
        "meal-provider",
        "staffTrained",
        "Nhân viên có chứng chỉ tập huấn ATTP",
        "meal-provider-group-3",
        "number",
        20,
        [],
        { order: 10 },
      ),
      criterion(
        "meal-provider",
        "staffHealth",
        "Nhân viên có khám sức khỏe còn hiệu lực",
        "meal-provider-group-3",
        "number",
        20,
        [],
        { order: 11 },
      ),
      criterion(
        "meal-provider",
        "foodSafetyManagerName",
        "Người phụ trách quản lý ATTP — Họ tên",
        "meal-provider-group-3",
        "text",
        0,
        [],
        { order: 12 },
      ),
      criterion(
        "meal-provider",
        "foodSafetyManagerTitle",
        "Người phụ trách quản lý ATTP — Chức vụ",
        "meal-provider-group-3",
        "text",
        0,
        [],
        { order: 13 },
      ),
      criterion(
        "meal-provider",
        "foodSafetyManagerPhone",
        "Người phụ trách quản lý ATTP — Số điện thoại",
        "meal-provider-group-3",
        "text",
        0,
        [],
        { order: 14 },
      ),
      criterion(
        "meal-provider",
        "managerTrainingCertificate",
        "Chứng chỉ/xác nhận tập huấn ATTP",
        "meal-provider-group-3",
        "file",
        0,
        [],
        { order: 15, required: false },
      ),
      criterion(
        "meal-provider",
        "suppliers",
        "Nhà cung cấp thực phẩm",
        "meal-provider-group-4",
        "repeatable",
        15,
        [],
        {
          order: 16,
          description: "Có thể thêm nhiều nhà cung cấp.",
          repeatableFields: [
            { key: "name", label: "Tên nhà cung cấp", answerType: "text", required: true },
            { key: "taxCode", label: "Mã số thuế", answerType: "text", required: true },
            { key: "contract", label: "Hợp đồng cung cấp", answerType: "file" },
          ],
        },
      ),
      criterion(
        "meal-provider",
        "dailyCapacity",
        "Công suất suất ăn mỗi ngày",
        "meal-provider-group-5",
        "number",
        15,
        [],
        { order: 17 },
      ),
      criterion(
        "meal-provider",
        "vehicleType",
        "Phương tiện giao suất ăn — Loại phương tiện",
        "meal-provider-group-5",
        "select",
        0,
        ["Xe tải bảo ôn", "Xe máy có thùng chuyên dụng", "Xe chuyên dụng khác"],
        { order: 18 },
      ),
      criterion(
        "meal-provider",
        "vehicleCount",
        "Phương tiện giao suất ăn — Số lượng phương tiện",
        "meal-provider-group-5",
        "number",
        0,
        [],
        { order: 19 },
      ),
      criterion(
        "meal-provider",
        "deliveryVehiclePhoto",
        "Ảnh phương tiện giao suất ăn",
        "meal-provider-group-5",
        "file",
        0,
        [],
        { order: 20 },
      ),
      criterion(
        "meal-provider",
        "hasSampleCabinet",
        "Tủ lưu mẫu thức ăn — Có / Không tủ lưu mẫu",
        "meal-provider-group-5",
        "yes-no",
        0,
        ["Có", "Không"],
        { order: 21 },
      ),
      criterion(
        "meal-provider",
        "sampleCabinetCount",
        "Số lượng tủ lưu mẫu",
        "meal-provider-group-5",
        "number",
        0,
        [],
        { order: 22, required: false, dependsOn: { key: "hasSampleCabinet", equals: "Có" } },
      ),
      criterion(
        "meal-provider",
        "sampleCabinetPhoto",
        "Ảnh tủ lưu mẫu",
        "meal-provider-group-5",
        "file",
        0,
        [],
        { order: 23, required: false, dependsOn: { key: "hasSampleCabinet", equals: "Có" } },
      ),
      criterion(
        "meal-provider",
        "evidence",
        "Ảnh khu chế biến, thiết bị và bảo hộ",
        "meal-provider-group-6",
        "file",
        10,
        [],
        { order: 24 },
      ),
    ],
  },
  school: {
    type: "school",
    version: "SC-2026.1",
    effectiveFrom: "2026-01-01",
    totalScore: 100,
    groups: groupList("school", [
      "Thông tin cơ bản",
      "Hồ sơ pháp lý",
      "Trách nhiệm ATTP",
      "Tổ chức bữa ăn",
      "Cơ sở vật chất",
      "Minh chứng",
    ]),
    criteria: [
      criterion(
        "school",
        "applicantName",
        "Tên trường",
        "school-group-1",
        "text",
        0,
        [],
        { order: 1 },
      ),
      criterion(
        "school",
        "schoolLevel",
        "Cấp học",
        "school-group-1",
        "select",
        0,
        ["Mầm non", "Tiểu học", "THCS", "THPT"],
        { order: 2 },
      ),
      criterion(
        "school",
        "address",
        "Địa chỉ",
        "school-group-1",
        "text",
        0,
        [],
        { order: 3 },
      ),
      criterion(
        "school",
        "contact",
        "Số điện thoại liên hệ",
        "school-group-1",
        "text",
        0,
        [],
        { order: 4 },
      ),
      criterion(
        "school",
        "licenseNumber",
        "Số giấy phép ATTP",
        "school-group-2",
        "text",
        0,
        [],
        { order: 5 },
      ),
      criterion(
        "school",
        "licenseIssued",
        "Ngày cấp giấy phép",
        "school-group-2",
        "date",
        0,
        [],
        { order: 6 },
      ),
      criterion(
        "school",
        "licenseExpires",
        "Ngày hết hạn giấy phép",
        "school-group-2",
        "date",
        0,
        [],
        { order: 7 },
      ),
      criterion(
        "school",
        "schoolDecision",
        "Quyết định thành lập / giấy tờ pháp lý",
        "school-group-2",
        "file",
        0,
        [],
        { order: 8 },
      ),
      criterion(
        "school",
        "hasFoodSafetyLead",
        "Có cán bộ phụ trách ATTP",
        "school-group-3",
        "yes-no",
        15,
        ["Có", "Không"],
        { order: 9 },
      ),
      criterion(
        "school",
        "foodSafetyLeadName",
        "Người phụ trách ATTP — Họ tên",
        "school-group-3",
        "text",
        0,
        [],
        { order: 10, dependsOn: { key: "hasFoodSafetyLead", equals: "Có" } },
      ),
      criterion(
        "school",
        "foodSafetyLeadTitle",
        "Người phụ trách ATTP — Chức vụ",
        "school-group-3",
        "text",
        0,
        [],
        { order: 11, dependsOn: { key: "hasFoodSafetyLead", equals: "Có" } },
      ),
      criterion(
        "school",
        "foodSafetyLeadPhone",
        "Người phụ trách ATTP — Số điện thoại",
        "school-group-3",
        "text",
        0,
        [],
        { order: 12, dependsOn: { key: "hasFoodSafetyLead", equals: "Có" } },
      ),
      criterion(
        "school",
        "foodSafetyLeadCertificate",
        "Chứng chỉ tập huấn ATTP",
        "school-group-3",
        "file",
        0,
        [],
        { order: 13, required: false, dependsOn: { key: "hasFoodSafetyLead", equals: "Có" } },
      ),
      criterion(
        "school",
        "mealModel",
        "Hình thức tổ chức bữa ăn",
        "school-group-4",
        "select",
        20,
        ["Tự nấu", "Liên kết đơn vị suất ăn", "Thuê đơn vị nấu tại bếp trường"],
        { order: 14 },
      ),
      criterion(
        "school",
        "selfCookStaffTotal",
        "Tổng số nhân viên chế biến",
        "school-group-4",
        "number",
        0,
        [],
        { order: 15, dependsOn: { key: "mealModel", equals: "Tự nấu" } },
      ),
      criterion(
        "school",
        "selfCookStaffTrained",
        "Nhân viên có chứng chỉ tập huấn ATTP",
        "school-group-4",
        "number",
        0,
        [],
        { order: 16, dependsOn: { key: "mealModel", equals: "Tự nấu" } },
      ),
      criterion(
        "school",
        "selfCookStaffHealth",
        "Nhân viên có khám sức khỏe còn hiệu lực",
        "school-group-4",
        "number",
        0,
        [],
        { order: 17, dependsOn: { key: "mealModel", equals: "Tự nấu" } },
      ),
      criterion(
        "school",
        "hiredKitchenName",
        "Tên đơn vị nấu tại bếp trường",
        "school-group-4",
        "text",
        0,
        [],
        { order: 18, dependsOn: { key: "mealModel", equals: "Thuê đơn vị nấu tại bếp trường" } },
      ),
      criterion(
        "school",
        "hiredKitchenTaxCode",
        "Mã số thuế đơn vị nấu tại bếp trường",
        "school-group-4",
        "text",
        0,
        [],
        { order: 19, dependsOn: { key: "mealModel", equals: "Thuê đơn vị nấu tại bếp trường" } },
      ),
      criterion(
        "school",
        "hiredKitchenStaffCount",
        "Số lượng nhân sự",
        "school-group-4",
        "number",
        0,
        [],
        { order: 20, dependsOn: { key: "mealModel", equals: "Thuê đơn vị nấu tại bếp trường" } },
      ),
      criterion(
        "school",
        "hiredKitchenContract",
        "Hợp đồng",
        "school-group-4",
        "file",
        0,
        [],
        { order: 21, dependsOn: { key: "mealModel", equals: "Thuê đơn vị nấu tại bếp trường" } },
      ),
      criterion(
        "school",
        "linkedMealProviderName",
        "Tên đơn vị cung cấp suất ăn",
        "school-group-4",
        "text",
        0,
        [],
        { order: 22, dependsOn: { key: "mealModel", equals: "Liên kết đơn vị suất ăn" } },
      ),
      criterion(
        "school",
        "linkedMealProviderTaxCode",
        "Mã số thuế đơn vị cung cấp suất ăn",
        "school-group-4",
        "text",
        0,
        [],
        { order: 23, dependsOn: { key: "mealModel", equals: "Liên kết đơn vị suất ăn" } },
      ),
      criterion(
        "school",
        "linkedMealProviderContract",
        "Hợp đồng",
        "school-group-4",
        "file",
        0,
        [],
        { order: 24, dependsOn: { key: "mealModel", equals: "Liên kết đơn vị suất ăn" } },
      ),
      criterion(
        "school",
        "deliveryReception",
        "Phương tiện giao/nhận suất ăn tại trường",
        "school-group-4",
        "text",
        0,
        [],
        {
          order: 25,
          description: "Khai báo loại phương tiện và khung giờ giao nhận.",
          dependsOn: { key: "mealModel", notEquals: "Tự nấu" },
        },
      ),
      criterion(
        "school",
        "kitchenOneWay",
        "Bếp ăn theo nguyên tắc một chiều",
        "school-group-5",
        "yes-no",
        25,
        ["Có", "Không"],
        { order: 26 },
      ),
      criterion(
        "school",
        "sampleStorage",
        "Có khu lưu mẫu thức ăn",
        "school-group-5",
        "yes-no",
        25,
        ["Có", "Không"],
        { order: 27 },
      ),
      criterion(
        "school",
        "sampleCabinetCount",
        "Tủ lưu mẫu thức ăn — Số lượng tủ lưu mẫu",
        "school-group-5",
        "number",
        0,
        [],
        { order: 28, required: false, dependsOn: { key: "sampleStorage", equals: "Có" } },
      ),
      criterion(
        "school",
        "sampleCabinetPhoto",
        "Ảnh tủ lưu mẫu",
        "school-group-5",
        "file",
        0,
        [],
        { order: 29, required: false, dependsOn: { key: "sampleStorage", equals: "Có" } },
      ),
      criterion(
        "school",
        "kitchenEvidence",
        "Ảnh bếp ăn / căn tin và khu lưu mẫu",
        "school-group-6",
        "file",
        15,
        [],
        { order: 30 },
      ),
    ],
  },
};

export const publicRecords: PublicRecord[] = [
  {
    id: "record-001",
    category: "eligible-facilities",
    title: "Công ty TNHH Nông sản An Phú",
    subtitle: "Cơ sở đủ điều kiện an toàn thực phẩm",
    location: "Quận 7, TP.HCM",
    status: "active",
    publishedAt: "2026-08-14",
    metadata: {
      "Mã số thuế": "0312345678",
      "Số giấy phép": "ATTP-2026-088",
      "Nhóm sản phẩm": "Rau củ quả, thịt gia súc",
    },
  },
  {
    id: "record-002",
    category: "eligible-facilities",
    title: "Bếp ăn tập thể Trường Tiểu học Nguyễn Bỉnh Khiêm",
    subtitle: "Cơ sở giáo dục có bếp ăn đủ điều kiện",
    location: "Quận 1, TP.HCM",
    status: "active",
    publishedAt: "2026-07-28",
    metadata: {
      "Loại hình": "Cơ sở giáo dục",
      "Ngày kiểm tra": "28/07/2026",
      "Kết quả": "Đạt",
    },
  },
  {
    id: "record-003",
    category: "self-declared-products",
    title: "Nước ép trái cây Green Farm",
    subtitle: "Sản phẩm tự công bố",
    location: "TP. Thủ Đức, TP.HCM",
    status: "active",
    publishedAt: "2026-06-19",
    metadata: {
      "Đơn vị công bố": "Green Farm Việt Nam",
      "Số tiếp nhận": "TCCB-2026-031",
    },
  },
  {
    id: "record-004",
    category: "registered-products",
    title: "Sữa hạt dinh dưỡng Oat & Seed",
    subtitle: "Sản phẩm đã đăng ký bản công bố",
    location: "Quận Bình Thạnh, TP.HCM",
    status: "active",
    publishedAt: "2026-05-22",
    metadata: {
      "Số bản công bố": "CB-2026-114",
      "Nhóm sản phẩm": "Thực phẩm dinh dưỡng",
    },
  },
  {
    id: "record-005",
    category: "testing-facilities",
    title: "Trung tâm Kiểm nghiệm Nam Sài Gòn",
    subtitle: "Cơ sở kiểm nghiệm được công nhận",
    location: "Quận 4, TP.HCM",
    status: "active",
    publishedAt: "2026-04-08",
    metadata: {
      "Phạm vi": "Thực phẩm và nước uống",
      "Mã công nhận": "VILAS 1420",
    },
  },
];

export const newsItems: NewsItem[] = [
  {
    id: "news-001",
    slug: "huong-dan-chuyen-mon-chi-thi-33",
    category: "activity",
    title:
      "Sở An toàn thực phẩm tổ chức lớp hướng dẫn chuyên môn triển khai Chỉ thị số 33/CT-TTg",
    excerpt:
      "Cập nhật cách triển khai các nhiệm vụ tăng cường bảo đảm an toàn thực phẩm trong cơ sở giáo dục trên địa bàn Thành phố.",
    content:
      "Sáng ngày 08/9/2026, Sở An toàn thực phẩm Thành phố Hồ Chí Minh tổ chức lớp hướng dẫn chuyên môn nhằm triển khai thực hiện Chỉ thị số 33/CT-TTg ngày 14/8/2026 của Thủ tướng Chính phủ và Công văn số 7916/UBND-VX ngày 26/8/2026 của Ủy ban nhân dân Thành phố về việc tăng cường bảo đảm an toàn thực phẩm trong cơ sở giáo dục. Chương trình tập trung vào việc rà soát điều kiện bếp ăn, kiểm soát nguồn nguyên liệu và nâng cao trách nhiệm phối hợp giữa nhà trường, đơn vị cung cấp suất ăn và cơ quan quản lý.",
    publishedAt: "2026-09-09",
    views: 86,
    image: "/generated_images/news-training-workshop.jpg",
    readTime: "4 phút đọc",
    location: "Hội trường Sở An toàn thực phẩm",
  },
  {
    id: "news-002",
    slug: "doan-cong-tac-khao-sat-an-toan-thuc-pham",
    category: "activity",
    title:
      "Đoàn công tác Ủy ban Khoa học, Công nghệ và Môi trường khảo sát thực tế tại Thành phố",
    excerpt:
      "Đoàn công tác khảo sát trực tiếp tại doanh nghiệp sản xuất, hệ thống phân phối và chợ đầu mối trên địa bàn Thành phố.",
    content:
      "Ngày 27/8/2026, Đoàn công tác của Thường trực Ủy ban Khoa học, Công nghệ và Môi trường do đồng chí Nguyễn Phương Tuấn, Phó Chủ nhiệm Ủy ban làm Trưởng đoàn đã tiến hành khảo sát thực tế tại các doanh nghiệp sản xuất, hệ thống phân phối lớn cũng như chợ đầu mối trên địa bàn Thành phố Hồ Chí Minh. Hoạt động góp phần ghi nhận thực tiễn quản lý, sản xuất và phân phối thực phẩm để phục vụ công tác thẩm tra dự án Luật An toàn thực phẩm (sửa đổi).",
    publishedAt: "2026-08-28",
    views: 140,
    image: "/generated_images/news-market-inspection.jpg",
    readTime: "5 phút đọc",
    location: "Chợ đầu mối và cơ sở sản xuất",
  },
  {
    id: "news-003",
    slug: "tap-huan-an-toan-thuc-pham-banh-trung-thu",
    category: "event",
    title:
      "Lớp tập huấn an toàn thực phẩm cho cơ sở sản xuất, kinh doanh bánh Trung thu năm 2026",
    excerpt:
      "Chương trình giúp các cơ sở chủ động phòng ngừa ngộ độc thực phẩm và bảo vệ sức khỏe người tiêu dùng dịp Tết Trung thu.",
    content:
      "Sáng ngày 27/8/2026, Sở An toàn thực phẩm Thành phố Hồ Chí Minh tổ chức lớp tập huấn kiến thức an toàn thực phẩm cho các cơ sở sản xuất, kinh doanh bánh Trung thu trên địa bàn Thành phố theo hình thức trực tiếp và trực tuyến. Nội dung tập huấn bám sát chỉ đạo của Cục An toàn thực phẩm, tập trung vào kiểm soát nguyên liệu, điều kiện sản xuất, ghi nhãn và lưu mẫu sản phẩm.",
    publishedAt: "2026-08-28",
    views: 204,
    image: "/generated_images/news-food-service-training.jpg",
    readTime: "3 phút đọc",
    location: "Trực tiếp và trực tuyến",
  },
  {
    id: "news-004",
    slug: "tap-huan-co-so-kinh-doanh-dich-vu-an-uong",
    category: "event",
    title:
      "Tăng cường kiến thức an toàn thực phẩm cho cơ sở kinh doanh dịch vụ ăn uống",
    excerpt:
      "Gần 1.600 cơ sở kinh doanh dịch vụ ăn uống, thức ăn đường phố và bếp ăn từ thiện cùng tham gia chương trình.",
    content:
      "Sáng ngày 20/8/2026, tại Hội trường Sở An toàn thực phẩm Thành phố Hồ Chí Minh đã tổ chức lớp tập huấn kiến thức an toàn thực phẩm cho các cơ sở kinh doanh dịch vụ ăn uống trên địa bàn Thành phố. Lớp tập huấn được tổ chức trực tiếp tại Sở và kết nối trực tuyến đến 168 phường, xã, đặc khu, với sự tham dự của 350 cán bộ phụ trách công tác an toàn thực phẩm, thành viên Ban Chỉ đạo liên ngành về an toàn thực phẩm và gần 1.600 cơ sở kinh doanh.",
    publishedAt: "2026-08-24",
    views: 200,
    image: "/generated_images/news-training-workshop.jpg",
    readTime: "4 phút đọc",
    location: "168 phường, xã, đặc khu",
  },
];

export const suppliers: SupplierOption[] = [
  {
    id: "supplier-001",
    name: "Công ty TNHH Nông sản An Phú",
    taxCode: "0312345678",
  },
  {
    id: "supplier-002",
    name: "Hợp tác xã Rau sạch Củ Chi",
    taxCode: "0319876543",
  },
];

export const criteriaHistory: Record<ApplicationType, CriteriaHistoryEntry[]> =
  { "food-supplier": [], "meal-provider": [], school: [] };
export const getCriteriaSet = (type: ApplicationType): CriteriaSet =>
  structuredClone(criteria[type]);
export const getPublicRecords = (search = "", category = "") =>
  publicRecords.filter(
    (item) =>
      (!category || item.category === category) &&
      (!search ||
        `${item.title} ${item.subtitle} ${item.location}`
          .toLowerCase()
          .includes(search.toLowerCase())),
  );

const applicationCriteria = getCriteriaSet("food-supplier");
export const applications: Application[] = [
  {
    id: "app-001",
    reference: "HS-2026-0042",
    type: "food-supplier",
    applicantName: "Công ty TNHH Nông sản An Phú",
    address: "184 Nguyễn Văn Linh, Quận 7, TP.HCM",
    contact: "0908 123 456",
    submittedAt: "2026-08-18T08:30:00+07:00",
    status: "pending",
    score: 78,
    reviewNote: null,
    isThirdParty: false,
    criteriaVersion: applicationCriteria.version,
    criteriaSnapshot: applicationCriteria.criteria,
    criteriaGroups: applicationCriteria.groups,
    data: {
      applicantName: "Công ty TNHH Nông sản An Phú",
      taxCode: "0312345678",
      address: "184 Nguyễn Văn Linh, Quận 7, TP.HCM",
      contact: "0908 123 456",
      licenseNumber: "ATTP-2026-088",
      productGroups: ["Rau củ quả", "Thịt gia súc"],
      origin: "Hợp tác xã rau sạch Củ Chi",
      safetyProcess: "Có",
    },
    attachments: [
      {
        name: "giay-phep-attp.pdf",
        kind: "application/pdf",
        size: 420000,
        fieldKey: "businessLicense",
      },
      {
        name: "kho-bao-quan-01.jpg",
        kind: "image/jpeg",
        size: 1800000,
        fieldKey: "storageEvidence",
      },
    ],
    scoreBreakdown: {
      productGroups: 16,
      origin: 8,
      storageEvidence: 20,
      safetyProcess: 25,
    },
  },
  {
    id: "app-002",
    reference: "HS-2026-0037",
    type: "school",
    applicantName: "Trường Mầm non Hoa Sen",
    address: "35 Nguyễn Du, Quận 1, TP.HCM",
    contact: "028 3822 4567",
    submittedAt: "2026-08-12T14:10:00+07:00",
    status: "needs-more-info",
    score: 82,
    reviewNote: "Cần bổ sung ảnh khu lưu mẫu thức ăn.",
    isThirdParty: true,
    criteriaVersion: "SC-2026.1",
    criteriaSnapshot: getCriteriaSet("school").criteria,
    criteriaGroups: getCriteriaSet("school").groups,
    data: {
      applicantName: "Trường Mầm non Hoa Sen",
      schoolLevel: "Mầm non",
      address: "35 Nguyễn Du, Quận 1, TP.HCM",
      contact: "028 3822 4567",
      hasFoodSafetyLead: "Có",
      mealModel: "Liên kết đơn vị suất ăn",
      kitchenOneWay: "Có",
      sampleStorage: "Có",
    },
    attachments: [
      {
        name: "quyet-dinh-thanh-lap.pdf",
        kind: "application/pdf",
        size: 510000,
        fieldKey: "schoolDecision",
      },
    ],
    scoreBreakdown: {
      hasFoodSafetyLead: 15,
      mealModel: 18,
      kitchenOneWay: 24,
      sampleStorage: 25,
    },
  },
];
