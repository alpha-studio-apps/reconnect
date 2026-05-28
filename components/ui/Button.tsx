"use client";

import type { ComponentProps } from "react";

type Variant = "primary" | "green" | "ghost" | "danger";

interface ButtonProps extends ComponentProps<"button"> {
  variant?: Variant;
  loading?: boolean;
}

export function Button({
  variant = "green",
  loading,
  disabled,
  children,
  className = "",
  ...props
}: ButtonProps) {
  const base =
    variant === "primary"
      ? "btn-primary"
      : variant === "green"
      ? "btn-green"
      : variant === "ghost"
      ? "btn-ghost"
      : "btn-ghost text-red-400 border-red-900/30 hover:border-red-700/40 hover:text-red-300";

  return (
    <button
      disabled={disabled || loading}
      className={`${base} ${className} disabled:opacity-40 disabled:cursor-not-allowed`}
      {...props}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          {children}
        </span>
      ) : (
        children
      )}
    </button>
  );
}
