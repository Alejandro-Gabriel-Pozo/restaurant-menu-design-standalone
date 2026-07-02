import "server-only"

export type SiteConfig = {
  restaurante_nombre: string
  restaurante_descripcion: string
  restaurante_subtitulo: string
  restaurante_boton_hero: string
  restaurante_footer_direccion: string
  restaurante_footer_telefono: string
  restaurante_footer_email: string
  restaurante_footer_horarios: string
  hosteria_nombre: string
  hosteria_url: string
  hosteria_descripcion: string
  empresa_nombre: string
  empresa_url: string
  empresa_logo_url: string
  color_acento: string
  hero_imagen_url: string
}

const defaults: SiteConfig = {
  restaurante_nombre: "Río Lileo",
  restaurante_descripcion:
    "Cocina regional neuquina, pastas caseras y vinos de las mejores bodegas del norte.",
  restaurante_subtitulo: "Restaurante · Los Miches, Neuquén",
  restaurante_boton_hero: "Ver el menú",
  restaurante_footer_direccion: "Ruta 43, Los Miches, Neuquén",
  restaurante_footer_telefono: "",
  restaurante_footer_email: "",
  restaurante_footer_horarios: "",
  hosteria_nombre: "",
  hosteria_url: "",
  hosteria_descripcion: "",
  empresa_nombre: "",
  empresa_url: "",
  empresa_logo_url: "",
  color_acento: "",
  hero_imagen_url: "",
}

type GvizCell = { v: string | null }
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

export async function getConfig(): Promise<SiteConfig> {
  const sheetId = process.env.MENU_SHEET_ID
  if (!sheetId) return defaults

  try {
    const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json&sheet=Config`
    const res = await fetch(url, { cache: "no-store" })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const table = parseGviz(await res.text())

    const config: SiteConfig = { ...defaults }
    for (const row of table.rows) {
      if (!row.c) continue
      const key = row.c[0]?.v?.trim() as keyof SiteConfig | undefined
      const val = row.c[1]?.v?.trim() ?? ""
      if (key && key in defaults && val) {
        config[key] = val
      }
    }
    return config
  } catch (err) {
    console.error("getConfig() falló, usando defaults", err)
    return defaults
  }
}
