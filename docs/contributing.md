---
title: Contributing
---

# Contributing

Thank you very much if you want to contribute to *dflow*: every feedback is welcome!

## Specification

If you want to propose enhancements in the specification, edit [specification.md](https://github.com/fibo/dflow/blob/master/docs/specification.md).
The design goals are:

* Keep it as simple as possible.
* The implementation should be easy to port to other languages.
* The graph must fit in a plain JSON.

You may also improve the [CLI](https://github.com/fibo/dflow/blob/master/docs/cli.md).

## Development workflow

Just fork the repo on GitHub, clone it, install deps and create a new branch as usual.
It is something like

```
git clone git@github.com/roccosiffredi/dflow.git
cd dflow
npm install
git checkout -b mycontribution
```

Then add your contribution, commit, push your branch and send a pull request.
Note that, thanks to [pre-commit](https://www.npmjs.com/package/pre-commit), `npm test` and `npm run lint` run before each commit.

## Project deploy

Two commit bits are needed to publish a new version:

* npm
* GitHub repository

Once you are added as a collaborator on the sites above,
when you launch [npm-version](https://docs.npmjs.com/cli/version) *npm scripts* will do the dirty work, i.e.

1. Publish on npm
2. Push on GitHub and update the GitHub Pages

