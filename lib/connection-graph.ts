import type { PersonaPublica } from "@/content/types";

export const CENTRAL_NODE_ID = "central";
export const GROUP_THRESHOLD = 80;

export type GraphNode = {
  id: string;
  nombre: string;
  rol: string;
  compania: string;
  linkedinUrl?: string;
  track?: string;
  count?: number;
  isCentral: boolean;
};

export type GraphEdge = {
  source: string;
  target: string;
};

function sameToken(left?: string, right?: string) {
  const a = left?.trim().toLocaleLowerCase("es-AR");
  const b = right?.trim().toLocaleLowerCase("es-AR");
  return Boolean(a && b && a === b);
}

function peopleLabel(count: number) {
  return count === 1 ? "1 persona" : `${count} personas`;
}

function centralNode(): GraphNode {
  return {
    id: CENTRAL_NODE_ID,
    nombre: "Tandil Tech Week",
    rol: "",
    compania: "",
    isCentral: true,
  };
}

function personNode(person: PersonaPublica): GraphNode {
  const track = person.track?.trim();
  return {
    id: person.id,
    nombre: person.nombre,
    rol: person.rol,
    compania: person.compania,
    linkedinUrl: person.linkedinUrl,
    ...(track ? { track } : {}),
    isCentral: false,
  };
}

function earliest(members: PersonaPublica[]) {
  return [...members].sort(
    (a, b) => a.creadoEn.localeCompare(b.creadoEn) || a.id.localeCompare(b.id),
  )[0];
}

function companyNode(members: PersonaPublica[]): GraphNode {
  const first = earliest(members);
  const company = first.compania.trim();
  const tracks = new Set(members.map((member) => member.track?.trim()).filter(Boolean));
  const track = tracks.size === 1 ? [...tracks][0] : undefined;
  const count = members.length;

  return {
    id: `company:${company.toLocaleLowerCase("es-AR")}`,
    nombre: company,
    rol: peopleLabel(count),
    compania: company,
    linkedinUrl: first.linkedinUrl,
    ...(track ? { track } : {}),
    count,
    isCentral: false,
  };
}

function groupedGraph(people: PersonaPublica[]) {
  const groups = new Map<string, PersonaPublica[]>();
  const individuals: PersonaPublica[] = [];

  for (const person of people) {
    const company = person.compania.trim();
    if (!company) {
      individuals.push(person);
      continue;
    }
    const key = company.toLocaleLowerCase("es-AR");
    const members = groups.get(key) ?? [];
    members.push(person);
    groups.set(key, members);
  }

  return {
    nodes: [
      centralNode(),
      ...[...groups.values()].map(companyNode),
      ...individuals.map(personNode),
    ],
    edges: [] as GraphEdge[],
  };
}

export function prepareGraph(people: PersonaPublica[]) {
  if (people.length > GROUP_THRESHOLD) return groupedGraph(people);

  const nodes = [centralNode(), ...people.map(personNode)];
  const edges: GraphEdge[] = [];
  const linked = new Set<string>();

  for (let index = 0; index < people.length; index += 1) {
    for (let next = index + 1; next < people.length; next += 1) {
      const left = people[index];
      const right = people[next];
      const sharesCompany = sameToken(left.compania, right.compania);
      const sharesTrack = sameToken(left.track, right.track);
      if (!sharesCompany && !sharesTrack) continue;
      edges.push({ source: left.id, target: right.id });
      linked.add(left.id);
      linked.add(right.id);
    }
  }

  for (const person of people) {
    if (!linked.has(person.id)) {
      edges.push({ source: person.id, target: CENTRAL_NODE_ID });
    }
  }

  return { nodes, edges };
}

export function graphSignature(people: PersonaPublica[]) {
  return people
    .map((person) =>
      [person.id, person.nombre, person.rol, person.compania, person.track ?? "", person.linkedinUrl].join(
        "~",
      ),
    )
    .sort()
    .join("|");
}
