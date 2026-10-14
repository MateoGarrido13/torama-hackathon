export const CONNECTIONS_UPDATED_EVENT = "conexiones:actualizadas";

export function notifyConnectionsUpdated() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(CONNECTIONS_UPDATED_EVENT));
}
