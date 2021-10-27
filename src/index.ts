import { Buffer } from 'buffer';

// noinspection SpellCheckingInspection
const characters = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';

interface EncodeOptions {
  stripLeadingZeros?: boolean;
}

type DecodeAsNumberOptions = { asNumber: true } & EncodeOptions;
type DecodeAsBufferOptions = { asNumber?: false } & EncodeOptions;

/**
 * An implementation of the Crockford Base32 algorithm.
 *
 * Spec: https://www.crockford.com/base32.html
 */
export class CrockfordBase32 {
  static encode(input: Buffer | number, options?: EncodeOptions): string {
    let stripZeros = options?.stripLeadingZeros || false;
    if (typeof input === 'number') {
      input = this.createBuffer(input);
      stripZeros = true;
    } else {
      // Copy the input buffer so it isn't modified when we call `reverse()`
      input = Buffer.from(input);
    }

    const output = [];
    // Work from the end of the buffer
    input.reverse();

    let bitsRead = 0;
    let buffer = 0;
    for (const byte of input) {
      // Add current byte to start of buffer
      buffer |= byte << bitsRead;
      bitsRead += 8;
      while (bitsRead >= 5) {
        output.unshift(buffer & 0x1f);
        buffer >>>= 5;
        bitsRead -= 5;
      }
    }

    if (bitsRead > 0) {
      output.unshift(buffer & 0x1f);
    }

    let dataFound = false;
    return output
      .filter(byte =>
        stripZeros && !dataFound && byte === 0 ? false : (dataFound = true),
      )
      .map(byte => characters.charAt(byte))
      .join('');
  }

  static decode(input: string, options: DecodeAsNumberOptions): bigint;
  static decode(input: string, options?: DecodeAsBufferOptions): Buffer;
  static decode(
    input: string,
    options?: DecodeAsNumberOptions | DecodeAsBufferOptions,
  ): bigint | Buffer {
    // Translate input to all uppercase
    input = input.toUpperCase();
    // Translate I, L, and O to valid base 32 characters
    input = input.replace(/O/g, '0').replace(/[IL]/g, '1');
    // Work from the end
    input = input.split('').reverse().join('');

    const output: number[] = [];
    let bitsRead = 0;
    let buffer = 0;

    for (const character of input) {
      const byte = characters.indexOf(character);
      if (byte === -1) {
        throw new Error(
          `Invalid base 32 character found in string: ${character}`,
        );
      }

      buffer |= byte << bitsRead;
      bitsRead += 5;

      while (bitsRead >= 8) {
        output.unshift(buffer & 0xff);
        buffer >>>= 8;
        bitsRead -= 8;
      }
    }

    if (bitsRead >= 5 || buffer > 0) {
      output.unshift(buffer & 0xff);
    }

    if (options?.stripLeadingZeros === true) {
      while (output[0] === 0) output.shift();
    }

    if (options?.asNumber === true) {
      return this.asNumber(output);
    }

    return this.asBuffer(output);
  }

  private static createBuffer(input: number): Buffer {
    const bytes = [];

    while (input > 0) {
      bytes.unshift(input & 0xff);
      input >>>= 8;
    }

    return Buffer.from(bytes);
  }

  private static asNumber(output: number[]): bigint {
    let outputNumber = 0n;

    output.forEach(byte => {
      outputNumber <<= 8n;
      outputNumber |= BigInt(byte);
    });

    return outputNumber;
  }

  private static asBuffer(output: number[]): Buffer {
    return Buffer.from(
      output.map(byte => byte.toString(16).padStart(2, '0')).join(''),
      'hex',
    );
  }
}