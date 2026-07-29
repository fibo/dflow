# dflow development

## Requirements

By design, _Dflow_ has no dependencies.

However, it has few development dependencies you need to build it or to contribute to it.
If you just want to build to run examples and already have recent `typescript` installed globally, you can skip this step.

With [npm](https://www.npmjs.com/) install the following packages **without saving**:

```sh
npm install typescript @types/node --no-save
```

## Build

To build everything, once done with requirements above, just run:

```sh
npm run build
```

It will:

- Generate `dflow.js`.
- Emit TypeScript declarations in `dflow.d.ts`.
- Inject snippets in documentation files.

## Examples

Once built following instructions above, you can run examples via an npm script:

| Command                              | Source file                                                       |
| ------------------------------------ | ----------------------------------------------------------------- |
| `npm run example:hello_world`        | [hello_world.ts](../docs/examples/hello_world.ts)                 |
| `npm run example:usage`              | [usage.ts](../docs/examples/usage.ts)                             |
| `npm run example:async_nodes`        | [async_nodes.ts](../docs/examples/async_nodes.ts)                 |
| `npm run example:dynamic_math_nodes` | [dynamic_math_nodes.ts](../docs/examples/dynamic_math_nodes.ts)   |
| `npm run example:context`            | [context.ts](../docs/examples/context.ts)                         |
