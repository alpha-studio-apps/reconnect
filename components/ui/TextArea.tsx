"use client";

import { forwardRef } from "react";
import type { TextareaHTMLAttributes } from "react";

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  saveState?: "idle" | "saving" | "saved";
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ label, error, saveState, className = "", id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="flex flex-col gap-1.5">
        {(label || saveState) && (
          <div className="flex items-center justify-between">
            {label && (
              <label htmlFor={inputId} className="text-caption text-muted">
                {label}
              </label>
            )}
            {saveState && saveState !== "idle" && (
              <span
                className={`text-caption transition-opacity duration-300 ${
                  saveState === "saving" ? "text-dim" : "text-sage"
                }`}
              >
                {saveState === "saving" ? "Saving…" : "Saved"}
              </span>
            )}
          </div>
        )}
        <textarea
          ref={ref}
          id={inputId}
          className={`field-input field-textarea ${
            error ? "border-red-500/50 focus:border-red-500/70" : ""
          } ${className}`}
          {...props}
        />
        {error && <p className="text-caption text-red-400">{error}</p>}
      </div>
    );
  }
);

TextArea.displayName = "TextArea";
