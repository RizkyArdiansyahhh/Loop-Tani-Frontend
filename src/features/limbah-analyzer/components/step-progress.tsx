"use client";

import Image from "next/image";

const StepProgress = () => {
  return (
    <div className="flex h-full w-60 shrink-0 flex-col items-center justify-center bg-white px-4">
      {/* Mascot */}
      <div className="flex flex-col items-center gap-4">
        <Image
          src="/images/maskot.svg"
          alt="Loopi"
          width={180}
          height={180}
          priority
        />
        <div className="relative rounded-xl bg-secondary/20 px-3 py-2.5 text-center">
          <div className="absolute -top-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 bg-secondary/20" />
          <p className="relative text-xs font-semibold text-foreground">
            Halo, saya Loopi! 👋
          </p>
          <p className="relative mt-0.5 text-[10px] leading-snug text-muted-foreground">
            Siap membantu analisa limbah Anda.
          </p>
        </div>
      </div>
    </div>
  );
};

export default StepProgress;
