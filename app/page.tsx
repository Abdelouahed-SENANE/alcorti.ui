"use client";
import { Button } from "@/components/ui/button";
import { paths } from "@/config/paths";
import Link from "next/link";

export default function Home() {
  return <>
  <Button className="w-fit my-2">
    <Link href={paths.admin.dashboard.route()}  >Dashboard</Link>
  </Button>
  </>;
}
