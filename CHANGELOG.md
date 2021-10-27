# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Ability to strip leading zeros from encoded value
- Ability to strip leading zeros from decoded value
- Ability to decode to a `bigint` instead of `string`
- `encode()` now accepts a `bigint` in addition to `Buffer` or `number`

### Fixed

- Copy input buffer so it is not modified

## [1.0.1] - 2021-10-25

### Added

- Created README

## [1.0.0] - 2021-10-24

### Added

- Ability to encode an input buffer to base 32
- Ability to encode a number to base 32
- Ability to decode a base 32 string to a buffer

[unreleased]: https://github.com/devbanana/crockford-base32/compare/1.0.1...HEAD
[1.0.1]: https://github.com/devbanana/crockford-base32/compare/1.0.0...1.0.1
[1.0.0]: https://github.com/devbanana/crockford-base32/releases/tag/1.0.0
