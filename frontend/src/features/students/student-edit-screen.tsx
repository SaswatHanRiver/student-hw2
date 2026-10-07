"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { BackLink } from "@/components/back-link/back-link";
import { PageHeading } from "@/components/page-heading/page-heading";
import { StateBlock } from "@/components/state-block/state-block";
import { useToast } from "@/components/toast/toast-provider";
import { useGetStudentDetails } from "@/hooks/API/students/useGetStudentDetails";
import { useUpdateStudent } from "@/hooks/API/students/useUpdateStudent";
import { getApiErrorMessage, getApiFieldErrors, isNotFoundError } from "@/utils/api-client";
import { FormSkeleton } from "./form-skeleton";
import { StudentForm } from "./student-form";
import { toStudentFormValues } from "./student-form-rules";

// /students/edit/[id]
export function StudentEditScreen({ id }: { id: string }) {
  const router = useRouter();
  const { showToast } = useToast();
  const details = useGetStudentDetails(id);
  const updateStudent = useUpdateStudent(id);

  const renderBody = () => {
    if (details.isPending) return <FormSkeleton />;

    if (details.isError) {
      return isNotFoundError(details.error) ? (
        <StateBlock
          testId="state-not-found"
          title="Student not found"
          message="This student doesn't exist or was already deleted."
          action={
            <Link href="/students/list" className="btn btn-secondary">
              Back to students
            </Link>
          }
        />
      ) : (
        <StateBlock
          variant="error"
          testId="state-error"
          title="Couldn't load this student"
          message={getApiErrorMessage(details.error)}
          action={
            <button type="button" className="btn btn-secondary" onClick={() => details.refetch()}>
              Try again
            </button>
          }
        />
      );
    }

    return (
      <StudentForm
        key={details.data.id} // a new student = a fresh form with its values
        initialValues={toStudentFormValues(details.data)}
        submitLabel="Save changes"
        cancelHref={`/students/details/${id}`}
        isSaving={updateStudent.isPending}
        serverMessage={updateStudent.isError ? getApiErrorMessage(updateStudent.error) : undefined}
        serverFieldErrors={updateStudent.isError ? getApiFieldErrors(updateStudent.error) : undefined}
        onSubmit={(body) =>
          updateStudent.mutate(body, {
            onSuccess: (student) => {
              showToast(`Changes to ${student.fullName} were saved.`);
              router.push("/students/list");
            },
          })
        }
      />
    );
  };

  return (
    <main className="page-container page-container-narrow">
      <BackLink href={`/students/details/${id}`} label="Back to student" />
      <PageHeading title="Edit student" description="Fields marked * are required." />
      <section className="surface-card surface-card-padded">{renderBody()}</section>
    </main>
  );
}
