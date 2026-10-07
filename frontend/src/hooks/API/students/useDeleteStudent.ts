"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { StudentService } from "@/api-services/StudentService";
import { QUERIES } from "@/utils/api-integration";

// Delete a student. The deleted student's details query is removed (not refetched, it would 404),
// then the lists are refreshed.
export function useDeleteStudent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => StudentService.remove(id),
    onSuccess: (_data, id) => {
      queryClient.removeQueries({ queryKey: QUERIES.STUDENT_DETAILS(id) });
      return queryClient.invalidateQueries({ queryKey: QUERIES.STUDENTS });
    },
  });
}
