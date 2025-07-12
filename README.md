# Dflow

> A minimal [Dataflow programming][dataflow-wikipedia] engine

## Installation

With [npm](https://npmjs.org/) do

```sh
npm install dflow
```

## How it works

### What is a Dflow graph

A **node** represents a block of code: it can have **inputs** and **outputs**.

A **link** connects an input to an output.

A **graph** represents a program.
It can contain nodes and links.
Nodes are executed, sorted by their connections.

### About inputs and outputs

An **input** is just a reference to its connected output, if any.

An **output** can be connected to multiple inputs, and hold a **data** value that can be `undefined` or any value that can be serialized into JSON.

## Features

- Implemented in TypeScript.
- Expressive and simple API.
- A graph can be saved as a JSON file. It can be then loaded and executed.
- It is easy to create nodes: just extend `DflowNode` class, define its inputs and outputs and the `run()` function.
- Minimal internal type system: it is possible to connect an output of type `T` to an input of type `U`, if and only if `U` includes `T`.

**NOTA BENE**: it is supposed that you implement your own nodes, for example node `addition` could be implemented using bigint or some floating point library, according to your needs.

An example of nodes implementing basic JavaScript features can be found in [examples/nodes](https://github.com/fibo/dflow/tree/main/examples/nodes).

## Usage

This is a graph that will compute `sin(π / 2) = 1` and print the result.

```
   ----------------
  | number = π / 2 |
   ----------------
   |
   |
   ---------
  | mathSin |
   ---------
    \
     \
     ------------
    | consoleLog |
     ------------
```

You can run the following code with any of the following by cloning this repo and launching `npm run example:usage`.

You should see a number `1` printed on output.

```javascript
import { Dflow, DflowNode } from "dflow";

const { input, output } = DflowNode;

class MathSin extends DflowNode {
  static kind = "mathSin";
  static inputs = [input("number")];
  static outputs = [output("number")];
  run(input) {
    return Math.sin(input);
  }
}

class ConsoleLog extends DflowNode {
  static kind = "consoleLog";
  static inputs = [input()];
  run(input) {
    console.log(input);
  }
}

// Create a Dflow instance with the given nodes.
const dflow = new Dflow([MathSin, ConsoleLog]);

// Create nodes.
const sinNodeId = dflow.node("mathSin");
const consoleLogNodeId = dflow.node("consoleLog");

// DflowNodeData is a core node, its kind is "data".
const numNodeId = dflow.node("data", {
  // set numNode output to π / 2
  outputs: [{ data: Math.PI / 2 }]
});

// Connect numNode to sinNode and sinNode to consoleLog
dflow.link(numNodeId, sinNodeId);
dflow.link(sinNodeId, consoleLogNodeId);

// run graph
dflow.run();
```

A graph can be executed asynchronously with `await dflow.run()`: see [async nodes example](https://github.com/fibo/dflow/blob/main/examples/async-nodes.js).

Available examples are listed [here](https://github.com/fibo/dflow/blob/main/examples).

## License

[MIT](https://fibo.github.io/mit-license)

[dataflow-wikipedia]: http://en.wikipedia.org/wiki/Dataflow_programming "Dataflow programming"
