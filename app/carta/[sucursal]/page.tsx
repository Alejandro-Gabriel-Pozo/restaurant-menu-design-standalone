import { notFound }             from "next/navigation"
import type { Metadata }        from "next"
import { getSucursal, getSucursalSlugs } from "@/lib/sucursales"
import { getMenu }              from "@/lib/get-menu"
import { getConfig }            from "@/lib/get-config"
import { CartaView }            from "@/components/carta-view"
import { MenuFooter }           from "@/components/menu-footer"
import { resolveHeroInk }       from "@/lib/hero-utils"

type Props = { params: Promise<{ sucursal: string }> }

export const revalidate = 3600

export async function generateStaticParams() {
  const slugs = await getSucursalSlugs()
  return slugs.map((slug) => ({ sucursal: slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { sucursal } = await params
  const def = await getSucursal(sucursal)
  if (!def || !def.activa) return {}

  const config = await getConfig(def.sheetId, def.configSheet)
  const nombre = config.restaurante_nombre || def.label
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
  const def = await getSucursal(sucursal)

  // 404 si no existe o está desactivada
  if (!def || !def.activa) notFound()

  const [menu, config] = await Promise.all([
    getMenu(def.sheetId, def.sheetName),
    getConfig(def.sheetId, def.configSheet),
  ])

  const inkDia   = resolveHeroInk(config.hero_ink)
  const inkNoche = resolveHeroInk(config.hero_ink_noche)

  const inlineVars: React.CSSProperties = {
    ...(config.color_marca     && { ["--primary" as string]:        config.color_marca }),
    ...(config.color_fondo_dia && { ["--background" as string]:     config.color_fondo_dia }),
    ...(inkDia                 && { ["--hero-ink" as string]:       inkDia }),
    ...(inkNoche               && { ["--hero-ink-noche" as string]: inkNoche }),
  }

  return (
    <main className="min-h-screen bg-background" style={inlineVars}>
      <CartaView menu={menu} config={config} />
      <MenuFooter config={config} />
    </main>
  )
}
