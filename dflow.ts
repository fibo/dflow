export interface DflowNodeSerialized {
  kind: string;
}

export class DflowNode {
  readonly kind: string;

  constructor({ kind }: DflowNodeSerialized) {
    this.kind = kind;
  }

  toJSON(): string {
    return JSON.stringify({ kind: this.kind });
  }
}

export class DflowGraph {
  readonly nodes = new Map<string, DflowNode>();

  toJSON(): string {
    return JSON.stringify({ nodes: [], edges: [] });
  }
}

export class DflowHost {
  readonly graph = new DflowGraph();
}
