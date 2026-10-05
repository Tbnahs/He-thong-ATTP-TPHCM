import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { FileText, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  getCriteriaSet,
  isRegistrationCriteriaVisible,
  schoolOptions,
  suppliers,
  type Application,
  type Attachment,
  type CriteriaAnswerType,
  type CriteriaDefinition,
  type CriteriaGroup,
} from "@/lib/mock-data";
import {
  EVIDENCE_ACCEPT,
  EVIDENCE_MAX_SIZE_LABEL,
  validateEvidenceFiles,
} from "@/lib/file-upload";

type DataRow = Record<string, unknown>;
type SchoolFormField = NonNullable<CriteriaDefinition["repeatableFields"]>[number];

const inputClass =
  "focus-ring min-h-11 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm";
const answerTypes: CriteriaAnswerType[] = [
  "text",
  "number",
  "date",
  "yes-no",
  "select",
  "multi-select",
  "file",
  "repeatable",
];

const asRecord = (value: unknown): DataRow | undefined =>
  typeof value === "object" && value !== null && !Array.isArray(value)
    ? (value as DataRow)
    : undefined;

const asRows = (value: unknown): DataRow[] =>
  Array.isArray(value)
    ? value.map(asRecord).filter((row): row is DataRow => Boolean(row))
    : [];

const asText = (value: unknown) =>
  typeof value === "string" || typeof value === "number" ? String(value) : "";

const asSelectedValues = (value: unknown): string[] =>
  Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : typeof value === "string" && value
      ? [value]
      : [];

function initializeFormData(application: Application): Record<string, unknown> {
  const data = structuredClone(application.data);
  for (const form of asRows(data.schoolModelForms)) {
    const formId = asText(form.id);
    for (const field of asRows(form.fields)) {
      const key = asText(field.key);
      const dataKey = `schoolModelDetails.${formId}.${key}`;
      if (formId && key && !(dataKey in data) && "value" in field) {
        data[dataKey] = field.value;
      }
    }
  }
  return data;
}

function makeCriteriaDefinition(
  source: DataRow,
  id: string,
  groupId: string,
  order: number,
): CriteriaDefinition | undefined {
  if (
    typeof source.key !== "string" ||
    typeof source.label !== "string" ||
    !answerTypes.includes(source.answerType as CriteriaAnswerType)
  ) {
    return undefined;
  }
  return {
    id,
    key: source.key,
    label: source.label,
    description: typeof source.description === "string" ? source.description : "",
    groupId,
    answerType: source.answerType as CriteriaAnswerType,
    options: Array.isArray(source.options)
      ? source.options.filter((option): option is string => typeof option === "string")
      : [],
    maxScore: 0,
    required: Boolean(source.required),
    active: true,
    order,
    sourceMaterials: [],
    dependsOn: asRecord(source.dependsOn) as CriteriaDefinition["dependsOn"],
    repeatableFields: Array.isArray(source.repeatableFields)
      ? (source.repeatableFields as SchoolFormField[])
      : undefined,
  };
}

function makeRepeatableField(field: SchoolFormField, parent: CriteriaDefinition) {
  return makeCriteriaDefinition(
    field as unknown as DataRow,
    `${parent.id}-${field.key}`,
    parent.groupId,
    parent.order,
  );
}

