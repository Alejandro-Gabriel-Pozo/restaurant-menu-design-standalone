/**
 * lib/gviz.ts
 *
 * Único lugar donde vive el parser de Google Visualization (gviz).
 * Todos los fetches a Google Sheets pasan por aquí.
 *
 * Antes: parseGviz() estaba copiado en get-config.ts, get-menu.ts,
 *        tenants.ts y proxy.ts — 4 copias idénticas.
 */
import "server-only"

export type GvizCell     = { v: string | number | boolean | null }
export type GvizRow      = { c: (GvizCell | null)[] }
export type GvizTable    = { cols: { label: string }[]; rows: GvizRow[] }
export type GvizResponse = { table: GvizTable }

/**
 * Parsea la respuesta cruda de gviz a una tabla estructurada.
 * gviz devuelve JSONP con un wrapper que hay que limpiar antes de parsear.
 */
export function parseGviz(text: string): GvizTable {
  const cleaned = text
    .replace("/*O_o*/", "")
    .replace("google.visualization.Query.setResponse(", "")
    .slice(0, -2)
  const json: GvizResponse = JSON.parse(cleaned)
  return json.table
}

/**
 * Hace fetch a una hoja de Google Sheets y devuelve la tabla parseada.
 * Revalida cada 5 minutos por ISR.
 * Para flush inmediato usar /api/revalidate?secret=...&path=...
 *
 * @param sheetId   - ID del Google Spreadsheet
 * @param sheetName - Nombre exacto de la hoja (tab)
 * @param headers   - 0 = sin encabezados, 1 = primera fila como headers (default: 1)
 */
export async function fetchGviz(
  sheetId: string,
  sheetName: string,
  headers: 0 | 1 = 1,
): Promise<GvizTable> {
  const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(sheetName)}&headers=${headers}`
  const res = await fetch(url, { next: { revalidate: 300 } })
  if (!res.ok) throw new Error(`gviz HTTP ${res.status} — sheet: ${sheetName}`)
  return parseGviz(await res.text())
}

/**
 * Helper: devuelve un getter de columna por nombre (case-insensitive).
 * Reduce el boilerplate de cols.indexOf() repetido en cada parser.
 *
 * @example
 * const get = colGetter(table)
 * const nombre = String(get(row, "nombre") ?? "")
 */
export function colGetter(table: GvizTable) {
  const cols = table.cols.map((c) => c.label.toLowerCase().trim())
  return function get(
    row: GvizRow,
    label: string,
  ): string | number | boolean | null {
    const idx = cols.indexOf(label.toLowerCase().trim())
    if (idx === -1) return null
    return row.c?.[idx]?.v ?? null
  }
}
