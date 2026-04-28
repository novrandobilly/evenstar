import { forwardRef } from "react";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type EvenStarButtonVariant = "solid" | "outline" | "ghost" | "tab";
type EvenStarButtonSize = "sm" | "md";

export interface EvenStarButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: EvenStarButtonVariant;
  size?: EvenStarButtonSize;
  active?: boolean;
  fullWidth?: boolean;
}

export const EvenStarButton = forwardRef<
  HTMLButtonElement,
  EvenStarButtonProps
>(
  (
    {
      className,
      variant = "outline",
      size = "md",
      active = false,
      fullWidth = false,
      type = "button",
      ...props
    },
    ref,
  ) => {
    const sizeStyles = {
      sm: "px-3 py-1.5 text-[10px]",
      md: "px-4 py-2 text-xs",
    };

    const variantStyles = {
      solid:
        "text-ivory bg-club-green hover:bg-club-green-mid active:bg-club-green-light border border-club-green",
      outline:
        "text-club-green-muted border border-ivory-rule hover:border-gold hover:text-gold bg-transparent",
      ghost: "text-club-green-muted hover:text-club-green bg-transparent",
      tab: active
        ? "text-club-green border-gold font-medium"
        : "text-club-green-muted border-transparent hover:text-club-green",
    };

    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          "inline-flex items-center justify-center uppercase tracking-[0.2em] transition-colors disabled:cursor-not-allowed disabled:opacity-50",
          variant === "tab" ? "border-b pb-1" : "",
          sizeStyles[size],
          variantStyles[variant],
          fullWidth ? "w-full" : "",
          className,
        )}
        {...props}
      />
    );
  },
);

EvenStarButton.displayName = "EvenStarButton";
