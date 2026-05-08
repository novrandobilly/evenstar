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
      sm: "min-h-[44px] px-4 text-xs",
      md: "min-h-[44px] px-5 text-sm",
    };

    const variantStyles = {
      solid:
        "bg-ace text-surface font-bold hover:bg-ace-mid active:bg-ace-mid/80 border border-ace shadow-sm",
      outline:
        "text-ink-2 border border-edge hover:border-ace hover:text-ace bg-transparent",
      ghost:
        "text-ink-2 hover:text-ink bg-transparent",
      tab: active
        ? "text-ace border-b-2 border-ace font-bold"
        : "text-ink-2 border-b-2 border-transparent hover:text-ink",
    };

    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          "inline-flex items-center justify-center font-semibold uppercase tracking-[0.08em] transition-colors disabled:cursor-not-allowed disabled:opacity-40",
          variant === "tab" ? "rounded-none" : variant === "ghost" ? "rounded-xl" : "rounded-full",
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
