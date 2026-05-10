import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";

import { cn } from "./utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-semibold transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:outline-none focus-visible:ring-4 active:scale-95 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",

        // RecycleHub Brand Gradient 🎨
        brand: "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md hover:shadow-lg focus-visible:ring-emerald-300",

        // Brand Outline
        "outline-brand": "border-2 border-emerald-500 text-emerald-600 bg-white hover:bg-emerald-50 focus-visible:ring-emerald-200",

        destructive:
          "bg-red-500 text-white hover:bg-red-600 focus-visible:ring-red-300 shadow-sm hover:shadow-md",
        outline:
          "border-2 border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus-visible:ring-gray-200",
        secondary:
          "bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50 focus-visible:ring-gray-200",
        ghost:
          "hover:bg-gray-100 text-gray-600 focus-visible:ring-gray-200",
        link: "text-emerald-600 underline-offset-4 hover:underline focus-visible:ring-0",
      },
      size: {
        default: "h-10 px-6 py-3 rounded-xl",
        sm: "h-8 px-3 py-2 text-sm rounded-lg",
        lg: "h-12 px-8 py-4 text-base rounded-2xl",
        icon: "size-9 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

interface ButtonProps
  extends React.ComponentProps<"button">,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isLoading?: boolean;
}

function Button({
  className,
  variant,
  size,
  asChild = false,
  isLoading = false,
  children,
  disabled,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
      <span className={cn(isLoading && "opacity-70")}>{children}</span>
    </Comp>
  );
}

export { Button, buttonVariants };
export type { ButtonProps };
