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
    let sum = 0;

    for (const input of this.inputs) {
      const inputData = input.data;
      if (typeof inputData === "number") {
        sum += inputData;
      }
    }

    const output = this.output(0);
    if (output !== null) {
      output.data = sum;
    }
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
    id: "num",
    name: "Hello world",
    kind: NumNode.kind,
    outputs: [{ id: "out", data: 21 }],
  });
  const sumNode = dflow.newNode({
    id: "sum",
    kind: SumNode.kind,
    inputs: [{ id: "in1" }, { id: "in2" }],
    outputs: [{ id: "out" }],
  });

  // Connect nodes, using both `dflow.connect()` and `dflow.newEdge()`.
  dflow.connect(numNode).to(sumNode);
  dflow.newEdge({
    id: "e2",
    source: ["num", "out"],
    target: ["sum", "in2"],
  });

  // Add also an async node.
  dflow.newNode({ id: "sleep", kind: SleepNode.kind });

  await dflow.run();

  const sum = sumNode.output(0);
  console.log(sum.data); // 42
}

runGraph();
