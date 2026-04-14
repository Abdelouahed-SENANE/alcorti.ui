"use client";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

interface ErrorLayoutProps {
  title?: string;
  message?: string;
  retryLabel?: string;
  onRetry?: () => void;
  showRetry?: boolean;
  isLoading?: boolean;
}

export function ErrorLayout({
  title = "Something went wrong",
  message = "An unexpected error occurred.",
  retryLabel = "Try Again",
  onRetry,
  showRetry = true,
  isLoading = false,
}: ErrorLayoutProps) {
  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Spinner size="sm" />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col items-center justify-center gap-5 px-6 text-center">
      <h1 className="text-2xl font-bold text-red-600">{title}</h1>

      <p className="text-sm text-red-400 whitespace-pre-wrap max-w-md">
        {message}
      </p>

      {showRetry && onRetry && (
        <Button onClick={onRetry} className="px-4 py-2">
          {retryLabel}
        </Button>
      )}
    </div>
  );
}
