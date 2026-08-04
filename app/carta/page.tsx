import { getMenu }   from "@/lib/get-menu"
import { getConfig } from "@/lib/get-config"
import { CartaView } from "@/components/carta-view"

export const revalidate = 3600

function buildCssVars(color_marca?: string): React.CSSProperties {
  if (!color_marca) return {}
  return {
    ["--primary"]: color_marca,
    ["--ring"]:    color_marca,
  } as React.CSSProperties
}

export default async function CartaPage() {
  const [menu, config] = await Promise.all([getMenu(), getConfig()])
  const cssVars = buildCssVars(config.color_marca)

  return (
    <main className="min-h-screen bg-background" style={cssVars}>
      <CartaView menu={menu} config={config} />
    </main>
  )
}
