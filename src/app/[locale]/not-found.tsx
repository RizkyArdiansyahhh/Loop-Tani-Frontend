import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-background px-6 py-12">
      <div className="max-w-4xl w-full flex flex-col md:flex-row items-center justify-center gap-10 md:gap-16">
        {/* Mascot Image Column */}
        <div className="w-full max-w-sm md:max-w-md flex items-center justify-center">
          <div className="relative w-full aspect-square max-w-[380px]">
            <Image
              src="/images/maskot-404.png"
              alt="404 Mascot"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>

        {/* Text & Action Column */}
        <div className="w-full max-w-md flex flex-col items-start text-left">
          {/* Subhead with underline */}
          <div className="mb-6">
            <span className="text-sm font-medium text-muted-foreground block mb-2">
              Error 404
            </span>
            <div className="w-10 h-[2px] bg-foreground/30 dark:bg-foreground/50" />
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground leading-[1.15] mb-4">
            there is light <br className="hidden sm:inline" />
            in here too.
          </h1>

          {/* Subtext */}
          <p className="text-muted-foreground text-base sm:text-lg mb-8 leading-relaxed">
            But the page is missing or you assembled the link incorrectly.
          </p>

          {/* CTA Link */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-medium text-foreground hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors group text-base"
          >
            <span>Go home</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </main>
  );
}
