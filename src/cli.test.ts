import { describe, test, expect, beforeAll, afterAll } from 'vitest';
import { exec } from 'child_process';
import { promises as fs } from 'fs';
import { promisify } from 'util';

const execAsync = promisify(exec);

describe('CLI', () => {
  const testOutputFile = 'test-output.html.txt';

  beforeAll(async () => {
    // Clean up any existing test output file
    try {
      await fs.unlink(testOutputFile);
    } catch (error) {
      // Ignore if file doesn't exist
    }
  });

  afterAll(async () => {
    // Clean up test output file
    try {
      await fs.unlink(testOutputFile);
    } catch (error) {
      // Ignore if file doesn't exist
    }
  });

  test('converts CSV to HTML correctly', async () => {
    const command = `cat ./Workbook2.csv | your-solution csv html > ${testOutputFile}`;
    await execAsync(command);

    const output = await fs.readFile(testOutputFile, 'utf-8');

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
});
