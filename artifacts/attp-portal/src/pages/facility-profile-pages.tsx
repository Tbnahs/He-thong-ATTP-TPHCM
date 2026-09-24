import { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Building2,
  CheckCircle2,
  Clock3,
  FileCheck2,
  FileImage,
  FileText,
  History,
  Link2,
  MapPin,
  PackageCheck,
  Search,
  ShieldAlert,
  Truck,
  Utensils,
  X,
  Eye,
  ZoomIn,
} from "lucide-react";
import { Link, useParams } from "wouter";
import { AdminShell, EmptyState, MetricCard, SectionHeading } from "@/components/portal-ui";
import { readIncidents, type Incident } from "@/pages/incident-pages";
import { readApprovedFacilities, type ApprovedFacility } from "@/lib/approved-facilities";
import { getCriteriaSet, type ApplicationType, type CriteriaDefinition } from "@/lib/mock-data";
import heroFoodImage from "@assets/1788940094256_5613377993845818882_5613377993845818882_1e47059ddc5db7e9cbacbeb3495b9f36.jpg";

type DeliveryKind = "Thức ăn" | "Nguyên liệu";
type DeliveryFlow = "Nhập hàng" | "Xuất hàng";
type RegistrationValue = string | string[];
type SchoolMealOrganization =
  | "Tự nấu"
  | "Liên kết đơn vị suất ăn"
  | "Thuê đơn vị nấu tại bếp trường";
type ProfileTabId = "info" | "suppliers" | "menus" | "outgoing" | "incidents";

type MealOrderDetail = {
  taxCode: string;
  customerName: string;
  address: string;
  meals: Array<{ name: string; quantity: string }>;
  deliveredAt: string;
  vehicle: string;
  licensePlate: string;
};

type DeliveryRecord = {
  id: string;
  date: string;
  kind: DeliveryKind;
  orderCode: string;
  partner: string;
  destination: string;
  quantity: string;
  status: "Đã nhận" | "Đã giao" | "Có sai lệch";
  sourceSystem: string;
  flow: DeliveryFlow;
  mealOrderDetail?: MealOrderDetail;
};

type RelatedFacility = {
  facilityId: string;
  relationship: string;
  suppliedItems: string[];
  direction: "Cung cấp" | "Xuất hàng";
};

type IngredientReceipt = {
  id: string;
  code: string;
  name: string;
  unit: string;
  supplier: string;
  lot: string;
  quantity: string;
  createdBy: string;
  receivedAt: string;
  expiryDate: string;
  note: string;
  attachmentLabel: string;
  attachmentName: string;
};

type SupplierSource = {
  id: string;
  name: string;
  taxCode: string;
  phone: string;
  ingredientCount: number;
  receipts: IngredientReceipt[];
};

type FacilityProfile = {
  id: string;
  applicationId: string;
  name: string;
  category: string;
  applicationType: ApplicationType;
  mealOrganization?: SchoolMealOrganization;
  address: string;
  contact: string;
  taxCode: string;
  licenseNumber: string;
  approvedAt: string;
  reviewer: string;
  personInCharge: string;
  mealsPerDay: string;
  documents: { name: string; kind: string; previewUrl?: string }[];
  deliveries: DeliveryRecord[];
  supplierSources: SupplierSource[];
  registrationFields: { label: string; value: RegistrationValue }[];
  relatedFacilities: RelatedFacility[];
};

const categoryLabels: Record<ApplicationType, string> = {
  "food-supplier": "Cơ sở cung cấp thực phẩm",
  "meal-provider": "Cơ sở cung cấp suất ăn",
  school: "Cơ sở giáo dục",
};

const schoolLabels: Record<string, string> = {
  "school-001": "Trường Mầm non Hoa Mai",
  "school-002": "Trường Tiểu học Thái Sơn",
  "school-003": "Trường Mầm non Hoa Sen",
};

const schoolAddresses: Record<string, string> = {
  "school-001": "25 Nguyễn Huệ, phường Bến Nghé, TP.HCM",
  "school-002": "18 Nguyễn Du, phường Đa Kao, TP.HCM",
  "school-003": "35 Nguyễn Du, phường Sài Gòn, TP.HCM",
};

const getSchoolMealOrganization = (
  value: unknown,
): SchoolMealOrganization | undefined => {
  if (
    value === "Tự nấu" ||
    value === "Liên kết đơn vị suất ăn" ||
    value === "Thuê đơn vị nấu tại bếp trường"
  ) {
    return value;
  }
  return undefined;
};

const isIngredientSupplierSchool = (value?: SchoolMealOrganization) =>
  value === "Tự nấu" || value === "Thuê đơn vị nấu tại bếp trường";

const mealOrganizationBadgeClass = (value?: SchoolMealOrganization) => {
  if (value === "Tự nấu") return "bg-emerald-100 text-emerald-800";
  if (value === "Liên kết đơn vị suất ăn") return "bg-blue-100 text-blue-800";
  return "bg-amber-100 text-amber-900";
};

const supplierSourceSeeds: Array<Omit<SupplierSource, "receipts">> = [
  {
    id: "source-001",
    name: "Công Ty TNHH VITAFAT",
    taxCode: "3702624117",
    phone: "02743800887",
    ingredientCount: 0,
  },
  {
    id: "source-002",
    name: "Công ty THNN MTV TM - DV Lê Phương Đại Phát",
    taxCode: "3702051184",
    phone: "02747305686",
    ingredientCount: 0,
  },
  {
    id: "source-003",
    name: "Hộ Kinh Doanh B",
    taxCode: "5728592993",
    phone: "01488599494",
    ingredientCount: 1,
  },
  {
    id: "source-004",
    name: "Hộ Kinh Doanh A",
    taxCode: "1234512455",
    phone: "09124857572",
    ingredientCount: 1,
  },
  {
    id: "source-005",
    name: "Cty CPCK nông nghiệp và XD Điện Biên",
    taxCode: "5600100661",
    phone: "0913658980",
    ingredientCount: 98,
  },
  {
    id: "source-006",
    name: "HKD chủ hộ Đinh Xuân Bình",
    taxCode: "011093005692",
    phone: "0348838858",
    ingredientCount: 3,
  },
];

const supplierReceiptSeeds: Record<string, IngredientReceipt[]> = {
  "source-003": [
    {
      id: "receipt-source-003-001",
      code: "NL003",
      name: "Dầu ăn thực vật",
      unit: "lít",
      supplier: "Hộ Kinh Doanh B",
      lot: "B-260923",
      quantity: "60",
      createdBy: "Trần Văn Hùng",
      receivedAt: "22/09/2026",
      expiryDate: "22/09/2027",
      note: "Bao bì nguyên vẹn, kiểm tra đạt.",
      attachmentLabel: "Hóa đơn (1 ảnh)",
      attachmentName: "118.jpg",
    },
  ],
  "source-004": [
    {
      id: "receipt-source-004-001",
      code: "NL004",
      name: "Gạo nếp (loại thường)",
      unit: "kg",
      supplier: "Hộ Kinh Doanh A",
      lot: "3738",
      quantity: "200",
      createdBy: "Nguyễn Thị Ánh",
      receivedAt: "23/09/2026",
      expiryDate: "—",
      note: "Kiểm tra bao bì và cảm quan đạt yêu cầu.",
      attachmentLabel: "Hóa đơn (1 ảnh)",
      attachmentName: "119.jpg",
    },
  ],
  "source-005": [
    {
      id: "receipt-source-005-001",
      code: "NL005",
      name: "Rau củ quả theo mùa",
      unit: "kg",
      supplier: "Cty CPCK nông nghiệp và XD Điện Biên",
      lot: "DB-0923-01",
      quantity: "480",
      createdBy: "Lê Minh Khôi",
      receivedAt: "21/09/2026",
      expiryDate: "28/09/2026",
      note: "Đã đối chiếu phiếu giao nhận.",
      attachmentLabel: "Phiếu giao hàng (2 ảnh)",
      attachmentName: "117-118.jpg",
    },
  ],
  "source-006": [
    {
      id: "receipt-source-006-001",
      code: "NL006",
      name: "Thịt heo sơ chế",
      unit: "kg",
      supplier: "HKD chủ hộ Đinh Xuân Bình",
      lot: "B-230926",
      quantity: "125",
      createdBy: "Phạm Quốc Tuấn",
      receivedAt: "23/09/2026",
      expiryDate: "25/09/2026",
      note: "Bảo quản lạnh sau khi tiếp nhận.",
      attachmentLabel: "Hóa đơn (1 ảnh)",
      attachmentName: "120.jpg",
    },
  ],
};

