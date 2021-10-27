import { CrockfordBase32 } from './index';
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

    it('can encode a number', () => {
      expect(CrockfordBase32.encode(388_864)).toBe('BVR0');
    });

    it('can encode a bigint', () => {
      expect(
        CrockfordBase32.encode(10_336_657_440_695_546_835_250_649_691n),
      ).toBe('8B691DAR2GC0Q2466JV');
    });

    it('cannot take a negative number', () => {
      expect(() => CrockfordBase32.encode(-323213)).toThrowError(
        'Input cannot be a negative number',
      );
    });

    it('cannot take a negative bigint', () => {
      expect(() => CrockfordBase32.encode(-21233n)).toThrowError(
        'Input cannot be a negative number',
      );
    });

    it('can encode a UUID into base 32', () => {
      // noinspection SpellCheckingInspection
      expect(
        CrockfordBase32.encode(
          Buffer.from('017cb3b93bcb40b6147d7813c5ad2339', 'hex'),
        ),
      ).toBe('01FJSVJEYB82V18ZBR2F2TT8SS');
    });

    it("doesn't modify the input buffer", () => {
      const buffer = Buffer.from('test');
      // noinspection SpellCheckingInspection
      expect(CrockfordBase32.encode(buffer)).toBe('1T6AWVM');
      expect(buffer.toString()).toBe('test');
    });

    it('can strip leading zeros', () => {
      expect(
        CrockfordBase32.encode(Buffer.from('0000a9', 'hex'), {
          stripLeadingZeros: true,
        }),
      ).toBe('59');
    });
  });

  describe('when decoding', () => {
    it('can decode a multiple of 5 bits', () => {
      // noinspection SpellCheckingInspection
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
      // noinspection SpellCheckingInspection
      expect(
        CrockfordBase32.decode('01FJSVJEYB82V18ZBR2F2TT8SS').toString('hex'),
      ).toBe('017cb3b93bcb40b6147d7813c5ad2339');
    });

    it('can strip leading zeros', () => {
      expect(
        CrockfordBase32.decode('00059', { stripLeadingZeros: true }).toString(
          'hex',
        ),
      ).toBe('a9');
    });

    it('can return a number', () => {
      expect(CrockfordBase32.decode('G3T', { asNumber: true })).toBe(16_506n);
    });

    it('rejects any invalid base 32 character', () => {
      expect(() => CrockfordBase32.decode('T&ZQ')).toThrowError(
        'Invalid base 32 character found in string: &',
      );
    });

    it('ignores hyphens', () => {
      // noinspection SpellCheckingInspection
      expect(CrockfordBase32.decode('3KDXPP-A83KEH-S6JVK7').toString()).toBe(
        'some string',
      );
    });

    it('ignores multiple adjacent hyphens', () => {
      // noinspection SpellCheckingInspection
      expect(CrockfordBase32.decode('3KDXPP--A83KEH---S6JVK7').toString()).toBe(
        'some string',
      );
    });
  });
});
