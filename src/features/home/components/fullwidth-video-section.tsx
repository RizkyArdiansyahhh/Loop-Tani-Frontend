"use client";

interface FullWidthVideoSectionProps {
  text?: string;
}

export function FullWidthVideoSection({
  text = "LOOP TANI",
}: FullWidthVideoSectionProps) {
  return (
    <section className="relative w-full h-[55vh] sm:h-[70vh] min-h-96 overflow-hidden bg-slate-950 select-none">
      {/* Background Video */}
      <video
        src="https://res.cloudinary.com/dy9gtwsh7/video/upload/v1785581010/13167577_3840_2160_30fps_vmlft1.mp4"
        autoPlay
        muted
        loop
        playsInline
        className="h-full w-full object-cover pointer-events-none"
      />

      {/* Dark Overlay Effect Directly on the Video */}
      <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/30 to-black/10 pointer-events-none" />

      {/* Large Clean Semi-Transparent Text Overlay - Positioned Close to Bottom */}
      <div className="absolute bottom-1 sm:bottom-2 md:bottom-3 left-0 right-0 text-center pointer-events-none z-10 px-4 overflow-hidden">
        <h2 className="font-sans font-black uppercase tracking-tighter text-5xl sm:text-7xl md:text-8xl lg:text-[11.5rem] leading-none text-white/45 sm:text-white/40 select-none">
          {text}
        </h2>
      </div>
    </section>
  );
}
