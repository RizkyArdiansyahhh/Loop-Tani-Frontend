"use client";

import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export default function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={cn(
        "flex flex-wrap items-center gap-1.5 text-xs font-medium text-gray-400 dark:text-gray-500",
        className
      )}
    >
      {/* Root Home Link */}
      <Link
        href="/"
        className="flex items-center gap-1 transition-colors hover:text-primary dark:hover:text-primary"
      >
        <Home className="h-3.5 w-3.5" />
        <span className="sr-only">Home</span>
      </Link>

      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <div key={index} className="flex items-center gap-1.5">
            <ChevronRight className="h-3 w-3 shrink-0" />
            {isLast || !item.href ? (
              <span
                className={cn(
                  "truncate max-w-[180px] sm:max-w-[280px]",
                  isLast ? "text-gray-700 font-semibold dark:text-gray-200" : "text-gray-400 dark:text-gray-500"
                )}
                aria-current={isLast ? "page" : undefined}
              >
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href}
                className="transition-colors hover:text-primary dark:hover:text-primary"
              >
                {item.label}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}
