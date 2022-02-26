# thaw-lexical-analyzer
A Node.js lexical analyzer (scanner) that tokenizes text input for a parser. Written in TypeScript.

Obligatory BadgeFest:

[![apple][apple-badge-image]][apple-url]
[![atom][atom-badge-image]][atom-url]
[![circleci][circleci-badge-image]][circleci-url]
[![codeclimate][codeclimate-badge-image]][codeclimate-url]
[![git][git-badge-image]][git-url]
[![github][github-badge-image]][github-url]
[![npm][npm-badge-image]][npm-url]
[![packagephobia][packagephobia-badge-image]][packagephobia-url]
[![terminal][terminal-badge-image]][terminal-url]
[![typescript][typescript-badge-image]][typescript-url]

[![status][status-badge-image]][status-url]
[![build status][build-status-badge-image]][build-status-url]
[![npm version][npm-version-badge-image]][npm-version-url]
[![latest tag][latest-tag-badge-image]][latest-tag-url]
[![npm total downloads][npm-total-downloads-badge-image]][npm-total-downloads-url]
[![watchers][watchers-badge-image]][watchers-url]
[![stars][stars-badge-image]][stars-url]
[![issues][issues-badge-image]][issues-url]
[![forks][forks-badge-image]][forks-url]
[![contributors][contributors-badge-image]][contributors-url]
[![branches][branches-badge-image]][branches-url]
[![releases][releases-badge-image]][releases-url]
[![commits][commits-badge-image]][commits-url]
[![last commit][last-commit-badge-image]][last-commit-url]
[![types][types-badge-image]][types-url]
[![install size][install-size-badge-image]][install-size-url]
[![known vulnerabilities][known-vulnerabilities-badge-image]][known-vulnerabilities-url]
[![lines of code][lines-of-code-badge-image]][lines-of-code-url]
[![technical debt][technical-debt-badge-image]][technical-debt-url]
[![maintainability][maintainability-badge-image]][maintainability-url]
[![test coverage][test-coverage-badge-image]][test-coverage-url]
[![tested with jest][jest-badge-image]][jest-url]
[![code style: prettier][prettier-badge-image]][prettier-url]
[![license][license-badge-image]][license-url]

## Features

- Self-contained: No run-time package dependencies!

