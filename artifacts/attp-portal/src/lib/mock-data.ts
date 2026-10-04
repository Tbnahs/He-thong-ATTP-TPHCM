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
export type AddressWardOption = {
  code: string;
  label: string;
  latitude: number;
  longitude: number;
};

export type AddressLocationOption = {
  code: string;
  label: string;
  latitude: number;
  longitude: number;
  wards: AddressWardOption[];
};

export const addressLocationOptions: AddressLocationOption[] = [
  {
    code: "ho_chi_minh",
    label: "TP. Hồ Chí Minh",
    latitude: 10.7769,
    longitude: 106.7009,
    wards: [
      { code: "ben_nghe", label: "Phường Bến Nghé", latitude: 10.7796, longitude: 106.7043 },
      { code: "tan_dinh", label: "Phường Tân Định", latitude: 10.7937, longitude: 106.6915 },
      { code: "da_kao", label: "Phường Đa Kao", latitude: 10.7901, longitude: 106.6991 },
      { code: "nguyen_thai_binh", label: "Phường Nguyễn Thái Bình", latitude: 10.7697, longitude: 106.7004 },
      { code: "cau_ong_lanh", label: "Phường Cầu Ông Lãnh", latitude: 10.7629, longitude: 106.6953 },
      { code: "tan_phong", label: "Phường Tân Phong", latitude: 10.7351, longitude: 106.7175 },
      { code: "cu_chi", label: "Xã Củ Chi", latitude: 10.9733, longitude: 106.4936 },
      { code: "hoc_mon", label: "Xã Hóc Môn", latitude: 10.8897, longitude: 106.5951 },
    ],
  },
  {
    code: "ha_noi",
    label: "Hà Nội",
    latitude: 21.0285,
    longitude: 105.8542,
    wards: [
      { code: "ba_dinh", label: "Phường Ba Đình", latitude: 21.0357, longitude: 105.8342 },
      { code: "hoan_kiem", label: "Phường Hoàn Kiếm", latitude: 21.0287, longitude: 105.8525 },
      { code: "cau_giay", label: "Phường Cầu Giấy", latitude: 21.0304, longitude: 105.7932 },
      { code: "dong_da", label: "Phường Đống Đa", latitude: 21.0142, longitude: 105.8272 },
    ],
  },
  {
    code: "da_nang",
    label: "Đà Nẵng",
    latitude: 16.0544,
    longitude: 108.2022,
    wards: [
      { code: "hai_chau", label: "Phường Hải Châu", latitude: 16.0614, longitude: 108.2191 },
      { code: "son_tra", label: "Phường Sơn Trà", latitude: 16.0998, longitude: 108.2442 },
      { code: "thanh_khe", label: "Phường Thanh Khê", latitude: 16.0678, longitude: 108.1846 },
      { code: "ngu_hanh_son", label: "Phường Ngũ Hành Sơn", latitude: 16.0057, longitude: 108.2636 },
    ],
  },
  {
    code: "hai_phong",
    label: "Hải Phòng",
    latitude: 20.8449,
    longitude: 106.6881,
    wards: [
      { code: "hong_bang", label: "Phường Hồng Bàng", latitude: 20.8612, longitude: 106.6833 },
      { code: "le_chan", label: "Phường Lê Chân", latitude: 20.8425, longitude: 106.6818 },
      { code: "ngo_quyen", label: "Phường Ngô Quyền", latitude: 20.856, longitude: 106.692 },
      { code: "hai_an", label: "Phường Hải An", latitude: 20.8305, longitude: 106.7484 },
    ],
  },
  {
    code: "can_tho",
    label: "Cần Thơ",
    latitude: 10.0452,
    longitude: 105.7469,
    wards: [
      { code: "ninh_kieu", label: "Phường Ninh Kiều", latitude: 10.0341, longitude: 105.7689 },
      { code: "binh_thuy", label: "Phường Bình Thủy", latitude: 10.0645, longitude: 105.7189 },
      { code: "cai_rang", label: "Phường Cái Răng", latitude: 10.0026, longitude: 105.7874 },
      { code: "o_mon", label: "Phường Ô Môn", latitude: 10.1177, longitude: 105.6213 },
    ],
  },
  {
    code: "hue",
    label: "Huế",
    latitude: 16.4637,
    longitude: 107.5909,
    wards: [
      { code: "phu_xuan", label: "Phường Phú Xuân", latitude: 16.4727, longitude: 107.5782 },
      { code: "thuan_hoa", label: "Phường Thuận Hóa", latitude: 16.455, longitude: 107.5854 },
      { code: "huong_thuy", label: "Phường Hương Thủy", latitude: 16.4022, longitude: 107.6932 },
      { code: "huong_tra", label: "Phường Hương Trà", latitude: 16.5205, longitude: 107.4789 },
    ],
  },
];

export const getAddressLocation = (
  provinceLabel?: string,
  wardLabel?: string,
) => {
  const province = addressLocationOptions.find(
    (item) => item.label === provinceLabel,
  );
  const ward = province?.wards.find((item) => item.label === wardLabel);
  return { province, ward };
};

export const getAddressWardOptions = (provinceLabel?: string) =>
  addressLocationOptions.find((item) => item.label === provinceLabel)?.wards ?? [];

const addressProvinceOptions = addressLocationOptions.map((item) => item.label);
const addressWardOptions = addressLocationOptions.flatMap((item) =>
  item.wards.map((ward) => ward.label),
);

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

const formField = (
  type: ApplicationType,
  key: string,
  label: string,
  groupId: string,
  answerType: CriteriaAnswerType,
  order: number,
  options: string[] = [],
  extra: Partial<CriteriaDefinition> = {},
) =>
  criterion(type, key, label, groupId, answerType, 0, options, {
    order,
    ...extra,
  });

const documentFields = [
  {
    key: "documentType",
    label: "Loại giấy tờ / giấy chứng nhận",
    answerType: "select" as const,
    options: [
      "Giấy chứng nhận cơ sở đủ điều kiện ATTP",
      "ISO 22000:2018",
      "HACCP",
      "Chuỗi ATTP",
      "Giấy tờ pháp lý khác",
    ],
    required: true,
  },
  { key: "number", label: "Số cấp / số giấy tờ", answerType: "text" as const },
  { key: "issueDate", label: "Ngày cấp", answerType: "date" as const },
  { key: "expiryDate", label: "Ngày hết hiệu lực", answerType: "date" as const },
  { key: "issuer", label: "Nơi cấp", answerType: "text" as const },
  {
    key: "location",
    label: "Địa điểm được cấp chứng nhận",
    answerType: "text" as const,
  },
  {
    key: "scope",
    label: "Phạm vi loại hình được cấp chứng nhận",
    answerType: "text" as const,
  },
  { key: "evidence", label: "Tệp minh chứng", answerType: "file" as const },
];

const supplierFields = [
  { key: "name", label: "Tên nhà cung cấp", answerType: "text" as const, required: true },
  {
    key: "headOfficeAddress",
    label: "Địa chỉ trụ sở",
    answerType: "text" as const,
  },
  {
    key: "dispatchAddress",
    label: "Địa chỉ địa điểm xuất hàng",
    answerType: "text" as const,
  },
  { key: "contractNumber", label: "Số hợp đồng", answerType: "text" as const },
  { key: "contractDate", label: "Ngày ký hợp đồng", answerType: "date" as const },
  {
    key: "certificateType",
    label: "Loại giấy chứng nhận",
    answerType: "select" as const,
    options: [
      "GCNĐĐK ATTP",
      "ISO 22000:2018",
      "HACCP",
      "Chuỗi ATTP",
      "Khác",
    ],
  },
  {
    key: "certificateType2",
    label: "Loại giấy chứng nhận (2)",
    answerType: "select" as const,
    options: [
      "GCNĐĐK ATTP",
      "ISO 22000:2018",
      "HACCP",
      "Chuỗi ATTP",
      "Khác",
    ],
  },
  {
    key: "productGroups",
    label: "Mặt hàng cung cấp",
    answerType: "multi-select" as const,
    options: [
      "Thịt",
      "Thủy sản",
      "Rau, củ, quả",
      "Trái cây",
      "Bánh, kẹo, sữa chua, sữa",
      "Nước uống",
      "Gạo",
      "Thực phẩm khác",
    ],
  },
];

const registrationHistoryFields = [
  {
    key: "initialRegistrationDate",
    label: "Ngày đăng ký lần đầu",
    answerType: "date" as const,
  },
  {
    key: "amendmentDate",
    label: "Ngày đăng ký thay đổi gần nhất",
    answerType: "date" as const,
  },
  {
    key: "amendmentSequence",
    label: "Lần thay đổi thứ",
    answerType: "number" as const,
  },
];

const storageInventoryFields = [
  {
    key: "equipmentType",
    label: "Loại thiết bị",
    answerType: "select" as const,
    options: ["Tủ đông", "Tủ lạnh", "Tủ mát", "Kho đông", "Kho mát", "Khác"],
    required: true,
  },
  { key: "quantity", label: "Số lượng", answerType: "number" as const, required: true },
  { key: "notes", label: "Mô tả/ghi chú", answerType: "text" as const },
];

const sinkInventoryFields = [
  {
    key: "sinkType",
    label: "Loại bồn rửa",
    answerType: "select" as const,
    options: [
      "Bồn rửa tay",
      "Bồn rửa dụng cụ",
      "Bồn rửa thịt",
      "Bồn rửa thủy sản",
      "Bồn rửa rau",
      "Khác",
    ],
    required: true,
  },
  { key: "quantity", label: "Số lượng", answerType: "number" as const, required: true },
];

const cookingUtensilFields = [
  { key: "utensilType", label: "Loại dụng cụ", answerType: "text" as const, required: true },
  { key: "quantity", label: "Tổng số lượng", answerType: "number" as const, required: true },
  { key: "rawFoodQuantity", label: "Dành riêng cho thực phẩm sống", answerType: "number" as const },
  { key: "cookedFoodQuantity", label: "Dành riêng cho thực phẩm chín", answerType: "number" as const },
];

const stoveInventoryFields = [
  {
    key: "stoveType",
    label: "Loại bếp",
    answerType: "select" as const,
    options: ["Bếp gas", "Bếp điện", "Bếp than, củi", "Khác"],
    required: true,
  },
  { key: "quantity", label: "Số lượng", answerType: "number" as const, required: true },
];

const sampleStorageFields = [
  { key: "equipmentCount", label: "Số lượng dụng cụ lưu mẫu", answerType: "number" as const, required: true },
  { key: "material", label: "Chất liệu dụng cụ lưu mẫu", answerType: "text" as const, required: true },
  { key: "collectionMethod", label: "Cách lấy mẫu thức ăn", answerType: "text" as const, required: true },
  { key: "storageDuration", label: "Thời gian bảo quản mẫu", answerType: "text" as const, required: true },
  { key: "storageTemperature", label: "Nhiệt độ bảo quản mẫu", answerType: "text" as const, required: true },
  { key: "storageArea", label: "Khu vực lưu mẫu", answerType: "text" as const, required: true },
  { key: "storageCabinet", label: "Tủ lưu mẫu", answerType: "text" as const, required: true },
];

const waterTestingFields = [
  {
    key: "waterSource",
    label: "Nguồn nước",
    answerType: "select" as const,
    options: ["Nước máy", "Nước ngầm"],
    required: true,
  },
  {
    key: "testingStatus",
    label: "Kiểm nghiệm định kỳ",
    answerType: "select" as const,
    options: ["Có thực hiện", "Không thực hiện"],
    required: true,
  },
  {
    key: "testingFrequency",
    label: "Tần suất kiểm nghiệm",
    answerType: "select" as const,
    options: ["03 tháng", "06 tháng", "12 tháng", "Khác"],
  },
];

