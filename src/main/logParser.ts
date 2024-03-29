import { LogEntry } from '../model/LogEntry';

const lineDefinition: LineDefinition = [
  { start: 15, end: 26 },
  { start: 108, end: 114 },
  { start: 122, end: 130 },
  { start: 133, end: 141 },
  { start: 144, end: 152 },
  { start: 42, end: 48 },
  { start: 48, end: 54 },
];
function splitLines(data: string) {
  return data.split('\n').filter((l) => l.length > 0);
}
export function parseLog(data: string) {
  const [, header, body] = data.split('@');
  const headerLines = splitLines(header ?? '');
  console.log(headerLines);
  if (headerLines.length !== 4) {
    throw new Error('The header has the wrong format');
  }

  const result: LogEntry = {
    status: headerLines[0],
    model: headerLines[2].substring(headerLines[2].indexOf(':') + 1),
    date: headerLines[3].substring(headerLines[3].indexOf(':') + 1),
    lines: [],
  };

  const bodyLines = splitLines(body);
  const parser = new LineSplitter(bodyLines, lineDefinition);

  while (parser.hasNext()) {
    const [id, code, valueA, valueB, valueC, testPointA, testPointB] =
      parser.parseNext();
    result.lines.push({
      code,
      id,
      valueA,
      valueB,
      valueC,
      testPointA,
      testPointB,
    });
  }
  return result;
}

export class LineSplitter {
  private lines: string[];
  private definition: LineDefinition;
  private ix: number = 0;
  constructor(lines: string[], definition: LineDefinition) {
    this.lines = lines;
    this.definition = definition;
  }

  get currentLine() {
    return this.lines[this.ix];
  }

  hasNext() {
    return this.ix < this.lines.length;
  }

  parseNext() {
    return parseLine(this.lines[this.ix++], this.definition);
  }
}

export function parseLine(line: string, definition: LineDefinition) {
  const result: string[] = [];
  definition.forEach(({ start, end }) => {
    const substr = line.substring(start, end);
    console.log(`"${substr}"`);
    result.push(substr.trim());
  });
  return result;
}

// an array of [start, width, offset]
export type LineDefinition = SegmentDefinition[];

export interface SegmentDefinition {
  start: number;
  end: number;
}
