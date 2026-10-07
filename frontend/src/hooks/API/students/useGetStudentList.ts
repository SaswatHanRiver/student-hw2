"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { StudentService } from "@/api-services/StudentService";
import { QUERIES } from "@/utils/api-integration";
import type { StudentListParams } from "@/types/student";

// Layer 3 of 3: the hook the list screen uses.
// The params are part of the cache key, so each search/filter/page is cached separately.
export function useGetStudentList(params: StudentListParams) {
  return useQuery({
    queryKey: QUERIES.STUDENT_LIST(params),
    queryFn: () => StudentService.getList(params),
    placeholderData: keepPreviousData, // keep showing the last page while the next one loads
  });
}
