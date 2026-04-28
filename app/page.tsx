"use client";
import { Button } from "@/components/ui/button";
import { paths } from "@/config/paths";
import { AuthGuard, useLogout, useUser } from "@/lib/auth";
import Link from "next/link";

export default function Home() {
  const logout = useLogout();
  const { data: user } = useUser();
  console.log(user);
  return (
    <AuthGuard>
      <div className="p-8 space-y-8">
        <div className="flex gap-4">
          <Button className="w-fit" asChild>
            <Link href={paths.admin.dashboard.route()}>Dashboard</Link>
          </Button>
          <Button className="w-fit" onClick={() => logout.mutate(undefined)}>
            Logout
          </Button>
          <Button className="w-fit" asChild>
            <Link href={paths.client.shipments.orders.route()}>Client</Link>
          </Button>
          <Button className="w-fit" asChild>
            <Link href={paths.shipper.shipments.orders.booking.route()}>
              Shipper
            </Link>
          </Button>
        </div>
      </div>
    </AuthGuard>
  );
}
