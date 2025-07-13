// Keep in sync with README.md file.

import { Dflow } from "dflow";

const { input, output } = Dflow;

const MathSin = {
  kind: "mathSin",
  inputs: [input("number")],
  outputs: [output("number")],
  run(input) {
    return Math.sin(input);
  }
};

const ConsoleLog = {
  kind: "consoleLog",
  inputs: [input()],
  run(input) {
    console.log(input);
  }
};

// Create a Dflow instance with the given nodes.
const dflow = new Dflow([MathSin, ConsoleLog]);

// Create nodes.
const sinNodeId = dflow.node("mathSin");
const consoleLogNodeId = dflow.node("consoleLog");

// Create a data node.
// It will create an instance of a node with kind "data"
// This is a special node, which is built-in into every Dflow instance.
const numNodeId = dflow.data(Math.PI / 2);

// Connect numNode to sinNode and sinNode to consoleLog
dflow.link(numNodeId, sinNodeId);
dflow.link(sinNodeId, consoleLogNodeId);

// run graph
dflow.run();
