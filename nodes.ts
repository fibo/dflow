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
import { catalog as stringatalog } from "./nodes/string.ts";

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
  ...stringatalog,
};
