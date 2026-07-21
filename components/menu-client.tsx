"use client"

import { useState } from "react"
import { MenuHero }     from "@/components/menu-hero"
import { MenuNav }      from "@/components/menu-nav"
import { MenuSection }  from "@/components/menu-section"
import { SignatureDish } from "@/components/signature-dish"
import { MenuFooter }   from "@/components/menu-footer"
import { TagFilter }    from "@/components/tag-filter"
import { DarkToggle }   from "@/components/dark-toggle"
import type { MenuCategory } from "@/lib/get-menu"
import type { SiteConfig }   from "@/lib/get-config"

interface MenuClientProps {
  menu:   MenuCategory[]
  config: SiteConfig
}

export function MenuClient({ menu, config }: MenuClientProps) {
  const [activeTag, setActiveTag] = useState<string | null>(null)

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

      {/* Nav unificado: fila 1 = categorías, fila 2 = filtros */}
      <MenuNav
        categories={menu}
        tags={allTags}
        activeTag={activeTag}
        onTagChange={setActiveTag}
      />

      {/* Panel de resultados del filtro */}
      {activeTag !== null && (
        <TagFilter tags={allTags} categories={menu} activeTag={activeTag} />
      )}

      {/* Menú completo — se oculta cuando hay filtro activo */}
      {activeTag === null && (
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
