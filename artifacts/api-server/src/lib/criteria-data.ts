import type {
  ApplicationType,
  CriteriaConfigInput,
  CriteriaDefinition,
  CriteriaHistoryEntry,
  CriteriaSet,
} from "@workspace/api-zod";

type CriteriaStore = Record<ApplicationType, CriteriaSet>;

const criterion = (
  type: ApplicationType,
  key: string,
  label: string,
  group: string,
  answerType: CriteriaDefinition["answerType"],
  maxScore: number,
  options: string[] = [],
  extra: Partial<CriteriaDefinition> = {},
): CriteriaDefinition => ({
  id: `${type}-${key}`,
  key,
  label,
  description: "",
  group,
  answerType,
  options,
  maxScore,
  required: true,
  prerequisite: false,
  active: true,
  order: 0,
  ...extra,
});

const defaults: CriteriaStore = {
  "food-supplier": {
    type: "food-supplier",
    version: "FS-2026.1",
    effectiveFrom: "2026-01-01",
    totalScore: 100,
    criteria: [
      criterion("food-supplier", "applicantName", "Tên đơn vị", "Thông tin pháp nhân", "text", 0, [], { order: 1 }),
      criterion("food-supplier", "taxCode", "Mã số thuế", "Thông tin pháp nhân", "text", 0, [], { order: 2 }),
      criterion("food-supplier", "address", "Địa chỉ đầy đủ", "Thông tin pháp nhân", "text", 0, [], { order: 3 }),
      criterion("food-supplier", "contact", "Số điện thoại liên hệ", "Thông tin pháp nhân", "text", 0, [], { order: 4 }),
      criterion("food-supplier", "licenseNumber", "Số giấy phép ATTP", "Hồ sơ pháp lý", "text", 0, [], { order: 5, prerequisite: true }),
      criterion("food-supplier", "licenseIssued", "Ngày cấp giấy phép", "Hồ sơ pháp lý", "date", 0, [], { order: 6, prerequisite: true }),
      criterion("food-supplier", "licenseExpires", "Ngày hết hạn giấy phép", "Hồ sơ pháp lý", "date", 0, [], { order: 7, prerequisite: true }),
      criterion("food-supplier", "businessLicense", "Giấy đăng ký kinh doanh", "Hồ sơ pháp lý", "file", 0, [], { order: 8, prerequisite: true }),
      criterion("food-supplier", "productGroups", "Nhóm sản phẩm cung cấp", "Nguồn gốc sản phẩm", "select", 20, ["Rau củ quả", "Thịt gia súc", "Thủy sản", "Thực phẩm chế biến"], { order: 9 }),
      criterion("food-supplier", "origin", "Vùng trồng / nuôi / khai thác", "Nguồn gốc sản phẩm", "text", 10, [], { order: 10, required: false }),
      criterion("food-supplier", "qualityCertificate", "Chứng nhận chất lượng", "Nguồn gốc sản phẩm", "file", 10, [], { order: 11, required: false }),
      criterion("food-supplier", "storageEvidence", "Ảnh khu vực bảo quản / kho chứa", "Cơ sở vật chất", "file", 25, [], { order: 12 }),
      criterion("food-supplier", "transportEvidence", "Ảnh phương tiện vận chuyển", "Cơ sở vật chất", "file", 10, [], { order: 13, required: false }),
      criterion("food-supplier", "safetyProcess", "Có quy trình kiểm soát an toàn thực phẩm", "Quy trình vận hành", "yes-no", 25, ["Có", "Không"], { order: 14 }),
    ],
  },
  "meal-provider": {
    type: "meal-provider",
    version: "MP-2026.1",
    effectiveFrom: "2026-01-01",
    totalScore: 100,
    criteria: [
      criterion("meal-provider", "applicantName", "Tên đơn vị", "Thông tin pháp nhân", "text", 0, [], { order: 1 }),
      criterion("meal-provider", "taxCode", "Mã số thuế", "Thông tin pháp nhân", "text", 0, [], { order: 2 }),
      criterion("meal-provider", "address", "Địa chỉ đầy đủ", "Thông tin pháp nhân", "text", 0, [], { order: 3 }),
      criterion("meal-provider", "contact", "Số điện thoại liên hệ", "Thông tin pháp nhân", "text", 0, [], { order: 4 }),
      criterion("meal-provider", "licenseNumber", "Số giấy phép ATTP", "Hồ sơ pháp lý", "text", 0, [], { order: 5, prerequisite: true }),
      criterion("meal-provider", "licenseIssued", "Ngày cấp giấy phép", "Hồ sơ pháp lý", "date", 0, [], { order: 6, prerequisite: true }),
      criterion("meal-provider", "licenseExpires", "Ngày hết hạn giấy phép", "Hồ sơ pháp lý", "date", 0, [], { order: 7, prerequisite: true }),
      criterion("meal-provider", "legalEvidence", "Giấy tờ pháp lý", "Hồ sơ pháp lý", "file", 0, [], { order: 8, prerequisite: true }),
      criterion("meal-provider", "staffTotal", "Tổng số nhân viên chế biến", "Nhân lực", "number", 20, [], { order: 9 }),
      criterion("meal-provider", "staffTrained", "Nhân viên có chứng chỉ tập huấn ATTP", "Nhân lực", "number", 20, [], { order: 10 }),
      criterion("meal-provider", "staffHealth", "Nhân viên có khám sức khỏe còn hiệu lực", "Nhân lực", "number", 20, [], { order: 11 }),
      criterion("meal-provider", "supplierId", "Nhà cung cấp thực phẩm", "Nguồn nhập", "select", 15, [], { order: 12 }),
      criterion("meal-provider", "dailyCapacity", "Công suất suất ăn mỗi ngày", "Năng lực cung ứng", "number", 15, [], { order: 13 }),
      criterion("meal-provider", "evidence", "Ảnh khu chế biến, thiết bị và bảo hộ", "Minh chứng", "file", 10, [], { order: 14 }),
    ],
  },
  school: {
    type: "school",
    version: "SC-2026.1",
    effectiveFrom: "2026-01-01",
    totalScore: 100,
    criteria: [
      criterion("school", "applicantName", "Tên trường", "Thông tin cơ bản", "text", 0, [], { order: 1 }),
      criterion("school", "schoolLevel", "Cấp học", "Thông tin cơ bản", "select", 0, ["Mầm non", "Tiểu học", "THCS", "THPT"], { order: 2 }),
      criterion("school", "address", "Địa chỉ", "Thông tin cơ bản", "text", 0, [], { order: 3 }),
      criterion("school", "contact", "Số điện thoại liên hệ", "Thông tin cơ bản", "text", 0, [], { order: 4 }),
      criterion("school", "schoolDecision", "Quyết định thành lập / giấy tờ pháp lý", "Hồ sơ pháp lý", "file", 0, [], { order: 5, prerequisite: true }),
      criterion("school", "hasFoodSafetyLead", "Có cán bộ phụ trách ATTP", "Trách nhiệm ATTP", "yes-no", 15, ["Có", "Không"], { order: 6 }),
      criterion("school", "mealModel", "Hình thức tổ chức bữa ăn", "Tổ chức bữa ăn", "select", 20, ["Tự nấu", "Liên kết đơn vị suất ăn", "Thuê đơn vị nấu tại bếp trường"], { order: 7 }),
      criterion("school", "kitchenOneWay", "Bếp ăn theo nguyên tắc một chiều", "Cơ sở vật chất", "yes-no", 25, ["Có", "Không"], { order: 8 }),
      criterion("school", "sampleStorage", "Có khu lưu mẫu thức ăn", "Cơ sở vật chất", "yes-no", 25, ["Có", "Không"], { order: 9 }),
      criterion("school", "kitchenEvidence", "Ảnh bếp ăn / căn tin và khu lưu mẫu", "Minh chứng", "file", 15, [], { order: 10 }),
    ],
  },
};

