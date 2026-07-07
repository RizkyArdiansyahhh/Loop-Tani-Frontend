import Footer from "@/components/shared/footer";
import Navbar from "@/components/shared/navbar";
import LoopiFloating from "@/features/chatbot/components/loopi-floating";
import AccessibilityWidget from "@/components/shared/accessibility-widget";

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <header>
        <Navbar></Navbar>
      </header>
      <div>{children}</div>
      <Footer></Footer>
      <LoopiFloating />
      <AccessibilityWidget />
    </>
  );
}
