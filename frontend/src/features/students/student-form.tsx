"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { FormInput } from "@/components/form-field/form-input";
import { FormSelect } from "@/components/form-field/form-select";
import type { SelectOption } from "@/components/select-filter/select-filter";
import { GRADE_OPTIONS, STATUS_LABELS } from "@/constants/student-list";
import type { StudentRequest, StudentStatus } from "@/types/student";
import { todayIsoDate } from "@/utils/format-date";
import {
  toStudentRequest,
  validateStudentForm,
  type StudentFormErrors,
  type StudentFormField,
  type StudentFormValues,
} from "./student-form-rules";

const GRADE_FORM_OPTIONS: SelectOption[] = [
  { value: "", label: "Select a grade" },
  ...GRADE_OPTIONS.map((grade) => ({ value: String(grade), label: `Grade ${grade}` })),
];

const STATUS_FORM_OPTIONS: SelectOption[] = (Object.keys(STATUS_LABELS) as StudentStatus[]).map((status) => ({
  value: status,
  label: STATUS_LABELS[status],
}));

interface StudentFormProps {
  initialValues: StudentFormValues;
  submitLabel: string;
  cancelHref: string;
  isSaving: boolean; // true while the request runs: the submit button is disabled
  serverMessage?: string; // API error message to show above the form
  serverFieldErrors?: Record<string, string>; // API errors per field (validation 400 / duplicate 409)
  onSubmit: (body: StudentRequest) => void;
}

// Shared create/edit form. It owns what the user types; the screen owns the API call.
export function StudentForm({ initialValues, submitLabel, cancelHref, isSaving, serverMessage, serverFieldErrors = {}, onSubmit }: StudentFormProps) {
  const [values, setValues] = useState<StudentFormValues>(initialValues);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  // Fields the user changed since the last submit: their old server error is hidden
  const [editedSinceSubmit, setEditedSinceSubmit] = useState<Set<StudentFormField>>(new Set());

  // Client errors show only after the first submit, then update live as the user fixes them
  const clientErrors: StudentFormErrors = hasSubmitted ? validateStudentForm(values) : {};

  const errorFor = (field: StudentFormField): string | undefined =>
    clientErrors[field] ?? (editedSinceSubmit.has(field) ? undefined : serverFieldErrors[field]);

  const setField = (field: StudentFormField, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
    setEditedSinceSubmit((current) => new Set(current).add(field));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSaving) return; // second click while saving does nothing
    setHasSubmitted(true);
    setEditedSinceSubmit(new Set());
    const errors = validateStudentForm(values);
    if (Object.keys(errors).length > 0) {
      // Move focus to the first invalid field so keyboard and screen-reader users land on it
      const firstInvalid = Object.keys(errors)[0];
      document.getElementById(`student-${firstInvalid}`)?.focus();
      return;
    }
    onSubmit(toStudentRequest(values));
  };

  return (
    <form className="student-form" onSubmit={handleSubmit} noValidate aria-busy={isSaving}>
      {/* API error that is not about one field (e.g. server down) */}
      {serverMessage && (
        <div className="form-alert" role="alert" data-testid="form-server-error">
          {serverMessage}
        </div>
      )}

      <div className="student-form-grid">
        <FormInput
          id="student-studentCode"
          label="Student ID"
          required
          value={values.studentCode}
          placeholder="STU-2026-001"
          hint="Format: STU-YEAR-NUMBER, e.g. STU-2026-001"
          error={errorFor("studentCode")}
          onChange={(value) => setField("studentCode", value.toUpperCase())}
        />
        <FormInput
          id="student-fullName"
          label="Name"
          required
          value={values.fullName}
          error={errorFor("fullName")}
          onChange={(value) => setField("fullName", value)}
        />
        <FormInput
          id="student-email"
          label="Email"
          type="email"
          inputMode="email"
          required
          value={values.email}
          placeholder="name@example.com"
          error={errorFor("email")}
          onChange={(value) => setField("email", value)}
        />
        <FormSelect
          id="student-grade"
          label="Grade"
          required
          value={values.grade}
          options={GRADE_FORM_OPTIONS}
          error={errorFor("grade")}
          onChange={(value) => setField("grade", value)}
        />
        <FormInput
          id="student-joinedOn"
          label="Joined on"
          type="date"
          required
          max={todayIsoDate()}
          value={values.joinedOn}
          error={errorFor("joinedOn")}
          onChange={(value) => setField("joinedOn", value)}
        />
        <FormInput
          id="student-attendancePercent"
          label="Attendance (%)"
          inputMode="numeric"
          required
          value={values.attendancePercent}
          placeholder="0 to 100"
          error={errorFor("attendancePercent")}
          onChange={(value) => setField("attendancePercent", value)}
        />
        <FormSelect
          id="student-status"
          label="Status"
          required
          value={values.status}
          options={STATUS_FORM_OPTIONS}
          error={errorFor("status")}
          onChange={(value) => setField("status", value)}
        />
      </div>

      <div className="student-form-actions">
        <Link href={cancelHref} className="btn btn-secondary">
          Cancel
        </Link>
        <button type="submit" className="btn btn-primary" disabled={isSaving}>
          {isSaving ? "Saving..." : submitLabel}
        </button>
      </div>
    </form>
  );
}
