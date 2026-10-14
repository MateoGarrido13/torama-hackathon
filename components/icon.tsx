import type { ReactNode } from "react";

export type IconName = "arrow" | "check" | "chevron" | "linkedin" | "menu" | "mute" | "play" | "sound";

export function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, ReactNode> = {
    arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
    check: <path d="m5 12 4 4L19 8" />,
    chevron: <path d="m7 10 5 5 5-5" />,
    linkedin: (
      <>
        <path d="M8 11v5M8 8v.01M12 16v-5m0 2.2c.8-2.2 4-2.4 4 1V16" />
        <rect x="3" y="3" width="18" height="18" rx="3" />
      </>
    ),
    menu: <path d="M4 8h16M4 16h16" />,
    mute: (
      <>
        <path d="M11 5 6 9H3v6h3l5 4V5Z" />
        <path d="m17 9 4 6m0-6-4 6" />
      </>
    ),
    play: <path d="m9 7 8 5-8 5V7Z" />,
    sound: (
      <>
        <path d="M11 5 6 9H3v6h3l5 4V5Z" />
        <path d="M15 9.5a4 4 0 0 1 0 5M18 7a7 7 0 0 1 0 10" />
      </>
    ),
  };

  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[name]}
    </svg>
  );
}
