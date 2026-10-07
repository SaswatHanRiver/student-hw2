// Layer 1 of 3: endpoint paths and query keys live in one place.

export const API_ENDPOINTS = {
  STUDENTS: "/api/v1/students",
  STUDENT_BY_ID: (id: string) => `/api/v1/students/${id}`,
};

// TanStack Query cache keys. Lists and details share the "students" root,
// so invalidating ["students"] refreshes everything about students.
export const QUERIES = {
  STUDENTS: ["students"] as const,
  STUDENT_LIST: (params: object) => ["students", "list", params] as const,
  STUDENT_DETAILS: (id: string) => ["students", "details", id] as const,
};
