import { MenuHero } from "@/components/menu-hero"
import { MenuNav } from "@/components/menu-nav"
import { MenuSection } from "@/components/menu-section"
import { SignatureDish } from "@/components/signature-dish"
import { MenuFooter } from "@/components/menu-footer"
import { menu } from "@/lib/menu-data"

export default function Page() {
  return (
    <main className="min-h-screen bg-background">
      <MenuHero />
      <MenuNav />
      <div className="mx-auto max-w-4xl px-6">
        {menu.slice(0, 2).map((category) => (
          <MenuSection key={category.id} category={category} />
        ))}
        <div className="py-4">
          <SignatureDish />
        </div>
        {menu.slice(2).map((category) => (
          <MenuSection key={category.id} category={category} />
        ))}
      </div>
      <MenuFooter />
    </main>
  )
}
