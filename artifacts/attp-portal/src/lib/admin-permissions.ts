export type AdminAccountRole = "director" | "specialist" | "ward";

export const adminNavigationSections = [
  {
    title: "Thanh tra, kiểm tra",
    items: [
      {
        href: "/admin/inspections/schedule",
        label: "Lịch kiểm tra",
        permissionId: "schedule",
      },
      {
        href: "/admin/inspections/minutes",
        label: "Biên bản kiểm tra",
        permissionId: "minutes",
      },
      {
        href: "/admin/inspections/criteria",
        label: "Cấu hình tiêu chí đánh giá",
        permissionId: "criteria",
      },
      {
        href: "/admin/inspections/incidents",
        label: "Quản lý và xử lý sự cố ATTP",
        permissionId: "incidents",
      },
    ],
  },
  {
    title: "Tổng quan",
    items: [
      {
        href: "/admin",
        label: "Dashboard giám sát",
        permissionId: "dashboard",
      },
      {
        href: "/admin/facilities",
        label: "Duyệt cơ sở",
        permissionId: "facilities",
      },
      {
        href: "/admin/facility-profiles",
        label: "Hồ sơ cơ sở",
        permissionId: "facilityProfiles",
      },
    ],
  },
  {
    title: "Quản lý bữa ăn",
    items: [
      {
        href: "/admin/meals/three-step",
        label: "Kiểm thực 3 bước",
        permissionId: "threeStep",
      },
      {
        href: "/admin/meals/menus",
        label: "Thực đơn và suất ăn",
        permissionId: "menus",
      },
      {
        href: "/admin/meals/recipes",
        label: "Món ăn và quy trình chế biến",
        permissionId: "recipes",
      },
    ],
  },
  {
    title: "Hệ thống",
    items: [
      {
        href: "/admin/accounts",
        label: "Quản lý tài khoản",
        permissionId: "accounts",
      },
      {
        href: "/admin/reports",
        label: "Báo cáo thống kê",
        permissionId: "reports",
      },
    ],
  },
] as const;

type AdminNavigationItem =
  (typeof adminNavigationSections)[number]["items"][number];

const allAdminNavigationItems = adminNavigationSections.reduce<
  AdminNavigationItem[]
>((items, section) => {
  items.push(...(section.items as readonly AdminNavigationItem[]));
  return items;
}, []);

export type AdminMenuPermissionId = AdminNavigationItem["permissionId"];
export type AdminMenuPermissions = Record<AdminMenuPermissionId, boolean>;

export const adminPermissionIds = allAdminNavigationItems.map(
  (item) => item.permissionId,
);

export const ADMIN_SESSION_PERMISSIONS_KEY = "attp-admin-menu-permissions";

function makePermissionSet(
  selected: readonly AdminMenuPermissionId[],
): AdminMenuPermissions {
  return Object.fromEntries(
    adminPermissionIds.map((permissionId) => [
      permissionId,
      selected.includes(permissionId),
    ]),
  ) as AdminMenuPermissions;
}

export function createDefaultAdminPermissions(
  role: AdminAccountRole,
): AdminMenuPermissions {
  if (role === "director") {
    return makePermissionSet(adminPermissionIds);
  }

  if (role === "specialist") {
    return makePermissionSet(
      adminPermissionIds.filter((permissionId) => permissionId !== "accounts"),
    );
  }

  return makePermissionSet(["dashboard", "facilityProfiles", "reports"]);
}

export function normalizeAdminPermissions(
  value: unknown,
  role: AdminAccountRole,
): AdminMenuPermissions {
  const defaults = createDefaultAdminPermissions(role);
  const source =
    value && typeof value === "object"
      ? (value as Record<string, unknown>)
      : {};

  if (
    adminPermissionIds.some(
      (permissionId) => typeof source[permissionId] === "boolean",
    )
  ) {
    return Object.fromEntries(
      adminPermissionIds.map((permissionId) => [
        permissionId,
        typeof source[permissionId] === "boolean"
          ? source[permissionId]
          : defaults[permissionId],
      ]),
    ) as AdminMenuPermissions;
  }

  const legacyKeys = [
    "fullAdmin",
    "evaluation",
    "schedule",
    "mealProviders",
    "schools",
    "reports",
  ];
  if (!legacyKeys.some((key) => typeof source[key] === "boolean")) {
    return defaults;
  }

  const legacy = source as Record<string, boolean | undefined>;
  if (legacy.fullAdmin) {
    return makePermissionSet(adminPermissionIds);
  }

  const facilityLookup = Boolean(legacy.mealProviders || legacy.schools);
  return {
    ...defaults,
    dashboard: true,
    facilities: Boolean(legacy.evaluation),
    facilityProfiles: facilityLookup,
    threeStep: Boolean(legacy.schools),
    menus: Boolean(legacy.mealProviders),
    recipes: Boolean(legacy.mealProviders),
    accounts: false,
    reports: Boolean(legacy.reports),
    schedule: Boolean(legacy.schedule),
    minutes: Boolean(legacy.evaluation),
    criteria: false,
    incidents: Boolean(legacy.evaluation),
  };
}

export function getSessionAdminPermissions(): AdminMenuPermissions {
  if (typeof window === "undefined") {
    return createDefaultAdminPermissions("director");
  }

  try {
    const stored = sessionStorage.getItem(ADMIN_SESSION_PERMISSIONS_KEY);
    return stored
      ? normalizeAdminPermissions(JSON.parse(stored), "director")
      : createDefaultAdminPermissions("director");
  } catch {
    return createDefaultAdminPermissions("director");
  }
}

export function findManagedAdminAccount(username: string) {
  if (typeof window === "undefined") return null;

  try {
    const raw = localStorage.getItem("attp-admin-accounts");
    const accounts: unknown = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(accounts)) return null;

    const normalizedUsername = username.trim().toLowerCase();
    const account = accounts.find(
      (item): item is Record<string, unknown> =>
        Boolean(item) &&
        typeof item === "object" &&
        String((item as Record<string, unknown>).username ?? "")
          .trim()
          .toLowerCase() === normalizedUsername,
    );
    if (!account) return null;

    const role: AdminAccountRole =
      account.role === "director" ||
      account.role === "specialist" ||
      account.role === "ward"
        ? account.role
        : "ward";

    return {
      role,
      status: String(account.status ?? ""),
      displayName: String(account.responsibleName || account.organization || ""),
      permissions: normalizeAdminPermissions(account.permissions, role),
    };
  } catch {
    return null;
  }
}

export function getAdminPermissionForPath(
  path: string,
): AdminMenuPermissionId | null {
  if (path.startsWith("/admin/applications/")) return "facilities";

  const item = allAdminNavigationItems
    .slice()
    .sort((left, right) => right.href.length - left.href.length)
    .find(
      ({ href }) => path === href || path.startsWith(`${href}/`),
    );

  return item?.permissionId ?? null;
}

export function canAccessAdminPath(
  path: string,
  permissions: AdminMenuPermissions,
): boolean {
  const permissionId = getAdminPermissionForPath(path);
  return permissionId ? permissions[permissionId] : false;
}

export function getFirstAllowedAdminPath(
  permissions: AdminMenuPermissions,
): string {
  if (permissions.dashboard) return "/admin";

  for (const section of adminNavigationSections) {
    const firstAllowed = section.items.find(
      (item) => permissions[item.permissionId],
    );
    if (firstAllowed) return firstAllowed.href;
  }

  return "/admin/login";
}