

# Requirements

[dflow class diagram](http://goo.gl/Jm9DyS)

## make

Install make, and add it to your `PATH`.
If you are on Windows, install [Make for Windows](http://gnuwin32.sourceforge.net/packages/make.htm).

## jshint

Install jshint globally

```bash
npm install jshint -g
```

## mocha

Install mocha globally

```bash
npm install mocha -g
```

# Tests

Run tests

```bash
make test
```

Lint code

```bash
make lint
```

# Documentation

## Run docs server

```bash
cd docs
docpad run
```

## Generate docs

```bash
make docs
```

## Deploy on GitHub pages

```bash
make site
```

