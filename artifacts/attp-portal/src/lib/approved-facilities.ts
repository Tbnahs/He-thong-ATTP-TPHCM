import {
  applications,
  saveApplicationRecord,
  type Application,
  type ApplicationType,
} from "@/lib/mock-data";

export const approvedFacilitiesStorageKey = "attp-approved-facilities-v2";

export type ApprovedFacility = {
  application: Application;
  approvedAt: string;
  reviewer: string;
};

const profileTypes: ApplicationType[] = ["food-supplier", "meal-provider", "school"];
const retiredDemoProfileIds = new Set([
  "app-001",
  "app-003",
  "app-004",
  "app-005",
  "app-006",
]);

const clone = <T,>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

export const createApprovedFacility = (
  application: Application,
  reviewer = application.reviewer?.name ?? "Chưa cập nhật",
): ApprovedFacility => ({
  application: clone(application),
  approvedAt: application.reviewer?.reviewedAt ?? "",
  reviewer,
});

const isProfileApplication = (application: Application) =>
  application.status === "approved" &&
  profileTypes.includes(application.type) &&
  !retiredDemoProfileIds.has(application.id);

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
        ? {
            ...previous,
            application: {
              ...clone(item),
              // The profile uses the approved snapshot for its evidence list.
              // Preserve edits made there instead of restoring the queue copy.
              attachments: clone(
                previous.application.attachments ?? item.attachments,
              ),
            },
            approvedAt: item.reviewer?.reviewedAt ?? "",
          }
        : createApprovedFacility(item);
    });
  const approvedIds = new Set(approvedFromQueue.map((entry) => entry.application.id));
  const currentApplications = new Map(
    applications.map((application) => [application.id, application]),
  );
  const merged = [
    ...approvedFromQueue,
    ...saved
      .map((entry) => ({
        ...entry,
        approvedAt: entry.application.reviewer?.reviewedAt ?? "",
      }))
      .filter(
        (entry) => {
          const currentApplication = currentApplications.get(
            entry.application.id,
          );
          return (
            profileTypes.includes(entry.application.type) &&
            entry.application.status === "approved" &&
            !approvedIds.has(entry.application.id) &&
            (!currentApplication || isProfileApplication(currentApplication))
          );
        },
      ),
  ];

  window.localStorage.setItem(approvedFacilitiesStorageKey, JSON.stringify(merged));
  return merged;
};

export const syncApprovedFacility = (
  application: Application,
  reviewer = application.reviewer?.name ?? "Chưa cập nhật",
) => {
  if (typeof window === "undefined" || !isProfileApplication(application)) return;
  const saved = readApprovedFacilities().filter(
    (entry) => entry.application.id !== application.id,
  );
  window.localStorage.setItem(
    approvedFacilitiesStorageKey,
    JSON.stringify([createApprovedFacility(application, reviewer), ...saved]),
  );
};

export const removeApprovedFacilityAttachment = (
  applicationId: string,
  attachmentIndex: number,
) => {
  if (typeof window === "undefined") return null;

  const approved = readApprovedFacilities();
  const facilityIndex = approved.findIndex(
    (entry) => entry.application.id === applicationId,
  );
  const facility = approved[facilityIndex];
  const existingAttachments = facility?.application.attachments ?? [];
  const removedAttachment = existingAttachments[attachmentIndex];
  if (!facility || !removedAttachment) return null;

  const attachments = existingAttachments.filter(
    (_, index) => index !== attachmentIndex,
  );
  const updatedApproved = approved.map((entry, index) =>
    index === facilityIndex
      ? {
          ...entry,
          application: { ...entry.application, attachments: clone(attachments) },
        }
      : entry,
  );
  const application = applications.find((item) => item.id === applicationId);
  const previousAttachments = application?.attachments;

  try {
    window.localStorage.setItem(
      approvedFacilitiesStorageKey,
      JSON.stringify(updatedApproved),
    );
    if (application) {
      application.attachments = clone(attachments);
      saveApplicationRecord(application);
    }
  } catch (error) {
    if (application && previousAttachments) {
      application.attachments = previousAttachments;
    }
    try {
      window.localStorage.setItem(
        approvedFacilitiesStorageKey,
        JSON.stringify(approved),
      );
    } catch {
      // Keep the original persistence error for the caller to report.
    }
    throw error;
  }

  return {
    removedAttachment: clone(removedAttachment),
    attachments: clone(attachments),
  };
};