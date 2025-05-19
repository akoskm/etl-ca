import { Row, FIELD_NAMES } from './constants';

function escapeHTML(str: string): string {
  // default to an empty string to prevent errors.
  const s = str ?? '';
  return s.replace(
    /[&<>"']/g,
    (c) =>
      ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
      }[c] || c),
  );
}

export function toJSON(data: Row[]): string {
  return JSON.stringify(data, null, 2);
}

export function toHTML(data: Row[]): string {
  if (data.length === 0) return '<table></table>';
  const headers = FIELD_NAMES;
  const thead = `<thead><tr>${headers
    .map((h) => `<th>${escapeHTML(h)}</th>`)
    .join('')}</tr></thead>`;
  const tbody = `<tbody>${data
    .map(
      (row) =>
        `<tr>${headers
          .map((h) => `<td>${escapeHTML(row[h as keyof Row])}</td>`)
          .join('')}</tr>`,
    )
    .join('')}</tbody>`;
  return `<table>${thead}${tbody}</table>`;
}
