"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton/skeleton";
import { DocumentViewerSkeleton } from "@/components/viewers/document/document-viewer.skeleton";
import { cn } from "@/lib/utils";

export const ProfileCardSkeleton = () => {
  return (
    <Card className="border border-border gap-0 p-0">
      <CardContent className="pt-2 space-y-4 p-4">
        <div className="grid grid-cols-1 gap-2 text-sm">
          {/* Avatar and Name */}
          <div className="flex items-center gap-2">
            <Skeleton className="size-16 rounded-full" />
            <div className="flex flex-col gap-1">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-32" />
            </div>
          </div>

          {/* Info Lines */}
          <div className="flex items-center justify-between gap-1">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-4 w-24" />
          </div>
          <div className="flex items-center justify-between gap-1">
            <Skeleton className="h-4 w-8" />
            <Skeleton className="h-4 w-20" />
          </div>
          <div className="flex items-center justify-between gap-1">
            <Skeleton className="h-4 w-10" />
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>
          <div className="flex items-center justify-between gap-1">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const UserReviewSkeleton = ({ className }: { className?: string }) => {
  return (
    <div className={cn("flex flex-col lg:flex-row gap-4", className)}>
      <div className="flex flex-col gap-en w-full lg:w-[500px]">
        <ProfileCardSkeleton />
        <div className="flex flex-col gap-4 w-full">
          <div className="flex flex-col gap-3 pt-2 border-t mt-2 bg-card p-2">
            {/* Rejection reason skeleton */}
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-24 w-full" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-9 w-24" />
              <Skeleton className="h-9 w-24" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 self-stretch flex flex-col gap-4">
        <DocumentViewerSkeleton />
      </div>
    </div>
  );
};
