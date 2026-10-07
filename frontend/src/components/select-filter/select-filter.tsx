"use client";

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectFilterProps {
  id: string;
  label: string;
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
}

// Controlled dropdown used for the grade and status filters
export function SelectFilter({ id, label, value, options, onChange }: SelectFilterProps) {
  return (
    <div className="form-field">
      <label className="form-label" htmlFor={id}>
        {label}
      </label>
      <select id={id} className="form-select" value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
