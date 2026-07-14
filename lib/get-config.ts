import "server-only"

export type SiteConfig = {
  // ── IDENTIDAD ────────────────────────────────────────────────────────────
  restaurante_nombre:           string
  restaurante_subtitulo:        string
  restaurante_descripcion:      string
  restaurante_boton_hero:       string

  // ── SEO / METADATA ───────────────────────────────────────────────────────
  /** Texto del <title> del tab del browser. Fallback: "[nombre] · Menú" */
  meta_title:                   string
  /** Meta description. Fallback: restaurante_descripcion */
  meta_descripcion:             string

  // ── VISUAL — MARCA ───────────────────────────────────────────────────────
  /** Hex/CSS — acento global: precios, tags, bordes */
  color_marca:                  string
  /** Hex/CSS — color de la barra del navegador en móvil (theme-color) */
  theme_color:                  string
  /** URL — favicon SVG editable. Vacío = usa los estáticos de /public */
  favicon_url:                  string
  /** URL — logo del restaurante en el hero (64×64px, PNG/SVG transparente) */
  restaurante_logo_url:         string

  // ── VISUAL — HERO ────────────────────────────────────────────────────────
  /** Hex/CSS — color de fondo del hero. También actúa de overlay si hay imagen */
  hero_color_fondo:             string
  /** URL — imagen full-bleed de fondo del hero (mín. 1200×900px, JPG/WebP) */
  hero_imagen_fondo_url:        string
  /** URL — imagen decorativa esquina superior derecha del hero */
  hero_imagen_url:              string

  // ── PERTENENCIA ──────────────────────────────────────────────────────────
  mostrar_pertenencia:          string
  hosteria_nombre:              string
  hosteria_url:                 string
  hosteria_descripcion:         string
  empresa_nombre:               string
  empresa_url:                  string
  /** URL — logo de la hostería/empresa en el footer */
  empresa_logo_url:             string

  // ── FOOTER ───────────────────────────────────────────────────────────────
  restaurante_footer_direccion: string
  restaurante_footer_telefono:  string
  restaurante_footer_email:     string
  restaurante_footer_horarios:  string
}

const defaults: SiteConfig = {
  // identidad
  restaurante_nombre:           "Río Lileo",
  restaurante_subtitulo:        "Restaurante · Los Miches, Neuquén",
  restaurante_descripcion:      "Cocina regional neuquina, pastas caseras y vinos de las mejores bodegas del norte.",
  restaurante_boton_hero:       "Ver el menú",
  // seo
  meta_title:                   "",
  meta_descripcion:             "",
  // visual — marca
  color_marca:                  "",
  theme_color:                  "",
  favicon_url:                  "",
  restaurante_logo_url:         "",
  // visual — hero
  hero_color_fondo:             "",
  hero_imagen_fondo_url:        "",
  hero_imagen_url:              "",
  // pertenencia
  mostrar_pertenencia:          "true",
  hosteria_nombre:              "",
  hosteria_url:                 "",
  hosteria_descripcion:         "",
  empresa_nombre:               "",
  empresa_url:                  "",
  empresa_logo_url:             "",
  // footer
  restaurante_footer_direccion: "Ruta 43, Los Miches, Neuquén",
  restaurante_footer_telefono:  "",
  restaurante_footer_email:     "",
  restaurante_footer_horarios:  "",
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
