"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import React from "react";

interface MainNavProps extends React.HTMLAttributes<HTMLElement> {
  className?: string;
}

const MainNav = ({ className, ...props }: MainNavProps) => {
  const pathName = usePathname();
  const params = useParams();

  const routes = [
    {
      href: `/${params.storeId}/`,
      label: "Overview",
      active: pathName === `/${params.storeId}`,
    },
    {
      href: `/${params.storeId}/billboard`,
      label: "Billboard",
      active: pathName === `/${params.storeId}/billboard`,
    },
    {
      href: `/${params.storeId}/settings`,
      label: "Settings",
      active: pathName === `/${params.storeId}/settings`,
    },
  ];
  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
      {...props}
    >
      {routes.map((route) => (
        <Link
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            route.active
              ? "text-black dark:text-white"
              : "text-muted-foreground"
          )}
          key={route.href}
          href={route.href}
        >
          {route.label}
        </Link>
      ))}
    </nav>
  );
};

export default MainNav;
