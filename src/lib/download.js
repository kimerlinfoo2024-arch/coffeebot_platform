/* ============================================================
   Client-side file downloads — CSV exports and text lesson
   plans. No backend: files are built in the browser.
   ============================================================ */

const cell = (v) => {
  const s = v == null ? '' : String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

/** rows: array of objects; cols: [[key, header]] */
export function toCSV(rows, cols) {
  const head = cols.map(([, h]) => cell(h)).join(',');
  const body = rows.map((r) => cols.map(([k]) => cell(r[k])).join(','));
  return [head, ...body].join('\n');
}

export function downloadFile(filename, text, type = 'text/csv;charset=utf-8') {
  const url = URL.createObjectURL(new Blob([text], { type }));
  const a = Object.assign(document.createElement('a'), { href: url, download: filename });
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export const today = () => new Date().toISOString().slice(0, 10);

export const BATCH_COLS = [
  ['id', 'Batch'], ['date', 'Date'], ['source', 'Source'], ['kg', 'Kg'],
  ['partner', 'Partner'], ['use', 'Use'], ['status', 'Status'], ['notes', 'Notes'],
];
