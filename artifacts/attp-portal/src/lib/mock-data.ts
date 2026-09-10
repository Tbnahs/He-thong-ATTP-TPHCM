export type ApplicationType = 'food-supplier' | 'meal-provider' | 'school';
export type CriteriaAnswerType = 'text' | 'number' | 'date' | 'yes-no' | 'select' | 'multi-select' | 'file';
export type ListPublicRecordsCategory = 'eligible-facilities' | 'self-declared-products' | 'registered-products' | 'licensed-advertising' | 'testing-facilities';
export type ApplicationStatus = 'pending' | 'needs-more-info' | 'approved' | 'warning' | 'stopped' | 'rejected';
export type ReviewAction = 'approve' | 'needs-more-info' | 'reject';

export interface Attachment { name: string; kind: string; size: number; fieldKey?: string }
export interface CriteriaSource { id: string; name: string; kind: string; size: number }
export interface CriteriaGroup { id: string; name: string; order: number }
export interface CriteriaDefinition {
  id: string; key: string; label: string; description: string; groupId: string;
  answerType: CriteriaAnswerType; options: string[];
  maxScore: number; required: boolean; active: boolean; order: number;
  sourceMaterials: CriteriaSource[];
}
export interface CriteriaSet { type: ApplicationType; version: string; effectiveFrom: string; totalScore: number; groups: CriteriaGroup[]; criteria: CriteriaDefinition[] }
export interface CriteriaHistoryEntry { id: string; type: ApplicationType; version: string; changedAt: string; changedBy: string; summary: string }
export interface PublicRecord { id: string; category: ListPublicRecordsCategory; title: string; subtitle: string; location: string; status: string; publishedAt: string; metadata: Record<string, string | number> }
export interface SupplierOption { id: string; name: string; taxCode: string }
export interface Application {
  id: string; reference: string; type: ApplicationType; applicantName: string; address: string; contact: string;
  submittedAt: string; status: ApplicationStatus; score: number; reviewNote: string | null; isThirdParty: boolean;
  data: Record<string, unknown>; attachments: Attachment[]; criteriaVersion: string; criteriaSnapshot: CriteriaDefinition[];
  criteriaGroups: CriteriaGroup[]; scoreBreakdown: Record<string, number>;
}
export interface ListApplicationsParams { status?: ApplicationStatus; search?: string }
export interface CriteriaConfigInput { applyMode: 'now' | 'scheduled' }

const source = (id: string, name: string): CriteriaSource => ({ id, name, kind: 'text/plain', size: 0 });
const criterion = (type: ApplicationType, key: string, label: string, groupId: string, answerType: CriteriaAnswerType, maxScore: number, options: string[] = [], extra: Partial<CriteriaDefinition> = {}): CriteriaDefinition => ({
  id: `${type}-${key}`, key, label, description: '', groupId, answerType, options,
  maxScore, required: true, active: true, order: 0, sourceMaterials: [], ...extra,
});
const groupList = (type: ApplicationType, names: string[]) => names.map((name, index) => ({ id: `${type}-group-${index + 1}`, name, order: index + 1 }));

