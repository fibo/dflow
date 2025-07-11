import arrayNodes from "./array.ts";
import conditionalNodes from "./conditional.ts";
import consoleNodes from "./console.ts";
import dateNodes from "./date.ts";
import logicNodes from "./logic.ts";
import mathNodes from "./math.ts";
import numberNodes from "./number.ts";
import objectNodes from "./object.ts";
import operatorNodes from "./operator.ts";
import stringNodes from "./string.ts";

export const nodeDefinitions = [
  ...arrayNodes,
  ...conditionalNodes,
  ...consoleNodes,
  ...dateNodes,
  ...logicNodes,
  ...mathNodes,
  ...numberNodes,
  ...objectNodes,
  ...operatorNodes,
  ...stringNodes
];
