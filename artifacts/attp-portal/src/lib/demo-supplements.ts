import {
  applications,
  saveApplicationRecord,
  type Application,
  type Attachment,
} from "@/lib/mock-data";

const storageKey = "attp-demo-supplement-requests";
const linkLifetimeMs = 48 * 60 * 60 * 1000;

export type DemoSupplementStatus = "open" | "submitted" | "expired";

export type DemoSupplementRequest = {
  token: string;
  applicationId: string;
  applicantName: string;
  recipientEmail: string;
  reason: string;
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
}: {
  applicationId: string;
  applicantName: string;
  recipientEmail: string;
  reason: string;
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
  response,
  attachments,
}: {
  token: string;
  response: string;
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

  const updatedApplication: Application = {
    ...application,
    data: {
      ...application.data,
      supplementResponse: response.trim(),
    },
    attachments: [...application.attachments, ...attachments],
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
    response: response.trim(),
    attachments,
  };
  requests[requestIndex] = submittedRequest;
  writeRequests(requests);
  return submittedRequest;
};
