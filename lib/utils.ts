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
 *   --color-acento   → base (color_marca)
 *   --color-nav      → nav de categorías  (color_nav ?? color_marca)
 *   --color-seccion  → labels de sección  (color_seccion ?? color_marca)
 *   --color-especial → plato destacado    (color_especial ?? color_marca)
 *   --color-cta      → botón CTA portada  (color_cta ?? color_marca)
 *   --color-tags     → tags activos       (color_tags ?? color_marca)
 *   --color-precio   → precios en carta   (color_precio ?? color_marca)
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

  if (!marca) return {}

  const fg = resolvePrimaryForeground(marca)

  const vars: Record<string, string> = {
    "--primary":  marca,
    "--ring":     marca,
    "--color-acento": marca,
    ...(fg && { "--primary-foreground": fg }),
  }

  if (typeof configOrMarca === "object" && configOrMarca !== null) {
    const c = configOrMarca
    const z = (key: string) => {
      const val = sanitizeCssColor((c as Record<string, string>)[key] ?? "")
      return val || undefined
    }
    if (z("color_nav"))      vars["--color-nav"]      = z("color_nav")!
    if (z("color_seccion"))  vars["--color-seccion"]  = z("color_seccion")!
    if (z("color_especial")) vars["--color-especial"] = z("color_especial")!
    if (z("color_cta"))      vars["--color-cta"]      = z("color_cta")!
    if (z("color_tags"))     vars["--color-tags"]     = z("color_tags")!
    if (z("color_precio"))   vars["--color-precio"]   = z("color_precio")!
  }

  return vars as React.CSSProperties
}
