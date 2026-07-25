# Dflow

> A minimal [Dataflow programming](http://en.wikipedia.org/wiki/Dataflow_programming) engine

See:

- [Documentation](https://fibo.github.io/dflow)
- [Examples](https://github.com/fibo/dflow/tree/main/docs/examples)

## Hello World

You can run this "Hello World" by cloning [dflow repository](https://github.com/fibo/dflow) and launching

```sh
npm run example:hello_world
```

Basically it defines a single `DflowNode` that outputs "Hello, World!"
and creates a _dflow_ instance that run it.

<!-- START file:docs/examples/hello_world.ts -->

```ts
import { Dflow, type DflowNode } from "../../dflow.ts";

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

<!-- END snippet -->

## License

[MIT](http://fibo.github.io/mit-license)