## License
[MIT](https://choosealicense.com/licenses/mit/)

[apple-badge-image]: https://badgen.net/badge/icon/apple?icon=apple&label
[apple-url]: https://www.apple.com
[atom-badge-image]: https://badgen.net/badge/icon/atom?icon=atom&label
[atom-url]: https://atom.io
[circleci-badge-image]: https://badgen.net/badge/icon/circleci?icon=circleci&label
[circleci-url]: https://circleci.com
[codeclimate-badge-image]: https://badgen.net/badge/icon/codeclimate?icon=codeclimate&label
[codeclimate-url]: https://codeclimate.com
[git-badge-image]: https://badgen.net/badge/icon/git?icon=git&label
[git-url]: https://git-scm.com
[github-badge-image]: https://badgen.net/badge/icon/github?icon=github&label
[github-url]: https://github.com
[npm-badge-image]: https://badgen.net/badge/icon/npm?icon=npm&label
[npm-url]: https://npmjs.com
[packagephobia-badge-image]: https://badgen.net/badge/icon/packagephobia?icon=packagephobia&label
[packagephobia-url]: https://packagephobia.com/
[terminal-badge-image]: https://badgen.net/badge/icon/terminal?icon=terminal&label
[terminal-url]: https://en.wikipedia.org/wiki/History_of_Unix
[typescript-badge-image]: https://badgen.net/badge/icon/typescript?icon=typescript&label
[typescript-url]: https://www.typescriptlang.org

[status-badge-image]: https://badgen.net/github/status/tom-weatherhead/thaw-lexical-analyzer
[status-url]: https://badgen.net/github/status/tom-weatherhead/thaw-lexical-analyzer
[build-status-badge-image]: https://circleci.com/gh/tom-weatherhead/thaw-lexical-analyzer.svg?style=shield
[build-status-url]: https://circleci.com/gh/tom-weatherhead/thaw-lexical-analyzer
[npm-version-badge-image]: https://img.shields.io/npm/v/thaw-lexical-analyzer.svg
[npm-version-url]: https://www.npmjs.com/package/thaw-lexical-analyzer
[latest-tag-badge-image]: https://badgen.net/github/tag/tom-weatherhead/thaw-lexical-analyzer
[latest-tag-url]: https://github.com/tom-weatherhead/thaw-lexical-analyzer/tags
[npm-total-downloads-badge-image]: https://img.shields.io/npm/dt/thaw-lexical-analyzer.svg
[npm-total-downloads-url]: https://www.npmjs.com/package/thaw-lexical-analyzer
[watchers-badge-image]: https://badgen.net/github/watchers/tom-weatherhead/thaw-lexical-analyzer
[watchers-url]: https://github.com/tom-weatherhead/thaw-lexical-analyzer/watchers
[stars-badge-image]: https://badgen.net/github/stars/tom-weatherhead/thaw-lexical-analyzer
[stars-url]: https://github.com/tom-weatherhead/thaw-lexical-analyzer/stargazers
[issues-badge-image]: https://badgen.net/github/issues/tom-weatherhead/thaw-lexical-analyzer
[issues-url]: https://github.com/tom-weatherhead/thaw-lexical-analyzer/issues
[forks-badge-image]: https://badgen.net/github/forks/tom-weatherhead/thaw-lexical-analyzer
[forks-url]: https://github.com/tom-weatherhead/thaw-lexical-analyzer/network/members
[contributors-badge-image]: https://badgen.net/github/contributors/tom-weatherhead/thaw-lexical-analyzer
[contributors-url]: https://github.com/tom-weatherhead/thaw-lexical-analyzer/graphs/contributors
[branches-badge-image]: https://badgen.net/github/branches/tom-weatherhead/thaw-lexical-analyzer
[branches-url]: https://github.com/tom-weatherhead/thaw-lexical-analyzer/branches
[releases-badge-image]: https://badgen.net/github/releases/tom-weatherhead/thaw-lexical-analyzer
[releases-url]: https://github.com/tom-weatherhead/thaw-lexical-analyzer/releases
[commits-badge-image]: https://badgen.net/github/commits/tom-weatherhead/thaw-lexical-analyzer
[commits-url]: https://github.com/tom-weatherhead/thaw-lexical-analyzer/commits/master
[last-commit-badge-image]: https://badgen.net/github/last-commit/tom-weatherhead/thaw-lexical-analyzer
[last-commit-url]: https://github.com/tom-weatherhead/thaw-lexical-analyzer
[types-badge-image]: https://badgen.net/npm/types/thaw-lexical-analyzer
[types-url]: https://badgen.net/npm/types/thaw-lexical-analyzer
[install-size-badge-image]: https://badgen.net/packagephobia/install/thaw-lexical-analyzer
[install-size-url]: https://badgen.net/packagephobia/install/thaw-lexical-analyzer
[known-vulnerabilities-badge-image]: https://snyk.io/test/github/tom-weatherhead/thaw-lexical-analyzer/badge.svg?targetFile=package.json&package-lock.json
[known-vulnerabilities-url]: https://snyk.io/test/github/tom-weatherhead/thaw-lexical-analyzer?targetFile=package.json&package-lock.json
[lines-of-code-badge-image]: https://badgen.net/codeclimate/loc/tom-weatherhead/thaw-lexical-analyzer
[lines-of-code-url]: https://badgen.net/codeclimate/loc/tom-weatherhead/thaw-lexical-analyzer
[technical-debt-badge-image]: https://badgen.net/codeclimate/tech-debt/tom-weatherhead/thaw-lexical-analyzer
[technical-debt-url]: https://badgen.net/codeclimate/tech-debt/tom-weatherhead/thaw-lexical-analyzer
[maintainability-badge-image]: https://api.codeclimate.com/v1/badges/f0820146b165945ee5db/maintainability
[maintainability-url]: https://codeclimate.com/github/tom-weatherhead/thaw-lexical-analyzer/maintainability
[test-coverage-badge-image]: https://api.codeclimate.com/v1/badges/f0820146b165945ee5db/test_coverage
[test-coverage-url]: https://codeclimate.com/github/tom-weatherhead/thaw-lexical-analyzer/test_coverage
[jest-badge-image]: https://img.shields.io/badge/tested_with-jest-99424f.svg
[jest-url]: https://github.com/facebook/jest
[prettier-badge-image]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
[prettier-url]: https://github.com/prettier/prettier
[license-badge-image]: https://img.shields.io/github/license/mashape/apistatus.svg
[license-url]: https://github.com/tom-weatherhead/thaw-lexical-analyzer/blob/master/LICENSE
