"use client";

import type { HTMLInputTypeAttribute } from "react";

interface FormInputProps {
  id: string;
  label: string;
  value: string;
  type?: HTMLInputTypeAttribute;
  error?: string;
  hint?: string;
  required?: boolean;
  placeholder?: string;
  inputMode?: "text" | "numeric" | "email";
  max?: string;
  onChange: (value: string) => void;
}

// Labelled input with an optional hint and error message under it
export function FormInput({ id, label, value, type = "text", error, hint, required, placeholder, inputMode, max, onChange }: FormInputProps) {
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;

  return (
    <div className="form-field">
      <label className="form-label" htmlFor={id}>
        {label}
        {required && <span className="form-required"> *</span>}
      </label>
      <input
        id={id}
        name={id}
        className={error ? "form-input form-input-invalid" : "form-input"}
        type={type}
        value={value}
        placeholder={placeholder}
        inputMode={inputMode}
        max={max}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        onChange={(event) => onChange(event.target.value)}
      />
      {error ? (
        <p id={`${id}-error`} className="form-error">
          {error}
        </p>
      ) : (
        hint && (
          <p id={`${id}-hint`} className="form-hint">
            {hint}
          </p>
        )
      )}
    </div>
  );
}
