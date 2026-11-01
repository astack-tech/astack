import { Component } from '@astack-tech/core';
import type { Port } from '@astack-tech/core';

/**
 * Options for `TextSplitter`.
 */
export interface TextSplitterConfig {
  /** Maximum chunk length in characters (Unicode code points). Defaults to 1000. */
  chunkSize?: number | undefined;
  /**
   * Characters shared by consecutive chunks. Must be smaller than `chunkSize`.
   * Defaults to 200, capped at one fifth of `chunkSize`.
   */
  overlap?: number | undefined;
  /**
   * Segment separator. Defaults to blank lines (`/\n\s*\n/`).
   * Pass `''` or `null` to split by characters only.
   */
  separator?: string | RegExp | null | undefined;
}

const DEFAULT_CHUNK_SIZE = 1000;
const DEFAULT_OVERLAP = 200;
const DEFAULT_SEPARATOR = /\n\s*\n/;
const PARAGRAPH_JOINER = '\n\n';

/**
 * Splits long text into chunks for further processing.
 *
 * Ports:
 * - input `text`: the text to split.
 * - output `out`: the array of chunks.
 *
 * With a separator, whole segments are packed into chunks, and trailing segments that fit in
 * `overlap` are repeated at the start of the next chunk. Segments longer than `chunkSize` are
 * split by characters. Every chunk is at most `chunkSize` code points long.
 */
class TextSplitter extends Component {
  private readonly chunkSize: number;
  private readonly overlap: number;
  private readonly separator: string | RegExp | null;

  /**
   * @throws RangeError when `chunkSize` is not a positive integer or `overlap` is not in
   * `[0, chunkSize)`.
   */
  constructor(config: TextSplitterConfig = {}) {
    super({});

    const chunkSize = config.chunkSize ?? DEFAULT_CHUNK_SIZE;
    const overlap = config.overlap ?? Math.min(DEFAULT_OVERLAP, Math.floor(chunkSize / 5));

    if (!Number.isInteger(chunkSize) || chunkSize <= 0) {
      throw new RangeError(`chunkSize must be a positive integer, received ${String(chunkSize)}.`);
    }
    if (!Number.isInteger(overlap) || overlap < 0 || overlap >= chunkSize) {
      throw new RangeError(
        `overlap must be an integer in [0, chunkSize), received ${String(overlap)}.`
      );
    }

    this.chunkSize = chunkSize;
    this.overlap = overlap;
    this.separator = config.separator === undefined ? DEFAULT_SEPARATOR : config.separator;

    Component.Port.I('text').attach(this);
  }

  /**
   * Splits `text` into chunks.
   */
  splitText(text: string): string[] {
    if (text.length === 0) {
      return [];
    }
    if (codePointLength(text) <= this.chunkSize) {
      return [text];
    }
    if (this.separator === null || this.separator === '') {
      return this.splitByCharacters(text);
    }
    return this.splitBySegments(text, this.separator);
  }

  /**
   * Splits input in standalone mode. Non-string input is converted with `String()`.
   */
  override run(input: unknown): string[] {
    return this.splitText(typeof input === 'string' ? input : String(input));
  }

  /**
   * Reads text from the `text` port and sends chunks to the `out` port.
   */
  override _transform($i: Port, $o: Port): void {
    $i('text').receive((input: unknown) => {
      $o('out').send(this.run(input));
    });
  }

  private splitByCharacters(text: string): string[] {
    const characters = Array.from(text);
    const step = this.chunkSize - this.overlap;
    const chunks: string[] = [];

    for (let start = 0; start < characters.length; start += step) {
      chunks.push(characters.slice(start, start + this.chunkSize).join(''));
      if (start + this.chunkSize >= characters.length) {
        break;
      }
    }
    return chunks;
  }

  private splitBySegments(text: string, separator: string | RegExp): string[] {
    const joiner = typeof separator === 'string' ? separator : PARAGRAPH_JOINER;
    const joinerLength = codePointLength(joiner);
    const chunks: string[] = [];
    let current: string[] = [];
    let currentLength = 0;

    const lengthWith = (segmentLength: number): number =>
      current.length === 0 ? segmentLength : currentLength + joinerLength + segmentLength;

    const flush = (): void => {
      chunks.push(current.join(joiner));
      const carried: string[] = [];
      let carriedLength = 0;
      for (let index = current.length - 1; index >= 0; index -= 1) {
        const segment = current[index] ?? '';
        const nextLength =
          carried.length === 0
            ? codePointLength(segment)
            : carriedLength + joinerLength + codePointLength(segment);
        if (nextLength > this.overlap) {
          break;
        }
        carried.unshift(segment);
        carriedLength = nextLength;
      }
      current = carried;
      currentLength = carriedLength;
    };

    const pieces = text
      .split(separator)
      .flatMap(segment =>
        codePointLength(segment) > this.chunkSize ? this.splitByCharacters(segment) : [segment]
      );

    for (const piece of pieces) {
      const pieceLength = codePointLength(piece);
      if (current.length > 0 && lengthWith(pieceLength) > this.chunkSize) {
        flush();
        // Drop carried overlap that would still push the chunk over the limit.
        while (current.length > 0 && lengthWith(pieceLength) > this.chunkSize) {
          const removed = current.shift() ?? '';
          currentLength =
            current.length === 0 ? 0 : currentLength - codePointLength(removed) - joinerLength;
        }
      }
      currentLength = lengthWith(pieceLength);
      current.push(piece);
    }

    if (current.length > 0) {
      chunks.push(current.join(joiner));
    }
    return chunks;
  }
}

function codePointLength(value: string): number {
  let length = 0;
  for (const _character of value) {
    length += 1;
  }
  return length;
}

export default TextSplitter;
