import Footer from "@/components/shared/footer";
import Navbar from "@/components/shared/navbar";
import LoopiFloating from "@/features/chatbot/components/loopi-floating";

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
      <div className="px-7 pt-4">{children}</div>
      <Footer></Footer>
      <LoopiFloating />
    </>
  );
}
