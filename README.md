# Dflow

> is a minimal [Dataflow programming][dataflow-wikipedia] engine

## Installation

With [npm](https://npmjs.org/) do

```sh
npm install dflow
```

## How it works

A **node** represents a block of code: it can have **inputs** and **outputs**.

An **edge** connects an input to an output.

A **graph** represents a program.
It can contain nodes and edges. Nodes are executed, sorted by their connections.

## Features

- Implemented in TypeScript.
- Expressive and simple API.
- A graph can be saved as a JSON file. It can be then loaded and executed.
- It is easy to create nodes: just extend `DflowNode` class, define its inputs and outputs and the `run()` function.
- Minimal internal type system: it is possible to connect an output of type `T` to an input of type `U`, if and only if `U` includes `T`.
- It is possible to define functions represented by nodes and edges.

**NOTA BENE**: it is supposed that you implement your own nodes, for example node `addition` could be implemented using bigint or some floating point library, according to your needs.
However an example nodes catalog with basic JavaScript features can be imported from `dflow/nodes`.

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
```

A graph can be executed asynchronously with `await dflow.run()`: see [custom nodes example](https://github.com/fibo/dflow/blob/main/examples/custom-nodes.js).

Available examples are listed [here](https://github.com/fibo/dflow/blob/main/examples).

## License

[MIT](https://fibo.github.io/mit-license)

[dataflow-wikipedia]: http://en.wikipedia.org/wiki/Dataflow_programming "Dataflow programming"

