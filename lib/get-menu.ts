import "server-only"
import { fetchGviz, colGetter, type GvizRow } from "./gviz"
import { fallbackMenu } from "./menu-data.fallback"

export type SheetMenuItem = {
  categoria: string
  titulo_seccion: string
  descripcion_seccion: string
  imagen_seccion_url: string
  orden: number
  platillo: string
  descripcion: string
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
    price: string
    tags?: string[]
    especial: boolean
  }[]
}

function rowToItem(
  get: (row: GvizRow, label: string) => string | number | boolean | null,
  row: GvizRow,
): SheetMenuItem | null {
  if (!row.c) return null

  const categoria = get(row, "categoria")
  const platillo  = get(row, "platillo")
  if (typeof categoria !== "string" || !categoria.trim()) return null
  if (typeof platillo  !== "string" || !platillo.trim())  return null

  const precioRaw = get(row, "precio")
  const precio =
    precioRaw == null ? "" :
    typeof precioRaw === "number" ? String(precioRaw) :
    String(precioRaw).trim()

  const disponibleRaw = get(row, "disponible")
  const disponible =
    typeof disponibleRaw === "boolean"
      ? disponibleRaw
      : String(disponibleRaw).toLowerCase() === "true"

  const especialRaw = get(row, "especial")
  const especial =
    typeof especialRaw === "boolean"
      ? especialRaw
      : String(especialRaw).toLowerCase() === "true"

  const tagsRaw = get(row, "tags")
  const tags =
    typeof tagsRaw === "string" && tagsRaw.trim()
      ? tagsRaw.split(",").map((t) => t.trim()).filter(Boolean)
      : []

  const ordenRaw = get(row, "orden")
  const orden = typeof ordenRaw === "number" ? ordenRaw : Number(ordenRaw) || 99

  return {
    categoria: categoria.trim(),
    titulo_seccion:     String(get(row, "titulo_seccion")     ?? categoria).trim(),
    descripcion_seccion: String(get(row, "descripcion_seccion") ?? "").trim(),
    imagen_seccion_url:  String(get(row, "imagen_seccion_url")  ?? "").trim(),
    orden,
    platillo: platillo.trim(),
    descripcion: String(get(row, "descripcion") ?? "").trim(),
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
        label:          item.categoria,
        title:          item.titulo_seccion,
        titulo_seccion: item.titulo_seccion,
        description:    item.descripcion_seccion,
        imagen_url:     item.imagen_seccion_url,
        orden:          item.orden,
        items: [],
      })
    }
    map.get(id)!.items.push({
      name:        item.platillo,
      description: item.descripcion,
      price:       item.precio,
      tags:        item.tags.length ? item.tags : undefined,
      especial:    item.especial,
    })
  }
  return Array.from(map.values()).sort((a, b) => a.orden - b.orden)
}

/**
 * Descarga el menú de Google Sheets (ISR 1h).
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
    const table = await fetchGviz(id, name)
    const get   = colGetter(table)
    const items: SheetMenuItem[] = []
    for (const row of table.rows) {
      const item = rowToItem(get, row)
      if (item && item.disponible) items.push(item)
    }
    if (!items.length) return buildCategories(fallbackMenu)
    return buildCategories(items)
  } catch (err) {
    console.error("getMenu() falló, usando fallback", err)
    return buildCategories(fallbackMenu)
  }
}