const buildSupplierSources = (applicationId: string): SupplierSource[] =>
  supplierSourceSeeds.map((supplier) => ({
    ...supplier,
    id: `${applicationId}-${supplier.id}`,
    receipts: (supplierReceiptSeeds[supplier.id] ?? []).map((receipt) => ({
      ...receipt,
      id: `${applicationId}-${receipt.id}`,
    })),
  }));

const displayValue = (value: unknown): string => {
  if (Array.isArray(value)) {
    return value
      .map((item) => (typeof item === "object" && item !== null ? displayValue(item) : String(item)))
      .join(", ");
  }
  if (typeof value === "object" && value !== null) {
    return Object.entries(value)
      .map(([key, entry]) => `${key}: ${displayValue(entry)}`)
      .join(" · ");
  }
  return String(value ?? "Chưa khai báo");
};

const readRows = (value: unknown): Record<string, unknown>[] =>
  Array.isArray(value)
    ? value.filter((item): item is Record<string, unknown> => Boolean(item && typeof item === "object"))
    : [];

const completeCriteria = (application: ApprovedFacility["application"]) => {
  const snapshot = application.criteriaSnapshot ?? [];
  const snapshotKeys = new Set(snapshot.map((item) => item.key));
  return [
    ...snapshot,
    ...getCriteriaSet(application.type).criteria.filter((item) => !snapshotKeys.has(item.key)),
  ]
    .filter((item) => item.active)
    .sort((a, b) => a.order - b.order);
};

const registrationFieldValue = (
  item: CriteriaDefinition,
  fields: Record<string, unknown>,
  attachments: ApprovedFacility["application"]["attachments"],
): string | string[] => {
  if (item.answerType === "file") {
    return attachments
      .filter((file) => file.fieldKey === item.key)
      .map((file) => file.name);
  }
  if (item.answerType === "repeatable") {
    const rows = readRows(fields[item.key]);
    if (!rows.length) return "Chưa khai báo";
    return rows.map((row, rowIndex) =>
      (item.repeatableFields ?? [])
        .map((field) => {
          const rowFiles = attachments
            .filter((file) => file.fieldKey === `${item.key}.${rowIndex}.${field.key}`)
            .map((file) => file.name);
          const rawValue = field.answerType === "file"
            ? rowFiles.length
              ? rowFiles.join(", ")
              : displayValue(row[field.key])
            : displayValue(row[field.key]);
          return `${field.label}: ${rawValue}`;
        })
        .join(" · "),
    );
  }
  return displayValue(fields[item.key]);
};

const buildProfile = (approval: ApprovedFacility, index: number): FacilityProfile => {
  const application = approval.application;
  const fields = application.data;
  const attachments = application.attachments ?? [];
  const type = application.type;
  const category = categoryLabels[type];
  const mealOrganization =
    type === "school"
      ? getSchoolMealOrganization(fields.mealModel)
      : undefined;
  const personInCharge =
    String(fields.foodSafetyManagerName || fields.foodSafetyLeadName || "Chưa khai báo");
  const capacity =
    type === "meal-provider"
      ? `${displayValue(fields.dailyCapacity)} suất/ngày`
      : `${readRows(fields.products).length || 1} nhóm sản phẩm`;
  const products = readRows(fields.products).map((row) => String(row.name || row.category || "Sản phẩm đã khai báo"));
  const supplierRows = readRows(fields.suppliers);
  const suppliedRows = readRows(fields.suppliedUnits);
  const schoolRows = readRows(fields.servingSchools);
  const linkedMealProviderRows = readRows(fields.linkedMealProviders);
  const relatedFacilities: RelatedFacility[] =
    type === "meal-provider"
      ? [
          ...supplierRows.map((row, rowIndex) => ({
            facilityId: `supplier-${application.id}-${rowIndex}`,
            relationship: "Nhà cung cấp thực phẩm",
            suppliedItems: [String(row.name || "Nguyên liệu thực phẩm")],
            direction: "Xuất hàng" as const,
          })),
          ...schoolRows.map((row, rowIndex) => ({
            facilityId: `school-${application.id}-${rowIndex}`,
            relationship: "Trường học đang phục vụ",
            suppliedItems: ["Suất ăn theo hợp đồng"],
            direction: "Cung cấp" as const,
          })),
        ]
      : suppliedRows.map((row, rowIndex) => ({
          facilityId: `unit-${application.id}-${rowIndex}`,
          relationship: String(row.unitType || "Đơn vị tiếp nhận"),
          suppliedItems: products.length ? products : ["Thực phẩm đã khai báo"],
          direction: "Cung cấp" as const,
        }));

  const registrationFields = completeCriteria(application)
    .filter((item) => {
      const condition = item.dependsOn;
      if (!condition) return true;
      const currentValue = String(fields[condition.key] ?? "");
      if (condition.equals !== undefined && currentValue !== condition.equals) {
        return false;
      }
      return condition.notEquals === undefined || currentValue !== condition.notEquals;
    })
    .map((item) => ({
      label: item.label,
      value: registrationFieldValue(item, fields, attachments),
    }));

  const firstRelated =
    type === "meal-provider"
      ? schoolRows[0]?.schoolId
        ? schoolLabels[String(schoolRows[0].schoolId)] || String(schoolRows[0].schoolId)
        : "Trường học đang phục vụ"
      : String(suppliedRows[0]?.name || "Đơn vị tiếp nhận");
  const firstSupplier =
    type === "meal-provider"
      ? String(supplierRows[0]?.name || "Nhà cung cấp thực phẩm")
      : type === "school" && mealOrganization === "Liên kết đơn vị suất ăn"
        ? String(
            linkedMealProviderRows[0]?.providerName ||
              "Đơn vị cung cấp suất ăn",
          )
      : type === "school"
        ? "Nhà cung cấp nguyên liệu đầu vào"
        : "Vùng nguyên liệu đã khai báo";
  const date = approval.approvedAt.split("T")[0].split("-").reverse().join("/");
  const deliveryBase = `Dữ liệu hồ sơ ${application.reference}`;
  const deliveryVehicle = readRows(fields.deliveryVehicles)[0];
  const vehicleName = String(
    deliveryVehicle?.vehicleType || "Xe tải bảo ôn",
  );
  const vehicleOwnership = String(
    deliveryVehicle?.ownershipType || "Chuyên dụng",
  );
  const mealProviderCustomers = schoolRows.length
    ? schoolRows
    : [{ schoolId: "school-001" }];
  const mealDeliveryRecords: DeliveryRecord[] =
    type === "meal-provider"
      ? mealProviderCustomers.map((row, rowIndex) => {
          const schoolId = String(row.schoolId || "");
          const customerName =
            schoolLabels[schoolId] ||
            String(row.name || "Đơn vị nhận suất ăn");
          const totalMeals = `${displayValue(fields.dailyCapacity)} suất`;
          return {
            id: `delivery-${application.id}-out-${rowIndex}`,
            date,
            kind: "Thức ăn",
            orderCode: `${application.reference}-OUT-${String(rowIndex + 1).padStart(2, "0")}`,
            partner: customerName,
            destination:
              schoolAddresses[schoolId] ||
              String(row.address || "Chưa cập nhật"),
            quantity: totalMeals,
            status: "Đã giao",
            sourceSystem: deliveryBase,
            flow: "Xuất hàng",
            mealOrderDetail: {
              taxCode: String(
                row.taxCode ||
                  `031${String(8000000 + rowIndex * 127).slice(-7)}`,
              ),
              customerName,
              address:
                schoolAddresses[schoolId] ||
                String(row.address || "Chưa cập nhật"),
              meals: [
                { name: "Cơm trắng", quantity: totalMeals },
                { name: "Thịt kho trứng", quantity: totalMeals },
                { name: "Canh rau củ", quantity: totalMeals },
              ],
              deliveredAt: `${date} 06:30`,
              vehicle: `${vehicleName} (${vehicleOwnership})`,
              licensePlate: String(
                deliveryVehicle?.licensePlate ||
                  `51D-${String(20000 + rowIndex * 173).padStart(5, "0")}`,
              ),
            },
          };
        })
      : [];
  const schoolSupplierDeliveries: DeliveryRecord[] =
    type === "school"
      ? Array.from(
          { length: application.id.startsWith("sample-app-") ? 4 : 1 },
          (_, rowIndex) => {
            const sampleIndex = Number(application.id.match(/\d+$/)?.[0] || index);
            const ingredientSuppliers = [
              "Hợp tác xã Rau an toàn Hóc Môn",
              "Công ty Thực phẩm sạch Bình Minh",
              "Trang trại Rau hữu cơ Phước Lộc",
              "Cơ sở Thịt sạch Nam Việt",
              "Công ty Nông sản Mekong Xanh",
              "Cơ sở Trứng sạch Thành Công",
            ];
            const isMealDelivery =
              mealOrganization === "Liên kết đơn vị suất ăn";
            return {
              id: `delivery-${application.id}-school-in-${rowIndex + 1}`,
              date,
              kind: isMealDelivery ? "Thức ăn" : "Nguyên liệu",
              orderCode: `${application.reference}-IN-${String(rowIndex + 1).padStart(2, "0")}`,
              partner: isMealDelivery
                ? firstSupplier
                : application.id.startsWith("sample-app-")
                  ? ingredientSuppliers[
                      (sampleIndex + rowIndex) % ingredientSuppliers.length
                    ]
                  : firstSupplier,
              destination: application.applicantName,
              quantity: isMealDelivery
                ? `${360 + ((sampleIndex + rowIndex) % 8) * 35} suất ăn`
                : `${90 + ((sampleIndex + rowIndex) % 9) * 15} kg / lô`,
              status: "Đã nhận",
              sourceSystem: `${deliveryBase} · dữ liệu mẫu`,
              flow: "Nhập hàng",
            } satisfies DeliveryRecord;
          },
        )
      : [];

  return {
    id: `approved-${application.id}`,
    applicationId: application.id,
    name: application.applicantName,
    category,
    applicationType: type,
    mealOrganization,
    address: application.address,
    contact: application.contact,
    taxCode: String(fields.taxCode || "Chưa khai báo"),
    licenseNumber: String(fields.licenseNumber || "Chưa khai báo"),
    approvedAt: date,
    reviewer: approval.reviewer,
    personInCharge,
    mealsPerDay: capacity,
    documents: attachments.map((file) => ({
      name: file.name,
      kind: file.kind,
      previewUrl:
        file.previewUrl ??
        (file.kind.startsWith("image/") ? heroFoodImage : undefined),
    })),
    registrationFields: [
      { label: "Mã hồ sơ", value: application.reference },
      ...registrationFields,
      { label: "Kết quả duyệt", value: "Đạt / PASS" },
      { label: "Ngày duyệt", value: date },
      { label: "Cán bộ duyệt", value: approval.reviewer },
    ],
    supplierSources: type === "meal-provider" ? buildSupplierSources(application.id) : [],
    relatedFacilities,
    deliveries: [
      ...(type === "meal-provider"
        ? []
        : type === "school"
          ? schoolSupplierDeliveries
          : [
            {
              id: `delivery-${application.id}-in`,
              date,
              kind: "Nguyên liệu",
              orderCode: `${application.reference}-IN`,
              partner: firstSupplier,
              destination: application.applicantName,
              quantity: "Theo danh mục đã khai báo",
              status: "Đã nhận",
              sourceSystem: deliveryBase,
              flow: "Nhập hàng",
            } satisfies DeliveryRecord,
          ]),
      ...(type === "meal-provider"
        ? mealDeliveryRecords
        : [
            {
              id: `delivery-${application.id}-out`,
              date,
              kind: "Nguyên liệu",
              orderCode: `${application.reference}-OUT`,
              partner: application.applicantName,
              destination: firstRelated,
              quantity: "Theo đơn vị đã khai báo",
              status: "Đã giao",
              sourceSystem: deliveryBase,
              flow: "Xuất hàng",
            } satisfies DeliveryRecord,
          ]),
    ],
  };
};

