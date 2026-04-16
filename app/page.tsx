"use client";
import { Button } from "@/components/ui/button";
import { paths } from "@/config/paths";
import { useLogout } from "@/lib/auth";
import Link from "next/link";

export default function Home() {
  const logout = useLogout();
  return <>
  <Button className="w-fit my-2">
    <Link href={paths.admin.dashboard.route()}  >Dashboard</Link>
  </Button>
  <Button className="w-fit my-2" onClick={() => logout.mutate(undefined)}>
    Logout
  </Button>
  </>;
}
