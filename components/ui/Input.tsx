"use client";

import { forwardRef } from "react";
import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = "", id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-caption text-muted"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`field-input ${error ? "border-red-500/50 focus:border-red-500/70" : ""} ${className}`}
          {...props}
        />
        {error && (
          <p className="text-caption text-red-400">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
