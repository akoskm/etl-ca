#!/usr/bin/env bun
import * as readline from 'readline';
import { stdin, stdout, stderr, exit, argv } from 'process';
import { parseCSV } from './parsers/csv';
import { FIELD_NAMES } from './constants';
function toJSON(data: Row[]): string {
  return JSON.stringify(data, null, 2);
}

function escapeHTML(str: string): string {
  return str.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c] || c));
}

function toHTML(data: Row[]): string {
  if (data.length === 0) return '<table></table>';
  const headers = FIELD_NAMES;
  const thead = `<thead><tr>${headers.map(h => `<th>${escapeHTML(h)}</th>`).join('')}</tr></thead>`;
  const tbody = `<tbody>${data.map(row => `<tr>${headers.map(h => `<td>${escapeHTML(row[h] ?? '')}</td>`).join('')}</tr>`).join('')}</tbody>`;
  return `<table>${thead}${tbody}</table>`;
}

function main() {
  const [,, inputFormat, outputFormat] = argv;
  if (!inputFormat || !outputFormat || !['csv','prn'].includes(inputFormat) || !['json','html'].includes(outputFormat)) {
    stderr.write('Usage: your-solution <csv|prn> <json|html>\n');
    exit(1);
  }
  let input = '';
  const rl = readline.createInterface({ input: stdin, terminal: false });
  rl.on('line', (line: string) => { input += line + '\n'; });
  rl.on('close', () => {
    let data: Row[] = [];
    if (inputFormat === 'csv') {
      data = parseCSV(input);
    } else {
      throw new Error('PRN input is not supported yet');
    }
    if (outputFormat === 'json') {
      stdout.write(toJSON(data));
    } else {
      stdout.write(toHTML(data));
    }
  });
}

main();
