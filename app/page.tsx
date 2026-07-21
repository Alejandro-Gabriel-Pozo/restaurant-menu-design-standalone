import { MenuClient }  from "@/components/menu-client"
import { getMenu }     from "@/lib/get-menu"
import { getConfig }   from "@/lib/get-config"

export const revalidate = 3600

function buildCssVars(color_marca?: string): React.CSSProperties {
  if (!color_marca) return {}
  return {
    ["--primary"]: color_marca,
    ["--ring"]:    color_marca,
  } as React.CSSProperties
}

export default async function Page() {
  const [menu, config] = await Promise.all([getMenu(), getConfig()])
  const cssVars = buildCssVars(config.color_marca)

  return (
    <main className="min-h-screen bg-background" style={cssVars}>
      <MenuClient menu={menu} config={config} />
    </main>
  )
}
