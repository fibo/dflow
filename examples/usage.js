// Keep in sync with README.md file.

import { Dflow, DflowNode } from "../dflow.js";

const { input, output } = Dflow;

class DflowMathSin extends DflowNode {
  static kind = "mathSin";
  static inputs = [input("number")];
  static outputs = [output("number")];
  run() {
    this.output(0).data = Math.sin(this.input(0).data);
  }
}

class DflowConsoleLog extends DflowNode {
  static kind = "consoleLog";
  static inputs = [input()];
  run() {
    console.log(this.input(0).data);
  }
}

const nodesCatalog = {
  [DflowMathSin.kind]: DflowMathSin,
  [DflowConsoleLog.kind]: DflowConsoleLog,
  // DflowNodeData is a core node
};

function rungraph() {
  // use builtin nodes
  const dflow = new Dflow({ nodesCatalog });
  const catalog = dflow.nodesCatalog;

  // create nodes
  const numNode = dflow.newNode({
    kind: catalog.data.kind,
    // set numNode output to π / 2
    outputs: [{ data: Math.PI / 2 }],
  });
  const sinNode = dflow.newNode({ kind: catalog.mathSin.kind });
  const consoleLogNode = dflow.newNode({ kind: catalog.consoleLog.kind });

  // connect numNode to sinNode and sinNode to consoleLog
  dflow.connect(numNode).to(sinNode);
  dflow.connect(sinNode).to(consoleLogNode);

  // run graph
  dflow.run();
}

rungraph();
