import { getMenu }        from "@/lib/get-menu"
import { getConfig }      from "@/lib/get-config"
import { CartaView }      from "@/components/carta-view"
import { MenuFooter }     from "@/components/menu-footer"

// Revalida cada hora (ISR)
export const revalidate = 3600

/**
 * Ruta por defecto: usa MENU_SHEET_ID + MENU_SHEET_NAME del entorno.
 * Es la sucursal principal / sin slug.
 */
export default async function CartaDefaultPage() {
  const [menu, config] = await Promise.all([
    getMenu(),
    getConfig(),
  ])

  return (
    <main className="min-h-screen bg-background">
      <CartaView menu={menu} config={config} />
      <MenuFooter config={config} />
    </main>
  )
}