criteria["meal-provider"] = {
  type: "meal-provider",
  version: "MP-2026.2",
  effectiveFrom: "2026-09-01",
  totalScore: 100,
  groups: groupList("meal-provider", [
    "Thông tin chung",
    "Công suất phục vụ và đơn vị nhận suất ăn",
    "Hồ sơ pháp lý và nhân sự",
    "Điều kiện bảo đảm an toàn thực phẩm",
    "Trang thiết bị, vận chuyển và thực hành",
    "Kiểm thực, lưu mẫu và nguồn nước",
    "Nguồn nguyên liệu và xác nhận",
  ]),
  criteria: [
    formField("meal-provider", "surveyDate", "Ngày thực hiện", "meal-provider-group-1", "date", 1),
    formField("meal-provider", "surveyedOrganization", "Tổ chức/cá nhân được khảo sát", "meal-provider-group-1", "text", 2),
    formField("meal-provider", "informationProvider", "Người cung cấp thông tin", "meal-provider-group-1", "text", 3),
    formField("meal-provider", "citizenId", "CCCD số", "meal-provider-group-1", "text", 4),
    formField("meal-provider", "informationProviderPosition", "Chức vụ người cung cấp thông tin", "meal-provider-group-1", "text", 5),
    formField("meal-provider", "applicantName", "Tên tổ chức/cá nhân (trụ sở chính)", "meal-provider-group-1", "text", 6),
    formField("meal-provider", "headquartersAddress", "Địa chỉ trụ sở chính", "meal-provider-group-1", "text", 7),
    formField("meal-provider", "taxCode", "Mã số doanh nghiệp / mã số thuế / mã định danh", "meal-provider-group-1", "text", 8),
    formField("meal-provider", "taxIssueDate", "Ngày cấp mã số", "meal-provider-group-1", "date", 9),
    formField("meal-provider", "taxIssuePlace", "Nơi cấp mã số", "meal-provider-group-1", "text", 10),
    formField("meal-provider", "taxInitialRegistrationDate", "Ngày đăng ký lần đầu", "meal-provider-group-1", "date", 10.1, [], { required: false }),
    formField("meal-provider", "taxAmendmentDate", "Ngày đăng ký thay đổi gần nhất", "meal-provider-group-1", "date", 10.2, [], { required: false }),
    formField("meal-provider", "taxAmendmentSequence", "Lần thay đổi thứ", "meal-provider-group-1", "number", 10.3, [], { required: false }),
    formField("meal-provider", "legalRepresentative", "Người đại diện theo pháp luật / chủ cơ sở", "meal-provider-group-1", "text", 11),
    formField("meal-provider", "legalRepresentativeTitle", "Chức danh người đại diện", "meal-provider-group-1", "text", 12),
    formField("meal-provider", "facilityName", "Tên cơ sở/địa điểm được khảo sát (xưởng chế biến/bếp nấu)", "meal-provider-group-1", "text", 13),
    formField("meal-provider", "facilityAddress", "Địa chỉ cơ sở/địa điểm được khảo sát", "meal-provider-group-1", "text", 14),
    formField("meal-provider", "branchCode", "Mã số chi nhánh / mã số địa điểm kinh doanh", "meal-provider-group-1", "text", 15),
    formField("meal-provider", "branchIssueDate", "Ngày cấp mã chi nhánh/địa điểm", "meal-provider-group-1", "date", 16),
    formField("meal-provider", "branchIssuePlace", "Nơi cấp mã chi nhánh/địa điểm", "meal-provider-group-1", "text", 17),
    formField("meal-provider", "branchInitialRegistrationDate", "Ngày đăng ký địa điểm lần đầu", "meal-provider-group-1", "date", 17.1, [], { required: false }),
    formField("meal-provider", "branchAmendmentDate", "Ngày đăng ký địa điểm thay đổi gần nhất", "meal-provider-group-1", "date", 17.2, [], { required: false }),
    formField("meal-provider", "branchAmendmentSequence", "Lần thay đổi địa điểm thứ", "meal-provider-group-1", "number", 17.3, [], { required: false }),
    formField("meal-provider", "facilityRepresentative", "Người đại diện tại cơ sở", "meal-provider-group-1", "text", 18),
    formField("meal-provider", "facilityRepresentativeTitle", "Chức danh người đại diện tại cơ sở", "meal-provider-group-1", "text", 19),
    formField("meal-provider", "foodSafetyContactName", "Người trực tiếp phụ trách ATTP", "meal-provider-group-1", "text", 20),
    formField("meal-provider", "foodSafetyContactTitle", "Chức vụ người phụ trách ATTP", "meal-provider-group-1", "text", 21),
    formField("meal-provider", "foodSafetyContactPhone", "Số điện thoại người phụ trách ATTP", "meal-provider-group-1", "text", 22),
    formField("meal-provider", "foodSafetyContactEmail", "Email người phụ trách ATTP", "meal-provider-group-1", "text", 23),
    formField("meal-provider", "email", "Email đăng nhập và nhận thông báo hồ sơ", "meal-provider-group-1", "text", 23.1),
    formField("meal-provider", "totalCapacity", "Công suất phục vụ (suất/ngày)", "meal-provider-group-2", "number", 24),
    formField("meal-provider", "breakfastCapacity", "Công suất ca sáng (suất/ngày)", "meal-provider-group-2", "number", 25, [], { required: false }),
    formField("meal-provider", "lunchCapacity", "Công suất ca trưa (suất/ngày)", "meal-provider-group-2", "number", 26, [], { required: false }),
    formField("meal-provider", "snackCapacity", "Công suất ca xế (suất/ngày)", "meal-provider-group-2", "number", 27, [], { required: false }),
    formField("meal-provider", "dinnerCapacity", "Công suất ca tối (suất/ngày)", "meal-provider-group-2", "number", 28, [], { required: false }),
    formField("meal-provider", "servingUnitCount", "Số lượng đơn vị nhận cung cấp", "meal-provider-group-2", "number", 29),
    formField(
      "meal-provider",
      "recipientOverview",
      "Thống kê số lượng và giá suất ăn theo nhóm đơn vị",
      "meal-provider-group-2",
      "repeatable",
      29.5,
      [],
      {
        required: false,
        description:
          "Khai báo số lượng theo từng nhóm đơn vị và chọn một mức giá cho mỗi dòng.",
        repeatableFields: [
          {
            key: "target",
            label: "Đơn vị nhận suất ăn",
            answerType: "select",
            options: ["Trường học/Cơ sở giáo dục", "Công ty/xí nghiệp", "Bệnh viện", "Khác"],
            required: true,
          },
          {
            key: "otherTarget",
            label: "Tên nhóm khác (nếu có)",
            answerType: "text",
          },
          { key: "quantity", label: "Số lượng", answerType: "number", required: true },
          {
            key: "priceRange",
            label: "Giá thành suất ăn (đồng/suất)",
            answerType: "select",
            options: [
              "Dưới 25.000 đồng",
              "Từ 25.000 đến 30.000 đồng",
              "Từ 30.000 đến 35.000 đồng",
              "Trên 35.000 đồng",
            ],
            required: true,
          },
        ],
      },
    ),
    formField(
      "meal-provider",
      "suppliedUnits",
      "Danh sách đơn vị nhận suất ăn",
      "meal-provider-group-2",
      "repeatable",
      30,
      [],
      {
        description: "Khai báo từng đơn vị nhận suất ăn, số lượng, giá và thời điểm giao nhận.",
        repeatableFields: [
          { key: "unitName", label: "Đơn vị nhận suất ăn", answerType: "text", required: true },
          { key: "unitAddress", label: "Địa chỉ", answerType: "text", required: true },
          { key: "contractNumber", label: "Số hợp đồng", answerType: "text" },
          { key: "contractDate", label: "Ngày ký hợp đồng", answerType: "date" },
          {
            key: "target",
            label: "Đối tượng",
            answerType: "select",
            options: ["Trường học/Cơ sở giáo dục", "Công ty/xí nghiệp", "Bệnh viện", "Khác"],
            required: true,
          },
          { key: "otherTarget", label: "Tên đơn vị khác (nếu có)", answerType: "text" },
          { key: "quantity", label: "Số lượng suất ăn", answerType: "number", required: true },
           { key: "morningQuantity", label: "Số suất ca sáng", answerType: "number" },
           { key: "lunchQuantity", label: "Số suất ca trưa", answerType: "number" },
           { key: "snackQuantity", label: "Số suất ca xế", answerType: "number" },
           { key: "dinnerQuantity", label: "Số suất ca tối", answerType: "number" },
          {
            key: "priceRange",
            label: "Giá thành suất ăn",
            answerType: "select",
            options: ["Dưới 25.000 đồng", "Từ 25.000 đến 30.000 đồng", "Từ 30.000 đến 35.000 đồng", "Trên 35.000 đồng"],
            required: true,
          },
          { key: "deliveryTime", label: "Thời điểm giao nhận suất ăn", answerType: "text" },
           { key: "morningDeliveryTime", label: "Giờ giao nhận ca sáng", answerType: "text" },
           { key: "lunchDeliveryTime", label: "Giờ giao nhận ca trưa", answerType: "text" },
           { key: "snackDeliveryTime", label: "Giờ giao nhận ca xế", answerType: "text" },
           { key: "dinnerDeliveryTime", label: "Giờ giao nhận ca tối", answerType: "text" },
        ],
      },
    ),
    formField("meal-provider", "certificates", "Giấy chứng nhận quản lý chất lượng", "meal-provider-group-3", "repeatable", 31, [], { repeatableFields: documentFields }),
    formField("meal-provider", "totalStaff", "Tổng số người làm việc tại địa điểm", "meal-provider-group-3", "number", 32),
    formField("meal-provider", "directStaff", "Số người trực tiếp sơ chế/chế biến/chia suất", "meal-provider-group-3", "number", 33),
    formField("meal-provider", "fullTimeStaff", "Số lao động trực tiếp toàn thời gian", "meal-provider-group-3", "number", 34),
    formField("meal-provider", "partTimeStaff", "Số lao động trực tiếp bán thời gian", "meal-provider-group-3", "number", 35),
    formField("meal-provider", "indirectStaff", "Số người không trực tiếp", "meal-provider-group-3", "number", 36),
    formField("meal-provider", "indirectFullTimeStaff", "Số lao động không trực tiếp toàn thời gian", "meal-provider-group-3", "number", 36.1),
    formField("meal-provider", "indirectPartTimeStaff", "Số lao động không trực tiếp bán thời gian", "meal-provider-group-3", "number", 36.2),
    formField("meal-provider", "trainedStaff", "Số người đã được tập huấn ATTP", "meal-provider-group-3", "number", 37),
    formField("meal-provider", "trainedStaffTotal", "Tổng số người thuộc diện tập huấn ATTP", "meal-provider-group-3", "number", 37.1),
    formField("meal-provider", "healthCheckedStaff", "Số người đã được khám/theo dõi sức khỏe", "meal-provider-group-3", "number", 38),
    formField("meal-provider", "healthCheckedStaffTotal", "Tổng số người thuộc diện khám sức khỏe", "meal-provider-group-3", "number", 38.1),
    formField("meal-provider", "totalArea", "Tổng diện tích (m²)", "meal-provider-group-4", "number", 39),
    formField("meal-provider", "processingArea", "Khu sơ chế/chế biến (m²)", "meal-provider-group-4", "number", 40),
    formField("meal-provider", "servingArea", "Khu vực chia suất (m²)", "meal-provider-group-4", "number", 41),
    formField("meal-provider", "structure", "Kết cấu", "meal-provider-group-4", "text", 42),
    formField("meal-provider", "environment", "Địa điểm, môi trường", "meal-provider-group-4", "text", 43),
    formField("meal-provider", "processDescription", "Quy trình và phân bố khu vực chế biến/nấu ăn", "meal-provider-group-4", "text", 44),
    formField("meal-provider", "wallsCeiling", "Tường, nền, trần", "meal-provider-group-4", "text", 45),
    formField("meal-provider", "lightingVentilation", "Hệ thống chiếu sáng, thông gió", "meal-provider-group-4", "text", 46),
    formField("meal-provider", "drainage", "Cống rãnh, thoát nước", "meal-provider-group-4", "text", 47),
    formField("meal-provider", "wasteArea", "Khu vực tập kết và thu gom rác thải", "meal-provider-group-4", "text", 48),
    formField("meal-provider", "changingRoom", "Phòng thay bảo hộ, vệ sinh cho nhân viên", "meal-provider-group-4", "text", 49),
    formField("meal-provider", "rawStorageEquipment", "Thiết bị bảo quản nguyên liệu (kho/tủ)", "meal-provider-group-5", "text", 50),
    formField("meal-provider", "foodStorageEquipment", "Thiết bị bảo quản thực phẩm (kho/tủ)", "meal-provider-group-5", "text", 51),
    formField("meal-provider", "sinkEquipment", "Bồn rửa và phân loại bồn rửa", "meal-provider-group-5", "text", 52),
    formField("meal-provider", "rawStorageInventory", "Chi tiết thiết bị bảo quản nguyên liệu", "meal-provider-group-5", "repeatable", 52.1, [], { required: false, repeatableFields: storageInventoryFields }),
    formField("meal-provider", "foodStorageInventory", "Chi tiết thiết bị bảo quản thực phẩm", "meal-provider-group-5", "repeatable", 52.2, [], { required: false, repeatableFields: storageInventoryFields }),
    formField("meal-provider", "sinkInventory", "Chi tiết bồn rửa", "meal-provider-group-5", "repeatable", 52.3, [], { required: false, repeatableFields: sinkInventoryFields }),
    formField("meal-provider", "prepTables", "Bàn sơ chế và chế biến (cái)", "meal-provider-group-5", "number", 53),
    formField("meal-provider", "cookingEquipment", "Tủ nấu/nồi nấu cơm và dụng cụ chế biến", "meal-provider-group-5", "text", 54),
    formField("meal-provider", "cookingUtensilInventory", "Chi tiết dụng cụ chế biến", "meal-provider-group-5", "repeatable", 54.1, [], { required: false, repeatableFields: cookingUtensilFields }),
    formField("meal-provider", "diningEquipment", "Dụng cụ ăn uống và chứa đựng thức ăn", "meal-provider-group-5", "text", 55),
    formField("meal-provider", "sampleEquipment", "Dụng cụ lưu mẫu", "meal-provider-group-5", "text", 56),
    formField("meal-provider", "pestControl", "Thiết bị phòng chống côn trùng", "meal-provider-group-5", "text", 57),
    formField("meal-provider", "wasteEquipment", "Dụng cụ thu gom rác thải", "meal-provider-group-5", "text", 58),
    formField("meal-provider", "cookingStove", "Thiết bị nấu nướng (bếp gas, điện, than, củi...)", "meal-provider-group-5", "text", 59),
    formField("meal-provider", "stoveInventory", "Chi tiết thiết bị nấu nướng", "meal-provider-group-5", "repeatable", 59.1, [], { required: false, repeatableFields: stoveInventoryFields }),
    formField("meal-provider", "transportVehicles", "Phương tiện vận chuyển suất ăn", "meal-provider-group-5", "repeatable", 60, [], {
      required: false,
      repeatableFields: [
        { key: "ownership", label: "Hình thức", answerType: "select", options: ["Xe thuộc công ty", "Xe hợp đồng bên ngoài"], required: true },
        { key: "quantity", label: "Số lượng xe", answerType: "number", required: true },
        { key: "vehicleType", label: "Loại xe", answerType: "text" },
      ],
    }),
    formField("meal-provider", "transportContainers", "Dụng cụ chứa đựng, bảo quản khi vận chuyển", "meal-provider-group-5", "text", 61),
    formField("meal-provider", "rapidTestEquipment", "Trang bị bộ test nhanh dùng cho thực phẩm", "meal-provider-group-5", "text", 62),
    formField("meal-provider", "protectiveClothing", "Bảo hộ lao động cho nhân viên và tỷ lệ đáp ứng", "meal-provider-group-5", "text", 63),
    formField("meal-provider", "foodSafetyPractice", "Thực hành an toàn thực phẩm tại cơ sở", "meal-provider-group-5", "text", 64),
    formField("meal-provider", "internalControls", "Các biện pháp kiểm soát nội bộ", "meal-provider-group-5", "text", 65),
    formField("meal-provider", "threeStepInspection", "Kiểm thực 03 bước", "meal-provider-group-6", "text", 66),
    formField("meal-provider", "sampleCollection", "Lấy mẫu thức ăn", "meal-provider-group-6", "text", 67),
    formField("meal-provider", "sampleStorage", "Bảo quản mẫu (thời gian, nhiệt độ, khu vực, tủ lưu mẫu)", "meal-provider-group-6", "text", 68),
    formField("meal-provider", "sampleStorageDetails", "Chi tiết lưu mẫu thức ăn", "meal-provider-group-6", "repeatable", 68.1, [], { required: false, repeatableFields: sampleStorageFields }),
    formField("meal-provider", "waterSources", "Nguồn nước sử dụng", "meal-provider-group-6", "multi-select", 69, ["Nước máy", "Nước ngầm"]),
    formField("meal-provider", "waterTesting", "Kiểm nghiệm nước định kỳ và tần suất", "meal-provider-group-6", "text", 70),
    formField("meal-provider", "waterTestingDetails", "Chi tiết kiểm nghiệm theo nguồn nước", "meal-provider-group-6", "repeatable", 70.1, [], { required: false, repeatableFields: waterTestingFields }),
    formField("meal-provider", "ingredientSuppliers", "Các nhà cung cấp nguyên liệu", "meal-provider-group-7", "repeatable", 71, [], {
      repeatableFields: supplierFields,
    }),
    formField("meal-provider", "otherContents", "Các nội dung khác", "meal-provider-group-7", "text", 72, [], { required: false }),
    formField("meal-provider", "confirmation", "Xác nhận của cơ sở", "meal-provider-group-7", "text", 73),
  ],
};

