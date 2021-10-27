# crockford-base32

An implementation of Douglas Crockford's Base 32 encoding algorithm.

## Installation

```bash
npm install --save crockford-base32
```

## Usage

```javascript
const { CrockfordBase32 } = require('crockford-base32');

CrockfordBase32.encode(Buffer.from('some string')); // 3KDXPPA83KEHS6JVK7
CrockfordBase32.decode('3KDXPPA83KEHS6JVK7').toString(); // some string
```

## Encoding Options

You can pass options to the `encode()` method to change how it performs the encoding:

| Option            | Type    | Description                                          |
| ----------------- | ------- | ---------------------------------------------------- |
| stripLeadingZeros | boolean | Returns the encoded string without any leading zeros |

### Example

```javascript
CrockfordBase32.encode(Buffer.from('\x00test')); // 01T6AWVM
CrockfordBase32.encode(Buffer.from('\x00test'), { stripLeadingZeros: true }); // 1T6AWVM
```

## Decoding Options

You can also pass options to `decode()` as follows:

| Option            | Type    | Description                                                                         |
| ----------------- | ------- | ----------------------------------------------------------------------------------- |
| stripLeadingZeros | boolean | Strips all zeros from the decoded string.                                           |
| asNumber          | boolean | `true` to return the decoded output as a `bigint`, `false` to return as a `Buffer`. |

##### Example

```javascript
CrockfordBase32.decode('01T6AWVM').toString(); // \x00test
CrockfordBase32.decode('01T6AWVM', { stripLeadingZeros: true }).toString(); // test

CrockfordBase32.decode('CSCW'); // <Buffer 06 65 9c>
CrockfordBase32.decode('CSCW', { asNumber: true }); // 419228n
```
