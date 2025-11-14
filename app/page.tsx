import { Header } from "./components/landing/Header";
import { HeroBanner } from "./components/landing/HeroBanner";
import { FomoSection } from "./components/landing/FomoSection";
import { Footer } from "./components/landing/Footer";
import { AuthenticatedHome } from "./components/home/AuthenticatedHome";
import { getServerSession } from "./utils/auth.utils";

export default async function Home() {
  const session = await getServerSession();

  if (session) {
    return <AuthenticatedHome />;
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <Header />
      <HeroBanner />
      <FomoSection />
      <Footer />
    </div>
  );
}
