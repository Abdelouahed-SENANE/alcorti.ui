"use client";

import { Button } from "@/components/ui/button";
import { RouterLink } from "@/components/ui/link";
import { paths } from "@/config/paths";
import { FileQuestion } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 text-center">
      <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 text-primary">
        <FileQuestion size={48} />
      </div>

      <h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
        404
      </h1>
      <h2 className="mb-6 text-2xl font-semibold text-foreground/80">
        Page Not Found
      </h2>
      <p className="mb-10 max-w-md text-muted-foreground">
        The page you are looking for doesn't exist or has been moved. Please
        check the URL or head back home.
      </p>

      <div className="flex flex-col gap-4 sm:flex-row">
        <Button asChild variant="default" size="lg">
          <RouterLink to={paths.home.root}>Go Back Home</RouterLink>
        </Button>
        <Button
          asChild
          variant="outline"
          size="lg"
          onClick={() => window.history.back()}
        >
          <span>Go Back</span>
        </Button>
      </div>
    </div>
  );
}
