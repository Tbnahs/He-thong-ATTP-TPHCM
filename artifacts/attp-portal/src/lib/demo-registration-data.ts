import type { ApplicationType, CriteriaAnswerType } from "./mock-data";

export type DemoRegistrationProfile = {
  organization: string;
  facilityName: string;
  address: string;
  addressDetail: string;
  province: string;
  ward: string;
  taxCode: string;
  phone: string;
  email: string;
  contactName: string;
  contactTitle: string;
  citizenId: string;
  representative: string;
  representativeTitle: string;
  licenseNumber: string;
  licenseExpires: string;
  providerName: string;
  providerAddress: string;
  providerTaxCode: string;
  providerRepresentative: string;
};

const profiles: Record<ApplicationType, DemoRegistrationProfile> = {
  school: {
    organization: "Trường Tiểu học Bình Minh",
    facilityName: "Bếp ăn bán trú Trường Tiểu học Bình Minh",
    address: "35 Nguyễn Du, phường Bến Nghé, TP. Hồ Chí Minh",
    addressDetail: "35 Nguyễn Du",
    province: "TP. Hồ Chí Minh",
    ward: "Phường Bến Nghé",
    taxCode: "0310000001",
    phone: "028 3822 4567",
    email: "binhminh.school@example.com",
    contactName: "Nguyễn Thị Thu Hà",
    contactTitle: "Hiệu trưởng",
    citizenId: "079000000001",
    representative: "Nguyễn Thị Thu Hà",
    representativeTitle: "Hiệu trưởng",
    licenseNumber: "ATTP-DEMO-SCH-2026-01",
    licenseExpires: "2027-12-31",
    providerName: "Công ty Suất ăn Minh Tâm",
    providerAddress: "Khu công nghiệp Tân Bình, TP. Hồ Chí Minh",
    providerTaxCode: "0314567890",
    providerRepresentative: "Võ Hoàng Nam",
  },
  "meal-provider": {
    organization: "Công ty Suất ăn Minh Tâm",
    facilityName: "Bếp trung tâm Minh Tâm",
    address: "Khu công nghiệp Tân Bình, TP. Hồ Chí Minh",
    addressDetail: "Lô B2, Khu công nghiệp Tân Bình",
    province: "TP. Hồ Chí Minh",
    ward: "Phường Tân Bình",
    taxCode: "0314567890",
    phone: "028 3812 8899",
    email: "lienhe.minhtam@example.com",
    contactName: "Võ Hoàng Nam",
    contactTitle: "Trưởng bộ phận an toàn thực phẩm",
    citizenId: "079000000002",
    representative: "Trần Quốc Bảo",
    representativeTitle: "Giám đốc",
    licenseNumber: "ATTP-DEMO-MP-2026-01",
    licenseExpires: "2027-07-28",
    providerName: "Công ty Suất ăn Minh Tâm",
    providerAddress: "Khu công nghiệp Tân Bình, TP. Hồ Chí Minh",
    providerTaxCode: "0314567890",
    providerRepresentative: "Võ Hoàng Nam",
  },
  "food-supplier": {
    organization: "Công ty TNHH Nông sản An Phú",
    facilityName: "Kho sơ chế và phân phối An Phú",
    address: "184 Nguyễn Văn Linh, phường Tân Phong, TP. Hồ Chí Minh",
    addressDetail: "184 Nguyễn Văn Linh",
    province: "TP. Hồ Chí Minh",
    ward: "Phường Tân Phong",
    taxCode: "0312345678",
    phone: "0908 123 456",
    email: "lienhe.anphu@example.com",
    contactName: "Lê Minh Tuấn",
    contactTitle: "Quản lý cơ sở",
    citizenId: "079000000003",
    representative: "Lê Minh Tuấn",
    representativeTitle: "Giám đốc",
    licenseNumber: "ATTP-DEMO-FS-2026-01",
    licenseExpires: "2027-08-12",
    providerName: "Công ty TNHH Nông sản An Phú",
    providerAddress: "184 Nguyễn Văn Linh, phường Tân Phong, TP. Hồ Chí Minh",
    providerTaxCode: "0312345678",
    providerRepresentative: "Lê Minh Tuấn",
  },
};

