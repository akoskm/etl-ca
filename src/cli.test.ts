import { describe, test, expect, beforeAll, afterAll } from 'vitest';
import { exec } from 'child_process';
import { promises as fs } from 'fs';
import { promisify } from 'util';

const execAsync = promisify(exec);

// Define a simple type for the records in the JSON output
type JsonRecord = { [key: string]: string };

describe('CLI', () => {
  const testHtmlOutputFile = 'test-output.html.txt';
  const testCsvJsonOutputFile = 'test-csv-output.json.txt';

  beforeAll(async () => {
    // Clean up any existing test output files
    try {
      await fs.unlink(testHtmlOutputFile);
    } catch (error) {
      // Ignore if file doesn't exist
    }
    try {
      await fs.unlink(testCsvJsonOutputFile);
    } catch (error) {
      // Ignore if file doesn't exist
    }
  });

  afterAll(async () => {
    // Clean up test output files
    try {
      await fs.unlink(testHtmlOutputFile);
    } catch (error) {
      // Ignore if file doesn't exist
    }
    try {
      await fs.unlink(testCsvJsonOutputFile);
    } catch (error) {
      // Ignore if file doesn't exist
    }
  });

  test('converts CSV to HTML correctly', async () => {
    const command = `cat ./Workbook2.csv | your-solution csv html > ${testHtmlOutputFile}`;
    await execAsync(command);

    const output = await fs.readFile(testHtmlOutputFile, 'utf-8');

    // Verify basic HTML structure
    expect(output).toContain('<table>');
    expect(output).toContain('</table>');
    expect(output).toContain('<thead>');
    expect(output).toContain('<tbody>');

    // Verify headers
    expect(output).toContain('<th>Name</th>');
    expect(output).toContain('<th>Address</th>');
    expect(output).toContain('<th>Postcode</th>');
    expect(output).toContain('<th>Phone</th>');
    expect(output).toContain('<th>Credit Limit</th>');
    expect(output).toContain('<th>Birthday</th>');

    // Verify some data rows
    expect(output).toContain('<td>Johnson, John</td>');
    expect(output).toContain('<td>Voorstraat 32</td>');
    expect(output).toContain('<td>3122gg</td>');

    // Verify special characters are handled
    expect(output).toContain('Børkestraße');

    // Verify all rows are present (7 rows of data)
    const rowCount = (output.match(/<tr>/g) || []).length;
    expect(rowCount).toBe(8); // 1 header row + 7 data rows
  });

  test('converts CSV to JSON correctly', async () => {
    const command = `cat ./Workbook2.csv | your-solution csv json > ${testCsvJsonOutputFile}`;
    await execAsync(command);

    const jsonOutput = await fs.readFile(testCsvJsonOutputFile, 'utf-8');
    const data: JsonRecord[] = JSON.parse(jsonOutput);

    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBe(7); // 7 data rows

    // Check first record for structure and content
    const firstRecord = data[0];
    expect(typeof firstRecord).toBe('object');
    expect(firstRecord).toHaveProperty('Name', 'Johnson, John');
    expect(firstRecord).toHaveProperty('Address', 'Voorstraat 32');
    expect(firstRecord).toHaveProperty('Postcode', '3122gg');
    expect(firstRecord).toHaveProperty('Phone', '020 3849381');
    expect(firstRecord).toHaveProperty('Credit Limit', '10000');
    expect(firstRecord).toHaveProperty('Birthday', '01/01/1987');

    // Verify special characters are handled in the relevant record
    // Assuming Smith, John is the last record and contains the special character
    const recordWithSpecialChar = data.find((r: JsonRecord) => r.Name === 'Smith, John');
    expect(recordWithSpecialChar).toBeDefined();
    expect(recordWithSpecialChar?.Address).toContain('Børkestraße');
  });
});
