# dflow development

## Requirements

Install [Deno](https://deno.land/).

With [npm](https://www.npmjs.com/) install the following packages globally

```bash
npm install esbuild typescript -g
```

## scripts

- Run tests: `npm run test` ...ehm or, you know, just `npm t`
- Format code: `npm run fmt`
- Lint code: `npm run lint`
- Build package: `npm run build`. It will
  1. Create bundle: `npm run bundle`
  2. Generate types: `npm run generate_types`
