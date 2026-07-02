// lib/get-menu.ts
// Lee el menú desde Google Sheets vía gviz (sin API key).
// Si MENU_SHEET_ID no está configurado o la lectura falla, devuelve fallbackMenu.
import "server-only"
import { SheetMenuItem } from "./types"
import { fallbackMenu } from "./menu-data.fallback"

type GvizCell = { v: string | number | null }
type GvizRow = { c: (GvizCell | null)[] }

type GvizTable = {
  cols: { label: string }[]
  rows: GvizRow[]
}

type GvizResponse = {
  table: GvizTable
}

function parseGviz(text: string): GvizTable {
  // Recorta el wrapper de google.visualization y devuelve solo el objeto "table"
  const cleaned = text
    .replace("/*O_o*/", "")
    .replace("google.visualization.Query.setResponse(", "")
    .slice(0, -2) // quita ");"

  const json: GvizResponse = JSON.parse(cleaned)
  return json.table
}

function rowToItem(cols: string[], row: GvizRow): SheetMenuItem | null {
  if (!row.c) return null

  const get = (label: string): string | number | null => {
    const idx = cols.indexOf(label)
    if (idx === -1) return null
    const cell = row.c[idx]
    return cell?.v ?? null
  }

  const categoria = get("categoria")
  const platillo = get("platillo")
  const descripcion = get("descripcion")
  const precio = get("precio")
  const disponible = get("disponible")
  const tags = get("tags")

  if (typeof categoria !== "string" || typeof platillo !== "string") {
    return null
  }

  const priceNumber =
    typeof precio === "number"
      ? precio
      : typeof precio === "string"
      ? Number(precio.replace(/[^\d]/g, ""))
      : NaN

  if (Number.isNaN(priceNumber)) {
    return null
  }

  const available =
    typeof disponible === "string"
      ? disponible.toLowerCase() === "true"
      : typeof disponible === "number"
      ? disponible !== 0
      : true

  const tagsArray =
    typeof tags === "string"
      ? tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean)
      : []

  return {
    category: categoria,
    name: platillo,
    description:
      typeof descripcion === "string" && descripcion.trim().length > 0
        ? descripcion.trim()
        : undefined,
    price: priceNumber,
    available,
    tags: tagsArray.length ? tagsArray : undefined,
  }
}

export async function getMenu(): Promise<SheetMenuItem[]> {
  const sheetId = process.env.MENU_SHEET_ID
  const sheetName = process.env.MENU_SHEET_NAME ?? "Menu"

  if (!sheetId) {
    return fallbackMenu
  }

  try {
    const base = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq`
    const url = `${base}?tqx=out:json&sheet=${encodeURIComponent(sheetName)}`

    const res = await fetch(url, {
      cache: "no-store",
    })

    if (!res.ok) {
      throw new Error(`Error al leer la Sheet: ${res.status} ${res.statusText}`)
    }

    const text = await res.text()
    const table = parseGviz(text)

    const headerLabels = table.cols.map((c) => c.label.toLowerCase().trim())

    const items: SheetMenuItem[] = []
    for (const row of table.rows) {
      const item = rowToItem(headerLabels, row)
      if (!item) continue
      if (!item.available) continue
      items.push(item)
    }

    if (!items.length) {
      return fallbackMenu
    }

    return items
  } catch (err) {
    console.error("getMenu() falló, usando fallbackMenu", err)
    return fallbackMenu
  }
}
