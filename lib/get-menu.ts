// lib/get-menu.ts
import "server-only"
import { fallbackMenu } from "./menu-data.fallback"

export type SheetMenuItem = {
  categoria: string
  titulo_seccion: string
  descripcion_seccion: string
  orden: number
  platillo: string
  descripcion: string
  precio: number
  disponible: boolean
  tags: string[]
  especial: boolean
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
  const platillo = get("platillo")
  if (typeof categoria !== "string" || typeof platillo !== "string") return null

  const precio = get("precio")
  const priceNumber =
    typeof precio === "number"
      ? precio
      : typeof precio === "string"
      ? Number(String(precio).replace(/[^\d]/g, ""))
      : NaN
  if (Number.isNaN(priceNumber)) return null

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

  return {
    categoria,
    titulo_seccion: String(get("titulo_seccion") ?? categoria),
    descripcion_seccion: String(get("descripcion_seccion") ?? ""),
    orden,
    platillo,
    descripcion: String(get("descripcion") ?? ""),
    precio: priceNumber,
    disponible,
    tags,
    especial,
  }
}

export type MenuCategory = {
  id: string
  label: string
  title: string
  description: string
  orden: number
  items: {
    name: string
    description: string
    price: string
    tags?: string[]
    especial: boolean
  }[]
}

export async function getMenu(): Promise<MenuCategory[]> {
  const sheetId = process.env.MENU_SHEET_ID
  const sheetName = process.env.MENU_SHEET_NAME ?? "MenuMiches"

  let items: SheetMenuItem[] = []

  if (!sheetId) {
    // fallback tipado antiguo → convertir
    items = (fallbackMenu as unknown as SheetMenuItem[])
  } else {
    try {
      const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(sheetName)}`
      const res = await fetch(url, { cache: "no-store" })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const table = parseGviz(await res.text())
      const cols = table.cols.map((c) => c.label.toLowerCase().trim())
      for (const row of table.rows) {
        const item = rowToItem(cols, row)
        if (item && item.disponible) items.push(item)
      }
      if (!items.length) items = (fallbackMenu as unknown as SheetMenuItem[])
    } catch (err) {
      console.error("getMenu() falló, usando fallback", err)
      items = (fallbackMenu as unknown as SheetMenuItem[])
    }
  }

  // Agrupar por categoría
  const map = new Map<string, MenuCategory>()
  for (const item of items) {
    const id = item.categoria.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")
    if (!map.has(id)) {
      map.set(id, {
        id,
        label: item.categoria,
        title: item.titulo_seccion,
        description: item.descripcion_seccion,
        orden: item.orden,
        items: [],
      })
    }
    map.get(id)!.items.push({
      name: item.platillo,
      description: item.descripcion,
      price: `$${item.precio.toLocaleString("es-AR")}`,
      tags: item.tags.length ? item.tags : undefined,
      especial: item.especial,
    })
  }

  return Array.from(map.values()).sort((a, b) => a.orden - b.orden)
}
