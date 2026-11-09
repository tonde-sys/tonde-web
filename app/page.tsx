import { Navigation } from "@/components/landing/navigation";
import { HeroSection } from "@/components/landing/hero-section";
import { ProofMarquee } from "@/components/landing/proof-marquee";
import { ManifestoSection } from "@/components/landing/manifesto-section";
import { ProofScene } from "@/components/landing/proof-scene";
import { EcosystemSection } from "@/components/landing/ecosystem-section";
import { VoicesSection } from "@/components/landing/voices-section";
import { PricingSection } from "@/components/landing/pricing-section";
import { FaqSection } from "@/components/landing/faq-section";
import { CtaSection } from "@/components/landing/cta-section";
import { FooterSection } from "@/components/landing/footer-section";
import { ScrollProgress } from "@/components/landing/scroll-progress";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-brand-canvas">
      <ScrollProgress />
      <Navigation />
      <HeroSection />
      <ProofMarquee />
      <ManifestoSection />
      <ProofScene />
      <EcosystemSection />
      <VoicesSection />
      <PricingSection />
      <FaqSection />
      <CtaSection />
      <FooterSection />
    </main>
  );
}