function AnswerControl({
  item,
  fieldKey,
  value,
  attachments,
  disabled,
  onChange,
  onChooseFiles,
  onRemoveFile,
}: {
  item: CriteriaDefinition;
  fieldKey: string;
  value: unknown;
  attachments: Attachment[];
  disabled: boolean;
  onChange: (value: unknown) => void;
  onChooseFiles: (fieldKey: string, event: ChangeEvent<HTMLInputElement>) => void;
  onRemoveFile: (file: Attachment) => void;
}) {
  const safeId = fieldKey.replace(/[^a-zA-Z0-9_-]/g, "-");
  const requiredMark = item.required ? (
    <span className="text-rose-600"> *</span>
  ) : null;
  const descriptions = (
    <>
      {item.description && (
        <span className="mt-1 block text-xs leading-5 text-muted-foreground">
          {item.description}
        </span>
      )}
      {item.sourceMaterials.length > 0 && (
        <span className="mt-2 block rounded-lg bg-secondary/40 px-3 py-2 text-xs text-muted-foreground">
          <strong className="text-primary">Căn cứ: </strong>
          {item.sourceMaterials.map((source) => source.name).join(", ")}
        </span>
      )}
    </>
  );

  if (item.answerType === "file") {
    const fieldFiles = attachments.filter((file) => file.fieldKey === fieldKey);
    return (
      <div className="min-w-0">
        <label className="block text-sm font-semibold">
          {item.label}
          {requiredMark}
        </label>
        {descriptions}
        <p className="mt-2 text-xs text-muted-foreground">
          PDF, JPG hoặc PNG · tối đa {EVIDENCE_MAX_SIZE_LABEL} mỗi tệp.
        </p>
        <input
          type="file"
          accept={EVIDENCE_ACCEPT}
          multiple
          disabled={disabled}
          onChange={(event) => onChooseFiles(fieldKey, event)}
          className="mt-2 block w-full text-sm file:mr-3 file:min-h-10 file:rounded-lg file:border-0 file:bg-primary file:px-3 file:font-bold file:text-primary-foreground disabled:opacity-60"
          data-testid={`input-supplement-${safeId}`}
        />
        {fieldFiles.length > 0 && (
          <ul className="mt-3 space-y-2">
            {fieldFiles.map((file, index) => (
              <li
                key={`${file.name}-${file.size}-${index}`}
                className="flex min-w-0 items-center justify-between gap-3 rounded-lg bg-secondary/30 px-3 py-2 text-sm"
              >
                <span className="flex min-w-0 items-center gap-2">
                  <FileText size={15} className="shrink-0 text-primary" />
                  <span className="break-all">{file.name}</span>
                </span>
                {!disabled && (
                  <button
                    type="button"
                    onClick={() => onRemoveFile(file)}
                    className="focus-ring shrink-0 rounded-md p-1 text-muted-foreground hover:text-rose-700"
                    aria-label={`Xóa ${file.name}`}
                  >
                    <X size={15} />
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }

  if (item.answerType === "repeatable") {
    const rows = asRows(value);
    return (
      <div className="min-w-0">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold">
              {item.label}
              {requiredMark}
            </p>
            {descriptions}
          </div>
          {!disabled && (
            <Button
              type="button"
              variant="outline"
              className="h-9 shrink-0 rounded-lg px-3 text-xs"
              onClick={() => onChange([...rows, {}])}
              data-testid={`button-supplement-add-${safeId}`}
            >
              <Plus size={14} /> Thêm dòng
            </Button>
          )}
        </div>
        {rows.length === 0 ? (
          <p className="mt-3 rounded-xl border border-dashed border-border px-4 py-3 text-sm text-muted-foreground">
            Chưa có thông tin.
          </p>
        ) : (
          <div className="mt-3 space-y-4">
            {rows.map((row, rowIndex) => (
              <section
                key={`${fieldKey}-${rowIndex}`}
                className="rounded-xl border border-border bg-secondary/15 p-4"
              >
                <div className="mb-3 flex items-center justify-between gap-3">
                  <p className="text-xs font-extrabold uppercase tracking-wide text-primary">
                    Dòng kê khai {rowIndex + 1}
                  </p>
                  {!disabled && (
                    <button
                      type="button"
                      onClick={() =>
                        onChange(rows.filter((_, index) => index !== rowIndex))
                      }
                      className="focus-ring rounded-md p-1 text-muted-foreground hover:text-rose-700"
                      aria-label={`Xóa dòng ${rowIndex + 1}`}
                    >
                      <X size={15} />
                    </button>
                  )}
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  {(item.repeatableFields ?? []).map((field) => {
                    const child = makeRepeatableField(field, item);
                    if (!child) return null;
                    const childKey = `${fieldKey}.${rowIndex}.${field.key}`;
                    return (
                      <AnswerControl
                        key={child.key}
                        item={child}
                        fieldKey={childKey}
                        value={row[field.key]}
                        attachments={attachments}
                        disabled={disabled}
                        onChange={(nextValue) =>
                          onChange(
                            rows.map((current, index) =>
                              index === rowIndex
                                ? { ...current, [field.key]: nextValue }
                                : current,
                            ),
                          )
                        }
                        onChooseFiles={onChooseFiles}
                        onRemoveFile={onRemoveFile}
                      />
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (item.answerType === "multi-select") {
    const selected = asSelectedValues(value);
    return (
      <fieldset className="min-w-0">
        <legend className="text-sm font-semibold">
          {item.label}
          {requiredMark}
        </legend>
        {descriptions}
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {item.options.map((option) => (
            <label
              key={option}
              className="flex cursor-pointer items-start gap-3 rounded-xl border border-input bg-background px-3 py-3 text-sm"
            >
              <input
                type="checkbox"
                checked={selected.includes(option)}
                disabled={disabled}
                onChange={(event) =>
                  onChange(
                    event.target.checked
                      ? [...selected, option]
                      : selected.filter((current) => current !== option),
                  )
                }
                className="mt-0.5 h-4 w-4 accent-primary"
                data-testid={`input-supplement-${safeId}-${option}`}
              />
              <span>{option}</span>
            </label>
          ))}
        </div>
      </fieldset>
    );
  }

  if (item.answerType === "select" || item.answerType === "yes-no") {
    const current = asText(value);
    const options =
      item.key === "supplierId"
        ? suppliers.map((supplier) => ({
            value: `${supplier.id} · ${supplier.name} · ${supplier.taxCode}`,
            label: `${supplier.id} · ${supplier.name} · ${supplier.taxCode}`,
          }))
        : item.key === "schoolId"
          ? schoolOptions.map((school) => ({
              value: school.id,
              label: school.name,
            }))
          : item.options.map((option) => ({ value: option, label: option }));
    const selectableOptions =
      current && !options.some((option) => option.value === current)
        ? [{ value: current, label: current }, ...options]
        : options;
    return (
      <label className="block min-w-0 text-sm font-semibold">
        {item.label}
        {requiredMark}
        {descriptions}
        <select
          value={current}
          disabled={disabled}
          onChange={(event) => onChange(event.target.value)}
          className={`${inputClass} mt-2`}
          data-testid={`input-supplement-${safeId}`}
        >
          <option value="">Chọn một phương án</option>
          {selectableOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
    );
  }

  const multiline =
    /description|process|procedure|commitment|otherContents|explanation/i.test(
      item.key,
    );
  return (
    <label className="block min-w-0 text-sm font-semibold">
      {item.label}
      {requiredMark}
      {descriptions}
      {multiline ? (
        <textarea
          value={asText(value)}
          disabled={disabled}
          onChange={(event) => onChange(event.target.value)}
          rows={3}
          className={`${inputClass} mt-2 resize-y`}
          data-testid={`input-supplement-${safeId}`}
        />
      ) : (
        <input
          type={
            item.answerType === "number"
              ? "number"
              : item.answerType === "date"
                ? "date"
                : "text"
          }
          value={asText(value)}
          disabled={disabled}
          onChange={(event) => onChange(event.target.value)}
          className={`${inputClass} mt-2`}
          data-testid={`input-supplement-${safeId}`}
        />
      )}
    </label>
  );
}

const operatingModelLabels: Record<string, string> = {
  siteName: "Tên địa điểm",
  siteAddress: "Địa chỉ",
  capacity: "Tổng số suất",
  morningCapacity: "Số suất ca sáng",
  lunchCapacity: "Số suất ca trưa",
  snackCapacity: "Số suất ca xế",
  dinnerCapacity: "Số suất ca chiều",
  priceRange: "Mức giá",
};

function SupplementRegistrationForm({
  application,
  disabled,
  onSubmit,
}: {
  application: Application;
  disabled: boolean;
  onSubmit: (
    data: Record<string, unknown>,
    applicationAttachments: Attachment[],
    newAttachments: Attachment[],
  ) => void;
}) {
  const [data, setData] = useState(() => initializeFormData(application));
  const [attachments, setAttachments] = useState(application.attachments);
  const [newAttachments, setNewAttachments] = useState<Attachment[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    setData(initializeFormData(application));
    setAttachments(application.attachments);
    setNewAttachments([]);
    setError("");
  }, [application.id]);

  const updateValue = (key: string, value: unknown) =>
    setData((current) => ({ ...current, [key]: value }));

  const chooseFiles = (
    fieldKey: string,
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const selected = Array.from(event.target.files ?? []);
    const validationError = validateEvidenceFiles(selected);
    if (validationError) {
      setError(validationError);
      event.target.value = "";
      return;
    }
    const added = selected.map<Attachment>((file) => ({
      name: file.name,
      kind: file.type || "application/octet-stream",
      size: file.size,
      fieldKey,
    }));
    setAttachments((current) => [...current, ...added]);
    setNewAttachments((current) => [...current, ...added]);
    setError("");
    event.target.value = "";
  };

  const removeFile = (target: Attachment) => {
    setAttachments((current) => current.filter((file) => file !== target));
    setNewAttachments((current) => current.filter((file) => file !== target));
  };

  const criteria = application.criteriaSnapshot?.length
    ? application.criteriaSnapshot
    : getCriteriaSet(application.type).criteria.filter((item) =>
        Object.prototype.hasOwnProperty.call(data, item.key),
      );
  const activeCriteria = criteria
    .filter(
      (item) =>
        item.active &&
        isRegistrationCriteriaVisible(item, data, application.type),
    )
    .sort((left, right) => left.order - right.order);
  const groups: CriteriaGroup[] = application.criteriaGroups?.length
    ? application.criteriaGroups
    : getCriteriaSet(application.type).groups;
  const orderedGroups = groups
    .slice()
    .sort((left, right) => left.order - right.order)
    .filter((group) => activeCriteria.some((item) => item.groupId === group.id));
  const ungroupedCriteria = activeCriteria.filter(
    (item) => !groups.some((group) => group.id === item.groupId),
  );

  const schoolLocations = asRows(data.schoolLocations);
  const operatingModels = asRows(data.operatingModels);
  const schoolForms = asRows(data.schoolModelForms);
  const typeLabel =
    application.type === "school"
      ? "Cơ sở giáo dục"
      : application.type === "meal-provider"
        ? "Cơ sở suất ăn sẵn"
        : "Cơ sở cung cấp thực phẩm";

  const assignedFileKeys = new Set<string>();
  const trackFileKeys = (
    item: CriteriaDefinition,
    fieldKey: string,
    value: unknown,
  ) => {
    if (item.answerType === "file") assignedFileKeys.add(fieldKey);
    if (item.answerType !== "repeatable") return;
    asRows(value).forEach((row, rowIndex) => {
      (item.repeatableFields ?? []).forEach((field) => {
        if (field.answerType === "file") {
          assignedFileKeys.add(`${fieldKey}.${rowIndex}.${field.key}`);
        }
      });
    });
  };
  activeCriteria.forEach((item) =>
    trackFileKeys(item, item.key, data[item.key]),
  );
  schoolForms.forEach((form, formIndex) => {
    const formId = asText(form.id) || String(formIndex);
    asRows(form.fields).forEach((field, fieldIndex) => {
      const item = makeCriteriaDefinition(
        field,
        `${formId}-${asText(field.key) || fieldIndex}`,
        "school-model-details",
        fieldIndex,
      );
      if (item) {
        const fieldKey = `schoolModelDetails.${formId}.${item.key}`;
        trackFileKeys(item, fieldKey, data[fieldKey]);
      }
    });
  });

  const updateLocations = (nextLocations: DataRow[]) => {
    const mainLocation =
      nextLocations.find((location) => location.kind === "main") ??
      nextLocations[0];
    setData((current) => ({
      ...current,
      schoolLocations: nextLocations,
      addressMain: asText(mainLocation?.address),
      addressBranches: nextLocations
        .filter((location) => location !== mainLocation)
        .map((location) => asText(location.address))
        .filter(Boolean),
    }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (disabled) return;
    setError("");
    const updatedData = { ...data };
    if (schoolForms.length > 0) {
      updatedData.schoolModelForms = schoolForms.map((form, formIndex) => {
        const formId = asText(form.id) || String(formIndex);
        const formFields = asRows(form.fields).map((field) => {
          const key = asText(field.key);
          const dataKey = `schoolModelDetails.${formId}.${key}`;
          const fieldFiles = attachments
            .filter((file) => file.fieldKey === dataKey)
            .map((file) => file.name);
          const fieldValue =
            field.answerType === "file"
              ? fieldFiles
              : dataKey in updatedData
                ? updatedData[dataKey]
                : field.value;
          return {
            ...field,
            value: fieldValue,
            ...(field.answerType === "file" ? { files: fieldFiles } : {}),
          };
        });
        return { ...form, fields: formFields };
      });
    }
    try {
      onSubmit(updatedData, attachments, newAttachments);
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "Không thể gửi hồ sơ bổ sung.",
      );
    }
  };

  return (
    <div className="paper-form mx-auto max-w-5xl">
      <article className="paper-page">
        <header className="paper-form-header">
          <p className="paper-form-agency">
            SỞ AN TOÀN THỰC PHẨM TP. HỒ CHÍ MINH
          </p>
          <h2 className="paper-form-title">
            PHIẾU KHẢO SÁT VÀ CUNG CẤP THÔNG TIN
          </h2>
          <p className="paper-form-subtitle">
            Nhóm đối tượng thực hiện: <strong>{typeLabel}</strong>
          </p>
          <p className="paper-form-note">
            Rà soát thông tin đã kê khai và chỉnh sửa trực tiếp tại trường cần
            bổ sung. Các phần của phiếu được hiển thị liên tục trên cùng trang.
          </p>
          {application.type === "school" && (
            <div className="paper-form-guidance">
              <p className="paper-guidance-title">
                HƯỚNG DẪN KÊ KHAI VÀ XÁC NHẬN THÔNG TIN
              </p>
              <p>
                Cơ sở giáo dục kê khai đầy đủ phần thông tin chung và tiếp tục
                kê khai theo biểu mẫu tương ứng với từng mô hình hoạt động.
              </p>
              <ul>
                <li>
                  BATT tự tổ chức → <strong>Mẫu số 01</strong>; BATT hợp đồng →
                  <strong> Mẫu số 02</strong>.
                </li>
                <li>
                  Nhận suất ăn sẵn → <strong>Mẫu số 03</strong>; căng tin
                  trường học → <strong>Mẫu số 04</strong>.
                </li>
                <li>
                  Có nhiều phân hiệu, điểm trường, mô hình hoặc đơn vị cung cấp
                  cần lập hồ sơ riêng cho từng địa điểm, mô hình và đơn vị.
                </li>
                <li>
                  Thông tin phải đúng thực tế; nội dung không phát sinh hoặc
                  không áp dụng cần ghi rõ, không để trống hoặc kê khai ước đoán.
                </li>
              </ul>
            </div>
          )}
        </header>

        <form onSubmit={handleSubmit} className="paper-form-body">
          {!application.criteriaSnapshot?.length && (
            <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-950">
              Hồ sơ cũ không lưu bản chụp bộ câu hỏi tại thời điểm đăng ký. Các
              trường dưới đây chỉ được dựng từ những trường có dữ liệu đã lưu.
            </p>
          )}

          {orderedGroups.map((group, groupIndex) => {
            const items = activeCriteria.filter(
              (item) => item.groupId === group.id,
            );
            return (
              <section key={group.id} className="paper-section">
                <div className="paper-section-heading">
                  <span className="paper-section-number">
                    {String(groupIndex + 1).padStart(2, "0")}
                  </span>
                  <h2>{group.name}</h2>
                </div>
                <div className="paper-form-field-row">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className={
                        item.answerType === "repeatable" ||
                        item.answerType === "file" ||
                        item.answerType === "multi-select"
                          ? "md:col-span-2"
                          : ""
                      }
                    >
                      <div className="paper-question">
                        <AnswerControl
                          item={item}
                          fieldKey={item.key}
                          value={data[item.key]}
                          attachments={attachments}
                          disabled={disabled}
                          onChange={(value) => updateValue(item.key, value)}
                          onChooseFiles={chooseFiles}
                          onRemoveFile={removeFile}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            );
          })}

          {ungroupedCriteria.length > 0 && (
            <section className="paper-section">
              <div className="paper-section-heading">
                <span className="paper-section-number">
                  {String(orderedGroups.length + 1).padStart(2, "0")}
                </span>
                <h2>Thông tin khác trong hồ sơ</h2>
              </div>
              <div className="paper-form-field-row">
                {ungroupedCriteria.map((item) => (
                  <div className="paper-question" key={item.id}>
                    <AnswerControl
                      item={item}
                      fieldKey={item.key}
                      value={data[item.key]}
                      attachments={attachments}
                      disabled={disabled}
                      onChange={(value) => updateValue(item.key, value)}
                      onChooseFiles={chooseFiles}
                      onRemoveFile={removeFile}
                    />
                  </div>
                ))}
              </div>
            </section>
          )}

          {application.type === "school" && (
            <>
              <section className="paper-section">
                <div className="paper-section-heading">
                  <span className="paper-section-number">
                    {String(orderedGroups.length + 1).padStart(2, "0")}
                  </span>
                  <h2>Địa điểm cơ sở giáo dục</h2>
                </div>
                {schoolLocations.length > 0 ? (
                  <div className="mt-4 space-y-4">
                    {schoolLocations.map((location, index) => (
                      <div
                        key={asText(location.id) || index}
                        className="paper-model-form"
                      >
                        <div className="paper-model-form-header">
                          <h3>
                            {location.kind === "main"
                              ? "Địa điểm chính"
                              : `Địa điểm ${index + 1}`}
                          </h3>
                          {!disabled && location.kind !== "main" && (
                            <button
                              type="button"
                              onClick={() =>
                                updateLocations(
                                  schoolLocations.filter(
                                    (_, currentIndex) => currentIndex !== index,
                                  ),
                                )
                              }
                              className="focus-ring rounded-md p-1 text-muted-foreground hover:text-rose-700"
                              aria-label={`Xóa địa điểm ${index + 1}`}
                            >
                              <X size={15} />
                            </button>
                          )}
                        </div>
                        <div className="paper-form-field-row">
                          <label className="paper-question">
                            Tên địa điểm
                            <input
                              className={inputClass}
                              value={asText(location.name)}
                              disabled={disabled}
                              onChange={(event) =>
                                updateLocations(
                                  schoolLocations.map((current, currentIndex) =>
                                    currentIndex === index
                                      ? { ...current, name: event.target.value }
                                      : current,
                                  ),
                                )
                              }
                            />
                          </label>
                          <label className="paper-question md:col-span-2">
                            Địa chỉ
                            <input
                              className={inputClass}
                              value={asText(location.address)}
                              disabled={disabled}
                              onChange={(event) =>
                                updateLocations(
                                  schoolLocations.map((current, currentIndex) =>
                                    currentIndex === index
                                      ? { ...current, address: event.target.value }
                                      : current,
                                  ),
                                )
                              }
                            />
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="paper-form-field-row">
                    {(["addressMain", "addressBranches"] as const).map((key) => (
                      <label className="paper-question" key={key}>
                        {key === "addressMain"
                          ? "Địa chỉ cơ sở chính"
                          : "Địa chỉ các điểm trường khác"}
                        <input
                          className={inputClass}
                          value={
                            Array.isArray(data[key])
                              ? (data[key] as string[]).join(", ")
                              : asText(data[key])
                          }
                          disabled={disabled}
                          onChange={(event) =>
                            updateValue(key, event.target.value)
                          }
                        />
                      </label>
                    ))}
                  </div>
                )}
                {!disabled && (
                  <Button
                    type="button"
                    variant="outline"
                    className="mt-4 rounded-lg"
                    onClick={() =>
                      updateLocations([
                        ...schoolLocations,
                        {
                          id: `supplement-site-${Date.now()}`,
                          name: "",
                          address: "",
                          kind: "branch",
                        },
                      ])
                    }
                    data-testid="button-supplement-add-school-location"
                  >
                    <Plus size={15} /> Thêm địa điểm
                  </Button>
                )}
              </section>

              {operatingModels.length > 0 && (
                <section className="paper-section">
                  <div className="paper-section-heading">
                    <span className="paper-section-number">
                      {String(orderedGroups.length + 2).padStart(2, "0")}
                    </span>
                    <h2>Mô hình hoạt động tại cơ sở</h2>
                  </div>
                  <div className="space-y-4">
                    {operatingModels.map((model, rowIndex) => {
                      const editableFields = Object.entries(model).filter(
                        ([key, value]) =>
                          !["id", "siteId", "model", "formNumber", "formLabel"].includes(
                            key,
                          ) &&
                          (typeof value === "string" ||
                            typeof value === "number" ||
                            Array.isArray(value)),
                      );
                      return (
                        <section
                          key={asText(model.id) || rowIndex}
                          className="paper-model-form"
                        >
                          <div className="paper-model-form-header">
                            <div>
                              <p className="paper-model-kicker">
                                {asText(model.formLabel) ||
                                  (asText(model.formNumber)
                                    ? `Mẫu số ${asText(model.formNumber)}`
                                    : `Mô hình ${rowIndex + 1}`)}
                              </p>
                              <h3>{asText(model.model)}</h3>
                            </div>
                          </div>
                          <div className="paper-form-field-row">
                            {editableFields.map(([key, value]) => (
                              <label className="paper-question" key={key}>
                                {operatingModelLabels[key] ??
                                  key.replace(/([A-Z])/g, " $1").trim()}
                                {key === "priceRange" ? (
                                  <select
                                    className={inputClass}
                                    value={asText(value)}
                                    disabled={disabled}
                                    onChange={(event) =>
                                      setData((current) => ({
                                        ...current,
                                        operatingModels: operatingModels.map(
                                          (entry, index) =>
                                            index === rowIndex
                                              ? {
                                                  ...entry,
                                                  [key]: event.target.value,
                                                }
                                              : entry,
                                        ),
                                      }))
                                    }
                                  >
                                    <option value="">Chọn mức giá</option>
                                    {[
                                      "Dưới 25.000 đồng",
                                      "Từ 25.000 đến 30.000 đồng",
                                      "Từ 30.000 đến 35.000 đồng",
                                      "Trên 35.000 đồng",
                                    ].map((option) => (
                                      <option key={option}>{option}</option>
                                    ))}
                                  </select>
                                ) : (
                                  <input
                                    type={
                                      /capacity|quantity/i.test(key)
                                        ? "number"
                                        : "text"
                                    }
                                    className={inputClass}
                                    value={
                                      Array.isArray(value)
                                        ? value.join(", ")
                                        : asText(value)
                                    }
                                    disabled={disabled}
                                    onChange={(event) =>
                                      setData((current) => ({
                                        ...current,
                                        operatingModels: operatingModels.map(
                                          (entry, index) =>
                                            index === rowIndex
                                              ? {
                                                  ...entry,
                                                  [key]: event.target.value,
                                                }
                                              : entry,
                                        ),
                                      }))
                                    }
                                  />
                                )}
                              </label>
                            ))}
                          </div>
                        </section>
                      );
                    })}
                  </div>
                </section>
              )}
            </>
          )}

          {schoolForms.length > 0 && (
            <section className="paper-model-forms">
              <div className="paper-model-intro">
                <p className="paper-model-kicker">Biểu mẫu theo mô hình</p>
                <h2>Thông tin chi tiết từng mô hình hoạt động</h2>
              </div>
              {schoolForms.map((form, formIndex) => {
                const formId = asText(form.id) || String(formIndex);
                const formFields = asRows(form.fields)
                  .map((field, index) =>
                    makeCriteriaDefinition(
                      field,
                      `${formId}-${asText(field.key) || index}`,
                      "school-model-details",
                      index,
                    ),
                  )
                  .filter(
                    (item): item is CriteriaDefinition =>
                      Boolean(item?.active),
                  );
                const visibleFields = formFields.filter((item) => {
                  if (!item.dependsOn) return true;
                  const dependency = asText(
                    data[`schoolModelDetails.${formId}.${item.dependsOn.key}`],
                  );
                  if (
                    item.dependsOn.equals !== undefined &&
                    dependency !== item.dependsOn.equals
                  )
                    return false;
                  if (
                    item.dependsOn.notEquals !== undefined &&
                    dependency === item.dependsOn.notEquals
                  )
                    return false;
                  return true;
                });
                return (
                  <section key={formId} className="paper-model-form">
                    <div className="paper-model-form-header">
                      <div>
                        <p className="paper-model-kicker">
                          Mẫu số{" "}
                          {asText(form.formNumber) ||
                            String(formIndex + 1).padStart(2, "0")}
                        </p>
                        <h3>
                          {asText(form.title) ||
                            asText(form.model) ||
                            "Thông tin mô hình"}
                        </h3>
                        {(asText(form.siteName) ||
                          asText(form.siteAddress)) && (
                          <p>
                            {[asText(form.siteName), asText(form.siteAddress)]
                              .filter(Boolean)
                              .join(" · ")}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="paper-form-field-row">
                      {visibleFields.map((item) => {
                        const dataKey = `schoolModelDetails.${formId}.${item.key}`;
                        return (
                          <div
                            key={item.id}
                            className={
                              item.answerType === "repeatable" ||
                              item.answerType === "file" ||
                              item.answerType === "multi-select"
                                ? "md:col-span-2"
                                : ""
                            }
                          >
                            <div className="paper-question">
                              <AnswerControl
                                item={item}
                                fieldKey={dataKey}
                                value={data[dataKey]}
                                attachments={attachments}
                                disabled={disabled}
                                onChange={(value) =>
                                  updateValue(dataKey, value)
                                }
                                onChooseFiles={chooseFiles}
                                onRemoveFile={removeFile}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </section>
                );
              })}
            </section>
          )}

          {(() => {
            const unassignedFiles = attachments.filter(
              (file) =>
                !file.fieldKey || !assignedFileKeys.has(file.fieldKey),
            );
            if (!unassignedFiles.length) return null;
            return (
              <section className="paper-section">
                <div className="paper-section-heading">
                  <span className="paper-section-number">+</span>
                  <h2>Tệp đính kèm khác</h2>
                </div>
                <ul className="mt-4 space-y-2">
                  {unassignedFiles.map((file, index) => (
                    <li
                      key={`${file.name}-${file.fieldKey}-${index}`}
                      className="flex items-center justify-between gap-3 border-b border-dashed border-[#c8ccc5] py-2 text-sm"
                    >
                      <span className="flex min-w-0 items-center gap-2">
                        <FileText
                          size={15}
                          className="shrink-0 text-primary"
                        />
                        <span className="break-all">{file.name}</span>
                      </span>
                      {!disabled && (
                        <button
                          type="button"
                          onClick={() => removeFile(file)}
                          className="focus-ring rounded-md p-1 text-muted-foreground hover:text-rose-700"
                          aria-label={`Xóa ${file.name}`}
                        >
                          <X size={15} />
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              </section>
            );
          })()}

          {error && (
            <p
              className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 font-sans text-sm font-semibold text-rose-900"
              role="alert"
            >
              {error}
            </p>
          )}

          {!disabled && (
            <div className="border-t border-[#aeb2aa] pt-5 font-sans">
              <p className="text-xs leading-5 text-muted-foreground">
                Bản demo lưu nội dung và thông tin tệp trên trình duyệt này; dữ
                liệu không được gửi đến máy chủ và tệp không được tải lên.
              </p>
              <Button
                type="submit"
                className="mt-4 min-h-11 rounded-xl px-5 font-bold"
                data-testid="button-submit-supplement"
              >
                Gửi hồ sơ bổ sung
              </Button>
            </div>
          )}
        </form>
      </article>
    </div>
  );
}

export { SupplementRegistrationForm };