const history: Record<ApplicationType, CriteriaHistoryEntry[]> = {
  "food-supplier": [],
  "meal-provider": [],
  school: [],
};

export function getCriteria(type: ApplicationType, version?: string): CriteriaSet {
  const current = defaults[type];
  if (version && version !== current.version) {
    return current;
  }
  return structuredClone(current);
}

export function listCriteriaHistory(type: ApplicationType) {
  return structuredClone(history[type]);
}

export function updateCriteria(
  type: ApplicationType,
  input: CriteriaConfigInput,
  changedBy = "canbo.demo",
): CriteriaSet {
  const score = input.criteria
    .filter((item) => !item.prerequisite && item.active)
    .reduce((sum, item) => sum + item.maxScore, 0);
  if (score !== 100) {
    throw new Error(`Tổng điểm tiêu chí thường phải bằng 100 (hiện tại ${score}).`);
  }
  const previous = defaults[type];
  const versionNumber = Number(previous.version.split(".").at(-1) ?? "1") + 1;
  const next: CriteriaSet = {
    type,
    version: `${type === "food-supplier" ? "FS" : type === "meal-provider" ? "MP" : "SC"}-2026.${versionNumber}`,
    effectiveFrom: input.effectiveFrom,
    totalScore: score,
    criteria: input.criteria.map((item, index) => ({ ...item, order: item.order || index + 1 })),
  };
  defaults[type] = next;
  history[type].unshift({
    id: `criteria-history-${Date.now()}`,
    type,
    version: next.version,
    changedAt: new Date().toISOString(),
    changedBy,
    changeType: input.applyMode === "now" ? "update" : "scheduled",
    summary: `Cập nhật ${next.criteria.filter((item) => item.active).length} tiêu chí, áp dụng ${input.applyMode === "now" ? "ngay" : `từ ${input.effectiveFrom}`}.`,
    oldValue: { version: previous.version, criteria: previous.criteria },
    newValue: { version: next.version, criteria: next.criteria },
  });
  return structuredClone(next);
}

export function getAllCriteria() {
  return (Object.keys(defaults) as ApplicationType[]).map((type) => getCriteria(type));
}