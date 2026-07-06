"use client";

import Link from "next/link";

type MegaMenuItemProps = {
  href: string;
  label: string;
};

export function MegaMenuItem({ href, label }: MegaMenuItemProps) {
  return (
    <li>
      <Link
        href={href}
        className="animation-link-background block w-fit py-1 text-sm font-medium transition-colors hover:text-primary"
      >
        {label}
      </Link>
    </li>
  );
}
