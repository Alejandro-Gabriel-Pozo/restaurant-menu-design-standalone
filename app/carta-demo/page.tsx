import { getMenu }      from "@/lib/get-menu"
import { getConfig }    from "@/lib/get-config"
import { CartaView }    from "@/components/carta-view"
import { buildCssVars } from "@/lib/utils"

export const revalidate = 3600

export default async function CartaDemoPage() {
  const [menu, config] = await Promise.all([getMenu(), getConfig()])

  return (
    <main className="min-h-screen bg-background" style={buildCssVars(config)}>
      <CartaView menu={menu} config={config} />
    </main>
  )
}
