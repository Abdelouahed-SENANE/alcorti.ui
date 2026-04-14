import { Authorization, ProtectedRoute } from "@/lib/auth";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <Authorization role="admin">{children}</Authorization>
    </ProtectedRoute>
  );
}
