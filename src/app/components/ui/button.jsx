import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";

import { cn } from "./utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--button-default-bg)] text-[var(--button-default-text)] hover:bg-[var(--button-default-hover-bg)]",
        destructive:
          "bg-[var(--button-destructive-bg)] text-[var(--button-destructive-text)] hover:bg-[var(--button-destructive-hover-bg)] focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40",
        outline:
          "border-[var(--button-outline-border)] bg-background text-[var(--button-outline-text)] hover:bg-[var(--button-outline-hover-bg)] hover:text-[var(--button-outline-hover-text)] hover:border-[var(--button-outline-hover-border)] dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary:
          "bg-[var(--button-secondary-bg)] text-[var(--button-secondary-text)] hover:bg-[var(--button-secondary-hover-bg)]",
        ghost:
          "text-[var(--button-ghost-text)] hover:bg-[var(--button-ghost-hover-bg)] hover:text-[var(--button-ghost-text)]",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9 rounded-md",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({ className, variant, size, asChild = false, ...props }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
