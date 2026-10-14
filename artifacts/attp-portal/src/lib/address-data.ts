import administrativeUnits from "@/data/vietnam-admin-units.json";

type RawWard = {
  Code: string;
  FullName: string;
  ProvinceCode: string;
};

type RawProvince = {
  Code: string;
  FullName: string;
  Wards: RawWard[];
};

export type AddressWardOption = {
  code: string;
  label: string;
};

export type AddressLocationOption = {
  code: string;
  label: string;
  wards: AddressWardOption[];
};

export const addressLocationOptions: AddressLocationOption[] = (
  administrativeUnits as RawProvince[]
).map((province) => ({
  code: province.Code,
  label: province.FullName,
  wards: province.Wards.map((ward) => ({
    code: ward.Code,
    label: ward.FullName,
  })),
}));

const normalizeLocationName = (value: string) =>
  value
    .trim()
    .toLocaleLowerCase("vi")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/^(tinh|thanh pho|tp\.?)\s+/i, "")
    .replace(/[.,]/g, "")
    .trim();

export const getAddressProvince = (value?: string) => {
  if (!value) return undefined;
  return addressLocationOptions.find(
    (province) =>
      province.code === value ||
      normalizeLocationName(province.label) === normalizeLocationName(value),
  );
};

export const getAddressWard = (
  provinceValue?: string,
  wardValue?: string,
) => {
  const province = getAddressProvince(provinceValue);
  if (!province || !wardValue) return undefined;
  return province.wards.find(
    (ward) =>
      ward.code === wardValue ||
      normalizeLocationName(ward.label) === normalizeLocationName(wardValue),
  );
};

export const getAddressWardOptions = (provinceValue?: string) =>
  getAddressProvince(provinceValue)?.wards ?? [];

export const getAddressLocation = (
  provinceValue?: string,
  wardValue?: string,
) => ({
  province: getAddressProvince(provinceValue),
  ward: getAddressWard(provinceValue, wardValue),
});

export const getAddressProvinceOptions = () =>
  addressLocationOptions.map((province) => province.label);

export const formatStructuredAddress = ({
  detail,
  ward,
  province,
}: {
  detail?: string;
  ward?: string;
  province?: string;
}) =>
  [detail?.trim(), ward?.trim(), province?.trim()]
    .filter(Boolean)
    .join(", ");
