import { describe, it, expect } from 'vitest';
import { parsePRN } from './prn';
import { Row } from '../constants';

describe('parsePRN', () => {
  it('parses fixed-width PRN string with normalization correctly', () => {
    const prnInput =
      `Name            Address               Postcode Phone         Credit Limit Birthday
` +
      `Johnson, John   Voorstraat 32         3122gg   020 3849381        1000000 19870101
` +
      `Gibson, Mal     Vredenburg 21         3209 DD  06-48958986           5450 19781109
` +
      `Smith, John     Børkestraße 32        87823    +44 728 889838      989830 19990920
`;

    const expectedOutput: Row[] = [
      {
        Name: 'Johnson, John',
        Address: 'Voorstraat 32',
        Postcode: '3122gg',
        Phone: '020 3849381',
        'Credit Limit': '10000',
        Birthday: '01/01/1987',
      },
      {
        Name: 'Gibson, Mal',
        Address: 'Vredenburg 21',
        Postcode: '3209 DD',
        Phone: '06-48958986',
        'Credit Limit': '54.5',
        Birthday: '09/11/1978',
      },
      {
        Name: 'Smith, John',
        Address: 'Børkestraße 32',
        Postcode: '87823',
        Phone: '+44 728 889838',
        'Credit Limit': '9898.3',
        Birthday: '20/09/1999',
      },
    ];

    const result = parsePRN(prnInput);
    expect(result).toEqual(expectedOutput);
    expect(result.length).toBe(3);
  });

  it('returns an empty array for input with no data lines', () => {
    const prnInput = `Name            Address               Postcode Phone         Credit Limit Birthday
`;
    const result = parsePRN(prnInput);
    expect(result).toEqual([]);
  });

  it('returns an empty array for empty input', () => {
    const prnInput = '';
    const result = parsePRN(prnInput);
    expect(result).toEqual([]);
  });

  it('handles PRN content with only whitespace lines after header', () => {
    const prnInput =
      `Name            Address               Postcode Phone         Credit Limit Birthday
` +
      `                                                                               
` +
      `                   
`;
    const result = parsePRN(prnInput);
    expect(result).toEqual([]);
  });
});
