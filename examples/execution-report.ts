import { DflowHost } from "../dflow.ts";
import { nodesCatalog } from "../nodes.ts";

function rungraph() {
  const dflow = new DflowHost(nodesCatalog);
  const catalog = dflow.nodesCatalog;

  const mapNode = dflow.newNode({ kind: catalog.arrayMap.kind });
  const dataNode = dflow.newNode({ kind: catalog.array.kind });
  const argumentPositionNode = dflow.newNode({ kind: catalog.number.kind });
  const typeNumNode = dflow.newNode({ kind: catalog.typeNumber.kind });
  const argumentNode1 = dflow.newNode({ kind: catalog.argument.kind });
  const argumentNode2 = dflow.newNode({ kind: catalog.argument.kind });
  const additionNode = dflow.newNode({ kind: catalog.addition.kind });
  const returnNode = dflow.newNode({ kind: catalog.return.kind });
  const functionNode = dflow.newNode({ kind: catalog.function.kind });

  dataNode.output(0).data = [1, 2, 3, 4];

  // first argument
  dflow.connect(typeNumNode).to(argumentNode1);
  dflow.connect(argumentNode1).to(additionNode, 0);

  // second argument
  argumentPositionNode.output(0).data = 1;
  dflow.connect(typeNumNode).to(argumentNode2, 0);
  dflow.connect(argumentPositionNode).to(argumentNode2, 1);
  dflow.connect(argumentNode2).to(additionNode, 1);

  dflow.connect(functionNode).to(returnNode);
  dflow.connect(additionNode).to(returnNode, 1);
  dflow.connect(dataNode).to(mapNode);
  dflow.connect(functionNode).to(mapNode, 1);

  dflow.verbose = true;
  dflow.run();

  console.log(JSON.stringify(dflow.executionReport, null, 2));
}

rungraph();
