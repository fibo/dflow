import { Dflow } from "../dflow.ts";
import { nodesCatalog } from "./nodes/index.ts";

function rungraph() {
  const dflow = new Dflow(nodesCatalog);
  const catalog = dflow.nodesCatalog;

  const numNode = dflow.newNode({ kind: catalog.mathPI.kind });
  const additionNode = dflow.newNode({ kind: catalog.addition.kind });

  dflow.connect(numNode).to(additionNode, 0);
  dflow.connect(numNode).to(additionNode, 1);

  dflow.run();

  console.log(JSON.stringify(dflow.executionReport, null, 2));
}

rungraph();
