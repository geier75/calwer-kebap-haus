import HeroSection from "@/components/HeroSection";
import MenuSection from "@/components/MenuSection";
import GamificationPanel from "@/components/GamificationPanel";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <HeroSection />
      <MenuSection />
      <GamificationPanel />
      <Footer />
    </div>
  );
}
