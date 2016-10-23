---
title: Change Log
permalink: /changelog
---

{% assign package = site.data.package %}
{% assign tags = site.data.tags %}

# Change Log

All notable changes to this project will be documented in this file.

<sub>This project adheres to [Semantic Versioning](http://semver.org/).
Changelog format adheres to [Keep a Changelog](http://keepachangelog.com/)</sub>

## TODO

### Added

- Download link

### Fixed

- Duplicated pipe error.
- Launch editor server after a new graph is created.
- Added d3 example to the example page.
- Examples renderer now uses dflow components.
- Can open graph if given path is absolute.
- Added examples: sum, hello world.
- Minified style.css

## [Unreleased]

### Added

- Invalid nodes feedback.
- Numbers and Infinity has no input.

## [v0.16.1] - 2016-10-09

### Fixed

- Updated to latest express.
- Removed unnecessary dev deps in dependencies attribute.

### Added

- Styling files for preview and console divs.

## [v0.16.0] - 2016-10-08

### Fixed

- examples renderer

### Added

- Autorun client side.
- Dynamic changelog.
- cli actions.
- arrow functions support.
- postcss.
- flow view integration.
- Custom nodes: toggle.
- Load and save graph.
- Autorun graph.

[Unreleased]: https://github.com/fibo/{{ package.name }}/compare/v{{ package.version }}...HEAD
{% for tag in tags offset:2 %}
  {% assign current = tags[forloop.index0].name %}
  {% assign previous = tags[forloop.index].name %}
  [{{ current }}]: https://github.com/fibo/{{ package.name }}/compare/{{ previous }}...{{ current }}
{% endfor %}
