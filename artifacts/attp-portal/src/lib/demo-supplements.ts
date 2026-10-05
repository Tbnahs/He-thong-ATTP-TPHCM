import {
  applications,
  saveApplicationRecord,
  type Application,
  type Attachment,
} from "@/lib/mock-data";

const storageKey = "attp-demo-supplement-requests";
const linkLifetimeMs = 48 * 60 * 60 * 1000;

export type DemoSupplementStatus = "open" | "submitted" | "expired";

export type DemoSupplementReviewer = {
  name: string;
  position: string;
  phone: string;
  email: string;
};

export type DemoSupplementRequest = {
  token: string;
  applicationId: string;
  applicantName: string;
  recipientEmail: string;
  reason: string;
  reviewer?: DemoSupplementReviewer;
  createdAt: string;
  expiresAt: string;
  status: DemoSupplementStatus;
  submittedAt?: string;
  response?: string;
  attachments: Attachment[];
};

const readRequests = (): DemoSupplementRequest[] => {
  if (typeof window === "undefined") return [];
  try {
    const saved = JSON.parse(window.localStorage.getItem(storageKey) || "[]");
    return Array.isArray(saved) ? (saved as DemoSupplementRequest[]) : [];
  } catch {
    return [];
  }
};

const writeRequests = (requests: DemoSupplementRequest[]) => {
  if (typeof window === "undefined") {
    throw new Error("Bản demo chỉ hoạt động trong trình duyệt.");
  }
  window.localStorage.setItem(storageKey, JSON.stringify(requests));
};

const withCurrentExpiry = (
  request: DemoSupplementRequest,
): DemoSupplementRequest => {
  if (
    request.status === "open" &&
    new Date(request.expiresAt).getTime() <= Date.now()
  ) {
    return { ...request, status: "expired" };
  }
  return request;
};

export const getDemoSupplementByToken = (token: string) =>
  readRequests()
    .map(withCurrentExpiry)
    .find((request) => request.token === token);

export const getLatestDemoSupplementForApplication = (applicationId: string) =>
  readRequests()
    .map(withCurrentExpiry)
    .filter((request) => request.applicationId === applicationId)
    .sort((left, right) => right.createdAt.localeCompare(left.createdAt))[0];

export const createDemoSupplementRequest = ({
  applicationId,
  applicantName,
  recipientEmail,
  reason,
  reviewer,
}: {
  applicationId: string;
  applicantName: string;
  recipientEmail: string;
  reason: string;
  reviewer: DemoSupplementReviewer;
}) => {
  if (typeof window === "undefined" || !window.crypto?.randomUUID) {
    throw new Error("Trình duyệt hiện tại không hỗ trợ tạo liên kết demo.");
  }

  const now = Date.now();
  const requests = readRequests().map((request) =>
    request.applicationId === applicationId && request.status === "open"
      ? { ...request, status: "expired" as const }
      : request,
  );
  const request: DemoSupplementRequest = {
    token: window.crypto.randomUUID(),
    applicationId,
    applicantName,
    recipientEmail,
    reason,
    reviewer,
    createdAt: new Date(now).toISOString(),
    expiresAt: new Date(now + linkLifetimeMs).toISOString(),
    status: "open",
    attachments: [],
  };

  writeRequests([request, ...requests].slice(0, 100));
  return request;
};

export const submitDemoSupplement = ({
  token,
  updatedData,
  applicationAttachments,
  attachments,
}: {
  token: string;
  updatedData: Record<string, unknown>;
  applicationAttachments: Attachment[];
  attachments: Attachment[];
}) => {
  const requests = readRequests();
  const requestIndex = requests.findIndex((item) => item.token === token);
  const request = requestIndex >= 0 ? withCurrentExpiry(requests[requestIndex]) : undefined;

  if (!request) throw new Error("Không tìm thấy liên kết bổ sung hồ sơ.");
  if (request.status === "expired") {
    throw new Error("Liên kết bổ sung đã hết hạn. Vui lòng liên hệ cán bộ tiếp nhận.");
  }
  if (request.status === "submitted") {
    throw new Error("Hồ sơ bổ sung qua liên kết này đã được gửi.");
  }

  const application = applications.find(
    (item) => item.id === request.applicationId,
  );
  if (!application) throw new Error("Không tìm thấy hồ sơ đăng ký trong bản demo.");

  const textValue = (...keys: string[]) => {
    for (const key of keys) {
      const value = updatedData[key];
      if (typeof value === "string" && value.trim()) return value.trim();
      if (Array.isArray(value)) {
        const first = value.find(
          (entry): entry is string => typeof entry === "string" && Boolean(entry.trim()),
        );
        if (first) return first.trim();
      }
    }
    return "";
  };
  const schoolContactRows = Array.isArray(updatedData.foodSafetyContacts)
    ? updatedData.foodSafetyContacts
    : [];
  const firstSchoolContact =
    typeof schoolContactRows[0] === "object" && schoolContactRows[0] !== null
      ? (schoolContactRows[0] as Record<string, unknown>)
      : {};
  const applicantName =
    textValue("applicantName", "facilityName", "legalName") ||
    application.applicantName;
  const address =
    (application.type === "school"
      ? textValue("addressMain", "addressDetail")
      : textValue("facilityAddress", "headquartersAddress", "addressDetail")) ||
    application.address;
  const contact =
    (application.type === "meal-provider"
      ? textValue("foodSafetyContactPhone", "contact")
      : (typeof firstSchoolContact.phone === "string"
          ? firstSchoolContact.phone.trim()
          : "") || textValue("contact")) || application.contact;
  const updatedApplication: Application = {
    ...application,
    applicantName,
    address,
    contact,
    data: updatedData,
    attachments: applicationAttachments,
    status: "pending",
    reviewNote: null,
    reviewer: undefined,
    published: false,
  };
  saveApplicationRecord(updatedApplication);

  const submittedRequest: DemoSupplementRequest = {
    ...request,
    status: "submitted",
    submittedAt: new Date().toISOString(),
    attachments,
  };
  requests[requestIndex] = submittedRequest;
  writeRequests(requests);
  return submittedRequest;
};
