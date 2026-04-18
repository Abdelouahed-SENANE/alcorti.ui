"use client";

import { cn } from "@/lib/utils";
import { Skeleton } from "../skeleton";

export const DocumentViewerSkeleton = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn(
        "relative flex flex-col h-full items-center justify-center mx-auto gap-4",
        className,
      )}
    >
      {/* Main viewer skeleton */}
      <div className="relative  h-[500px] border rounded-xl p-4 w-[500px] bg-card overflow-hidden">
        <Skeleton className="w-full h-full" />
      </div>

      {/* Thumbs skeleton */}
      <div className="border rounded-2xl p-2 bg-card max-w-fit mx-auto">
        <div className="flex gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="w-16 h-16 rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  );
};