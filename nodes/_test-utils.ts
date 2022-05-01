import { assertEquals } from "std/testing/asserts.ts";
import { DflowData, DflowHost } from "../dflow.ts";
import { nodesCatalog } from "./index.ts";

export const newDflowHost = () => new DflowHost({ nodesCatalog });

export function testOneOut<Output1>(
  dflow: DflowHost,
  nodeKind: string,
  output: Output1,
) {
  const testNode = dflow.newNode({ kind: nodeKind });
  dflow.run();
  assertEquals(testNode.output(0).data, output);
}

export function testOneInOneOut<Input1, Output1>(
  dflow: DflowHost,
  nodeKind: string,
  input?: Input1,
  output?: Output1,
) {
  const catalog = dflow.nodesCatalog;
  const dataNode = dflow.newNode({
    kind: catalog.data.kind,
    outputs: [{ data: input }],
  });
  const testNode = dflow.newNode({ kind: nodeKind });
  dflow.connect(dataNode).to(testNode);
  dflow.run();
  assertEquals(testNode.output(0).data, output);
}

export function testOneInTwoOut<Input1, Output1, Output2>(
  dflow: DflowHost,
  nodeKind: string,
  input?: Input1,
  output1?: Output1,
  output2?: Output2,
) {
  const catalog = dflow.nodesCatalog;
  const dataNode = dflow.newNode({
    kind: catalog.data.kind,
    outputs: [{ data: input }],
  });
  const testNode = dflow.newNode({ kind: nodeKind });
  dflow.connect(dataNode).to(testNode);
  dflow.run();
  assertEquals(testNode.output(0).data, output1);
  assertEquals(testNode.output(1).data, output2);
}

// export function testOneNumAndOneMultiNumInOneNumOut(
//   dflow: DflowHost,
//   nodeKind: string,
//   input1?: number,
//   input2?: number[],
//   output?: number,
// ) {
//   const catalog = dflow.nodesCatalog;

//   const dataNode1 = dflow.newNode({
//     kind: catalog.data.kind,
//     outputs: [ data: input1 }],
//   });
//   const testNode = dflow.newNode({ kind: nodeKind });
//   dflow.connect(dataNode1).to(testNode, 0);

//   if (Array.isArray(input2)) {
//     const dataNodes = input2.map((input) => (
//       dflow.newNode({
//         kind: catalog.data.kind,
//         outputs: [{ types: ["number"], data: input }],
//       })
//     ));
//     dataNodes.forEach((dataNode, i) => (
//       dflow.connect(dataNode).to(testNode, i + 1)
//     ));
//   }

//   dflow.run();
//   assertEquals(testNode.output(0).data, output);
// }

export function testTwoInOneOut<Input1, Input2, Output1>(
  dflow: DflowHost,
  nodeKind: string,
  input1?: Input1,
  input2?: Input2,
  output?: Output1,
) {
  const catalog = dflow.nodesCatalog;
  const dataNode1 = DflowData.isDflowData(input1)
    ? dflow.newNode({
      kind: catalog.data.kind,
      outputs: [{ data: input1 }],
    })
    : undefined;
  const dataNode2 = DflowData.isDflowData(input2)
    ? dflow.newNode({
      kind: catalog.data.kind,
      outputs: [{ data: input2 }],
    })
    : undefined;
  const testNode = dflow.newNode({ kind: nodeKind });
  if (dataNode1) {
    dflow.connect(dataNode1).to(testNode, 0);
  }
  if (dataNode2) {
    dflow.connect(dataNode2).to(testNode, 1);
  }
  dflow.run();
  assertEquals(testNode.output(0).data, output);
}

export function testThreeInOneOut<Input1, Input2, Input3, Output1>(
  dflow: DflowHost,
  nodeKind: string,
  input1?: Input1,
  input2?: Input2,
  input3?: Input3,
  output?: Output1,
) {
  const catalog = dflow.nodesCatalog;
  const dataNode1 = DflowData.isDflowData(input1)
    ? dflow.newNode({
      kind: catalog.data.kind,
      outputs: [{ data: input1 }],
    })
    : undefined;
  const dataNode2 = DflowData.isDflowData(input2)
    ? dflow.newNode({
      kind: catalog.data.kind,
      outputs: [{ data: input2 }],
    })
    : undefined;
  const dataNode3 = DflowData.isDflowData(input3)
    ? dflow.newNode({
      kind: catalog.data.kind,
      outputs: [{ data: input3 }],
    })
    : undefined;
  const testNode = dflow.newNode({ kind: nodeKind });
  if (dataNode1) {
    dflow.connect(dataNode1).to(testNode, 0);
  }
  if (dataNode2) {
    dflow.connect(dataNode2).to(testNode, 1);
  }
  if (dataNode3) {
    dflow.connect(dataNode3).to(testNode, 2);
  }
  dflow.run();
  assertEquals(testNode.output(0).data, output);
}
