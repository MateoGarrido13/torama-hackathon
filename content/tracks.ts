import type { Track } from "@/content/types";

export const tracks: Track[] = [];

export const trackColors: Record<string, string> = {
  software: "#c9ff3d",
  design: "#f2f0e9",
  marketing: "#ff6b4a",
  producto: "#ffffff",
};

export const neutralNodeColor = "#e8e5dc";
export const centralNodeColor = "#c9ff3d";

export function nodeColorForTrack(track?: string) {
  if (!track) return neutralNodeColor;
  return trackColors[track] ?? neutralNodeColor;
}

/** Opciones del formulario. Si `tracks` está vacío, usa los ids que ya tienen color de nodo. */
export function formTracks(): Track[] {
  if (tracks.length > 0) return tracks;
  return Object.keys(trackColors).map((id) => ({ id, nombre: id }));
}