const operationalAnswers: Record<string, string> = {
  mealTransparency:
    "Thực đơn, đơn giá và nhà cung cấp được niêm yết tại bảng tin bán trú; nhà trường gửi thực đơn tuần cho phụ huynh qua kênh thông tin chính thức.",
  incidentResponseProcess:
    "Tạm ngừng món ăn nghi ngờ, niêm phong và lưu mẫu; sơ cứu, liên hệ cơ sở y tế, thông báo Ban Giám hiệu và báo cơ quan chức năng theo quy trình của trường.",
  structure:
    "Bếp bố trí theo nguyên tắc một chiều, tách khu tiếp nhận, sơ chế, chế biến và chia suất; thực phẩm sống và chín dùng dụng cụ riêng.",
  environment:
    "Khu bếp tách biệt nhà vệ sinh và điểm tập kết rác, nền khô thoáng; cửa có lưới chắn côn trùng và được vệ sinh sau mỗi ca.",
  processDescription:
    "Tiếp nhận và kiểm tra nguyên liệu → sơ chế tại khu riêng → chế biến → chia suất; ghi nhận kiểm thực và bàn giao theo từng ca.",
  wallsCeiling:
    "Nền lát gạch chống trượt, tường ốp vật liệu nhẵn dễ vệ sinh; trần kín, không thấm dột và được làm sạch định kỳ.",
  lightingVentilation:
    "Đèn có chụp bảo vệ; khu nấu có chụp hút mùi và quạt thông gió, bảo đảm đủ ánh sáng khi sơ chế và chia suất.",
  drainage:
    "Sàn có độ dốc về rãnh thoát nước có nắp chắn rác; vệ sinh cuối mỗi ca, không để nước đọng.",
  wasteArea:
    "Rác được phân loại trong thùng có nắp, đưa ra điểm tập kết riêng sau mỗi ca; khu vực được vệ sinh hằng ngày.",
  changingRoom:
    "Nhân viên thay bảo hộ tại khu vực riêng, có tủ để đồ và bồn rửa tay trước khi vào khu chế biến.",
  rawStorageEquipment:
    "Kho khô có kệ kê cao; nguyên liệu cần làm lạnh được bảo quản riêng trong tủ mát và tủ đông, có theo dõi nhiệt độ.",
  foodStorageEquipment:
    "Thực phẩm sống và chín được bảo quản trong tủ/kệ riêng, có nhãn nhận diện và ghi ngày tiếp nhận.",
  sinkEquipment:
    "Bố trí riêng bồn rửa tay, bồn rửa rau củ và bồn rửa dụng cụ; có xà phòng và dụng cụ làm khô tay.",
  cookingEquipment:
    "02 tủ cơm công nghiệp, nồi nấu, chảo và khay inox; dụng cụ sống và chín được phân biệt bằng màu.",
  diningEquipment:
    "Khay, muỗng và hộp đựng bằng vật liệu phù hợp tiếp xúc thực phẩm; rửa, tráng và làm khô sau mỗi ca.",
  sampleEquipment:
    "Hộp lưu mẫu có nắp, ghi nhãn món ăn và thời gian lấy mẫu; bố trí tủ lạnh riêng để bảo quản mẫu.",
  pestControl:
    "Cửa lưới chống côn trùng, bẫy đèn tại khu vực phù hợp; kiểm tra và vệ sinh định kỳ, không đặt hóa chất cạnh thực phẩm.",
  wasteEquipment:
    "Thùng rác có nắp đậy, lót túi và phân loại; dụng cụ thu gom được vệ sinh sau khi sử dụng.",
  cookingStove:
    "04 bếp điện công nghiệp có chụp hút mùi; thiết bị được vệ sinh và kiểm tra an toàn trước mỗi ca.",
  rapidTestEquipment:
    "Có bộ test nhanh dùng trong kiểm tra nội bộ; kết quả kiểm tra được ghi vào sổ theo dõi của cơ sở.",
  protectiveClothing:
    "Nhân viên sử dụng tạp dề, mũ trùm tóc và khẩu trang; cấp phát đủ theo số người làm việc và thay khi bẩn.",
  foodSafetyPractice:
    "Nhân viên rửa tay trước khi chế biến, dùng dụng cụ riêng cho thực phẩm sống/chín và không làm việc khi có dấu hiệu bệnh.",
  internalControls:
    "Kiểm tra nguồn gốc khi nhận hàng, ghi nhiệt độ bảo quản, vệ sinh theo lịch và lưu hồ sơ giao nhận, kiểm thực.",
  threeStepInspection:
    "Thực hiện kiểm tra trước chế biến, trong chế biến và trước khi ăn; ghi người kiểm tra, thời gian và tình trạng món ăn.",
  sampleCollection:
    "Lấy mẫu riêng từng món sau khi chế biến, cho vào hộp sạch có nắp, ghi tên món và thời điểm lấy mẫu.",
  sampleStorage:
    "Mẫu được bảo quản tối thiểu 24 giờ trong tủ lạnh riêng ở 2–8°C; ghi nhãn, thời gian lấy và thời điểm hủy.",
  diningStructure:
    "Khu ăn uống trong nhà, nền dễ vệ sinh, bàn ghế kê thông thoáng và tách khỏi khu sơ chế.",
  diningEnvironment:
    "Khu ăn uống sạch, đủ lối đi và được vệ sinh trước, sau mỗi ca; không bố trí gần khu tập kết rác.",
  diningWallsCeiling:
    "Tường và trần sạch, không bong tróc; nền chống trượt, được lau khô sau khi vệ sinh.",
  diningLightingVentilation:
    "Đủ ánh sáng, có cửa thông gió và quạt; thiết bị được vệ sinh, bảo trì theo lịch.",
  diningDrainage:
    "Có rãnh thoát nước kín tại khu vệ sinh dụng cụ; không để nước đọng trong khu vực ăn uống.",
  diningWasteArea:
    "Thùng rác có nắp đặt tại các vị trí thuận tiện; rác được thu gom sau từng ca.",
  handwashingArea:
    "Bồn rửa tay có nước sạch, xà phòng và hướng dẫn rửa tay; bố trí trước lối vào khu ăn uống.",
  pestPrevention:
    "Lắp lưới chắn tại cửa, đóng cửa sau khi giao nhận và kiểm tra dấu hiệu côn trùng theo lịch vệ sinh.",
  waterTesting:
    "Sử dụng nước máy; lưu hồ sơ kiểm tra chất lượng nguồn nước và thực hiện kiểm nghiệm định kỳ theo kế hoạch của cơ sở.",
  waterTestingDetails:
    "Nguồn nước máy được kiểm nghiệm định kỳ 12 tháng/lần; lưu kết quả tại hồ sơ theo dõi ATTP.",
  otherContents:
    "Thực đơn được xây dựng theo tuần; hồ sơ giao nhận nguyên liệu, vệ sinh và kiểm thực được lưu tại cơ sở để đối chiếu.",
  confirmation:
    "Bản mẫu phục vụ trình diễn; người đại diện cần đối chiếu từng nội dung với hồ sơ thực tế trước khi xác nhận và nộp.",
};

