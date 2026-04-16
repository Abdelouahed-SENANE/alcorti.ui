import { EnsureRole, ProtectedRoute } from "@/lib/auth";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <EnsureRole role="admin">{children}</EnsureRole>
    </ProtectedRoute>
  );
}
