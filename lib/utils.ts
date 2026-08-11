import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { resolvePrimaryForeground, resolveHeroInk, sanitizeCssColor } from "./hero-utils"
import type React from "react"
import type { SiteConfig } from "./get-config"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Genera CSS vars de acento para un tenant.
 * Usado en app/page.tsx, app/carta-demo/page.tsx y app/carta/[sucursal]/page.tsx.
 *
 * Todas las variables quedan scoped al <main> de cada página, permitiendo
 * que portal y cada sucursal tengan su propia identidad visual sin pisarse.
 *
 * Variables de carta:
 *   --primary / --ring / --color-acento  → color_marca
 *   --primary-foreground                 → calculado desde color_marca
 *   --hero-ink                           → hero_ink (o calculado desde color_fondo_dia)
 *   --background / --card                → color_fondo_dia
 *   --portada-textos                     → color_portada_textos (fallback: --hero-ink)
 *   --portada-cta                        → color_portada_cta    (fallback: --hero-ink)
 *   --color-nav / --color-seccion / ...  → colores semánticos por zona
 *
 * Variables de portal (solo en modo multi):
 *   --portal-header-bg, --portal-header-color, --portal-etiqueta-color,
 *   --portal-titulo-color, --portal-card-bg, --portal-card-color,
 *   --portal-card-color-hover, --portal-card-border,
 *   --portal-card-border-hover, --portal-card-notas-color,
 *   --portal-card-flecha-color
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

    // Hero ink — scoped al <main> de cada página
    const inkDia = resolveHeroInk(c.hero_ink)
    if (inkDia) vars["--hero-ink"] = inkDia

    // Fondo de carta — scoped al <main> de cada página
    if (z("color_fondo_dia")) {
      vars["--background"] = z("color_fondo_dia")!
      vars["--card"]       = z("color_fondo_dia")!
    }

    // Colores portada — fallback a --hero-ink en el componente
    if (z("color_portada_textos")) vars["--portada-textos"] = z("color_portada_textos")!
    if (z("color_portada_cta"))    vars["--portada-cta"]    = z("color_portada_cta")!

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
