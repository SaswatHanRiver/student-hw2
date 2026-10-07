import type { Student, StudentRequest, StudentStatus } from "@/types/student";
import { todayIsoDate } from "@/utils/format-date";

// Validation for the create/edit form.
// These rules and messages COPY the backend exactly:
//   backend/src/main/java/com/divii/training/studentapi/student/dto/StudentRequest.java
// If you change one, change the other.

export const STUDENT_CODE_PATTERN = /^STU-\d{4}-\d{3}$/;
export const EMAIL_PATTERN = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
export const NAME_MIN = 2;
export const NAME_MAX = 50;
export const EMAIL_MAX = 100;
export const GRADE_MIN = 6;
export const GRADE_MAX = 10;
export const ATTENDANCE_MIN = 0;
export const ATTENDANCE_MAX = 100;

// What the form holds while the user types: everything is a string
export interface StudentFormValues {
  studentCode: string;
  fullName: string;
  email: string;
  grade: string;
  joinedOn: string;
  attendancePercent: string;
  status: StudentStatus | "";
}

export type StudentFormField = keyof StudentFormValues;
export type StudentFormErrors = Partial<Record<StudentFormField, string>>;

export const EMPTY_STUDENT_FORM: StudentFormValues = {
  studentCode: "",
  fullName: "",
  email: "",
  grade: "",
  joinedOn: "",
  attendancePercent: "",
  status: "ACTIVE",
};

// Whole number check for grade / attendance ("8" yes, "8.5" or "abc" no)
function toWholeNumber(value: string): number | null {
  return /^\d+$/.test(value.trim()) ? Number(value.trim()) : null;
}

// Returns one message per invalid field (empty object = valid)
export function validateStudentForm(values: StudentFormValues): StudentFormErrors {
  const errors: StudentFormErrors = {};
  const code = values.studentCode.trim();
  const name = values.fullName.trim();
  const email = values.email.trim();

  if (!code) errors.studentCode = "Student ID is required.";
  else if (!STUDENT_CODE_PATTERN.test(code)) errors.studentCode = "Student ID must look like STU-2026-001.";

  if (!name) errors.fullName = "Name is required.";
  else if (name.length < NAME_MIN || name.length > NAME_MAX) errors.fullName = "Name must be 2 to 50 characters.";

  if (!email) errors.email = "Email is required.";
  else if (email.length > EMAIL_MAX) errors.email = "Email must be 100 characters or fewer.";
  else if (!EMAIL_PATTERN.test(email)) errors.email = "Enter a valid email address, like name@example.com.";

  const grade = toWholeNumber(values.grade);
  if (!values.grade) errors.grade = "Grade is required.";
  else if (grade === null || grade < GRADE_MIN || grade > GRADE_MAX) errors.grade = "Grade must be between 6 and 10.";

  if (!values.joinedOn) errors.joinedOn = "Joined on date is required.";
  else if (values.joinedOn > todayIsoDate()) errors.joinedOn = "Joined on date can't be in the future.";

  const attendance = toWholeNumber(values.attendancePercent);
  if (!values.attendancePercent.trim()) errors.attendancePercent = "Attendance is required.";
  else if (attendance === null || attendance < ATTENDANCE_MIN || attendance > ATTENDANCE_MAX)
    errors.attendancePercent = "Attendance must be between 0 and 100.";

  if (!values.status) errors.status = "Status is required.";

  return errors;
}

// Form values -> API body (call only after validateStudentForm returned no errors)
export function toStudentRequest(values: StudentFormValues): StudentRequest {
  return {
    studentCode: values.studentCode.trim(),
    fullName: values.fullName.trim(),
    email: values.email.trim(),
    grade: Number(values.grade),
    joinedOn: values.joinedOn,
    attendancePercent: Number(values.attendancePercent.trim()),
    status: values.status as StudentStatus,
  };
}

// API student -> form values (edit mode fills the form with these)
export function toStudentFormValues(student: Student): StudentFormValues {
  return {
    studentCode: student.studentCode,
    fullName: student.fullName,
    email: student.email,
    grade: String(student.grade),
    joinedOn: student.joinedOn,
    attendancePercent: String(student.attendancePercent),
    status: student.status,
  };
}
