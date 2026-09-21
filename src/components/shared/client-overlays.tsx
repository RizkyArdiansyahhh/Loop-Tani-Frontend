"use client";

import dynamic from "next/dynamic";

const LoopiFloating = dynamic(
  () => import("@/features/chatbot/components/loopi-floating"),
  { ssr: false }
);

const AccessibilityWidget = dynamic(
  () => import("@/components/shared/accessibility-widget"),
  { ssr: false }
);

const FloatingIntroVideo = dynamic(
  () =>
    import("@/features/home/components/floating-intro-video").then(
      (m) => m.FloatingIntroVideo
    ),
  { ssr: false }
);

const Toaster = dynamic(
  () => import("@/components/ui/sonner").then((m) => m.Toaster),
  { ssr: false }
);

export function ClientOverlays() {
  return (
    <>
      <Toaster />
      <LoopiFloating />
      <AccessibilityWidget />
      <FloatingIntroVideo />
    </>
  );
}
