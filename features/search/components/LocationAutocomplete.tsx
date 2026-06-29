"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface LocationAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  isActive?: boolean;
  onActivate?: () => void;
}

export function LocationAutocomplete({
  value,
  onChange,
  placeholder = "Search destinations",
  label = "Where",
  isActive = false,
  onActivate,
}: LocationAutocompleteProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (isActive) {
      const timer = setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
          inputRef.current.select();
        }
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isActive]);

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange("");
    inputRef.current?.focus();
  };

  return (
    <div
      className={cn(
        "relative flex flex-col justify-center px-6 py-2.5 cursor-pointer transition-all duration-200 select-none rounded-full flex-1 z-20 h-full",
        isActive
          ? "bg-transparent"
          : "hover:bg-zinc-200/50 dark:hover:bg-zinc-700/50"
      )}
      onClick={() => {
        if (onActivate) onActivate();
      }}
    >
      <div className="flex flex-col flex-1 min-w-0">
        <span className="text-[11px] font-extrabold font-heading tracking-wide text-zinc-900 dark:text-zinc-100">
          {label}
        </span>
        <div className="relative flex items-center mt-0.5">
          <input
            ref={inputRef}
            type="text"
            className="w-full bg-transparent text-sm text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-400 font-normal focus:outline-none border-none p-0"
            placeholder={placeholder}
            value={value}
            onChange={(e) => {
              onChange(e.target.value);
              if (!isActive && onActivate) onActivate();
            }}
          />
          {value && (
            <button
              onClick={handleClear}
              className="p-1 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-400 hover:text-zinc-600 transition-colors ml-1 shrink-0"
            >
              <X className="size-3" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
