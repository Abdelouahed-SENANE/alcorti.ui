"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  TableBody,
  TableCell,
  TableElement,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface TableSkeletonProps {
  columns?: number;
  rows?: number;
  showHeader?: boolean;
  showPagination?: boolean;
  titleSkeleton?: boolean;
}

export const TableSkeleton = ({
  columns = 5,
  rows = 5,
  showHeader = true,
  showPagination = true,
  titleSkeleton = true,
}: TableSkeletonProps) => {
  return (
    <div className="">
      <Card className="p-2">
        {titleSkeleton && (
          <CardHeader className="flex items-center justify-between p-0">
            <div className="space-y-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-72" />
            </div>
          </CardHeader>
        )}

        <CardContent className="p-0 space-y-2">
          <TableElement>
            {showHeader && (
              <TableHeader>
                <TableRow>
                  {Array.from({ length: columns }).map((_, i) => (
                    <TableHead key={i}>
                      <Skeleton className="h-3 w-32 bg-card/90" />
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
            )}

            <TableBody>
              {Array.from({ length: rows }).map((_, r) => (
                <TableRow key={r}>
                  {Array.from({ length: columns }).map((_, c) => (
                    <TableCell key={c}>
                      <Skeleton className="h-3 w-28 bg-background" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </TableElement>
        </CardContent>
      </Card>

      {showPagination && (
        <div className="flex justify-end">
          <Skeleton className="h-5 w-64" />
        </div>
      )}
    </div>
  );
};
