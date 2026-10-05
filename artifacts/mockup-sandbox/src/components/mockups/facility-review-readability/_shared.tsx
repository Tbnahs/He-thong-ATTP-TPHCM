import {
  Building2,
  CheckCircle2,
  FileText,
  Landmark,
  MapPin,
  Search,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import {
  applications,
  getCriteriaSet,
  isRegistrationCriteriaVisible,
  type Application,
  type ApplicationStatus,
  type ApplicationType,
  type CriteriaDefinition,
} from "./source-mock-data";

export { applications, getCriteriaSet, isRegistrationCriteriaVisible };
export type { Application, ApplicationStatus, ApplicationType, CriteriaDefinition };
export const icons = { Building2, CheckCircle2, FileText, Landmark, MapPin, Search, ShieldCheck, UserRound };

export const categoryLabel = (type: ApplicationType) =>
  type === "food-supplier"
    ? "Cơ sở cung cấp thực phẩm"
    : type === "meal-provider"
      ? "Cơ sở cung cấp suất ăn"
      : "Cơ sở giáo dục";

export const statusLabel = (status: ApplicationStatus) =>
  status === "needs-more-info" ? "Yêu cầu bổ sung" : status === "approved" ? "Đã duyệt" : "Chờ duyệt";

export const formatDate = (value: string) =>
  new Intl.DateTimeFormat("vi-VN").format(new Date(value));

export const rowForApplication = (app: Application) => {
  const d = app.data as Record<string, unknown>;
  const value = (key: string) => {
    const raw = d[key];
    if (Array.isArray(raw)) return raw.map(String).join(", ");
    return raw === undefined || raw === null || raw === "" ? "" : String(raw);
  };
  return {
    id: app.id,
    name: app.applicantName,
    category: categoryLabel(app.type),
    province: value("addressProvince") || "TP. Hồ Chí Minh",
    ward: value("addressWard") || "—",
    address: app.address,
    contact: app.contact,
    status: app.status,
    updated: formatDate(app.submittedAt),
    level: value("educationLevels") || value("schoolLevel") || value("educationLevel") || "Chưa khai báo",
    students: value("studentTotal") || value("boardingStudentTotal") || value("studentCount") || "—",
    application: app,
  };
};

export function MockMasthead({ current = false }: { current?: boolean }) {
  return (
    <header className="fr-masthead">
      <div className="fr-brand">
        <span className="fr-seal" aria-hidden="true"><Landmark size={19} /></span>
        <span className="fr-brand-copy">
          <strong>CỔNG AN TOÀN THỰC PHẨM</strong>
          <span>THÀNH PHỐ HỒ CHÍ MINH</span>
        </span>
      </div>
      <span className="fr-mock-mark"><b aria-hidden="true" />{current ? "BẢN HIỆN TẠI · BẢN TRÍCH XUẤT" : "BẢN XEM TRƯỚC · KHÔNG KẾT NỐI HỆ THỐNG"}</span>
    </header>
  );
}

export function StatusBadge({ status }: { status: ApplicationStatus }) {
  return <span className="fr-status" data-status={status}>{statusLabel(status)}</span>;
}

export function formatScalar(value: unknown): string {
  if (value === undefined || value === null || String(value).trim() === "") return "—";
  if (typeof value === "boolean") return value ? "Có" : "Không";
  return String(value);
}

const fieldValue = (row: Record<string, unknown>, key: string, schema?: CriteriaDefinition["repeatableFields"][number]) => {
  const value = row[key];
  if (value === undefined || value === null || value === "") return "—";
  if (schema?.key === "schoolId") {
    const schoolNames: Record<string, string> = {
      "school-001": "Trường Tiểu học Lê Lợi",
      "school-002": "Trường Tiểu học Thái Sơn",
      "school-003": "Trường THCS ABC",
      "school-004": "Trường THPT XYZ",
      "school-005": "Trường Mầm non Hoa Sen",
    };
    return schoolNames[String(value)] ?? String(value);
  }
  return formatScalar(value);
};

export function AnswerValue({
  value,
  definition,
  files = [],
}: {
  value: unknown;
  definition?: Pick<CriteriaDefinition, "repeatableFields">;
  files?: string[];
}) {
  if (files.length) {
    return (
      <span className="fr-file-chips">
        {files.map((name) => <span className="fr-file-chip" key={name}><FileText size={15} />{name}</span>)}
      </span>
    );
  }
  if (Array.isArray(value) && definition?.repeatableFields?.length && value.every((entry) => typeof entry === "object" && entry !== null)) {
    if (!value.length) return <span className="fr-empty-answer">Chưa có nội dung kê khai.</span>;
    return (
      <span className="fr-repeat-list">
        {value.map((entry, index) => {
          const row = entry as Record<string, unknown>;
          return (
            <span className="fr-repeat-entry" key={String(row.id ?? index)}>
              <span className="fr-repeat-label">Dòng kê khai {index + 1}</span>
              <dl>
                {definition.repeatableFields?.map((field) => (
                  <div key={field.key}>
                    <dt>{field.label}</dt>
                    <dd>{fieldValue(row, field.key, field)}</dd>
                  </div>
                ))}
              </dl>
            </span>
          );
        })}
      </span>
    );
  }
  if (Array.isArray(value)) {
    const content = value.map((entry) => typeof entry === "object" && entry !== null
      ? Object.entries(entry as Record<string, unknown>).map(([key, item]) => `${key}: ${formatScalar(item)}`).join(" · ")
      : String(entry)).join(", ");
    return <span className={content ? "" : "fr-empty-answer"}>{content || "—"}</span>;
  }
  if (typeof value === "object" && value !== null) {
    return <span>{Object.entries(value as Record<string, unknown>).map(([key, item]) => `${key}: ${formatScalar(item)}`).join(" · ")}</span>;
  }
  const formatted = formatScalar(value);
  return <span className={formatted === "—" ? "fr-empty-answer" : ""}>{formatted}</span>;
}

export const visibleCriteriaFor = (app: Application) =>
  app.criteriaSnapshot
    .filter((item) => item.active && isRegistrationCriteriaVisible(item, app.data as Record<string, unknown>, app.type))
    .sort((a, b) => a.order - b.order);

export const sortedGroupsFor = (app: Application) =>
  app.criteriaGroups.slice().sort((a, b) => a.order - b.order);
