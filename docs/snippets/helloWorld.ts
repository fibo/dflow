import { Dflow, type DflowNode } from "dflow";

// Node definition.
const helloWorld: DflowNode = {
  kind: "hello",
  run: () => console.log("Hello, World!")
};

// Create a dflow instance.
const dflow = new Dflow([helloWorld]);

// Add a node to the graph.
dflow.node("hello");

// Run the dflow graph.
dflow.run();