const criteria: Record<ApplicationType, CriteriaSet> = {
  'food-supplier': {
    type: 'food-supplier', version: 'FS-2026.1', effectiveFrom: '2026-01-01', totalScore: 100,
    groups: groupList('food-supplier', ['Thông tin pháp nhân', 'Hồ sơ pháp lý', 'Nguồn gốc sản phẩm', 'Cơ sở vật chất', 'Quy trình vận hành']),
    criteria: [
      criterion('food-supplier', 'applicantName', 'Tên đơn vị', 'food-supplier-group-1', 'text', 0, [], { order: 1 }),
      criterion('food-supplier', 'taxCode', 'Mã số thuế', 'food-supplier-group-1', 'text', 0, [], { order: 2 }),
      criterion('food-supplier', 'address', 'Địa chỉ đầy đủ', 'food-supplier-group-1', 'text', 0, [], { order: 3 }),
      criterion('food-supplier', 'contact', 'Số điện thoại liên hệ', 'food-supplier-group-1', 'text', 0, [], { order: 4 }),
      criterion('food-supplier', 'licenseNumber', 'Số giấy phép ATTP', 'food-supplier-group-2', 'text', 0, [], { order: 5 }),
      criterion('food-supplier', 'licenseIssued', 'Ngày cấp giấy phép', 'food-supplier-group-2', 'date', 0, [], { order: 6 }),
      criterion('food-supplier', 'licenseExpires', 'Ngày hết hạn giấy phép', 'food-supplier-group-2', 'date', 0, [], { order: 7 }),
      criterion('food-supplier', 'businessLicense', 'Giấy đăng ký kinh doanh', 'food-supplier-group-2', 'file', 0, [], { order: 8 }),
      criterion('food-supplier', 'productGroups', 'Nhóm sản phẩm cung cấp', 'food-supplier-group-3', 'multi-select', 20, ['Rau củ quả', 'Thịt gia súc', 'Thủy sản', 'Thực phẩm chế biến'], { order: 9 }),
      criterion('food-supplier', 'origin', 'Vùng trồng / nuôi / khai thác', 'food-supplier-group-3', 'text', 10, [], { order: 10, required: false }),
      criterion('food-supplier', 'qualityCertificate', 'Chứng nhận chất lượng', 'food-supplier-group-3', 'file', 10, [], { order: 11, required: false }),
      criterion('food-supplier', 'storageEvidence', 'Ảnh khu vực bảo quản / kho chứa', 'food-supplier-group-4', 'file', 25, [], { order: 12 }),
      criterion('food-supplier', 'transportEvidence', 'Ảnh phương tiện vận chuyển', 'food-supplier-group-4', 'file', 10, [], { order: 13, required: false }),
      criterion('food-supplier', 'safetyProcess', 'Có quy trình kiểm soát an toàn thực phẩm', 'food-supplier-group-5', 'yes-no', 25, ['Có', 'Không'], { order: 14 }),
    ],
  },
  'meal-provider': {
    type: 'meal-provider', version: 'MP-2026.1', effectiveFrom: '2026-01-01', totalScore: 100,
    groups: groupList('meal-provider', ['Thông tin pháp nhân', 'Hồ sơ pháp lý', 'Nhân lực', 'Nguồn nhập', 'Năng lực cung ứng', 'Minh chứng']),
    criteria: [
      criterion('meal-provider', 'applicantName', 'Tên đơn vị', 'meal-provider-group-1', 'text', 0, [], { order: 1 }),
      criterion('meal-provider', 'taxCode', 'Mã số thuế', 'meal-provider-group-1', 'text', 0, [], { order: 2 }),
      criterion('meal-provider', 'address', 'Địa chỉ đầy đủ', 'meal-provider-group-1', 'text', 0, [], { order: 3 }),
      criterion('meal-provider', 'contact', 'Số điện thoại liên hệ', 'meal-provider-group-1', 'text', 0, [], { order: 4 }),
      criterion('meal-provider', 'licenseNumber', 'Số giấy phép ATTP', 'meal-provider-group-2', 'text', 0, [], { order: 5 }),
      criterion('meal-provider', 'licenseIssued', 'Ngày cấp giấy phép', 'meal-provider-group-2', 'date', 0, [], { order: 6 }),
      criterion('meal-provider', 'licenseExpires', 'Ngày hết hạn giấy phép', 'meal-provider-group-2', 'date', 0, [], { order: 7 }),
      criterion('meal-provider', 'legalEvidence', 'Giấy tờ pháp lý', 'meal-provider-group-2', 'file', 0, [], { order: 8 }),
      criterion('meal-provider', 'staffTotal', 'Tổng số nhân viên chế biến', 'meal-provider-group-3', 'number', 20, [], { order: 9 }),
      criterion('meal-provider', 'staffTrained', 'Nhân viên có chứng chỉ tập huấn ATTP', 'meal-provider-group-3', 'number', 20, [], { order: 10 }),
      criterion('meal-provider', 'staffHealth', 'Nhân viên có khám sức khỏe còn hiệu lực', 'meal-provider-group-3', 'number', 20, [], { order: 11 }),
      criterion('meal-provider', 'supplierId', 'Nhà cung cấp thực phẩm', 'meal-provider-group-4', 'select', 15, [], { order: 12 }),
      criterion('meal-provider', 'dailyCapacity', 'Công suất suất ăn mỗi ngày', 'meal-provider-group-5', 'number', 15, [], { order: 13 }),
      criterion('meal-provider', 'evidence', 'Ảnh khu chế biến, thiết bị và bảo hộ', 'meal-provider-group-6', 'file', 10, [], { order: 14 }),
    ],
  },
  school: {
    type: 'school', version: 'SC-2026.1', effectiveFrom: '2026-01-01', totalScore: 100,
    groups: groupList('school', ['Thông tin cơ bản', 'Hồ sơ pháp lý', 'Trách nhiệm ATTP', 'Tổ chức bữa ăn', 'Cơ sở vật chất', 'Minh chứng']),
    criteria: [
      criterion('school', 'applicantName', 'Tên trường', 'school-group-1', 'text', 0, [], { order: 1 }),
      criterion('school', 'schoolLevel', 'Cấp học', 'school-group-1', 'select', 0, ['Mầm non', 'Tiểu học', 'THCS', 'THPT'], { order: 2 }),
      criterion('school', 'address', 'Địa chỉ', 'school-group-1', 'text', 0, [], { order: 3 }),
      criterion('school', 'contact', 'Số điện thoại liên hệ', 'school-group-1', 'text', 0, [], { order: 4 }),
      criterion('school', 'schoolDecision', 'Quyết định thành lập / giấy tờ pháp lý', 'school-group-2', 'file', 0, [], { order: 5 }),
      criterion('school', 'hasFoodSafetyLead', 'Có cán bộ phụ trách ATTP', 'school-group-3', 'yes-no', 15, ['Có', 'Không'], { order: 6 }),
      criterion('school', 'mealModel', 'Hình thức tổ chức bữa ăn', 'school-group-4', 'select', 20, ['Tự nấu', 'Liên kết đơn vị suất ăn', 'Thuê đơn vị nấu tại bếp trường'], { order: 7 }),
      criterion('school', 'kitchenOneWay', 'Bếp ăn theo nguyên tắc một chiều', 'school-group-5', 'yes-no', 25, ['Có', 'Không'], { order: 8 }),
      criterion('school', 'sampleStorage', 'Có khu lưu mẫu thức ăn', 'school-group-5', 'yes-no', 25, ['Có', 'Không'], { order: 9 }),
      criterion('school', 'kitchenEvidence', 'Ảnh bếp ăn / căn tin và khu lưu mẫu', 'school-group-6', 'file', 15, [], { order: 10 }),
    ],
  },
};

