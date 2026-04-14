"use client";
import { cn } from "@/lib/utils";
import * as React from "react";

const Timeline = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "relative flex flex-col gap-6 pl-6 rtl:pr-6 rtl:pl-0",
      className,
    )}
    {...props}
  />
));
Timeline.displayName = "Timeline";

const TimelineLine = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "absolute left-[12px] top-3 h-full w-[2px] bg-input/50 rtl:left-auto rtl:right-[12px]",
      className,
    )}
    {...props}
  />
));
TimelineLine.displayName = "TimelineLine";

const TimelineItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("relative flex flex-col gap-1.5", className)}
    {...props}
  />
));
TimelineItem.displayName = "TimelineItem";

const TimelineDot = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "absolute -left-[24px] top-0 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-transparent rtl:-right-[24px] rtl:left-auto",
      className,
    )}
    {...props}
  >
    {children || <div className="h-1.5 w-1.5 rounded-full bg-primary" />}
  </div>
));
TimelineDot.displayName = "TimelineDot";

const TimelineTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h4
    ref={ref}
    className={cn(
      "text-sm font-semibold text-card-foreground leading-none",
      className,
    )}
    {...props}
  />
));
TimelineTitle.displayName = "TimelineTitle";

const TimelineDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-card-foreground", className)}
    {...props}
  />
));
TimelineDescription.displayName = "TimelineDescription";

const TimelineContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm text-card-foreground", className)}
    {...props}
  />
));
TimelineContent.displayName = "TimelineContent";

export {
  Timeline,
  TimelineContent,
  TimelineDescription,
  TimelineDot,
  TimelineItem,
  TimelineLine,
  TimelineTitle,
};