criteria.school = {
  type: "school",
  version: "SC-2026.2",
  effectiveFrom: "2026-09-01",
  totalScore: 100,
  groups: groupList("school", [
    "Thông tin chung cơ sở giáo dục",
    "Mô hình và quy mô hoạt động bếp ăn",
    "Hồ sơ pháp lý và người phụ trách ATTP",
    "Nhân sự, điều kiện cơ sở và trang thiết bị",
    "Thực hành ATTP, kiểm thực và lưu mẫu",
    "Khu vực ăn uống",
    "Nguồn nước, nguyên liệu và nước uống",
    "Nội dung khác và xác nhận",
  ]),
  criteria: [
    formField("school", "surveyDate", "Ngày thực hiện", "school-group-1", "date", 1),
    formField("school", "surveyLocation", "Địa điểm được khảo sát", "school-group-1", "text", 2),
    formField("school", "informationProvider", "Người cung cấp thông tin", "school-group-1", "text", 3),
    formField("school", "citizenId", "CCCD số", "school-group-1", "text", 4),
    formField("school", "informationProviderPosition", "Chức vụ người cung cấp thông tin", "school-group-1", "text", 5),
    formField("school", "applicantName", "Tên cơ sở giáo dục", "school-group-1", "text", 6),
    formField("school", "addressMain", "Địa chỉ điểm chính", "school-group-1", "text", 7),
    formField("school", "addressBranches", "Địa chỉ phân hiệu/điểm trường", "school-group-1", "text", 8, [], { required: false }),
    formField("school", "managementForm", "Hình thức tổ chức quản lý", "school-group-1", "select", 9, ["Công lập", "Ngoài công lập"]),
    formField("school", "educationLevels", "Cấp học", "school-group-1", "multi-select", 10, ["Mầm non", "Tiểu học", "THCS", "THPT", "Khác"]),
    formField("school", "educationLevelOther", "Cấp học khác", "school-group-1", "text", 10.1, [], { required: false }),
    formField("school", "studentTotal", "Tổng số học sinh", "school-group-1", "number", 11),
    formField("school", "boardingStudentTotal", "Số học sinh bán trú", "school-group-1", "number", 12),
    formField("school", "establishmentDecision", "Quyết định thành lập cơ sở giáo dục", "school-group-1", "file", 13),
    formField("school", "principalName", "Hiệu trưởng", "school-group-1", "text", 14),
    formField("school", "principalDecision", "Quyết định công nhận hiệu trưởng", "school-group-1", "file", 15),
    formField("school", "email", "Email đăng nhập và nhận thông báo hồ sơ", "school-group-1", "text", 15.1),
    formField("school", "foodSafetyContacts", "Người trực tiếp phụ trách ATTP", "school-group-1", "repeatable", 16, [], {
      description: "Khai báo từng người phụ trách ATTP tại cơ sở.",
      repeatableFields: [
        { key: "name", label: "Họ và tên", answerType: "text", required: true },
        { key: "title", label: "Chức vụ", answerType: "text", required: true },
        { key: "phone", label: "Số điện thoại", answerType: "text", required: true },
        { key: "email", label: "Email", answerType: "text" },
      ],
    }),
    formField("school", "operatingModels", "Mô hình, quy mô hoạt động của bếp ăn", "school-group-2", "repeatable", 17, [], {
      description: "Khai báo từng mô hình đang hoạt động và chọn mẫu phiếu tương ứng.",
      repeatableFields: [
        {
          key: "model",
          label: "Mô hình hoạt động",
          answerType: "select",
          options: ["BATT tự tổ chức", "BATT hợp đồng", "Nhận suất ăn sẵn", "Căng tin trường học"],
          required: true,
        },
        { key: "siteAddress", label: "Địa điểm/phân hiệu thực hiện", answerType: "text" },
        { key: "capacity", label: "Công suất (suất/ngày)", answerType: "number", required: true },
        { key: "morningCapacity", label: "Sáng (suất/ngày)", answerType: "number" },
        { key: "lunchCapacity", label: "Trưa (suất/ngày)", answerType: "number" },
        { key: "snackCapacity", label: "Xế (suất/ngày)", answerType: "number" },
        { key: "dinnerCapacity", label: "Tối (suất/ngày)", answerType: "number" },
        {
          key: "priceRange",
          label: "Giá thành suất ăn",
          answerType: "select",
          options: ["Dưới 25.000 đồng", "Từ 25.000 đến 30.000 đồng", "Từ 30.000 đến 35.000 đồng", "Trên 35.000 đồng"],
          required: true,
        },
      ],
    }),
    formField("school", "linkedMealProviders", "Đơn vị cung cấp suất ăn (nếu có)", "school-group-2", "repeatable", 17.1, [], {
      required: false,
      active: false,
      repeatableFields: [
        { key: "providerName", label: "Tên đơn vị cung cấp suất ăn", answerType: "text", required: true },
        { key: "providerAddress", label: "Địa chỉ đơn vị", answerType: "text" },
        { key: "contractNumber", label: "Số hợp đồng", answerType: "text" },
        { key: "contractDate", label: "Ngày ký hợp đồng", answerType: "date" },
        { key: "deliverySchedule", label: "Thời điểm giao/nhận", answerType: "text" },
      ],
    }),
    formField("school", "modelServiceDetails", "Thông tin đơn vị cung cấp dịch vụ (nếu có)", "school-group-2", "repeatable", 17.2, [], {
      required: false,
      active: false,
      description: "Khai báo từng đơn vị thực hiện tại từng địa điểm. Mẫu chi tiết được hệ thống xác định tự động từ mô hình hoạt động.",
      repeatableFields: [
        { key: "organizationName", label: "Tên tổ chức/cá nhân/đơn vị thực hiện", answerType: "text", required: true },
        { key: "organizationAddress", label: "Địa chỉ", answerType: "text", required: true },
        { key: "taxCode", label: "Mã số doanh nghiệp/mã số thuế/mã định danh", answerType: "text" },
        { key: "issueDate", label: "Ngày cấp", answerType: "date" },
        { key: "issuePlace", label: "Nơi cấp", answerType: "text" },
        { key: "representative", label: "Người đại diện/chủ cơ sở", answerType: "text" },
        { key: "representativeTitle", label: "Chức danh", answerType: "text" },
        { key: "contractNumber", label: "Số hợp đồng", answerType: "text" },
        { key: "contractDate", label: "Ngày ký hợp đồng", answerType: "date" },
        { key: "confirmation", label: "Xác nhận của đơn vị/cơ sở", answerType: "text" },
      ],
    }),
    formField("school", "mealTransparency", "Hình thức minh bạch, công khai thông tin về bữa ăn bán trú", "school-group-2", "text", 18),
    formField("school", "incidentResponseProcess", "Quy trình phòng ngừa, ứng phó, xử lý sự cố ATTP và ngộ độc", "school-group-2", "text", 19),
    formField("school", "privateOwnerOrganization", "Tên tổ chức/doanh nghiệp sở hữu, quản lý (ngoài công lập)", "school-group-2", "text", 20, [], { required: false, dependsOn: { key: "managementForm", equals: "Ngoài công lập" } }),
    formField("school", "privateOwnerAddress", "Địa chỉ tổ chức/doanh nghiệp sở hữu", "school-group-2", "text", 21, [], { required: false, dependsOn: { key: "managementForm", equals: "Ngoài công lập" } }),
    formField("school", "privateOwnerTaxCode", "Mã số doanh nghiệp/mã số thuế của đơn vị sở hữu", "school-group-2", "text", 22, [], { required: false, dependsOn: { key: "managementForm", equals: "Ngoài công lập" } }),
    formField("school", "privateOwnerIssueDate", "Ngày cấp mã số của đơn vị sở hữu", "school-group-2", "date", 22.1, [], { required: false, dependsOn: { key: "managementForm", equals: "Ngoài công lập" } }),
    formField("school", "privateOwnerIssuePlace", "Nơi cấp mã số của đơn vị sở hữu", "school-group-2", "text", 22.2, [], { required: false, dependsOn: { key: "managementForm", equals: "Ngoài công lập" } }),
    formField("school", "privateOwnerInitialRegistrationDate", "Ngày đăng ký lần đầu của đơn vị sở hữu", "school-group-2", "date", 22.3, [], { required: false, dependsOn: { key: "managementForm", equals: "Ngoài công lập" } }),
    formField("school", "privateOwnerAmendmentDate", "Ngày đăng ký thay đổi gần nhất của đơn vị sở hữu", "school-group-2", "date", 22.4, [], { required: false, dependsOn: { key: "managementForm", equals: "Ngoài công lập" } }),
    formField("school", "privateOwnerAmendmentSequence", "Lần thay đổi thứ của đơn vị sở hữu", "school-group-2", "number", 22.5, [], { required: false, dependsOn: { key: "managementForm", equals: "Ngoài công lập" } }),
    formField("school", "privateOwnerRepresentative", "Người đại diện theo pháp luật/chủ cơ sở", "school-group-2", "text", 23, [], { required: false, dependsOn: { key: "managementForm", equals: "Ngoài công lập" } }),
    formField("school", "privateOwnerRepresentativeTitle", "Chức danh người đại diện", "school-group-2", "text", 23.1, [], { required: false, dependsOn: { key: "managementForm", equals: "Ngoài công lập" } }),
    formField("school", "qualityCertificateStatus", "Tình trạng thuộc diện cấp giấy chứng nhận quản lý chất lượng", "school-group-3", "select", 24, [
      "Đối tượng không thuộc diện phải cấp giấy chứng nhận quản lý chất lượng",
      "Đối tượng thuộc diện cấp giấy chứng nhận quản lý chất lượng",
    ]),
    formField("school", "qualityCertificates", "Giấy chứng nhận quản lý chất lượng", "school-group-3", "repeatable", 25, [], { required: false, dependsOn: { key: "qualityCertificateStatus", equals: "Đối tượng thuộc diện cấp giấy chứng nhận quản lý chất lượng" }, repeatableFields: documentFields }),
    formField("school", "totalFoodStaff", "Tổng số người tham gia chế biến, nấu ăn", "school-group-3", "number", 26),
    formField("school", "directFoodStaff", "Số người trực tiếp sơ chế/chế biến/chia suất", "school-group-3", "number", 27),
    formField("school", "directFullTimeFoodStaff", "Số lao động trực tiếp toàn thời gian", "school-group-3", "number", 27.1),
    formField("school", "directPartTimeFoodStaff", "Số lao động trực tiếp bán thời gian", "school-group-3", "number", 27.2),
    formField("school", "indirectFoodStaff", "Số người không trực tiếp", "school-group-3", "number", 28),
    formField("school", "indirectFullTimeFoodStaff", "Số lao động không trực tiếp toàn thời gian", "school-group-3", "number", 28.1),
    formField("school", "indirectPartTimeFoodStaff", "Số lao động không trực tiếp bán thời gian", "school-group-3", "number", 28.2),
    formField("school", "trainedFoodStaff", "Số người đã tập huấn ATTP", "school-group-3", "number", 29),
    formField("school", "trainedFoodStaffTotal", "Tổng số người thuộc diện tập huấn ATTP", "school-group-3", "number", 29.1),
    formField("school", "healthCheckedFoodStaff", "Số người đã khám/theo dõi sức khỏe", "school-group-3", "number", 30),
    formField("school", "healthCheckedFoodStaffTotal", "Tổng số người thuộc diện khám sức khỏe", "school-group-3", "number", 30.1),
    formField("school", "totalArea", "Tổng diện tích (m²)", "school-group-3", "number", 31),
    formField("school", "preparationArea", "Khu vực sơ chế (m²)", "school-group-3", "number", 32),
    formField("school", "processingArea", "Khu vực chế biến (m²)", "school-group-3", "number", 33),
    formField("school", "servingArea", "Khu vực chia suất (m²)", "school-group-3", "number", 34),
    formField("school", "separatePreparationRoom", "Phòng sơ chế riêng biệt", "school-group-3", "yes-no", 35, ["Có", "Không có"]),
    formField("school", "separateProcessingRoom", "Phòng chế biến riêng biệt", "school-group-3", "yes-no", 36, ["Có", "Không có"]),
    formField("school", "separateServingRoom", "Phòng chia suất riêng biệt", "school-group-3", "yes-no", 37, ["Có", "Không có"]),
    formField("school", "structure", "Kết cấu", "school-group-3", "text", 38),
    formField("school", "environment", "Địa điểm, môi trường", "school-group-3", "text", 39),
    formField("school", "processDescription", "Quy trình và phân bố khu vực chế biến/nấu ăn", "school-group-3", "text", 40),
    formField("school", "wallsCeiling", "Tường, nền, trần", "school-group-3", "text", 41),
    formField("school", "lightingVentilation", "Hệ thống chiếu sáng, thông gió", "school-group-3", "text", 42),
    formField("school", "drainage", "Cống rãnh, thoát nước", "school-group-3", "text", 43),
    formField("school", "wasteArea", "Khu vực tập kết và thu gom rác thải", "school-group-3", "text", 44),
    formField("school", "changingRoom", "Phòng thay bảo hộ, vệ sinh cho người chế biến", "school-group-3", "text", 45),
    formField("school", "rawStorageEquipment", "Thiết bị bảo quản nguyên liệu", "school-group-4", "text", 45),
    formField("school", "foodStorageEquipment", "Thiết bị bảo quản thực phẩm", "school-group-4", "text", 46),
    formField("school", "sinkEquipment", "Bồn rửa và phân loại bồn rửa", "school-group-4", "text", 47),
    formField("school", "rawStorageInventory", "Chi tiết thiết bị bảo quản nguyên liệu", "school-group-4", "repeatable", 47.1, [], { required: false, repeatableFields: storageInventoryFields }),
    formField("school", "foodStorageInventory", "Chi tiết thiết bị bảo quản thực phẩm", "school-group-4", "repeatable", 47.2, [], { required: false, repeatableFields: storageInventoryFields }),
    formField("school", "sinkInventory", "Chi tiết bồn rửa", "school-group-4", "repeatable", 47.3, [], { required: false, repeatableFields: sinkInventoryFields }),
    formField("school", "prepTables", "Bàn sơ chế và chế biến (cái)", "school-group-4", "number", 48),
    formField("school", "cookingEquipment", "Tủ nấu/nồi nấu cơm và dụng cụ chế biến", "school-group-4", "text", 49),
    formField("school", "cookingUtensilInventory", "Chi tiết dụng cụ chế biến", "school-group-4", "repeatable", 49.1, [], { required: false, repeatableFields: cookingUtensilFields }),
    formField("school", "diningEquipment", "Dụng cụ ăn uống và chứa đựng thức ăn", "school-group-4", "text", 50),
    formField("school", "sampleEquipment", "Dụng cụ lưu mẫu", "school-group-4", "text", 51),
    formField("school", "pestControl", "Thiết bị phòng chống côn trùng", "school-group-4", "text", 52),
    formField("school", "wasteEquipment", "Dụng cụ thu gom rác thải", "school-group-4", "text", 53),
    formField("school", "cookingStove", "Thiết bị nấu nướng", "school-group-4", "text", 54),
    formField("school", "stoveInventory", "Chi tiết thiết bị nấu nướng", "school-group-4", "repeatable", 54.1, [], { required: false, repeatableFields: stoveInventoryFields }),
    formField("school", "transportBetweenSchools", "Phương tiện vận chuyển suất ăn giữa các điểm trường", "school-group-4", "text", 55, [], { required: false }),
    formField("school", "transportContainers", "Dụng cụ chứa đựng, bảo quản khi vận chuyển", "school-group-4", "text", 56, [], { required: false }),
    formField("school", "rapidTestEquipment", "Trang bị bộ test nhanh dùng cho thực phẩm", "school-group-4", "text", 57),
    formField("school", "protectiveClothing", "Bảo hộ lao động và tỷ lệ đáp ứng", "school-group-5", "text", 58),
    formField("school", "foodSafetyPractice", "Thực hành an toàn thực phẩm của nhân viên", "school-group-5", "text", 59),
    formField("school", "internalControls", "Các biện pháp kiểm soát nội bộ", "school-group-5", "text", 60),
    formField("school", "threeStepInspection", "Kiểm thực 03 bước", "school-group-5", "text", 61),
    formField("school", "sampleCollection", "Lấy mẫu thức ăn", "school-group-5", "text", 62),
    formField("school", "sampleStorage", "Bảo quản mẫu (thời gian, nhiệt độ, khu vực, tủ lưu mẫu)", "school-group-5", "text", 63),
    formField("school", "sampleStorageDetails", "Chi tiết lưu mẫu thức ăn", "school-group-5", "repeatable", 63.1, [], { required: false, repeatableFields: sampleStorageFields }),
    formField("school", "diningAreaType", "Khu vực nhà ăn/khu vực ăn uống", "school-group-6", "select", 64, ["Có nhà ăn riêng biệt", "Không có nhà ăn riêng biệt"]),
    formField("school", "diningAreaSize", "Diện tích nhà ăn/khu vực ăn uống (m²)", "school-group-6", "number", 65),
    formField("school", "mealShiftCapacity", "Số ca và số suất trung bình mỗi ca", "school-group-6", "text", 66),
    formField("school", "diningTables", "Bàn ăn: số lượng, chất liệu, vệ sinh định kỳ", "school-group-6", "text", 67),
    formField("school", "diningStructure", "Kết cấu khu vực ăn uống", "school-group-6", "text", 68),
    formField("school", "diningEnvironment", "Địa điểm, môi trường khu vực ăn uống", "school-group-6", "text", 69),
    formField("school", "diningWallsCeiling", "Tường, nền, trần khu vực ăn uống", "school-group-6", "text", 70),
    formField("school", "diningLightingVentilation", "Chiếu sáng, thông gió khu vực ăn uống", "school-group-6", "text", 71),
    formField("school", "diningDrainage", "Cống rãnh, thoát nước khu vực ăn uống", "school-group-6", "text", 72),
    formField("school", "diningWasteArea", "Khu vực tập kết và thu gom rác thải tại khu vực ăn uống", "school-group-6", "text", 72.1),
    formField("school", "handwashingArea", "Khu vực rửa tay", "school-group-6", "text", 73),
    formField("school", "pestPrevention", "Biện pháp ngăn ngừa côn trùng, động vật gây hại", "school-group-6", "text", 74),
    formField("school", "waterSources", "Nguồn nước sử dụng", "school-group-7", "multi-select", 75, ["Nước máy", "Nước ngầm"]),
    formField("school", "waterTesting", "Kiểm nghiệm nước định kỳ và tần suất", "school-group-7", "text", 76),
    formField("school", "waterTestingDetails", "Chi tiết kiểm nghiệm theo nguồn nước", "school-group-7", "repeatable", 76.1, [], { required: false, repeatableFields: waterTestingFields }),
    formField("school", "ingredientSuppliers", "Các nhà cung cấp nguyên liệu", "school-group-7", "repeatable", 77, [], { repeatableFields: supplierFields }),
    formField("school", "drinkingWater", "Nước uống tại cơ sở giáo dục", "school-group-7", "repeatable", 78, [], {
      required: false,
      repeatableFields: [
        { key: "waterType", label: "Loại nước", answerType: "select", options: ["Nước uống đóng bình, đóng chai", "Nước qua hệ thống xử lý"], required: true },
        { key: "supplierName", label: "Tên nhà cung cấp", answerType: "text" },
        { key: "supplierAddress", label: "Địa chỉ trụ sở nhà cung cấp", answerType: "text" },
        { key: "dispatchAddress", label: "Địa chỉ địa điểm xuất hàng", answerType: "text" },
        { key: "contractNumber", label: "Số hợp đồng", answerType: "text" },
        { key: "contractDate", label: "Ngày ký", answerType: "date" },
        { key: "certificateType", label: "Thông tin giấy chứng nhận", answerType: "text" },
        { key: "testing", label: "Kiểm nghiệm định kỳ", answerType: "text" },
      ],
    }),
    formField("school", "otherContents", "Các nội dung khác", "school-group-8", "text", 79, [], { required: false }),
    formField("school", "confirmation", "Xác nhận nội dung kê khai của cơ sở giáo dục (không ký điện tử)", "school-group-8", "text", 80, [], {
      description: "Người đại diện cơ sở giáo dục chịu trách nhiệm về thông tin đã khai. Không yêu cầu chữ ký điện tử của đơn vị cung cấp; đơn vị được chọn từ danh sách đã đăng ký trên hệ thống.",
    }),
  ],
};

