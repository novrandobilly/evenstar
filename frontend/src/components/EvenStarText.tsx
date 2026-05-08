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
  | "faint"
  | "accent"
  | "win"
  | "loss"
  | "draw"
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
    display:  "font-display text-[2.25rem] font-bold leading-none tracking-tight",
    headline: "font-display text-xl font-bold leading-tight",
    title:    "text-sm font-semibold",
    body:     "text-sm leading-relaxed",
    label:    "text-xs font-semibold",
    meta:     "text-xs",
  };

  const toneStyles = {
    primary: "text-ink",
    muted:   "text-ink-2",
    faint:   "text-ink-3",
    accent:  "text-ace",
    win:     "text-win",
    loss:    "text-loss",
    draw:    "text-draw",
    inverse: "text-surface",
  };

  return (
    <Component
      className={cn(
        variantStyles[variant],
        toneStyles[tone],
        caps    ? "uppercase tracking-[0.1em]" : "",
        italic  ? "italic" : "",
        numeric ? "tabular-nums" : "",
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  );
}
