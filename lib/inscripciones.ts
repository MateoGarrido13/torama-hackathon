export type ClosedInscription = {
  open: false;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

export type InscriptionStatus =
  | { open: true }
  | ClosedInscription;

export function inscriptionStatus(
  nowMs: number,
  opensAtIso: string,
): InscriptionStatus {
  const remainingMs = new Date(opensAtIso).getTime() - nowMs;

  if (remainingMs <= 0) {
    return { open: true };
  }

  const totalSeconds = Math.floor(remainingMs / 1000);
  const days = Math.floor(totalSeconds / 86_400);
  const hours = Math.floor((totalSeconds % 86_400) / 3_600);
  const minutes = Math.floor((totalSeconds % 3_600) / 60);
  const seconds = totalSeconds % 60;

  return { open: false, days, hours, minutes, seconds };
}
