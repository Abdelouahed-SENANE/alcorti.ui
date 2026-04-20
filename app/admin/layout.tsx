import { AuthGuard } from "@/lib/auth";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthGuard role="admin">{children}</AuthGuard>;
}
