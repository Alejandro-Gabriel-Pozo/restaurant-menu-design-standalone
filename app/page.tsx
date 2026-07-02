import { MenuHero } from "@/components/menu-hero"
import { MenuNav } from "@/components/menu-nav"
import { MenuSection } from "@/components/menu-section"
import { SignatureDish } from "@/components/signature-dish"
import { MenuFooter } from "@/components/menu-footer"
import { getMenu } from "@/lib/get-menu"

export default async function Page() {
  const menu = await getMenu()

  // Ítem especial: el primero marcado como especial en toda la carta
  const specialItem = menu
    .flatMap((c) => c.items)
    .find((i) => i.especial)

  const half = Math.ceil(menu.length / 2)

  return (
    <main className="min-h-screen bg-background">
      <MenuHero />
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
      <MenuFooter />
    </main>
  )
}
