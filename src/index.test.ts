import { describe, it, expect } from 'vitest';

// Import the CSV parser from index.ts
// We'll need to export parseCSV from index.ts for this test to work
import { parseCSV } from './parsers/csv';

describe('parseCSV', () => {
  it('parses simple CSV with quoted commas correctly', () => {
    const csv = `Name,Address,Postcode,Phone,Credit Limit,Birthday\n"Smith, John",123 Main St,12345,555-1234,1000,01/01/2000`;
    const result = parseCSV(csv);
    expect(result).toEqual([
      {
        Name: 'Smith, John',
        Address: '123 Main St',
        Postcode: '12345',
        Phone: '555-1234',
        'Credit Limit': '1000',
        Birthday: '01/01/2000',
      },
    ]);
  });
});
