"use client";

import { Component, useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import dynamic from "next/dynamic";
import type { PersonaPublica } from "@/content/types";
import { ExternalLink } from "@/components/external-link";
import { graphSignature, prepareGraph } from "@/lib/connection-graph";
import { CONNECTIONS_UPDATED_EVENT } from "@/lib/connection-events";

const POLL_MS = 15_000;

const ConnectionGraph = dynamic(
  () => import("@/components/connection-graph").then((mod) => mod.ConnectionGraph),
  { ssr: false },
);

type BoundaryProps = { children: ReactNode; fallback: ReactNode };
type BoundaryState = { failed: boolean };

class WebGLBoundary extends Component<BoundaryProps, BoundaryState> {
  state: BoundaryState = { failed: false };

  static getDerivedStateFromError(): BoundaryState {
    return { failed: true };
  }

  render() {
    if (this.state.failed) return this.props.fallback;
    return this.props.children;
  }
}

function webGLAvailable() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

function subscribeNothing() {
  return () => {};
}

let cachedWebGL: boolean | null = null;

function webglSnapshot() {
  if (cachedWebGL === null) cachedWebGL = webGLAvailable();
  return cachedWebGL;
}

function subscribeMotion(onChange: () => void) {
  const media = window.matchMedia("(prefers-reduced-motion: reduce)");
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}

function motionSnapshot() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function networkCountLabel(count: number) {
  return count === 1 ? "1 persona en la red" : `${count} personas en la red`;
}

function readPeople(payload: unknown): PersonaPublica[] | null {
  if (!payload || typeof payload !== "object") return null;
  const nodos = (payload as { nodos?: unknown }).nodos;
  if (!Array.isArray(nodos)) return null;

  const people: PersonaPublica[] = [];
  for (const item of nodos) {
    if (!item || typeof item !== "object") continue;
    const record = item as Record<string, unknown>;
    if (
      typeof record.id !== "string" ||
      typeof record.nombre !== "string" ||
      typeof record.rol !== "string" ||
      typeof record.compania !== "string" ||
      typeof record.linkedinUrl !== "string" ||
      typeof record.creadoEn !== "string"
    ) {
      continue;
    }

    people.push({
      id: record.id,
      nombre: record.nombre,
      rol: record.rol,
      compania: record.compania,
      linkedinUrl: record.linkedinUrl,
      creadoEn: record.creadoEn,
      ...(typeof record.track === "string" && record.track.trim() ? { track: record.track } : {}),
    });
  }

  return people;
}

function ConnectionGrid({ people }: { people: PersonaPublica[] }) {
  const nodes = prepareGraph(people)
    .nodes.filter((node) => !node.isCentral && node.linkedinUrl)
    .sort((a, b) => a.nombre.localeCompare(b.nombre, "es"));

  if (nodes.length === 0) return null;

  return (
    <ul className="person-grid">
      {nodes.map((node) => (
        <li key={node.id}>
          <ExternalLink href={node.linkedinUrl ?? ""}>
            <strong>{node.nombre}</strong>
            <p>{node.rol}</p>
            {node.count ? null : <p className="person-grid__company">{node.compania}</p>}
          </ExternalLink>
        </li>
      ))}
    </ul>
  );
}

const sceneClass = "network-scene";

export function RedConexiones() {
  const sectionRef = useRef<HTMLElement>(null);
  const [people, setPeople] = useState<PersonaPublica[] | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  const [active, setActive] = useState(false);
  const webgl = useSyncExternalStore(subscribeNothing, webglSnapshot, () => null as boolean | null);
  const reducedMotion = useSyncExternalStore(subscribeMotion, motionSnapshot, () => false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(([entry]) => {
      setActive(entry?.isIntersecting ?? false);
    });
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let cancelled = false;
    let requestId = 0;

    const load = async () => {
      const current = ++requestId;
      try {
        const response = await fetch("/api/conexiones", { cache: "no-store" });
        if (!response.ok) throw new Error("request failed");
        const peopleNext = readPeople(await response.json());
        if (peopleNext === null) throw new Error("invalid payload");
        if (cancelled || current !== requestId) return;
        setPeople((previous) => {
          if (previous && graphSignature(previous) === graphSignature(peopleNext)) return previous;
          return peopleNext;
        });
        setWarning((previous) => (previous === null ? previous : null));
      } catch {
        if (cancelled || current !== requestId) return;
        setPeople((previous) => previous ?? []);
        setWarning("No pudimos actualizar la red");
      }
    };

    void load();
    const interval = window.setInterval(() => void load(), POLL_MS);
    window.addEventListener(CONNECTIONS_UPDATED_EVENT, load);
    return () => {
      cancelled = true;
      window.clearInterval(interval);
      window.removeEventListener(CONNECTIONS_UPDATED_EVENT, load);
    };
  }, []);

  const count = people?.length ?? 0;
  const grid = <ConnectionGrid people={people ?? []} />;

  return (
    <section
      ref={sectionRef}
      id="red"
      aria-labelledby="red-titulo"
      className="network-section"
    >
      <div>
        <h2 id="red-titulo">Red de conexiones</h2>
        <p className="section-lead">Cada persona que se sienta a la mesa aparece acá.</p>
        {people ? (
          <p className="network-meta" aria-live="polite">
            {networkCountLabel(count)}
          </p>
        ) : null}
        <p className="network-meta">Tocá un nodo para abrir LinkedIn.</p>
        {people && count === 0 ? <p className="network-meta">Todavía no hay personas en la red.</p> : null}
        {warning ? (
          <p role="status" className="network-warning">
            {warning}
          </p>
        ) : null}
        <div className={people && webgl === false ? "section-stack" : "network-bleed section-stack"}>
          {people === null || webgl === null ? <div className={sceneClass} /> : null}
          {people && webgl === false ? grid : null}
          {people && webgl ? (
            <WebGLBoundary fallback={grid}>
              <div className={`${sceneClass} touch-none`}>
                <ConnectionGraph people={people} reducedMotion={reducedMotion} active={active} />
              </div>
            </WebGLBoundary>
          ) : null}
        </div>
      </div>
    </section>
  );
}
