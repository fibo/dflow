# Dflow

> A minimal [Dataflow programming](http://en.wikipedia.org/wiki/Dataflow_programming) engine

See:

- [Documentation](https://fibo.github.io/dflow)
- [Examples](https://github.com/fibo/dflow/tree/main/docs/examples)

## Usage

Let's start with an "Hello World!".

Define a single `DflowNode` that outputs to the console and create a _dflow_ instance that runs it.

<!-- START snippet {"file":"docs/examples/hello_world.ts","surround":"```ts"} -->
```ts
import { Dflow, type DflowNode } from "dflow";

// Define a node.
const helloWorld: DflowNode = {
  kind: "hello",
  run: () => console.log("Hello, World!")
};

const nodeDefinitions = [helloWorld];

// Create a dflow instance.
const dflow = new Dflow(nodeDefinitions);

// Add a node to the graph.
dflow.node("hello");

// Run the dflow graph.
dflow.run();
```
<!-- END snippet {"surround":"```"} -->

> [!IMPORTANT]
> The recommended way to run a graph is with `await`, wrapped in a try/catch block.

```ts
try {
  await dflow.run();
} catch (error) {
  // Here `error` should be an instance of `AggregateError`.
}
```

More examples available in the documentation, see [the "Usage" section](https://fibo.github.io/dflow/#usage).

## License

[MIT](http://fibo.github.io/mit-license)