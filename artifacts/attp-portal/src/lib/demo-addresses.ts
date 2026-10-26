import {
  getAddressProvince,
  getAddressWard,
  type AddressLocationOption,
} from "@/lib/address-data";
import type { RegistrationAddressLocation } from "@/lib/registration-addresses";

const demoWardCodes = [
  "25747",
  "25750",
  "25760",
  "25768",
  "25771",
  "25777",
  "25780",
  "25807",
  "25813",
  "25819",
  "25822",
  "25837",
];

const demoAddressDetails = [
  "18 Đường số 1",
  "42 Nguyễn Văn Linh",
  "25 Đường D1",
  "06 Lê Lợi",
  "81 Đường số 3",
  "Thửa 12, đường tỉnh",
  "29 Đường số 5",
  "15 Nguyễn Huệ",
  "70 Đường số 8",
  "11 Lê Duẩn",
  "Kho số 2, đường nội bộ",
  "36 Đường N3",
];

export type DemoAddressRecord = RegistrationAddressLocation & {
  detail: string;
  label: string;
};

const hcm = getAddressProvince("79");

export const demoAddressRecords: DemoAddressRecord[] = demoWardCodes.flatMap(
  (wardCode, index) => {
    const ward = getAddressWard("79", wardCode);
    if (!hcm || !ward) return [];
    const detail = demoAddressDetails[index] ?? `Số ${index + 1}, đường nội bộ`;
    return [{
      provinceCode: hcm.code,
      provinceName: hcm.label,
      wardCode: ward.code,
      wardName: ward.label,
      detail,
      label: [detail, ward.label, hcm.label].join(", "),
    }];
  },
);

export const getDemoAddress = (index: number): DemoAddressRecord => {
  if (!demoAddressRecords.length) {
    throw new Error("Không tìm thấy địa chỉ mẫu trong danh mục hành chính.");
  }
  return demoAddressRecords[
    ((index % demoAddressRecords.length) + demoAddressRecords.length) %
      demoAddressRecords.length
  ];
};

export const getDemoAddressAtWard = (wardCode: string) =>
  demoAddressRecords.find((address) => address.wardCode === wardCode);

const facilityAddressIndexes: Record<string, { headquarters: number; operational?: number }> = {
  "Trường Tiểu học Lê Lợi": { headquarters: 0 },
  "Trường Tiểu học Thái Sơn": { headquarters: 1 },
  "Trường Mầm non Hoa Sen": { headquarters: 2 },
  "Trường Tiểu học Bình Minh": { headquarters: 3 },
  "Trường THCS ABC": { headquarters: 4 },
  "Trường Tiểu học Nguyễn Huệ": { headquarters: 5 },
  "Trường Mầm non Sao Mai": { headquarters: 6 },
  "Trường THCS Lý Thánh Tông": { headquarters: 7 },
  "Trường THCS Minh Khai": { headquarters: 8 },
  "Công ty Suất ăn Minh Tâm": { headquarters: 4, operational: 9 },
  "Bếp ăn tập thể An Phú": { headquarters: 5, operational: 10 },
  "Công ty TNHH Nông sản An Phú": { headquarters: 8, operational: 11 },
  "Hợp tác xã Rau sạch Củ Chi": { headquarters: 9, operational: 0 },
  "Công ty Thực phẩm sạch Bình Minh": { headquarters: 10, operational: 1 },
};

export const getDemoFacilityHeadquarters = (name: string) =>
  getDemoAddress(facilityAddressIndexes[name]?.headquarters ?? 0);

export const getDemoFacilityOperationalAddress = (name: string) => {
  const index = facilityAddressIndexes[name]?.operational;
  return index === undefined ? getDemoFacilityHeadquarters(name) : getDemoAddress(index);
};

export const getDemoAddressDirectory = (): AddressLocationOption[] => {
  if (!hcm) return [];
  return [hcm];
};
