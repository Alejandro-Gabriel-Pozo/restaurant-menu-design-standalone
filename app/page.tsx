import { MenuHero } from "@/components/menu-hero"
import { MenuNav } from "@/components/menu-nav"
import { MenuSection } from "@/components/menu-section"
import { SignatureDish } from "@/components/signature-dish"
import { MenuFooter } from "@/components/menu-footer"
import { getMenu } from "@/lib/get-menu"
import { getConfig } from "@/lib/get-config"

export const dynamic = "force-dynamic"

// Aplica el color de marca como variable CSS --primary si está definido en la hoja
function buildCssVars(config: Awaited<ReturnType<typeof getConfig>>): React.CSSProperties {
  const vars: Record<string, string> = {}
  if (config.color_marca) {
    vars["--primary"] = config.color_marca
    vars["--ring"] = config.color_marca
  }
  return vars as React.CSSProperties
}

export default async function Page() {
  const [menu, config] = await Promise.all([getMenu(), getConfig()])

  const specialItem = menu
    .flatMap((c) => c.items)
    .find((i) => i.especial)

  const half = Math.ceil(menu.length / 2)
  const cssVars = buildCssVars(config)

  return (
    <main className="min-h-screen bg-background" style={cssVars}>
      <MenuHero config={config} />
      <MenuNav categories={menu} />
      <div className="mx-auto max-w-4xl px-6">
        {menu.slice(0, half).map((category) => (
          <MenuSection key={category.id} category={category} />
        ))}
        <div className="py-4">
          <SignatureDish item={specialItem} />
        </div>
        {menu.slice(half).map((category) => (
          <MenuSection key={category.id} category={category} />
        ))}
      </div>
      <MenuFooter config={config} />
    </main>
  )
}
