import { DflowHost, DflowNode } from "../dflow.js";

const { input, output } = DflowNode;

class NumNode extends DflowNode {
  static kind = "Num";
  static outputs = [output(["number"])];
  run() {}
}

class SumNode extends DflowNode {
  static kind = "Sum";
  static inputs = [input(["number"]), input(["number"])];
  static outputs = [output(["number"])];
  run() {
    const a = this.input(0).data;
    const b = this.input(1).data;
    this.output(0).data = a + b;
  }
}

function sleep(seconds = 1) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, seconds * 1000);
  });
}

class SleepNode extends DflowNode {
  kind = "Sleep";
  async run() {
    const numSeconds = 2;
    console.log("sleep node start", `(will sleep ${numSeconds} seconds) zZz`);
    await sleep(numSeconds);
    console.log("sleep node end");
  }
}

const nodesCatalog = {
  [NumNode.kind]: NumNode,
  [SumNode.kind]: SumNode,
  [SleepNode.kind]: SleepNode,
};

async function runGraph() {
  const dflow = new DflowHost({ nodesCatalog });

  // Create two nodes, num and sum.

  const numNode = dflow.newNode({
    kind: NumNode.kind,
    outputs: [{ id: "out", data: 21 }],
  });
  const sumNode = dflow.newNode({
    kind: SumNode.kind,
    // Optional `id`.
    id: "sum",
    inputs: [{ id: "in1" }, { id: "in2" }],
    outputs: [{ id: "out" }],
  });

  // Connect nodes. Both `dflow.connect()` and `dflow.newEdge()` are used here.
  dflow.connect(numNode).to(sumNode);
  dflow.newEdge({
    id: "e2",
    source: [numNode.id, "out"],
    target: ["sum", "in2"],
  });

  // Add also an async node.
  dflow.newNode({ id: "sleep", kind: SleepNode.kind });

  // Run graph asynchronously.
  await dflow.run();

  const sum = sumNode.output(0);
  console.log(sum.data); // 42
}

runGraph();
