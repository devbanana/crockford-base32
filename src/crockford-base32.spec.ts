import { CrockfordBase32 } from './crockford-base32';
import { Buffer } from 'buffer';

describe('Base32Encoder', () => {
  describe('when encoding', () => {
    it('can encode a multiple of 5 bits', () => {
      // noinspection SpellCheckingInspection
      expect(
        CrockfordBase32.encode(Buffer.from([0xa6, 0xe5, 0x63, 0x34, 0x5f])),
      ).toBe('MVJP6D2Z');
    });

    it('can encode a single byte', () => {
      expect(CrockfordBase32.encode(Buffer.from([0x74]))).toBe('3M');
    });

    it('can encode a large number', () => {
      expect(
        CrockfordBase32.encode(Buffer.from('593f8759e8431f5f', 'hex')),
      ).toBe('5JFW7B7M467TZ');
    });

    it('does not strip off leading zeros', () => {
      expect(CrockfordBase32.encode(Buffer.from([0, 0, 0xa9]))).toBe('00059');
    });

    it('can convert a number', () => {
      expect(CrockfordBase32.encode(388_864)).toBe('BVR0');
    });

    it('can encode a UUID into base 32', () => {
      expect(
        CrockfordBase32.encode(
          Buffer.from('017cb3b93bcb40b6147d7813c5ad2339', 'hex'),
        ),
      ).toBe('01FJSVJEYB82V18ZBR2F2TT8SS');
    });
  });

  describe('when decoding', () => {
    it('can decode a multiple of 5 bits', () => {
      expect(CrockfordBase32.decode('MVJP6D2Z').toString('hex')).toBe(
        'a6e563345f',
      );
    });

    it('can decode a single byte', () => {
      expect(CrockfordBase32.decode('3M').toString()).toBe('t');
    });

    it('can decode a large number', () => {
      expect(CrockfordBase32.decode('5JFW7B7M467TZ').toString('hex')).toBe(
        '593f8759e8431f5f',
      );
    });

    it('keeps leading zeros when decoding', () => {
      expect(CrockfordBase32.decode('00059').toString('hex')).toBe('0000a9');
    });

    it('pads to the next byte', () => {
      expect(CrockfordBase32.decode('M3kV').toString('hex')).toBe('0a0e7b');
    });

    it.each`
      inputChar | translatedChar | input    | output
      ${'I'}    | ${'1'}         | ${'AIm'} | ${'2834'}
      ${'i'}    | ${'1'}         | ${'Aim'} | ${'2834'}
      ${'L'}    | ${'1'}         | ${'ALm'} | ${'2834'}
      ${'l'}    | ${'1'}         | ${'Alm'} | ${'2834'}
      ${'O'}    | ${'0'}         | ${'AOm'} | ${'2814'}
      ${'o'}    | ${'0'}         | ${'Aom'} | ${'2814'}
    `(
      'translates $inputChar to $translatedChar when decoding',
      ({ input, output }: { input: string; output: string }) => {
        expect(CrockfordBase32.decode(input).toString('hex')).toBe(output);
      },
    );

    it('can decode a ULID', () => {
      expect(
        CrockfordBase32.decode('01FJSVJEYB82V18ZBR2F2TT8SS').toString('hex'),
      ).toBe('017cb3b93bcb40b6147d7813c5ad2339');
    });
  });
});
