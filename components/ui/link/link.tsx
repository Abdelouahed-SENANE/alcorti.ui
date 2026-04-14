import Link, { LinkProps as NextLinkProps } from "next/link";
import React from "react";

import { cn } from "@/lib/utils";

interface RouterLinkProps extends Omit<NextLinkProps, "href"> {
  to: string | { pathname: string; search?: string; hash?: string };
  className?: string;
  children?: React.ReactNode;
}

export const RouterLink = ({
  className,
  children,
  to,
  ...props
}: RouterLinkProps) => {
  const href =
    typeof to === "string"
      ? to
      : `${to.pathname}${to.search || ""}${to.hash || ""}`;
  return (
    <Link
      href={href}
      className={cn(className, "hover:underline-none cursor-pointer")}
      {...props}
    >
      {children}
    </Link>
  );
};
