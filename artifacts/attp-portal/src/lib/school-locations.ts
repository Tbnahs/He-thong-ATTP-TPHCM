export type SchoolLocation = {
  id: string;
  name: string;
  address: string;
};

const asRecord = (value: unknown): Record<string, unknown> | null =>
  typeof value === "object" && value !== null && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;

const text = (value: unknown) =>
  typeof value === "string" || typeof value === "number"
    ? String(value).trim()
    : "";

export const getSchoolLocationsFromFields = (
  fields: Record<string, unknown>,
): SchoolLocation[] => {
  const saved = Array.isArray(fields.schoolLocations)
    ? fields.schoolLocations.map(asRecord).filter((row): row is Record<string, unknown> => Boolean(row))
    : [];
  let locations = saved.map((row, index) => ({
    id: text(row.id) || `school-location-${index + 1}`,
    name: text(row.name) || (row.kind === "main" ? "Điểm chính" : `Điểm trường ${index + 1}`),
    address: [
      text(row.addressDetail ?? row.address),
      text(row.wardName),
      text(row.provinceName),
    ].filter(Boolean).join(", "),
  }));

  if (locations.length === 0) {
    const branches = text(fields.addressBranches)
      .split(/[\r\n;]+/)
      .map((address) => address.trim())
      .filter(Boolean);
    if (branches.length > 0) {
      locations = [
        {
          id: "school-main",
          name: text(fields.applicantName) || "Điểm chính",
          address: text(fields.addressMain ?? fields.addressDetail),
        },
        ...branches.map((address, index) => ({
          id: `school-branch-${index + 1}`,
          name: `Điểm trường ${index + 2}`,
          address,
        })),
      ];
    }
  }

  const seen = new Set<string>();
  return locations.filter((location) => {
    const key = `${location.name.toLocaleLowerCase("vi")}|${location.address.toLocaleLowerCase("vi")}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return Boolean(location.name || location.address);
  });
};

export const getSchoolLocations = (facilityName: string): SchoolLocation[] => {
  if (typeof window === "undefined" || !facilityName) return [];
  try {
    const accounts = JSON.parse(
      window.localStorage.getItem("attp-facility-accounts") || "[]",
    ) as Array<{ registration?: { type?: string; fields?: Record<string, unknown> } }>;
    const account = accounts.find(
      (item) =>
        item.registration?.type === "school" &&
        text(item.registration.fields?.applicantName) === facilityName,
    );
    if (account?.registration?.fields) {
      const locations = getSchoolLocationsFromFields(account.registration.fields);
      if (locations.length > 0) return locations;
    }

    const approved = JSON.parse(
      window.localStorage.getItem("attp-approved-facilities-v2") || "[]",
    ) as Array<{ application?: { type?: string; applicantName?: string; data?: Record<string, unknown> } }>;
    const facility = approved.find(
      (item) =>
        item.application?.type === "school" &&
        text(item.application.applicantName) === facilityName,
    );
    return facility?.application?.data
      ? getSchoolLocationsFromFields(facility.application.data)
      : [];
  } catch {
    return [];
  }
};
