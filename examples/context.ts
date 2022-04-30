/*
Create a host with an API context.
*/
import { DflowHost, DflowNode } from "../dflow.ts";

const { output } = DflowNode;

class ApiClient {
  apiKey: string;

  static isApiClient(client: unknown): client is ApiClient {
    return client instanceof ApiClient;
  }

  constructor(apiKey: ApiClient["apiKey"]) {
    this.apiKey = apiKey;
  }

  async fetchSomeData(): Promise<string> {
    return await Promise.resolve("foo");
  }
}

class CustomNode extends DflowNode {
  static kind = "Custom";
  static isAsync = true;
  static outputs = [output("string")];

  async run() {
    const apiClient = this.host.context.apiClient;

    if (ApiClient.isApiClient(apiClient)) {
      this.output(0).data = await apiClient.fetchSomeData();
    }
  }
}

const nodesCatalog = {
  [CustomNode.kind]: CustomNode,
};

async function contextExample() {
  const dflow = new DflowHost(nodesCatalog);
  dflow.verbose = true;

  const apiKey = "s3cret";
  const apiClient = new ApiClient(apiKey);
  dflow.context.apiClient = apiClient;

  dflow.newNode({ kind: CustomNode.kind });

  await dflow.run();

  console.log(JSON.stringify(dflow.executionReport, null, 2));
}

contextExample();
