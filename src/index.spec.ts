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
      expect(CrockfordBase32.encode(Buffer.from([0x74]))).toBe('EG');
    });

    it('can encode two bytes', () => {
      expect(CrockfordBase32.encode(Buffer.from([0x74, 0x74]))).toBe('EHT0');
    });

    it('can encode a large number', () => {
      expect(
        CrockfordBase32.encode(Buffer.from('593f8759e8431f5f', 'hex')),
      ).toBe('B4ZREPF88CFNY');
    });

    it('does not strip off leading zeros', () => {
      expect(CrockfordBase32.encode(Buffer.from([0, 0, 0xa9]))).toBe('000AJ');
    });

    it('can encode a number', () => {
      expect(CrockfordBase32.encode(388_864)).toBe('0QQG0');
    });

    it('can encode a bigint', () => {
      expect(
        CrockfordBase32.encode(10_336_657_440_695_546_835_250_649_691n),
      ).toBe('45K4GPNC1860BH2339DG');
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
      ).toBe('05YB7E9VSD0BC53XF09WBB9374');
    });

    it("doesn't modify the input buffer", () => {
      const buffer = Buffer.from('test');
      // noinspection SpellCheckingInspection
      expect(CrockfordBase32.encode(buffer)).toBe('EHJQ6X0');
      expect(buffer.toString()).toBe('test');
    });

    it('can strip leading zeros', () => {
      expect(
        CrockfordBase32.encode(Buffer.from('0000a9', 'hex'), {
          stripLeadingZeros: true,
        }),
      ).toBe('AJ');
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
      expect(CrockfordBase32.decode('EG').toString()).toBe('t');
    });

    it('can decode two bytes', () => {
      expect(CrockfordBase32.decode('EHT0').toString()).toBe('tt');
    });

    it('can decode a large number', () => {
      expect(CrockfordBase32.decode('B4ZREPF88CFNY').toString('hex')).toBe(
        '593f8759e8431f5f',
      );
    });

    it('keeps leading zeros when decoding', () => {
      expect(CrockfordBase32.decode('000AJ').toString('hex')).toBe('0000a9');
    });

    it.each`
      inputChar | translatedChar | input     | output
      ${'I'}    | ${'1'}         | ${'AIm0'} | ${'5068'}
      ${'i'}    | ${'1'}         | ${'Aim0'} | ${'5068'}
      ${'L'}    | ${'1'}         | ${'ALm0'} | ${'5068'}
      ${'l'}    | ${'1'}         | ${'Alm0'} | ${'5068'}
      ${'O'}    | ${'0'}         | ${'AOM0'} | ${'5028'}
      ${'o'}    | ${'0'}         | ${'AoM0'} | ${'5028'}
    `(
      'translates $inputChar to $translatedChar when decoding',
      ({ input, output }: { input: string; output: string }) => {
        expect(CrockfordBase32.decode(input).toString('hex')).toBe(output);
      },
    );

    it('can decode a ULID', () => {
      // noinspection SpellCheckingInspection
      expect(
        CrockfordBase32.decode('05YB7E9VSD0BC53XF09WBB9374').toString('hex'),
      ).toBe('017cb3b93bcb40b6147d7813c5ad2339');
    });

    it('can strip leading zeros', () => {
      expect(
        CrockfordBase32.decode('000AJ', { stripLeadingZeros: true }).toString(
          'hex',
        ),
      ).toBe('a9');
    });

    it('does not add up to a complete byte', () => {
      expect(CrockfordBase32.decode('A1M').toString('hex')).toBe('5068');
    });

    it('can return a number', () => {
      expect(CrockfordBase32.decode('81X0', { asNumber: true })).toBe(16_506n);
    });

    it('rejects any invalid base 32 character', () => {
      expect(() => CrockfordBase32.decode('T&ZQ')).toThrowError(
        'Invalid base 32 character found in string: &',
      );
    });

    it('ignores hyphens', () => {
      // noinspection SpellCheckingInspection
      expect(CrockfordBase32.decode('EDQPTS-90EDT7-4TBECW').toString()).toBe(
        'some string',
      );
    });

    it('ignores multiple adjacent hyphens', () => {
      // noinspection SpellCheckingInspection
      expect(CrockfordBase32.decode('EDQPTS--90EDT7---4TBECW').toString()).toBe(
        'some string',
      );
    });
  });
});
