import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-[var(--ff-accent)] text-white hover:bg-[var(--ff-accent-hover)]",
        outline:
          "border border-[var(--ff-border)] bg-transparent text-[var(--ff-text)] hover:bg-[var(--ff-sidebar-hover)]",
        ghost: "text-[var(--ff-text-secondary)] hover:bg-[var(--ff-sidebar-hover)] hover:text-[var(--ff-text)]",
        destructive: "bg-red-600 text-white hover:bg-red-700",
        capture:
          "bg-[var(--ff-accent)] text-white hover:bg-[var(--ff-accent-hover)] shadow-sm",
        secondary:
          "border border-[var(--ff-border)] bg-[var(--ff-surface-elevated)] text-[var(--ff-text)] hover:bg-[var(--ff-sidebar-hover)]",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp className={cn(buttonVariants({ variant, size, className }))} {...props} />
  );
}
