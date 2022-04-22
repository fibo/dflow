import { assertArrayIncludes, assertEquals } from "std/testing/asserts.ts";
import { DflowArray, DflowHost, DflowId, DflowNode } from "../dflow.ts";
import { nodesCatalog } from "../nodes.ts";

Deno.test("DflowNodeHost", () => {
  // Load a catalog with a single Dflow node.
  class CustomNode extends DflowNode {
    static kind = "customNode";
    static isConstant = true;
  }
  const nodeKind = CustomNode.kind;
  const singleNodeCatalog = { [nodeKind]: CustomNode };
  const dflow = new DflowHost(singleNodeCatalog);
  const catalog = dflow.nodesCatalog;

  const testNode = dflow.newNode({ kind: catalog.dflow.kind });
  dflow.run();
  assertArrayIncludes(testNode.output(0).data as DflowArray, [
    nodeKind,
  ]);
});

Deno.test("DflowNodeFunction", () => {
  const dflow = new DflowHost(nodesCatalog);
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