/*
 * Phiên bản biểu mẫu theo hai phiếu khảo sát được cung cấp.
 *
 * Không dùng lại các trường liên kết nội bộ của bản form trước trong phần
 * người dùng kê khai. Những trường này từng được dùng để nối hồ sơ với danh
 * sách đăng ký trong hệ thống, nhưng không phải nội dung của phiếu Word.
 * Việc chọn đơn vị đã đăng ký vẫn được xử lý trong phần Mẫu 02–04 ở renderer.
 */
criteria["meal-provider"] = {
  ...criteria["meal-provider"],
  version: "MP-2026.4",
  effectiveFrom: "2026-09-30",
  groups: groupList("meal-provider", [
    "Thông tin chung",
    "Thông tin chung về giấy chứng nhận và tình hình nhân sự",
    "Điều kiện đảm bảo an toàn thực phẩm",
    "Nguồn gốc nguyên liệu",
    "Danh sách đơn vị nhận suất ăn",
  ]),
  criteria: criteria["meal-provider"].criteria
    .filter((item) => item.key !== "email")
    .map((item) => {
      const groupByKey: Record<string, string> = {
        totalCapacity: "meal-provider-group-1",
        breakfastCapacity: "meal-provider-group-1",
        lunchCapacity: "meal-provider-group-1",
        snackCapacity: "meal-provider-group-1",
        dinnerCapacity: "meal-provider-group-1",
        servingUnitCount: "meal-provider-group-1",
        recipientOverview: "meal-provider-group-1",
        certificates: "meal-provider-group-2",
        totalStaff: "meal-provider-group-2",
        directStaff: "meal-provider-group-2",
        fullTimeStaff: "meal-provider-group-2",
        partTimeStaff: "meal-provider-group-2",
        indirectStaff: "meal-provider-group-2",
        indirectFullTimeStaff: "meal-provider-group-2",
        indirectPartTimeStaff: "meal-provider-group-2",
        trainedStaff: "meal-provider-group-2",
        trainedStaffTotal: "meal-provider-group-2",
        healthCheckedStaff: "meal-provider-group-2",
        healthCheckedStaffTotal: "meal-provider-group-2",
        totalArea: "meal-provider-group-3",
        processingArea: "meal-provider-group-3",
        servingArea: "meal-provider-group-3",
        structure: "meal-provider-group-3",
        environment: "meal-provider-group-3",
        processDescription: "meal-provider-group-3",
        wallsCeiling: "meal-provider-group-3",
        lightingVentilation: "meal-provider-group-3",
        drainage: "meal-provider-group-3",
        wasteArea: "meal-provider-group-3",
        changingRoom: "meal-provider-group-3",
        rawStorageEquipment: "meal-provider-group-3",
        foodStorageEquipment: "meal-provider-group-3",
        sinkEquipment: "meal-provider-group-3",
        rawStorageInventory: "meal-provider-group-3",
        foodStorageInventory: "meal-provider-group-3",
        sinkInventory: "meal-provider-group-3",
        prepTables: "meal-provider-group-3",
        cookingEquipment: "meal-provider-group-3",
        cookingUtensilInventory: "meal-provider-group-3",
        diningEquipment: "meal-provider-group-3",
        sampleEquipment: "meal-provider-group-3",
        pestControl: "meal-provider-group-3",
        wasteEquipment: "meal-provider-group-3",
        cookingStove: "meal-provider-group-3",
        stoveInventory: "meal-provider-group-3",
        transportVehicles: "meal-provider-group-3",
        transportContainers: "meal-provider-group-3",
        rapidTestEquipment: "meal-provider-group-3",
        protectiveClothing: "meal-provider-group-3",
        foodSafetyPractice: "meal-provider-group-3",
        internalControls: "meal-provider-group-3",
        threeStepInspection: "meal-provider-group-3",
        sampleCollection: "meal-provider-group-3",
        sampleStorage: "meal-provider-group-3",
        sampleStorageDetails: "meal-provider-group-3",
        waterSources: "meal-provider-group-4",
        waterTesting: "meal-provider-group-4",
        waterTestingDetails: "meal-provider-group-4",
        ingredientSuppliers: "meal-provider-group-4",
        otherContents: "meal-provider-group-4",
        suppliedUnits: "meal-provider-group-5",
        confirmation: "meal-provider-group-5",
      };
      const labelMap: Record<string, string> = {
        surveyedOrganization: "Tổ chức/cá nhân được khảo sát",
        informationProvider: "Người cung cấp thông tin",
        citizenId: "CCCD số",
        informationProviderPosition: "Chức vụ",
        applicantName: "Tên tổ chức/cá nhân (trụ sở chính)",
        headquartersAddress: "Địa chỉ",
        taxCode:
          "Mã số doanh nghiệp/mã số thuế (hoặc mã định danh hợp pháp khác)",
        taxIssueDate: "Ngày cấp",
        taxIssuePlace: "Nơi cấp",
        taxInitialRegistrationDate: "Lần đầu",
        taxAmendmentDate: "Ngày đăng ký thay đổi",
        taxAmendmentSequence: "Lần thứ",
        legalRepresentative:
          "Người đại diện theo pháp luật/chủ cơ sở (ông/bà)",
        legalRepresentativeTitle: "Chức danh",
        facilityName:
          "Tên cơ sở/địa điểm được khảo sát và cung cấp thông tin (xưởng chế biến/bếp nấu)",
        facilityAddress: "Địa chỉ",
        branchCode: "Mã số chi nhánh/mã số địa điểm kinh doanh",
        branchIssueDate: "Ngày cấp",
        branchIssuePlace: "Nơi cấp",
        branchInitialRegistrationDate: "Lần đầu",
        branchAmendmentDate: "Ngày đăng ký thay đổi",
        branchAmendmentSequence: "Lần thứ",
        facilityRepresentative: "Người đại diện (ông/bà)",
        facilityRepresentativeTitle: "Chức danh",
        foodSafetyContactName: "Ông/bà",
        foodSafetyContactTitle: "Chức vụ",
        foodSafetyContactPhone: "Số điện thoại liên hệ",
        foodSafetyContactEmail: "Email liên hệ",
        totalCapacity: "Công suất (suất/ngày)",
        breakfastCapacity: "Sáng (suất/ngày)",
        lunchCapacity: "Trưa (suất/ngày)",
        snackCapacity: "Xế (suất/ngày)",
        dinnerCapacity: "Tối (suất/ngày)",
        servingUnitCount: "Số lượng đơn vị nhận cung cấp (đơn vị)",
        recipientOverview: "Thống kê đơn vị nhận suất ăn",
        suppliedUnits: "Danh sách chi tiết đơn vị nhận suất ăn",
        certificates:
          "Giấy chứng nhận quản lý chất lượng",
        totalStaff: "Tổng số người làm việc tại địa điểm",
        directStaff: "Số người trực tiếp sơ chế/chế biến/chia suất",
        indirectStaff: "Số người không trực tiếp",
        changingRoom: "Phòng thay bảo hộ và khu vực vệ sinh cho nhân viên",
        rawStorageEquipment:
          "Thiết bị bảo quản nguyên liệu (kho, tủ hoặc thiết bị tương đương)",
        foodStorageEquipment:
          "Thiết bị bảo quản thực phẩm (kho, tủ hoặc thiết bị tương đương)",
        transportVehicles: "Phương tiện vận chuyển suất ăn",
        transportContainers:
          "Dụng cụ chứa đựng, bảo quản suất ăn khi vận chuyển",
        rapidTestEquipment: "Bộ test nhanh sử dụng cho thực phẩm",
        protectiveClothing: "Bảo hộ lao động và tỷ lệ đáp ứng",
        foodSafetyPractice: "Thực hành an toàn thực phẩm tại cơ sở",
        threeStepInspection: "Kiểm thực 03 bước",
        sampleCollection: "Lấy mẫu thức ăn",
        sampleStorage: "Bảo quản mẫu thức ăn",
        ingredientSuppliers: "Danh sách nhà cung cấp nguyên liệu",
        otherContents: "Các nội dung khác",
        confirmation: "Xác nhận của cơ sở",
      };
      return {
        ...item,
        groupId: groupByKey[item.key] ?? "meal-provider-group-1",
        order:
          item.key === "suppliedUnits"
            ? 74
            : item.key === "confirmation"
              ? 75
              : item.order,
        label: labelMap[item.key] ?? item.label,
      };
    }),
};

