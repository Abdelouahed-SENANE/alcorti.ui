"use client";
import { AuthGuard } from "@/lib/auth";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard role="client" requireCompleted>
      {children}
    </AuthGuard>
  );
}
