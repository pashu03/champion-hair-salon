import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean;
  goldBorder?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ children, className, hoverEffect = false, goldBorder = false, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={twMerge(
          clsx(
            "premium-card bg-[#161616] rounded-xl border border-white/5 p-6 transition-all duration-300",
            hoverEffect &&
              "hover:border-[#D4AF37]/30 hover:bg-[#1A1A1A] hover:shadow-[0_8px_30px_rgba(0,0,0,0.6)] hover:-translate-y-0.5",
            goldBorder && "border-[#D4AF37]/40 shadow-[0_0_20px_rgba(212,175,55,0.08)]",
            className
          )
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";
