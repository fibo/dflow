import { assertEquals } from "std/testing/asserts.ts";

import { DflowHost, DflowPin } from "../dflow.ts";
import { catalog, MathSin } from "./math.ts";

Deno.test("Math.sin", () => {
  const dflow = new DflowHost(catalog);
  const node = dflow.newNode({ id: "test", kind: MathSin.kind });
  const output = node.getOutputByPosition(0) as DflowPin;
  node.run();
  assertEquals(output.getData(), Math.sin(1));
});
