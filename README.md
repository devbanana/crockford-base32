# crockford-base32

An implementation of Douglas Crockford's [Base 32 encoding algorithm](https://www.crockford.com/base32.html).

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

## Variants

The default `crockford` variant follows Douglas Crockford's Base 32
algorithm. It treats binary input as a bit stream, reading from left to right
and padding remaining bits on the right.

The `ulid` variant uses ULID-compatible modulo-style encoding and decoding. It
treats the input as one integer, extracts base 32 digits with division and
remainder, and pads on the left. The [ULID spec][ulid-spec] only fixes the
alphabet; the modulo algorithm comes from the reference implementation's
[`encodeTime`][ulid-encode] function. For background on the two valid Base 32
interpretations ([RFC 4648][rfc-4648] vs. modulo), see [this
discussion][ulid-discussion].

[ulid-spec]: https://github.com/ulid/spec
[ulid-encode]: https://github.com/ulid/javascript/blob/master/lib/index.ts
[ulid-discussion]: https://github.com/ulid/spec/issues/73#issuecomment-1247445322
[rfc-4648]: https://www.rfc-editor.org/rfc/rfc4648

```javascript
const { CrockfordBase32 } = require('crockford-base32');

CrockfordBase32.encode(Buffer.from([0xff])); // ZW
CrockfordBase32.encode(Buffer.from([0xff]), { variant: 'ulid' }); // 7Z

CrockfordBase32.decode('01FZD39998855SS2YG4XP4T14P', {
  variant: 'ulid',
}).toString('hex'); // 017fda34a528414b9c8bd0276c4d0496

CrockfordBase32.decode('7Z', {
  variant: 'ulid',
  asNumber: true,
}); // 255n
```

The `ulid` variant only selects the ULID-compatible encoding algorithm. It does
not validate that input is a valid ULID, require 16-byte buffers or
26-character strings, generate ULIDs, validate timestamps, or enforce ULID
overflow rules.

Empty binary input and numeric zero both encode to the empty string, since
neither has any bits to encode:

```javascript
CrockfordBase32.encode(Buffer.from([]), { variant: 'ulid' }); // ""
CrockfordBase32.decode('', { variant: 'ulid' }).length; // 0
CrockfordBase32.encode(0, { variant: 'ulid' }); // ""
```

### Migrating from 1.x

Version 2.0.0 changed the encoding algorithm to read from the leftmost bit per
the Crockford spec. If you were using this library to decode ULIDs and saw
different output after upgrading, pass `{ variant: 'ulid' }` to restore the
previous behaviour for ULID-encoded data.

## Checksums

Crockford's [check symbol](https://www.crockford.com/base32.html) is an
optional single character appended to an encoded string to detect
transcription errors. It is computed as `value mod 37` — one of 37
characters: the 32-symbol Base 32 alphabet plus `*`, `~`, `$`, `=`, and `U`
for values 32–36.

Opt in via `{ checksum: true }`:

```javascript
const { CrockfordBase32 } = require('crockford-base32');

CrockfordBase32.encode(Buffer.from([0xff]), { checksum: true }); // ZW~
CrockfordBase32.encode(255n, { checksum: true }); // ZW~

CrockfordBase32.decode('ZW~', { checksum: true }).toString('hex'); // ff
CrockfordBase32.decode('ZW~', { checksum: true, asNumber: true }); // 255n
```

The same hyphen, case, and `I`/`L`/`O` normalization that applies to
unchecksummed input also applies to checksummed input, including the
trailing check symbol:

```javascript
CrockfordBase32.decode('ehjq6x-0v', { checksum: true }).toString(); // test

// L and O at the check position are auto-corrected to 1 and 0
CrockfordBase32.decode('1c8pal', { checksum: true, asNumber: true }); // 725349n
CrockfordBase32.decode('1fa84o', { checksum: true, asNumber: true }); // 775298n
```

When validation fails, `decode()` throws one of two exported error classes:

```javascript
const {
  CrockfordBase32,
  InvalidChecksumCharacterError,
  InvalidChecksumError,
} = require('crockford-base32');

try {
  CrockfordBase32.decode('ZW!', { checksum: true });
} catch (err) {
  err instanceof InvalidChecksumCharacterError; // true — '!' is not a valid check character
}

try {
  CrockfordBase32.decode('ZW0', { checksum: true });
} catch (err) {
  err instanceof InvalidChecksumError; // true — '0' is valid but does not match
}
```

For a yes/no check without try/catch, use `verify()`:

```javascript
CrockfordBase32.verify('ZW~'); // true
CrockfordBase32.verify('ZW0'); // false (mismatched checksum)
CrockfordBase32.verify('ZW!'); // false (invalid check character)
CrockfordBase32.verify(''); // false (empty input)
```

Checksums apply only to the default `crockford` variant. Passing
`{ variant: 'ulid', checksum: true }` is rejected at both the type level
and runtime — ULID's canonical form has no check symbol concept.
