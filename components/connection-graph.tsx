"use client";

import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { forceCenter, forceLink, forceManyBody, forceSimulation } from "d3-force-3d";
import type { ForceSimulation } from "d3-force-3d";
import type { Mesh, MeshStandardMaterial } from "three";
import { BufferAttribute, BufferGeometry, LineBasicMaterial, LineSegments, Vector3 } from "three";
import type { PersonaPublica } from "@/content/types";
import { centralNodeColor, nodeColorForTrack } from "@/content/tracks";
import { focusRing } from "@/lib/styles";
import { CENTRAL_NODE_ID, graphSignature, prepareGraph, type GraphNode } from "@/lib/connection-graph";

const LINK_DISTANCE = 9;
const CHARGE = -20;
const SETTLE_TICKS = 360;

type SimNode = GraphNode & {
  x: number;
  y: number;
  z: number;
  vx?: number;
  vy?: number;
  vz?: number;
  fx?: number | null;
  fy?: number | null;
  fz?: number | null;
  enter: boolean;
};

type ResolvedLink = {
  source: SimNode;
  target: SimNode;
};

type GraphModel = {
  nodes: SimNode[];
  links: ResolvedLink[];
};

function hashJitter(id: string): [number, number, number] {
  let hash = 2166136261;
  for (let index = 0; index < id.length; index += 1) {
    hash ^= id.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  const unit = (shift: number) => ((hash >>> shift) & 1023) / 1023 - 0.5;
  return [unit(0) * 4, unit(10) * 4, unit(20) * 4];
}

function radiusFor(node: GraphNode) {
  if (node.isCentral) return 1.45;
  if (node.count) return Math.min(2.05, 0.82 + node.count * 0.04);
  return 0.62;
}

function releasePins(nodes: SimNode[]) {
  for (const node of nodes) {
    if (node.isCentral) continue;
    node.fx = null;
    node.fy = null;
    node.fz = null;
  }
}

function FrameCamera({ count }: { count: number }) {
  const camera = useThree((state) => state.camera);
  const framed = useRef(false);

  useLayoutEffect(() => {
    if (framed.current) return;
    framed.current = true;
    const distance = Math.min(88, 28 + Math.sqrt(Math.max(count, 1)) * 4);
    camera.position.set(0, distance * 0.16, distance);
    camera.lookAt(0, 0, 0);
  }, [camera, count]);

  return null;
}

function Edges({ links }: { links: ResolvedLink[] }) {
  const geometry = useMemo(() => new BufferGeometry(), []);
  const material = useMemo(
    () => new LineBasicMaterial({ color: "#ffffff", transparent: true, opacity: 0.55 }),
    [],
  );
  const lines = useMemo(() => {
    const object = new LineSegments(geometry, material);
    object.raycast = () => {};
    return object;
  }, [geometry, material]);

  useLayoutEffect(() => {
    geometry.setAttribute("position", new BufferAttribute(new Float32Array(links.length * 6), 3));
  }, [geometry, links]);

  useFrame(() => {
    const attribute = geometry.getAttribute("position") as BufferAttribute | undefined;
    if (!attribute) return;
    const array = attribute.array as Float32Array;
    for (let index = 0; index < links.length; index += 1) {
      const { source, target } = links[index];
      const offset = index * 6;
      array[offset] = source.x;
      array[offset + 1] = source.y;
      array[offset + 2] = source.z;
      array[offset + 3] = target.x;
      array[offset + 4] = target.y;
      array[offset + 5] = target.z;
    }
    attribute.needsUpdate = true;
  });

  useLayoutEffect(
    () => () => {
      geometry.dispose();
      material.dispose();
    },
    [geometry, material],
  );

  return <primitive object={lines} />;
}

function openLinkedin(url?: string) {
  if (!url) return;
  window.open(url, "_blank", "noopener,noreferrer");
}

function ProjectLabels({
  nodes,
  labels,
}: {
  nodes: SimNode[];
  labels: { current: Map<string, HTMLDivElement> };
}) {
  const point = useRef(new Vector3());

  useFrame(({ camera, size }) => {
    for (const node of nodes) {
      const element = labels.current.get(node.id);
      if (!element) continue;
      point.current.set(node.x, node.y, node.z).project(camera);
      const x = (point.current.x * 0.5 + 0.5) * size.width;
      const y = (-point.current.y * 0.5 + 0.5) * size.height;
      element.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      element.style.visibility = point.current.z < 1 ? "visible" : "hidden";
    }
  });

  return null;
}

function GraphNodeMesh({
  node,
  reducedMotion,
  highlighted,
  onHover,
}: {
  node: SimNode;
  reducedMotion: boolean;
  highlighted: boolean;
  onHover: (id: string | null) => void;
}) {
  const mesh = useRef<Mesh>(null);
  const material = useRef<MeshStandardMaterial>(null);
  const born = useRef(0);
  const color = node.isCentral ? centralNodeColor : nodeColorForTrack(node.track);

  useLayoutEffect(() => {
    born.current = performance.now();
    return () => {
      document.body.style.cursor = "";
    };
  }, []);

  useFrame(() => {
    const current = mesh.current;
    if (!current) return;
    current.position.set(node.x, node.y, node.z);
    if (reducedMotion || !node.enter) {
      current.scale.setScalar(1);
    } else {
      const progress = Math.min(1, (performance.now() - born.current) / 420);
      current.scale.setScalar(1 - (1 - progress) ** 3);
    }
    if (material.current) {
      material.current.emissive.set("#ffffff");
      material.current.emissiveIntensity = highlighted ? 0.28 : 0;
    }
  });

  return (
    <mesh
      ref={mesh}
      position={[node.x, node.y, node.z]}
      scale={node.enter && !reducedMotion ? 0.001 : 1}
      onClick={(event) => {
        event.stopPropagation();
        if (!node.isCentral) openLinkedin(node.linkedinUrl);
      }}
      onPointerOver={(event) => {
        if (node.isCentral || !node.linkedinUrl) return;
        event.stopPropagation();
        onHover(node.id);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        onHover(null);
        document.body.style.cursor = "";
      }}
    >
      <sphereGeometry args={[radiusFor(node), 28, 28]} />
      <meshStandardMaterial ref={material} color={color} roughness={0.35} metalness={0.08} />
    </mesh>
  );
}

export function ConnectionGraph({
  people,
  reducedMotion,
  active,
}: {
  people: PersonaPublica[];
  reducedMotion: boolean;
  active: boolean;
}) {
  const layoutKey = `${graphSignature(people)}:${reducedMotion ? "reduce" : "motion"}`;
  const layoutKeyRef = useRef<string | null>(null);
  const simRef = useRef<ForceSimulation<SimNode> | null>(null);
  const [model, setModel] = useState<GraphModel | null>(null);

  useLayoutEffect(() => {
    const existing = simRef.current;
    if (layoutKeyRef.current === layoutKey && existing) {
      return () => {
        existing.stop();
      };
    }

    layoutKeyRef.current = layoutKey;
    const previous = new Map((existing?.nodes() ?? []).map((node) => [node.id, node]));
    const { nodes: defined, edges } = prepareGraph(people);
    const overlaps = defined.some((node) => previous.has(node.id));
    const nextNodes: SimNode[] = defined.map((node) => {
      const prior = previous.get(node.id);
      if (prior) {
        prior.nombre = node.nombre;
        prior.rol = node.rol;
        prior.compania = node.compania;
        prior.linkedinUrl = node.linkedinUrl;
        prior.track = node.track;
        prior.count = node.count;
        prior.isCentral = node.isCentral;
        prior.enter = false;
        return prior;
      }

      const [x, y, z] = node.isCentral ? [0, 0, 0] : hashJitter(node.id);
      return {
        ...node,
        x,
        y,
        z,
        enter: !reducedMotion && overlaps && !node.isCentral,
      };
    });

    const hasNew = nextNodes.some((node) => !node.isCentral && !previous.has(node.id));
    for (const node of nextNodes) {
      if (node.id === CENTRAL_NODE_ID || node.isCentral) {
        node.x = 0;
        node.y = 0;
        node.z = 0;
        node.fx = 0;
        node.fy = 0;
        node.fz = 0;
        continue;
      }
      if (overlaps && !hasNew) continue;
      if (overlaps && previous.has(node.id)) {
        node.fx = node.x;
        node.fy = node.y;
        node.fz = node.z;
      } else {
        node.fx = null;
        node.fy = null;
        node.fz = null;
      }
    }

    existing?.stop();
    existing?.on("end", null);

    const linkForce = forceLink<SimNode>(
      edges.map((edge) => ({ source: edge.source, target: edge.target })),
    )
      .id((node) => node.id)
      .distance(LINK_DISTANCE);

    const simulation = forceSimulation(nextNodes, 3)
      .force("link", linkForce)
      .force("charge", forceManyBody().strength(CHARGE))
      .force("center", forceCenter(0, 0, 0))
      .stop();

    const links = linkForce.links().map((link) => {
      if (typeof link.source === "string" || typeof link.target === "string") {
        throw new Error("Arista sin nodo");
      }
      return { source: link.source as SimNode, target: link.target as SimNode };
    });

    if (reducedMotion) {
      simulation.alpha(1);
      for (let step = 0; step < SETTLE_TICKS; step += 1) simulation.tick();
      releasePins(nextNodes);
    } else if (!overlaps || hasNew) {
      simulation.alpha(overlaps ? 0.45 : 1);
      simulation.on("end", () => releasePins(nextNodes));
    } else {
      releasePins(nextNodes);
      simulation.alpha(0);
    }

    simRef.current = simulation;
    setModel({ nodes: nextNodes, links });

    return () => {
      simulation.on("end", null);
      simulation.stop();
    };
    // `layoutKey` resume la data y la preferencia de movimiento.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [layoutKey]);

  useLayoutEffect(() => {
    const simulation = simRef.current;
    if (!simulation || reducedMotion) return;
    if (active) {
      if (simulation.alpha() > simulation.alphaMin()) simulation.restart();
    } else {
      simulation.stop();
    }
  }, [active, reducedMotion, model]);

  const orderedNodes = useMemo(() => {
    if (!model) return [];
    return [...model.nodes].sort((a, b) => {
      if (a.isCentral) return -1;
      if (b.isCentral) return 1;
      return a.nombre.localeCompare(b.nombre, "es");
    });
  }, [model]);
  const labels = useRef(new Map<string, HTMLDivElement>());
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [focusedId, setFocusedId] = useState<string | null>(null);

  return (
    <div className="relative h-full w-full">
      <Canvas
        camera={{ position: [0, 5, 34], fov: 50 }}
        dpr={[1, 1.5]}
        frameloop={active ? "always" : "demand"}
        gl={{ antialias: true, alpha: false }}
        className="h-full w-full"
      >
        <color attach="background" args={["#3155ff"]} />
        <ambientLight intensity={0.7} />
        <directionalLight position={[8, 12, 6]} intensity={1.15} />
        <FrameCamera count={people.length} />
        <ProjectLabels nodes={orderedNodes} labels={labels} />
        {model && model.links.length > 0 ? <Edges links={model.links} /> : null}
        {orderedNodes.map((node) => (
          <GraphNodeMesh
            key={node.id}
            node={node}
            reducedMotion={reducedMotion}
            highlighted={hoveredId === node.id || focusedId === node.id}
            onHover={(id) => {
              setHoveredId((current) => (id === null && current !== node.id ? current : id));
            }}
          />
        ))}
        <OrbitControls
          makeDefault
          enablePan={false}
          enableDamping={!reducedMotion}
          minDistance={8}
          maxDistance={110}
        />
      </Canvas>
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {orderedNodes.map((node) => {
          const highlighted = hoveredId === node.id || focusedId === node.id;
          const showPersistent = node.isCentral || Boolean(node.count);
          if (!showPersistent && !highlighted) return null;

          return (
            <div
              key={node.id}
              ref={(element) => {
                if (element) labels.current.set(node.id, element);
                else labels.current.delete(node.id);
              }}
              className="invisible absolute top-0 left-0"
            >
              {node.isCentral ? (
                <p className="-translate-y-8 font-display text-sm whitespace-nowrap text-white select-none">
                  Tandil Tech Week
                </p>
              ) : null}
              {node.count ? (
                <p
                  className={`-translate-y-8 text-center text-xs whitespace-nowrap text-white select-none ${highlighted ? "outline outline-acid" : ""}`}
                >
                  {node.nombre}
                  <span className="mt-0.5 block text-white/70">{node.rol}</span>
                </p>
              ) : null}
              {!node.isCentral && !node.count && highlighted ? (
                <div
                  className={`w-44 -translate-y-14 border bg-canvas px-3 py-2 text-left shadow-[8px_8px_0_#10100f] ${focusedId === node.id ? "border-accent" : "border-line"}`}
                >
                  <p className="truncate text-sm font-medium text-ink">{node.nombre}</p>
                  <p className="truncate text-xs text-muted">{node.rol}</p>
                  {node.count ? null : <p className="truncate text-xs text-accent">{node.compania}</p>}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
      <ul className="sr-only">
        {orderedNodes.map((node) => {
          if (node.isCentral || !node.linkedinUrl) return null;
          const label = node.count
            ? `${node.nombre}, ${node.rol}. Abrir LinkedIn`
            : `${node.nombre}, ${node.rol}, ${node.compania}. Abrir LinkedIn`;
          return (
            <li key={node.id}>
              <button
                type="button"
                className={focusRing}
                onFocus={() => setFocusedId(node.id)}
                onBlur={() => setFocusedId((current) => (current === node.id ? null : current))}
                onClick={() => openLinkedin(node.linkedinUrl)}
              >
                {label}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
