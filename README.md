# dflow

> is a minimal [Dataflow programming][dataflow-wikipedia] engine

## Features

- Implemented in TypeScript, available both on Node and on Deno.
- Expressive API.
- Graphic interface implemented with WebComponents
  ([demo here](https://fibo.github.io/dflow)).
- Core nodes catalog with basic JavaScript features (to be completed).
- Supports custom nodes, just extending `DflowNode` class.

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
// file examples/usage.js
import { catalog as corenodes, dflowhost } from "../dflow.js";

function rungraph() {
  // use builtin nodes
  const dflow = new dflowhost(corenodes);

  // create nodes
  const numnode = dflow.newnode({
    kind: "number",
  });
  const sinnode = dflow.newnode({
    kind: corenodes.mathsin.kind,
  });
  const consolelognode = dflow.newnode({
    kind: corenodes.consolelog.kind,
  });

  // set numnode output to π / 2
  numnode.output(0).data = math.pi / 2;

  // connect numnode to sinnode and sinnode to consolelog
  dflow.connect(numnode).to(sinnode);
  dflow.connect(sinnode).to(consolelognode);

  // run graph
  dflow.run();
}

rungraph();
```

## License

[MIT](http://g14n.info/mit-license)

[dataflow-wikipedia]: http://en.wikipedia.org/wiki/Dataflow_programming "Dataflow programming"
