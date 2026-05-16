import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export function Input({ label, className = "", ...props }: InputProps) {
  return (
    <label className="block">
      {label && <span className="mb-2 block text-sm font-semibold text-muted">{label}</span>}
      <input
        className={`focus-ring w-full rounded-xl border border-outline bg-white px-4 py-3 text-ink placeholder:text-muted/60 ${className}`}
        {...props}
      />
    </label>
  );
}
