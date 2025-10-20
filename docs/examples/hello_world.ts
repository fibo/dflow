// Sync with README.md example
import { Dflow } from "dflow";

const helloWorld = {
  kind: "helloWorld",
  run() {
    console.log("Hello, World!");
  }
};

// Create a Dflow instance.
const dflow = new Dflow([helloWorld]);
// Create a helloWorld node.
dflow.node("helloWorld");
// run graph
dflow.run();
