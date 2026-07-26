"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function CheckoutSkeleton() {
  return (
    <div className="space-y-6 animate-pulse max-w-6xl mx-auto px-4 sm:px-6 py-6 font-sans">
      {/* Title Skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-6 w-48 rounded-md" />
        <Skeleton className="h-4 w-32 rounded-md" />
      </div>

      {/* Grid Layout Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column Skeleton */}
        <div className="lg:col-span-2 space-y-5">
          {/* Address Card Skeleton */}
          <div className="border border-gray-200 dark:border-gray-800 rounded-xl p-5 space-y-3 bg-card">
            <div className="flex justify-between items-center">
              <Skeleton className="h-5 w-36" />
              <Skeleton className="h-7 w-20 rounded-md" />
            </div>
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-4 w-3/4" />
          </div>

          {/* Store Card Skeleton 1 */}
          <div className="border border-gray-200 dark:border-gray-800 rounded-xl p-5 space-y-4 bg-card">
            <div className="flex items-center gap-2 border-b border-border/40 pb-3">
              <Skeleton className="h-4 w-4 rounded-full" />
              <Skeleton className="h-5 w-40" />
            </div>
            <div className="flex gap-4">
              <Skeleton className="h-16 w-16 rounded-lg shrink-0" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/4" />
                <Skeleton className="h-4 w-1/3" />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column Skeleton */}
        <div className="lg:col-span-1">
          <div className="border border-gray-200 dark:border-gray-800 rounded-xl p-5 space-y-4 bg-card">
            <Skeleton className="h-5 w-36 border-b border-border/40 pb-3" />
            <div className="space-y-3">
              <div className="flex justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-20" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-20" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-20" />
              </div>
            </div>
            <Skeleton className="h-11 w-full rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}
