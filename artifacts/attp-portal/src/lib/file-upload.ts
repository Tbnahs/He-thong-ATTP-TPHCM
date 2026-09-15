export const EVIDENCE_MAX_SIZE_BYTES = 5 * 1024 * 1024;
export const EVIDENCE_MAX_SIZE_LABEL = "5MB";
export const EVIDENCE_ACCEPT =
  ".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png";

const acceptedMimeTypes = new Set([
  "application/pdf",
  "image/jpeg",
  "image/png",
]);
const acceptedExtensions = new Set([".pdf", ".jpg", ".jpeg", ".png"]);

const hasAcceptedFormat = (file: File) => {
  const extension = file.name.toLowerCase().slice(file.name.lastIndexOf("."));
  return acceptedMimeTypes.has(file.type) || acceptedExtensions.has(extension);
};

export const validateEvidenceFiles = (files: File[]) => {
  const invalidFormat = files.find((file) => !hasAcceptedFormat(file));
  if (invalidFormat) {
    return `Tệp "${invalidFormat.name}" không đúng định dạng. Chỉ nhận PDF, JPG hoặc PNG.`;
  }

  const oversized = files.find(
    (file) => file.size > EVIDENCE_MAX_SIZE_BYTES,
  );
  if (oversized) {
    return `Tệp "${oversized.name}" vượt quá dung lượng tối đa ${EVIDENCE_MAX_SIZE_LABEL}.`;
  }

  return null;
};