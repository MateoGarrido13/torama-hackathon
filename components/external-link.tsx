import type { ReactNode } from "react";

type ExternalLinkProps = {
  href: string;
  children: ReactNode;
  className?: string;
  tabIndex?: number;
};

export function ExternalLink({ href, children, className, tabIndex }: ExternalLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      tabIndex={tabIndex}
    >
      {children}
    </a>
  );
}
