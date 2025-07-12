// Keep in sync with README.md file.

import { Dflow, DflowNode } from "dflow";

const { input, output } = DflowNode;

class MathSin extends DflowNode {
  static kind = "mathSin";
  static inputs = [input("number")];
  static outputs = [output("number")];
  run() {
    this.output(0).data = Math.sin(this.input(0).data);
  }
}

class ConsoleLog extends DflowNode {
  static kind = "consoleLog";
  static inputs = [input()];
  run() {
    console.log(this.input(0).data);
  }
}

// Create a Dflow instance with the given nodes.
const dflow = new Dflow([MathSin, ConsoleLog]);

// Create nodes.
const sinNode = dflow.newNode({ kind: "mathSin" });
const consoleLogNode = dflow.newNode({ kind: "consoleLog" });

// DflowNodeData is a core node, its kind is "data".
const numNode = dflow.newNode({
  kind: "data",
  // set numNode output to π / 2
  outputs: [{ data: Math.PI / 2 }]
});

// Connect numNode to sinNode and sinNode to consoleLog
dflow.connect(numNode).to(sinNode);
dflow.connect(sinNode).to(consoleLogNode);

// run graph
dflow.run();
