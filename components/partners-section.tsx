import Image from "next/image";
import { sponsors } from "@/content/sponsors";
import type { Sponsor } from "@/content/types";
import { ExternalLink } from "@/components/external-link";

const MIN_ITEM_PX = 140;
const ULTRAWIDE_PX = 3840;

function sequenceRepeats(count: number) {
  return Math.max(1, Math.ceil(ULTRAWIDE_PX / (count * MIN_ITEM_PX)));
}

function SponsorLogo({ sponsor, hidden = false }: { sponsor: Sponsor; hidden?: boolean }) {
  return (
    <ExternalLink href={sponsor.url} tabIndex={hidden ? -1 : undefined} className="sponsor-logo">
      <Image
        src={sponsor.logo}
        alt={sponsor.nombre}
        width={sponsor.width}
        height={sponsor.height}
        style={{ width: "auto", height: "100%" }}
      />
    </ExternalLink>
  );
}

export function PartnersSection() {
  const heading = (
    <div className="sponsors__top">
      <p className="eyebrow">04 · Hacen posible</p>
      <p>Organizaciones que creen en el talento local.</p>
    </div>
  );

  if (sponsors.length === 0) {
    return (
      <section className="sponsors" id="acompanan">
        {heading}
      </section>
    );
  }

  if (sponsors.length === 1) {
    return (
      <section className="sponsors" id="acompanan">
        {heading}
        <div className="sponsor-static" style={{ display: "flex" }}>
          <SponsorLogo sponsor={sponsors[0]} />
        </div>
      </section>
    );
  }

  const repeats = sequenceRepeats(sponsors.length);
  const copies = Array.from({ length: repeats * 2 }, (_, index) => index);

  return (
    <section className="sponsors" id="acompanan">
      {heading}
      <div className="marquee">
        <div className="marquee-track" style={{ animationDuration: `${28 * repeats}s` }}>
          {copies.map((copy) => (
            <ul key={copy} aria-hidden={copy === 0 ? undefined : true} className="sponsor-row">
              {sponsors.map((sponsor) => (
                <li key={`${sponsor.id}-${copy}`} className="sponsor-slot">
                  <SponsorLogo sponsor={sponsor} hidden={copy !== 0} />
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
      <ul className="sponsor-static">
        {sponsors.map((sponsor) => (
          <li key={sponsor.id}>
            <SponsorLogo sponsor={sponsor} />
          </li>
        ))}
      </ul>
    </section>
  );
}
