"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BackLink } from "@/components/back-link/back-link";
import { ConfirmDialog } from "@/components/confirm-dialog/confirm-dialog";
import { PageHeading } from "@/components/page-heading/page-heading";
import { StateBlock } from "@/components/state-block/state-block";
import { StatusTag } from "@/components/status-tag/status-tag";
import { useToast } from "@/components/toast/toast-provider";
import { useDeleteStudent } from "@/hooks/API/students/useDeleteStudent";
import { useGetStudentDetails } from "@/hooks/API/students/useGetStudentDetails";
import { getApiErrorMessage, isNotFoundError } from "@/utils/api-client";
import { formatDate, formatDateTime } from "@/utils/format-date";
import { AttendanceBar } from "./attendance-bar";
import { FormSkeleton } from "./form-skeleton";

// /students/details/[id]
export function StudentDetailsScreen({ id }: { id: string }) {
  const router = useRouter();
  const { showToast } = useToast();
  const details = useGetStudentDetails(id);
  const deleteStudent = useDeleteStudent();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const handleDelete = () => {
    deleteStudent.mutate(id, {
      onSuccess: () => {
        setIsConfirmOpen(false);
        showToast(`${details.data?.fullName ?? "The student"} was deleted.`);
        router.push("/students/list");
      },
      onError: (error) => {
        setIsConfirmOpen(false);
        showToast(getApiErrorMessage(error), "error");
      },
    });
  };

  if (details.isPending) {
    return (
      <main className="page-container page-container-narrow">
        <BackLink href="/students/list" label="Back to students" />
        <PageHeading title="Student" />
        <section className="surface-card surface-card-padded">
          <FormSkeleton />
        </section>
      </main>
    );
  }

  if (details.isError) {
    return (
      <main className="page-container page-container-narrow">
        <BackLink href="/students/list" label="Back to students" />
        <PageHeading title="Student" />
        <section className="surface-card">
          {isNotFoundError(details.error) ? (
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
          )}
        </section>
      </main>
    );
  }

  const student = details.data;

  return (
    <main className="page-container page-container-narrow">
      <BackLink href="/students/list" label="Back to students" />
      <PageHeading
        title={student.fullName}
        description={student.studentCode}
        badge={<StatusTag status={student.status} />}
        actions={
          <>
            <Link href={`/students/edit/${student.id}`} className="btn btn-secondary">
              Edit
            </Link>
            <button type="button" className="btn btn-danger-outline" onClick={() => setIsConfirmOpen(true)}>
              Delete
            </button>
          </>
        }
      />

      {/* Read-only details as a description list */}
      <section className="surface-card surface-card-padded" data-testid="student-details">
        <dl className="detail-list">
          <div className="detail-row">
            <dt>Student ID</dt>
            <dd>{student.studentCode}</dd>
          </div>
          <div className="detail-row">
            <dt>Email</dt>
            <dd className="detail-value-wrap">{student.email}</dd>
          </div>
          <div className="detail-row">
            <dt>Grade</dt>
            <dd>Grade {student.grade}</dd>
          </div>
          <div className="detail-row">
            <dt>Joined on</dt>
            <dd>{formatDate(student.joinedOn)}</dd>
          </div>
          <div className="detail-row">
            <dt>Attendance</dt>
            <dd>
              <AttendanceBar percent={student.attendancePercent} />
            </dd>
          </div>
          <div className="detail-row">
            <dt>Status</dt>
            <dd>
              <StatusTag status={student.status} />
            </dd>
          </div>
          <div className="detail-row">
            <dt>Last updated</dt>
            <dd>{formatDateTime(student.updatedAt)}</dd>
          </div>
        </dl>
      </section>

      <ConfirmDialog
        open={isConfirmOpen}
        title={`Delete ${student.fullName}?`}
        message="This removes the student and can't be undone."
        confirmLabel="Delete student"
        isWorking={deleteStudent.isPending}
        onConfirm={handleDelete}
        onCancel={() => setIsConfirmOpen(false)}
      />
    </main>
  );
}
