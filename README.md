## crockford-base32

An implementation of Douglas Crockford's Base 32 encoding algorithm.

### Installation

```bash
npm install --save crockford-base32
```

### Usage

```javascript
const { CrockfordBase32 } = require('crockford-base32');

CrockfordBase32.encode(Buffer.from('some string')); // 3KDXPPA83KEHS6JVK7
CrockfordBase32.decode('3KDXPPA83KEHS6JVK7').toString(); // some string
```