export const publicRecords: PublicRecord[] = [
  { id: 'record-001', category: 'eligible-facilities', title: 'Công ty TNHH Nông sản An Phú', subtitle: 'Cơ sở đủ điều kiện an toàn thực phẩm', location: 'Quận 7, TP.HCM', status: 'active', publishedAt: '2026-08-14', metadata: { 'Mã số thuế': '0312345678', 'Số giấy phép': 'ATTP-2026-088', 'Nhóm sản phẩm': 'Rau củ quả, thịt gia súc' } },
  { id: 'record-002', category: 'eligible-facilities', title: 'Bếp ăn tập thể Trường Tiểu học Nguyễn Bỉnh Khiêm', subtitle: 'Cơ sở giáo dục có bếp ăn đủ điều kiện', location: 'Quận 1, TP.HCM', status: 'active', publishedAt: '2026-07-28', metadata: { 'Loại hình': 'Cơ sở giáo dục', 'Ngày kiểm tra': '28/07/2026', 'Kết quả': 'Đạt' } },
  { id: 'record-003', category: 'self-declared-products', title: 'Nước ép trái cây Green Farm', subtitle: 'Sản phẩm tự công bố', location: 'TP. Thủ Đức, TP.HCM', status: 'active', publishedAt: '2026-06-19', metadata: { 'Đơn vị công bố': 'Green Farm Việt Nam', 'Số tiếp nhận': 'TCCB-2026-031' } },
  { id: 'record-004', category: 'registered-products', title: 'Sữa hạt dinh dưỡng Oat & Seed', subtitle: 'Sản phẩm đã đăng ký bản công bố', location: 'Quận Bình Thạnh, TP.HCM', status: 'active', publishedAt: '2026-05-22', metadata: { 'Số bản công bố': 'CB-2026-114', 'Nhóm sản phẩm': 'Thực phẩm dinh dưỡng' } },
  { id: 'record-005', category: 'testing-facilities', title: 'Trung tâm Kiểm nghiệm Nam Sài Gòn', subtitle: 'Cơ sở kiểm nghiệm được công nhận', location: 'Quận 4, TP.HCM', status: 'active', publishedAt: '2026-04-08', metadata: { 'Phạm vi': 'Thực phẩm và nước uống', 'Mã công nhận': 'VILAS 1420' } },
];