const schoolGeneralCriteria = [
  formField("school", "surveyDate", "Ngày thực hiện", "school-survey-metadata", "date", 1, [], {
    description: "Ngày thực hiện trong năm 2026.",
  }),
  formField("school", "surveyLocation", "Địa điểm được khảo sát", "school-survey-metadata", "text", 2),
  formField("school", "informationProvider", "Người cung cấp thông tin", "school-survey-metadata", "text", 3),
  formField("school", "citizenId", "CCCD số", "school-survey-metadata", "text", 4),
  formField("school", "informationProviderPosition", "Chức vụ", "school-survey-metadata", "text", 5),
  formField("school", "applicantName", "Tên cơ sở giáo dục", "school-group-1", "text", 6),
  formField("school", "addressMain", "Địa chỉ (điểm chính)", "school-group-1", "text", 7),
  formField("school", "addressBranches", "Địa chỉ (phân hiệu/điểm trường)", "school-group-1", "text", 8, [], { required: false }),
  formField("school", "managementForm", "Hình thức tổ chức quản lý", "school-group-1", "select", 9, ["Công lập", "Ngoài công lập"]),
  formField("school", "educationLevels", "Cấp học", "school-group-1", "multi-select", 10, ["Mầm non", "Tiểu học", "THCS", "THPT", "Khác"]),
  formField("school", "educationLevelOther", "Cấp học khác", "school-group-1", "text", 10.1, [], { required: false }),
  formField("school", "studentTotal", "Tổng số học sinh tại cơ sở giáo dục (học sinh)", "school-group-1", "number", 11),
  formField("school", "boardingStudentTotal", "Số học sinh bán trú (học sinh)", "school-group-1", "number", 12),
  formField("school", "establishmentDecision", "Quyết định thành lập cơ sở giáo dục", "school-group-1", "text", 13),
  formField("school", "principalName", "Hiệu trưởng: ông/bà", "school-group-1", "text", 14),
  formField("school", "principalDecision", "Quyết định công nhận hiệu trưởng", "school-group-1", "text", 15),
  formField("school", "foodSafetyContacts", "Người trực tiếp phụ trách ATTP tại cơ sở giáo dục", "school-group-1", "repeatable", 16, [], {
    description: "Khai báo ít nhất hai người trực tiếp phụ trách an toàn thực phẩm tại cơ sở giáo dục.",
    repeatableFields: [
      { key: "name", label: "Ông/bà", answerType: "text", required: true },
      { key: "title", label: "Chức vụ", answerType: "text", required: true },
      { key: "phone", label: "Số điện thoại liên hệ", answerType: "text", required: true },
      { key: "email", label: "Email liên hệ", answerType: "text", required: true },
    ],
  }),
  formField("school", "operatingModels", "Mô hình, quy mô hoạt động của bếp ăn tại cơ sở", "school-group-1", "repeatable", 17, [], {
    description: "Chọn một trong bốn mô hình; khai báo công suất/ngày, số suất ca sáng, trưa, xế, tối và giá thành. Mẫu số tương ứng sẽ hiện ở cuối biểu mẫu.",
    repeatableFields: [
      {
        key: "model",
        label: "Mô hình hoạt động",
        answerType: "select",
        options: ["BATT tự tổ chức", "BATT hợp đồng", "Nhận suất ăn sẵn", "Căng tin trường học"],
        required: true,
      },
      { key: "siteAddress", label: "Địa điểm/phân hiệu thực hiện", answerType: "text" },
      { key: "capacity", label: "Công suất (suất/ngày)", answerType: "number", required: true },
      { key: "morningCapacity", label: "Số suất ca sáng", answerType: "number" },
      { key: "lunchCapacity", label: "Số suất ca trưa", answerType: "number" },
      { key: "snackCapacity", label: "Số suất ca xế", answerType: "number" },
      { key: "dinnerCapacity", label: "Số suất ca tối", answerType: "number" },
      {
        key: "priceRange",
        label: "Giá thành suất ăn (đvt: đồng/suất)",
        answerType: "select",
        options: [
          "Dưới 25.000 đồng",
          "Từ 25.000 đến 30.000 đồng",
          "Từ 30.000 đến 35.000 đồng",
          "Trên 35.000 đồng",
        ],
        required: true,
      },
    ],
  }),
  formField("school", "mealTransparency", "Hình thức minh bạch, công khai thông tin về bữa ăn bán trú tại cơ sở giáo dục", "school-group-1", "text", 18),
  formField("school", "incidentResponseProcess", "Quy trình phòng ngừa, ứng phó, xử lý sự cố an toàn thực phẩm và ngộ độc thực phẩm tại cơ sở giáo dục", "school-group-1", "text", 19),
  formField("school", "privateOwnerOrganization", "Tên thông tin doanh nghiệp, tổ chức (đơn vị sở hữu, quản lý cơ sở giáo dục)", "school-group-1", "text", 20, [], { required: false, dependsOn: { key: "managementForm", equals: "Ngoài công lập" } }),
  formField("school", "privateOwnerAddress", "Địa chỉ", "school-group-1", "text", 21, [], { required: false, dependsOn: { key: "managementForm", equals: "Ngoài công lập" } }),
  formField("school", "privateOwnerTaxCode", "Mã số doanh nghiệp/mã số thuế (hoặc mã định danh hợp pháp khác)", "school-group-1", "text", 22, [], { required: false, dependsOn: { key: "managementForm", equals: "Ngoài công lập" } }),
  formField("school", "privateOwnerIssueDate", "Ngày cấp", "school-group-1", "date", 22.1, [], { required: false, dependsOn: { key: "managementForm", equals: "Ngoài công lập" } }),
  formField("school", "privateOwnerIssuePlace", "Nơi cấp", "school-group-1", "text", 22.2, [], { required: false, dependsOn: { key: "managementForm", equals: "Ngoài công lập" } }),
  formField("school", "privateOwnerInitialRegistrationDate", "Ngày đăng ký lần đầu", "school-group-1", "date", 22.3, [], { required: false, dependsOn: { key: "managementForm", equals: "Ngoài công lập" } }),
  formField("school", "privateOwnerAmendmentDate", "Ngày đăng ký thay đổi gần nhất", "school-group-1", "date", 22.4, [], { required: false, dependsOn: { key: "managementForm", equals: "Ngoài công lập" } }),
  formField("school", "privateOwnerAmendmentSequence", "Lần thay đổi thứ", "school-group-1", "number", 22.5, [], { required: false, dependsOn: { key: "managementForm", equals: "Ngoài công lập" } }),
  formField("school", "privateOwnerRepresentative", "Người đại diện theo pháp luật/chủ cơ sở: ông/bà", "school-group-1", "text", 23, [], { required: false, dependsOn: { key: "managementForm", equals: "Ngoài công lập" } }),
  formField("school", "privateOwnerRepresentativeTitle", "Chức danh", "school-group-1", "text", 23.1, [], { required: false, dependsOn: { key: "managementForm", equals: "Ngoài công lập" } }),
];

