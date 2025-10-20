# dflow development

## Requirements

With [npm](https://www.npmjs.com/) install the following packages **without saving**:

```sh
npm install esbuild prettier typescript @types/node --no-save
```

## Contributing

If you want to push code to GitHub repo, please install the commit hook

```sh
npm run install_precommit_hook
```

See also _example_ scripts listed [here](./examples/README.md).

## Running tests

Just launch `npm test`.

To run a TypeScript file you can do something like this:

```sh
node --env-file .typescript.env ./examples/doc-snippets/helloWorld.ts
```

## Build

Once done with [Requirements](#requirements) to build the project, just run:

```sh
npm run build
```

It will generate dflow.js which is a minified bundle and dflow.d.ts (TypeScript definitions) in the package root folder.
