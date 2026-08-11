import "server-only"
import { fetchGviz, colGetter } from "./gviz"

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
  hero_pos_contenido:           string
  hero_pos_contenido_mobile:    string
  hero_pos_logo:                string
  hero_pos_logo_mobile:         string
  color_fondo_dia:              string
  // Colores semánticos por zona (todos con fallback a color_marca)
  color_nav:                    string
  color_seccion:                string
  color_especial:               string
  color_cta:                    string
  color_tags:                   string
  color_precio:                 string
  // Pertenencia
  mostrar_pertenencia:          string
  hosteria_nombre:              string
  hosteria_url:                 string
  hosteria_descripcion:         string
  empresa_nombre:               string
  empresa_url:                  string
  empresa_logo_url:             string
  // Portal multisucursal
  portal_etiqueta:              string
  portal_titulo:                string
  portal_titulo_color:          string
  portal_card_color:            string
  portal_card_color_hover:      string
  portal_card_border_hover:     string
  portal_header_bg:             string
  portal_header_color:          string
  portal_etiqueta_color:        string
  portal_card_bg:               string
  portal_card_border:           string
  portal_card_notas_color:      string
  portal_card_flecha_color:     string
  // Contacto / Footer
  mostrar_footer:               string
  restaurante_footer_direccion: string
  restaurante_footer_maps_url:  string
  restaurante_footer_telefono:  string
  restaurante_footer_email:     string
  restaurante_footer_horarios:  string
  restaurante_instagram:        string
  restaurante_facebook:         string
  restaurante_whatsapp:         string
  // Colores footer
  footer_bg:                    string
  footer_color:                 string
  footer_color_acento:          string
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
  restaurante_nombre:           "",
  restaurante_subtitulo:        "",
  restaurante_descripcion:      "",
  restaurante_boton_hero:       "",
  color_marca:                  "",
  theme_color:                  "",
  favicon_url:                  "",
  restaurante_logo_url:         "",
  lang:                         "es",
  meta_title:                   "",
  meta_descripcion:             "",
  meta_og_image_url:            "",
  meta_og_locale:               "",
  meta_og_url:                  "",
  meta_twitter_card:            "summary_large_image",
  hero_color_fondo:             "",
  hero_imagen_fondo_url:        "",
  hero_etiqueta_superior:       "",
  hero_etiqueta_scroll:         "",
  hero_ink:                     "",
  hero_pos_contenido:           "center-right",
  hero_pos_contenido_mobile:    "",
  hero_pos_logo:                "bottom-right",
  hero_pos_logo_mobile:         "",
  color_fondo_dia:              "",
  color_nav:                    "",
  color_seccion:                "",
  color_especial:               "",
  color_cta:                    "",
  color_tags:                   "",
  color_precio:                 "",
  mostrar_pertenencia:          "",
  hosteria_nombre:              "",
  hosteria_url:                 "",
  hosteria_descripcion:         "",
  empresa_nombre:               "",
  empresa_url:                  "",
  empresa_logo_url:             "",
  portal_etiqueta:              "",
  portal_titulo:                "",
  portal_titulo_color:          "",
  portal_card_color:            "",
  portal_card_color_hover:      "",
  portal_card_border_hover:     "",
  portal_header_bg:             "",
  portal_header_color:          "",
  portal_etiqueta_color:        "",
  portal_card_bg:               "",
  portal_card_border:           "",
  portal_card_notas_color:      "",
  portal_card_flecha_color:     "",
  mostrar_footer:               "",
  restaurante_footer_direccion: "",
  restaurante_footer_maps_url:  "",
  restaurante_footer_telefono:  "",
  restaurante_footer_email:     "",
  restaurante_footer_horarios:  "",
  restaurante_instagram:        "",
  restaurante_facebook:         "",
  restaurante_whatsapp:         "",
  footer_bg:                    "",
  footer_color:                 "",
  footer_color_acento:          "",
  precio_simbolo:               "$",
  precio_locale:                "es-AR",
  precio_posicion:              "izquierda",
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
  carta_texto_portada_cta:        "",
  carta_texto_portada_separador:  "",
  carta_texto_indice_etiqueta:    "",
  carta_texto_indice_titulo:      "",
  footer_texto_horarios:          "",
  footer_texto_contacto:          "",
  footer_texto_horarios_fallback: "",
  footer_texto_parte_de:          "",
  footer_texto_tipo:              "",
  footer_texto_derechos:          "",
}

export function normFuente(val: string): string {
  return /^\d+(\.\d+)?$/.test(val.trim()) ? `${val.trim()}px` : val.trim()
}

export function formatPrecio(
  raw: string | number,
  config: Pick<SiteConfig, "precio_simbolo" | "precio_locale" | "precio_posicion">,
): string {
  const str = String(raw ?? "").trim()
  if (!str) return ""
  const num = Number(str.replace(/[^0-9.,-]/g, "").replace(",", "."))
  if (isNaN(num)) return str
  const formatted = num.toLocaleString(config.precio_locale || "es-AR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })
  const simbolo = config.precio_simbolo || "$"
  return config.precio_posicion === "derecha"
    ? `${formatted}${simbolo}`
    : `${simbolo}${formatted}`
}

export async function getConfig(
  sheetId?: string,
  configSheet = "Config",
): Promise<SiteConfig> {
  const id = sheetId ?? process.env.MENU_SHEET_ID
  if (!id) return defaults

  try {
    const table  = await fetchGviz(id, configSheet, 0)
    const config: SiteConfig = { ...defaults }
    for (const row of table.rows) {
      if (!row.c) continue
      const key = row.c[0]?.v != null
        ? String(row.c[0].v).trim() as keyof SiteConfig
        : undefined
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
