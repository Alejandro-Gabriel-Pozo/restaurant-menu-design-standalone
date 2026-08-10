import "server-only"

export type SiteConfig = {
  // Identidad
  restaurante_nombre:           string
  restaurante_subtitulo:        string
  restaurante_descripcion:      string
  restaurante_boton_hero:       string
  color_marca:                  string
  theme_color:                  string
  favicon_url:                  string
  restaurante_logo_url:         string
  lang:                         string
  // SEO / Open Graph
  meta_title:                   string
  meta_descripcion:             string
  meta_og_image_url:            string
  meta_og_locale:               string
  meta_og_url:                  string
  meta_twitter_card:            string
  // Hero / Portada
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
  // Pertenencia
  mostrar_pertenencia:          string
  hosteria_nombre:              string
  hosteria_url:                 string
  hosteria_descripcion:         string
  empresa_nombre:               string
  empresa_url:                  string
  empresa_logo_url:             string
  // Contacto / Footer
  restaurante_footer_direccion: string
  restaurante_footer_maps_url:  string
  restaurante_footer_telefono:  string
  restaurante_footer_email:     string
  restaurante_footer_horarios:  string
  restaurante_instagram:        string
  restaurante_facebook:         string
  restaurante_whatsapp:         string
  // Precios
  precio_simbolo:               string
  precio_locale:                string
  precio_posicion:              string
  // Layout carta
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
  // Fuentes banda
  carta_fuente_banda_etiqueta:    string
  carta_fuente_banda_titulo:      string
  carta_fuente_banda_descripcion: string
  // Fuentes items
  carta_fuente_item_nombre:       string
  carta_fuente_item_precio:       string
  carta_fuente_item_descripcion:  string
  carta_fuente_item_tags:         string
  // Fuentes portada
  carta_fuente_portada_etiqueta:    string
  carta_fuente_portada_nombre:      string
  carta_fuente_portada_subtitulo:   string
  carta_fuente_portada_descripcion: string
  carta_fuente_portada_cta:         string
  // Fuentes índice
  carta_fuente_indice_etiqueta:  string
  carta_fuente_indice_titulo:    string
  carta_fuente_indice_numero:    string
  carta_fuente_indice_categoria: string
  carta_fuente_indice_item:      string
  // Textos portada / índice
  carta_texto_portada_cta:        string
  carta_texto_portada_separador:  string
  carta_texto_indice_etiqueta:    string
  carta_texto_indice_titulo:      string
  // Textos footer
  footer_texto_horarios:          string
  footer_texto_contacto:          string
  footer_texto_horarios_fallback: string
  footer_texto_parte_de:          string
  footer_texto_tipo:              string
  footer_texto_derechos:          string
}

const defaults: SiteConfig = {
  // Identidad
  restaurante_nombre:           "",
  restaurante_subtitulo:        "",
  restaurante_descripcion:      "",
  restaurante_boton_hero:       "Ver el menú",
  color_marca:                  "",
  theme_color:                  "",
  favicon_url:                  "",
  restaurante_logo_url:         "",
  lang:                         "es",
  // SEO / Open Graph
  meta_title:                   "",
  meta_descripcion:             "",
  meta_og_image_url:            "",
  meta_og_locale:               "",
  meta_og_url:                  "",
  meta_twitter_card:            "summary_large_image",
  // Hero / Portada
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
  // Pertenencia
  mostrar_pertenencia:          "",
  hosteria_nombre:              "",
  hosteria_url:                 "",
  hosteria_descripcion:         "",
  empresa_nombre:               "",
  empresa_url:                  "",
  empresa_logo_url:             "",
  // Contacto / Footer
  restaurante_footer_direccion: "",
  restaurante_footer_maps_url:  "",
  restaurante_footer_telefono:  "",
  restaurante_footer_email:     "",
  restaurante_footer_horarios:  "",
  restaurante_instagram:        "",
  restaurante_facebook:         "",
  restaurante_whatsapp:         "",
  // Precios
  precio_simbolo:               "$",
  precio_locale:                "es-AR",
  precio_posicion:              "izquierda",
  // Layout carta
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
  // Fuentes banda
  carta_fuente_banda_etiqueta:    "0.55rem",
  carta_fuente_banda_titulo:      "0.95rem",
  carta_fuente_banda_descripcion: "0.6rem",
  // Fuentes items
  carta_fuente_item_nombre:       "0.88rem",
  carta_fuente_item_precio:       "0.88rem",
  carta_fuente_item_descripcion:  "0.68rem",
  carta_fuente_item_tags:         "0.6rem",
  // Fuentes portada
  carta_fuente_portada_etiqueta:    "0.58rem",
  carta_fuente_portada_nombre:      "clamp(1.7rem, 7vw, 2.1rem)",
  carta_fuente_portada_subtitulo:   "0.6rem",
  carta_fuente_portada_descripcion: "0.75rem",
  carta_fuente_portada_cta:         "0.5rem",
  // Fuentes índice
  carta_fuente_indice_etiqueta:  "0.5rem",
  carta_fuente_indice_titulo:    "clamp(1.2rem, 4vw, 1.75rem)",
  carta_fuente_indice_numero:    "0.6rem",
  carta_fuente_indice_categoria: "0.58rem",
  carta_fuente_indice_item:      "clamp(0.82rem, 2.5vw, 0.95rem)",
  // Textos portada / índice
  carta_texto_portada_cta:        "Deslizá para ver la carta",
  carta_texto_portada_separador:  "✦",
  carta_texto_indice_etiqueta:    "Índice",
  carta_texto_indice_titulo:      "La carta",
  // Textos footer
  footer_texto_horarios:          "Horarios",
  footer_texto_contacto:          "Contacto",
  footer_texto_horarios_fallback: "Consultar horarios",
  footer_texto_parte_de:          "Parte de",
  footer_texto_tipo:              "Restaurante",
  footer_texto_derechos:          "Todos los derechos reservados.",
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

/**
 * Formatea un precio según la configuración del tenant.
 * - Si el valor no es numérico lo devuelve tal cual.
 * - precio_posicion: "izquierda" → "$1.500" | "derecha" → "1.500$"
 */
export function formatPrecio(
  raw: string,
  config: Pick<SiteConfig, "precio_simbolo" | "precio_locale" | "precio_posicion">,
): string {
  const num = Number(raw.replace(/[^0-9.,-]/g, "").replace(",", "."))
  if (isNaN(num) || raw.trim() === "") return raw
  const formatted = num.toLocaleString(config.precio_locale || "es-AR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })
  const simbolo = config.precio_simbolo || "$"
  return config.precio_posicion === "derecha"
    ? `${formatted}${simbolo}`
    : `${simbolo}${formatted}`
}

/**
 * Descarga la configuración del tenant desde Google Sheets con ISR (revalidate: 3600).
 *
 * @param sheetId     - ID del spreadsheet (default: MENU_SHEET_ID)
 * @param configSheet - Nombre de la hoja de config (default: "Config")
 */
export async function getConfig(
  sheetId?: string,
  configSheet = "Config",
): Promise<SiteConfig> {
  const id = sheetId ?? process.env.MENU_SHEET_ID
  if (!id) return defaults

  try {
    const url = `https://docs.google.com/spreadsheets/d/${id}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(configSheet)}&headers=0`
    const res = await fetch(url, { next: { revalidate: 3600 } })
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
