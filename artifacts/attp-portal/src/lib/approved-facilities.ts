import { applications, type Application, type ApplicationType } from "@/lib/mock-data";

export const approvedFacilitiesStorageKey = "attp-approved-facilities-v2";

export type ApprovedFacility = {
  application: Application;
  approvedAt: string;
  reviewer: string;
};

const profileTypes: ApplicationType[] = ["food-supplier", "meal-provider", "school"];

const formatApprovalDate = (submittedAt: string) => {
  const date = new Date(submittedAt);
  if (Number.isNaN(date.getTime())) return new Date().toISOString().slice(0, 10);
  return new Date(date.getTime() + 10 * 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10);
};

const clone = <T,>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

export const createApprovedFacility = (
  application: Application,
  reviewer = "Nguyễn Minh Anh",
): ApprovedFacility => ({
  application: clone(application),
  approvedAt: formatApprovalDate(application.submittedAt),
  reviewer,
});

const isProfileApplication = (application: Application) =>
  application.status === "approved" && profileTypes.includes(application.type);

export const readApprovedFacilities = (): ApprovedFacility[] => {
  if (typeof window === "undefined") {
    return applications.filter(isProfileApplication).map((item) => createApprovedFacility(item));
  }

  let saved: ApprovedFacility[] = [];
  try {
    saved = JSON.parse(
      window.localStorage.getItem(approvedFacilitiesStorageKey) || "[]",
    ) as ApprovedFacility[];
  } catch {
    saved = [];
  }

  const approvedFromQueue = applications
    .filter(isProfileApplication)
    .map((item) => {
      const previous = saved.find((entry) => entry.application.id === item.id);
      return previous
        ? { ...previous, application: clone(item) }
        : createApprovedFacility(item);
    });
  const approvedIds = new Set(approvedFromQueue.map((entry) => entry.application.id));
  const merged = [
    ...approvedFromQueue,
    ...saved.filter(
      (entry) =>
        profileTypes.includes(entry.application.type) &&
        entry.application.status === "approved" &&
        !approvedIds.has(entry.application.id),
    ),
  ];

  window.localStorage.setItem(approvedFacilitiesStorageKey, JSON.stringify(merged));
  return merged;
};

export const syncApprovedFacility = (
  application: Application,
  reviewer = "Nguyễn Minh Anh",
) => {
  if (typeof window === "undefined" || !isProfileApplication(application)) return;
  const saved = readApprovedFacilities().filter(
    (entry) => entry.application.id !== application.id,
  );
  window.localStorage.setItem(
    approvedFacilitiesStorageKey,
    JSON.stringify([createApprovedFacility(application, reviewer), ...saved].slice(0, 5)),
  );
};