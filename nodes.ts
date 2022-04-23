import type { DflowNodesCatalog } from "./dflow.ts";
import { catalog as arrayCatalog } from "./nodes/array.ts";
import { catalog as conditionalCatalog } from "./nodes/conditional.ts";
import { catalog as consoleCatalog } from "./nodes/console.ts";
import { catalog as dateCatalog } from "./nodes/date.ts";
import { catalog as logicCatalog } from "./nodes/logic.ts";
import { catalog as mathCatalog } from "./nodes/math.ts";
import { catalog as numberCatalog } from "./nodes/number.ts";
import { catalog as objectCatalog } from "./nodes/object.ts";
import { catalog as operatorCatalog } from "./nodes/operator.ts";
// TODO DflowNode implementation class should be exported
import * as stringNodes from "./nodes/string.ts";

const stringCatalog = Object.values(stringNodes).reduce(
  (catalog, NodeClass) => ({ [NodeClass.kind]: NodeClass, ...catalog }),
  {},
);

export const nodesCatalog: DflowNodesCatalog = {
  ...arrayCatalog,
  ...conditionalCatalog,
  ...consoleCatalog,
  ...dateCatalog,
  ...logicCatalog,
  ...mathCatalog,
  ...numberCatalog,
  ...objectCatalog,
  ...operatorCatalog,
  ...stringCatalog,
};
