import { assertEquals } from "std/assert/mod.ts";
import { Dflow, DflowId } from "dflow";
import { catalog as mathCatalog } from "./math.ts";
import { catalog as operatorCatalog } from "./operator.ts";

Deno.test("DflowNodeFunction", () => {
  const nodesCatalog = { ...mathCatalog, ...operatorCatalog };
  const dflow = new Dflow({ nodesCatalog });
  const catalog = dflow.nodesCatalog;
  const nodeKind = catalog.function.kind;

  const numNode = dflow.newNode({ kind: catalog.mathPI.kind });
  const additionNode = dflow.newNode({ kind: catalog.addition.kind });
  const returnNode = dflow.newNode({ kind: catalog.return.kind });
  const testNode = dflow.newNode({ kind: nodeKind });

  dflow.connect(testNode).to(returnNode);
  dflow.connect(additionNode).to(returnNode, 1);
  dflow.connect(numNode).to(additionNode, 0);
  dflow.connect(numNode).to(additionNode, 1);

  dflow.run();

  assertEquals(testNode.output(0).data as DflowId, testNode.id);
});
