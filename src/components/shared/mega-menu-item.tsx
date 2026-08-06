"use client";

import Link from "next/link";
import { NavigationMenuLink } from "@/components/ui/navigation-menu";

type MegaMenuItemProps = {
  href: string;
  label: string;
};

export function MegaMenuItem({ href, label }: MegaMenuItemProps) {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          href={href}
          className="animation-link-background block w-fit py-1 text-sm font-medium transition-colors text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary"
        >
          {label}
        </Link>
      </NavigationMenuLink>
    </li>
  );
}
