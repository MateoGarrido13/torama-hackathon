declare module "d3-force-3d" {
  export interface SimulationNode {
    index?: number;
    x?: number;
    y?: number;
    z?: number;
    vx?: number;
    vy?: number;
    vz?: number;
    fx?: number | null;
    fy?: number | null;
    fz?: number | null;
  }

  export interface SimulationLink<Node extends SimulationNode> {
    source: Node | string;
    target: Node | string;
  }

  export interface ForceSimulation<Node extends SimulationNode> {
    tick(iterations?: number): this;
    restart(): this;
    stop(): this;
    nodes(): Node[];
    alpha(): number;
    alpha(value: number): this;
    alphaMin(): number;
    force(name: string, force: unknown): this;
    on(name: "end", listener: (() => void) | null): this;
  }

  export interface LinkForce<Node extends SimulationNode> {
    id(accessor: (node: Node) => string): this;
    distance(distance: number): this;
    links(): Array<SimulationLink<Node>>;
  }

  export function forceSimulation<Node extends SimulationNode>(
    nodes?: Node[],
    numDimensions?: number,
  ): ForceSimulation<Node>;

  export function forceLink<Node extends SimulationNode>(
    links?: Array<SimulationLink<Node>>,
  ): LinkForce<Node>;

  export function forceManyBody(): { strength(value: number): unknown };

  export function forceCenter(x?: number, y?: number, z?: number): unknown;
}
