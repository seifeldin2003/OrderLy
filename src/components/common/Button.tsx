import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  children: ReactNode;
}

const variants: Record<ButtonVariant, string> = {
  primary: "bg-primary text-white shadow-soft hover:bg-primary-bright",
  secondary: "bg-surface-container text-ink hover:bg-primary-soft",
  ghost: "bg-transparent text-primary hover:bg-surface-container",
  danger: "bg-danger text-white hover:bg-red-700",
};

export function Button({ variant = "primary", className = "", children, ...props }: ButtonProps) {
  return (
    <button
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font700 font-semibold transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
