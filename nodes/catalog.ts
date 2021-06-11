import { catalog as dataTypesCatalog } from "./data-types.ts";
import { catalog as mathCatalog } from "./math.ts";

export const catalog = {
  ...dataTypesCatalog,
  ...mathCatalog,
};
