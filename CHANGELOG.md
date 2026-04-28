# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- `checksum` option on `encode()` and `decode()` for appending and
  validating Crockford's optional check symbol. The check symbol is one
  character (`value mod 37`) appended to the encoded string. Defaults to
  `false`; passing `{ variant: 'ulid', checksum: true }` is rejected at
  both the type level and runtime since ULID has no checksum concept.
- `verify(input: string)` static method for non-throwing checksum
  validation — returns `true`/`false` instead of throwing.
- Exported `InvalidChecksumCharacterError` and `InvalidChecksumError`
  classes for `instanceof` discrimination of `decode()` checksum failures.

### Fixed

- `encode()` now rejects unsafe `number` inputs (above
  `Number.MAX_SAFE_INTEGER`, fractional, `NaN`, or `Infinity`) with a
  clear error instead of silently encoding a float-rounded value. Pass a
  `bigint` for values larger than `Number.MAX_SAFE_INTEGER`.

## [2.1.0] - 2026-04-25

### Added

- `variant` option on `encode()` and `decode()` for selecting the encoding
  algorithm. The default `crockford` variant is unchanged. The new `ulid`
  variant uses the ULID-compatible modulo-style algorithm, restoring the
  encoding/decoding behaviour expected by ULID consumers that broke in 2.0.0.

### Changed

- `decode()`'s `asNumber: false` option is now optional, so passing only
  `{ variant: 'ulid' }` type-checks without also specifying `asNumber`.

### Fixed

- `decode()` no longer drops a trailing all-zero partial byte, so
  non-canonical inputs like `'0'` and `'000'` decode without losing a byte.

## [2.0.0]: 2023-07-24

### Fixed

- Read and encode input from leftmost bits first per [the spec](https://www.crockford.com/base32.html)

### Removed

- Removed `stripLeadingZeros` option

## [1.1.0] - 2021-10-27

### Added

- Ability to strip leading zeros from encoded value
- Ability to strip leading zeros from decoded value
- Ability to decode to a `bigint` instead of `string`
- `encode()` now accepts a `bigint` in addition to `Buffer` or `number`
- Ignore hyphens when decoding

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

[Unreleased]: https://github.com/devbanana/crockford-base32/compare/2.1.0...HEAD
[2.1.0]: https://github.com/devbanana/crockford-base32/compare/2.0.0...2.1.0
[2.0.0]: https://github.com/devbanana/crockford-base32/compare/1.1.0...2.0.0
[1.1.0]: https://github.com/devbanana/crockford-base32/compare/1.0.1...1.1.0
[1.0.1]: https://github.com/devbanana/crockford-base32/compare/1.0.0...1.0.1
[1.0.0]: https://github.com/devbanana/crockford-base32/releases/tag/1.0.0
