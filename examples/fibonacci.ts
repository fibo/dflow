import { catalog, DflowHost } from "../dflow.ts";

const dflow = new DflowHost(catalog);

const commentNode = dflow.newNode({ kind: "comment" });
commentNode.output(0).data = "Implement fibonacci function";
const functionNode = dflow.newNode({ kind: "function", name: "fibonacci" });
const argumentNode = dflow.newNode({ kind: "argument" });
const typeNumberNode = dflow.newNode({ kind: "typeNumber" });
const numberNode = dflow.newNode({ kind: "number" });
numberNode.output(0).data = 1;
const greaterThanNode = dflow.newNode({ kind: "greaterThan" });
const subtractionNode = dflow.newNode({ kind: "subtraction" });
const ifNode = dflow.newNode({ kind: "if" });
const returnNode = dflow.newNode({ kind: "return" });
const functionCallNode = dflow.newNode({
  kind: "functionCall",
  name: "recursion",
});

// Implement fibonacci function
//
//                       ----------
//                       typeNumber
//                       ----------
//          --------      |
//          function      |
//          --------      |
//          |\            |       ----------
//          | \           |       number = 1
//          |  \          |       ----------
//          |   \         --------          |--------------------
//          |    \        argument          |              |     |
//          |     \       --------          |              |     |
//          |      \             |--------- | ---          |     |
//          |       \            |          |   |          |     |
//          |        \           |          |   |          |     |
//          |         \          -----------    |          |     |
//          |          \         greaterThan    |          |     |
//          |           \        -----------    |          |     |
//          |            \       |              |          |     |
//          |             \      |              |          |     |
//          |              \     |              |          |     |
//          |               \    |              ------------     |
//          |                \   |              subtraction      |
//          |                 \  |              ------------     |
//          |                  \_|_             |                |
//          |                    | \            |                |
//          |                    |   ------------                |
//          |                    |   functionCall                |
//          |                    |   ------------                |
//          |                    |              |                |
//          |                    |              |                |
//          |           -----------------------------------------
//          |           if       condition    then           else
//          |           -----------------------------------------
//          |         /
//          |        /
//          |       /
//          |      /
//          ------
//          return
//          ------
//

dflow.connect(typeNumberNode).to(argumentNode);
dflow.connect(argumentNode).to(greaterThanNode);
dflow.connect(numberNode).to(greaterThanNode);
dflow.connect(greaterThanNode).to(ifNode);
dflow.connect(functionNode).to(returnNode, 0);
dflow.connect(ifNode, 0).to(returnNode, 1);
dflow.connect(ifNode, 1).to(functionCallNode);
dflow.connect(argumentNode).to(subtractionNode, 0);
dflow.connect(numberNode).to(subtractionNode, 1);
dflow.connect(subtractionNode).to(functionCallNode);

dflow.run();
