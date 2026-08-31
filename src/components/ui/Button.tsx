import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Loader2 } from "lucide-react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "premium-button relative isolate overflow-hidden inline-flex items-center justify-center font-medium rounded-lg transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]";

    const sizeStyles = {
      sm: "text-xs px-3 py-1.5 gap-1.5",
      md: "text-sm px-5 py-2.5 gap-2",
      lg: "text-base px-6 py-3.5 gap-2.5",
    };

    const variantStyles = {
      primary:
        "bg-gradient-to-r from-[#DFBA45] via-[#D4AF37] to-[#B89320] text-black font-semibold shadow-[0_2px_12px_rgba(212,175,55,0.25)] hover:shadow-[0_4px_20px_rgba(212,175,55,0.4)] hover:brightness-105 border border-[#F5E296]/30",
      secondary:
        "bg-[#1A1A1A] hover:bg-[#242424] text-white border border-white/10 hover:border-[#D4AF37]/40 shadow-sm",
      outline:
        "bg-transparent hover:bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37] hover:border-[#F5E296]",
      ghost:
        "bg-transparent hover:bg-white/5 text-[#B5B5B5] hover:text-white border border-transparent",
      danger:
        "bg-red-950/40 hover:bg-red-900/60 text-red-400 border border-red-800/50 hover:border-red-700",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={twMerge(
          clsx(baseStyles, sizeStyles[size], variantStyles[variant], className)
        )}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin text-current" />
        ) : (
          leftIcon
        )}
        <span>{children}</span>
        {!isLoading && rightIcon}
      </button>
    );
  }
);

Button.displayName = "Button";
