#!/usr/bin/env bun
import * as readline from 'readline';
import { stdin, stdout, stderr, exit, argv } from 'process';
import { parseCSV } from './parsers/csv';
import { parsePRN } from './parsers/prn';
import { Row } from './constants';
import { toJSON, toHTML } from './formatters';

function main() {
  const [, , inputFormat, outputFormat] = argv;
  if (
    !inputFormat ||
    !outputFormat ||
    !['csv', 'prn'].includes(inputFormat) ||
    !['json', 'html'].includes(outputFormat)
  ) {
    stderr.write('Usage: your-solution <csv|prn> <json|html>\n');
    exit(1);
  }
  let input = '';
  stdin.setEncoding('latin1');
  const rl = readline.createInterface({ input: stdin, terminal: false });
  rl.on('line', (line: string) => {
    input += line + '\n';
  });
  rl.on('close', () => {
    let data: Row[] = [];
    if (inputFormat === 'csv') {
      data = parseCSV(input);
    } else if (inputFormat === 'prn') {
      data = parsePRN(input);
    } else {
      stderr.write(`Unsupported input format: ${inputFormat}\n`);
      exit(1);
    }
    if (outputFormat === 'json') {
      stdout.write(toJSON(data));
    } else {
      stdout.write(toHTML(data));
    }
  });
}

main();
