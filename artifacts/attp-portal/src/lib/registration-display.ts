import {
  getCriteriaSet,
  isRegistrationCriteriaVisible,
  type ApplicationType,
  type CriteriaDefinition,
  type CriteriaGroup,
} from "@/lib/mock-data";

type RegistrationAttachment = {
  name: string;
  fieldKey?: string;
};

type RegistrationDisplayInput = {
  type?: ApplicationType;
  data?: Record<string, unknown>;
  attachments?: RegistrationAttachment[];
  criteriaSnapshot?: CriteriaDefinition[];
  criteriaGroups?: CriteriaGroup[];
};

export type RegistrationDisplay = {
  criteria: CriteriaDefinition[];
  groups: CriteriaGroup[];
  hasSavedData: boolean;
  reconstructed: boolean;
  schoolModelForms: unknown[];
};

const hasSavedAnswer = (
  item: CriteriaDefinition,
  data: Record<string, unknown>,
  attachments: RegistrationAttachment[],
) => {
  if (item.answerType === "file") {
    return attachments.some((file) => file.fieldKey === item.key);
  }
  if (!Object.prototype.hasOwnProperty.call(data, item.key)) return false;
  const value = data[item.key];
  if (value === undefined || value === null) return false;
  if (typeof value === "string") return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === "object") return Object.keys(value).length > 0;
  return true;
};

export const buildRegistrationDisplay = ({
  type,
  data = {},
  attachments = [],
  criteriaSnapshot = [],
  criteriaGroups = [],
}: RegistrationDisplayInput): RegistrationDisplay => {
  const savedForms = Array.isArray(data.schoolModelForms)
    ? data.schoolModelForms
    : [];
  const hasSavedData =
    Object.keys(data).length > 0 || attachments.length > 0 || savedForms.length > 0;

  if (!type || !hasSavedData) {
    return {
      criteria: [],
      groups: [],
      hasSavedData,
      reconstructed: false,
      schoolModelForms: savedForms,
    };
  }

  const hasCriteriaSnapshot = criteriaSnapshot.length > 0;
  const criteriaSource = hasCriteriaSnapshot
    ? criteriaSnapshot
    : getCriteriaSet(type).criteria.filter((item) =>
        hasSavedAnswer(item, data, attachments),
      );
  const criteria = criteriaSource
    .filter(
      (item) =>
        item.active && isRegistrationCriteriaVisible(item, data, type),
    )
    .sort((a, b) => a.order - b.order);
  const groupSource =
    criteriaGroups.length > 0
      ? criteriaGroups
      : getCriteriaSet(type).groups;
  const groups = groupSource
    .filter((group) => criteria.some((item) => item.groupId === group.id))
    .sort((a, b) => a.order - b.order);

  return {
    criteria,
    groups,
    hasSavedData,
    reconstructed: !hasCriteriaSnapshot,
    schoolModelForms: savedForms,
  };
};
