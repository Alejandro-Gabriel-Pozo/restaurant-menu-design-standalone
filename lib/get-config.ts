import "server-only"

export type SiteConfig = {
  restaurante_nombre:           string
  restaurante_subtitulo:        string
  restaurante_descripcion:      string
  restaurante_boton_hero:       string
  meta_title:                   string
  meta_descripcion:             string
  color_marca:                  string
  theme_color:                  string
  favicon_url:                  string
  restaurante_logo_url:         string
  hero_color_fondo:             string
  hero_imagen_fondo_url:        string
  hero_etiqueta_superior:       string
  hero_etiqueta_scroll:         string
  hero_ink:                     string
  hero_ink_noche:               string
  hero_pos_contenido:           string
  hero_pos_contenido_mobile:    string
  hero_pos_logo:                string
  hero_pos_logo_mobile:         string
  color_fondo_dia:              string
  color_fondo_noche:            string
  mostrar_pertenencia:          string
  hosteria_nombre:              string
  hosteria_url:                 string
  hosteria_descripcion:         string
  empresa_nombre:               string
  empresa_url:                  string
  empresa_logo_url:             string
  restaurante_footer_direccion: string
  restaurante_footer_maps_url:  string
  restaurante_footer_telefono:  string
  restaurante_footer_email:     string
  restaurante_footer_horarios:  string
  restaurante_instagram:        string
  restaurante_facebook:         string
  restaurante_whatsapp:         string
  carta_pos_bloque:             string
  carta_pos_cta:                string
  carta_banda_alto_mobile:      string
  carta_banda_alto_desktop:     string
  // --- imagen en banda de sección ---
  carta_imagen_modo:            string  // fondo | miniatura | ambos
  carta_imagen_ancho_mobile:    string
  carta_imagen_ancho_desktop:   string
  carta_imagen_pos_x:           string  // left | center | right
  carta_imagen_pos_y:           string  // top | center | bottom
  carta_imagen_overlay:         string  // si | no
  carta_imagen_opacidad:        string  // 0-100
  // --- tamaños de fuente (rem, px, o número solo → px) ---
  carta_fuente_banda_etiqueta:  string  // «03 / 15 · Clásicos»  default: 0.55rem
  carta_fuente_banda_titulo:    string  // h2 de sección          default: 0.95rem
  carta_fuente_banda_descripcion: string // descripción sección   default: 0.6rem
  carta_fuente_item_nombre:     string  // nombre del plato       default: 0.88rem
  carta_fuente_item_precio:     string  // precio                 default: 0.88rem
  carta_fuente_item_descripcion: string // descripción plato      default: 0.68rem
  carta_fuente_item_tags:       string  // tags                   default: 0.6rem
}

const defaults: SiteConfig = {
  restaurante_nombre:           "Río Lileo",
  restaurante_subtitulo:        "Restaurante · Los Miches, Neuquén",
  restaurante_descripcion:      "Cocina regional neuquina, pastas caseras y vinos de las mejores bodegas del norte.",
  restaurante_boton_hero:       "Ver el menú",
  meta_title:                   "",
  meta_descripcion:             "",
  color_marca:                  "",
  theme_color:                  "",
  favicon_url:                  "",
  restaurante_logo_url:         "",
  hero_color_fondo:             "",
  hero_imagen_fondo_url:        "",
  hero_etiqueta_superior:       "Menú",
  hero_etiqueta_scroll:         "Menú",
  hero_ink:                     "",
  hero_ink_noche:               "",
  hero_pos_contenido:           "center-right",
  hero_pos_contenido_mobile:    "",
  hero_pos_logo:                "bottom-right",
  hero_pos_logo_mobile:         "",
  color_fondo_dia:              "",
  color_fondo_noche:            "",
  mostrar_pertenencia:          "",
  hosteria_nombre:              "",
  hosteria_url:                 "",
  hosteria_descripcion:         "",
  empresa_nombre:               "",
  empresa_url:                  "",
  empresa_logo_url:             "",
  restaurante_footer_direccion: "Ruta 43, Los Miches, Neuquén",
  restaurante_footer_maps_url:  "",
  restaurante_footer_telefono:  "",
  restaurante_footer_email:     "",
  restaurante_footer_horarios:  "",
  restaurante_instagram:        "",
  restaurante_facebook:         "",
  restaurante_whatsapp:         "",
  carta_pos_bloque:             "50",
  carta_pos_cta:                "18",
  carta_banda_alto_mobile:      "90",
  carta_banda_alto_desktop:     "clamp(80px, 18vh, 140px)",
  carta_imagen_modo:            "fondo",
  carta_imagen_ancho_mobile:    "160",
  carta_imagen_ancho_desktop:   "auto 100%",
  carta_imagen_pos_x:           "left",
  carta_imagen_pos_y:           "top",
  carta_imagen_overlay:         "si",
  carta_imagen_opacidad:        "38",
  carta_fuente_banda_etiqueta:  "0.55rem",
  carta_fuente_banda_titulo:    "0.95rem",
  carta_fuente_banda_descripcion: "0.6rem",
  carta_fuente_item_nombre:     "0.88rem",
  carta_fuente_item_precio:     "0.88rem",
  carta_fuente_item_descripcion: "0.68rem",
  carta_fuente_item_tags:       "0.6rem",
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

/** Normaliza un valor de fuente: si es número puro lo convierte a px, si no lo deja tal cual */
export function normFuente(val: string): string {
  return /^\d+(\.\d+)?$/.test(val.trim()) ? `${val.trim()}px` : val.trim()
}

export async function getConfig(): Promise<SiteConfig> {
  const sheetId = process.env.MENU_SHEET_ID
  if (!sheetId) return defaults

  try {
    const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json&sheet=Config&headers=0`
    const res = await fetch(url, { cache: "no-store" })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const table = parseGviz(await res.text())

    const config: SiteConfig = { ...defaults }
    for (const row of table.rows) {
      if (!row.c) continue
      const key = row.c[0]?.v != null ? String(row.c[0].v).trim() as keyof SiteConfig : undefined
      const raw = row.c[1]?.v
      const val = raw != null ? String(raw).trim() : ""
      if (key && key in defaults && raw != null && val !== "") {
        config[key] = val
      }
    }
    return config
  } catch (err) {
    console.error("getConfig() falló, usando defaults", err)
    return defaults
  }
}
