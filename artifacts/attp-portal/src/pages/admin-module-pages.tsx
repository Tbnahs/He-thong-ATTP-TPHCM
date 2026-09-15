import { useMemo, useState } from "react";
import {
  ArrowUpRight,
  BarChart3,
  Building2,
  CalendarDays,
  CalendarRange,
  ChefHat,
  CheckCircle2,
  Clock3,
  ChevronDown,
  ChevronRight,
  CircleDollarSign,
  ClipboardCheck,
  Download,
  Flame,
  FileText,
  MapPin,
  PieChart,
  Search,
  SlidersHorizontal,
  TriangleAlert,
  Utensils,
  X,
} from "lucide-react";
import { Link } from "wouter";
import {
  AdminShell,
  EmptyState,
  MetricCard,
  SectionHeading,
  StatusPill,
} from "@/components/portal-ui";

type FacilityCategory =
  | "Trường học có bếp ăn bán trú"
  | "Cơ sở cung cấp thực phẩm"
  | "Cơ sở cung cấp suất ăn";

type Facility = {
  id: string;
  name: string;
  category: FacilityCategory;
  address: string;
  contact: string;
  status: "approved" | "warning" | "stopped";
  meals: string;
};

const facilities: Facility[] = [
  {
    id: "facility-001",
    name: "Trường Tiểu học Lê Lợi",
    category: "Trường học có bếp ăn bán trú",
    address: "85 Lê Lợi, phường Bến Nghé",
    contact: "028 3822 4567",
    status: "approved",
    meals: "320 suất/ngày",
  },
  {
    id: "facility-002",
    name: "Trường Mầm non Hoa Sen",
    category: "Trường học có bếp ăn bán trú",
    address: "35 Nguyễn Du, phường Sài Gòn",
    contact: "028 3822 1122",
    status: "warning",
    meals: "180 suất/ngày",
  },
  {
    id: "facility-003",
    name: "Công ty TNHH Nông sản An Phú",
    category: "Cơ sở cung cấp thực phẩm",
    address: "184 Nguyễn Văn Linh, Quận 7",
    contact: "0908 123 456",
    status: "approved",
    meals: "—",
  },
  {
    id: "facility-004",
    name: "Hợp tác xã Rau sạch Củ Chi",
    category: "Cơ sở cung cấp thực phẩm",
    address: "Đường Tỉnh lộ 8, Củ Chi",
    contact: "0903 456 789",
    status: "approved",
    meals: "—",
  },
  {
    id: "facility-005",
    name: "Công ty Suất ăn Minh Tâm",
    category: "Cơ sở cung cấp suất ăn",
    address: "Khu công nghiệp Tân Bình",
    contact: "028 3812 8899",
    status: "approved",
    meals: "1.200 suất/ngày",
  },
  {
    id: "facility-006",
    name: "Bếp ăn tập thể An Phú",
    category: "Cơ sở cung cấp suất ăn",
    address: "12 Nguyễn Hữu Thọ, Quận 7",
    contact: "0912 555 888",
    status: "stopped",
    meals: "650 suất/ngày",
  },
];

const categoryOptions: Array<"Tất cả" | FacilityCategory> = [
  "Tất cả",
  "Trường học có bếp ăn bán trú",
  "Cơ sở cung cấp thực phẩm",
  "Cơ sở cung cấp suất ăn",
];

const mealData = {
  "three-step": {
    eyebrow: "Quản lý bữa ăn",
    title: "Kiểm thực 3 bước",
    description:
      "Theo dõi việc kiểm tra nguyên liệu đầu vào, quá trình chế biến và lưu mẫu thức ăn tại các cơ sở.",
    icon: ClipboardCheck,
    columns: [
      "Cơ sở",
      "Ngày kiểm",
      "Người thực hiện",
      "Bước 1",
      "Bước 2",
      "Bước 3",
    ],
    rows: [
      [
        "Trường Tiểu học Lê Lợi",
        "10/09/2026",
        "Nguyễn Thị Lan",
        "Đạt",
        "Đạt",
        "Đạt",
      ],
      [
        "Trường Mầm non Hoa Sen",
        "10/09/2026",
        "Trần Minh Hoàng",
        "Đạt",
        "Đạt",
        "Thiếu mẫu",
      ],
      [
        "Bếp ăn tập thể An Phú",
        "09/09/2026",
        "Lê Thị Hạnh",
        "Không đạt",
        "Đạt",
        "Không đạt",
      ],
    ],
  },
  menus: {
    eyebrow: "Quản lý bữa ăn",
    title: "Thực đơn và suất ăn",
    description:
      "Quản lý thực đơn theo tuần, số lượng suất ăn và tình trạng phê duyệt của từng cơ sở.",
    icon: Utensils,
    columns: [
      "Cơ sở",
      "Tuần áp dụng",
      "Số suất/ngày",
      "Thực đơn",
      "Trạng thái",
    ],
    rows: [
      [
        "Trường Tiểu học Lê Lợi",
        "Tuần 37 · 08–12/09",
        "320",
        "Cơm + món mặn + canh",
        "Đã duyệt",
      ],
      [
        "Trường Mầm non Hoa Sen",
        "Tuần 37 · 08–12/09",
        "180",
        "Cháo / cơm theo lứa tuổi",
        "Chờ duyệt",
      ],
      [
        "Công ty Suất ăn Minh Tâm",
        "Tuần 37 · 08–12/09",
        "1.200",
        "Suất ăn công nghiệp",
        "Đã duyệt",
      ],
    ],
  },
  recipes: {
    eyebrow: "Quản lý bữa ăn",
    title: "Món ăn và quy trình chế biến",
    description:
      "Danh mục món ăn, định lượng nguyên liệu và quy trình chế biến đang áp dụng tại các bếp ăn.",
    icon: FileText,
    columns: ["Tên món ăn", "Nhóm món", "Định lượng", "Quy trình", "Cập nhật"],
    rows: [
      ["Thịt kho trứng", "Món mặn", "120g/suất", "Đã ban hành", "05/09/2026"],
      [
        "Canh rau củ thịt bằm",
        "Món canh",
        "180ml/suất",
        "Đã ban hành",
        "05/09/2026",
      ],
      ["Cá basa sốt cà", "Món mặn", "100g/suất", "Đang rà soát", "02/09/2026"],
      [
        "Cháo gà rau củ",
        "Món cho trẻ",
        "250ml/suất",
        "Đã ban hành",
        "01/09/2026",
      ],
    ],
  },
} as const;

type RecipeRecord = {
  id: string;
  name: string;
  code: string;
  school: string;
  ward: string;
  type: "Lỏng" | "Mặn" | "Món cho trẻ";
  ingredients: string[];
  steps: string[];
  updatedAt: string;
  accent: "green" | "orange" | "purple";
};

const recipeRecords: RecipeRecord[] = [
  {
    id: "recipe-canh-chua-ca-basa",
    name: "Canh chua cá basa",
    code: "MA-00452",
    school: "iSchool Nam Sài Gòn",
    ward: "Phường Bến Nghé",
    type: "Lỏng",
    ingredients: ["Cá basa", "Cà chua", "Thơm", "Rau muống"],
    steps: [
      "Sơ chế cá, rau, cà chua, thơm",
      "Phi thơm, nấu nước dùng 15 phút",
      "Cho cá vào nấu chín, nêm gia vị",
      "Thêm rau muống, tắt bếp.",
    ],
    updatedAt: "05/09/2026",
    accent: "green",
  },
  {
    id: "recipe-thit-kho-trung",
    name: "Thịt kho trứng",
    code: "MA-00218",
    school: "Trường Tiểu học Lê Lợi",
    ward: "Phường Bến Nghé",
    type: "Mặn",
    ingredients: ["Thịt heo", "Trứng vịt", "Nước màu", "Hành tím"],
    steps: [
      "Sơ chế thịt, luộc trứng và bóc vỏ",
      "Ướp thịt với gia vị trong 20 phút",
      "Kho thịt với nước dừa đến mềm",
      "Cho trứng vào, đun nhỏ lửa.",
    ],
    updatedAt: "05/09/2026",
    accent: "orange",
  },
  {
    id: "recipe-chao-ga-rau-cu",
    name: "Cháo gà rau củ",
    code: "MA-00510",
    school: "Trường Mầm non Hoa Sen",
    ward: "Phường Sài Gòn",
    type: "Món cho trẻ",
    ingredients: ["Gạo tẻ", "Thịt gà", "Cà rốt", "Bí xanh"],
    steps: [
      "Vo gạo, sơ chế thịt gà và rau củ",
      "Nấu gạo với nước dùng đến nhừ",
      "Cho thịt gà và rau củ vào nấu chín",
      "Nêm nhạt, kiểm tra trước khi chia suất.",
    ],
    updatedAt: "01/09/2026",
    accent: "purple",
  },
];

function categoryShortName(category: FacilityCategory) {
  return category === "Trường học có bếp ăn bán trú"
    ? "Trường học"
    : category === "Cơ sở cung cấp thực phẩm"
      ? "Cung cấp thực phẩm"
      : "Cung cấp suất ăn";
}

