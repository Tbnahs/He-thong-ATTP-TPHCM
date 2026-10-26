import {
  addressLocationOptions,
  getAddressWardOptions,
} from "@/lib/address-data";

type AdministrativeAreaFilterProps = {
  provinceCode: string;
  wardCode: string;
  onProvinceChange: (provinceCode: string) => void;
  onWardChange: (wardCode: string) => void;
  className?: string;
  provinceLabel?: string;
  wardLabel?: string;
  testIdPrefix?: string;
  compact?: boolean;
};

export function AdministrativeAreaFilter({
  provinceCode,
  wardCode,
  onProvinceChange,
  onWardChange,
  className = "",
  provinceLabel = "Tỉnh/thành phố",
  wardLabel = "Xã/phường/đặc khu",
  testIdPrefix = "area",
  compact = false,
}: AdministrativeAreaFilterProps) {
  const controlClass = compact
    ? "h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"
    : "h-11 w-full rounded-xl border border-input bg-background px-3 text-sm";
  const labelClass = compact
    ? "grid gap-1.5 text-xs font-semibold"
    : "grid gap-1.5 text-sm font-semibold";

  return (
    <div className={`grid gap-3 sm:grid-cols-2 ${className}`}>
      <label className={labelClass}>
        <span>{provinceLabel}</span>
        <select
          value={provinceCode}
          onChange={(event) => onProvinceChange(event.target.value)}
          className={controlClass}
          data-testid={`select-${testIdPrefix}-province`}
        >
          <option value="all">Tất cả tỉnh/thành phố</option>
          {addressLocationOptions.map((province) => (
            <option key={province.code} value={province.code}>
              {province.label}
            </option>
          ))}
        </select>
      </label>
      <label className={labelClass}>
        <span>{wardLabel}</span>
        <select
          value={wardCode}
          onChange={(event) => onWardChange(event.target.value)}
          disabled={provinceCode === "all"}
          className={`${controlClass} disabled:opacity-60`}
          data-testid={`select-${testIdPrefix}-ward`}
        >
          <option value="all">Tất cả xã/phường/đặc khu</option>
          {provinceCode !== "all" &&
            getAddressWardOptions(provinceCode).map((ward) => (
              <option key={ward.code} value={ward.code}>
                {ward.label}
              </option>
            ))}
        </select>
      </label>
    </div>
  );
}
