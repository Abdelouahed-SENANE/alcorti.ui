"use client";
import { paths } from "@/config/paths";
import { useUser } from "@/lib/auth";
import Link from "next/link";

export default function Home() {
  const { data: user } = useUser();
  console.log(user);
  return <>
  <Link href="/auth/login">Login</Link>
  <Link href={paths.admin.dashboard.route()}  >Dashboard</Link>
  </>;
}
