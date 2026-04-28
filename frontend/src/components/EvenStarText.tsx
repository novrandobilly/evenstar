import type { ElementType, HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type EvenStarTextVariant =
  | "display"
  | "headline"
  | "title"
  | "body"
  | "label"
  | "meta";

type EvenStarTextTone =
  | "primary"
  | "muted"
  | "accent"
  | "win"
  | "loss"
  | "inverse";

export interface EvenStarTextProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  variant?: EvenStarTextVariant;
  tone?: EvenStarTextTone;
  caps?: boolean;
  italic?: boolean;
  numeric?: boolean;
  children: ReactNode;
}

export function EvenStarText({
  as,
  className,
  variant = "body",
  tone = "primary",
  caps = false,
  italic = false,
  numeric = false,
  children,
  ...props
}: EvenStarTextProps) {
  const Component = as ?? "p";

  const variantStyles = {
    display: "font-sans text-3xl font-semibold leading-none tracking-tight",
    headline: "font-sans text-xl font-semibold leading-tight",
    title: "text-sm",
    body: "text-sm",
    label: "text-[10px] tracking-[0.22em]",
    meta: "text-xs",
  };

  const toneStyles = {
    primary: "text-club-green",
    muted: "text-club-green-muted",
    accent: "text-gold",
    win: "text-win",
    loss: "text-loss",
    inverse: "text-ivory",
  };

  return (
    <Component
      className={cn(
        variantStyles[variant],
        toneStyles[tone],
        caps ? "uppercase" : "",
        italic ? "italic" : "",
        numeric ? "tabular-nums" : "",
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  );
}
