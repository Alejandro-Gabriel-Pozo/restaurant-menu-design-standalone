/**
 * Registro de sucursales — leído desde Google Sheets.
 *
 * Hoja requerida: "Sucursales" en el spreadsheet raíz (MENU_SHEET_ID).
 *
 * Columnas esperadas (fila 1 = encabezados):
 *   slug         | string   | Identificador URL: /carta/<slug>
 *   label        | string   | Nombre legible (ej. "Miches")
 *   sheet_id     | string   | ID del Google Spreadsheet de la sucursal
 *   sheet_name   | string   | Nombre de la hoja del menú (default "Menu")
 *   config_sheet | string   | Nombre de la hoja de config (default "Config")
 *   activa       | boolean  | TRUE = publicada, FALSE = oculta/WIP
 *   deploy_hook  | string   | URL del deploy hook de Vercel (opcional, solo docs)
 *   notas        | string   | Campo libre: estado, pendientes, fecha de alta, etc.
 */

import "server-only"

export interface SucursalDef {
  slug: string
  label: string
  sheetId: string
  sheetName: string
  configSheet: string
  activa: boolean
  deployHook?: string
  notas?: string
}

type GvizCell = { v: string | number | boolean | null }
type GvizRow  = { c: (GvizCell | null)[] }
type GvizTable = { cols: { label: string }[]; rows: GvizRow[] }
type GvizResponse = { table: GvizTable }

function parseGviz(text: string): GvizTable {
  const cleaned = text
    .replace("/*O_o*/", "")
    .replace("google.visualization.Query.setResponse(", "")
    .slice(0, -2)
  const json: GvizResponse = JSON.parse(cleaned)
  return json.table
}

/**
 * Descarga y parsea la hoja "Sucursales" del spreadsheet raíz.
 * Revalida cada hora (ISR). Si la hoja no existe o hay error, devuelve [].
 */
export async function getSucursales(): Promise<SucursalDef[]> {
  const sheetId = process.env.MENU_SHEET_ID
  if (!sheetId) return []

  try {
    const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json&sheet=Sucursales&headers=1`
    const res = await fetch(url, { next: { revalidate: 3600 } })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const table = parseGviz(await res.text())
    const cols  = table.cols.map((c) => c.label.toLowerCase().trim())

    const sucursales: SucursalDef[] = []
    for (const row of table.rows) {
      if (!row.c) continue
      const get = (label: string): string | number | boolean | null => {
        const idx = cols.indexOf(label)
        if (idx === -1) return null
        return row.c[idx]?.v ?? null
      }

      const slug    = String(get("slug")     ?? "").trim()
      const sheetId = String(get("sheet_id") ?? "").trim()
      if (!slug || !sheetId) continue

      const activaRaw = get("activa")
      const activa =
        typeof activaRaw === "boolean"
          ? activaRaw
          : String(activaRaw).toLowerCase() === "true"

      sucursales.push({
        slug,
        label:       String(get("label")        ?? slug).trim(),
        sheetId,
        sheetName:   String(get("sheet_name")   || "Menu").trim(),
        configSheet: String(get("config_sheet") || "Config").trim(),
        activa,
        deployHook:  get("deploy_hook") ? String(get("deploy_hook")).trim() : undefined,
        notas:       get("notas")       ? String(get("notas")).trim()       : undefined,
      })
    }
    return sucursales
  } catch (err) {
    console.error("getSucursales() falló", err)
    return []
  }
}

/** Sucursales públicas solamente */
export async function getSucursalesActivas(): Promise<SucursalDef[]> {
  const all = await getSucursales()
  return all.filter((s) => s.activa)
}

/** Lookup por slug (incluye inactivas — para mostrar 404 con contexto) */
export async function getSucursal(slug: string): Promise<SucursalDef | undefined> {
  const all = await getSucursales()
  return all.find((s) => s.slug === slug)
}

/** Slugs activos para generateStaticParams */
export async function getSucursalSlugs(): Promise<string[]> {
  const activas = await getSucursalesActivas()
  return activas.map((s) => s.slug)
}
