class d {
  graph;
  id;
  kind;
  constructor(t, { id: s, kind: e }) {
    this.graph = t, this.id = s, this.kind = e;
  }
  toJSON() {
    return JSON.stringify({ id: this.id, kind: this.kind });
  }
}
class o {
  id;
  source;
  target;
  constructor({ id: t, source: s, target: e }) {
    this.id = t,
      this.source = { ...s, pinKind: "output" },
      this.target = { ...e, pinKind: "input" };
  }
  toJSON() {
    return JSON.stringify({ id: this.id });
  }
}
class r {
  nodes = new Map();
  edges = new Map();
  toJSON() {
    const t = Object.values(this.nodes).map((e) => e.toJSON()),
      s = Object.values(this.edges).map((e) => e.toJSON());
    return JSON.stringify({ nodes: t, edges: s });
  }
}
class a {
  graph = new r();
  addNode(t) {
    const s = new d(this.graph, t);
    this.graph.nodes.set(s.id, s);
  }
  addEdge(t) {
    const s = new o(t);
    this.graph.edges.set(s.id, s);
  }
  clearGraph() {
    this.graph.nodes.clear(), this.graph.edges.clear();
  }
}
export { d as DflowNode };
export { o as DflowEdge };
export { r as DflowGraph };
export { a as DflowHost };
