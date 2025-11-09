# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

This is a TypeScript implementation of Douglas Crockford's Base 32 encoding algorithm (https://www.crockford.com/base32.html). The library provides encoding and decoding capabilities for Buffers, numbers, and bigints.

## Development Commands

### Build
```bash
npm run build
```
Compiles TypeScript to JavaScript in the `lib/` directory using the TypeScript compiler.

### Testing
```bash
npm test                # Run all tests
npm run test:cov        # Run tests with coverage report
```

The project uses Jest with ts-jest preset. Coverage thresholds are set to 100% for branches, functions, lines, and statements.

To run a single test file:
```bash
npx jest src/index.spec.ts
```

To run a specific test by name:
```bash
npx jest -t "test name pattern"
```

### Linting and Formatting
```bash
npm run lint            # Run ESLint with auto-fix
npm run format          # Format code with Prettier
```

ESLint is configured with TypeScript-specific rules and Prettier integration. The parser uses `tsconfig.eslint.json` for type-aware linting.

## Code Architecture

### Single-Class Design
The entire implementation is contained in a single static class `CrockfordBase32` in `src/index.ts`. This class exports two main public methods:

- `encode(input: Buffer | number | bigint): string` - Encodes input to Base32 string
- `decode(input: string, options?: { asNumber: boolean }): Buffer | bigint` - Decodes Base32 string to Buffer or bigint

### Algorithm Details

**Encoding**: Processes input as a stream of bits, reading 5 bits at a time and mapping to the 32-character alphabet (`0123456789ABCDEFGHJKMNPQRSTVWXYZ`). Note that the alphabet excludes I, L, O, and U to avoid confusion.

**Decoding**: Reverses the encoding process with built-in error correction:
- Converts input to uppercase
- Translates `I` and `L` to `1`
- Translates `O` to `0`
- Removes hyphens (allows formatted input like `EDQPTS-90EDT7-4TBECW`)

### Private Helper Methods
- `createBuffer(input: number | bigint): Buffer` - Converts numbers/bigints to Buffer for encoding
- `asNumber(output: number[]): bigint` - Converts byte array to bigint for numeric decoding
- `asBuffer(output: number[]): Buffer` - Converts byte array to Buffer for buffer decoding

### TypeScript Configuration
- Targets Node 14 (extends `@tsconfig/node14`)
- Strict mode enabled
- Generates declaration files for type definitions
- Output directory: `./lib`

## Important Implementation Notes

1. **Bit Order**: The implementation processes bits from left to right (most significant first), following the Crockford specification. This was corrected in v2.0.0.

2. **Leading Zeros**: The encoder preserves leading zeros in the output (e.g., `Buffer.from([0, 0, 0xa9])` encodes to `000AJ`). The `stripLeadingZeros` option was removed in v2.0.0.

3. **Type Overloads**: The `decode` method uses TypeScript overloads to provide proper type inference based on the `asNumber` option.

4. **Buffer Immutability**: The encode method creates a copy of input Buffers to avoid modifying the original.
