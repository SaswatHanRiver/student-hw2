"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { StudentService } from "@/api-services/StudentService";
import { QUERIES } from "@/utils/api-integration";
import type { StudentRequest } from "@/types/student";

// Create a student, then mark every cached student query as stale so the list refreshes by itself
export function useCreateStudent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: StudentRequest) => StudentService.create(body),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERIES.STUDENTS }),
  });
}
