import type { Track } from "@/content/types";

type TrackMarqueeProps = {
  tracks: Track[];
};

export function TrackMarquee({ tracks }: TrackMarqueeProps) {
  if (tracks.length === 0) return null;

  const loop = [...tracks, ...tracks];

  return (
    <div className="marquee mt-16 overflow-hidden border-y border-line">
      <ul className="marquee-track flex w-max items-center py-4 motion-reduce:hidden">
        {loop.map((track, index) => (
          <li
            key={`${track.id}-${index}`}
            className="flex items-center gap-8 pr-8 text-sm tracking-[0.16em] text-ink uppercase"
          >
            <span>{track.nombre}</span>
            <span aria-hidden="true" className="text-accent">
              +
            </span>
          </li>
        ))}
      </ul>
      <ul className="hidden flex-wrap gap-x-6 gap-y-2 px-5 py-4 motion-reduce:flex">
        {tracks.map((track) => (
          <li key={track.id} className="text-sm tracking-[0.16em] text-ink uppercase">
            {track.nombre}
          </li>
        ))}
      </ul>
    </div>
  );
}