export const suppliers: SupplierOption[] = [
  { id: 'supplier-001', name: 'Công ty TNHH Nông sản An Phú', taxCode: '0312345678' },
  { id: 'supplier-002', name: 'Hợp tác xã Rau sạch Củ Chi', taxCode: '0319876543' },
];

export const criteriaHistory: Record<ApplicationType, CriteriaHistoryEntry[]> = { 'food-supplier': [], 'meal-provider': [], school: [] };
export const getCriteriaSet = (type: ApplicationType): CriteriaSet => structuredClone(criteria[type]);
export const getPublicRecords = (search = '', category = '') => publicRecords.filter(item => (!category || item.category === category) && (!search || `${item.title} ${item.subtitle} ${item.location}`.toLowerCase().includes(search.toLowerCase())));

const applicationCriteria = getCriteriaSet('food-supplier');
export const applications: Application[] = [
  {
    id: 'app-001', reference: 'HS-2026-0042', type: 'food-supplier', applicantName: 'Công ty TNHH Nông sản An Phú',
    address: '184 Nguyễn Văn Linh, Quận 7, TP.HCM', contact: '0908 123 456', submittedAt: '2026-08-18T08:30:00+07:00',
    status: 'pending', score: 78, reviewNote: null, isThirdParty: false, criteriaVersion: applicationCriteria.version,
    criteriaSnapshot: applicationCriteria.criteria, criteriaGroups: applicationCriteria.groups,
    data: { applicantName: 'Công ty TNHH Nông sản An Phú', taxCode: '0312345678', address: '184 Nguyễn Văn Linh, Quận 7, TP.HCM', contact: '0908 123 456', licenseNumber: 'ATTP-2026-088', productGroups: ['Rau củ quả', 'Thịt gia súc'], origin: 'Hợp tác xã rau sạch Củ Chi', safetyProcess: 'Có' },
    attachments: [{ name: 'giay-phep-attp.pdf', kind: 'application/pdf', size: 420000, fieldKey: 'businessLicense' }, { name: 'kho-bao-quan-01.jpg', kind: 'image/jpeg', size: 1800000, fieldKey: 'storageEvidence' }],
    scoreBreakdown: { productGroups: 16, origin: 8, storageEvidence: 20, safetyProcess: 25 },
  },
  {
    id: 'app-002', reference: 'HS-2026-0037', type: 'school', applicantName: 'Trường Mầm non Hoa Sen',
    address: '35 Nguyễn Du, Quận 1, TP.HCM', contact: '028 3822 4567', submittedAt: '2026-08-12T14:10:00+07:00',
    status: 'needs-more-info', score: 82, reviewNote: 'Cần bổ sung ảnh khu lưu mẫu thức ăn.', isThirdParty: true,
    criteriaVersion: 'SC-2026.1', criteriaSnapshot: getCriteriaSet('school').criteria, criteriaGroups: getCriteriaSet('school').groups,
    data: { applicantName: 'Trường Mầm non Hoa Sen', schoolLevel: 'Mầm non', address: '35 Nguyễn Du, Quận 1, TP.HCM', contact: '028 3822 4567', hasFoodSafetyLead: 'Có', mealModel: 'Liên kết đơn vị suất ăn', kitchenOneWay: 'Có', sampleStorage: 'Có' },
    attachments: [{ name: 'quyet-dinh-thanh-lap.pdf', kind: 'application/pdf', size: 510000, fieldKey: 'schoolDecision' }], scoreBreakdown: { hasFoodSafetyLead: 15, mealModel: 18, kitchenOneWay: 24, sampleStorage: 25 },
  },
];