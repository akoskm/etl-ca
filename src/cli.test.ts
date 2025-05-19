import { describe, test, expect, beforeAll, afterAll } from 'vitest';
import { exec } from 'child_process';
import { promises as fs } from 'fs';
import { promisify } from 'util';
import { Row } from './constants';

const execAsync = promisify(exec);

describe('CLI', () => {
  const testHtmlOutputFile = 'test-output.html.txt';
  const testCsvJsonOutputFile = 'test-csv-output.json.txt';
  const testPrnHtmlOutputFile = 'test-prn-html-output.txt';
  const testPrnJsonOutputFile = 'test-prn-json-output.txt';

  const readmeCsvHtmlFile = 'csv.html.txt';
  const readmePrnHtmlFile = 'prn.html.txt';
  const readmeCsvJsonFile = 'csv.json.txt';
  const readmePrnJsonFile = 'prn.json.txt';

  const filesToClean = [
    testHtmlOutputFile,
    testCsvJsonOutputFile,
    testPrnHtmlOutputFile,
    testPrnJsonOutputFile,
    readmeCsvHtmlFile,
    readmePrnHtmlFile,
    readmeCsvJsonFile,
    readmePrnJsonFile,
  ];

  beforeAll(async () => {
    for (const file of filesToClean) {
      try {
        await fs.unlink(file);
      } catch (error) {
        // Ignore if file doesn't exist
      }
    }
  });

  afterAll(async () => {
    for (const file of filesToClean) {
      try {
        await fs.unlink(file);
      } catch (error) {
        // Ignore if file doesn't exist
      }
    }
  });

  test('converts CSV to HTML correctly', async () => {
    const command = `cat ./Workbook2.csv | your-solution csv html > ${testHtmlOutputFile}`;
    await execAsync(command);
    const output = await fs.readFile(testHtmlOutputFile, 'utf-8');
    // Assertions remain the same - expecting normalized output
    expect(output).toContain('<th>Name</th>');
    expect(output).toContain('Børkestraße');
    const rowCount = (output.match(/<tr>/g) || []).length;
    expect(rowCount).toBe(8);
    // ... other common assertions from previous CSV to HTML test ...
    expect(output).toContain('<table>');
    expect(output).toContain('</table>');
    expect(output).toContain('<thead>');
    expect(output).toContain('<tbody>');
    expect(output).toContain('<th>Address</th>');
    expect(output).toContain('<th>Postcode</th>');
    expect(output).toContain('<th>Phone</th>');
    expect(output).toContain('<th>Credit Limit</th>');
    expect(output).toContain('<th>Birthday</th>');
    expect(output).toContain('<td>Johnson, John</td>');
    expect(output).toContain('<td>Voorstraat 32</td>');
    expect(output).toContain('<td>3122gg</td>');
    expect(output).toContain('<td>10000</td>'); // Normalized from PRN potentially
    expect(output).toContain('<td>01/01/1987</td>'); // Normalized from PRN
    expect(output).toContain('<td>54.5</td>'); // Normalized from PRN
  });

  test('converts CSV to JSON correctly', async () => {
    const command = `cat ./Workbook2.csv | your-solution csv json > ${testCsvJsonOutputFile}`;
    await execAsync(command);
    const jsonOutput = await fs.readFile(testCsvJsonOutputFile, 'utf-8');
    const data: Row[] = JSON.parse(jsonOutput);
    // Assertions remain the same - expecting normalized output
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBe(7);
    const firstRecord = data[0];
    expect(firstRecord).toHaveProperty('Name', 'Johnson, John');
    expect(firstRecord).toHaveProperty('Credit Limit', '10000');
    expect(firstRecord).toHaveProperty('Birthday', '01/01/1987');
    const recordWithSpecialChar = data.find((r: Row) => r.Name === 'Smith, John');
    expect(recordWithSpecialChar?.Address).toContain('Børkestraße');
    const recordWithDecimal = data.find((r: Row) => r.Name === 'Gibson, Mal');
    expect(recordWithDecimal?.['Credit Limit']).toBe('54.5');
    // ... other common assertions from previous CSV to JSON test ...
    expect(firstRecord).toHaveProperty('Address', 'Voorstraat 32');
    expect(firstRecord).toHaveProperty('Postcode', '3122gg');
    expect(firstRecord).toHaveProperty('Phone', '020 3849381');
  });

  test('converts PRN to HTML correctly and matches CSV output', async () => {
    const command = `cat ./Workbook2.prn | your-solution prn html > ${testPrnHtmlOutputFile}`;
    await execAsync(command);
    const output = await fs.readFile(testPrnHtmlOutputFile, 'utf-8');
    // Assertions should be IDENTICAL to CSV to HTML test
    expect(output).toContain('<table>');
    expect(output).toContain('</table>');
    expect(output).toContain('<thead>');
    expect(output).toContain('<tbody>');
    expect(output).toContain('<th>Name</th>');
    expect(output).toContain('<th>Address</th>');
    expect(output).toContain('<th>Postcode</th>');
    expect(output).toContain('<th>Phone</th>');
    expect(output).toContain('<th>Credit Limit</th>');
    expect(output).toContain('<th>Birthday</th>');
    expect(output).toContain('<td>Johnson, John</td>');
    expect(output).toContain('<td>Voorstraat 32</td>');
    expect(output).toContain('<td>3122gg</td>');
    expect(output).toContain('<td>10000</td>');
    expect(output).toContain('<td>01/01/1987</td>');
    expect(output).toContain('Børkestraße');
    expect(output).toContain('<td>54.5</td>'); // Check normalized credit limit
    const rowCount = (output.match(/<tr>/g) || []).length;
    expect(rowCount).toBe(8);
  });

  test('converts PRN to JSON correctly and matches CSV output', async () => {
    const command = `cat ./Workbook2.prn | your-solution prn json > ${testPrnJsonOutputFile}`;
    await execAsync(command);
    const jsonOutput = await fs.readFile(testPrnJsonOutputFile, 'utf-8');
    const data: Row[] = JSON.parse(jsonOutput);
    // Assertions should be IDENTICAL to CSV to JSON test
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBe(7);
    const firstRecord = data[0];
    expect(typeof firstRecord).toBe('object');
    expect(firstRecord).toHaveProperty('Name', 'Johnson, John');
    expect(firstRecord).toHaveProperty('Address', 'Voorstraat 32');
    expect(firstRecord).toHaveProperty('Postcode', '3122gg');
    expect(firstRecord).toHaveProperty('Phone', '020 3849381');
    expect(firstRecord).toHaveProperty('Credit Limit', '10000');
    expect(firstRecord).toHaveProperty('Birthday', '01/01/1987');
    const recordWithSpecialChar = data.find((r: Row) => r.Name === 'Smith, John');
    expect(recordWithSpecialChar).toBeDefined();
    expect(recordWithSpecialChar?.Address).toContain('Børkestraße');
    const recordWithDecimal = data.find((r: Row) => r.Name === 'Gibson, Mal');
    expect(recordWithDecimal?.['Credit Limit']).toBe('54.5');
  });

  // --- Diff tests as per README ---
  test('HTML outputs from CSV and PRN are identical (via diff)', async () => {
    await execAsync(
      `cat ./Workbook2.csv | your-solution csv html > ${readmeCsvHtmlFile}`,
    );
    await execAsync(
      `cat ./Workbook2.prn | your-solution prn html > ${readmePrnHtmlFile}`,
    );
    const { stdout } = await execAsync(`diff ${readmeCsvHtmlFile} ${readmePrnHtmlFile}`);
    expect(stdout).toBe('');
  });

  test('JSON outputs from CSV and PRN are identical (via diff)', async () => {
    await execAsync(
      `cat ./Workbook2.csv | your-solution csv json > ${readmeCsvJsonFile}`,
    );
    await execAsync(
      `cat ./Workbook2.prn | your-solution prn json > ${readmePrnJsonFile}`,
    );
    // If diff fails (files are different), execAsync will throw, failing the test.
    // If files are same, diff exits with 0, stdout is empty.
    const { stdout } = await execAsync(`diff ${readmeCsvJsonFile} ${readmePrnJsonFile}`);
    expect(stdout).toBe('');
  });
});
