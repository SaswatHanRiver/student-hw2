"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { StudentService } from "@/api-services/StudentService";
import { QUERIES } from "@/utils/api-integration";
import type { StudentRequest } from "@/types/student";

// Edit a student, then refresh the list and this student's details
export function useUpdateStudent(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: StudentRequest) => StudentService.update(id, body),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERIES.STUDENTS }),
  });
}
