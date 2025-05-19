import { FIELD_NAMES } from '../constants';

export function parseCSV(input: string): Row[] {
  const lines = input.split(/\r?\n/).filter(Boolean);
  return lines.slice(1).map((line: string) => {
    const values: string[] = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current);
    return Object.fromEntries(FIELD_NAMES.map((h, i) => [h, values[i]?.trim() ?? '']));
  });
}