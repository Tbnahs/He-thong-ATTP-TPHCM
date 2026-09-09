import type {
  ApplicationType,
  CriteriaConfigInput,
  CriteriaDefinition,
  CriteriaGroup,
  CriteriaHistoryEntry,
  CriteriaSet,
} from "@workspace/api-zod";

type CriteriaStore = Record<ApplicationType, CriteriaSet>;

const criterion = (
  type: ApplicationType,
  key: string,
  label: string,
  groupId: string,
  answerType: CriteriaDefinition["answerType"],
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
  prerequisite: false,
  active: true,
  order: 0,
  sourceMaterials: [],
  ...extra,
});

const groups = (type: ApplicationType, names: string[]): CriteriaGroup[] =>
  names.map((name, index) => ({ id: `${type}-group-${index + 1}`, name, order: index + 1 }));

const defaults: CriteriaStore = {
  "food-supplier": {
    type: "food-supplier",
    version: "FS-2026.1",
    effectiveFrom: "2026-01-01",
    totalScore: 100,
    groups: groups("food-supplier", ["Thông tin pháp nhân", "Hồ sơ pháp lý", "Nguồn gốc sản phẩm", "Cơ sở vật chất", "Quy trình vận hành"]),
    criteria: [
      criterion("food-supplier", "applicantName", "Tên đơn vị", "food-supplier-group-1", "text", 0, [], { order: 1 }),
      criterion("food-supplier", "taxCode", "Mã số thuế", "food-supplier-group-1", "text", 0, [], { order: 2 }),
      criterion("food-supplier", "address", "Địa chỉ đầy đủ", "food-supplier-group-1", "text", 0, [], { order: 3 }),
      criterion("food-supplier", "contact", "Số điện thoại liên hệ", "food-supplier-group-1", "text", 0, [], { order: 4 }),
      criterion("food-supplier", "licenseNumber", "Số giấy phép ATTP", "food-supplier-group-2", "text", 0, [], { order: 5 }),
      criterion("food-supplier", "licenseIssued", "Ngày cấp giấy phép", "food-supplier-group-2", "date", 0, [], { order: 6 }),
      criterion("food-supplier", "licenseExpires", "Ngày hết hạn giấy phép", "food-supplier-group-2", "date", 0, [], { order: 7 }),
      criterion("food-supplier", "businessLicense", "Giấy đăng ký kinh doanh", "food-supplier-group-2", "file", 0, [], { order: 8 }),
      criterion("food-supplier", "productGroups", "Nhóm sản phẩm cung cấp", "food-supplier-group-3", "multi-select", 20, ["Rau củ quả", "Thịt gia súc", "Thủy sản", "Thực phẩm chế biến"], { order: 9 }),
      criterion("food-supplier", "origin", "Vùng trồng / nuôi / khai thác", "food-supplier-group-3", "text", 10, [], { order: 10, required: false }),
      criterion("food-supplier", "qualityCertificate", "Chứng nhận chất lượng", "food-supplier-group-3", "file", 10, [], { order: 11, required: false }),
      criterion("food-supplier", "storageEvidence", "Ảnh khu vực bảo quản / kho chứa", "food-supplier-group-4", "file", 25, [], { order: 12 }),
      criterion("food-supplier", "transportEvidence", "Ảnh phương tiện vận chuyển", "food-supplier-group-4", "file", 10, [], { order: 13, required: false }),
      criterion("food-supplier", "safetyProcess", "Có quy trình kiểm soát an toàn thực phẩm", "food-supplier-group-5", "yes-no", 25, ["Có", "Không"], { order: 14 }),
    ],
  },
  "meal-provider": {
    type: "meal-provider",
    version: "MP-2026.1",
    effectiveFrom: "2026-01-01",
    totalScore: 100,
    groups: groups("meal-provider", ["Thông tin pháp nhân", "Hồ sơ pháp lý", "Nhân lực", "Nguồn nhập", "Năng lực cung ứng", "Minh chứng"]),
    criteria: [
      criterion("meal-provider", "applicantName", "Tên đơn vị", "meal-provider-group-1", "text", 0, [], { order: 1 }),
      criterion("meal-provider", "taxCode", "Mã số thuế", "meal-provider-group-1", "text", 0, [], { order: 2 }),
      criterion("meal-provider", "address", "Địa chỉ đầy đủ", "meal-provider-group-1", "text", 0, [], { order: 3 }),
      criterion("meal-provider", "contact", "Số điện thoại liên hệ", "meal-provider-group-1", "text", 0, [], { order: 4 }),
      criterion("meal-provider", "licenseNumber", "Số giấy phép ATTP", "meal-provider-group-2", "text", 0, [], { order: 5 }),
      criterion("meal-provider", "licenseIssued", "Ngày cấp giấy phép", "meal-provider-group-2", "date", 0, [], { order: 6 }),
      criterion("meal-provider", "licenseExpires", "Ngày hết hạn giấy phép", "meal-provider-group-2", "date", 0, [], { order: 7 }),
      criterion("meal-provider", "legalEvidence", "Giấy tờ pháp lý", "meal-provider-group-2", "file", 0, [], { order: 8 }),
      criterion("meal-provider", "staffTotal", "Tổng số nhân viên chế biến", "meal-provider-group-3", "number", 20, [], { order: 9 }),
      criterion("meal-provider", "staffTrained", "Nhân viên có chứng chỉ tập huấn ATTP", "meal-provider-group-3", "number", 20, [], { order: 10 }),
      criterion("meal-provider", "staffHealth", "Nhân viên có khám sức khỏe còn hiệu lực", "meal-provider-group-3", "number", 20, [], { order: 11 }),
      criterion("meal-provider", "supplierId", "Nhà cung cấp thực phẩm", "meal-provider-group-4", "select", 15, [], { order: 12 }),
      criterion("meal-provider", "dailyCapacity", "Công suất suất ăn mỗi ngày", "meal-provider-group-5", "number", 15, [], { order: 13 }),
      criterion("meal-provider", "evidence", "Ảnh khu chế biến, thiết bị và bảo hộ", "meal-provider-group-6", "file", 10, [], { order: 14 }),
    ],
  },
  school: {
    type: "school",
    version: "SC-2026.1",
    effectiveFrom: "2026-01-01",
    totalScore: 100,
    groups: groups("school", ["Thông tin cơ bản", "Hồ sơ pháp lý", "Trách nhiệm ATTP", "Tổ chức bữa ăn", "Cơ sở vật chất", "Minh chứng"]),
    criteria: [
      criterion("school", "applicantName", "Tên trường", "school-group-1", "text", 0, [], { order: 1 }),
      criterion("school", "schoolLevel", "Cấp học", "school-group-1", "select", 0, ["Mầm non", "Tiểu học", "THCS", "THPT"], { order: 2 }),
      criterion("school", "address", "Địa chỉ", "school-group-1", "text", 0, [], { order: 3 }),
      criterion("school", "contact", "Số điện thoại liên hệ", "school-group-1", "text", 0, [], { order: 4 }),
      criterion("school", "schoolDecision", "Quyết định thành lập / giấy tờ pháp lý", "school-group-2", "file", 0, [], { order: 5 }),
      criterion("school", "hasFoodSafetyLead", "Có cán bộ phụ trách ATTP", "school-group-3", "yes-no", 15, ["Có", "Không"], { order: 6 }),
      criterion("school", "mealModel", "Hình thức tổ chức bữa ăn", "school-group-4", "select", 20, ["Tự nấu", "Liên kết đơn vị suất ăn", "Thuê đơn vị nấu tại bếp trường"], { order: 7 }),
      criterion("school", "kitchenOneWay", "Bếp ăn theo nguyên tắc một chiều", "school-group-5", "yes-no", 25, ["Có", "Không"], { order: 8 }),
      criterion("school", "sampleStorage", "Có khu lưu mẫu thức ăn", "school-group-5", "yes-no", 25, ["Có", "Không"], { order: 9 }),
      criterion("school", "kitchenEvidence", "Ảnh bếp ăn / căn tin và khu lưu mẫu", "school-group-6", "file", 15, [], { order: 10 }),
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
  const groupIds = new Set(input.groups.map((group) => group.id));
  if (input.groups.length === 0 || input.groups.some((group) => !group.name.trim())) {
    throw new Error("Mỗi bộ tiêu chí phải có ít nhất một nhóm và tên nhóm không được để trống.");
  }
  if (new Set(input.groups.map((group) => group.id)).size !== input.groups.length) {
    throw new Error("Mã nhóm tiêu chí phải là duy nhất.");
  }
  if (input.criteria.some((item) => !groupIds.has(item.groupId))) {
    throw new Error("Mỗi tiêu chí phải thuộc một nhóm đã tồn tại.");
  }
  const score = input.criteria
    .filter((item) => item.active)
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
    groups: input.groups.map((group, index) => ({ ...group, order: group.order || index + 1 })),
    criteria: input.criteria.map((item, index) => ({ ...item, prerequisite: false, order: item.order || index + 1 })),
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