import "server-only"
import { fallbackMenu } from "./menu-data.fallback"

export type SheetMenuItem = {
  categoria: string
  titulo_seccion: string
  descripcion_seccion: string
  imagen_seccion_url: string
  orden: number
  platillo: string
  descripcion: string
  /** Precio como string crudo de la sheet (número o texto con símbolo) */
  precio: string
  disponible: boolean
  tags: string[]
  especial: boolean
}

export type MenuCategory = {
  id: string
  label: string
  /** @deprecated usar titulo_seccion */
  title: string
  titulo_seccion: string
  description: string
  imagen_url: string
  orden: number
  items: {
    name: string
    description: string
    /** Precio crudo: número o string ya formateado desde la sheet */
    price: string
    tags?: string[]
    especial: boolean
  }[]
}

type GvizCell = { v: string | number | boolean | null }
type GvizRow = { c: (GvizCell | null)[] }
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

function rowToItem(cols: string[], row: GvizRow): SheetMenuItem | null {
  if (!row.c) return null
  const get = (label: string): string | number | boolean | null => {
    const idx = cols.indexOf(label)
    if (idx === -1) return null
    return row.c[idx]?.v ?? null
  }

  const categoria = get("categoria")
  const platillo  = get("platillo")
  if (typeof categoria !== "string" || !categoria.trim()) return null
  if (typeof platillo  !== "string" || !platillo.trim())  return null

  const precioRaw = get("precio")
  const precio =
    precioRaw == null
      ? ""
      : typeof precioRaw === "number"
      ? String(precioRaw)
      : String(precioRaw).trim()

  const disponibleRaw = get("disponible")
  const disponible =
    typeof disponibleRaw === "boolean"
      ? disponibleRaw
      : String(disponibleRaw).toLowerCase() === "true"

  const especialRaw = get("especial")
  const especial =
    typeof especialRaw === "boolean"
      ? especialRaw
      : String(especialRaw).toLowerCase() === "true"

  const tagsRaw = get("tags")
  const tags =
    typeof tagsRaw === "string" && tagsRaw.trim()
      ? tagsRaw.split(",").map((t) => t.trim()).filter(Boolean)
      : []

  const ordenRaw = get("orden")
  const orden = typeof ordenRaw === "number" ? ordenRaw : Number(ordenRaw) || 99

  const imagen_seccion_url = String(get("imagen_seccion_url") ?? "").trim()

  return {
    categoria: categoria.trim(),
    titulo_seccion: String(get("titulo_seccion") ?? categoria).trim(),
    descripcion_seccion: String(get("descripcion_seccion") ?? "").trim(),
    imagen_seccion_url,
    orden,
    platillo: platillo.trim(),
    descripcion: String(get("descripcion") ?? "").trim(),
    precio,
    disponible,
    tags,
    especial,
  }
}

function buildCategories(items: SheetMenuItem[]): MenuCategory[] {
  const map = new Map<string, MenuCategory>()
  for (const item of items) {
    const id = item.categoria
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")
    if (!map.has(id)) {
      map.set(id, {
        id,
        label: item.categoria,
        title: item.titulo_seccion,
        titulo_seccion: item.titulo_seccion,
        description: item.descripcion_seccion,
        imagen_url: item.imagen_seccion_url,
        orden: item.orden,
        items: [],
      })
    }
    map.get(id)!.items.push({
      name: item.platillo,
      description: item.descripcion,
      price: item.precio,
      tags: item.tags.length ? item.tags : undefined,
      especial: item.especial,
    })
  }
  return Array.from(map.values()).sort((a, b) => a.orden - b.orden)
}

/**
 * Descarga el menú de Google Sheets con ISR (revalidate: 3600).
 *
 * @param sheetId   - ID del spreadsheet (default: MENU_SHEET_ID)
 * @param sheetName - Nombre de la hoja  (default: MENU_SHEET_NAME o "Menu")
 */
export async function getMenu(
  sheetId?: string,
  sheetName?: string,
): Promise<MenuCategory[]> {
  const id   = sheetId   ?? process.env.MENU_SHEET_ID
  const name = sheetName ?? process.env.MENU_SHEET_NAME ?? "Menu"

  if (!id) return buildCategories(fallbackMenu)

  try {
    const url = `https://docs.google.com/spreadsheets/d/${id}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(name)}`
    const res = await fetch(url, { next: { revalidate: 3600 } })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const table = parseGviz(await res.text())
    const cols  = table.cols.map((c) => c.label.toLowerCase().trim())
    const items: SheetMenuItem[] = []
    for (const row of table.rows) {
      const item = rowToItem(cols, row)
      if (item && item.disponible) items.push(item)
    }
    if (!items.length) return buildCategories(fallbackMenu)
    return buildCategories(items)
  } catch (err) {
    console.error("getMenu() falló, usando fallback", err)
    return buildCategories(fallbackMenu)
  }
}
