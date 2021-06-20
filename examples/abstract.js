import { DflowHost, DflowNode } from "../dflow.js";

class NumNode extends DflowNode {
  static kind = "Num";

  run() {}
}

class SumNode extends DflowNode {
  static kind = "Sum";

  run() {
    let sum = 0;

    for (const input of this.inputs.values()) {
      const inputData = input.data;
      if (typeof inputData === "number") {
        sum += inputData;
      }
    }

    const output = this.getOutputByPosition(0);
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
  static meta = {
    isAsync: true,
  };

  constructor(serializedNode) {
    super(serializedNode, SleepNode.meta);
  }

  async run() {
    console.log("sleep node start");
    await sleep();
    console.log("sleep node end");
  }
}

const nodesCatalog = {
  [NumNode.kind]: NumNode,
  [SumNode.kind]: SumNode,
  [SleepNode.kind]: SleepNode,
};

async function runGraph() {
  const dflow = new DflowHost(nodesCatalog);

  dflow.newNode({
    id: "num",
    name: "Hello world",
    kind: NumNode.kind,
    outputs: [{ id: "out", data: 2 }],
  });
  const sumNode = dflow.newNode({
    id: "sum",
    kind: SumNode.kind,
    inputs: [{ id: "in1" }, { id: "in2" }],
    outputs: [{ id: "out" }],
  });
  dflow.newEdge({
    id: "e1",
    source: ["num", "out"],
    target: ["sum", "in1"],
  });
  dflow.newEdge({
    id: "e2",
    source: ["num", "out"],
    target: ["sum", "in2"],
  });

  // Add also an async node.
  dflow.newNode({ id: "sleep", kind: SleepNode.kind });

  await dflow.graph.run();

  const sum = sumNode.getOutputByPosition(0);
  console.log(sum.data); // 4
}

runGraph();
