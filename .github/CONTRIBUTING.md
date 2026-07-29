# dflow development

## Requirements

By design, dflow has no dependencies.

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

