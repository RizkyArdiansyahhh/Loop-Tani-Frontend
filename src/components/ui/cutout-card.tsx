import Image from "next/image";
import { cn } from "@/lib/utils";
import { ArrowLeft, ArrowRight } from "lucide-react";

const CORNER_PATH = "M0 200C155.996 199.961 200.029 156.308 200 0V200H0Z";

export function CutoutCorner({
  className,
  size = 32,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="currentColor"
    >
      <path d={CORNER_PATH} />
    </svg>
  );
}

interface CutoutCardProps {
  image: string;
  label?: string;
  className?: string;
  children?: React.ReactNode;
}

export default function CutoutCard({
  image,
  label,
  className,
  children,
}: CutoutCardProps) {
  return (
    <div
      className={cn(
        "rounded-[28px] bg-white overflow-hidden",
        className
      )}
    >
      <div className="relative h-full">
        <Image
          src={image}
          alt="Preview"
          fill
          className="object-cover"
        />

        <div className="absolute inset-0 bg-linear-to-t from-black/30 to-transparent" />

        {label && (
          <div className="absolute bottom-0 right-0 flex items-center gap-2 rounded-tl-[20px] bg-white px-4 py-3">
            <button
              className="flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-gray-100"
            >
              <ArrowLeft size={18} className="text-gray-700" />
            </button>

            <button
              className="flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-gray-100"
            >
              <ArrowRight size={18} className="text-gray-700" />
            </button>

            <CutoutCorner
              className="absolute -left-[32px] bottom-[-1px] text-white"
            />

            <CutoutCorner
              className="absolute top-[-32px] -right-[1px] text-white"
            />
          </div>
        )}
      </div>

      {children && <div className="p-6">{children}</div>}
    </div>
  );
}