export function AdminMonitoringDashboard() {
  type MonitoringStatus = "Đạt" | "Cảnh báo" | "Chưa đạt";
  type SchoolLevel = "Mầm non" | "Cấp 1" | "Cấp 2" | "Cấp 3";
  type MealOrganization = "Tự tổ chức nấu ăn" | "Sử dụng suất ăn từ bên ngoài";
  type SchoolSupplier = {
    name: string;
    address: string;
    taxCode: string;
    capacity: number;
  };
  type SupplierRecord = {
    name: string;
    ward: string;
    address: string;
    status: MonitoringStatus;
    capacity: number;
    serving: number;
    schools: number;
    updated: string;
  };
  type FoodSupplierRecord = {
    name: string;
    ward: string;
    address: string;
    category: string;
    status: MonitoringStatus;
    capacity: number;
    buyers: number;
    updated: string;
  };
  type SchoolRecord = {
    name: string;
    level: SchoolLevel;
    mealOrganization: MealOrganization;
    ward: string;
    students: number;
    demand: number;
    supply: number;
    suppliers: SchoolSupplier[];
    status: MonitoringStatus;
    updated: string;
  };
  type Summary = {
    suppliers: number;
    supplierCapacity: number;
    supplierDemand: number;
    schools: number;
    students: number;
    schoolDemand: number;
    status: Record<MonitoringStatus, number>;
  };

  const [activeTab, setActiveTab] = useState<
    "suppliers" | "schools" | "food"
  >("suppliers");
  const [area, setArea] = useState("Quận 1");
  const [district, setDistrict] = useState("Quận 1");
  const [ward, setWard] = useState("Tất cả phường/xã");
  const [schoolLevel, setSchoolLevel] = useState<
    "Tất cả cấp học" | SchoolLevel
  >("Tất cả cấp học");
  const [mealOrganization, setMealOrganization] = useState<
    "Tất cả" | MealOrganization
  >("Tất cả");
  const [status, setStatus] = useState<"Tất cả trạng thái" | MonitoringStatus>(
    "Tất cả trạng thái",
  );
  const [search, setSearch] = useState("");
  const [selectedSupplier, setSelectedSupplier] =
    useState<SupplierRecord | null>(null);
  const [selectedSchool, setSelectedSchool] = useState<SchoolRecord | null>(
    null,
  );

  const supplierRows: SupplierRecord[] = [
    {
      name: "Công ty TNHH ABC",
      ward: "Bến Nghé",
      address: "18 Nguyễn Huệ, P. Bến Nghé",
      status: "Đạt",
      capacity: 3000,
      serving: 2650,
      schools: 5,
      updated: "08/09/2026",
    },
    {
      name: "Công ty Suất ăn Minh Tâm",
      ward: "Đa Kao",
      address: "52 Điện Biên Phủ, P. Đa Kao",
      status: "Đạt",
      capacity: 2500,
      serving: 2200,
      schools: 4,
      updated: "08/09/2026",
    },
    {
      name: "Bếp ăn tập thể Cầu Ông Lãnh",
      ward: "Cầu Ông Lãnh",
      address: "116 Nguyễn Thái Học, P. Cầu Ông Lãnh",
      status: "Cảnh báo",
      capacity: 1500,
      serving: 1460,
      schools: 3,
      updated: "07/09/2026",
    },
    {
      name: "Cơ sở Suất ăn Nguyễn Cư Trinh",
      ward: "Nguyễn Cư Trinh",
      address: "24 Trần Hưng Đạo, P. Nguyễn Cư Trinh",
      status: "Chưa đạt",
      capacity: 2000,
      serving: 1860,
      schools: 2,
      updated: "06/09/2026",
    },
  ];
  const foodSupplierRows: FoodSupplierRecord[] = [
    {
      name: "Công ty TNHH Nông sản An Phú",
      ward: "Bến Nghé",
      address: "184 Nguyễn Văn Linh, P. Bến Nghé",
      category: "Rau củ quả",
      status: "Đạt",
      capacity: 5200,
      buyers: 14,
      updated: "08/09/2026",
    },
    {
      name: "Công ty Thực phẩm Tân Hưng",
      ward: "Tân Hưng",
      address: "42 Nguyễn Hữu Thọ, P. Tân Hưng",
      category: "Thịt, cá và trứng",
      status: "Cảnh báo",
      capacity: 3600,
      buyers: 9,
      updated: "07/09/2026",
    },
    {
      name: "Hợp tác xã Rau sạch Củ Chi",
      ward: "Củ Chi",
      address: "Đường Tỉnh lộ 8, xã Tân An Hội",
      category: "Rau củ quả",
      status: "Đạt",
      capacity: 6800,
      buyers: 18,
      updated: "07/09/2026",
    },
    {
      name: "Công ty TNHH Thực phẩm Bình Minh",
      ward: "Đa Kao",
      address: "66 Phan Kế Bính, P. Đa Kao",
      category: "Thực phẩm khô",
      status: "Đạt",
      capacity: 2900,
      buyers: 7,
      updated: "06/09/2026",
    },
    {
      name: "Cơ sở Hải sản Tươi Sài Gòn",
      ward: "Cầu Ông Lãnh",
      address: "128 Đề Thám, P. Cầu Ông Lãnh",
      category: "Hải sản",
      status: "Chưa đạt",
      capacity: 2100,
      buyers: 5,
      updated: "05/09/2026",
    },
    {
      name: "Công ty TNHH Sữa học đường Việt",
      ward: "Nguyễn Cư Trinh",
      address: "15 Cống Quỳnh, P. Nguyễn Cư Trinh",
      category: "Sữa và chế phẩm từ sữa",
      status: "Đạt",
      capacity: 4100,
      buyers: 11,
      updated: "04/09/2026",
    },
  ];
  const schoolSuppliers: Record<string, SchoolSupplier> = {
    abc: {
      name: "Công ty TNHH ABC",
      address: "18 Nguyễn Huệ, P. Bến Nghé",
      taxCode: "0312345678",
      capacity: 3000,
    },
    minhTam: {
      name: "Công ty Suất ăn Minh Tâm",
      address: "52 Điện Biên Phủ, P. Đa Kao",
      taxCode: "0312456789",
      capacity: 2500,
    },
    cauOngLanh: {
      name: "Bếp ăn tập thể Cầu Ông Lãnh",
      address: "116 Nguyễn Thái Học, P. Cầu Ông Lãnh",
      taxCode: "0313567890",
      capacity: 1500,
    },
    nguyenCuTrinh: {
      name: "Cơ sở Suất ăn Nguyễn Cư Trinh",
      address: "24 Trần Hưng Đạo, P. Nguyễn Cư Trinh",
      taxCode: "0314678901",
      capacity: 2000,
    },
    greenFood: {
      name: "Công ty TNHH Dinh dưỡng GreenFood",
      address: "88 Lý Tự Trọng, P. Bến Nghé",
      taxCode: "0315789012",
      capacity: 1800,
    },
  };
  const schoolRows: SchoolRecord[] = [
    {
      name: "Trường Mầm non Hoa Mai",
      level: "Mầm non",
      mealOrganization: "Tự tổ chức nấu ăn",
      ward: "Bến Nghé",
      students: 420,
      demand: 420,
      supply: 420,
      suppliers: [],
      status: "Đạt",
      updated: "08/09/2026",
    },
    {
      name: "Trường Tiểu học Nguyễn Du",
      level: "Cấp 1",
      mealOrganization: "Sử dụng suất ăn từ bên ngoài",
      ward: "Đa Kao",
      students: 650,
      demand: 650,
      supply: 650,
      suppliers: [schoolSuppliers.minhTam, schoolSuppliers.abc],
      status: "Đạt",
      updated: "08/09/2026",
    },
    {
      name: "Trường THCS ABC",
      level: "Cấp 2",
      mealOrganization: "Sử dụng suất ăn từ bên ngoài",
      ward: "Cầu Ông Lãnh",
      students: 780,
      demand: 780,
      supply: 760,
      suppliers: [schoolSuppliers.cauOngLanh],
      status: "Cảnh báo",
      updated: "07/09/2026",
    },
    {
      name: "Trường THPT XYZ",
      level: "Cấp 3",
      mealOrganization: "Tự tổ chức nấu ăn",
      ward: "Nguyễn Cư Trinh",
      students: 800,
      demand: 800,
      supply: 800,
      suppliers: [],
      status: "Đạt",
      updated: "06/09/2026",
    },
    {
      name: "Trường Mầm non Hoa Sen",
      level: "Mầm non",
      mealOrganization: "Sử dụng suất ăn từ bên ngoài",
      ward: "Bến Nghé",
      students: 310,
      demand: 310,
      supply: 310,
      suppliers: [schoolSuppliers.greenFood],
      status: "Đạt",
      updated: "05/09/2026",
    },
    {
      name: "Trường Tiểu học Lê Lợi",
      level: "Cấp 1",
      mealOrganization: "Tự tổ chức nấu ăn",
      ward: "Đa Kao",
      students: 590,
      demand: 590,
      supply: 590,
      suppliers: [],
      status: "Đạt",
      updated: "05/09/2026",
    },
    {
      name: "Trường THCS Trần Hưng Đạo",
      level: "Cấp 2",
      mealOrganization: "Sử dụng suất ăn từ bên ngoài",
      ward: "Cầu Ông Lãnh",
      students: 720,
      demand: 720,
      supply: 700,
      suppliers: [schoolSuppliers.nguyenCuTrinh],
      status: "Cảnh báo",
      updated: "04/09/2026",
    },
    {
      name: "Trường THPT Nguyễn Thị Minh Khai",
      level: "Cấp 3",
      mealOrganization: "Sử dụng suất ăn từ bên ngoài",
      ward: "Nguyễn Cư Trinh",
      students: 910,
      demand: 910,
      supply: 910,
      suppliers: [schoolSuppliers.abc],
      status: "Đạt",
      updated: "04/09/2026",
    },
    {
      name: "Trường Mầm non Ánh Dương",
      level: "Mầm non",
      mealOrganization: "Sử dụng suất ăn từ bên ngoài",
      ward: "Bến Nghé",
      students: 280,
      demand: 280,
      supply: 280,
      suppliers: [schoolSuppliers.minhTam],
      status: "Đạt",
      updated: "03/09/2026",
    },
    {
      name: "Trường Tiểu học Bến Thành",
      level: "Cấp 1",
      mealOrganization: "Tự tổ chức nấu ăn",
      ward: "Bến Nghé",
      students: 610,
      demand: 610,
      supply: 610,
      suppliers: [],
      status: "Đạt",
      updated: "03/09/2026",
    },
    {
      name: "Trường THCS Chu Văn An",
      level: "Cấp 2",
      mealOrganization: "Sử dụng suất ăn từ bên ngoài",
      ward: "Đa Kao",
      students: 840,
      demand: 840,
      supply: 820,
      suppliers: [schoolSuppliers.abc, schoolSuppliers.greenFood],
      status: "Cảnh báo",
      updated: "02/09/2026",
    },
    {
      name: "Trường THPT Lê Quý Đôn",
      level: "Cấp 3",
      mealOrganization: "Sử dụng suất ăn từ bên ngoài",
      ward: "Nguyễn Cư Trinh",
      students: 980,
      demand: 980,
      supply: 980,
      suppliers: [schoolSuppliers.nguyenCuTrinh],
      status: "Đạt",
      updated: "01/09/2026",
    },
  ];
  const summaries: Record<string, Summary> = {
    "Quận 1": {
      suppliers: 28,
      supplierCapacity: 18500,
      supplierDemand: 16800,
      schools: 85,
      students: 42500,
      schoolDemand: 38200,
      status: { Đạt: 22, "Cảnh báo": 4, "Chưa đạt": 2 },
    },
    "Toàn thành phố": {
      suppliers: 214,
      supplierCapacity: 126400,
      supplierDemand: 114250,
      schools: 1038,
      students: 518200,
      schoolDemand: 462800,
      status: { Đạt: 868, "Cảnh báo": 119, "Chưa đạt": 51 },
    },
  };
  const summary = summaries[area] ?? summaries["Quận 1"];
  const districtByWard: Record<string, string> = {
    "Bến Nghé": "Quận 1",
    "Đa Kao": "Quận 1",
    "Cầu Ông Lãnh": "Quận 1",
    "Nguyễn Cư Trinh": "Quận 1",
    "Tân Hưng": "Quận 7",
    "Củ Chi": "Củ Chi",
  };
  const districtOptions =
    area === "Quận 1"
      ? ["Quận 1"]
      : ["Tất cả quận/huyện", "Quận 1", "Quận 7", "Củ Chi"];
  const wardOptions = Object.entries(districtByWard)
    .filter(
      ([, itemDistrict]) =>
        (area === "Toàn thành phố" || itemDistrict === area) &&
        (district === "Tất cả quận/huyện" || itemDistrict === district),
    )
    .map(([itemWard]) => itemWard);
  const matchesLocation = (itemWard: string) => {
    const itemDistrict = districtByWard[itemWard];
    return (
      (area === "Toàn thành phố" || itemDistrict === area) &&
      (district === "Tất cả quận/huyện" || itemDistrict === district) &&
      (ward === "Tất cả phường/xã" || itemWard === ward)
    );
  };
  const matchesCommonFilters = (item: {
    name: string;
    ward: string;
    address: string;
    status: MonitoringStatus;
  }) =>
    matchesLocation(item.ward) &&
    (status === "Tất cả trạng thái" || item.status === status) &&
    `${item.name} ${item.address}`
      .toLowerCase()
      .includes(search.toLowerCase());
  const visibleSuppliers = supplierRows.filter((item) => {
    return matchesCommonFilters(item);
  });
  const visibleFoodSuppliers = foodSupplierRows.filter((item) => {
    return matchesCommonFilters(item);
  });
  const visibleSchools = schoolRows.filter((item) => {
    const matchesLevel =
      schoolLevel === "Tất cả cấp học" || item.level === schoolLevel;
    const matchesMealOrganization =
      mealOrganization === "Tất cả" ||
      item.mealOrganization === mealOrganization;
    return (
      matchesCommonFilters(item) &&
      matchesLevel &&
      matchesMealOrganization
    );
  });
  const visibleRows =
    activeTab === "suppliers"
      ? visibleSuppliers
      : activeTab === "schools"
        ? visibleSchools
        : visibleFoodSuppliers;
  const tabCounts = {
    suppliers: visibleSuppliers.length,
    schools: visibleSchools.length,
    food: visibleFoodSuppliers.length,
  };
  const visibleStatus = visibleRows.reduce(
    (counts, item) => ({ ...counts, [item.status]: counts[item.status] + 1 }),
    { Đạt: 0, "Cảnh báo": 0, "Chưa đạt": 0 } as Record<
      MonitoringStatus,
      number
    >,
  );
  const hasFilters =
    area !== "Quận 1" ||
    district !== "Quận 1" ||
    ward !== "Tất cả phường/xã" ||
    status !== "Tất cả trạng thái" ||
    Boolean(search) ||
    (activeTab === "schools" &&
      (schoolLevel !== "Tất cả cấp học" || mealOrganization !== "Tất cả"));
  const statusCounts = hasFilters ? visibleStatus : summary.status;
  const totalStatus = Object.values(statusCounts).reduce(
    (sum, value) => sum + value,
    0,
  );
  const foodCapacity = visibleFoodSuppliers.reduce(
    (total, item) => total + item.capacity,
    0,
  );
  const foodDemand = visibleFoodSuppliers.reduce(
    (total, item) => total + item.buyers,
    0,
  );
  const currentCapacity =
    activeTab === "suppliers"
      ? summary.supplierCapacity
      : activeTab === "schools"
        ? summary.supplierDemand
        : foodCapacity;
  const currentDemand =
    activeTab === "suppliers"
      ? summary.supplierDemand
      : activeTab === "schools"
        ? summary.schoolDemand
        : foodDemand;
  const balance = currentCapacity - currentDemand;
  const formatNumber = (value: number) => value.toLocaleString("vi-VN");
  const closeDetail = () => {
    setSelectedSupplier(null);
    setSelectedSchool(null);
  };
  const statusTone = (value: MonitoringStatus) =>
    value === "Đạt" ? "approved" : value === "Cảnh báo" ? "warning" : "stopped";

  return (
    <AdminShell>
      <div className="mx-auto max-w-[1600px] px-4 py-5 sm:px-6 lg:px-8">
        <section className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
          <div className="bg-[#123d36] px-5 py-6 text-white sm:px-7">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <div className="flex items-center gap-2 text-[#f4c95d]">
                  <BarChart3 size={16} />
                  <p className="mono-label">DASHBOARD GIÁM SÁT</p>
                </div>
                <h1 className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl">
                  Theo dõi theo địa bàn
                </h1>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-white/70">
                  Chọn địa bàn trước để xem toàn bộ cơ sở cung cấp suất ăn và cơ
                  sở giáo dục thuộc khu vực đó.
                </p>
              </div>
              <div className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-xs text-white/80">
                <Clock3 size={14} />
                Cập nhật dữ liệu: 08/09/2026
              </div>
            </div>
          </div>
          <div className="grid gap-3 border-b border-border bg-background p-4 sm:grid-cols-2 lg:grid-cols-6">
            <label className="text-xs font-bold text-muted-foreground">
              <span className="mb-1.5 block text-primary">Địa bàn *</span>
              <select
                value={area}
                onChange={(event) => {
                  setArea(event.target.value);
                  setDistrict(
                    event.target.value === "Quận 1"
                      ? "Quận 1"
                      : "Tất cả quận/huyện",
                  );
                  setWard("Tất cả phường/xã");
                }}
                className="h-10 w-full rounded-xl border border-primary/40 bg-card px-3 text-sm font-extrabold text-foreground"
                data-testid="select-dashboard-area"
              >
                <option>Quận 1</option>
                <option>Toàn thành phố</option>
              </select>
            </label>
            <label className="text-xs font-bold text-muted-foreground">
              <span className="mb-1.5 block">Quận/Huyện</span>
              <select
                value={district}
                onChange={(event) => {
                  setDistrict(event.target.value);
                  setWard("Tất cả phường/xã");
                }}
                className="h-10 w-full rounded-xl border border-input bg-card px-3 text-sm font-semibold"
              >
                {districtOptions.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
            <label className="text-xs font-bold text-muted-foreground">
              <span className="mb-1.5 block">Phường/Xã</span>
              <select
                value={ward}
                onChange={(event) => setWard(event.target.value)}
                className="h-10 w-full rounded-xl border border-input bg-card px-3 text-sm font-semibold"
                data-testid="select-dashboard-ward"
              >
                <option>Tất cả phường/xã</option>
                {wardOptions.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
            <label className="text-xs font-bold text-muted-foreground">
              <span className="mb-1.5 block">
                Cấp học
                {activeTab !== "schools" && (
                  <span className="ml-1 font-normal">(chỉ áp dụng trường)</span>
                )}
              </span>
              <select
                value={schoolLevel}
                onChange={(event) =>
                  setSchoolLevel(event.target.value as typeof schoolLevel)
                }
                disabled={activeTab !== "schools"}
                className="h-10 w-full rounded-xl border border-input bg-card px-3 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50"
                data-testid="select-dashboard-school-level"
              >
                {["Tất cả cấp học", "Mầm non", "Cấp 1", "Cấp 2", "Cấp 3"].map(
                  (item) => (
                    <option key={item}>{item}</option>
                  ),
                )}
              </select>
            </label>
            {activeTab === "schools" && (
              <label className="text-xs font-bold text-muted-foreground">
                <span className="mb-1.5 block">Hình thức tổ chức bữa ăn</span>
                <select
                  value={mealOrganization}
                  onChange={(event) =>
                    setMealOrganization(
                      event.target.value as typeof mealOrganization,
                    )
                  }
                  className="h-10 w-full rounded-xl border border-input bg-card px-3 text-sm font-semibold"
                  data-testid="select-dashboard-meal-organization"
                >
                  {[
                    "Tất cả",
                    "Tự tổ chức nấu ăn",
                    "Sử dụng suất ăn từ bên ngoài",
                  ].map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </label>
            )}
            {activeTab !== "schools" && (
              <label className="text-xs font-bold text-muted-foreground">
                <span className="mb-1.5 block">
                  Hình thức tổ chức bữa ăn
                  <span className="ml-1 font-normal">(chỉ áp dụng trường)</span>
                </span>
                <select
                  value={mealOrganization}
                  disabled
                  className="h-10 w-full cursor-not-allowed rounded-xl border border-input bg-card px-3 text-sm font-semibold opacity-50"
                >
                  <option>Không áp dụng</option>
                </select>
              </label>
            )}
            <label className="text-xs font-bold text-muted-foreground">
              <span className="mb-1.5 block">Trạng thái</span>
              <select
                value={status}
                onChange={(event) =>
                  setStatus(event.target.value as typeof status)
                }
                className="h-10 w-full rounded-xl border border-input bg-card px-3 text-sm font-semibold"
              >
                {["Tất cả trạng thái", "Đạt", "Cảnh báo", "Chưa đạt"].map(
                  (item) => (
                    <option key={item}>{item}</option>
                  ),
                )}
              </select>
            </label>
            <label className="text-xs font-bold text-muted-foreground">
              <span className="mb-1.5 block">Tìm kiếm cơ sở</span>
              <span className="relative block">
                <Search
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Tên cơ sở..."
                  className="h-10 w-full rounded-xl border border-input bg-card pl-9 pr-3 text-sm font-semibold outline-none focus:border-primary"
                  data-testid="input-dashboard-search"
                />
              </span>
            </label>
          </div>
          <div className="flex flex-wrap items-center gap-2 bg-amber-50/70 px-4 py-3 text-xs text-amber-900 sm:px-6">
            <MapPin size={15} className="text-amber-700" />
            <strong>Địa bàn đang xem:</strong>
            <span>{area}</span>
            <span className="text-amber-700/60">·</span>
            <span>Toàn bộ số liệu bên dưới được quy về địa bàn này.</span>
          </div>
        </section>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mono-label text-primary">TỔNG QUAN THEO ĐỊA BÀN</p>
            <h2 className="mt-1 text-2xl font-extrabold">{area}</h2>
          </div>
          <div
            className="grid grid-cols-3 rounded-xl bg-secondary p-1 sm:w-auto"
            role="tablist"
            aria-label="Đối tượng giám sát"
          >
            {(
              [
                ["suppliers", "Cơ sở cung cấp suất ăn"],
                ["schools", "Cơ sở giáo dục"],
                ["food", "Cơ sở cung cấp thực phẩm"],
              ] as const
            ).map(([value, label]) => (
              <button
                key={value}
                type="button"
                role="tab"
                aria-selected={activeTab === value}
                onClick={() => setActiveTab(value)}
                className={`rounded-lg px-3 py-2.5 text-left text-xs font-bold transition-colors sm:px-5 ${activeTab === value ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                data-testid={`tab-dashboard-${value}`}
              >
                <span className="flex items-center gap-2">
                  {label}
                  <span
                    className={`rounded-full px-1.5 py-0.5 text-[10px] leading-none ${activeTab === value ? "bg-white/15 text-white" : "bg-background text-foreground"}`}
                  >
                    {tabCounts[value]}
                  </span>
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {activeTab === "suppliers" ? (
            <>
              <MetricCard
                label="Tổng cơ sở cung cấp"
                value={`${summary.suppliers}`}
                icon={Building2}
                tone="green"
              />
              <MetricCard
                label="Công suất cung cấp"
                value={`${formatNumber(summary.supplierCapacity)}`}
                icon={Utensils}
                tone="blue"
              />
              <MetricCard
                label="Nhu cầu đang phục vụ"
                value={`${formatNumber(summary.supplierDemand)}`}
                icon={ClipboardCheck}
                tone="gold"
              />
              <MetricCard
                label="Cân bằng cung - cầu"
                value={`+${formatNumber(summary.supplierCapacity - summary.supplierDemand)}`}
                icon={CheckCircle2}
                tone="green"
              />
            </>
          ) : activeTab === "schools" ? (
            <>
              <MetricCard
                label="Tổng cơ sở giáo dục"
                value={`${summary.schools}`}
                icon={Building2}
                tone="green"
              />
              <MetricCard
                label="Tổng số học sinh"
                value={formatNumber(summary.students)}
                icon={ChefHat}
                tone="blue"
              />
              <MetricCard
                label="Tổng nhu cầu suất ăn"
                value={formatNumber(summary.schoolDemand)}
                icon={Utensils}
                tone="gold"
              />
              <MetricCard
                label="Trường đã kết nối nhà cung cấp"
                value="81"
                icon={CheckCircle2}
                tone="green"
              />
            </>
          ) : (
            <>
              <MetricCard
                label="Tổng cơ sở cung cấp thực phẩm"
                value={`${visibleFoodSuppliers.length}`}
                icon={Building2}
                tone="green"
              />
              <MetricCard
                label="Công suất cung ứng"
                value={formatNumber(foodCapacity)}
                icon={Utensils}
                tone="blue"
              />
              <MetricCard
                label="Đơn vị đang sử dụng"
                value={formatNumber(foodDemand)}
                icon={ClipboardCheck}
                tone="gold"
              />
              <MetricCard
                label="Còn dư công suất"
                value={`+${formatNumber(foodCapacity - foodDemand)}`}
                icon={CheckCircle2}
                tone="green"
              />
            </>
          )}
        </div>

        {activeTab === "schools" && (
          <div className="mt-3 flex flex-wrap items-center gap-2 rounded-2xl border border-border bg-card p-3 shadow-sm">
            <span className="mr-1 text-xs font-extrabold text-muted-foreground">
              PHÂN NHÓM CẤP HỌC
            </span>
            {(
              ["Tất cả cấp học", "Mầm non", "Cấp 1", "Cấp 2", "Cấp 3"] as const
            ).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setSchoolLevel(item)}
                className={`rounded-full border px-3 py-1.5 text-xs font-bold transition-colors ${schoolLevel === item ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background text-muted-foreground hover:border-primary hover:text-primary"}`}
                data-testid={`button-level-${item}`}
              >
                {item === "Tất cả cấp học" ? "Tất cả" : item}
              </button>
            ))}
          </div>
        )}

        <section className="mt-3 rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="mono-label text-primary">TRẠNG THÁI</p>
              <h2 className="mt-1 text-lg font-extrabold">
                {activeTab === "suppliers"
                  ? "Cơ sở cung cấp suất ăn tại "
                  : activeTab === "schools"
                    ? "Cơ sở giáo dục tại "
                    : "Cơ sở cung cấp thực phẩm tại "}
                {area}
              </h2>
            </div>
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              {(["Đạt", "Cảnh báo", "Chưa đạt"] as const).map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() =>
                    setStatus(status === item ? "Tất cả trạng thái" : item)
                  }
                  className={`min-w-[82px] rounded-xl border px-3 py-2 text-left transition-all ${item === "Đạt" ? "border-emerald-100 bg-emerald-50 text-emerald-700" : item === "Cảnh báo" ? "border-amber-100 bg-amber-50 text-amber-700" : "border-red-100 bg-red-50 text-red-700"} ${status === item ? "ring-2 ring-primary/30" : ""}`}
                >
                  <p className="text-[10px] font-bold uppercase tracking-wide">
                    {item}
                  </p>
                  <p className="mt-1 text-xl font-black">
                    {statusCounts[item]}
                  </p>
                  <p className="text-[10px] font-medium opacity-80">
                    {activeTab === "suppliers" ? "cơ sở" : "trường"}
                  </p>
                </button>
              ))}
            </div>
          </div>
          <div className="mt-4">
            <div className="mb-2 flex justify-between text-[11px] font-bold text-muted-foreground">
              <span>Tỷ lệ đạt yêu cầu</span>
              <span>
                {Math.round(
                  (statusCounts["Đạt"] / Math.max(1, totalStatus)) * 100,
                )}
                %
              </span>
            </div>
            <div className="flex h-2.5 overflow-hidden rounded-full bg-slate-100">
              <div
                className="bg-emerald-500"
                style={{
                  width: `${(statusCounts["Đạt"] / Math.max(1, totalStatus)) * 100}%`,
                }}
              />
              <div
                className="bg-amber-400"
                style={{
                  width: `${(statusCounts["Cảnh báo"] / Math.max(1, totalStatus)) * 100}%`,
                }}
              />
              <div
                className="bg-red-500"
                style={{
                  width: `${(statusCounts["Chưa đạt"] / Math.max(1, totalStatus)) * 100}%`,
                }}
              />
            </div>
          </div>
        </section>

        <section className="mt-3 overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <div className="flex flex-col gap-2 border-b border-border px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <div>
              <p className="mono-label text-primary">DANH SÁCH THEO ĐỊA BÀN</p>
              <h2 className="mt-1 text-lg font-extrabold">
                {activeTab === "suppliers"
                  ? `Cơ sở cung cấp suất ăn tại ${area}`
                  : activeTab === "schools"
                    ? `Cơ sở giáo dục tại ${area}`
                    : `Cơ sở cung cấp thực phẩm tại ${area}`}
              </h2>
            </div>
            <span className="text-xs font-semibold text-muted-foreground">
              {visibleRows.length} mẫu hiển thị ·{" "}
              {activeTab === "suppliers"
                ? summary.suppliers
                : activeTab === "schools"
                  ? summary.schools
                  : foodSupplierRows.length}{" "}
              tổng cộng
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-xs">
              <thead className="bg-secondary/70 text-[10px] font-extrabold uppercase tracking-wide text-muted-foreground">
                {activeTab === "suppliers" ? (
                  <tr>
                    <th className="px-5 py-3">Cơ sở cung cấp</th>
                    <th className="px-4 py-3">Địa chỉ</th>
                    <th className="px-4 py-3 text-right">Công suất/ngày</th>
                    <th className="px-4 py-3 text-right">Đang cung cấp</th>
                    <th className="px-4 py-3 text-center">Đang cung cấp cho</th>
                    <th className="px-4 py-3">Trạng thái</th>
                    <th className="px-5 py-3 text-right">Chi tiết</th>
                  </tr>
                ) : activeTab === "schools" ? (
                  <tr>
                    <th className="px-5 py-3">Cơ sở giáo dục</th>
                    <th className="px-4 py-3">Địa chỉ</th>
                    <th className="px-4 py-3">Cấp học</th>
                    <th className="px-4 py-3 text-right">Học sinh</th>
                    <th className="px-4 py-3 text-right">Nhu cầu suất ăn</th>
                    <th className="px-4 py-3">Nhà cung cấp</th>
                    <th className="px-4 py-3">Trạng thái</th>
                    <th className="px-5 py-3 text-right">Chi tiết</th>
                  </tr>
                ) : (
                  <tr>
                    <th className="px-5 py-3">Cơ sở cung cấp thực phẩm</th>
                    <th className="px-4 py-3">Địa chỉ</th>
                    <th className="px-4 py-3">Nhóm thực phẩm</th>
                    <th className="px-4 py-3 text-right">Công suất/ngày</th>
                    <th className="px-4 py-3 text-center">Đang sử dụng</th>
                    <th className="px-4 py-3">Trạng thái</th>
                    <th className="px-5 py-3 text-right">Chi tiết</th>
                  </tr>
                )}
              </thead>
              <tbody className="divide-y divide-border">
                {activeTab === "suppliers"
                  ? visibleSuppliers.map((supplier) => (
                      <tr
                        key={supplier.name}
                        className="transition-colors hover:bg-secondary/30"
                      >
                        <td className="px-5 py-4 font-bold">
                          {supplier.name}
                          <span className="mt-1 block text-[10px] font-medium text-muted-foreground">
                            {supplier.ward}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-muted-foreground">
                          {supplier.address}
                        </td>
                        <td className="px-4 py-4 text-right font-bold">
                          {formatNumber(supplier.capacity)}
                        </td>
                        <td className="px-4 py-4 text-right font-bold">
                          {formatNumber(supplier.serving)}
                        </td>
                        <td className="px-4 py-4 text-center font-bold">
                          {supplier.schools} trường
                        </td>
                        <td className="px-4 py-4">
                          <StatusPill status={statusTone(supplier.status)} />
                        </td>
                        <td className="px-5 py-4 text-right">
                          <button
                            type="button"
                            onClick={() => setSelectedSupplier(supplier)}
                            className="inline-flex items-center gap-1 rounded-lg border border-primary/30 px-2.5 py-1.5 text-[10px] font-extrabold text-primary hover:bg-primary hover:text-primary-foreground"
                          >
                            Xem chi tiết <ChevronRight size={13} />
                          </button>
                        </td>
                      </tr>
                    ))
                  : activeTab === "schools" ? visibleSchools.map((school) => (
                      <tr
                        key={school.name}
                        className="transition-colors hover:bg-secondary/30"
                      >
                        <td className="px-5 py-4 font-bold">
                          <span className="block">{school.name}</span>
                          <span className="mt-1 block text-[10px] font-medium text-muted-foreground">
                            {school.mealOrganization}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-muted-foreground">
                          P. {school.ward}, Quận 1
                        </td>
                        <td className="px-4 py-4">
                          <span className="rounded-full bg-sky-50 px-2.5 py-1 text-[10px] font-bold text-sky-700">
                            {school.level}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-right font-bold">
                          {formatNumber(school.students)}
                        </td>
                        <td className="px-4 py-4 text-right font-bold">
                          {formatNumber(school.demand)}
                        </td>
                        <td className="px-4 py-4 text-center font-bold">
                          {school.suppliers.length === 0 ? (
                            <span>0</span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setSelectedSchool(school)}
                              className="rounded-lg px-2 py-1 text-primary underline decoration-primary/40 underline-offset-2 hover:bg-secondary"
                              aria-label={`Xem ${school.suppliers.length} nhà cung cấp của ${school.name}`}
                              data-testid={`button-school-suppliers-${school.name}`}
                            >
                              {school.suppliers.length}
                            </button>
                          )}
                        </td>
                        <td className="px-4 py-4">
                          <StatusPill status={statusTone(school.status)} />
                        </td>
                        <td className="px-5 py-4 text-right">
                          <button
                            type="button"
                            onClick={() => setSelectedSchool(school)}
                            className="inline-flex items-center gap-1 rounded-lg border border-primary/30 px-2.5 py-1.5 text-[10px] font-extrabold text-primary hover:bg-primary hover:text-primary-foreground"
                          >
                            Xem chi tiết <ChevronRight size={13} />
                          </button>
                        </td>
                      </tr>
                    ))
                  : visibleFoodSuppliers.map((supplier) => (
                      <tr
                        key={supplier.name}
                        className="transition-colors hover:bg-secondary/30"
                      >
                        <td className="px-5 py-4 font-bold">
                          {supplier.name}
                          <span className="mt-1 block text-[10px] font-medium text-muted-foreground">
                            {supplier.ward}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-muted-foreground">
                          {supplier.address}
                        </td>
                        <td className="px-4 py-4">{supplier.category}</td>
                        <td className="px-4 py-4 text-right font-bold">
                          {formatNumber(supplier.capacity)}
                        </td>
                        <td className="px-4 py-4 text-center font-bold">
                          {supplier.buyers} cơ sở
                        </td>
                        <td className="px-4 py-4">
                          <StatusPill status={statusTone(supplier.status)} />
                        </td>
                        <td className="px-5 py-4 text-right">
                          <button
                            type="button"
                            onClick={() => setSelectedFoodSupplier(supplier)}
                            className="inline-flex items-center gap-1 rounded-lg border border-primary/30 px-2.5 py-1.5 text-[10px] font-extrabold text-primary hover:bg-primary hover:text-primary-foreground"
                          >
                            Xem chi tiết <ChevronRight size={13} />
                          </button>
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>
          {!visibleRows.length && (
            <div className="px-5 py-12 text-center text-sm text-muted-foreground">
              Không tìm thấy cơ sở phù hợp với bộ lọc hiện tại.
            </div>
          )}
        </section>

        <section className="mt-3 grid gap-3 lg:grid-cols-[1.3fr_.7fr]">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="mono-label text-primary">CÂN BẰNG CUNG - CẦU</p>
                <h2 className="mt-1 text-lg font-extrabold">
                  Năng lực phục vụ tại {area}
                </h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  Công suất cung cấp so với nhu cầu suất ăn đang phục vụ.
                </p>
              </div>
              <div className="rounded-xl bg-emerald-50 px-3 py-2 text-right text-emerald-700">
                <p className="text-[10px] font-bold uppercase">Còn dư</p>
                <p className="text-lg font-black">+{formatNumber(balance)}</p>
              </div>
            </div>
            <div className="mt-5">
              <div className="mb-2 flex justify-between text-xs font-bold text-muted-foreground">
                <span>Công suất đang sử dụng</span>
                <span>
                  {Math.round((currentDemand / currentCapacity) * 100)}%
                </span>
              </div>
              <div className="h-4 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{
                    width: `${Math.min(100, (currentDemand / currentCapacity) * 100)}%`,
                  }}
                />
              </div>
              <div className="mt-2 flex justify-between text-[10px] text-muted-foreground">
                <span>0 suất</span>
                <span>{formatNumber(currentCapacity)} suất/ngày công suất</span>
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <p className="mono-label text-primary">TÓM TẮT LỌC</p>
            <h2 className="mt-1 text-lg font-extrabold">Phạm vi đang xem</h2>
            <div className="mt-4 grid gap-2 text-xs">
              <div className="flex justify-between rounded-lg bg-secondary/60 px-3 py-2">
                <span className="text-muted-foreground">Địa bàn</span>
                <strong>{area}</strong>
              </div>
              <div className="flex justify-between rounded-lg bg-secondary/60 px-3 py-2">
                <span className="text-muted-foreground">Phường/Xã</span>
                <strong>{ward}</strong>
              </div>
              <div className="flex justify-between rounded-lg bg-secondary/60 px-3 py-2">
                <span className="text-muted-foreground">Bản ghi mẫu</span>
                <strong>{visibleRows.length}</strong>
              </div>
            </div>
          </div>
        </section>
      </div>

      {(selectedSupplier || selectedSchool) && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/45 p-0 sm:items-center sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-label="Chi tiết cơ sở"
          onClick={closeDetail}
        >
          <div
            className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-t-3xl bg-card p-5 shadow-2xl sm:rounded-3xl sm:p-7"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 border-b border-border pb-4">
              <div>
                <p className="mono-label text-primary">THÔNG TIN CƠ SỞ</p>
                <h2 className="mt-1 text-xl font-extrabold">
                  {selectedSupplier?.name ?? selectedSchool?.name}
                </h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  Địa bàn: {area}, TP.HCM
                </p>
              </div>
              <button
                type="button"
                onClick={closeDetail}
                className="rounded-xl bg-secondary p-2 text-muted-foreground hover:text-foreground"
                aria-label="Đóng"
              >
                <X size={18} />
              </button>
            </div>
            {selectedSupplier ? (
              <div className="mt-5 grid gap-5 md:grid-cols-[.8fr_1.2fr]">
                <div className="space-y-3">
                  <div className="rounded-2xl bg-secondary/60 p-4">
                    <p className="text-xs font-bold text-muted-foreground">
                      Địa chỉ
                    </p>
                    <p className="mt-1 text-sm font-bold">
                      {selectedSupplier.address}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-secondary/60 p-4">
                    <p className="text-xs font-bold text-muted-foreground">
                      Trạng thái
                    </p>
                    <div className="mt-2">
                      <StatusPill
                        status={statusTone(selectedSupplier.status)}
                      />
                    </div>
                  </div>
                  <div className="rounded-2xl bg-primary p-4 text-primary-foreground">
                    <p className="text-xs font-bold text-primary-foreground/70">
                      Năng lực còn lại
                    </p>
                    <p className="mt-1 text-2xl font-black">
                      {formatNumber(
                        selectedSupplier.capacity - selectedSupplier.serving,
                      )}{" "}
                      suất/ngày
                    </p>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-extrabold">Năng lực cung cấp</h3>
                  <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                    <div className="rounded-xl border border-border p-3">
                      <p className="text-[10px] text-muted-foreground">
                        Công suất tối đa
                      </p>
                      <p className="mt-1 font-black">
                        {formatNumber(selectedSupplier.capacity)}
                      </p>
                    </div>
                    <div className="rounded-xl border border-border p-3">
                      <p className="text-[10px] text-muted-foreground">
                        Đang cung cấp
                      </p>
                      <p className="mt-1 font-black">
                        {formatNumber(selectedSupplier.serving)}
                      </p>
                    </div>
                    <div className="rounded-xl border border-border p-3">
                      <p className="text-[10px] text-muted-foreground">
                        Số trường
                      </p>
                      <p className="mt-1 font-black">
                        {selectedSupplier.schools}
                      </p>
                    </div>
                  </div>
                  <h3 className="mt-5 text-sm font-extrabold">
                    Cơ sở giáo dục đang được cung cấp
                  </h3>
                  <div className="mt-3 divide-y divide-border rounded-xl border border-border">
                    {schoolRows
                      .slice(0, selectedSupplier.schools > 3 ? 4 : 3)
                      .map((school) => (
                        <button
                          key={school.name}
                          type="button"
                          onClick={() => {
                            setSelectedSupplier(null);
                            setSelectedSchool(school);
                          }}
                          className="flex w-full items-center justify-between gap-3 px-3 py-3 text-left text-xs hover:bg-secondary/50"
                        >
                          <span>
                            <strong>{school.name}</strong>
                            <span className="mt-1 block text-muted-foreground">
                              {school.level} · {formatNumber(school.demand)}{" "}
                              suất/ngày
                            </span>
                          </span>
                          <ChevronRight
                            size={14}
                            className="shrink-0 text-primary"
                          />
                        </button>
                      ))}
                  </div>
                </div>
              </div>
            ) : selectedSchool ? (
              <div className="mt-5 grid gap-5 md:grid-cols-[.8fr_1.2fr]">
                <div className="space-y-3">
                  <div className="rounded-2xl bg-secondary/60 p-4">
                    <p className="text-xs font-bold text-muted-foreground">
                      Thông tin cơ sở giáo dục
                    </p>
                    <div className="mt-2 space-y-1 text-sm">
                      <p>
                        <strong>Địa chỉ:</strong> P. {selectedSchool.ward}, Quận
                        1
                      </p>
                      <p>
                        <strong>Cấp học:</strong> {selectedSchool.level}
                      </p>
                      <p>
                        <strong>Hình thức bữa ăn:</strong>{" "}
                        {selectedSchool.mealOrganization}
                      </p>
                      <p>
                        <strong>Nhà cung cấp:</strong>{" "}
                        {selectedSchool.suppliers.length} đơn vị
                      </p>
                      <p>
                        <strong>Số học sinh:</strong>{" "}
                        {formatNumber(selectedSchool.students)}
                      </p>
                      <p>
                        <strong>Nhu cầu:</strong>{" "}
                        {formatNumber(selectedSchool.demand)} suất/ngày
                      </p>
                    </div>
                  </div>
                  <div className="rounded-2xl bg-secondary/60 p-4">
                    <p className="text-xs font-bold text-muted-foreground">
                      Trạng thái
                    </p>
                    <div className="mt-2">
                      <StatusPill status={statusTone(selectedSchool.status)} />
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-extrabold">
                    Nhà cung cấp suất ăn
                  </h3>
                  <div className="mt-3 divide-y divide-border rounded-xl border border-border">
                    {selectedSchool.suppliers.length ? (
                      selectedSchool.suppliers.map((supplier) => (
                        <div key={supplier.name} className="px-3 py-3 text-xs">
                          <div className="flex items-start justify-between gap-3">
                            <strong>{supplier.name}</strong>
                            <span className="shrink-0 rounded-full bg-secondary px-2 py-1 text-[10px] font-bold text-primary">
                              {formatNumber(supplier.capacity)} suất/ngày
                            </span>
                          </div>
                          <p className="mt-2 text-muted-foreground">
                            <strong className="text-foreground">
                              Địa chỉ:
                            </strong>{" "}
                            {supplier.address}
                          </p>
                          <p className="mt-1 text-muted-foreground">
                            <strong className="text-foreground">
                              Mã số thuế:
                            </strong>{" "}
                            {supplier.taxCode}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="px-3 py-4 text-xs text-muted-foreground">
                        Trường tự tổ chức nấu ăn, không sử dụng đơn vị cung cấp
                        bên ngoài.
                      </p>
                    )}
                  </div>
                  <p className="mt-3 text-right text-xs font-extrabold text-primary">
                    Tổng: {formatNumber(selectedSchool.supply)} suất/ngày
                  </p>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </AdminShell>
  );
}

export function AdminBlankPage() {
  return (
    <AdminShell>
      <div aria-hidden="true" />
    </AdminShell>
  );
}

export function AdminFacilitiesPage() {
  const [category, setCategory] =
    useState<(typeof categoryOptions)[number]>("Tất cả");
  const [search, setSearch] = useState("");
  const filtered = useMemo(
    () =>
      facilities.filter(
        (facility) =>
          (category === "Tất cả" || facility.category === category) &&
          `${facility.name} ${facility.address}`
            .toLowerCase()
            .includes(search.toLowerCase()),
      ),
    [category, search],
  );
  return (
    <AdminShell>
      <div className="mx-auto max-w-7xl px-5 py-9 lg:px-10">
        <SectionHeading
          eyebrow="Quản lý cơ sở"
          title="Danh sách cơ sở."
          description="Tra cứu và theo dõi các trường học có bếp ăn bán trú, cơ sở cung cấp thực phẩm và cơ sở cung cấp suất ăn."
        />
        <div className="grid gap-4 md:grid-cols-3">
          <MetricCard
            label="Trường học"
            value="22"
            icon={Building2}
            tone="green"
          />
          <MetricCard
            label="Cung cấp thực phẩm"
            value="14"
            icon={FileText}
            tone="blue"
          />
          <MetricCard
            label="Cung cấp suất ăn"
            value="12"
            icon={Utensils}
            tone="gold"
          />
        </div>
        <div className="mt-8 overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
          <div className="flex flex-col gap-3 border-b border-border p-5 lg:flex-row lg:items-center">
            <label className="relative flex-1">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Tìm tên cơ sở, địa chỉ..."
                className="focus-ring h-11 w-full rounded-xl border border-input bg-background pl-9 pr-3 text-sm"
              />
            </label>
            <select
              value={category}
              onChange={(event) =>
                setCategory(
                  event.target.value as (typeof categoryOptions)[number],
                )
              }
              className="focus-ring h-11 rounded-xl border border-input bg-background px-3 text-sm font-semibold"
            >
              {categoryOptions.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </div>
          {filtered.length ? (
            <div className="divide-y divide-border">
              {filtered.map((facility) => (
                <div
                  key={facility.id}
                  className="flex flex-col gap-4 px-5 py-5 lg:flex-row lg:items-center lg:justify-between"
                >
                  <div className="flex min-w-0 items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary">
                      <Building2 size={19} />
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-extrabold">{facility.name}</h3>
                        <StatusPill status={facility.status} />
                      </div>
                      <p className="mt-1 text-xs font-semibold text-primary">
                        {categoryShortName(facility.category)}
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {facility.address} · {facility.contact}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-6 lg:justify-end">
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">
                        Quy mô suất ăn
                      </p>
                      <p className="font-bold">{facility.meals}</p>
                    </div>
                    <button
                      type="button"
                      className="inline-flex items-center gap-1 text-sm font-bold text-primary hover:underline"
                    >
                      Xem hồ sơ <ArrowUpRight size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              title="Không có cơ sở phù hợp"
              description="Thử thay đổi loại hình hoặc từ khóa tìm kiếm."
            />
          )}
        </div>
      </div>
    </AdminShell>
  );
}

type MealPageKey = keyof typeof mealData;

type MenuRecord = {
  id: string;
  weekday: string;
  day: string;
  month: string;
  year: string;
  school: string;
  ward: string;
  ageGroup: string;
  menuName: string;
  servingCount: number;
  servedCount: number;
  price: string;
  otherCost: string;
  menuIncome: string;
  menuExpense: string;
  lunch: string;
  snack: string;
  afternoon: string;
  calories: string;
  caloriesRange: string;
  macros: string;
  macroRange: string;
};

const menuRecords: MenuRecord[] = [
  {
    id: "menu-2026-01-02-nha-tre",
    weekday: "THỨ 2",
    day: "02",
    month: "Tháng 01",
    year: "2026",
    school: "TRƯỜNG MẦM NON HOA HỒNG",
    ward: "Phường Bến Nghé",
    ageGroup: "NHÀ TRẺ 18–36 THÁNG",
    menuName: "Thực đơn A",
    servingCount: 150,
    servedCount: 150,
    price: "24.000đ",
    otherCost: "0đ",
    menuIncome: "24.000đ",
    menuExpense: "24.000đ",
    lunch:
      "Cơm; Canh thịt gà nấu bí xanh; Thịt lợn, trứng vịt đảo bông (Tráng miệng quả cam)",
    snack: "Sữa chua nuti",
    afternoon: "Phở bò nấu cà chua, hành lá",
    calories: "641",
    caloriesRange: "600 – 651",
    macros: "14 : 48 : 38",
    macroRange: "13-20 : 30-40 : 47-50",
  },
  {
    id: "menu-2026-01-02-mam-non",
    weekday: "THỨ 2",
    day: "02",
    month: "Tháng 01",
    year: "2026",
    school: "TRƯỜNG MẦM NON HOA HỒNG",
    ward: "Phường Bến Nghé",
    ageGroup: "MẦM NON 2–3 TUỔI",
    menuName: "Thực đơn A",
    servingCount: 150,
    servedCount: 150,
    price: "24.000đ",
    otherCost: "0đ",
    menuIncome: "24.000đ",
    menuExpense: "24.000đ",
    lunch:
      "Cơm; Canh thịt gà nấu bí xanh; Thịt lợn, trứng vịt đảo bông (Tráng miệng quả cam)",
    snack: "Sữa chua nuti",
    afternoon: "Phở bò nấu cà chua, hành lá",
    calories: "641",
    caloriesRange: "600 – 651",
    macros: "14 : 48 : 38",
    macroRange: "13-20 : 30-40 : 47-50",
  },
  {
    id: "menu-2026-01-03-tieu-hoc",
    weekday: "THỨ 3",
    day: "03",
    month: "Tháng 01",
    year: "2026",
    school: "TRƯỜNG TIỂU HỌC LÊ LỢI",
    ward: "Phường Bến Nghé",
    ageGroup: "TIỂU HỌC 6–10 TUỔI",
    menuName: "Thực đơn B",
    servingCount: 320,
    servedCount: 318,
    price: "28.000đ",
    otherCost: "500đ",
    menuIncome: "28.000đ",
    menuExpense: "26.500đ",
    lunch:
      "Cơm gạo lứt; Cá basa sốt cà; Canh rau củ thịt bằm (Tráng miệng chuối)",
    snack: "Bánh mì phô mai",
    afternoon: "Cháo gà rau củ",
    calories: "702",
    caloriesRange: "650 – 750",
    macros: "16 : 46 : 38",
    macroRange: "15-20 : 30-40 : 40-50",
  },
];

function MenuFilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="block min-w-0">
      <span className="meal-field-label mb-2 block text-[10px] font-extrabold uppercase tracking-[0.08em] text-slate-500">
        {label}
      </span>
      <span className="relative block">
        <select
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="meal-field-control h-11 w-full appearance-none rounded-lg border border-slate-200 bg-[#fbfcfd] px-3 pr-9 text-xs font-semibold text-slate-600 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
        >
          {options.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
        <ChevronDown
          size={15}
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
        />
      </span>
    </label>
  );
}

function MealLine({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "lunch" | "snack" | "afternoon";
}) {
  const toneClasses = {
    lunch: "border-emerald-100 bg-emerald-50 text-emerald-700",
    snack: "border-amber-100 bg-amber-50 text-amber-700",
    afternoon: "border-indigo-100 bg-indigo-50 text-indigo-700",
  };
  return (
    <div className="meal-detail-meal-row flex items-start gap-3">
      <span
        className={`mt-0.5 inline-flex shrink-0 items-center rounded-full border px-3 py-1.5 text-[10px] font-extrabold ${toneClasses[tone]}`}
      >
        {label}
      </span>
      <p className="pt-1 text-xs font-semibold leading-5 text-slate-700">
        {value}
      </p>
    </div>
  );
}

function formatSchoolName(value: string) {
  const normalized = value.toLocaleLowerCase("vi-VN");
  return normalized.replace(/^trường/, "Trường");
}

function MenuCard({
  menu,
  onDetails,
}: {
  menu: MenuRecord;
  onDetails: () => void;
}) {
  return (
    <article className="meal-menu-card group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_8px_24px_rgba(15,23,42,.04)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgba(15,23,42,.09)]">
      <div className="grid lg:grid-cols-[270px_minmax(0,1fr)]">
        <div className="meal-menu-card__meta border-b border-slate-100 p-5 lg:border-b-0 lg:border-r">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-[.12em] text-orange-600">
                {menu.weekday}
              </p>
              <p className="mt-1 text-4xl font-black tracking-tight text-slate-900">
                {menu.day}
                <span className="ml-1 text-sm font-bold text-slate-400">
                  / 01
                </span>
              </p>
            </div>
            <span className="rounded-lg bg-orange-50 p-2.5 text-orange-600">
              <CalendarDays size={18} />
            </span>
          </div>
          <div className="mt-5">
            <p className="text-sm font-black text-slate-900 normal-case">
              {formatSchoolName(menu.school)}
            </p>
            <p className="mt-1 text-[11px] font-semibold text-slate-400">
              {menu.ward}
            </p>
            <span className="mt-3 inline-flex rounded-full bg-blue-50 px-2.5 py-1.5 text-[10px] font-extrabold text-blue-700">
              {menu.ageGroup}
            </span>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-2">
            <div className="rounded-lg bg-slate-50 p-3">
              <p className="text-[9px] font-extrabold uppercase text-slate-400">
                Suất ăn
              </p>
              <p className="mt-1 text-base font-black text-slate-800">
                {menu.servedCount}
              </p>
            </div>
            <div className="rounded-lg bg-slate-50 p-3">
              <p className="text-[9px] font-extrabold uppercase text-slate-400">
                Calo
              </p>
              <p className="mt-1 text-base font-black text-slate-800">
                {menu.calories}
                <span className="text-[9px] font-bold text-slate-400">
                  {" "}
                  kcal
                </span>
              </p>
            </div>
          </div>
        </div>

        <div className="meal-menu-card__body p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-[.12em] text-slate-400">
                Thực đơn trong ngày
              </p>
              <h2 className="mt-1 text-xl font-black tracking-tight text-slate-900">
                {menu.menuName}
              </h2>
            </div>
            <button
              type="button"
              onClick={onDetails}
              className="hidden items-center gap-1 text-xs font-extrabold text-orange-600 sm:inline-flex"
            >
              Chi tiết <ChevronRight size={15} />
            </button>
          </div>
          <div className="mt-5 grid gap-3">
            {[
              {
                label: "BỮA TRƯA",
                value: menu.lunch,
                rowClass: "border-emerald-100 bg-emerald-50/60",
                labelClass: "text-emerald-700",
              },
              {
                label: "BỮA PHỤ",
                value: menu.snack,
                rowClass: "border-amber-100 bg-amber-50/60",
                labelClass: "text-amber-700",
              },
              {
                label: "BỮA CHIỀU",
                value: menu.afternoon,
                rowClass: "border-indigo-100 bg-indigo-50/60",
                labelClass: "text-indigo-700",
              },
            ].map(({ label, value, rowClass, labelClass }) => (
              <div
                key={label}
                className={`flex items-start gap-3 rounded-xl border p-3 ${rowClass}`}
              >
                <span
                  className={`min-w-[72px] rounded-md bg-white px-2 py-1 text-center text-[9px] font-extrabold ${labelClass}`}
                >
                  {label}
                </span>
                <p className="text-xs font-semibold leading-5 text-slate-700">
                  {value}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-dashed border-slate-200 pt-4">
            <div className="flex items-center gap-2 text-[11px] font-bold text-slate-500">
              <span className="rounded-md bg-orange-50 p-1.5 text-orange-500">
                <Flame size={14} />
              </span>
              Năng lượng trong ngưỡng
            </div>
            <div className="flex items-center gap-2 text-[11px] font-bold text-slate-500">
              <span className="rounded-md bg-blue-50 p-1.5 text-blue-500">
                <PieChart size={14} />
              </span>
              PLG <b className="text-slate-800">{menu.macros}</b>
            </div>
            <button
              type="button"
              onClick={onDetails}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-slate-900 px-3 py-2 text-[11px] font-extrabold text-white transition hover:bg-orange-600 sm:w-auto"
            >
              Xem chi tiết <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

function MenuDetailDialog({
  menu,
  onClose,
}: {
  menu: MenuRecord;
  onClose: () => void;
}) {
  return (
    <div
      className="meal-detail-overlay fixed inset-0 z-40 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="menu-detail-title"
    >
      <div className="meal-detail-dialog max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-[#f3f4f6] shadow-2xl">
        <div className="meal-detail-dialog__header sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4 sm:px-7">
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-orange-600">
              Chi tiết thực đơn
            </p>
            <h2
              id="menu-detail-title"
              className="mt-1 text-lg font-black text-slate-900"
            >
              {menu.menuName} · {menu.school}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:border-orange-300 hover:text-orange-600"
            aria-label="Đóng chi tiết thực đơn"
          >
            <X size={18} />
          </button>
        </div>
        <div className="meal-detail-dialog__content space-y-4 p-4 sm:p-7">
          <section className="meal-detail-card meal-detail-summary rounded-xl border border-slate-200 bg-white p-5">
            <div className="meal-detail-section-heading">
              <span aria-hidden="true" />
              <h3>Chi tiết thực đơn</h3>
            </div>
            <div className="meal-detail-summary-grid mt-4 grid gap-3 sm:grid-cols-4">
              {[
                ["Ngày áp dụng", `${menu.day} ${menu.month} ${menu.year}`],
                ["Lứa tuổi", menu.ageGroup],
                ["Tổng suất ăn", `${menu.servedCount} suất`],
                ["Tiền thu 1 suất", menu.price],
              ].map(([label, value]) => (
                <div className="meal-detail-field" key={label}>
                  <p>{label}</p>
                  <div>{value}</div>
                </div>
              ))}
            </div>
          </section>
          <section className="meal-detail-card overflow-hidden rounded-xl border border-slate-200 bg-white">
            <div className="meal-detail-section-heading px-5 pt-4">
              <span aria-hidden="true" />
              <h3>Chọn món ăn theo từng buổi</h3>
            </div>
            <p className="meal-detail-section-description px-5 pt-2">
              Các món ăn được phê duyệt cho ngày áp dụng.
            </p>
            <div className="meal-detail-meals space-y-1 p-5">
              <MealLine label="BỮA TRƯA" value={menu.lunch} tone="lunch" />
              <MealLine label="BỮA PHỤ" value={menu.snack} tone="snack" />
              <MealLine
                label="BỮA CHIỀU"
                value={menu.afternoon}
                tone="afternoon"
              />
            </div>
          </section>
          <section className="meal-detail-card overflow-hidden rounded-xl border border-slate-200 bg-white">
            <div className="meal-detail-section-heading px-5 pt-4">
              <span aria-hidden="true" />
              <h3>Tổng hợp dinh dưỡng</h3>
            </div>
            <p className="meal-detail-section-description px-5 pt-2">
              Chỉ số dinh dưỡng được tính theo khẩu phần trong ngày.
            </p>
            <div className="overflow-x-auto">
              <table className="meal-detail-nutrition-table mt-3 w-full min-w-[620px] text-left text-xs">
                <thead>
                  <tr>
                    <th className="px-5 py-3">Chỉ tiêu</th>
                    <th className="px-5 py-3">Tổng cộng</th>
                    <th className="px-5 py-3">Khoảng khuyến nghị</th>
                    <th className="px-5 py-3">Đánh giá</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Calo (kcal)", menu.calories, menu.caloriesRange],
                    ["Đạm (%)", "14", "13–20"],
                    ["Lipit (%)", "48", "30–40"],
                    ["Gluxit (%)", "38", "40–50"],
                  ].map(([label, total, range]) => (
                    <tr key={label}>
                      <td className="px-5 py-3 font-bold text-slate-700">
                        {label}
                      </td>
                      <td className="px-5 py-3 font-black text-slate-800">
                        {total}
                      </td>
                      <td className="px-5 py-3 text-slate-500">{range}</td>
                      <td className="px-5 py-3">
                        <span className="font-extrabold text-emerald-600">
                          Đạt
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
          <section className="meal-detail-card meal-detail-cost rounded-xl border border-orange-100 bg-orange-50 px-5 py-4">
            <div className="meal-detail-section-heading">
              <span aria-hidden="true" />
              <h3>Cân đối chi phí</h3>
            </div>
            <div className="meal-detail-cost-grid mt-3">
              <div>
                <span>Tiền thu</span>
                <strong>{menu.menuIncome}</strong>
              </div>
              <div>
                <span>Tiền chi</span>
                <strong>{menu.menuExpense}</strong>
              </div>
              <div>
                <span>Tiền thu 1 suất</span>
                <strong>{menu.price}</strong>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function RecipeCard({
  recipe,
  onDetails,
}: {
  recipe: RecipeRecord;
  onDetails: () => void;
}) {
  const accentClasses = {
    green: "from-emerald-100 via-lime-50 to-orange-100",
    orange: "from-orange-100 via-amber-50 to-rose-100",
    purple: "from-violet-100 via-fuchsia-50 to-orange-100",
  };

  return (
    <article className="recipe-card overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-[0_4px_20px_rgba(0,0,0,.08)] transition hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(0,0,0,.12)]">
      <div
        className={`recipe-card__visual relative flex h-56 items-center justify-center overflow-hidden bg-gradient-to-br ${accentClasses[recipe.accent]}`}
      >
        <div className="absolute -right-10 -top-14 h-44 w-44 rounded-full bg-white/45" />
        <div className="absolute -bottom-16 -left-8 h-44 w-44 rounded-full bg-white/35" />
        <div className="relative flex h-28 w-28 items-center justify-center rounded-full border-8 border-white/70 bg-white/65 text-orange-500 shadow-xl backdrop-blur-sm">
          <ChefHat size={62} strokeWidth={1.5} />
        </div>
        <span className="absolute left-4 top-4 rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-extrabold uppercase tracking-[.05em] text-emerald-600">
          {recipe.type}
        </span>
      </div>
      <div className="recipe-card__body flex min-h-[542px] flex-col gap-6 p-6">
        <div>
          <h2 className="text-[22px] font-bold leading-7 text-[#1f2937]">
            {recipe.name}
          </h2>
          <p className="mt-1 text-xs font-semibold leading-5 text-[#4b5563]">
            Mã món: {recipe.code}
          </p>
          <p className="text-[13px] font-semibold leading-5 text-[#4b5563]">
            Trường sở hữu: {recipe.school}
          </p>
        </div>

        <section>
          <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-[.025em] text-[#374151]">
            <Utensils size={14} className="text-[#f26522]" />
            Nguyên liệu cần giám sát
          </h3>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {recipe.ingredients.map((ingredient) => (
              <div
                key={ingredient}
                className="flex items-center gap-3 rounded-xl border border-slate-100 bg-[#f9fafb] px-3 py-3"
              >
                <span className="h-2 w-2 shrink-0 rounded-full bg-[#f26522]" />
                <span className="text-sm font-medium text-[#4b5563]">
                  {ingredient}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="border-t border-slate-100 pt-6">
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onDetails}
              className="inline-flex items-center gap-2 text-[15px] font-bold text-[#f26522] transition hover:text-orange-700"
            >
              Xem quy trình chế biến <ChevronRight size={14} />
            </button>
            <Clock3
              size={15}
              className="text-slate-400"
              aria-label={`Cập nhật ${recipe.updatedAt}`}
            />
          </div>
          <div className="relative mt-4 space-y-4 pl-1">
            <span
              className="absolute bottom-3 left-[11px] top-2 w-0.5 bg-slate-200"
              aria-hidden="true"
            />
            {recipe.steps.map((step, index) => (
              <div key={step} className="relative flex items-start gap-4">
                <span className="relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#f26522] text-[11px] font-bold text-white">
                  {index + 1}
                </span>
                <p className="pt-0.5 text-sm font-medium leading-[23px] text-[#4b5563]">
                  {step}
                </p>
              </div>
            ))}
          </div>
        </section>

        <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-4 text-[11px] font-semibold text-slate-400">
          <span>Cập nhật lần cuối</span>
          <span>{recipe.updatedAt}</span>
        </div>
      </div>
    </article>
  );
}

function RecipeDetailDialog({
  recipe,
  onClose,
}: {
  recipe: RecipeRecord;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="recipe-detail-title"
    >
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white px-6 py-5">
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-[.12em] text-[#f26522]">
              Quy trình chế biến
            </p>
            <h2
              id="recipe-detail-title"
              className="mt-1 text-xl font-bold text-slate-900"
            >
              {recipe.name}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:border-orange-300 hover:text-orange-600"
            aria-label="Đóng quy trình chế biến"
          >
            <X size={18} />
          </button>
        </div>
        <div className="space-y-6 p-6">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
              <p className="text-[11px] font-semibold text-slate-500">Mã món</p>
              <p className="mt-1 text-sm font-bold text-slate-800">
                {recipe.code}
              </p>
            </div>
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
              <p className="text-[11px] font-semibold text-slate-500">
                Trường sở hữu
              </p>
              <p className="mt-1 text-sm font-bold text-slate-800">
                {recipe.school}
              </p>
            </div>
          </div>
          <div>
            <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-[.025em] text-slate-700">
              <Utensils size={15} className="text-[#f26522]" /> Nguyên liệu
            </h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {recipe.ingredients.map((ingredient) => (
                <span
                  key={ingredient}
                  className="rounded-full bg-orange-50 px-3 py-1.5 text-xs font-bold text-orange-700"
                >
                  {ingredient}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-[.025em] text-slate-700">
              <ChefHat size={15} className="text-[#f26522]" /> Các bước thực
              hiện
            </h3>
            <div className="relative mt-4 space-y-4 pl-1">
              <span
                className="absolute bottom-3 left-[11px] top-2 w-0.5 bg-slate-200"
                aria-hidden="true"
              />
              {recipe.steps.map((step, index) => (
                <div key={step} className="relative flex items-start gap-4">
                  <span className="relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#f26522] text-[11px] font-bold text-white">
                    {index + 1}
                  </span>
                  <p className="pt-0.5 text-sm leading-6 text-slate-600">
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AdminMealManagementPage({ page }: { page: MealPageKey }) {
  const config = mealData[page];
  const Icon = config.icon;
  const [search, setSearch] = useState("");
  const [ward, setWard] = useState("Tất cả Xã/Phường");
  const [school, setSchool] = useState("Tất cả các trường");
  const [time, setTime] = useState("Chọn thời gian");
  const [selectedMenu, setSelectedMenu] = useState<MenuRecord | null>(null);
  const [recipeWard, setRecipeWard] = useState("Tất cả Xã/Phường");
  const [recipeType, setRecipeType] = useState("Tất cả loại món");
  const [recipeSchool, setRecipeSchool] = useState("Tất cả các trường");
  const [selectedRecipe, setSelectedRecipe] = useState<RecipeRecord | null>(
    null,
  );
  const rows = config.rows.filter((row) =>
    row.join(" ").toLowerCase().includes(search.toLowerCase()),
  );

  if (page === "recipes") {
    const filteredRecipes = recipeRecords.filter(
      (recipe) =>
        (recipeType === "Tất cả loại món" || recipe.type === recipeType) &&
        (recipeSchool === "Tất cả các trường" ||
          recipe.school === recipeSchool) &&
        (recipeWard === "Tất cả Xã/Phường" || recipe.ward === recipeWard) &&
        (!search ||
          `${recipe.name} ${recipe.code} ${recipe.school} ${recipe.type}`
            .toLowerCase()
            .includes(search.toLowerCase())),
    );
    const clearRecipeFilters = () => {
      setSearch("");
      setRecipeWard("Tất cả Xã/Phường");
      setRecipeType("Tất cả loại món");
      setRecipeSchool("Tất cả các trường");
    };

    return (
      <AdminShell>
        <div className="recipe-management-page min-h-[calc(100dvh-65px)] bg-[#f9fafb]">
          <div className="recipe-management-page__content mx-auto max-w-[1180px] px-4 pb-12 pt-8 sm:px-7 lg:px-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[.12em] text-[#f26522]">
                  Quản lý bữa ăn
                </p>
                <h1 className="mt-1 text-[25px] font-bold tracking-tight text-[#1f2937]">
                  Danh sách món ăn
                </h1>
                <p className="mt-1 text-sm text-[#6b7280]">
                  Quản lý nguyên liệu và quy trình chế biến đang áp dụng tại các
                  bếp ăn.
                </p>
              </div>
              <div className="relative w-full lg:w-80">
                <Search
                  size={17}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#9ca3af]"
                />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Tìm kiếm tên món, mã món..."
                  className="h-[46px] w-full rounded-xl border border-[#e5e7eb] bg-white pl-11 pr-4 text-sm text-[#374151] outline-none transition placeholder:text-[#9ca3af] focus:border-[#f26522] focus:ring-4 focus:ring-orange-100"
                  aria-label="Tìm kiếm tên món, mã món"
                />
              </div>
            </div>

            <section className="recipe-filter-card mt-7 rounded-2xl border border-[#f3f4f6] bg-white p-6 shadow-[0_1px_2px_rgba(0,0,0,.05)]">
              <div className="grid gap-5 md:grid-cols-3">
                <MenuFilterSelect
                  label="Xã / phường"
                  value={recipeWard}
                  onChange={setRecipeWard}
                  options={[
                    "Tất cả Xã/Phường",
                    ...Array.from(
                      new Set(recipeRecords.map((recipe) => recipe.ward)),
                    ),
                  ]}
                />
                <MenuFilterSelect
                  label="Trường học"
                  value={recipeSchool}
                  onChange={setRecipeSchool}
                  options={[
                    "Tất cả các trường",
                    ...Array.from(
                      new Set(recipeRecords.map((recipe) => recipe.school)),
                    ),
                  ]}
                />
                <MenuFilterSelect
                  label="Loại món ăn"
                  value={recipeType}
                  onChange={setRecipeType}
                  options={["Tất cả loại món", "Lỏng", "Mặn", "Món cho trẻ"]}
                />
              </div>
              <div className="mt-5 flex justify-end">
                <button
                  type="button"
                  onClick={clearRecipeFilters}
                  className="inline-flex items-center gap-2 text-sm font-bold text-[#f26522] transition hover:text-orange-700"
                >
                  <X size={15} /> Đặt lại bộ lọc
                </button>
              </div>
            </section>

            <div className="mb-4 mt-8 flex items-end justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-[#1f2937]">
                  Món ăn đang áp dụng
                </h2>
                <p className="mt-1 text-xs font-medium text-[#6b7280]">
                  {filteredRecipes.length} món ăn · Cập nhật theo hồ sơ bếp ăn
                </p>
              </div>
              <span className="hidden rounded-full bg-orange-50 px-3 py-1.5 text-xs font-bold text-orange-700 sm:inline-flex">
                {recipeRecords.length} hồ sơ
              </span>
            </div>

            {filteredRecipes.length ? (
              <div className="grid items-start gap-5 xl:grid-cols-3">
                {filteredRecipes.map((recipe) => (
                  <RecipeCard
                    key={recipe.id}
                    recipe={recipe}
                    onDetails={() => setSelectedRecipe(recipe)}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                title="Không tìm thấy món ăn"
                description="Thử thay đổi từ khóa hoặc bộ lọc."
              />
            )}
          </div>
        </div>
        {selectedRecipe && (
          <RecipeDetailDialog
            recipe={selectedRecipe}
            onClose={() => setSelectedRecipe(null)}
          />
        )}
      </AdminShell>
    );
  }

  if (page === "menus") {
    const filteredMenus = menuRecords.filter(
      (menu) =>
        (ward === "Tất cả Xã/Phường" || menu.ward === ward) &&
        (school === "Tất cả các trường" || menu.school === school) &&
        (time === "Chọn thời gian" || `${menu.month} ${menu.year}` === time) &&
        (!search ||
          `${menu.school} ${menu.menuName} ${menu.ageGroup}`
            .toLowerCase()
            .includes(search.toLowerCase())),
    );
    const clearFilters = () => {
      setWard("Tất cả Xã/Phường");
      setSchool("Tất cả các trường");
      setTime("Chọn thời gian");
      setSearch("");
    };
    return (
      <AdminShell>
        <div className="meal-management-page min-h-[calc(100dvh-65px)] bg-[#f9fafb]">
          <div className="meal-management-page__header border-b border-slate-200/80 bg-white px-5 py-5 lg:px-10">
            <div className="mx-auto flex max-w-[1180px] items-end justify-between gap-4">
              <div>
                <div className="mb-2 flex items-center gap-2 text-[11px] font-semibold text-slate-400">
                  <span>Quản lý bữa ăn</span>
                  <ChevronRight size={13} />
                  <span className="text-slate-600">Danh sách thực đơn</span>
                </div>
                <h1 className="text-[24px] font-black tracking-tight text-slate-900">
                  Danh sách thực đơn
                </h1>
                <p className="mt-1 text-xs font-medium text-slate-500">
                  Chọn đúng trường và ngày để xem khẩu phần, suất ăn và dinh
                  dưỡng.
                </p>
              </div>
              <div className="hidden items-center gap-2 rounded-xl bg-orange-50 px-3 py-2 text-xs font-extrabold text-orange-700 sm:flex">
                <Utensils size={15} /> {filteredMenus.length} thực đơn đang theo
                dõi
              </div>
            </div>
          </div>
          <div className="meal-management-page__content mx-auto max-w-[1180px] px-4 py-6 sm:px-7 lg:px-10">
            <section className="meal-filter-card rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_5px_20px_rgba(15,23,42,.035)]">
              <div className="mb-4 flex items-center gap-2 text-xs font-extrabold text-slate-800">
                <SlidersHorizontal size={15} className="text-orange-600" /> Bộ
                lọc thực đơn
                <span className="ml-auto text-[10px] font-semibold text-slate-400">
                  Cập nhật hôm nay
                </span>
              </div>
              <div className="grid gap-3 md:grid-cols-[1fr_1fr_1fr_1.2fr]">
                <MenuFilterSelect
                  label="Xã / phường"
                  value={ward}
                  onChange={setWard}
                  options={[
                    "Tất cả Xã/Phường",
                    ...Array.from(
                      new Set(menuRecords.map((menu) => menu.ward)),
                    ),
                  ]}
                />
                <MenuFilterSelect
                  label="Trường học"
                  value={school}
                  onChange={setSchool}
                  options={[
                    "Tất cả các trường",
                    ...Array.from(
                      new Set(menuRecords.map((menu) => menu.school)),
                    ),
                  ]}
                />
                <MenuFilterSelect
                  label="Thời gian"
                  value={time}
                  onChange={setTime}
                  options={["Chọn thời gian", "Tháng 01 2026"]}
                />
                <label className="block">
                  <span className="meal-field-label mb-2 block text-[10px] font-extrabold uppercase tracking-[0.08em] text-slate-500">
                    Tìm kiếm
                  </span>
                  <span className="relative block">
                    <Search
                      size={14}
                      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      value={search}
                      onChange={(event) => setSearch(event.target.value)}
                      placeholder="Tên trường hoặc thực đơn..."
                      className="meal-field-control h-11 w-full rounded-lg border border-slate-200 bg-[#fbfcfd] pl-9 pr-3 text-xs font-semibold text-slate-700 outline-none placeholder:text-slate-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                    />
                  </span>
                </label>
              </div>
            </section>
            <div className="mb-3 mt-7 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-black text-slate-800">
                  Thực đơn theo ngày
                </h2>
                <p className="mt-1 text-[11px] font-medium text-slate-400">
                  {filteredMenus.length} kết quả · Sắp xếp theo ngày áp dụng
                </p>
              </div>
              <button
                type="button"
                onClick={clearFilters}
                className="text-xs font-extrabold text-orange-600 transition hover:text-orange-700"
              >
                Xóa bộ lọc
              </button>
            </div>
            <div className="space-y-4">
              {filteredMenus.length ? (
                filteredMenus.map((menu) => (
                  <MenuCard
                    key={menu.id}
                    menu={menu}
                    onDetails={() => setSelectedMenu(menu)}
                  />
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
                  <Utensils size={28} className="mx-auto text-slate-300" />
                  <p className="mt-3 text-sm font-extrabold text-slate-700">
                    Không có thực đơn phù hợp
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    Thử thay đổi phường, trường hoặc thời gian lọc.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
        {selectedMenu && (
          <MenuDetailDialog
            menu={selectedMenu}
            onClose={() => setSelectedMenu(null)}
          />
        )}
      </AdminShell>
    );
  }

  return (
    <AdminShell>
      <div className="mx-auto max-w-7xl px-5 py-9 lg:px-10">
        <SectionHeading
          eyebrow={config.eyebrow}
          title={`${config.title}.`}
          description={config.description}
          action={
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-bold text-primary-foreground"
            >
              <Icon size={17} /> Thêm dữ liệu
            </button>
          }
        />
        <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
          <div className="border-b border-border p-5">
            <div className="relative max-w-md">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder={`Tìm trong ${config.title.toLowerCase()}...`}
                className="focus-ring h-11 w-full rounded-xl border border-input bg-background pl-9 pr-3 text-sm"
              />
            </div>
          </div>
          {rows.length ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead className="bg-secondary/50 text-xs uppercase tracking-wide text-muted-foreground">
                  <tr>
                    {config.columns.map((column) => (
                      <th key={column} className="px-5 py-4 font-extrabold">
                        {column}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {rows.map((row, index) => (
                    <tr
                      key={`${row[0]}-${index}`}
                      className="hover:bg-secondary/20"
                    >
                      {row.map((value, cellIndex) => (
                        <td
                          key={`${value}-${cellIndex}`}
                          className="px-5 py-4 font-semibold"
                        >
                          {cellIndex === row.length - 1 &&
                          (value === "Đã duyệt" ||
                            value === "Đạt" ||
                            value === "Đã ban hành") ? (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-900">
                              <CheckCircle2 size={13} /> {value}
                            </span>
                          ) : (
                            value
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState
              title="Không tìm thấy dữ liệu"
              description="Thử thay đổi từ khóa tìm kiếm."
            />
          )}
        </div>
      </div>
    </AdminShell>
  );
}
