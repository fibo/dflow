# dflow

> is a minimal [Dataflow programming][dataflow-wikipedia] engine

## Features

- Implemented in TypeScript, available both on Node and on Deno.
- Expressive API.
- Graphic interface implemented with WebComponents (cooming on late 2021)
- Core nodes catalog with basic JavaScript features (to be completed)
- Supports custom nodes, just extending `DflowNode` class or even simpler with
  `DflowNodeUnary`.
- Can create reusable functions just connecting nodes.

## Installation

### Node

With [npm](https://npmjs.org/) do

```bash
npm install dflow
```

### Deno

Create an _import_map.json_ file like this.

```json
{
  "imports": {
    "dflow/": "https://unpkg.com/dflow/"
  }
}
```

Then you can import for example the following.

```typescript
import { DflowHost } from "dflow/engine.ts";
import { catalog as coreNodes } from "dflow/nodes/catalog.ts";

const dflow = new DflowHost(coreNodes);
```

With [deno](https://deno.land/) you can then launch your script like this

```bash
deno run --importmap=import_map.json path/to/my/script.ts
```

It is recommended to point to a specific version, for instance to point to
version `0.26` or whatever, then change your import map accordingly

```diff
{
  "imports": {
-    "dflow/": "https://unpkg.com/dflow/"
+    "dflow/": "https://unpkg.com/dflow@0.26/"
  }
}
```

## Usage

This is a trivial sample graph that will run `sin(π / 2) = 1` computation.

```
--------------
        number = π / 2
        --------------
        |
        |
        -------
        mathSin
        -------
        |
        |
       ---
      | 1 |
       ---
```

You can run the following code with any of the following:

- launching command
  `deno run https://raw.githubusercontent.com/fibo/dflow/main/examples/usage.js`
- cloning this repo and launching `node examples/usage.js`.

You should see a number `1` printed on output.

```js
import { DflowHost, nodesCatalog as coreNodes } from "dflow";

function runGraph() {
  // Use builtin nodes.
  const dflow = new DflowHost(coreNodes);

  // Create two nodes.
  const numNode = dflow.newNode({
    kind: "number",
  });
  const sinNode = dflow.newNode({
    // To raise errors at compile time when using TypeScript,
    // you can get the node kind from the catalog like this.
    kind: coreNodes.mathSin.kind,
  });

  // Set numNode output to π / 2.
  const num = numNode.output(0);
  num.data = Math.PI / 2;

  // Connect numNode to sinNode.
  dflow.connect(numNode).to(sinNode);

  // Run graph.
  dflow.run();

  // Get sinNode output.
  const sin = sinNode.output(0);
  console.log(sin.data); // 1 = sin(π / 2)
}

runGraph();
```

## License

[MIT](http://g14n.info/mit-license)

[dataflow-wikipedia]: http://en.wikipedia.org/wiki/Dataflow_programming "Dataflow programming"
