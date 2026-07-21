import * as React from "react";
import { cn } from "@/lib/utils";

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  ism?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

const olchamlar = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-14 w-14 text-lg",
  xl: "h-20 w-20 text-2xl",
};

function bosh(ism?: string) {
  if (!ism) return "?";
  const parts = ism.trim().split(/\s+/);
  return (parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "");
}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, ism, size = "md", ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full bg-primary/10 font-semibold uppercase text-primary ring-1 ring-inset ring-primary/10",
        olchamlar[size],
        className
      )}
      {...props}
    >
      {bosh(ism)}
    </div>
  )
);
Avatar.displayName = "Avatar";

export { Avatar };
