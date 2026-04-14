"use client";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Skeleton } from "../ui/skeleton/skeleton";

interface ChartSkeletonProps {
  className?: string;
  height?: number;
}

export const LineChartSkeleton = ({
  className,
  height = 340,
}: ChartSkeletonProps) => {
  return (
    <Card className={cn("p-4 rounded-sm gap-2 shadow-none", className)}>
      <CardHeader className="p-0">
        <Skeleton className="h-5 w-32 rounded-sm" />
      </CardHeader>
      <CardContent className="px-2 py-0">
        <div className="flex flex-col justify-end gap-2" style={{ height }}>
          {/* Legend row */}
          <div className="flex items-center gap-4 mb-2">
            <Skeleton className="h-3 w-16 rounded-sm" />
            <Skeleton className="h-3 w-16 rounded-sm" />
            <Skeleton className="h-3 w-16 rounded-sm" />
          </div>

          {/* Chart bars placeholder */}
          <div className="flex items-end gap-3 flex-1 px-4">
            {Array.from({ length: 11 }).map((_, i) => (
              <Skeleton
                key={i}
                className="flex-1 rounded-sm"
                style={{
                  height: `${30 + Math.random() * 60}%`,
                }}
              />
            ))}
          </div>

          {/* X-axis labels */}
          <div className="flex items-center gap-3 px-4">
            {Array.from({ length: 11 }).map((_, i) => (
              <Skeleton key={i} className="flex-1 h-3 rounded-sm" />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const RadialChartSkeleton = ({
  className,
  height = 330,
}: ChartSkeletonProps) => {
  return (
    <Card className={cn("p-4 rounded-sm shadow-none", className)}>
      <CardHeader className="p-0">
        <Skeleton className="h-5 w-36 rounded-sm" />
      </CardHeader>
      <CardContent>
        <div
          className="flex flex-col items-center justify-center gap-4"
          style={{ height }}
        >
          {/* Radial rings placeholder */}
          <div className="relative flex items-center justify-center">
            <Skeleton className="size-48 rounded-full" />
            <Skeleton className="size-32 rounded-full absolute" />
            <Skeleton className="size-20 rounded-full absolute" />
          </div>

          {/* Legend */}
          <div className="flex flex-wrap justify-center gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-1">
                <Skeleton className="size-3 rounded-full" />
                <Skeleton className="h-3 w-14 rounded-sm" />
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
