import type { ReactNode } from "react";

type SectionBlockProps = {
  id: string;
  title: string;
  kicker?: string;
  children?: ReactNode;
};

export function SectionBlock({ id, title, kicker, children }: SectionBlockProps) {
  return (
    <section
      id={id}
      className="scroll-mt-20 border-t border-line px-5 py-16 md:px-8 md:py-24"
    >
      <div className="mx-auto max-w-6xl">
        {kicker ? (
          <p className="mb-3 text-xs font-medium tracking-[0.2em] text-muted uppercase">
            {kicker}
          </p>
        ) : null}
        <h2 className="font-display text-3xl tracking-tight text-balance text-ink sm:text-5xl">
          {title}
        </h2>
        {children ? <div className="mt-10">{children}</div> : null}
      </div>
    </section>
  );
}
