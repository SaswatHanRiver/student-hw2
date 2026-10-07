import { apiClient } from "@/utils/api-client";
import { API_ENDPOINTS } from "@/utils/api-integration";
import type { PageResponse, Student, StudentListParams, StudentRequest } from "@/types/student";

// Layer 2 of 3: the axios calls for students. No React here, like a backend client class.
export const StudentService = {
  // GET /api/v1/students?search=&grade=&status=&sort=&page=&size=
  async getList(params: StudentListParams): Promise<PageResponse<Student>> {
    const { data } = await apiClient.get<PageResponse<Student>>(API_ENDPOINTS.STUDENTS, {
      params: {
        search: params.search || undefined, // empty values are left out of the URL
        grade: params.grade || undefined,
        status: params.status || undefined,
        sort: params.sort,
        page: params.page,
        size: params.size,
      },
    });
    return data;
  },

  async getById(id: string): Promise<Student> {
    const { data } = await apiClient.get<Student>(API_ENDPOINTS.STUDENT_BY_ID(id));
    return data;
  },

  async create(body: StudentRequest): Promise<Student> {
    const { data } = await apiClient.post<Student>(API_ENDPOINTS.STUDENTS, body);
    return data;
  },

  async update(id: string, body: StudentRequest): Promise<Student> {
    const { data } = await apiClient.put<Student>(API_ENDPOINTS.STUDENT_BY_ID(id), body);
    return data;
  },

  async remove(id: string): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.STUDENT_BY_ID(id));
  },
};
