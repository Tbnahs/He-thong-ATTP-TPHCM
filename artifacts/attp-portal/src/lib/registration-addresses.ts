import {
  getAddressProvince,
  getAddressWard,
} from "@/lib/address-data";
import type { ApplicationType } from "@/lib/mock-data";

export type RegistrationAddressLocation = {
  provinceCode: string;
  provinceName: string;
  wardCode: string;
  wardName: string;
  detail?: string;
};

const asAddressText = (value: unknown) =>
  typeof value === "string" ? value.trim() : "";

const makeAddressFilterLocation = (
  provinceValue: unknown,
  wardValue: unknown,
  provinceCodeValue?: unknown,
  wardCodeValue?: unknown,
  detailValue?: unknown,
): RegistrationAddressLocation => {
  const provinceInput =
    asAddressText(provinceCodeValue) || asAddressText(provinceValue);
  const province = getAddressProvince(provinceInput);
  const provinceName = province?.label ?? asAddressText(provinceValue);
  const wardInput = asAddressText(wardCodeValue) || asAddressText(wardValue);
  const ward = getAddressWard(province?.code ?? provinceInput, wardInput);
  return {
    provinceCode: province?.code ?? asAddressText(provinceCodeValue),
    provinceName,
    wardCode: ward?.code ?? asAddressText(wardCodeValue),
    wardName: ward?.label ?? asAddressText(wardValue),
    detail: asAddressText(detailValue),
  };
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const readPrefixedAddress = (
  fields: Record<string, unknown>,
  prefix: string,
  legacy: Partial<RegistrationAddressLocation> = {},
) =>
  makeAddressFilterLocation(
    fields[`${prefix}ProvinceName`] ??
      fields[`${prefix}Province`] ??
      legacy.provinceName,
    fields[`${prefix}WardName`] ??
      fields[`${prefix}Ward`] ??
      legacy.wardName,
    fields[`${prefix}ProvinceCode`] ?? legacy.provinceCode,
    fields[`${prefix}WardCode`] ?? legacy.wardCode,
    fields[`${prefix}AddressDetail`] ??
      fields[`${prefix}Detail`] ??
      fields[`${prefix}Address`] ??
      legacy.detail,
  );

const hasAddressData = (location: RegistrationAddressLocation) =>
  Boolean(
    location.provinceCode ||
      location.provinceName ||
      location.wardCode ||
      location.wardName ||
      location.detail,
  );

const dedupeLocations = (locations: RegistrationAddressLocation[]) => {
  const seen = new Set<string>();
  return locations.filter((location) => {
    const key = [
      location.provinceCode || location.provinceName,
      location.wardCode || location.wardName,
      location.detail,
    ].join("|");
    if (!hasAddressData(location) || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

export const getRegistrationAddressLocations = (
  type: ApplicationType | undefined,
  fields: Record<string, unknown>,
): RegistrationAddressLocation[] => {
  if (type === "school") {
    const savedLocations = Array.isArray(fields.schoolLocations)
      ? fields.schoolLocations.filter(isRecord)
      : [];
    if (savedLocations.length > 0) {
      return dedupeLocations(
        savedLocations.map((location) =>
          makeAddressFilterLocation(
            location.provinceName,
            location.wardName,
            location.provinceCode,
            location.wardCode,
            location.addressDetail ?? location.address,
          ),
        ),
      );
    }
    return dedupeLocations([
      makeAddressFilterLocation(
        fields.addressMainProvinceName ?? fields.addressProvince,
        fields.addressMainWardName ?? fields.addressWard,
        fields.addressMainProvinceCode ?? fields.addressProvinceCode,
        fields.addressMainWardCode ?? fields.addressWardCode,
        fields.addressMainAddressDetail ?? fields.addressMain,
      ),
    ]);
  }

  if (type === "meal-provider") {
    return dedupeLocations([
      readPrefixedAddress(fields, "facility", {
        provinceName: asAddressText(fields.addressProvince),
        wardName: asAddressText(fields.addressWard),
        provinceCode: asAddressText(fields.addressProvinceCode),
        wardCode: asAddressText(fields.addressWardCode),
        detail: asAddressText(fields.facilityAddress ?? fields.addressDetail),
      }),
      readPrefixedAddress(fields, "headquarters", {
        detail: asAddressText(fields.headquartersAddress),
      }),
    ]);
  }

  return dedupeLocations([
    makeAddressFilterLocation(
      fields.addressProvince,
      fields.addressWard,
      fields.addressProvinceCode,
      fields.addressWardCode,
      fields.addressDetail,
    ),
  ]);
};

export { makeAddressFilterLocation };
