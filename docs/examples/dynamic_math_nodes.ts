import { Dflow } from "dflow";

// Generate Dflow nodes for all Math properties and functions.

const mathNodes = Object.getOwnPropertyNames(Math).map((key) => {
  // @ts-expect-error: expression of type 'string' can't be used to index type 'Math'
  const item = Math[key];

  const kind = `Math.${key}`;
  const outputs = [Dflow.output("number")];

  // If the item is a number, create a node that outputs that number.
  if (typeof item === "number") {
    return {
      kind,
      outputs,
      run: () => item
    };
  }

  // If the item is a function, wrap in in the run method.
  if (typeof item === "function") {
    return {
      kind,
      // Get the number of inputs from the function's length property.
      inputs: Array(item.length).fill(Dflow.input("number")),
      outputs,
      run: (...args: number[]) => {
        return item(...args);
      }
    };
  }
  // Not needed, just to make TS happy.
  throw new Error(`Unsupported Math property: ${key}`);
});

// Create a Dflow instance with the generated node definitions.
const dflow = new Dflow(mathNodes);

// Compute Math.trunc(Math.E)
const nodeId1 = dflow.node("Math.E");
const nodeId2 = dflow.node("Math.trunc");
dflow.link(nodeId1, nodeId2);

dflow.run();

console.log(dflow.out);
// { n0: [ 2.718281828459045 ], n1: [ 2 ] }
