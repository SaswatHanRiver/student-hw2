// Types for the Student API. They match the Spring Boot DTOs:
// StudentResponse, StudentRequest, PageResponse, ApiError (backend/src/main/java/...).

export type StudentStatus = "ACTIVE" | "ON_LEAVE" | "GRADUATED";

// Sort options the API accepts (backend enum StudentSort)
export type StudentSort = "STUDENT_ID" | "NAME" | "NEWEST" | "ATTENDANCE_LOW";

// One student as the API returns it
export interface Student {
  id: string; // sent as a string so JavaScript never loses precision
  studentCode: string; // "STU-2026-001"
  fullName: string;
  email: string;
  grade: number; // 6 to 10
  joinedOn: string; // ISO date "YYYY-MM-DD"
  attendancePercent: number; // 0 to 100
  status: StudentStatus;
  createdAt: string; // ISO instant
  updatedAt: string; // ISO instant
}

// Body for create (POST) and edit (PUT)
export interface StudentRequest {
  studentCode: string;
  fullName: string;
  email: string;
  grade: number;
  joinedOn: string;
  attendancePercent: number;
  status: StudentStatus;
}

// Query parameters for the list
export interface StudentListParams {
  search: string;
  grade: string; // "" = all grades
  status: StudentStatus | ""; // "" = all statuses
  sort: StudentSort;
  page: number; // 1-based
  size: number;
}

// One page of results
export interface PageResponse<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
}

// The one error shape every API error uses
export interface ApiFieldError {
  field: string;
  message: string;
}

export interface ApiError {
  code: string;
  message: string;
  fieldErrors: ApiFieldError[];
}
