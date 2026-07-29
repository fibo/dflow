import { Dflow, type DflowNode } from "dflow";

// Define a node.
const helloWorld: DflowNode = {
  kind: "hello",
  run: () => console.log("Hello, World!")
};

const nodeDefinitions = [helloWorld];

// Create a dflow instance.
const dflow = new Dflow(nodeDefinitions);

// Add a node to the graph.
dflow.node("hello");

// Run the dflow graph.
dflow.run();
