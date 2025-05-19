import { FIELD_NAMES, Row } from '../constants';

// Define column widths based on Workbook2.prn
// Name: 16, Address: 22, Postcode: 9, Phone: 14, Credit Limit: 13, Birthday: 8
const COLUMN_WIDTHS = {
  Name: 16,
  Address: 22,
  Postcode: 9,
  Phone: 14,
  'Credit Limit': 13, // Note: Key matches FIELD_NAMES
  Birthday: 8,
};

export function parsePRN(prnContent: string): Row[] {
  const lines = prnContent.trim().split('\n');
  if (lines.length < 2) {
    return []; // Not enough lines for header and data
  }

  // const headerLine = lines[0]; // Header line not strictly needed if we rely on FIELD_NAMES

  const dataRows: Row[] = [];
  const dataLines = lines.slice(1);

  for (const line of dataLines) {
    if (line.trim() === '') continue; // Skip empty lines

    let currentPosition = 0;
    const row: Partial<Row> = {};

    for (const fieldName of FIELD_NAMES) {
      const width = COLUMN_WIDTHS[fieldName as keyof typeof COLUMN_WIDTHS];
      if (width === undefined) {
        console.error(`Width not defined for field: ${fieldName}`);
        continue;
      }
      const value = line.substring(currentPosition, currentPosition + width).trim();
      row[fieldName as keyof Row] = value;
      currentPosition += width;
    }
    // Data Normalization
    // Birthday: YYYYMMDD -> DD/MM/YYYY
    if (row.Birthday && row.Birthday.length === 8) {
      const year = row.Birthday.substring(0, 4);
      const month = row.Birthday.substring(4, 6);
      const day = row.Birthday.substring(6, 8);
      row.Birthday = `${day}/${month}/${year}`;
    }

    // Credit Limit: string assumed to be cents -> string with decimal
    if (row['Credit Limit']) {
      const limitInCents = parseInt(row['Credit Limit'], 10);
      if (!isNaN(limitInCents)) {
        const valueInDollars = limitInCents / 100;
        if (valueInDollars % 1 === 0) {
          // Check if it's a whole number
          row['Credit Limit'] = valueInDollars.toString();
        } else {
          row['Credit Limit'] = valueInDollars.toFixed(2).replace(/\.?0+$/, '');
        }
      }
      // If parsing fails, original trimmed string value is kept
    }

    dataRows.push(row as Row);
  }

  return dataRows;
}
