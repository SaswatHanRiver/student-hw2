"use client";

import type { SelectOption } from "@/components/select-filter/select-filter";

interface FormSelectProps {
  id: string;
  label: string;
  value: string;
  options: SelectOption[];
  error?: string;
  required?: boolean;
  onChange: (value: string) => void;
}

// Labelled select with an error message under it (forms; the list filters use SelectFilter)
export function FormSelect({ id, label, value, options, error, required, onChange }: FormSelectProps) {
  return (
    <div className="form-field">
      <label className="form-label" htmlFor={id}>
        {label}
        {required && <span className="form-required"> *</span>}
      </label>
      <select
        id={id}
        name={id}
        className={error ? "form-select form-input-invalid" : "form-select"}
        value={value}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        onChange={(event) => onChange(event.target.value)}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p id={`${id}-error`} className="form-error">
          {error}
        </p>
      )}
    </div>
  );
}
