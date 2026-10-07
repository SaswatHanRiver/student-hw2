import { STATUS_LABELS } from "@/constants/student-list";
import type { StudentStatus } from "@/types/student";

// Maps each status to its WM-style class name
const STATUS_CLASS: Record<StudentStatus, string> = {
  ACTIVE: "status-tag-active",
  ON_LEAVE: "status-tag-on-leave",
  GRADUATED: "status-tag-graduated",
};

interface StatusTagProps {
  status: StudentStatus;
}

// Coloured pill showing a student's status
export function StatusTag({ status }: StatusTagProps) {
  return <span className={`status-tag ${STATUS_CLASS[status]}`}>{STATUS_LABELS[status]}</span>;
}