const getFacilityProfiles = () =>
  readApprovedFacilities()
    .map(buildProfile);

const getFacilityIncidents = (profile: FacilityProfile) =>
  readIncidents().filter((incident) => incident.facility === profile.name);

const formatIncidentDay = (value: string) =>
  new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(value));

const formatIncidentTime = (value: string) =>
  new Intl.DateTimeFormat("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));

function IncidentHistoryTable({ incidents }: { incidents: Incident[] }) {
  return (
    <section
      className="mt-6 overflow-hidden rounded-2xl border border-border bg-card shadow-sm"
      data-testid="panel-facility-incident-history"
    >
      <div className="flex items-center gap-2 border-b border-border px-5 py-4">
        <ShieldAlert size={18} className="text-orange-600" />
        <div>
          <h2 className="font-extrabold">Lịch sử cảnh báo ATTP</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Các sự cố được ghi nhận trong module Quản lý và xử lý sự cố ATTP.
          </p>
        </div>
      </div>
      {incidents.length ? (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] text-left">
            <thead className="bg-slate-50 text-xs uppercase tracking-[.05em] text-slate-400">
              <tr>
                <th className="px-5 py-4 font-normal">Mã sự cố</th>
                <th className="px-5 py-4 font-normal">Trường</th>
                <th className="px-5 py-4 font-normal">Phát hiện</th>
                <th className="px-5 py-4 font-normal">Số ca</th>
                <th className="px-5 py-4 font-normal">Bữa ăn</th>
                <th className="px-5 py-4 font-normal">Trạng thái</th>
                <th className="px-5 py-4 text-right font-normal">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {incidents.map((incident) => (
                <tr
                  key={incident.id}
                  className="transition-colors hover:bg-slate-50"
                  data-testid={`row-facility-incident-${incident.id}`}
                >
                  <td className="px-5 py-6 align-middle font-mono text-sm font-semibold tracking-[.03em] text-slate-700">
                    {incident.code}
                  </td>
                  <td className="max-w-[220px] px-5 py-6 align-middle text-sm leading-5 text-slate-700">
                    {incident.facility}
                  </td>
                  <td className="px-5 py-6 align-middle">
                    <span className="block text-sm text-slate-600">
                      {formatIncidentDay(incident.occurredAt)}
                    </span>
                    <span className="mt-0.5 block text-xs text-slate-400">
                      {formatIncidentTime(incident.occurredAt)}
                    </span>
                  </td>
                  <td className="px-5 py-6 align-middle">
                    <span className="inline-flex min-w-8 justify-center rounded bg-amber-100 px-2 py-1 text-xs font-semibold text-amber-900">
                      {String(incident.suspectedCases ?? 0).padStart(2, "0")}
                    </span>
                  </td>
                  <td className="max-w-[170px] px-5 py-6 align-middle text-sm leading-5 text-slate-600">
                    {incident.meals?.join(", ") || incident.foods || "—"}
                  </td>
                  <td className="px-5 py-6 align-middle">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                        incident.status === "Đang xử lý"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-emerald-100 text-emerald-700"
                      }`}
                      data-testid={`status-facility-incident-${incident.id}`}
                    >
                      {incident.status}
                    </span>
                  </td>
                  <td className="px-5 py-6 text-right align-middle">
                    <Link
                      href={`/admin/inspections/incidents/${incident.id}`}
                      className="focus-ring inline-flex min-h-12 items-center justify-center rounded-lg border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition-colors hover:border-blue-300 hover:text-blue-700"
                      data-testid={`link-view-facility-incident-${incident.id}`}
                    >
                      Xem chi tiết
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex items-center gap-3 p-6 text-sm text-emerald-800">
          <CheckCircle2 size={19} />
          Cơ sở chưa có cảnh báo ATTP nào được ghi nhận.
        </div>
      )}
    </section>
  );
}

function DeliveryHistoryTable({
  title,
  description,
  deliveries,
  deliveryKind,
  onDeliveryKindChange,
  emptyDescription,
}: {
  title: string;
  description: string;
  deliveries: DeliveryRecord[];
  deliveryKind: "Tất cả" | DeliveryKind;
  onDeliveryKindChange: (value: "Tất cả" | DeliveryKind) => void;
  emptyDescription: string;
}) {
  return (
    <section className="mt-6 overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <div className="flex flex-col gap-3 border-b border-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <History size={18} className="text-primary" />
          <div>
            <h2 className="font-extrabold">{title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
        <select value={deliveryKind} onChange={(event) => onDeliveryKindChange(event.target.value as "Tất cả" | DeliveryKind)} className="h-10 rounded-xl border border-input bg-background px-3 text-sm font-semibold outline-none focus:border-primary" aria-label="Lọc loại giao nhận">
          <option>Tất cả</option>
          <option>Thức ăn</option>
          <option>Nguyên liệu</option>
        </select>
      </div>
      {deliveries.length ? (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] text-left text-sm">
            <thead className="bg-secondary/45 text-xs uppercase tracking-wide text-muted-foreground">
              <tr><th className="px-5 py-3">Ngày / đơn hàng</th><th className="px-5 py-3">Loại</th><th className="px-5 py-3">Đối tác</th><th className="px-5 py-3">Điểm giao nhận</th><th className="px-5 py-3">Khối lượng</th></tr>
            </thead>
            <tbody className="divide-y divide-border">
              {deliveries.map((delivery) => (
                <tr key={delivery.id} className="hover:bg-secondary/20">
                  <td className="px-5 py-4"><p className="font-bold">{delivery.date}</p><p className="mt-1 text-xs text-muted-foreground">{delivery.orderCode}</p></td>
                  <td className="px-5 py-4"><span className="inline-flex items-center gap-1.5 font-semibold">{delivery.kind === "Thức ăn" ? <Utensils size={15} className="text-primary" /> : <PackageCheck size={15} className="text-amber-700" />}{delivery.kind}</span></td>
                  <td className="px-5 py-4 font-semibold">{delivery.partner}</td>
                  <td className="px-5 py-4 text-muted-foreground">{delivery.destination}</td>
                  <td className="px-5 py-4 font-semibold">{delivery.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : <div className="p-5"><EmptyState title="Chưa có bản ghi giao nhận" description={emptyDescription} /></div>}
    </section>
  );
}

function MealOrderDetailDialog({
  delivery,
  onClose,
}: {
  delivery: DeliveryRecord;
  onClose: () => void;
}) {
  const detail = delivery.mealOrderDetail;
  if (!detail) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-sm"
      role="presentation"
      onClick={onClose}
    >
      <div
        className="relative max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-3xl bg-white shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-label={`Thông tin chi tiết phiếu ${delivery.orderCode}`}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-border px-6 py-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.14em] text-primary">
              THÔNG TIN CHI TIẾT PHIẾU
            </p>
            <h2 className="mt-1 text-2xl font-extrabold">
              {delivery.orderCode}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-muted-foreground hover:bg-secondary hover:text-foreground"
            aria-label="Đóng chi tiết phiếu xuất"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-6 p-6">
          <section>
            <h3 className="flex items-center gap-2 text-sm font-extrabold">
              <FileCheck2 size={17} className="text-primary" />
              Thông tin đơn hàng
            </h3>
            <dl className="mt-3 grid gap-x-6 gap-y-4 rounded-2xl border border-border bg-secondary/20 p-4 sm:grid-cols-2">
              <div>
                <dt className="text-xs text-muted-foreground">Mã đơn hàng</dt>
                <dd className="mt-1 font-bold">{delivery.orderCode}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">MST</dt>
                <dd className="mt-1 font-bold">{detail.taxCode}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Tên khách hàng</dt>
                <dd className="mt-1 font-bold">{detail.customerName}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Địa chỉ</dt>
                <dd className="mt-1 font-bold">{detail.address}</dd>
              </div>
            </dl>
          </section>

          <section>
            <h3 className="flex items-center gap-2 text-sm font-extrabold">
              <Utensils size={17} className="text-primary" />
              Danh sách xuất
            </h3>
            <div className="mt-3 overflow-x-auto rounded-2xl border border-border">
              <table className="w-full min-w-[520px] text-left text-sm">
                <thead className="bg-secondary/45 text-xs uppercase tracking-wide text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3">Món ăn / suất ăn</th>
                    <th className="px-4 py-3">Số lượng</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {detail.meals.map((meal) => (
                    <tr key={meal.name}>
                      <td className="px-4 py-3 font-semibold">{meal.name}</td>
                      <td className="px-4 py-3 font-bold">{meal.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h3 className="flex items-center gap-2 text-sm font-extrabold">
              <Truck size={17} className="text-primary" />
              Thông tin giao nhận
            </h3>
            <dl className="mt-3 grid gap-x-6 gap-y-4 rounded-2xl border border-border bg-secondary/20 p-4 sm:grid-cols-3">
              <div>
                <dt className="text-xs text-muted-foreground">Ngày giờ giao</dt>
                <dd className="mt-1 font-bold">{detail.deliveredAt}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Phương tiện</dt>
                <dd className="mt-1 font-bold">{detail.vehicle}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Biển số xe</dt>
                <dd className="mt-1 font-bold">{detail.licensePlate}</dd>
              </div>
            </dl>
          </section>
        </div>
      </div>
    </div>
  );
}

function MealDeliveryHistoryTable({
  deliveries,
}: {
  deliveries: DeliveryRecord[];
}) {
  const [selectedDelivery, setSelectedDelivery] =
    useState<DeliveryRecord | null>(null);

  return (
    <>
      <section className="mt-6 overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div className="border-b border-border px-5 py-5">
          <div className="flex items-center gap-2">
            <Truck size={18} className="text-primary" />
            <div>
              <h2 className="font-extrabold">Cơ sở nhận hàng</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Danh sách lịch sử xuất suất ăn đến các đơn vị nhận hàng.
              </p>
            </div>
          </div>
        </div>
        {deliveries.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1080px] text-left text-sm">
              <thead className="bg-secondary/45 text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-5 py-3">Mã đơn hàng</th>
                  <th className="px-5 py-3">Ngày giờ</th>
                  <th className="px-5 py-3">Tên khách hàng</th>
                  <th className="px-5 py-3">MST</th>
                  <th className="px-5 py-3">Địa chỉ</th>
                  <th className="px-5 py-3">Tổng suất ăn</th>
                  <th className="px-5 py-3 text-right">Chi tiết</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {deliveries.map((delivery) => {
                  const detail = delivery.mealOrderDetail;
                  return (
                    <tr
                      key={delivery.id}
                      className="transition-colors hover:bg-secondary/20"
                      data-testid={`row-meal-delivery-${delivery.id}`}
                    >
                      <td className="px-5 py-5 font-mono text-sm font-bold text-foreground">
                        {delivery.orderCode}
                      </td>
                      <td className="px-5 py-5">
                        <p className="font-semibold">
                          {detail?.deliveredAt ?? delivery.date}
                        </p>
                      </td>
                      <td className="max-w-[220px] px-5 py-5 font-semibold">
                        {detail?.customerName ?? delivery.partner}
                      </td>
                      <td className="px-5 py-5 font-mono text-xs">
                        {detail?.taxCode ?? "Chưa cập nhật"}
                      </td>
                      <td className="max-w-[240px] px-5 py-5 text-muted-foreground">
                        {detail?.address ?? delivery.destination}
                      </td>
                      <td className="px-5 py-5 font-bold">
                        {delivery.quantity}
                      </td>
                      <td className="px-5 py-5 text-right">
                        <button
                          type="button"
                          onClick={() => setSelectedDelivery(delivery)}
                          className="inline-flex items-center justify-center rounded-xl border border-primary/25 bg-primary/[.04] px-3 py-2 text-xs font-bold text-primary transition-colors hover:bg-primary/10"
                          data-testid={`button-view-meal-delivery-${delivery.id}`}
                        >
                          Xem chi tiết
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-5">
            <EmptyState
              title="Chưa có lịch sử xuất suất ăn"
              description="Các phiếu xuất đến cơ sở nhận hàng sẽ hiển thị tại đây."
            />
          </div>
        )}
      </section>
      {selectedDelivery ? (
        <MealOrderDetailDialog
          delivery={selectedDelivery}
          onClose={() => setSelectedDelivery(null)}
        />
      ) : null}
    </>
  );
}

function IngredientDetailDialog({
  receipt,
  onClose,
}: {
  receipt: IngredientReceipt;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-sm"
      role="presentation"
      onClick={onClose}
    >
      <div
        className="relative max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-label={`Chi tiết nguyên liệu ${receipt.name}`}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-border px-6 py-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.14em] text-primary">
              CHI TIẾT NHẬP HÀNG
            </p>
            <h2 className="mt-1 text-2xl font-extrabold">{receipt.name}</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Mã nguyên liệu {receipt.code}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-muted-foreground hover:bg-secondary hover:text-foreground"
            aria-label="Đóng chi tiết nguyên liệu"
          >
            <X size={20} />
          </button>
        </div>
        <div className="grid gap-6 p-6 lg:grid-cols-[1fr_250px]">
          <div className="space-y-6">
            <section>
              <h3 className="flex items-center gap-2 text-sm font-extrabold text-foreground">
                <PackageCheck size={17} className="text-primary" />
                Thông tin nguyên liệu
              </h3>
              <dl className="mt-3 grid gap-x-6 gap-y-4 rounded-2xl border border-border bg-secondary/20 p-4 sm:grid-cols-2">
                <div>
                  <dt className="text-xs text-muted-foreground">Mã nguyên liệu</dt>
                  <dd className="mt-1 font-bold">{receipt.code}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">Tên nguyên liệu</dt>
                  <dd className="mt-1 font-bold">{receipt.name}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">Đơn vị</dt>
                  <dd className="mt-1 font-bold">{receipt.unit}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">Nguồn cung cấp</dt>
                  <dd className="mt-1 font-bold">{receipt.supplier}</dd>
                </div>
              </dl>
            </section>
            <section>
              <h3 className="flex items-center gap-2 text-sm font-extrabold text-foreground">
                <History size={17} className="text-primary" />
                Thông tin nhập
              </h3>
              <dl className="mt-3 grid gap-x-6 gap-y-4 rounded-2xl border border-border bg-secondary/20 p-4 sm:grid-cols-2">
                <div>
                  <dt className="text-xs text-muted-foreground">Lô</dt>
                  <dd className="mt-1 font-bold">{receipt.lot}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">Số lượng</dt>
                  <dd className="mt-1 font-bold">{receipt.quantity} {receipt.unit}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">Người tạo</dt>
                  <dd className="mt-1 font-bold">{receipt.createdBy}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">Ngày nhập</dt>
                  <dd className="mt-1 font-bold">{receipt.receivedAt}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">Hạn sử dụng</dt>
                  <dd className="mt-1 font-bold">{receipt.expiryDate}</dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-xs text-muted-foreground">Ghi chú</dt>
                  <dd className="mt-1 font-semibold">{receipt.note || "—"}</dd>
                </div>
              </dl>
            </section>
          </div>
          <section>
            <h3 className="flex items-center gap-2 text-sm font-extrabold text-foreground">
              <FileImage size={17} className="text-primary" />
              Hình ảnh đính kèm
            </h3>
            <div className="mt-3 overflow-hidden rounded-2xl border border-border bg-secondary/20">
              <div className="aspect-[4/3] overflow-hidden bg-slate-100">
                <img
                  src={heroFoodImage}
                  alt={receipt.attachmentName}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="p-4">
                <p className="text-sm font-bold">{receipt.attachmentLabel}</p>
                <p className="mt-1 truncate text-xs text-muted-foreground" title={receipt.attachmentName}>
                  {receipt.attachmentName}
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function SupplierHistoryDialog({
  supplier,
  onClose,
  onReceiptSelect,
}: {
  supplier: SupplierSource;
  onClose: () => void;
  onReceiptSelect: (receipt: IngredientReceipt) => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-sm"
      role="presentation"
      onClick={onClose}
    >
      <div
        className="relative flex max-h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-label={`Lịch sử nhập hàng của ${supplier.name}`}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-border px-5 py-5 sm:px-7">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wide text-primary">
                <History size={13} />
                Lịch sử nhập hàng
              </span>
              <span className="text-xs font-semibold text-muted-foreground">
                {supplier.receipts.length} bản ghi
              </span>
            </div>
            <h2 className="mt-3 truncate text-xl font-extrabold sm:text-2xl">{supplier.name}</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Mã số thuế {supplier.taxCode} <span className="mx-1.5">·</span> {supplier.phone}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-xl p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            aria-label="Đóng lịch sử nhập hàng"
          >
            <X size={20} />
          </button>
        </div>

        <div className="overflow-y-auto bg-slate-50/70 p-5 sm:p-7">
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-border bg-white p-4 shadow-sm">
              <p className="text-xs font-semibold text-muted-foreground">Tổng nguyên liệu</p>
              <p className="mt-1 text-2xl font-extrabold text-foreground">{supplier.ingredientCount}</p>
              <p className="mt-1 text-xs text-muted-foreground">được khai báo từ nhà cung cấp</p>
            </div>
            <div className="rounded-2xl border border-border bg-white p-4 shadow-sm">
              <p className="text-xs font-semibold text-muted-foreground">Lần nhập gần nhất</p>
              <p className="mt-1 text-2xl font-extrabold text-foreground">
                {supplier.receipts[0]?.receivedAt ?? "—"}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">theo dữ liệu đang hiển thị</p>
            </div>
            <div className="rounded-2xl border border-border bg-white p-4 shadow-sm">
              <p className="text-xs font-semibold text-muted-foreground">Trạng thái hồ sơ</p>
              <p className="mt-1 inline-flex items-center gap-1.5 text-base font-extrabold text-emerald-700">
                <CheckCircle2 size={17} />
                Đang theo dõi
              </p>
              <p className="mt-1 text-xs text-muted-foreground">nguồn cung cấp đầu vào</p>
            </div>
          </div>

          <section className="mt-5 overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
            <div className="border-b border-border px-4 py-4 sm:px-5">
              <div className="flex items-center gap-2">
                <PackageCheck size={18} className="text-primary" />
                <h3 className="font-extrabold">Danh sách lần nhập</h3>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                Chọn một lần nhập để xem đầy đủ thông tin nguyên liệu và chứng từ.
              </p>
            </div>
            {supplier.receipts.length ? (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[850px] text-left text-sm">
                  <thead className="bg-secondary/45 text-xs uppercase tracking-wide text-muted-foreground">
                    <tr>
                      <th className="px-5 py-3">Mã nguyên liệu</th>
                      <th className="px-5 py-3">Tên nguyên liệu</th>
                      <th className="px-5 py-3">Lô / số lượng</th>
                      <th className="px-5 py-3">Ngày nhập</th>
                      <th className="px-5 py-3 text-right">Chi tiết</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {supplier.receipts.map((receipt) => (
                      <tr key={receipt.id} className="transition-colors hover:bg-primary/[.03]">
                        <td className="px-5 py-4 font-mono text-xs font-bold">{receipt.code}</td>
                        <td className="px-5 py-4">
                          <p className="font-bold">{receipt.name}</p>
                          <p className="mt-1 text-xs text-muted-foreground">Đơn vị: {receipt.unit}</p>
                        </td>
                        <td className="px-5 py-4">
                          <p className="font-semibold">Lô {receipt.lot}</p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {receipt.quantity} {receipt.unit}
                          </p>
                        </td>
                        <td className="px-5 py-4 font-semibold">{receipt.receivedAt}</td>
                        <td className="px-5 py-4 text-right">
                          <button
                            type="button"
                            onClick={() => onReceiptSelect(receipt)}
                            className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3 py-2 text-xs font-bold text-primary-foreground transition-colors hover:bg-primary/90"
                            data-testid={`button-view-ingredient-${receipt.id}`}
                          >
                            <Eye size={14} />
                            Xem chi tiết
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-5">
                <EmptyState
                  title="Chưa có lịch sử nhập hàng"
                  description="Nhà cung cấp này chưa có bản ghi nguyên liệu mẫu."
                />
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

function SupplierSourcePanel({ profile }: { profile: FacilityProfile }) {
  const [search, setSearch] = useState("");
  const [historySupplier, setHistorySupplier] = useState<SupplierSource | null>(null);
  const [selectedReceipt, setSelectedReceipt] = useState<IngredientReceipt | null>(null);
  const filteredSources = profile.supplierSources.filter((supplier) =>
    `${supplier.name} ${supplier.taxCode} ${supplier.phone}`
      .toLowerCase()
      .includes(search.trim().toLowerCase()),
  );

  return (
    <>
      <section className="mt-6 overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div className="border-b border-border px-5 py-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <PackageCheck size={18} className="text-primary" />
                <h2 className="font-extrabold">Nhà cung cấp đầu vào</h2>
                <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-extrabold text-primary">
                  {profile.supplierSources.length}
                </span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                Theo dõi nguồn cung cấp nguyên liệu và mở lịch sử nhập hàng theo từng nhà cung cấp.
              </p>
            </div>
            <label className="relative block lg:w-80">
              <span className="sr-only">Tìm kiếm nhà cung cấp</span>
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Tìm tên, mã số thuế, số điện thoại"
                className="h-11 w-full rounded-xl border border-input bg-background pl-9 pr-3 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
                data-testid="input-search-supplier-source"
              />
            </label>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-semibold text-muted-foreground">
            <span>{filteredSources.length} nhà cung cấp đang hiển thị</span>
            <span className="hidden h-3 w-px bg-border sm:block" />
            <span className="inline-flex items-center gap-1.5">
              <History size={14} className="text-primary" />
              Bấm “Lịch sử nhập hàng” để xem chi tiết
            </span>
          </div>
        </div>
        {filteredSources.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px] text-left text-sm">
              <thead className="bg-secondary/45 text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="w-16 px-5 py-3">STT</th>
                  <th className="px-5 py-3">Tên nhà cung cấp</th>
                  <th className="px-5 py-3">Mã số thuế</th>
                  <th className="px-5 py-3">Số điện thoại</th>
                  <th className="px-5 py-3">Nguyên liệu</th>
                  <th className="px-5 py-3 text-right">Lịch sử nhập hàng</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredSources.map((supplier, index) => (
                  <tr key={supplier.id} className="transition-colors hover:bg-primary/[.03]">
                    <td className="px-5 py-4 font-semibold text-muted-foreground">{index + 1}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                          <PackageCheck size={16} />
                        </span>
                        <span className="font-bold">{supplier.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 font-mono text-xs">{supplier.taxCode}</td>
                    <td className="px-5 py-4">{supplier.phone}</td>
                    <td className="px-5 py-4">
                      <span className="inline-flex min-w-8 items-center justify-center rounded-full bg-secondary px-2.5 py-1 font-bold">
                        {supplier.ingredientCount}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedReceipt(null);
                          setHistorySupplier(supplier);
                        }}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-primary/25 bg-primary/[.04] px-3 py-2 text-xs font-bold text-primary transition-colors hover:bg-primary/10"
                        data-testid={`button-view-supplier-${supplier.id}`}
                      >
                        <History size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-5">
            <EmptyState title="Không tìm thấy nhà cung cấp" description="Thử thay đổi từ khóa tìm kiếm." />
          </div>
        )}
      </section>

      {historySupplier ? (
        <SupplierHistoryDialog
          supplier={historySupplier}
          onClose={() => setHistorySupplier(null)}
          onReceiptSelect={(receipt) => setSelectedReceipt(receipt)}
        />
      ) : null}

      {selectedReceipt ? (
        <IngredientDetailDialog
          receipt={selectedReceipt}
          onClose={() => setSelectedReceipt(null)}
        />
      ) : null}
    </>
  );
}

function MealMenuPanel({ profile }: { profile: FacilityProfile }) {
  const mealDetails = profile.registrationFields.filter(({ label }) =>
    /bữa ăn|suất ăn|nấu|giao\/nhận|đơn vị cung cấp|nhân viên chế biến|giá/i.test(
      label,
    ),
  );
  const menuSeed = Number(profile.applicationId.match(/\d+$/)?.[0] || 0);
  const sampleMenus = [
    {
      day: "Thứ Hai",
      date: "21/09/2026",
      dishes: ["Cơm trắng", "Thịt kho trứng", "Canh rau ngót nấu thịt", "Chuối chín"],
    },
    {
      day: "Thứ Ba",
      date: "22/09/2026",
      dishes: ["Cơm gạo lứt", "Cá basa sốt cà", "Canh bí đỏ", "Sữa chua"],
    },
    {
      day: "Thứ Tư",
      date: "23/09/2026",
      dishes: ["Bún thịt bằm", "Đậu hũ sốt thịt", "Rau cải luộc", "Dưa hấu"],
    },
    {
      day: "Thứ Năm",
      date: "24/09/2026",
      dishes: ["Cơm trắng", "Gà rim gừng", "Canh chua rau củ", "Cam tươi"],
    },
    {
      day: "Thứ Sáu",
      date: "25/09/2026",
      dishes: ["Mì nui thịt bò", "Trứng hấp", "Canh cải xanh", "Thanh long"],
    },
  ];
  const menuVariant = menuSeed % sampleMenus.length;

  return (
    <section className="mt-6 overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <div className="border-b border-border px-5 py-5">
        <div className="flex items-center gap-2">
          <Utensils size={18} className="text-primary" />
          <div>
            <h2 className="font-extrabold">Thực đơn và suất ăn</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Thông tin tổ chức bữa ăn và suất ăn được lấy từ hồ sơ đăng ký đã duyệt.
            </p>
          </div>
        </div>
      </div>
      <div className="grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border border-primary/15 bg-primary/[.04] p-4">
          <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
            Hình thức tổ chức
          </p>
          <p className="mt-2 text-sm font-extrabold text-primary">
            {profile.mealOrganization ?? "Chưa khai báo"}
          </p>
        </div>
        {mealDetails.map(({ label, value }) => (
          <div key={label} className="rounded-xl border border-border p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
              {label}
            </p>
            <p className="mt-2 break-words text-sm font-bold">
              {Array.isArray(value)
                ? value.map(displayValue).join(", ")
                : value}
            </p>
          </div>
        ))}
      </div>
      <div className="mx-5 mb-3 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="font-extrabold">Thực đơn mẫu trong tuần</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Dữ liệu minh họa theo hồ sơ; số suất được thay đổi theo từng cơ sở.
          </p>
        </div>
        <span className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700">
          Dữ liệu mẫu
        </span>
      </div>
      <div className="grid gap-3 px-5 pb-5 md:grid-cols-2 xl:grid-cols-3">
        {sampleMenus.map((menu, dayIndex) => {
          const menuIndex = (dayIndex + menuVariant) % sampleMenus.length;
          const menuForDay = sampleMenus[menuIndex];
          const servings = 280 + ((menuSeed + dayIndex * 3) % 9) * 35;
          return (
            <article
              key={`${menu.date}-${profile.applicationId}`}
              className="rounded-xl border border-border bg-background p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-primary">
                    {menuForDay.day}
                  </p>
                  <h4 className="mt-1 font-extrabold">{menuForDay.date}</h4>
                </div>
                <span className="rounded-lg bg-secondary px-2.5 py-1.5 text-xs font-bold">
                  {servings} suất
                </span>
              </div>
              <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground">
                {menuForDay.dishes.map((dish) => (
                  <li key={dish} className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                    {dish}
                  </li>
                ))}
              </ul>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function DocumentPreviewDialog({
  document,
  onClose,
}: {
  document: { name: string; url: string };
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-sm"
      role="presentation"
      onClick={onClose}
    >
      <div
        className="relative flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-label={`Xem minh chứng ${document.name}`}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-4 border-b border-border px-5 py-4">
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-[.14em] text-primary">MINH CHỨNG HỒ SƠ</p>
            <h2 className="mt-1 truncate font-extrabold">{document.name}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-lg p-2 text-muted-foreground hover:bg-secondary hover:text-foreground"
            aria-label="Đóng xem minh chứng"
          >
            <X size={20} />
          </button>
        </div>
        <div className="flex min-h-[22rem] items-center justify-center overflow-auto bg-slate-100 p-5 sm:p-8">
          <img src={document.url} alt={document.name} className="max-h-[70vh] max-w-full rounded-xl object-contain shadow-lg" />
        </div>
      </div>
    </div>
  );
}

export function FacilityProfilesPage() {
  const profiles = useMemo(getFacilityProfiles, []);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Tất cả loại hình");
  const filteredProfiles = profiles.filter((profile) => {
    const haystack = `${profile.name} ${profile.address} ${profile.taxCode}`.toLowerCase();
    return haystack.includes(search.trim().toLowerCase()) && (category === "Tất cả loại hình" || profile.category === category);
  });
  const totalDeliveries = profiles.reduce((total, profile) => total + profile.deliveries.length, 0);
  const totalIncidents = profiles.reduce((total, profile) => total + getFacilityIncidents(profile).length, 0);

  return (
    <AdminShell>
      <div className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Hồ sơ cơ sở"
          title="Hồ sơ chỉ hiển thị sau khi duyệt đạt."
          description="Danh sách được tạo từ snapshot đầy đủ của form đăng ký sau khi cán bộ lưu kết quả Đạt/PASS. Các tab chi tiết tự động bật/tắt theo loại hình cơ sở."
          action={<div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-950"><div className="flex items-center gap-2 font-bold"><BadgeCheck size={16} /> Nguồn dữ liệu: hồ sơ đã duyệt</div><p className="mt-1 text-xs text-emerald-800">Cảnh báo ATTP phát sinh sẽ được nối vào tab lịch sử của đúng cơ sở.</p></div>}
        />
        <div className="grid gap-4 md:grid-cols-3">
          <MetricCard label="Cơ sở đã duyệt" value={profiles.length} icon={BadgeCheck} />
          <MetricCard label="Bản ghi giao nhận" value={totalDeliveries} tone="blue" icon={Truck} />
          <MetricCard label="Sự cố ATTP" value={totalIncidents} tone="orange" icon={ShieldAlert} />
        </div>
        <section className="mt-6 rounded-2xl border border-border bg-card p-4 shadow-sm">
          <div className="grid gap-3 lg:grid-cols-[1fr_280px]">
            <label className="relative block"><span className="sr-only">Tìm cơ sở</span><Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Tìm theo tên, mã số thuế hoặc địa chỉ..." className="h-11 w-full rounded-xl border border-input bg-background pl-10 pr-3 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10" /></label>
            <select value={category} onChange={(event) => setCategory(event.target.value)} className="h-11 rounded-xl border border-input bg-background px-3 text-sm font-semibold outline-none focus:border-primary" aria-label="Lọc theo loại hình"><option>Tất cả loại hình</option><option>Cơ sở cung cấp thực phẩm</option><option>Cơ sở cung cấp suất ăn</option><option>Cơ sở giáo dục</option></select>
          </div>
        </section>
         <section className="mt-6 overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
           <div className="flex flex-col gap-2 border-b border-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="font-extrabold text-foreground">Danh sách cơ sở đã duyệt</h2><p className="mt-1 text-sm text-muted-foreground">{filteredProfiles.length} / {profiles.length} cơ sở đang hiển thị</p></div><span className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground"><Clock3 size={14} /> Dữ liệu đồng bộ theo lần duyệt</span></div>
           {filteredProfiles.length ? <div className="divide-y divide-border">{filteredProfiles.map((profile) => <div key={profile.id} className="flex flex-col gap-4 px-5 py-5 transition-colors hover:bg-secondary/30 lg:flex-row lg:items-center lg:justify-between"><div className="flex min-w-0 gap-3"><div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">{profile.applicationType === "meal-provider" ? <Utensils size={21} /> : profile.applicationType === "school" ? <Building2 size={21} /> : <PackageCheck size={21} />}</div><div className="min-w-0"><h3 className="font-extrabold text-foreground">{profile.name}</h3><p className="mt-1 flex items-start gap-1.5 text-sm text-muted-foreground"><MapPin size={15} className="mt-0.5 shrink-0" /> {profile.address}</p><div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs font-semibold text-muted-foreground"><span>{profile.category}</span>{profile.applicationType === "school" && profile.mealOrganization ? <span className={`rounded-full px-2.5 py-1 font-bold ${mealOrganizationBadgeClass(profile.mealOrganization)}`}>Tổ chức bữa ăn: {profile.mealOrganization}</span> : null}<span>Duyệt ngày {profile.approvedAt}</span><span>{profile.deliveries.length} giao nhận · {getFacilityIncidents(profile).length} cảnh báo</span></div></div></div><Link href={`/admin/facility-profiles/${profile.id}`} className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground hover:bg-primary/90" data-testid={`link-facility-profile-${profile.id}`}>Xem hồ sơ <ArrowRight size={16} /></Link></div>)}</div> : <div className="p-5"><EmptyState title="Không có cơ sở phù hợp" description="Thử thay đổi từ khóa hoặc bộ lọc loại hình." /></div>}
        </section>
      </div>
    </AdminShell>
  );
}

export function FacilityProfileDetailPage() {
  const { facilityId = "" } = useParams<{ facilityId: string }>();
  const profiles = useMemo(getFacilityProfiles, []);
  const [activeTab, setActiveTab] = useState<ProfileTabId>("info");
  const [deliveryKind, setDeliveryKind] = useState<"Tất cả" | DeliveryKind>("Tất cả");
  const [previewDocument, setPreviewDocument] = useState<{ name: string; url: string } | null>(null);
  const profile = profiles.find((item) => item.id === facilityId);

  if (!profile) {
    return <AdminShell><div className="mx-auto max-w-4xl px-5 py-12 lg:px-10"><Link href="/admin/facility-profiles" className="inline-flex items-center gap-2 text-sm font-bold text-primary"><ArrowLeft size={16} /> Quay lại Hồ sơ cơ sở</Link><div className="mt-8 rounded-3xl border border-border bg-card p-8 text-center shadow-sm"><h1 className="text-2xl font-extrabold">Không tìm thấy hồ sơ cơ sở</h1><p className="mt-2 text-sm text-muted-foreground">Chỉ hồ sơ đã duyệt đạt mới xuất hiện tại đây.</p></div></div></AdminShell>;
  }

  const filteredDeliveries = profile.deliveries.filter((delivery) => deliveryKind === "Tất cả" || delivery.kind === deliveryKind);
  const incidents = getFacilityIncidents(profile);
  const isSchool = profile.applicationType === "school";
  const isIngredientSchool =
    isSchool && isIngredientSupplierSchool(profile.mealOrganization);
  const schoolSupplierLabel = isIngredientSchool
    ? "Nhà cung cấp nguyên liệu đầu vào"
    : "Nhà cung cấp suất ăn";
  const tabs: { id: ProfileTabId; label: string; icon: typeof FileCheck2 }[] = [
    { id: "info", label: "Thông tin đã duyệt", icon: FileCheck2 },
    ...(isSchool
      ? [{ id: "suppliers" as const, label: schoolSupplierLabel, icon: PackageCheck }]
      : profile.applicationType === "meal-provider"
        ? [{ id: "suppliers" as const, label: "Nhà cung cấp đầu vào", icon: PackageCheck }]
      : []),
    ...(isSchool
      ? [{ id: "menus" as const, label: "Thực đơn và suất ăn", icon: Utensils }]
      : []),
    ...(profile.applicationType !== "school"
      ? [{ id: "outgoing" as const, label: "Cơ sở nhận hàng", icon: Truck }]
      : []),
    { id: "incidents", label: "Lịch sử cảnh báo ATTP", icon: ShieldAlert },
  ];

  return (
    <AdminShell>
      <div className="mx-auto max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8">
        <Link href="/admin/facility-profiles" className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline" data-testid="link-back-to-facility-profiles"><ArrowLeft size={16} /> Quay lại Hồ sơ cơ sở</Link>
        <div className="mt-5 flex flex-col gap-4 border-b border-border pb-6 lg:flex-row lg:items-end lg:justify-between"><div><p className="mono-label text-primary">HỒ SƠ ĐƯỢC TẠO TỪ KẾT QUẢ DUYỆT</p><div className="mt-2 flex flex-wrap items-center gap-3"><h1 className="text-3xl font-extrabold tracking-tight">{profile.name}</h1><span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary">{profile.category}</span>{isSchool && profile.mealOrganization ? <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold ${mealOrganizationBadgeClass(profile.mealOrganization)}`}>Tổ chức bữa ăn: {profile.mealOrganization}</span> : null}</div><p className="mt-2 flex items-start gap-1.5 text-sm text-muted-foreground"><MapPin size={15} className="mt-0.5 shrink-0" /> {profile.address}</p></div><span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-2 text-xs font-bold text-emerald-800"><BadgeCheck size={15} /> Đạt / PASS</span></div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"><MetricCard label="Ngày duyệt" value={profile.approvedAt} icon={BadgeCheck} /><MetricCard label="Bản ghi giao nhận" value={profile.deliveries.length} tone="blue" icon={Truck} /><MetricCard label="Cảnh báo ATTP" value={incidents.length} tone="orange" icon={ShieldAlert} /><MetricCard label="Quy mô hoạt động" value={profile.mealsPerDay} tone="gold" icon={Utensils} /></div>
        <div className="mt-6 overflow-x-auto rounded-2xl border border-border bg-card p-2 shadow-sm"><div className="flex min-w-max gap-1" role="tablist" aria-label="Các nội dung trong hồ sơ cơ sở">{tabs.map((tab) => { const Icon = tab.icon; const isActive = activeTab === tab.id; return <button key={tab.id} type="button" role="tab" aria-selected={isActive} onClick={() => setActiveTab(tab.id)} className={`inline-flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition-colors ${isActive ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:bg-secondary hover:text-foreground"}`}><Icon size={16} />{tab.label}</button>; })}</div></div>

        {activeTab === "info" ? <section className="mt-6 space-y-6">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm"><div className="flex items-center gap-2"><FileCheck2 size={18} className="text-primary" /><div><h2 className="font-extrabold">Toàn bộ thông tin từ form đăng ký</h2><p className="mt-1 text-xs text-muted-foreground">Snapshot được khóa tại thời điểm cán bộ duyệt đạt.</p></div></div><dl className="mt-4 divide-y divide-border text-sm">{profile.registrationFields.map(({ label, value }) => <div key={label} className="grid gap-2 py-3 sm:grid-cols-[260px_1fr]"><dt className="text-muted-foreground">{label}</dt><dd className="font-semibold text-foreground">{Array.isArray(value) ? <div className="flex flex-wrap gap-1.5">{value.map((item, itemIndex) => <span key={`${label}-${itemIndex}`} className="rounded-full bg-secondary px-2.5 py-1 text-xs">{displayValue(item)}</span>)}</div> : value}</dd></div>)}</dl></div>
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm"><div className="flex items-center gap-2"><FileCheck2 size={18} className="text-primary" /><div><h2 className="font-extrabold">Minh chứng đã duyệt</h2><p className="mt-1 text-xs text-muted-foreground">Ảnh minh họa có thể bấm để xem phóng to; tài liệu được giữ nguyên theo hồ sơ.</p></div></div><div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{profile.documents.map((document, documentIndex) => document.previewUrl ? <button key={`${document.name}-${documentIndex}`} type="button" onClick={() => setPreviewDocument({ name: document.name, url: document.previewUrl! })} className="group overflow-hidden rounded-xl border border-border bg-secondary/30 text-left transition hover:border-primary/40 hover:shadow-md"><div className="relative aspect-[4/3] overflow-hidden bg-muted"><img src={document.previewUrl} alt={`Minh họa ${document.name}`} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" /><span className="absolute inset-0 flex items-center justify-center bg-slate-950/45 text-white opacity-0 transition group-hover:opacity-100"><ZoomIn size={24} /></span></div><span className="block truncate px-3 py-2.5 text-sm font-semibold" title={document.name}>{document.name}</span></button> : <div key={`${document.name}-${documentIndex}`} className="flex items-center gap-3 rounded-xl border border-border bg-secondary/30 p-3 text-sm"><FileText size={18} className="shrink-0 text-primary" /><span className="min-w-0 truncate font-semibold" title={document.name}>{document.name}</span></div>)}</div><div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 p-4"><div className="flex items-center gap-2 text-sm font-extrabold text-emerald-950"><CheckCircle2 size={16} /> Trạng thái liên thông</div><p className="mt-1 text-sm text-emerald-900">Hồ sơ đã duyệt đạt và được đưa vào danh sách theo dõi.</p><p className="mt-2 text-xs text-emerald-800">Cán bộ duyệt: {profile.reviewer}</p></div></div>
        </section> : null}

         {activeTab === "suppliers" ? profile.applicationType === "meal-provider" ? <SupplierSourcePanel profile={profile} /> : <DeliveryHistoryTable title={schoolSupplierLabel} description={isIngredientSchool ? "Lịch sử nhập nguyên liệu từ các nhà cung cấp đầu vào." : "Lịch sử tiếp nhận suất ăn từ đơn vị liên kết cung cấp."} deliveries={filteredDeliveries.filter((delivery) => delivery.flow === "Nhập hàng")} deliveryKind={deliveryKind} onDeliveryKindChange={setDeliveryKind} emptyDescription={isIngredientSchool ? "Chưa có lịch sử nhập nguyên liệu từ nhà cung cấp." : "Chưa có lịch sử tiếp nhận suất ăn từ đơn vị cung cấp."} /> : null}
        {activeTab === "menus" ? <MealMenuPanel profile={profile} /> : null}
        {activeTab === "outgoing" ? profile.applicationType === "meal-provider" ? <MealDeliveryHistoryTable deliveries={filteredDeliveries.filter((delivery) => delivery.flow === "Xuất hàng")} /> : <DeliveryHistoryTable title="Cơ sở nhận hàng" description="Lịch sử xuất thực phẩm hoặc suất ăn cho các đơn vị liên quan." deliveries={filteredDeliveries.filter((delivery) => delivery.flow === "Xuất hàng")} deliveryKind={deliveryKind} onDeliveryKindChange={setDeliveryKind} emptyDescription="Chưa có lịch sử xuất hàng cho cơ sở khác." /> : null}
        {activeTab === "incidents" ? <IncidentHistoryTable incidents={incidents} /> : null}
        {previewDocument ? <DocumentPreviewDialog document={previewDocument} onClose={() => setPreviewDocument(null)} /> : null}
      </div>
    </AdminShell>
  );
}