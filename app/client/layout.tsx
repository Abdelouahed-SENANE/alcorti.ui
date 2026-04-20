"use client";
import { ContentLayout } from "@/components/layouts/content/_content.layout";
import { AuthGuard } from "@/lib/auth";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard role="client" requireCompleted>
      <ContentLayout>{children}</ContentLayout>
    </AuthGuard>
  );
}
