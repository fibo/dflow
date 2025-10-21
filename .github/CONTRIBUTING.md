# dflow development

## Requirements

By design, dflow has no dependencies.

However, it has few development dependencies you need to build it or to contribute to it.
If you just want to build to run examples and already have recent `esbuild` and `typescript` installed globally, you can skip this step.

With [npm](https://www.npmjs.com/) install the following packages **without saving**:

```sh
npm install esbuild prettier typescript @types/node --no-save
```

## Build

To build everything, once done with requirements above, just run:

```sh
npm run build
```

It will:

- generate dflow.js which is a minified bundle
- emit TypeScript declarations in dflow.d.ts
- inject snippets in documentation files

## Commit hook

If you want to push code to GitHub repo, please install the commit hook

```sh
npm run install_precommit_hook
```