criteria.school = {
  ...criteria.school,
  version: "SC-2026.4",
  effectiveFrom: "2026-10-01",
  groups: [
    { id: "school-survey-metadata", name: "Thông tin khảo sát", order: 0 },
    ...groupList("school", [
      "PHẦN THÔNG TIN CHUNG",
      "Mô hình, quy mô hoạt động của bếp ăn tại cơ sở",
      "Hồ sơ chất lượng, nhân sự và điều kiện cơ sở",
      "Trang thiết bị và vận chuyển",
      "Thực hành an toàn thực phẩm, kiểm thực và lưu mẫu",
      "Khu vực ăn uống",
      "Nguồn nước, nguyên liệu và nước uống",
      "Nội dung khác và xác nhận",
    ]),
  ],
  criteria: [
    ...schoolGeneralCriteria,
    ...criteria.school.criteria.filter(
      (item) =>
        item.groupId !== "school-group-1" &&
        item.groupId !== "school-group-2" &&
        item.key !== "linkedMealProviders" &&
        item.key !== "modelServiceDetails",
    ),
  ],
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
      "Cấp học": "Tiểu học",
      "Số GCN ATTP": "ATTP-HCM-2026-0051",
      "Ngày hết hạn giấy phép": "2027-08-12",
      "Hình thức tổ chức bữa ăn": "Liên kết đơn vị suất ăn",
    },
  },
  {
    id: "regional-013",
    category: "eligible-facilities",
    title: "Công ty Suất ăn Minh Tâm",
    subtitle: "Đơn vị cung cấp suất ăn",
    location: "18 Nguyễn Du, phường Đa Kao, TP. Hồ Chí Minh",
    status: "active",
    publishedAt: "2026-08-05",
    metadata: {
      "Loại hình": "Đơn vị cung cấp suất ăn",
      "Tỉnh / thành phố": "Thành phố Hồ Chí Minh",
      "Trạng thái": "Đang hoạt động",
      "Chủ cơ sở": "Lê Thị Hạnh",
      "Địa chỉ": "18 Nguyễn Du, phường Đa Kao, TP. Hồ Chí Minh",
      "Mã số thuế": "0314567890",
      "Số GCN ATTP": "ATTP-HCM-2026-0068",
      "Ngày hết hạn giấy phép": "2027-06-22",
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
export const isRegistrationCriteriaVisible = (
  item: CriteriaDefinition,
  fields: Record<string, unknown>,
  type: ApplicationType,
) => {
  if (type === "school" && item.key === "educationLevelOther") {
    const levels = fields.educationLevels;
    return Array.isArray(levels) && levels.includes("Khác");
  }
  if (!item.dependsOn) return true;
  const dependency = fields[item.dependsOn.key];
  const current = Array.isArray(dependency)
    ? (dependency[0] ?? "")
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
  if (field.answerType === "yes-no") return field.options?.[0] ?? "Có";
  if (field.answerType === "multi-select")
    return field.options?.slice(0, Math.min(2, field.options.length)) ?? [];
  if (field.answerType === "date")
    return `2026-${String(1 + (index % 9)).padStart(2, "0")}-15`;
  return `${field.label} mẫu ${index + 1}`;
};

type SampleSchoolModelField = {
  key: string;
  label: string;
  answerType: CriteriaAnswerType;
  options?: string[];
  required?: boolean;
  dependsOn?: CriteriaDefinition["dependsOn"];
  repeatableFields?: CriteriaDefinition["repeatableFields"];
};

const sampleSchoolModelForms: Record<
  string,
  { formNumber: string; title: string; providerName?: string }
> = {
  "BATT tự tổ chức": {
    formNumber: "01",
    title: "Bếp ăn tập thể do cơ sở giáo dục tự tổ chức",
  },
  "BATT hợp đồng": {
    formNumber: "02",
    title: "Bếp ăn tập thể hợp đồng",
    providerName: "Công ty Suất ăn Minh Tâm",
  },
  "Nhận suất ăn sẵn": {
    formNumber: "03",
    title: "Cơ sở giáo dục nhận suất ăn sẵn",
    providerName: "Công ty Suất ăn Việt An",
  },
  "Căng tin trường học": {
    formNumber: "04",
    title: "Căng tin trong cơ sở giáo dục",
    providerName: "Căng tin Trường học An Phú",
  },
};

const sampleSchoolContactFields: NonNullable<
  CriteriaDefinition["repeatableFields"]
> = [
  { key: "name", label: "Ông/bà", answerType: "text", required: true },
  { key: "title", label: "Chức vụ", answerType: "text", required: true },
  {
    key: "phone",
    label: "Số điện thoại liên hệ",
    answerType: "text",
    required: true,
  },
  { key: "email", label: "Email liên hệ", answerType: "text" },
];

const sampleSchoolDocumentFields: NonNullable<
  CriteriaDefinition["repeatableFields"]
> = [
  {
    key: "documentType",
    label: "Loại giấy chứng nhận / giấy tờ",
    answerType: "select",
    options: [
      "Giấy chứng nhận cơ sở đủ điều kiện ATTP",
      "ISO 22000:2018",
      "HACCP",
      "Chuỗi ATTP",
      "Giấy tờ pháp lý khác",
    ],
    required: true,
  },
  { key: "number", label: "Số cấp / số giấy tờ", answerType: "text", required: true },
  { key: "issueDate", label: "Ngày cấp", answerType: "date", required: true },
  { key: "expiryDate", label: "Ngày hết hiệu lực", answerType: "date" },
  { key: "issuer", label: "Nơi cấp", answerType: "text", required: true },
  {
    key: "location",
    label: "Địa điểm được cấp chứng nhận",
    answerType: "text",
    required: true,
  },
  {
    key: "scope",
    label: "Phạm vi loại hình được cấp chứng nhận",
    answerType: "text",
    required: true,
  },
  { key: "evidence", label: "Tệp minh chứng", answerType: "file" },
];

const sampleSchoolDeliveryFields: NonNullable<
  CriteriaDefinition["repeatableFields"]
> = [
  { key: "siteName", label: "Địa điểm cơ sở giáo dục", answerType: "text", required: true },
  { key: "morningTime", label: "Ca sáng - thời điểm giao/nhận", answerType: "text" },
  { key: "morningQuantity", label: "Ca sáng - số suất", answerType: "number" },
  { key: "lunchTime", label: "Ca trưa - thời điểm giao/nhận", answerType: "text" },
  { key: "lunchQuantity", label: "Ca trưa - số suất", answerType: "number" },
  { key: "snackTime", label: "Ca xế - thời điểm giao/nhận", answerType: "text" },
  { key: "snackQuantity", label: "Ca xế - số suất", answerType: "number" },
  { key: "afternoonTime", label: "Ca chiều - thời điểm giao/nhận", answerType: "text" },
  { key: "afternoonQuantity", label: "Ca chiều - số suất", answerType: "number" },
];

const sampleSchoolServiceFields = (): SampleSchoolModelField[] => [
  {
    key: "registeredProviderId",
    label: "Đơn vị cung cấp đã đăng ký trên hệ thống",
    answerType: "select",
    required: false,
  },
  { key: "serviceLegalName", label: "Tên tổ chức/cá nhân/đơn vị thực hiện (trụ sở chính)", answerType: "text" },
  { key: "serviceHeadquartersAddress", label: "Địa chỉ trụ sở chính", answerType: "text" },
  { key: "serviceTaxCode", label: "Mã số doanh nghiệp/mã số thuế hoặc mã định danh hợp pháp khác", answerType: "text" },
  { key: "serviceIssueDate", label: "Ngày cấp", answerType: "date" },
  { key: "serviceIssuePlace", label: "Nơi cấp", answerType: "text" },
  { key: "serviceInitialRegistrationDate", label: "Ngày đăng ký lần đầu", answerType: "date" },
  { key: "serviceAmendmentDate", label: "Ngày đăng ký thay đổi gần nhất", answerType: "date" },
  { key: "serviceAmendmentSequence", label: "Lần thay đổi thứ", answerType: "number" },
  { key: "serviceRepresentative", label: "Người đại diện theo pháp luật/chủ cơ sở", answerType: "text" },
  { key: "serviceRepresentativeTitle", label: "Chức danh", answerType: "text" },
  { key: "serviceSiteName", label: "Tên cơ sở/địa điểm thực hiện", answerType: "text" },
  { key: "serviceSiteAddress", label: "Địa chỉ", answerType: "text" },
  { key: "serviceSiteBusinessCode", label: "Mã số chi nhánh/mã số địa điểm kinh doanh", answerType: "text" },
  { key: "serviceSiteIssueDate", label: "Ngày cấp", answerType: "date" },
  { key: "serviceSiteIssuePlace", label: "Nơi cấp", answerType: "text" },
  { key: "serviceSiteInitialRegistrationDate", label: "Ngày đăng ký lần đầu", answerType: "date" },
  { key: "serviceSiteAmendmentDate", label: "Ngày đăng ký thay đổi gần nhất", answerType: "date" },
  { key: "serviceSiteAmendmentSequence", label: "Lần thay đổi thứ", answerType: "number" },
  { key: "serviceSiteRepresentative", label: "Người đại diện", answerType: "text" },
  { key: "serviceSiteRepresentativeTitle", label: "Chức danh", answerType: "text" },
  {
    key: "serviceFoodSafetyContacts",
    label: "Thông tin người phụ trách ATTP của đơn vị thực hiện",
    answerType: "repeatable",
    repeatableFields: sampleSchoolContactFields,
  },
  { key: "serviceContractNumber", label: "Hợp đồng - số hợp đồng", answerType: "text" },
  { key: "serviceContractDate", label: "Hợp đồng - ngày ký", answerType: "date" },
  {
    key: "serviceQualityCertificates",
    label: "Giấy chứng nhận quản lý chất lượng của đơn vị",
    answerType: "repeatable",
    repeatableFields: sampleSchoolDocumentFields,
  },
];

const sampleSchoolSpecificFields = (
  model: string,
): SampleSchoolModelField[] => {
  if (model === "BATT hợp đồng" || model === "Nhận suất ăn sẵn") {
    const fields = sampleSchoolServiceFields();
    fields[0] = {
      ...fields[0],
      label:
        model === "BATT hợp đồng"
          ? "Đơn vị thực hiện nấu ăn đã đăng ký trên hệ thống"
          : "Đơn vị cung cấp suất ăn đã đăng ký trên hệ thống",
    };
    if (model === "Nhận suất ăn sẵn") {
      fields.push(
        {
          key: "readyMealDeliverySites",
          label: "Danh sách địa điểm, thời điểm giao nhận và số lượng suất ăn",
          answerType: "repeatable",
          repeatableFields: sampleSchoolDeliveryFields,
        },
        {
          key: "readyMealReceivingPoint",
          label: "Địa điểm tập kết, giao/nhận suất ăn tại cơ sở giáo dục",
          answerType: "text",
        },
      );
      fields[1].label =
        "Tên tổ chức/cá nhân/đơn vị cung cấp suất ăn (trụ sở chính)";
      fields[11].label = "Tên cơ sở/địa điểm nấu ăn (xưởng chế biến/bếp nấu)";
    }
    return fields;
  }
  if (model !== "Căng tin trường học") return [];
  return [
    {
      key: "registeredProviderId",
      label: "Đơn vị kinh doanh căng tin đã đăng ký trên hệ thống",
      answerType: "select",
      required: false,
    },
    { key: "canteenName", label: "Tên tổ chức/cá nhân/đơn vị kinh doanh căng tin", answerType: "text" },
    { key: "canteenAddress", label: "Địa chỉ", answerType: "text" },
    { key: "canteenIdentifier", label: "Mã số chi nhánh/mã số địa điểm kinh doanh/mã số thuế hoặc mã định danh hợp pháp khác", answerType: "text" },
    { key: "canteenIssueDate", label: "Ngày cấp", answerType: "date" },
    { key: "canteenIssuePlace", label: "Nơi cấp", answerType: "text" },
    { key: "canteenInitialRegistrationDate", label: "Ngày đăng ký lần đầu", answerType: "date" },
    { key: "canteenAmendmentDate", label: "Ngày đăng ký thay đổi gần nhất", answerType: "date" },
    { key: "canteenAmendmentSequence", label: "Lần thay đổi thứ", answerType: "number" },
    { key: "canteenRepresentative", label: "Người đại diện theo pháp luật/chủ cơ sở", answerType: "text" },
    { key: "canteenTitle", label: "Chức danh", answerType: "text" },
    { key: "canteenOtherInfo", label: "Thông tin khác", answerType: "text", required: false },
    {
      key: "canteenFoodSafetyContacts",
      label: "Thông tin người phụ trách ATTP của đơn vị kinh doanh căng tin",
      answerType: "repeatable",
      repeatableFields: sampleSchoolContactFields,
    },
    { key: "canteenContractNumber", label: "Hợp đồng căng tin - số hợp đồng", answerType: "text" },
    { key: "canteenContractDate", label: "Hợp đồng căng tin - ngày ký", answerType: "date" },
    {
      key: "canteenQualityCertificates",
      label: "Giấy chứng nhận/hồ sơ chất lượng của đơn vị kinh doanh căng tin",
      answerType: "repeatable",
      repeatableFields: sampleSchoolDocumentFields,
    },
    { key: "canteenOtherLegalDocuments", label: "Các hồ sơ pháp lý khác", answerType: "text" },
  ];
};

const sampleSchoolModelExcluded: Record<string, Set<string>> = {
  "BATT hợp đồng": new Set(["qualityCertificateStatus", "qualityCertificates"]),
  "Nhận suất ăn sẵn": new Set([
    "qualityCertificateStatus",
    "qualityCertificates",
    "preparationArea",
    "processingArea",
    "separatePreparationRoom",
    "separateProcessingRoom",
    "separateServingRoom",
    "processDescription",
    "rawStorageEquipment",
    "rawStorageInventory",
    "prepTables",
    "cookingEquipment",
    "cookingUtensilInventory",
    "cookingStove",
    "stoveInventory",
    "transportBetweenSchools",
    "transportContainers",
  ]),
  "Căng tin trường học": new Set(["qualityCertificateStatus", "qualityCertificates"]),
};

const sampleSchoolValue = (
  field: SampleSchoolModelField,
  index: number,
  type: ApplicationType,
) => {
  if (field.answerType === "file") return "";
  if (field.answerType === "repeatable") {
    return [
      Object.fromEntries(
        (field.repeatableFields ?? []).map((nestedField) => [
          nestedField.key,
          nestedField.answerType === "file"
            ? ""
            : sampleRepeatableValue(nestedField, index, type),
        ]),
      ),
    ];
  }
  if (field.key === "registeredProviderId") return "";
  if (field.answerType === "number") return String(2 + (index % 8));
  if (field.answerType === "date")
    return `2026-${String(1 + (index % 9)).padStart(2, "0")}-15`;
  if (field.answerType === "yes-no") return field.options?.[0] ?? "Có";
  if (field.answerType === "multi-select")
    return field.options?.slice(0, Math.min(2, field.options.length)) ?? [];
  if (field.answerType === "select")
    return field.options?.[0] ?? "";
  return `${field.label} mẫu ${index + 1}`;
};

const buildSampleSchoolForms = (
  criteriaSet: CriteriaSet,
  data: Record<string, unknown>,
  attachments: Attachment[],
  models: string[],
  index: number,
  applicantName: string,
  address: string,
) => {
  const siteId = `school-site-${index}`;
  const siteName = applicantName;
  const siteAddress = address;
  const locations = [{ id: siteId, name: siteName, address: siteAddress, kind: "main" }];
  data.schoolLocations = locations;
  data.schoolSubmissionConfirmed = "true";
  data.addressMain = address;
  data.addressBranches = [];
  data.foodSafetyContacts = [
    { name: "Nguyễn Thị Hương", title: "Phụ trách ATTP", phone: "0901234567", email: "attp@example.vn" },
    { name: "Trần Minh Anh", title: "Đại diện cơ sở", phone: "0907654321", email: "daihien@example.vn" },
  ];
  const uniqueModels = [...new Set(models)].filter(
    (model) => Boolean(sampleSchoolModelForms[model]),
  );
  const operatingModels = uniqueModels.map((model, rowIndex) => {
    const form = sampleSchoolModelForms[model];
    const id = `school-model-${index}-${form.formNumber}`;
    return {
      id,
      model,
      siteId,
      siteName,
      siteAddress,
      formNumber: form.formNumber,
      formLabel: `Mẫu số ${form.formNumber}`,
      rowIndex,
    };
  });
  data.operatingModels = operatingModels.map(({ rowIndex: _rowIndex, ...row }) => row);
  data.schoolModelDetails = {};
  const forms = operatingModels.map((row) => {
    const formDefinition = sampleSchoolModelForms[row.model];
    const baseFields = criteriaSet.criteria
      .filter(
        (item) =>
          item.groupId !== "school-group-1" &&
          item.groupId !== "school-group-2" &&
          !sampleSchoolModelExcluded[row.model]?.has(item.key),
      )
      .map((item) => ({
        ...item,
        label:
          row.model === "Nhận suất ăn sẵn"
            ? ({
                totalFoodStaff: "Tổng số người tham gia hoạt động có liên quan đến thực phẩm",
                directFoodStaff: "Số người trực tiếp giao/chia suất",
                directFullTimeFoodStaff: "Số lao động trực tiếp toàn thời gian",
                directPartTimeFoodStaff: "Số lao động trực tiếp bán thời gian",
                indirectFoodStaff: "Số người không trực tiếp",
                protectiveClothing: "Bảo hộ lao động cho nhân viên tại nơi nhận suất ăn",
                foodSafetyPractice: "Thực hành an toàn thực phẩm tại cơ sở giáo dục (nơi nhận suất ăn)",
                threeStepInspection: "Kiểm thực 03 bước tại cơ sở giáo dục (nơi nhận suất ăn)",
              } as Record<string, string>)[item.key] ?? item.label
            : row.model === "BATT hợp đồng"
              ? ({
                  totalFoodStaff: "Tổng số người tham gia hoạt động chế biến, nấu ăn tại đơn vị thực hiện",
                  directFoodStaff: "Số người trực tiếp sơ chế/chế biến/chia suất tại đơn vị thực hiện",
                  indirectFoodStaff: "Số người không trực tiếp tại đơn vị thực hiện",
                } as Record<string, string>)[item.key] ?? item.label
              : row.model === "Căng tin trường học" && item.key === "totalFoodStaff"
                ? "Tổng số người tham gia hoạt động có liên quan đến thực phẩm"
                : item.label,
      }));
    const modelFields: SampleSchoolModelField[] = [
      ...baseFields,
      ...sampleSchoolSpecificFields(row.model),
    ];
    const fields = modelFields.map((field) => {
      const scopedKey = `schoolModelDetails.${row.id}.${field.key}`;
      const value =
        field.answerType === "file"
          ? ""
          : field.key in data
            ? data[field.key]
            : sampleSchoolValue(field, index, "school");
      (data.schoolModelDetails as Record<string, unknown>)[scopedKey] = value;
      return {
        key: field.key,
        label: field.label,
        answerType: field.answerType,
        value,
        dependsOn: field.dependsOn,
        files:
          field.answerType === "file"
            ? attachments
                .filter((file) => file.fieldKey === scopedKey)
                .map((file) => file.name)
            : [],
      };
    });
    return {
      id: row.id,
      model: row.model,
      siteId: row.siteId,
      siteName: row.siteName,
      siteAddress: row.siteAddress,
      formNumber: row.formNumber,
      providerId: "",
      providerName: formDefinition.providerName ?? "",
      fields,
    };
  });
  data.schoolModelForms = forms;
};

const createSampleApplication = (
  index: number,
  type: ApplicationType,
  status: ApplicationStatus,
  schoolModels?: string[],
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
    if (!isRegistrationCriteriaVisible(item, data, type)) continue;
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
    const modelChoices = Object.keys(sampleSchoolModelForms);
    const selectedModels =
      schoolModels ??
      [modelChoices[sampleOrdinal % modelChoices.length]];
    data.schoolLevel = ["Mầm non", "Tiểu học", "THCS", "THPT"][index % 4];
    data.hasFoodSafetyLead = "Có";
    data.foodSafetyLeadName = ["Lê Thị Hương", "Võ Minh Châu", "Đặng Quốc Bảo"][index % 3];
    data.foodSafetyLeadTitle = "Cán bộ phụ trách ATTP";
    data.foodSafetyLeadPhone = `098${String(300000 + index * 517).slice(-6)}`;
    data.selfCookStaffTotal = String(6 + (sampleOrdinal % 5));
    data.linkedMealProviders = [
      {
        source: "Nhập trực tiếp",
        providerName:
          sampleFacilityNames["meal-provider"][
            sampleOrdinal % sampleFacilityNames["meal-provider"].length
          ],
        taxCode: `031${String(5000000 + index * 101).slice(-7)}`,
      },
    ];
    data.deliveryReception = "Xe tải bảo ôn, giao nhận từ 06:00 đến 07:00";
    data.kitchenOneWay = "Có";
    data.sampleStorage = "Có";
    data.sampleCabinetCount = String(1 + (index % 2));
    data.hiredKitchenName =
      sampleFacilityNames["meal-provider"][
        (sampleOrdinal + 1) % sampleFacilityNames["meal-provider"].length
      ];
    data.hiredKitchenTaxCode = `031${String(5200000 + index * 103).slice(-7)}`;
    data.hiredKitchenStaffCount = String(8 + (sampleOrdinal % 4));
    buildSampleSchoolForms(
      criteriaSet,
      data,
      attachments,
      selectedModels,
      index,
      applicantName,
      address,
    );
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

const sampleApplications: Application[] = [
  createSampleApplication(7, "food-supplier", "pending"),
  createSampleApplication(8, "food-supplier", "needs-more-info"),
  createSampleApplication(9, "meal-provider", "pending"),
  createSampleApplication(10, "meal-provider", "needs-more-info"),
  createSampleApplication(11, "meal-provider", "warning"),
  createSampleApplication(12, "school", "pending", ["BATT tự tổ chức"]),
  createSampleApplication(13, "school", "needs-more-info", ["BATT hợp đồng"]),
  createSampleApplication(14, "school", "pending", ["Nhận suất ăn sẵn"]),
  createSampleApplication(15, "school", "warning", ["Căng tin trường học"]),
];

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
    applicantName: "Trường THCS ABC",
    address: "40 Nguyễn Thái Học, P. Cầu Ông Lãnh, TP.HCM",
    contact: "028 3822 0003",
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

applications
  .filter((application) => /^app-00[1-6]$/.test(application.id))
  .forEach((application, index) => {
    const generated = createSampleApplication(
      40 + index,
      application.type,
      application.status,
      application.id === "app-002"
        ? [
            "BATT tự tổ chức",
            "BATT hợp đồng",
            "Nhận suất ăn sẵn",
            "Căng tin trường học",
          ]
        : undefined,
    );
    const data = {
      ...generated.data,
      applicantName: application.applicantName,
      address: application.address,
      addressDetail: application.address,
      addressProvince: "TP. Hồ Chí Minh",
      addressWard: "Phường Cầu Ông Lãnh",
      contact: application.contact,
    };
    if (application.type === "school") {
      data.addressMain = application.address;
      data.schoolLocations = (
        data.schoolLocations as Array<Record<string, unknown>>
      ).map((location) => ({
        ...location,
        name: application.applicantName,
        address: application.address,
      }));
      data.operatingModels = (
        data.operatingModels as Array<Record<string, unknown>>
      ).map((model) => ({
        ...model,
        siteName: application.applicantName,
        siteAddress: application.address,
      }));
      data.schoolModelForms = (
        data.schoolModelForms as Array<Record<string, unknown>>
      ).map((form) => ({
        ...form,
        siteName: application.applicantName,
        siteAddress: application.address,
      }));
    }
    application.criteriaVersion = generated.criteriaVersion;
    application.criteriaSnapshot = generated.criteriaSnapshot;
    application.criteriaGroups = generated.criteriaGroups;
    application.data = data;
    application.attachments = generated.attachments;
    application.scoreBreakdown = generated.scoreBreakdown;
    application.published = application.status === "approved";
  });

const storedApplicationsKey = "attp-submitted-applications";
const readStoredApplications = (): Application[] => {
  if (typeof window === "undefined") return [];
  try {
    const parsed = JSON.parse(
      window.localStorage.getItem(storedApplicationsKey) || "[]",
    );
    return Array.isArray(parsed) ? (parsed as Application[]) : [];
  } catch {
    return [];
  }
};

const isSeededApplication = (id: string) =>
  /^app-00[1-6]$/.test(id) ||
  (id.startsWith("sample-app-") &&
    applications.some((application) => application.id === id));

if (typeof window !== "undefined") {
  readStoredApplications().forEach((storedApplication) => {
    const existing = applications.find(
      (application) => application.id === storedApplication.id,
    );
    if (existing && isSeededApplication(existing.id)) {
      existing.status = storedApplication.status;
      existing.reviewNote = storedApplication.reviewNote;
      existing.score = storedApplication.score;
      existing.published = storedApplication.published;
    } else if (existing) {
      Object.assign(existing, storedApplication);
    } else if (!storedApplication.id.startsWith("sample-app-")) {
      applications.unshift(storedApplication);
    }
  });
}

export const saveApplicationRecord = (application: Application) => {
  const storedApplications = readStoredApplications().filter(
    (storedApplication) => storedApplication.id !== application.id,
  );
  storedApplications.unshift(application);
  if (typeof window !== "undefined") {
    window.localStorage.setItem(
      storedApplicationsKey,
      JSON.stringify(storedApplications),
    );
  }
  const existing = applications.find(
    (candidate) => candidate.id === application.id,
  );
  if (existing) Object.assign(existing, application);
  else applications.unshift(application);
};
