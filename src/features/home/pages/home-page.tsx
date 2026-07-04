import Navbar from "@/components/shared/navbar";
import { InfoBar } from "@/components/shared/info-bar";
import { CarouselHomePage } from "../components/carousel";

const HomePage = () => {
  return (
    <>
      <header>
        <InfoBar />
        <Navbar />
      </header>
      <main className="w-screen bg-white dark:bg-black">
        <div className="w-full" style={{ height: "calc(100vh - 104px)" }}>
          <CarouselHomePage />
        </div>
        <div className="h-[150rem]" />
      </main>
    </>
  );
};

export default HomePage;
