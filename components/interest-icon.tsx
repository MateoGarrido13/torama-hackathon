import type { ReactNode } from "react";

export type InterestGlyph =
  | "robot"
  | "brain"
  | "browser"
  | "computer"
  | "phone"
  | "sheet"
  | "shield"
  | "cloud"
  | "joystick"
  | "opensource";

export function InterestIcon({ glyph }: { glyph: InterestGlyph }) {
  if (glyph === "opensource") {
    return (
      <svg className="interest__logo interest__logo--source" viewBox="0 0 36 36" aria-hidden="true">
        <circle cx="18" cy="18" r="16.2" fill="#3dae2b" />
        <circle cx="18" cy="12.4" r="3.3" className="interest__cut" />
        <path className="interest__cut" d="M14.7 14.4h6.6l2.5 12.2H12.2z" />
      </svg>
    );
  }

  const shapes: Record<Exclude<InterestGlyph, "opensource">, ReactNode> = {
    robot: (
      <>
        <rect x="10.2" y="1" width="3.6" height="2.4" rx="1" fill="currentColor" />
        <rect x="11.4" y="3" width="1.2" height="2" fill="currentColor" />
        <rect x="3.5" y="5" width="17" height="12" rx="3" fill="currentColor" />
        <rect x="1" y="8.2" width="2.6" height="4.4" rx="1.2" fill="currentColor" />
        <rect x="20.4" y="8.2" width="2.6" height="4.4" rx="1.2" fill="currentColor" />
        <circle cx="8.6" cy="10.4" r="1.7" className="interest__cut" />
        <circle cx="15.4" cy="10.4" r="1.7" className="interest__cut" />
        <rect x="8" y="13.2" width="8" height="1.6" rx="0.8" className="interest__cut" />
      </>
    ),
    brain: (
      <>
        <path
          fill="currentColor"
          d="M8.2 19.4c-2.4-.2-4.2-2-4.2-4.3 0-1.6.8-2.9 2-3.6-.1-1-.1-2.2.7-3.1C7.6 7.4 8.8 6.8 10.2 7c.4-1.6 1.8-2.8 3.6-2.8 1.6 0 2.9 1 3.4 2.4 1.6.3 2.8 1.6 2.8 3.3 0 .8-.3 1.6-.8 2.2.9.6 1.5 1.6 1.5 2.7 0 2.2-1.9 3.9-4.3 4.2-1 .7-2.2 1.2-3.5 1.1-1.3-.1-2.6-.5-3.7-.7z"
        />
        <path className="interest__line" d="M12 5.2v13.2M8.4 9.6c1.4.8 2.6 2 3.2 3.4M15.8 9.2c-1.2.8-2.2 2-2.6 3.4" />
      </>
    ),
    browser: (
      <>
        <path fill="currentColor" d="M3 9.2V6.4A1.4 1.4 0 0 1 4.4 5h6.2L12.2 8.2H3z" />
        <rect x="3" y="8" width="18" height="12.2" rx="1.6" fill="currentColor" />
        <rect x="5" y="10.2" width="14" height="2.1" rx="1" className="interest__cut" />
        <rect x="5" y="14" width="8" height="1.5" rx="0.7" className="interest__cut" />
      </>
    ),
    computer: (
      <>
        <rect x="2" y="3" width="20" height="13" rx="1.6" fill="currentColor" />
        <rect x="4" y="5" width="16" height="9" className="interest__cut" />
        <rect x="10" y="16" width="4" height="2.2" fill="currentColor" />
        <rect x="6" y="18.2" width="12" height="1.8" rx="0.6" fill="currentColor" />
      </>
    ),
    phone: (
      <>
        <rect x="7" y="1.4" width="10" height="21.2" rx="2.2" fill="currentColor" />
        <rect x="8.5" y="4" width="7" height="13.4" rx="0.5" className="interest__cut" />
        <circle cx="12" cy="19.6" r="1.1" className="interest__cut" />
      </>
    ),
    sheet: (
      <>
        <rect x="4" y="2" width="16" height="20" rx="1.5" fill="currentColor" />
        <path className="interest__line" d="M4 7h16M4 11.5h16M4 16h16M9.5 7v15M14.5 7v15" />
      </>
    ),
    shield: (
      <>
        <path fill="currentColor" d="M12 2 20 5.4v6.5c0 4.6-3.2 7.7-8 9.7-4.8-2-8-5.1-8-9.7V5.4L12 2z" />
        <path className="interest__line" d="M8.5 12.2 11 14.6 15.6 9.6" />
      </>
    ),
    cloud: (
      <path
        fill="currentColor"
        d="M7.4 18.6h9a3.8 3.8 0 0 0 .3-7.6 5.1 5.1 0 0 0-9.7-1.3 3.5 3.5 0 0 0 .4 8.9z"
      />
    ),
    joystick: (
      <>
        <rect x="3.2" y="15.4" width="17.6" height="5.4" rx="2" fill="currentColor" />
        <circle cx="7" cy="18.1" r="0.9" className="interest__cut" />
        <circle cx="17" cy="18.1" r="0.9" className="interest__cut" />
        <rect x="10.5" y="8.6" width="3" height="7.2" rx="1.2" fill="currentColor" />
        <circle cx="12" cy="6.4" r="3.6" fill="currentColor" />
        <circle cx="12" cy="6.4" r="1.25" className="interest__cut" />
      </>
    ),
  };

  return (
    <svg className="interest__logo" viewBox="0 0 24 24" aria-hidden="true">
      {shapes[glyph]}
    </svg>
  );
}
