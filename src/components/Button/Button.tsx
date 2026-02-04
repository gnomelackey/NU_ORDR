import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "ghost";

type ButtonProps = {
  children: ReactNode;
  variant?: ButtonVariant;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({
  children,
  className = "",
  variant = "primary",
  ...props
}: ButtonProps) {
  const variantClass = variant === "ghost" ? "button--ghost" : "";
  return (
    <button className={`button ${variantClass} ${className}`.trim()} {...props}>
      {children}
    </button>
  );
}
