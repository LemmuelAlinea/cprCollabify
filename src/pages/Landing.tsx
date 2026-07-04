import { Navbar } from "../components/Navbar";
import { Hero } from "../components/Hero";
import { Features } from "../components/Features";
import { HowItWorks } from "../components/HowItWorks";
import { ForRoles } from "../components/ForRoles";
import { CTA } from "../components/CTA";
import { Footer } from "../components/Footer";
import { useSmoothScroll } from "../hooks/useSmoothScroll";

// Public marketing landing page.
export default function Landing() {
  useSmoothScroll();

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <ForRoles />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
