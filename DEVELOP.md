# dflow development

This project has a *GitHub Codespace* available.

Otherwise to develop locally, install [Deno](https://deno.land/).

## Deno tasks

Format files as usual: `deno fmt`.
Lint files as usual: `deno lint`.
Run tests with: `deno task test`.

## npm scripts

`npm run fmt`, `npm run lint` and `npm test` are wrappers of their corresponding *deno tasks*.

See also *example* scripts listed [here](https://github.com/fibo/dflow/blob/main/examples/README.md).

## Build

With [npm] install the following packages globally

```bash
npm install esbuild typescript -g
```

Build package with: `npm run build`.

[npm]: https://www.npmjs.com/ "npm"
