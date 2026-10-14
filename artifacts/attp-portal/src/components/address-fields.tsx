import {
  addressLocationOptions,
  getAddressProvince,
  getAddressWard,
} from "@/lib/address-data";

export type AddressFieldsValue = {
  provinceCode: string;
  provinceName: string;
  wardCode: string;
  wardName: string;
  detail: string;
};

export function AddressFields({
  idPrefix,
  value,
  onChange,
  required = false,
  disabled = false,
  detailLabel = "Địa chỉ chi tiết",
}: {
  idPrefix: string;
  value: AddressFieldsValue;
  onChange: (value: AddressFieldsValue) => void;
  required?: boolean;
  disabled?: boolean;
  detailLabel?: string;
}) {
  const selectedProvince =
    getAddressProvince(value.provinceCode) ??
    getAddressProvince(value.provinceName);
  const provinceCode = selectedProvince?.code ?? "";
  const provinceName = selectedProvince?.label ?? value.provinceName;
  const wards = selectedProvince?.wards ?? [];
  const selectedWard =
    getAddressWard(provinceCode, value.wardCode) ??
    getAddressWard(provinceCode, value.wardName);
  const wardCode = selectedWard?.code ?? "";
  const wardName = selectedWard?.label ?? value.wardName;
  const controlClass =
    "focus-ring h-11 w-full rounded-lg border border-input bg-background px-3 text-sm";
  const labelClass = "grid gap-1.5 text-sm font-semibold";

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <label className={labelClass} htmlFor={`${idPrefix}-province`}>
        <span>Tỉnh/thành phố{required ? " *" : ""}</span>
        <select
          id={`${idPrefix}-province`}
          value={provinceCode}
          required={required}
          disabled={disabled}
          onChange={(event) => {
            const nextProvince = addressLocationOptions.find(
              (option) => option.code === event.target.value,
            );
            onChange({
              ...value,
              provinceCode: nextProvince?.code ?? "",
              provinceName: nextProvince?.label ?? "",
              wardCode: "",
              wardName: "",
            });
          }}
          className={controlClass}
          data-testid={`select-${idPrefix}-province`}
        >
          <option value="">Chọn tỉnh/thành phố</option>
          {addressLocationOptions.map((province) => (
            <option key={province.code} value={province.code}>
              {province.label}
            </option>
          ))}
        </select>
      </label>
      <label className={labelClass} htmlFor={`${idPrefix}-ward`}>
        <span>Xã/phường/đặc khu{required ? " *" : ""}</span>
        <select
          id={`${idPrefix}-ward`}
          value={wardCode}
          required={required}
          disabled={disabled || !provinceCode}
          onChange={(event) => {
            const nextWard = wards.find(
              (option) => option.code === event.target.value,
            );
            onChange({
              ...value,
              provinceCode,
              provinceName,
              wardCode: nextWard?.code ?? "",
              wardName: nextWard?.label ?? "",
            });
          }}
          className={controlClass}
          data-testid={`select-${idPrefix}-ward`}
        >
          <option value="">Chọn xã/phường/đặc khu</option>
          {wards.map((ward) => (
            <option key={ward.code} value={ward.code}>
              {ward.label}
            </option>
          ))}
        </select>
      </label>
      <label
        className={`${labelClass} sm:col-span-2`}
        htmlFor={`${idPrefix}-detail`}
      >
        <span>{detailLabel}{required ? " *" : ""}</span>
        <input
          id={`${idPrefix}-detail`}
          type="text"
          value={value.detail}
          required={required}
          disabled={disabled}
          onChange={(event) =>
            onChange({ ...value, provinceCode, provinceName, wardCode, wardName, detail: event.target.value })
          }
          className={controlClass}
          placeholder="Số nhà, tên đường, thôn/ấp..."
          data-testid={`input-${idPrefix}-detail`}
        />
      </label>
    </div>
  );
}
