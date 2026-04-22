"use client";

import { cn } from "@/lib/utils";
import { alertStyles } from "./constants";
import {
  Toast,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "./toast";
import { useToast } from "./use-toast";

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider duration={3000}>
      {toasts.map(
        ({
          id,
          title,
          description,
          action,
          type,
          open,
          onOpenChange,
          duration,
          ...props
        }) => (
          <Toast
            key={id}
            variant={"default"}
            open={open}
            onOpenChange={onOpenChange}
            duration={duration}
            {...props}
            className={cn(
              "relative max-w-sm p-2 border rounded-md text-card-foreground",
              "top-10 inset-inline-end-5",
              "transition-transform duration-300 ease-out",
              "opacity-0",
              "data-[state=open]:translate-y-0",
              "data-[state=open]:opacity-100",
              "data-[state=closed]:translate-y-full",
              "data-[state=closed]:opacity-0",
              alertStyles[type].bg,
              alertStyles[type].border,
              "",
            )}
          >
            <div className="flex w-full gap-1 relative ">
              <div className="px-1">{alertStyles[type].icon}</div>
              <div className="flex items-start justify-between flex-1">
                <div className="flex-1 flex flex-col gap-0 items-start justify-between  ">
                  {title && (
                    <ToastTitle
                      className={cn(
                        alertStyles[type].text,
                        "text-sm font-bold",
                      )}
                    >
                      {title}
                    </ToastTitle>
                  )}
                  {description && (
                    <ToastDescription>
                      <p className={cn("text-sm", alertStyles[type].text)}>
                        {description}
                      </p>
                    </ToastDescription>
                  )}
                  {action}
                </div>
              </div>
            </div>
          </Toast>
        ),
      )}
      <ToastViewport
        className={cn(
          "fixed top-0 inset-0 z-100 flex flex-col gap-1 p-4 items-end",
        )}
      />
    </ToastProvider>
  );
}
