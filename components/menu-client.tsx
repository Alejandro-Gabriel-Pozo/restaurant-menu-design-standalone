"use client"

import { useState } from "react"
import { MenuHero }      from "@/components/menu-hero"
import { MenuNav }       from "@/components/menu-nav"
import { MenuSection }   from "@/components/menu-section"
import { SignatureDish }  from "@/components/signature-dish"
import { MenuFooter }    from "@/components/menu-footer"
import { TagFilter }     from "@/components/tag-filter"
import { DarkToggle }    from "@/components/dark-toggle"
import type { MenuCategory } from "@/lib/get-menu"
import type { SiteConfig }   from "@/lib/get-config"

export function MenuClient({ menu, config }: { menu: MenuCategory[]; config: SiteConfig }) {
  const [activeTags, setActiveTags] = useState<Set<string>>(new Set())

  const specialItem     = menu.flatMap((c) => c.items).find((i) => i.especial)
  const half            = Math.ceil(menu.length / 2)
  const firstCategoryId = menu[0]?.id

  const allTags = [...new Set(
    menu.flatMap((c) => c.items.flatMap((i) => i.tags ?? []))
  )].sort()

  return (
    <>
      <DarkToggle />
      <MenuHero config={config} firstCategoryId={firstCategoryId} />

      <MenuNav
        categories={menu}
        tags={allTags}
        activeTags={activeTags}
        onTagChange={setActiveTags}
      />

      {/* Panel de resultados filtrados */}
      {activeTags.size > 0 && (
        <TagFilter categories={menu} activeTags={activeTags} />
      )}

      {/* Menú completo — oculto mientras hay filtro activo */}
      {activeTags.size === 0 && (
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
      )}

      <MenuFooter config={config} />
    </>
  )
}
