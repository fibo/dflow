# dflow

> is a minimal [Dataflow programming][dataflow-wikipedia] engine

## Features

- Implemented in TypeScript, available both on Node and Deno.
- Expressive API.
- Easily create nodes, just extending `DflowNode` class.
- Example nodes catalog with basic JavaScript features. **NOTA BENE**: it is
  supposed that you implement your own nodes, for example node `addition` could
  be implemented using bigint or some floating point library, according to your
  needs.
- Minimal internal type system. It is possible to connect an output of type `T`
  only to an input of type `U`, if and only if `U` includes `T`.
- Graphic interface implemented with WebComponents.
  ([demo here](https://fibo.github.io/dflow)) (to be completed).

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
import { DflowHost } from "dflow/dflow.ts";
import { nodesCatalog } from "dflow/nodes/index.ts";

const dflow = new DflowHost({ nodesCatalog });
```

With [deno](https://deno.land/) you can then launch your script like this

```bash
deno run --importmap=import_map.json path/to/my/script.ts
```

It is recommended to point to a specific version, for instance to point to
version `0.36` or whatever, then change your import map accordingly

```diff
{
  "imports": {
-    "dflow/": "https://unpkg.com/dflow/"
+    "dflow/": "https://unpkg.com/dflow@0.36/"
  }
}
```

## Usage

This is a trivial sample graph that will run `sin(π / 2) = 1` computation.

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
- cloning this repo and launching `node examples/usage.js`.

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
  await dflow.run();
}

rungraph();
```

## License

[MIT](https://fibo.github.io/mit-license)

[dataflow-wikipedia]: http://en.wikipedia.org/wiki/Dataflow_programming "Dataflow programming"
