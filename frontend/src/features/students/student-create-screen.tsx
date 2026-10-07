"use client";

import { useRouter } from "next/navigation";
import { BackLink } from "@/components/back-link/back-link";
import { PageHeading } from "@/components/page-heading/page-heading";
import { useToast } from "@/components/toast/toast-provider";
import { useCreateStudent } from "@/hooks/API/students/useCreateStudent";
import { getApiErrorMessage, getApiFieldErrors } from "@/utils/api-client";
import { StudentForm } from "./student-form";
import { EMPTY_STUDENT_FORM } from "./student-form-rules";

// /students/create
export function StudentCreateScreen() {
  const router = useRouter();
  const { showToast } = useToast();
  const createStudent = useCreateStudent();

  return (
    <main className="page-container page-container-narrow">
      <BackLink href="/students/list" label="Back to students" />
      <PageHeading title="Add student" description="Fields marked * are required." />

      <section className="surface-card surface-card-padded">
        <StudentForm
          initialValues={EMPTY_STUDENT_FORM}
          submitLabel="Add student"
          cancelHref="/students/list"
          isSaving={createStudent.isPending}
          serverMessage={createStudent.isError ? getApiErrorMessage(createStudent.error) : undefined}
          serverFieldErrors={createStudent.isError ? getApiFieldErrors(createStudent.error) : undefined}
          onSubmit={(body) =>
            createStudent.mutate(body, {
              onSuccess: (student) => {
                showToast(`${student.fullName} was added.`);
                router.push("/students/list");
              },
            })
          }
        />
      </section>
    </main>
  );
}
