import { notFound }       from "next/navigation"
import type { Metadata }  from "next"
import { getSucursal, getSucursalSlugs } from "@/lib/sucursales"
import { getMenu }        from "@/lib/get-menu"
import { getConfig }      from "@/lib/get-config"
import { CartaView }      from "@/components/carta-view"
import { MenuFooter }     from "@/components/menu-footer"
import { resolveHeroInk } from "@/lib/hero-utils"

type Props = { params: Promise<{ sucursal: string }> }

// Revalida cada hora (ISR)
export const revalidate = 3600

export async function generateStaticParams() {
  return getSucursalSlugs().map((slug) => ({ sucursal: slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { sucursal } = await params
  const def = getSucursal(sucursal)
  if (!def) return {}

  const config = await getConfig(def.sheetId)
  const nombre = config.restaurante_nombre || def.label || sucursal
  const title  = config.meta_title || `${nombre} · Menú`

  return {
    title,
    description: config.meta_descripcion || config.restaurante_descripcion || undefined,
    openGraph: {
      title,
      siteName: nombre,
      ...(config.meta_og_image_url && { images: [{ url: config.meta_og_image_url }] }),
    },
  }
}

export default async function CartaSucursalPage({ params }: Props) {
  const { sucursal } = await params
  const def = getSucursal(sucursal)
  if (!def) notFound()

  const [menu, config] = await Promise.all([
    getMenu(def.sheetId, def.sheetName),
    getConfig(def.sheetId),
  ])

  const inkDia   = resolveHeroInk(config.hero_ink)
  const inkNoche = resolveHeroInk(config.hero_ink_noche)

  // CSS vars dinámicas del tenant (color de marca, fondos, ink)
  const cssVars = [
    config.color_marca      ? `--primary: ${config.color_marca};`            : "",
    config.color_fondo_dia  ? `--background: ${config.color_fondo_dia};`     : "",
    config.color_fondo_noche
      ? `/* dark */ --background-dark: ${config.color_fondo_noche};`        : "",
    inkDia   ? `--hero-ink: ${inkDia};`         : "",
    inkNoche ? `--hero-ink-noche: ${inkNoche};` : "",
  ].filter(Boolean).join(" ")

  return (
    <main
      className="min-h-screen bg-background"
      style={cssVars ? ({ cssText: cssVars } as React.CSSProperties) : undefined}
    >
      <CartaView menu={menu} config={config} />
      <MenuFooter config={config} />
    </main>
  )
}
