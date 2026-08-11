import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { resolvePrimaryForeground } from "./hero-utils"
import { sanitizeCssColor } from "./hero-utils"
import type React from "react"
import type { SiteConfig } from "./get-config"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Genera CSS vars de acento para un tenant.
 * Usado en app/page.tsx, app/carta-demo/page.tsx y app/carta/[sucursal]/page.tsx.
 *
 * Inyecta --primary (Tailwind) + variables semánticas por zona:
 *   --color-acento          → base (color_marca)
 *   --color-nav             → nav de categorías  (color_nav ?? color_marca)
 *   --color-seccion         → labels de sección  (color_seccion ?? color_marca)
 *   --color-especial        → plato destacado    (color_especial ?? color_marca)
 *   --color-cta             → botón CTA portada  (color_cta ?? color_marca)
 *   --color-tags            → tags activos       (color_tags ?? color_marca)
 *   --color-precio          → precios en carta   (color_precio ?? color_marca)
 *
 * Variables de portal (solo en modo multi):
 *   --portal-header-bg          portal_header_bg
 *   --portal-header-color       portal_header_color
 *   --portal-etiqueta-color     portal_etiqueta_color
 *   --portal-titulo-color       portal_titulo_color
 *   --portal-card-bg            portal_card_bg
 *   --portal-card-color         portal_card_color
 *   --portal-card-color-hover   portal_card_color_hover
 *   --portal-card-border        portal_card_border
 *   --portal-card-border-hover  portal_card_border_hover
 *   --portal-card-notas-color   portal_card_notas_color
 *   --portal-card-flecha-color  portal_card_flecha_color
 *
 * @example
 * <main style={buildCssVars(config)}>
 */
export function buildCssVars(configOrMarca: SiteConfig | string | undefined): React.CSSProperties {
  // Compatibilidad retroactiva: acepta string (color_marca directo)
  const marca: string =
    typeof configOrMarca === "string"
      ? configOrMarca
      : configOrMarca?.color_marca ?? ""

  const vars: Record<string, string> = {}

  if (marca) {
    const fg = resolvePrimaryForeground(marca)
    vars["--primary"]       = marca
    vars["--ring"]          = marca
    vars["--color-acento"]  = marca
    if (fg) vars["--primary-foreground"] = fg
  }

  if (typeof configOrMarca === "object" && configOrMarca !== null) {
    const c = configOrMarca
    const z = (key: keyof SiteConfig) => {
      const val = sanitizeCssColor((c[key] as string) ?? "")
      return val || undefined
    }

    // Colores semánticos por zona (carta)
    if (z("color_nav"))      vars["--color-nav"]      = z("color_nav")!
    if (z("color_seccion"))  vars["--color-seccion"]  = z("color_seccion")!
    if (z("color_especial")) vars["--color-especial"] = z("color_especial")!
    if (z("color_cta"))      vars["--color-cta"]      = z("color_cta")!
    if (z("color_tags"))     vars["--color-tags"]     = z("color_tags")!
    if (z("color_precio"))   vars["--color-precio"]   = z("color_precio")!

    // Colores del portal multisucursal
    if (z("portal_header_bg"))         vars["--portal-header-bg"]         = z("portal_header_bg")!
    if (z("portal_header_color"))      vars["--portal-header-color"]      = z("portal_header_color")!
    if (z("portal_etiqueta_color"))    vars["--portal-etiqueta-color"]    = z("portal_etiqueta_color")!
    if (z("portal_titulo_color"))      vars["--portal-titulo-color"]      = z("portal_titulo_color")!
    if (z("portal_card_bg"))           vars["--portal-card-bg"]           = z("portal_card_bg")!
    if (z("portal_card_color"))        vars["--portal-card-color"]        = z("portal_card_color")!
    if (z("portal_card_color_hover"))  vars["--portal-card-color-hover"]  = z("portal_card_color_hover")!
    if (z("portal_card_border"))       vars["--portal-card-border"]       = z("portal_card_border")!
    if (z("portal_card_border_hover")) vars["--portal-card-border-hover"] = z("portal_card_border_hover")!
    if (z("portal_card_notas_color"))  vars["--portal-card-notas-color"]  = z("portal_card_notas_color")!
    if (z("portal_card_flecha_color")) vars["--portal-card-flecha-color"] = z("portal_card_flecha_color")!
  }

  return vars as React.CSSProperties
}
