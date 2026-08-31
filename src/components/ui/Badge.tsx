import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "gold" | "success" | "warning" | "danger" | "info" | "neutral";
  size?: "sm" | "md";
}

export const Badge = ({
  children,
  className,
  variant = "gold",
  size = "md",
  ...props
}: BadgeProps) => {
  const sizeStyles = {
    sm: "text-[11px] px-2 py-0.5 uppercase tracking-wider font-semibold",
    md: "text-xs px-2.5 py-1 font-medium",
  };

  const variantStyles = {
    gold: "bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/30",
    success: "bg-emerald-950/40 text-emerald-400 border border-emerald-800/40",
    warning: "bg-amber-950/40 text-amber-400 border border-amber-800/40",
    danger: "bg-rose-950/40 text-rose-400 border border-rose-800/40",
    info: "bg-sky-950/40 text-sky-400 border border-sky-800/40",
    neutral: "bg-white/5 text-[#B5B5B5] border border-white/10",
  };

  return (
    <span
      className={twMerge(
        clsx(
          "inline-flex items-center gap-1.5 rounded-full",
          sizeStyles[size],
          variantStyles[variant],
          className
        )
      )}
      {...props}
    >
      {children}
    </span>
  );
};
