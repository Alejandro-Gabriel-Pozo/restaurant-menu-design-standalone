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
  carta_imagen_modo:            string
  carta_imagen_ancho_mobile:    string
  carta_imagen_ancho_desktop:   string
  carta_imagen_pos_x:           string
  carta_imagen_pos_y:           string
  carta_imagen_overlay:         string
  carta_imagen_opacidad:        string
  // fuentes banda
  carta_fuente_banda_etiqueta:    string
  carta_fuente_banda_titulo:      string
  carta_fuente_banda_descripcion: string
  // fuentes items
  carta_fuente_item_nombre:       string
  carta_fuente_item_precio:       string
  carta_fuente_item_descripcion:  string
  carta_fuente_item_tags:         string
  // fuentes portada
  carta_fuente_portada_etiqueta:    string
  carta_fuente_portada_nombre:      string
  carta_fuente_portada_subtitulo:   string
  carta_fuente_portada_descripcion: string
  carta_fuente_portada_cta:         string
  // fuentes índice
  carta_fuente_indice_etiqueta:  string
  carta_fuente_indice_titulo:    string
  carta_fuente_indice_numero:    string
  carta_fuente_indice_categoria: string
  carta_fuente_indice_item:      string
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
  carta_fuente_banda_etiqueta:    "0.55rem",
  carta_fuente_banda_titulo:      "0.95rem",
  carta_fuente_banda_descripcion: "0.6rem",
  carta_fuente_item_nombre:       "0.88rem",
  carta_fuente_item_precio:       "0.88rem",
  carta_fuente_item_descripcion:  "0.68rem",
  carta_fuente_item_tags:         "0.6rem",
  carta_fuente_portada_etiqueta:    "0.58rem",
  carta_fuente_portada_nombre:      "clamp(1.7rem, 7vw, 2.1rem)",
  carta_fuente_portada_subtitulo:   "0.6rem",
  carta_fuente_portada_descripcion: "0.75rem",
  carta_fuente_portada_cta:         "0.5rem",
  carta_fuente_indice_etiqueta:  "0.5rem",
  carta_fuente_indice_titulo:    "clamp(1.2rem, 4vw, 1.75rem)",
  carta_fuente_indice_numero:    "0.6rem",
  carta_fuente_indice_categoria: "0.58rem",
  carta_fuente_indice_item:      "clamp(0.82rem, 2.5vw, 0.95rem)",
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