export const createDemoRegistrationProfile = (
  type: ApplicationType,
  provinceOptions: string[],
  wardOptions: string[],
): DemoRegistrationProfile => {
  const profile = profiles[type];
  const province =
    provinceOptions.find((option) => option.includes("Hồ Chí Minh")) ??
    "TP. Hồ Chí Minh";
  const ward = wardOptions.includes(profile.ward)
    ? profile.ward
    : wardOptions.find((option) => option.includes("Bến Nghé")) ??
      wardOptions[0] ??
      profile.ward;
  return { ...profile, ward, address: profile.address.replace(profile.ward, ward), province };
};

export const makeDemoRegistrationAnswer = (
  type: ApplicationType,
  profile: DemoRegistrationProfile,
  key: string,
  label: string,
  answerType: CriteriaAnswerType,
  options: string[] = [],
  parentKey = "",
  rowIndex = 0,
): string | string[] => {
  const normalized = `${key} ${label}`.toLocaleLowerCase("vi");
  const today = new Date().toISOString().slice(0, 10);

  if (answerType === "number") {
    const fixedNumbers: Record<string, string> = {
      studentTotal: "720",
      boardingStudentTotal: "520",
      totalCapacity: "1200",
      servingUnitCount: "2",
      capacity: "520",
      morningCapacity: "0",
      lunchCapacity: type === "school" ? "520" : "1200",
      snackCapacity: type === "school" ? "80" : "160",
      dinnerCapacity: "0",
      breakfastCapacity: "80",
      totalStaff: "42",
      directStaff: "30",
      fullTimeStaff: "24",
      partTimeStaff: "6",
      indirectStaff: "12",
      indirectFullTimeStaff: "10",
      indirectPartTimeStaff: "2",
      trainedStaff: "42",
      trainedStaffTotal: "42",
      healthCheckedStaff: "42",
      healthCheckedStaffTotal: "42",
      totalFoodStaff: type === "school" ? "18" : "42",
      directFoodStaff: type === "school" ? "15" : "30",
      directFullTimeFoodStaff: "12",
      directPartTimeFoodStaff: "3",
      indirectFoodStaff: type === "school" ? "3" : "12",
      indirectFullTimeFoodStaff: "2",
      indirectPartTimeFoodStaff: "1",
      trainedFoodStaff: type === "school" ? "18" : "42",
      trainedFoodStaffTotal: type === "school" ? "18" : "42",
      healthCheckedFoodStaff: type === "school" ? "18" : "42",
      healthCheckedFoodStaffTotal: type === "school" ? "18" : "42",
      totalArea: type === "school" ? "280" : "480",
      preparationArea: "60",
      processingArea: type === "school" ? "100" : "220",
      servingArea: "45",
      diningAreaSize: "240",
      prepTables: "8",
      quantity: parentKey === "suppliedUnits" ? "520" : "2",
      equipmentCount: "3",
      rawFoodQuantity: "12",
      cookedFoodQuantity: "12",
      morningQuantity: "0",
      lunchQuantity: "520",
      snackQuantity: "80",
      afternoonQuantity: "0",
      serviceAmendmentSequence: "1",
      serviceSiteAmendmentSequence: "1",
      canteenAmendmentSequence: "1",
    };
    if (fixedNumbers[key]) return fixedNumbers[key];
    if (parentKey === "transportVehicles" && key === "quantity") return "4";
    if (/(diện tích|area)/i.test(normalized)) return "180";
    if (/(số suất|capacity|công suất)/i.test(normalized)) return "520";
    if (/(nhân sự|nhân viên|staff|người)/i.test(normalized)) return "18";
    if (/(lần thay đổi|sequence)/i.test(normalized)) return "1";
    return "2";
  }

  if (answerType === "date") {
    if (key === "surveyDate") return today;
    if (/(expires|expiry|hết hạn)/i.test(normalized)) return profile.licenseExpires;
    if (/(contract|hợp đồng)/i.test(normalized)) return "2026-07-01";
    if (/(initial|lần đầu)/i.test(normalized)) return "2018-08-15";
    if (/(amendment|thay đổi)/i.test(normalized)) return "2024-06-20";
    if (/(issue|ngày cấp)/i.test(normalized)) return "2021-08-15";
    return "2026-08-15";
  }

  if (answerType === "yes-no") {
    return options.includes("Có") ? "Có" : options[0] ?? "Có";
  }

  if (answerType === "select") {
    const preferred: Record<string, string> = {
      addressProvince: profile.province,
      addressWard: profile.ward,
      managementForm: "Công lập",
      qualityCertificateStatus:
        "Đối tượng thuộc diện cấp giấy chứng nhận quản lý chất lượng",
      diningAreaType: "Có nhà ăn riêng biệt",
      priceRange: "Từ 30.000 đến 35.000 đồng",
      documentType: "Giấy chứng nhận cơ sở đủ điều kiện ATTP",
      certificateType: "GCNĐĐK ATTP",
      certificateType2: "ISO 22000:2018",
      testingStatus: "Có thực hiện",
      testingFrequency: "12 tháng",
      waterSource: "Nước máy",
      waterType: "Nước uống đóng bình, đóng chai",
      unitType: type === "food-supplier" ? "Cơ sở cung cấp suất ăn" : "Cơ sở giáo dục",
      target: "Cơ sở giáo dục",
      equipmentType: "Tủ mát",
      stoveType: "Bếp điện",
      sinkType: rowIndex === 0 ? "Bồn rửa tay" : "Bồn rửa rau",
      ownership: "Xe thuộc công ty",
      category:
        parentKey === "products"
          ? options[Math.min(rowIndex, 1)] ?? options[0] ?? ""
          : options[0] ?? "",
    };
    const preferredValue = preferred[key];
    if (preferredValue && options.includes(preferredValue)) return preferredValue;
    if (key === "addressProvince") {
      return options.find((option) => option.includes("Hồ Chí Minh")) ?? options[0] ?? "";
    }
    if (key === "addressWard") {
      return options.includes(profile.ward) ? profile.ward : options[0] ?? "";
    }
    if (key === "productCategory" && options.length > 1) {
      return options[Math.min(rowIndex, options.length - 1)];
    }
    return options[0] ?? "";
  }

  if (answerType === "multi-select") {
    if (key === "educationLevels") {
      return options.includes("Tiểu học") ? ["Tiểu học"] : [options[0]].filter(Boolean);
    }
    if (key === "waterSources") {
      return options.includes("Nước máy") ? ["Nước máy"] : [options[0]].filter(Boolean);
    }
    if (key === "productGroups") {
      const selected = ["Rau, củ, quả", "Thịt"].filter((option) =>
        options.includes(option),
      );
      return selected.length > 0 ? selected : [options[0]].filter(Boolean);
    }
    return options.length > 0 ? [options[0]] : [];
  }

  if (parentKey === "foodSafetyContacts") {
    const contacts = [
      {
        name: "Trần Thị Mai",
        title: "Nhân viên y tế học đường",
        phone: "0908 234 567",
        email: "yte.binhminh@example.com",
      },
      {
        name: "Lê Văn Phúc",
        title: "Nhân viên phụ trách bếp ăn",
        phone: "0918 345 678",
        email: "phuc.bep@example.com",
      },
    ];
    return contacts[rowIndex]?.[key as keyof (typeof contacts)[number]] ?? profile.contactName;
  }

  if (
    parentKey === "serviceFoodSafetyContacts" ||
    parentKey === "canteenFoodSafetyContacts"
  ) {
    const contact: Record<string, string> = {
      name: profile.providerRepresentative,
      title: "Trưởng bộ phận an toàn thực phẩm",
      phone: "0907 220 668",
      email: "antoanthucpham.minhtam@example.com",
    };
    return contact[key] ?? profile.providerRepresentative;
  }

  if (parentKey === "ingredientSuppliers") {
    const supplier = rowIndex === 0
      ? {
          name: "Công ty TNHH Nông sản An Phú",
          headOfficeAddress: "184 Nguyễn Văn Linh, phường Tân Phong, TP. Hồ Chí Minh",
          dispatchAddress: "Kho sơ chế An Phú, 184 Nguyễn Văn Linh, TP. Hồ Chí Minh",
          contractNumber: "HD-NL-2026-008",
        }
      : {
          name: "Công ty TNHH Thực phẩm Hưng Phát",
          headOfficeAddress: "25 Đường số 8, TP. Hồ Chí Minh",
          dispatchAddress: "Kho Hưng Phát, TP. Hồ Chí Minh",
          contractNumber: "HD-NL-2026-012",
        };
    return supplier[key as keyof typeof supplier] ?? profile.organization;
  }

  if (parentKey === "products") {
    if (key === "name") {
      return rowIndex === 0 ? "Rau củ quả tươi theo mùa" : "Thịt heo sơ chế";
    }
    if (key === "origin") {
      return rowIndex === 0
        ? "Hợp tác xã rau an toàn Củ Chi"
        : "Trang trại liên kết Bình Minh";
    }
    if (key === "gtin") return rowIndex === 0 ? "8938501234567" : "8938501234574";
  }

  if (parentKey === "suppliedUnits") {
    const unitValues: Record<string, string> = {
      name: "Trường Tiểu học Bình Minh",
      unitName: "Trường Tiểu học Bình Minh",
      unitAddress: "35 Nguyễn Du, phường Bến Nghé, TP. Hồ Chí Minh",
      taxCode: "0310000001",
    };
    return unitValues[key] ?? profile.organization;
  }

  if (
    parentKey === "certificates" ||
    parentKey === "qualityCertificates" ||
    parentKey === "serviceQualityCertificates" ||
    parentKey === "canteenQualityCertificates"
  ) {
    const certificateValues: Record<string, string> = {
      number: "ATTP-HCM-DEMO-2026-018",
      issueDate: "2025-08-15",
      expiryDate: "2027-08-14",
      issuer: "Sở An toàn thực phẩm TP. Hồ Chí Minh",
      location: profile.providerAddress,
      scope: "Sơ chế, chế biến và cung cấp suất ăn cho trường học",
    };
    return certificateValues[key] ?? profile.providerName;
  }

  if (parentKey === "sampleStorageDetails") {
    const sampleValues: Record<string, string> = {
      material: "Hộp inox có nắp, dung tích phù hợp",
      collectionMethod: "Lấy riêng từng món sau khi chế biến, ghi nhãn và thời gian",
      storageDuration: "Tối thiểu 24 giờ",
      storageTemperature: "2–8°C",
      storageArea: "Tủ lạnh lưu mẫu riêng tại khu bếp",
      storageCabinet: "Tủ lưu mẫu chuyên dụng, có theo dõi nhiệt độ",
    };
    return sampleValues[key] ?? "3";
  }

  if (parentKey === "readyMealDeliverySites") {
    const deliveryValues: Record<string, string> = {
      siteName: "Trường Tiểu học Bình Minh",
      morningTime: "06:30",
      morningQuantity: "0",
      lunchTime: "10:30",
      lunchQuantity: "520",
      snackTime: "14:15",
      snackQuantity: "80",
      afternoonTime: "0",
      afternoonQuantity: "0",
    };
    return deliveryValues[key] ?? "10:30";
  }

  if (parentKey === "drinkingWater") {
    const drinkingWaterValues: Record<string, string> = {
      supplierName: "Công ty Nước uống An Lành",
      supplierAddress: "12 Đường số 8, TP. Hồ Chí Minh",
      dispatchAddress: "Kho phân phối An Lành, TP. Hồ Chí Minh",
      contractNumber: "HD-NUOC-2026-004",
      certificateType: "Giấy chứng nhận cơ sở đủ điều kiện ATTP",
      testing: "Kiểm nghiệm định kỳ 06 tháng/lần; lưu kết quả tại hồ sơ cơ sở.",
    };
    return drinkingWaterValues[key] ?? "2026-06-01";
  }

  if (
    parentKey === "rawStorageInventory" ||
    parentKey === "foodStorageInventory"
  ) {
    if (key === "notes") return "Thiết bị có nhiệt kế; vệ sinh và kiểm tra nhiệt độ hằng ngày.";
  }
  if (parentKey === "cookingUtensilInventory" && key === "utensilType") {
    return "Khay inox chia suất";
  }
  if (parentKey === "transportVehicles" && key === "vehicleType") {
    return "Xe tải bảo ôn";
  }

  const directText: Record<string, string> = {
    applicantName: profile.organization,
    surveyedOrganization: profile.organization,
    informationProvider: profile.contactName,
    informationProviderPosition: profile.contactTitle,
    surveyLocation: profile.address,
    addressMain: profile.address,
    addressDetail: profile.addressDetail,
    headquartersAddress: profile.address,
    facilityAddress: profile.address,
    facilityName: profile.facilityName,
    legalName: profile.organization,
    legalRepresentative: profile.representative,
    legalRepresentativeTitle: profile.representativeTitle,
    facilityRepresentative: profile.representative,
    facilityRepresentativeTitle: profile.representativeTitle,
    foodSafetyContactName: profile.contactName,
    foodSafetyContactTitle: profile.contactTitle,
    foodSafetyContactPhone: profile.phone,
    foodSafetyContactEmail: profile.email,
    principalName: "Nguyễn Thị Thu Hà",
    establishmentDecision: "Quyết định số 112/QĐ-UBND ngày 15/08/2018",
    principalDecision: "Quyết định số 146/QĐ-PGDĐT ngày 20/08/2025",
    branchCode: `${profile.taxCode}-001`,
    taxIssuePlace: "Sở Kế hoạch và Đầu tư TP. Hồ Chí Minh",
    branchIssuePlace: "Sở Kế hoạch và Đầu tư TP. Hồ Chí Minh",
    serviceLegalName: profile.providerName,
    serviceHeadquartersAddress: profile.providerAddress,
    serviceTaxCode: profile.providerTaxCode,
    serviceIssuePlace: "Sở Kế hoạch và Đầu tư TP. Hồ Chí Minh",
    serviceRepresentative: profile.providerRepresentative,
    serviceRepresentativeTitle: "Giám đốc",
    serviceSiteName: "Bếp trung tâm Minh Tâm",
    serviceSiteAddress: profile.providerAddress,
    serviceSiteBusinessCode: `${profile.providerTaxCode}-001`,
    serviceSiteIssuePlace: "Sở Kế hoạch và Đầu tư TP. Hồ Chí Minh",
    serviceSiteRepresentative: profile.providerRepresentative,
    serviceSiteRepresentativeTitle: "Quản lý cơ sở",
    serviceContractNumber: "HD-ATTP-2026-028",
    canteenName: "Căng tin Trường Tiểu học Bình Minh",
    canteenAddress: profile.address,
    canteenIdentifier: "0310000001-CT",
    canteenRepresentative: profile.representative,
    canteenTitle: "Quản lý căng tin",
    canteenContractNumber: "HD-CT-2026-003",
    privateOwnerOrganization: "Công ty Cổ phần Giáo dục Bình Minh",
    privateOwnerAddress: profile.address,
    privateOwnerTaxCode: "0310000001",
    privateOwnerIssuePlace: "Sở Kế hoạch và Đầu tư TP. Hồ Chí Minh",
    privateOwnerRepresentative: profile.representative,
    privateOwnerRepresentativeTitle: "Người đại diện theo pháp luật",
    serviceContractDate: "2026-07-01",
    confirmation: operationalAnswers.confirmation,
  };
  if (directText[key]) return directText[key];
  if (operationalAnswers[key]) return operationalAnswers[key];
  if (key === "addressProvince") return profile.province;
  if (key === "addressWard") return profile.ward;
  if (key === "taxCode" || key === "privateOwnerTaxCode") return profile.taxCode;
  if (key === "citizenId") return profile.citizenId;
  if (key === "contact" || /phone|điện thoại|số điện thoại/i.test(normalized)) {
    return profile.phone;
  }
  if (key === "email" || normalized.includes("email")) return profile.email;
  if (key === "licenseNumber") return profile.licenseNumber;
  if (key === "licenseExpires") return profile.licenseExpires;
  if (/(tax|mã số thuế)/i.test(normalized)) return profile.taxCode;
  if (/(address|địa chỉ)/i.test(normalized)) return profile.address;
  if (/(representative|đại diện|người phụ trách)/i.test(normalized)) {
    return profile.representative;
  }
  if (/(time|thời điểm)/i.test(normalized)) return "10:30";
  if (/(contract|hợp đồng)/i.test(normalized)) return "HĐ-ATTP-2026-028";
  if (/(license|giấy phép)/i.test(normalized)) return profile.licenseNumber;
  if (/(name|tên cơ sở|tên đơn vị)/i.test(normalized)) return profile.organization;
  return `Ghi nhận tại buổi khảo sát: ${label.toLocaleLowerCase("vi")}.`;
};
