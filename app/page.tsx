import { AgendaSection } from "@/components/agenda-section";
import { RedConexiones } from "@/components/connection-network";
import { Hero } from "@/components/hero";
import { LiveSection } from "@/components/live-section";
import { MesaSection } from "@/components/mesa-section";
import { PartnersSection } from "@/components/partners-section";
import { RegistrationSection } from "@/components/registration-section";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { SpeakersSection } from "@/components/speakers-section";

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main id="contenido">
        <Hero />
        <AgendaSection />
        <SpeakersSection />
        <LiveSection />
        <PartnersSection />
        <RegistrationSection />
        <RedConexiones />
        <MesaSection />
      </main>
      <SiteFooter />
    </>
  );
}
