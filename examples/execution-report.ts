import { DflowHost } from "../dflow.ts";
import { nodesCatalog } from "./nodes/index.ts";

function rungraph() {
  const dflow = new DflowHost({ nodesCatalog });
  const catalog = dflow.nodesCatalog;

  const numNode = dflow.newNode({ kind: catalog.mathPI.kind });
  const additionNode = dflow.newNode({ kind: catalog.addition.kind });
  const returnNode = dflow.newNode({ kind: catalog.return.kind });
  const functionNode = dflow.newNode({ kind: catalog.function.kind });

  dflow.connect(functionNode).to(returnNode);
  dflow.connect(additionNode).to(returnNode, 1);
  dflow.connect(numNode).to(additionNode, 0);
  dflow.connect(numNode).to(additionNode, 1);

  dflow.run();

  console.log(JSON.stringify(dflow.executionReport, null, 2));
}

rungraph();
