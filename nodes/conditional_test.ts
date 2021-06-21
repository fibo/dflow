import { assertEquals } from "std/testing/asserts.ts";

import { DflowHost, DflowValue } from "../engine.ts";
import { catalog } from "./catalog.ts";

export function testConditionalIf(
  input1: boolean,
  input2: DflowValue,
  input3: DflowValue,
  expected: DflowValue,
) {
  const dflow = new DflowHost(catalog);
  // Create nodes and assign data.
  const dataNode1 = dflow.newNode({ kind: catalog.boolean.kind });
  dataNode1.getOutputByPosition(0).data = input1;
  const dataNode2 = dflow.newNode({ kind: catalog.data.kind });
  dataNode2.getOutputByPosition(0).data = input2;
  const dataNode3 = dflow.newNode({ kind: catalog.data.kind });
  dataNode3.getOutputByPosition(0).data = input3;
  const testNode = dflow.newNode({ kind: catalog.if.kind });
  // Connect nodes.
  dflow.connect(dataNode1).to(testNode, 0);
  dflow.connect(dataNode2).to(testNode, 1);
  dflow.connect(dataNode3).to(testNode, 2);
  dflow.run();
  assertEquals(testNode.getOutputByPosition(0).data, expected);
}

Deno.test(catalog.if.kind, () => {
  [{ condition: true, data: [1, 2, 1] }].forEach(
    ({ condition, data: [thenData, elseData, expected] }) => {
      testConditionalIf(condition, thenData, elseData, expected);
    },
  );
});
