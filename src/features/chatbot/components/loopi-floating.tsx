"use client";

import Image from "next/image";
import { Link } from "@/i18n/navigation";

const LoopiFloating = () => {
  return (
    <Link
      href="/loopi"
      className="group fixed bottom-6 right-6 z-50 flex items-center overflow-hidden rounded-full bg-white shadow-lg ring-1 ring-border transition-all duration-500 ease-out hover:pr-5 hover:shadow-xl"
      aria-label="Chat dengan Loopi"
    >
      <div className="flex h-14 w-14 shrink-0 items-center justify-center">
        <Image
          src="/images/loopi-icon.svg"
          alt="Loopi"
          width={40}
          height={40}
          className="transition-transform duration-300 group-hover:scale-110"
        />
      </div>
      <span className="max-w-0 whitespace-nowrap text-sm font-semibold text-foreground opacity-0 transition-all duration-500 ease-out group-hover:max-w-40 group-hover:opacity-100">
        Ayo tanya Loopi
      </span>
    </Link>
  );
};

export default LoopiFloating;
