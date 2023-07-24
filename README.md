# crockford-base32

An implementation of Douglas Crockford's Base 32 encoding algorithm.

## Installation

```bash
npm install --save crockford-base32
```

## Usage

```javascript
const { CrockfordBase32 } = require('crockford-base32');

CrockfordBase32.encode(Buffer.from('some string')); // EDQPTS90EDT74TBECW
CrockfordBase32.decode('EDQPTS90EDT74TBECW').toString(); // some string

// It will ignore hyphens
CrockfordBase32.decode('EDQPTS-90EDT7-4TBECW').toString(); // some string

// It will convert the letters I and L to 1, and O to 0
CrockfordBase32.decode('1P10E').toString('hex'); // 0d8207
CrockfordBase32.decode('IPLOE').toString('hex'); // 0d8207
CrockfordBase32.decode('iploe').toString('hex'); // 0d8207

// Encode and decode a number
CrockfordBase32.encode(822354); // 1J654
CrockfordBase32.decode('1J654', { asNumber: true }); // 822354n

// Or a bigint
CrockfordBase32.encode(275_789_480_204_545_813_933_268_697_807_617_179_845n); // SXXHYC0JSN77K601AW3K31P0RM
CrockfordBase32.decode('SXXHYC0JSN77K601AW3K31P0RM', { asNumber: true }); // 275789480204545813933268697807617179845n
```
