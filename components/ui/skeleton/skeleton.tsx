"use client";
import { cn } from "@/lib/utils"

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("bg-card-foreground/5 shimmer shimmer-bg shimmer-speed-400 shimmer-duration-1000 shimmer-color-card-foreground/5 rounded-xs", className)}
      {...props}
    />
  )
}

export { Skeleton }
