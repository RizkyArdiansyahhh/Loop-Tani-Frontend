"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export function OrderSkeleton() {
  return (
    <div className="space-y-4 font-sans">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="border border-border/60 rounded-2xl overflow-hidden shadow-xs">
          <CardContent className="p-4 sm:p-5 space-y-4">
            <div className="flex justify-between items-center">
              <Skeleton className="h-4 w-40 rounded-md" />
              <Skeleton className="h-5 w-24 rounded-md" />
            </div>

            <div className="flex gap-4 items-center">
              <Skeleton className="h-16 w-16 rounded-xl shrink-0" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-3/4 rounded-md" />
                <Skeleton className="h-3 w-1/3 rounded-md" />
              </div>
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-border/40">
              <Skeleton className="h-4 w-28 rounded-md" />
              <Skeleton className="h-9 w-28 rounded-xl" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
