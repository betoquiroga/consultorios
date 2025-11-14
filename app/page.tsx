import { Header } from "./components/landing/Header";
import { HeroBanner } from "./components/landing/HeroBanner";
import { FomoSection } from "./components/landing/FomoSection";
import { Footer } from "./components/landing/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-950">
      <Header />
      <HeroBanner />
      <FomoSection />
      <Footer />
    </div>
  );
}
