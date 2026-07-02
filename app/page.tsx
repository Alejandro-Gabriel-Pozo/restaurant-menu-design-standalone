import { MenuHero } from "@/components/menu-hero"
import { MenuNav } from "@/components/menu-nav"
import { MenuSection } from "@/components/menu-section"
import { SignatureDish } from "@/components/signature-dish"
import { MenuFooter } from "@/components/menu-footer"
import { getMenu } from "@/lib/get-menu"
import type { MenuCategory } from "@/lib/menu-data"

export default async function Page() {
  const sheetItems = await getMenu()

  // Agrupa los SheetMenuItems por categoría y los convierte al formato
  // MenuCategory que espera MenuSection
  const categoryMap = new Map<string, MenuCategory>()

  for (const item of sheetItems) {
    const id = item.category.toLowerCase().replace(/\s+/g, "-")

    if (!categoryMap.has(id)) {
      categoryMap.set(id, {
        id,
        label: item.category,
        title: item.category,
        description: "",
        items: [],
      })
    }

    categoryMap.get(id)!.items.push({
      name: item.name,
      description: item.description ?? "",
      price: `$${item.price.toLocaleString("es-AR")}`,
      tags: item.tags,
    })
  }

  const menu = Array.from(categoryMap.values())
  const half = Math.ceil(menu.length / 2)

  return (
    <main className="min-h-screen bg-background">
      <MenuHero />
      <MenuNav />
      <div className="mx-auto max-w-4xl px-6">
        {menu.slice(0, half).map((category) => (
          <MenuSection key={category.id} category={category} />
        ))}
        <div className="py-4">
          <SignatureDish />
        </div>
        {menu.slice(half).map((category) => (
          <MenuSection key={category.id} category={category} />
        ))}
      </div>
      <MenuFooter />
    </main>
  )
}
