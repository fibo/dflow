# dflow

> is a minimal [Dataflow programming][dataflow-wikipedia] engine

## Usage

This is a trivial sample graph that will run `sin(π / 2) = 1` computation. You
can run the following code, cloning this repo and launching
`node examples/usage.js`.

```js
import { DflowHost, nodesCatalog as coreNodes } from "dflow";

async function runGraph() {
  // Use builtin nodes.
  const dflow = new DflowHost(coreNodes);

  // Create two nodes.
  const numNode = dflow.newNode({
    kind: coreNodes.num.kind,
  });
  const sinNode = dflow.newNode({
    kind: coreNodes.mathSin.kind,
  });

  // Set numNode output to π / 2.
  const num = numNode.getOutputByPosition(0);
  num.setData(Math.PI / 2);

  // Connect numNode to sinNode.
  dflow.connect(numNode).to(sinNode);

  // Run graph.
  await dflow.graph.run();

  // Get sinNode output.
  const sin = sinNode.getOutputByPosition(0);
  console.log(sin.getData()); // 1 = sin(π / 2)
}

runGraph();
```

## License

[MIT](http://g14n.info/mit-license)

[dataflow-wikipedia]: http://en.wikipedia.org/wiki/Dataflow_programming "Dataflow programming"
