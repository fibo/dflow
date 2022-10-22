# Dflow

> is a minimal [Dataflow programming][dataflow-wikipedia] engine

## How it works

A **node** represents a block of code: it can have **inputs** and **outputs**.

An **edge** connects an input to an output.

A **graph** represents a program.
It can contain nodes and edges. Nodes are executed, sorted by their connections.

## Features

- Implemented in TypeScript, available both on Node and Deno.
- Expressive and simple API.
- A graph can be saved as a JSON file. It can be then loaded and executed.
- It is easy to create nodes: just extend `DflowNode` class, define its inputs and outputs and the `run()` function.
- Minimal internal type system: it is possible to connect an output of type `T` to an input of type `U`, if and only if `U` includes `T`.
- It is possible to define functions represented by nodes and edges.

**NOTA BENE**: it is supposed that you implement your own nodes, for example node `addition` could be implemented using bigint or some floating point library, according to your needs.
However an example nodes catalog with basic JavaScript features can be imported from `dflow/nodes`.

Graphic interface can be implemented with WebComponents (to be completed): ([demo here](https://fibo.github.io/dflow)).
It is implemented with [flow-view](https://github.com/fibo/flow-view) and **not included** in this package.

## Installation

### Node

With [npm](https://npmjs.org/) do

```sh
npm install dflow
```

### Deno

> Dflow lives in Deno land!

Module is published here: https://deno.land/x/dflow

Dflow engine is implemented in a single *dflow.ts* file, you can use an import like

```ts
import { DflowHost } from "https://deno.land/x/dflow@v0.38.0/dflow.ts";
```

#### Using an import map

Create an _import_map.json_ file like this.

```json
{
  "imports": {
    "dflow/": "https://deno.land/x/dflow/"
  }
}
```

Then you can import for example the following.

```typescript
import { DflowHost } from "dflow/dflow.ts";
import { nodesCatalog } from "dflow/examples/nodes/index.ts";

const dflow = new DflowHost({ nodesCatalog });

// ... load or create a graph

await dflow.run()
```

With [deno](https://deno.land/) you can then launch your script like this

```sh
deno run --importmap=import_map.json path/to/my/script.ts
```

You may want to point to a specific version, for instance version `0.38` or whatever.
Then change your import map accordingly

```diff
{
  "imports": {
-    "dflow/": "https://deno.land/x/dflow/"
+    "dflow/": "https://deno.land/x/dflow@0.38/"
  }
}
```

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

You can run the following code with any of the following:

- launching command
  `deno run https://raw.githubusercontent.com/fibo/dflow/main/examples/usage.js`
- cloning this repo and launching `npm run example:usage`.

You should see a number `1` printed on output.

```javascript
import { DflowHost } from "dflow";
import { nodesCatalog } from "dflow/nodes";

function rungraph() {
  // use builtin nodes
  const dflow = new DflowHost({ nodesCatalog });
  const catalog = dflow.nodesCatalog;

  // create nodes
  const numNode = dflow.newNode({
    kind: catalog.data.kind,
    // set numNode output to π / 2
    outputs: [{ data: Math.PI / 2 }],
  });
  const sinNode = dflow.newNode({
    kind: catalog.mathSin.kind,
  });
  const consoleLogNode = dflow.newNode({
    kind: catalog.consoleLog.kind,
  });

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

