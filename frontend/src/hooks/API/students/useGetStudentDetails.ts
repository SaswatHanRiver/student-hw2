"use client";

import { useQuery } from "@tanstack/react-query";
import { StudentService } from "@/api-services/StudentService";
import { QUERIES } from "@/utils/api-integration";

// One student, for the details and edit screens
export function useGetStudentDetails(id: string) {
  return useQuery({
    queryKey: QUERIES.STUDENT_DETAILS(id),
    queryFn: () => StudentService.getById(id),
  });
}
