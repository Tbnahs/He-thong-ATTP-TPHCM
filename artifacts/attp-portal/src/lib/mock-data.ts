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
  previewUrl?: string;
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
  applicationData?: Record<string, unknown>;
  attachments?: Attachment[];
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
  published?: boolean;
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
      "Đơn vị được cung cấp thực phẩm",
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
        "addressProvince",
        "Chọn Tỉnh / Thành phố",
        "food-supplier-group-1",
        "select",
        0,
        addressProvinceOptions,
        { order: 3 },
      ),
      criterion(
        "food-supplier",
        "addressWard",
        "Chọn Xã / Phường",
        "food-supplier-group-1",
        "select",
        0,
        addressWardOptions,
        { order: 3.1 },
      ),
      criterion(
        "food-supplier",
        "addressDetail",
        "Địa chỉ chi tiết — số nhà, đường/thôn/ấp",
        "food-supplier-group-1",
        "text",
        0,
        [],
        { order: 3.2 },
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
        "email",
        "Email",
        "food-supplier-group-1",
        "text",
        0,
        [],
        { order: 4.1 },
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
          description:
            "Có thể thêm nhiều sản phẩm. Mỗi sản phẩm cần khai báo đầy đủ thông tin bên dưới.",
          repeatableFields: [
            {
              key: "category",
              label: "Danh mục sản phẩm",
              answerType: "select",
              options: [
                "Rau củ quả",
                "Thịt gia súc",
                "Thủy sản",
                "Thực phẩm chế biến",
              ],
              required: true,
            },
            {
              key: "name",
              label: "Tên sản phẩm",
              answerType: "text",
              required: true,
            },
            { key: "gtin", label: "Mã GTIN", answerType: "text" },
            {
              key: "origin",
              label: "Vùng trồng / nuôi / khai thác",
              answerType: "text",
            },
            {
              key: "qualityCertificate",
              label: "Chứng nhận chất lượng",
              answerType: "file",
            },
            {
              key: "supplyContract",
              label: "Hợp đồng cung cấp",
              answerType: "file",
            },
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
        "suppliedUnits",
        "Đơn vị được cung cấp thực phẩm",
        "food-supplier-group-5",
        "repeatable",
        0,
        [],
        {
          order: 10,
          required: false,
          description:
            "Không bắt buộc. Có thể khai báo một hoặc nhiều đơn vị đang được cung cấp thực phẩm.",
          repeatableFields: [
            {
              key: "unitType",
              label: "Loại đơn vị",
              answerType: "select",
              options: [
                "Cơ sở giáo dục",
                "Cơ sở cung cấp suất ăn",
                "Đơn vị khác",
              ],
              required: true,
            },
            {
              key: "name",
              label: "Tên đơn vị",
              answerType: "text",
              required: true,
            },
            {
              key: "taxCode",
              label: "Mã số thuế (nếu có)",
              answerType: "text",
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
      "Nguồn nhập – Nhà cung cấp thực phẩm",
      "Trường học đang phục vụ",
      "Năng lực cung ứng & vận chuyển",
      "Minh chứng – Ảnh khu chế biến, thiết bị",
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
        "addressProvince",
        "Chọn Tỉnh / Thành phố",
        "meal-provider-group-1",
        "select",
        0,
        addressProvinceOptions,
        { order: 3 },
      ),
      criterion(
        "meal-provider",
        "addressWard",
        "Chọn Xã / Phường",
        "meal-provider-group-1",
        "select",
        0,
        addressWardOptions,
        { order: 3.1 },
      ),
      criterion(
        "meal-provider",
        "addressDetail",
        "Địa chỉ chi tiết — số nhà, đường/thôn/ấp",
        "meal-provider-group-1",
        "text",
        0,
        [],
        { order: 3.2 },
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
        "email",
        "Email",
        "meal-provider-group-1",
        "text",
        0,
        [],
        { order: 4.1 },
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
        "fullTimeStaff",
        "Số nhân sự cơ hữu",
        "meal-provider-group-3",
        "number",
        0,
        [],
        { order: 9.1 },
      ),
      criterion(
        "meal-provider",
        "partTimeStaff",
        "Số nhân sự bán thời gian/thời vụ",
        "meal-provider-group-3",
        "number",
        0,
        [],
        { order: 9.2 },
      ),
      criterion(
        "meal-provider",
        "outsourcedStaff",
        "Số nhân sự thuê ngoài (nếu có)",
        "meal-provider-group-3",
        "number",
        0,
        [],
        { order: 9.3, required: false },
      ),
      criterion(
        "meal-provider",
        "trainedFoodSafetyStaff",
        "Số nhân sự đã được tập huấn ATTP",
        "meal-provider-group-3",
        "number",
        0,
        [],
        { order: 9.4 },
      ),
      criterion(
        "meal-provider",
        "healthCheckedStaff",
        "Số nhân sự có giấy khám sức khỏe còn hiệu lực",
        "meal-provider-group-3",
        "number",
        0,
        [],
        { order: 9.5 },
      ),
      criterion(
        "meal-provider",
        "foodSafetyManagerName",
        "Họ và tên",
        "meal-provider-group-3",
        "text",
        0,
        [],
        { order: 12 },
      ),
      criterion(
        "meal-provider",
        "foodSafetyManagerTitle",
        "Chức vụ",
        "meal-provider-group-3",
        "text",
        0,
        [],
        { order: 13 },
      ),
      criterion(
        "meal-provider",
        "foodSafetyManagerPhone",
        "Số điện thoại",
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
            {
              key: "name",
              label: "Tên nhà cung cấp",
              answerType: "text",
              required: true,
            },
            {
              key: "taxCode",
              label: "Mã số thuế",
              answerType: "text",
              required: true,
            },
            { key: "contract", label: "Hợp đồng cung cấp", answerType: "file" },
          ],
        },
      ),
      criterion(
        "meal-provider",
        "servingSchools",
        "Trường học đang phục vụ",
        "meal-provider-group-5",
        "repeatable",
        0,
        [],
        {
          order: 17,
          required: false,
          description: "",
          repeatableFields: [
            {
              key: "schoolId",
              label: "Tên trường",
              answerType: "select",
              required: true,
            },
            {
              key: "evidence",
              label: "Minh chứng hợp tác với trường này",
              answerType: "file",
              required: true,
            },
          ],
        },
      ),
      criterion(
        "meal-provider",
        "dailyCapacity",
        "Công suất suất ăn mỗi ngày",
        "meal-provider-group-6",
        "number",
        15,
        [],
        { order: 18 },
      ),
      criterion(
        "meal-provider",
        "averageMealPrice",
        "Giá trung bình 1 suất ăn",
        "meal-provider-group-6",
        "number",
        0,
        [],
        { order: 18.1 },
      ),
      criterion(
        "meal-provider",
        "deliveryVehicles",
        "Phương tiện giao suất ăn",
        "meal-provider-group-6",
        "repeatable",
        0,
        ["Xe tải bảo ôn", "Xe máy có thùng chuyên dụng", "Xe chuyên dụng khác"],
        {
          order: 19,
          repeatableFields: [
            {
              key: "vehicleType",
              label: "Loại phương tiện",
              answerType: "select",
              options: [
                "Xe tải bảo ôn",
                "Xe máy có thùng chuyên dụng",
                "Xe chuyên dụng khác",
              ],
              required: true,
            },
            {
              key: "ownershipType",
              label: "Hình thức sở hữu",
              answerType: "select",
              options: ["Chuyên dụng", "Thuê ngoài"],
              required: true,
            },
            {
              key: "quantity",
              label: "Số lượng",
              answerType: "number",
              required: true,
            },
          ],
        },
      ),
      criterion(
        "meal-provider",
        "deliveryVehiclePhoto",
        "Ảnh phương tiện giao suất ăn",
        "meal-provider-group-6",
        "file",
        0,
        [],
        { order: 20 },
      ),
      criterion(
        "meal-provider",
        "hasSampleCabinet",
        "Tủ lưu mẫu thức ăn – Có/Không tủ lưu mẫu",
        "meal-provider-group-6",
        "yes-no",
        0,
        ["Có", "Không"],
        { order: 21 },
      ),
      criterion(
        "meal-provider",
        "sampleCabinetCount",
        "Số lượng tủ lưu mẫu",
        "meal-provider-group-6",
        "number",
        0,
        [],
        {
          order: 23,
          required: false,
          dependsOn: { key: "hasSampleCabinet", equals: "Có" },
        },
      ),
      criterion(
        "meal-provider",
        "sampleCabinetPhoto",
        "Minh chứng hình ảnh tủ lưu mẫu",
        "meal-provider-group-6",
        "file",
        0,
        [],
        {
          order: 22,
          required: true,
          description: "Tải ảnh hoặc file minh chứng cho tủ lưu mẫu thức ăn.",
          dependsOn: { key: "hasSampleCabinet", equals: "Có" },
        },
      ),
      criterion(
        "meal-provider",
        "evidence",
        "Ảnh khu chế biến, thiết bị và bảo hộ",
        "meal-provider-group-7",
        "file",
        10,
        [],
        { order: 23 },
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
        "taxCode",
        "Mã số thuế",
        "school-group-1",
        "text",
        0,
        [],
        { order: 2.1 },
      ),
      criterion(
        "school",
        "addressProvince",
        "Chọn Tỉnh / Thành phố",
        "school-group-1",
        "select",
        0,
        addressProvinceOptions,
        { order: 3 },
      ),
      criterion(
        "school",
        "addressWard",
        "Chọn Xã / Phường",
        "school-group-1",
        "select",
        0,
        addressWardOptions,
        { order: 3.1 },
      ),
      criterion(
        "school",
        "addressDetail",
        "Địa chỉ chi tiết — số nhà, đường/thôn/ấp",
        "school-group-1",
        "text",
        0,
        [],
        { order: 3.2 },
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
        "email",
        "Email",
        "school-group-1",
        "text",
        0,
        [],
        { order: 4.1 },
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
        {
          order: 13,
          required: false,
          dependsOn: { key: "hasFoodSafetyLead", equals: "Có" },
        },
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
        "hiredKitchenName",
        "Tên đơn vị nấu tại bếp trường",
        "school-group-4",
        "text",
        0,
        [],
        {
          order: 18,
          dependsOn: {
            key: "mealModel",
            equals: "Thuê đơn vị nấu tại bếp trường",
          },
        },
      ),
      criterion(
        "school",
        "hiredKitchenTaxCode",
        "Mã số thuế đơn vị nấu tại bếp trường",
        "school-group-4",
        "text",
        0,
        [],
        {
          order: 19,
          dependsOn: {
            key: "mealModel",
            equals: "Thuê đơn vị nấu tại bếp trường",
          },
        },
      ),
      criterion(
        "school",
        "hiredKitchenStaffCount",
        "Số lượng nhân sự",
        "school-group-4",
        "number",
        0,
        [],
        {
          order: 20,
          dependsOn: {
            key: "mealModel",
            equals: "Thuê đơn vị nấu tại bếp trường",
          },
        },
      ),
      criterion(
        "school",
        "hiredKitchenContract",
        "Hợp đồng",
        "school-group-4",
        "file",
        0,
        [],
        {
          order: 21,
          dependsOn: {
            key: "mealModel",
            equals: "Thuê đơn vị nấu tại bếp trường",
          },
        },
      ),
      criterion(
        "school",
        "linkedMealProviders",
        "Đơn vị cung cấp suất ăn",
        "school-group-4",
        "repeatable",
        0,
        [],
        {
          order: 22,
          required: false,
          description:
            "Không bắt buộc. Có thể chọn một hoặc nhiều đơn vị đã có trên hệ thống, hoặc nhập đơn vị chưa có dữ liệu liên kết.",
          dependsOn: { key: "mealModel", notEquals: "Tự nấu" },
          repeatableFields: [
            {
              key: "source",
              label: "Nguồn thông tin",
              answerType: "select",
              options: ["Đơn vị đã đăng ký", "Nhập trực tiếp"],
              required: true,
            },
            {
              key: "providerId",
              label: "Đơn vị cung cấp suất ăn",
              answerType: "select",
              required: false,
            },
            {
              key: "providerName",
              label: "Tên đơn vị",
              answerType: "text",
              required: true,
            },
            {
              key: "taxCode",
              label: "Mã số thuế (nếu có)",
              answerType: "text",
            },
          ],
        },
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
        {
          order: 28,
          required: false,
          dependsOn: { key: "sampleStorage", equals: "Có" },
        },
      ),
      criterion(
        "school",
        "sampleCabinetPhoto",
        "Ảnh tủ lưu mẫu",
        "school-group-5",
        "file",
        0,
        [],
        {
          order: 29,
          required: false,
          dependsOn: { key: "sampleStorage", equals: "Có" },
        },
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

export const regionalPublicRecords: PublicRecord[] = [
  {
    id: "regional-001",
    category: "eligible-facilities",
    title: "Công ty TNHH Nông sản An Phú",
    subtitle: "Đơn vị cung cấp thực phẩm",
    location: "184 Nguyễn Văn Linh, Quận 7, TP.HCM",
    status: "active",
    publishedAt: "2026-08-18",
    metadata: {
      "Loại hình": "Đơn vị cung cấp thực phẩm",
      "Tỉnh / thành phố": "Thành phố Hồ Chí Minh",
      "Trạng thái": "Đang hoạt động",
      "Mã số thuế": "0312345678",
      "Chủ cơ sở": "Nguyễn Hoàng Anh",
      "Địa chỉ": "184 Nguyễn Văn Linh, Quận 7, TP.HCM",
      "Số điện thoại": "0908 123 456",
      "Nhóm sản phẩm": "Rau củ quả, thịt gia súc",
      "Người phụ trách ATTP": "Lê Minh Trang",
      "Giờ hoạt động": "06:00 - 17:00",
    },
  },
  {
    id: "regional-002",
    category: "eligible-facilities",
    title: "Bếp ăn Trường Tiểu học Nguyễn Bỉnh Khiêm",
    subtitle: "Cơ sở giáo dục",
    location: "25 Nguyễn Bỉnh Khiêm, Quận 1, TP.HCM",
    status: "active",
    publishedAt: "2026-08-12",
    metadata: {
      "Loại hình": "Cơ sở giáo dục",
      "Tỉnh / thành phố": "Thành phố Hồ Chí Minh",
      "Trạng thái": "Đã công bố",
      "Chủ cơ sở": "Nguyễn Thị Lan",
      "Địa chỉ": "25 Nguyễn Bỉnh Khiêm, Quận 1, TP.HCM",
    },
  },
  {
    id: "regional-003",
    category: "testing-facilities",
    title: "Trung tâm Kiểm nghiệm Nam Sài Gòn",
    subtitle: "Cơ sở kiểm nghiệm",
    location: "56 Hoàng Diệu, Quận 4, TP.HCM",
    status: "active",
    publishedAt: "2026-08-08",
    metadata: {
      "Loại hình": "Cơ sở kiểm nghiệm",
      "Tỉnh / thành phố": "Thành phố Hồ Chí Minh",
      "Trạng thái": "Đang hoạt động",
      "Chủ cơ sở": "Trần Minh Hoàng",
      "Địa chỉ": "56 Hoàng Diệu, Quận 4, TP.HCM",
    },
  },
  {
    id: "regional-004",
    category: "eligible-facilities",
    title: "Công ty CP Nông sản Hưng Thịnh",
    subtitle: "Đơn vị cung cấp thực phẩm",
    location: "Khu công nghiệp Amata, Biên Hòa, Đồng Nai",
    status: "active",
    publishedAt: "2026-08-07",
    metadata: {
      "Loại hình": "Đơn vị cung cấp thực phẩm",
      "Tỉnh / thành phố": "Đồng Nai",
      "Trạng thái": "Đã công bố",
      "Chủ cơ sở": "Phạm Quốc Hưng",
      "Địa chỉ": "Khu công nghiệp Amata, Biên Hòa, Đồng Nai",
    },
  },
  {
    id: "regional-005",
    category: "eligible-facilities",
    title: "HTX Cây ăn trái Long Hà",
    subtitle: "Hợp tác xã",
    location: "Long Khánh, Đồng Nai",
    status: "active",
    publishedAt: "2026-08-04",
    metadata: {
      "Loại hình": "Hợp tác xã",
      "Tỉnh / thành phố": "Đồng Nai",
      "Trạng thái": "Đang hoạt động",
      "Chủ cơ sở": "Lê Minh Trang",
      "Địa chỉ": "Long Khánh, Đồng Nai",
    },
  },
  {
    id: "regional-006",
    category: "eligible-facilities",
    title: "Công ty Thực phẩm sạch Thủ Đô",
    subtitle: "Đơn vị cung cấp thực phẩm",
    location: "Cầu Giấy, Hà Nội",
    status: "active",
    publishedAt: "2026-07-28",
    metadata: {
      "Loại hình": "Đơn vị cung cấp thực phẩm",
      "Tỉnh / thành phố": "Hà Nội",
      "Trạng thái": "Đang hoạt động",
      "Chủ cơ sở": "Đỗ Hoàng Nam",
      "Địa chỉ": "Cầu Giấy, Hà Nội",
    },
  },
  {
    id: "regional-007",
    category: "eligible-facilities",
    title: "Bếp ăn Trường Tiểu học Ba Đình",
    subtitle: "Cơ sở giáo dục",
    location: "Ba Đình, Hà Nội",
    status: "active",
    publishedAt: "2026-07-22",
    metadata: {
      "Loại hình": "Cơ sở giáo dục",
      "Tỉnh / thành phố": "Hà Nội",
      "Trạng thái": "Đã công bố",
      "Chủ cơ sở": "Trần Thu Hà",
      "Địa chỉ": "Ba Đình, Hà Nội",
    },
  },
  {
    id: "regional-008",
    category: "eligible-facilities",
    title: "Cơ sở sản xuất Đặc sản Miền Trung",
    subtitle: "Cơ sở sản xuất",
    location: "Hải Châu, Đà Nẵng",
    status: "active",
    publishedAt: "2026-07-18",
    metadata: {
      "Loại hình": "Cơ sở sản xuất",
      "Tỉnh / thành phố": "Đà Nẵng",
      "Trạng thái": "Đang hoạt động",
      "Chủ cơ sở": "Võ Minh Quân",
      "Địa chỉ": "Hải Châu, Đà Nẵng",
    },
  },
  {
    id: "regional-009",
    category: "eligible-facilities",
    title: "Nhà hàng Biển Xanh",
    subtitle: "Dịch vụ ăn uống",
    location: "Sơn Trà, Đà Nẵng",
    status: "active",
    publishedAt: "2026-07-15",
    metadata: {
      "Loại hình": "Dịch vụ ăn uống",
      "Tỉnh / thành phố": "Đà Nẵng",
      "Trạng thái": "Đã công bố",
      "Chủ cơ sở": "Nguyễn Hải Yến",
      "Địa chỉ": "Sơn Trà, Đà Nẵng",
    },
  },
  {
    id: "regional-010",
    category: "eligible-facilities",
    title: "HTX Nông nghiệp Cát Hải",
    subtitle: "Đơn vị cung cấp thực phẩm",
    location: "Cát Hải, Hải Phòng",
    status: "active",
    publishedAt: "2026-07-12",
    metadata: {
      "Loại hình": "Đơn vị cung cấp thực phẩm",
      "Tỉnh / thành phố": "Hải Phòng",
      "Trạng thái": "Đang hoạt động",
      "Chủ cơ sở": "Ngô Văn Thành",
      "Địa chỉ": "Cát Hải, Hải Phòng",
    },
  },
  {
    id: "regional-011",
    category: "eligible-facilities",
    title: "Cơ sở chế biến Mekong Farm",
    subtitle: "Cơ sở sản xuất",
    location: "Ninh Kiều, Cần Thơ",
    status: "active",
    publishedAt: "2026-07-08",
    metadata: {
      "Loại hình": "Cơ sở sản xuất",
      "Tỉnh / thành phố": "Cần Thơ",
      "Trạng thái": "Đã công bố",
      "Chủ cơ sở": "Lê Quốc Bảo",
      "Địa chỉ": "Ninh Kiều, Cần Thơ",
    },
  },
  {
    id: "regional-012",
    category: "eligible-facilities",
    title: "Công ty TNHH Nông sản Xứ Nghệ",
    subtitle: "Đơn vị cung cấp thực phẩm",
    location: "Vinh, Nghệ An",
    status: "active",
    publishedAt: "2026-07-04",
    metadata: {
      "Loại hình": "Đơn vị cung cấp thực phẩm",
      "Tỉnh / thành phố": "Nghệ An",
      "Trạng thái": "Đang hoạt động",
      "Chủ cơ sở": "Phan Văn Đức",
      "Địa chỉ": "Vinh, Nghệ An",
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
export const schoolOptions = [
  {
    id: "school-001",
    name: "Trường Mầm non Hoa Mai",
  },
  {
    id: "school-002",
    name: "Trường Tiểu học Nguyễn Du",
  },
  {
    id: "school-003",
    name: "Trường THCS ABC",
  },
  {
    id: "school-004",
    name: "Trường THPT XYZ",
  },
  {
    id: "school-005",
    name: "Trường Mầm non Hoa Sen",
  },
] as const;

export const criteriaHistory: Record<ApplicationType, CriteriaHistoryEntry[]> =
  { "food-supplier": [], "meal-provider": [], school: [] };
export const getCriteriaSet = (type: ApplicationType): CriteriaSet =>
  structuredClone(criteria[type]);
const getPublishedRecords = (): PublicRecord[] => {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(
      sessionStorage.getItem("attp-published-records") || "[]",
    ) as PublicRecord[];
  } catch {
    return [];
  }
};
export const getPublicRecords = (search = "", category = "") =>
  [...publicRecords, ...regionalPublicRecords, ...getPublishedRecords()]
    .filter(
      (item) =>
        (!category || item.category === category) &&
        (!search ||
          `${item.title} ${item.subtitle} ${item.location}`
            .toLowerCase()
            .includes(search.toLowerCase())),
    )
    .filter(
      (item, index, records) =>
        records.findIndex((record) => record.id === item.id) === index,
    );

const applicationCriteria = getCriteriaSet("food-supplier");

const sampleFacilityNames: Record<ApplicationType, string[]> = {
  "food-supplier": [
    "Công ty Thực phẩm Tân Hưng",
    "Cơ sở Hải sản Tươi Sài Gòn",
    "Công ty Nông sản Mekong Xanh",
    "Hợp tác xã Nông nghiệp Bình Chánh",
    "Cơ sở Thịt sạch Nam Việt",
    "Công ty TNHH Thực phẩm Hưng Phát",
    "Trang trại Rau hữu cơ Phước Lộc",
    "Công ty Hải sản Đại Dương",
    "Cơ sở Trứng sạch Thành Công",
    "Công ty Phân phối Thực phẩm Việt",
    "Hợp tác xã Rau an toàn Hóc Môn",
    "Cơ sở Đặc sản miền Tây Sông Xanh",
  ],
  "meal-provider": [
    "Bếp ăn tập thể Cầu Ông Lãnh",
    "Cơ sở Suất ăn Nguyễn Cư Trinh",
    "Công ty Suất ăn Hòa Bình",
    "Bếp ăn công nghiệp Tân Tạo",
    "Công ty Dịch vụ Ẩm thực Phú Nhuận",
    "Bếp ăn tập thể Bình Thạnh",
    "Công ty Suất ăn Việt An",
    "Bếp ăn trường học Sao Mai",
    "Công ty TNHH Bếp Xanh",
    "Đơn vị Suất ăn Công nghiệp Thành Đạt",
    "Bếp ăn tập thể Hiệp Bình",
    "Công ty Suất ăn Dinh dưỡng Á Châu",
  ],
  school: [
    "Trường Mầm non Hoa Hồng",
    "Trường Tiểu học Lê Lợi",
    "Trường Tiểu học Thái Sơn",
    "Trường THCS Nguyễn Bỉnh Khiêm",
    "Trường THPT Trần Phú",
    "Trường Mầm non Mặt Trời Nhỏ",
    "Trường Tiểu học Bến Nghé",
    "Trường THCS Võ Trường Toản",
    "Trường THPT Nguyễn Thượng Hiền",
    "Trường Mầm non Tuổi Thơ",
    "Trường Tiểu học Đa Kao",
    "Trường THCS Cầu Ông Lãnh",
  ],
};

const sampleAddresses = [
  "18 Nguyễn Hữu Thọ, Phường Tân Hưng, TP. Hồ Chí Minh",
  "42 Nguyễn Thị Minh Khai, Phường Đa Kao, TP. Hồ Chí Minh",
  "116 Nguyễn Thái Học, Phường Cầu Ông Lãnh, TP. Hồ Chí Minh",
  "24 Trần Hưng Đạo, Phường Nguyễn Cư Trinh, TP. Hồ Chí Minh",
  "88 Lê Văn Việt, Phường Tăng Nhơn Phú, TP. Hồ Chí Minh",
  "205 Phan Văn Trị, Phường 11, TP. Hồ Chí Minh",
  "67 Quốc lộ 22, Xã Hóc Môn, TP. Hồ Chí Minh",
  "12 Lê Lợi, Phường Bến Nghé, TP. Hồ Chí Minh",
];

const sampleStatuses: ApplicationStatus[] = [
  "pending",
  "approved",
  "needs-more-info",
  "approved",
  "warning",
  "rejected",
];

const sampleDate = (index: number) =>
  `2026-${String(1 + (index % 8)).padStart(2, "0")}-${String(
    3 + ((index * 3) % 24),
  ).padStart(2, "0")}T${String(8 + (index % 9)).padStart(2, "0")}:${
    index % 2 ? "30" : "00"
  }:00+07:00`;

const sampleAttachmentName = (type: ApplicationType, index: number, key: string) =>
  `ho-so-mau-${type}-${String(index).padStart(2, "0")}-${key}.pdf`;

const sampleRepeatableValue = (
  field: NonNullable<CriteriaDefinition["repeatableFields"]>[number],
  index: number,
  type: ApplicationType,
) => {
  if (field.answerType === "file") {
    return sampleAttachmentName(type, index, field.key);
  }
  if (field.answerType === "number") return String(2 + (index % 8));
  if (field.answerType === "select") {
    if (field.key === "schoolId") return schoolOptions[index % schoolOptions.length].id;
    if (field.key === "providerId") return `provider-${String(1 + (index % 6)).padStart(3, "0")}`;
    return field.options?.[index % (field.options.length || 1)] ?? `Lựa chọn ${index}`;
  }
  return `${field.label} mẫu ${index + 1}`;
};

const createSampleApplication = (
  index: number,
  type: ApplicationType,
  status: ApplicationStatus,
): Application => {
  const criteriaSet = getCriteriaSet(type);
  const sampleOrdinal = Math.floor((index - 1) / 3);
  const applicantName =
    sampleFacilityNames[type][sampleOrdinal % sampleFacilityNames[type].length];
  const address = sampleAddresses[index % sampleAddresses.length];
  const contact = `090${String(100000 + index * 731).slice(-6)}`;
  const data: Record<string, unknown> = {};
  const attachments: Attachment[] = [];

  for (const item of criteriaSet.criteria) {
    if (item.answerType === "file") {
      attachments.push({
        name: sampleAttachmentName(type, index, item.key),
        kind: item.key.toLowerCase().includes("photo") ||
          item.key.toLowerCase().includes("evidence")
          ? "image/jpeg"
          : "application/pdf",
        size: 420000 + index * 17000,
        fieldKey: item.key,
      });
      continue;
    }
    if (item.answerType === "repeatable") {
      const rows = [Object.fromEntries(
        (item.repeatableFields ?? []).map((field) => [
          field.key,
          sampleRepeatableValue(field, index, type),
        ]),
      )];
      data[item.key] = rows;
      (item.repeatableFields ?? [])
        .filter((field) => field.answerType === "file")
        .forEach((field) => {
          attachments.push({
            name: String((rows[0] as Record<string, unknown>)[field.key]),
            kind: "application/pdf",
            size: 330000 + index * 9000,
            fieldKey: `${item.key}.0.${field.key}`,
          });
        });
      continue;
    }
    if (item.answerType === "number") {
      data[item.key] = String(8 + ((index * 3) % 42));
    } else if (item.answerType === "date") {
      data[item.key] = `2027-${String(1 + (index % 9)).padStart(2, "0")}-15`;
    } else if (item.answerType === "yes-no") {
      data[item.key] = index % 7 === 0 ? "Không" : "Có";
    } else if (item.answerType === "multi-select") {
      data[item.key] = item.options.slice(0, Math.min(2, item.options.length));
    } else if (item.answerType === "select") {
      data[item.key] = item.options[index % (item.options.length || 1)] ?? "";
    } else {
      data[item.key] = `${item.label} mẫu ${index + 1}`;
    }
  }

  Object.assign(data, {
    applicantName,
    taxCode: `031${String(9000000 + index * 137).slice(-7)}`,
    address,
    addressProvince: "TP. Hồ Chí Minh",
    addressWard: ["Phường Tân Hưng", "Phường Đa Kao", "Phường Bến Nghé", "Xã Hóc Môn"][
      index % 4
    ],
    addressDetail: address.split(",")[0],
    contact,
    email: `donvi.mau${String(index + 1).padStart(2, "0")}@example.vn`,
    licenseNumber: `ATTP-HCM-2026-${String(100 + index).padStart(4, "0")}`,
    licenseExpires: "2027-12-31",
  });

  if (type === "food-supplier") {
    data.products = [
      {
        category: ["Rau củ quả", "Thịt gia súc", "Thủy sản", "Trứng"][index % 4],
        name: ["Rau củ sơ chế", "Thịt heo sạch", "Cá basa phi lê", "Trứng gà tươi"][index % 4],
        origin: ["Củ Chi", "Đồng Nai", "Đồng Tháp", "Long An"][index % 4],
        traceability: "Có",
      },
      {
        category: "Sản phẩm bổ sung",
        name: "Danh mục thực phẩm mẫu",
        origin: "TP. Hồ Chí Minh",
        traceability: "Có",
      },
    ];
    data.suppliedUnits = [
      {
        unitType: index % 2 ? "Cơ sở giáo dục" : "Cơ sở cung cấp suất ăn",
        name: sampleFacilityNames["meal-provider"][index % sampleFacilityNames["meal-provider"].length],
        taxCode: `031${String(7000000 + index * 113).slice(-7)}`,
      },
    ];
  }

  if (type === "meal-provider") {
    for (let attachmentIndex = attachments.length - 1; attachmentIndex >= 0; attachmentIndex -= 1) {
      const fieldKey = attachments[attachmentIndex].fieldKey ?? "";
      if (fieldKey.startsWith("suppliers.") || fieldKey.startsWith("servingSchools.")) {
        attachments.splice(attachmentIndex, 1);
      }
    }
    const staffTotal = 20 + (index % 5) * 8;
    data.staffTotal = String(staffTotal);
    data.fullTimeStaff = String(staffTotal - 4);
    data.partTimeStaff = "3";
    data.outsourcedStaff = "1";
    data.trainedFoodSafetyStaff = String(staffTotal - 1);
    data.healthCheckedStaff = String(staffTotal);
    data.foodSafetyManagerName = ["Nguyễn Hoàng Anh", "Trần Thị Mai", "Phạm Minh Đức"][
      index % 3
    ];
    data.foodSafetyManagerTitle = "Phụ trách bếp ăn";
    data.foodSafetyManagerPhone = `091${String(200000 + index * 419).slice(-6)}`;
    data.suppliers = [
      {
        name: sampleFacilityNames["food-supplier"][index % sampleFacilityNames["food-supplier"].length],
        taxCode: `031${String(6000000 + index * 127).slice(-7)}`,
        contract: sampleAttachmentName(type, index, "hop-dong-nha-cung-cap"),
      },
      {
        name: sampleFacilityNames["food-supplier"][(index + 3) % sampleFacilityNames["food-supplier"].length],
        taxCode: `031${String(6100000 + index * 127).slice(-7)}`,
        contract: sampleAttachmentName(type, index, "hop-dong-nha-cung-cap-2"),
      },
    ];
    data.servingSchools = [
      {
        schoolId: schoolOptions[index % schoolOptions.length].id,
        evidence: sampleAttachmentName(type, index, "hop-dong-truong"),
      },
      {
        schoolId: schoolOptions[(index + 2) % schoolOptions.length].id,
        evidence: sampleAttachmentName(type, index, "hop-dong-truong-2"),
      },
    ];
    data.dailyCapacity = String(500 + (index % 8) * 150);
    data.averageMealPrice = String(22000 + (index % 6) * 1500);
    data.deliveryVehicles = [
      {
        vehicleType: index % 2 ? "Xe máy có thùng chuyên dụng" : "Xe tải bảo ôn",
        ownershipType: index % 3 ? "Chuyên dụng" : "Thuê ngoài",
        quantity: String(2 + (index % 7)),
      },
    ];
    data.vehicleType = [String((data.deliveryVehicles as Array<Record<string, unknown>>)[0].vehicleType)];
    data.ownershipType = (data.deliveryVehicles as Array<Record<string, unknown>>)[0].ownershipType;
    data.hasSampleCabinet = "Có";
    data.sampleCabinetCount = String(1 + (index % 3));
    for (const [rowIndex, row] of (data.suppliers as Array<Record<string, unknown>>).entries()) {
      attachments.push({
        name: String(row.contract),
        kind: "application/pdf",
        size: 360000 + index * 5000,
        fieldKey: `suppliers.${rowIndex}.contract`,
      });
    }
    for (const [rowIndex, row] of (data.servingSchools as Array<Record<string, unknown>>).entries()) {
      attachments.push({
        name: String(row.evidence),
        kind: "application/pdf",
        size: 410000 + index * 6000,
        fieldKey: `servingSchools.${rowIndex}.evidence`,
      });
    }
  }

  if (type === "school") {
    const mealModel = sampleOrdinal % 3 === 0
      ? "Tự nấu"
      : sampleOrdinal % 3 === 1
        ? "Liên kết đơn vị suất ăn"
        : "Thuê đơn vị nấu tại bếp trường";
    data.schoolLevel = ["Mầm non", "Tiểu học", "THCS", "THPT"][index % 4];
    data.hasFoodSafetyLead = "Có";
    data.foodSafetyLeadName = ["Lê Thị Hương", "Võ Minh Châu", "Đặng Quốc Bảo"][index % 3];
    data.foodSafetyLeadTitle = "Cán bộ phụ trách ATTP";
    data.foodSafetyLeadPhone = `098${String(300000 + index * 517).slice(-6)}`;
    data.mealModel = mealModel;
    if (mealModel === "Tự nấu") {
      data.selfCookStaffTotal = String(6 + (sampleOrdinal % 5));
    } else {
      data.linkedMealProviders = [
        {
          source: "Đơn vị đã đăng ký",
          providerId: `provider-${String(1 + (sampleOrdinal % 6)).padStart(3, "0")}`,
          providerName:
            sampleFacilityNames["meal-provider"][
              sampleOrdinal % sampleFacilityNames["meal-provider"].length
            ],
          taxCode: `031${String(5000000 + index * 101).slice(-7)}`,
        },
      ];
    }
    data.deliveryReception = "Xe tải bảo ôn, giao nhận từ 06:00 đến 07:00";
    data.kitchenOneWay = "Có";
    data.sampleStorage = "Có";
    data.sampleCabinetCount = String(1 + (index % 2));
    if (mealModel === "Thuê đơn vị nấu tại bếp trường") {
      data.hiredKitchenName =
        sampleFacilityNames["meal-provider"][
          (sampleOrdinal + 1) % sampleFacilityNames["meal-provider"].length
        ];
      data.hiredKitchenTaxCode = `031${String(5200000 + index * 103).slice(-7)}`;
      data.hiredKitchenStaffCount = String(8 + (sampleOrdinal % 4));
    }
  }

  const scoreBreakdown = Object.fromEntries(
    criteriaSet.criteria
      .filter((item) => item.maxScore > 0)
      .map((item) => [item.key, status === "approved" ? item.maxScore : Math.max(0, item.maxScore - (index % 5) * 2)]),
  );

  return {
    id: `sample-app-${String(index).padStart(3, "0")}`,
    reference: `HS-MAU-2026-${String(100 + index).padStart(4, "0")}`,
    type,
    applicantName,
    address,
    contact,
    submittedAt: sampleDate(index),
    status,
    score: status === "approved" ? 100 : status === "needs-more-info" ? 76 : status === "rejected" ? 48 : 0,
    reviewNote: status === "needs-more-info"
      ? "Vui lòng bổ sung minh chứng và cập nhật thông tin còn thiếu."
      : status === "rejected"
        ? "Hồ sơ chưa đáp ứng đầy đủ điều kiện theo bộ tiêu chí hiện hành."
        : null,
    isThirdParty: type === "school" || index % 4 === 0,
    criteriaVersion: criteriaSet.version,
    criteriaSnapshot: criteriaSet.criteria,
    criteriaGroups: criteriaSet.groups,
    data,
    attachments,
    scoreBreakdown,
    published: status === "approved",
  };
};

const schoolSampleStatuses: ApplicationStatus[] = [
  "approved",
  "approved",
  "approved",
  "needs-more-info",
  "approved",
  "approved",
  "approved",
  "warning",
  "approved",
  "approved",
  "approved",
  "rejected",
];

const sampleApplications: Application[] = Array.from({ length: 36 }, (_, offset) => {
  const index = offset + 1;
  const type: ApplicationType = ["food-supplier", "meal-provider", "school"][index % 3] as ApplicationType;
  const sampleOrdinal = Math.floor(offset / 3);
  const status =
    type === "school"
      ? schoolSampleStatuses[sampleOrdinal % schoolSampleStatuses.length]
      : sampleStatuses[offset % sampleStatuses.length];
  return createSampleApplication(index, type, status);
});

export const applications: Application[] = [
  {
    id: "app-001",
    reference: "HS-2026-0042",
    type: "food-supplier",
    applicantName: "Công ty TNHH Nông sản An Phú",
    address: "184 Nguyễn Văn Linh, Quận 7, TP.HCM",
    contact: "0908 123 456",
    submittedAt: "2026-08-18T08:30:00+07:00",
    status: "approved",
    score: 100,
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
      addressProvince: "TP. Hồ Chí Minh",
      addressWard: "Phường Tân Phong",
      addressDetail: "184 Nguyễn Văn Linh",
      licenseNumber: "ATTP-HCM-2026-0041",
      licenseExpires: "2027-08-12",
      products: [
        {
          category: "Rau củ quả",
          name: "Rau củ quả tươi",
          origin: "Hợp tác xã rau sạch Củ Chi",
          traceability: "Có",
        },
        {
          category: "Thịt gia súc",
          name: "Thịt heo sơ chế",
          origin: "Trang trại liên kết Bình Minh",
          traceability: "Có",
        },
      ],
      suppliedUnits: [
        {
          unitType: "Cơ sở cung cấp suất ăn",
          name: "Công ty Suất ăn Minh Tâm",
          taxCode: "0314567890",
        },
      ],
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
      {
        name: "phuong-tien-van-chuyen.jpg",
        kind: "image/jpeg",
        size: 1400000,
        fieldKey: "transportEvidence",
      },
    ],
    scoreBreakdown: {
      products: 20,
      storageEvidence: 25,
      transportEvidence: 10,
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
  {
    id: "app-003",
    reference: "HS-2026-0051",
    type: "meal-provider",
    applicantName: "Công ty Suất ăn Minh Tâm",
    address: "Khu công nghiệp Tân Bình, TP. Hồ Chí Minh",
    contact: "028 3812 8899",
    submittedAt: "2026-07-18T09:20:00+07:00",
    status: "approved",
    score: 100,
    reviewNote: null,
    isThirdParty: false,
    criteriaVersion: "MP-2026.1",
    criteriaSnapshot: getCriteriaSet("meal-provider").criteria,
    criteriaGroups: getCriteriaSet("meal-provider").groups,
    data: {
      applicantName: "Công ty Suất ăn Minh Tâm",
      taxCode: "0314567890",
      addressProvince: "TP. Hồ Chí Minh",
      addressWard: "Phường Tân Bình",
      addressDetail: "Khu công nghiệp Tân Bình",
      contact: "028 3812 8899",
      licenseNumber: "ATTP-HCM-2026-0068",
      licenseExpires: "2027-07-28",
      staffTotal: "42",
      foodSafetyManagerName: "Võ Hoàng Nam",
      foodSafetyManagerTitle: "Trưởng bộ phận ATTP",
      foodSafetyManagerPhone: "0907 220 668",
      suppliers: [
        {
          name: "Công ty TNHH Nông sản An Phú",
          taxCode: "0312345678",
          contract: "hop-dong-nong-san-an-phu.pdf",
        },
      ],
      servingSchools: [
        { schoolId: "school-001", evidence: "hop-dong-truong-le-loi.pdf" },
      ],
      dailyCapacity: "1200",
      deliveryVehicles: [
        { vehicleType: "Xe tải bảo ôn", ownershipType: "Chuyên dụng", quantity: "4" },
      ],
      vehicleType: ["Xe tải bảo ôn"],
      ownershipType: "Chuyên dụng",
      hasSampleCabinet: "Có",
      sampleCabinetCount: "2",
    },
    attachments: [
      { name: "giay-phep-minh-tam.pdf", kind: "application/pdf", size: 520000, fieldKey: "businessLicense" },
      { name: "hop-dong-truong-le-loi.pdf", kind: "application/pdf", size: 610000, fieldKey: "servingSchools.0.evidence" },
      { name: "khu-che-bien-minh-tam.jpg", kind: "image/jpeg", size: 1800000, fieldKey: "evidence" },
      { name: "xe-bao-on-minh-tam.jpg", kind: "image/jpeg", size: 1300000, fieldKey: "deliveryVehiclePhoto" },
    ],
    scoreBreakdown: { staffTotal: 20, suppliers: 15, dailyCapacity: 15, evidence: 10 },
    published: true,
  },
  {
    id: "app-004",
    reference: "HS-2026-0058",
    type: "food-supplier",
    applicantName: "Hợp tác xã Rau sạch Củ Chi",
    address: "Đường Tỉnh lộ 8, Xã Củ Chi, TP. Hồ Chí Minh",
    contact: "0903 456 789",
    submittedAt: "2026-07-05T10:00:00+07:00",
    status: "approved",
    score: 100,
    reviewNote: null,
    isThirdParty: false,
    criteriaVersion: "FS-2026.1",
    criteriaSnapshot: applicationCriteria.criteria,
    criteriaGroups: applicationCriteria.groups,
    data: {
      applicantName: "Hợp tác xã Rau sạch Củ Chi",
      taxCode: "0319876543",
      addressProvince: "TP. Hồ Chí Minh",
      addressWard: "Xã Củ Chi",
      addressDetail: "Đường Tỉnh lộ 8",
      contact: "0903 456 789",
      licenseNumber: "ATTP-HCM-2026-0056",
      licenseExpires: "2027-08-05",
      products: [{ category: "Rau củ quả", name: "Rau sơ chế", origin: "Củ Chi, TP. Hồ Chí Minh", traceability: "Có" }],
      suppliedUnits: [{ unitType: "Cơ sở cung cấp thực phẩm", name: "Công ty TNHH Nông sản An Phú", taxCode: "0312345678" }],
    },
    attachments: [
      { name: "giay-chung-nhan-cu-chi.pdf", kind: "application/pdf", size: 480000, fieldKey: "businessLicense" },
      { name: "kho-dong-goi-cu-chi.jpg", kind: "image/jpeg", size: 1600000, fieldKey: "storageEvidence" },
    ],
    scoreBreakdown: { products: 20, storageEvidence: 25 },
    published: true,
  },
  {
    id: "app-005",
    reference: "HS-2026-0063",
    type: "meal-provider",
    applicantName: "Bếp ăn tập thể An Phú",
    address: "184 Nguyễn Văn Linh, Phường Tân Phong, TP. Hồ Chí Minh",
    contact: "0908 445 220",
    submittedAt: "2026-06-22T08:45:00+07:00",
    status: "approved",
    score: 100,
    reviewNote: null,
    isThirdParty: false,
    criteriaVersion: "MP-2026.1",
    criteriaSnapshot: getCriteriaSet("meal-provider").criteria,
    criteriaGroups: getCriteriaSet("meal-provider").groups,
    data: {
      applicantName: "Bếp ăn tập thể An Phú",
      taxCode: "0316655442",
      addressProvince: "TP. Hồ Chí Minh",
      addressWard: "Phường Tân Phong",
      addressDetail: "184 Nguyễn Văn Linh",
      contact: "0908 445 220",
      licenseNumber: "ATTP-HCM-2026-0074",
      licenseExpires: "2027-06-22",
      staffTotal: "28",
      foodSafetyManagerName: "Lê Thị Hạnh",
      foodSafetyManagerTitle: "Phụ trách bếp ăn",
      foodSafetyManagerPhone: "0908 550 801",
      suppliers: [{ name: "Hợp tác xã Rau sạch Củ Chi", taxCode: "0319876543", contract: "hop-dong-rau-cu-chi.pdf" }],
      servingSchools: [
        { schoolId: "school-002", evidence: "hop-dong-truong-thai-son.pdf" },
        { schoolId: "school-003", evidence: "hop-dong-truong-hoa-sen.pdf" },
      ],
      dailyCapacity: "900",
      deliveryVehicles: [{ vehicleType: "Xe máy có thùng chuyên dụng", ownershipType: "Chuyên dụng", quantity: "8" }],
      vehicleType: ["Xe máy có thùng chuyên dụng"],
      ownershipType: "Chuyên dụng",
      hasSampleCabinet: "Có",
      sampleCabinetCount: "1",
    },
    attachments: [
      { name: "giay-phep-bep-an-an-phu.pdf", kind: "application/pdf", size: 510000, fieldKey: "businessLicense" },
      { name: "khu-bep-an-phu.jpg", kind: "image/jpeg", size: 1700000, fieldKey: "evidence" },
    ],
    scoreBreakdown: { staffTotal: 20, suppliers: 15, dailyCapacity: 15, evidence: 10 },
    published: true,
  },
  {
    id: "app-006",
    reference: "HS-2026-0069",
    type: "food-supplier",
    applicantName: "Công ty Thực phẩm sạch Bình Minh",
    address: "32 Nguyễn Thị Thập, Phường Tân Phong, TP. Hồ Chí Minh",
    contact: "0918 334 778",
    submittedAt: "2026-06-10T13:30:00+07:00",
    status: "approved",
    score: 100,
    reviewNote: null,
    isThirdParty: false,
    criteriaVersion: "FS-2026.1",
    criteriaSnapshot: applicationCriteria.criteria,
    criteriaGroups: applicationCriteria.groups,
    data: {
      applicantName: "Công ty Thực phẩm sạch Bình Minh",
      taxCode: "0317788990",
      addressProvince: "TP. Hồ Chí Minh",
      addressWard: "Phường Tân Phong",
      addressDetail: "32 Nguyễn Thị Thập",
      contact: "0918 334 778",
      licenseNumber: "ATTP-HCM-2026-0082",
      licenseExpires: "2027-06-10",
      products: [{ category: "Thủy sản", name: "Cá basa phi lê", origin: "Đồng Tháp", traceability: "Có" }],
      suppliedUnits: [{ unitType: "Cơ sở cung cấp suất ăn", name: "Bếp ăn tập thể An Phú", taxCode: "0316655442" }],
    },
    attachments: [
      { name: "giay-phep-binh-minh.pdf", kind: "application/pdf", size: 460000, fieldKey: "businessLicense" },
      { name: "kho-lanh-binh-minh.jpg", kind: "image/jpeg", size: 1500000, fieldKey: "storageEvidence" },
    ],
    scoreBreakdown: { products: 20, storageEvidence: 25 },
    published: true,
  },
  ...sampleApplications,
];
