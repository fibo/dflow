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

## [Unreleased]

### TODO

- autosave and autorun (should be optional)
- preview div: it is positioned aside editor and has an id,
  when going in production, the id can be an argument and the
  editor can be replaced by the pure engine version.

## [v0.16.0] - 

### Fixed

- examples renderer

### Added

- Dynamic changelog.
- cli actions.
- arrow functions support.
- postcss.
- flow view integration.

[Unreleased]: https://github.com/fibo/{{ package.name }}/compare/v{{ package.version }}...HEAD
{% for tag in tags offset:2 %}
  {% assign current = tags[forloop.index0].name %}
  {% assign previous = tags[forloop.index].name %}
  [{{ current }}]: https://github.com/fibo/{{ package.name }}/compare/{{ previous }}...{{ current }}
{% endfor %}
