"use client"

import { useState, useCallback } from "react"
import { MenuHero }     from "@/components/menu-hero"
import { MenuNav }      from "@/components/menu-nav"
import { MenuSection }  from "@/components/menu-section"
import { SignatureDish } from "@/components/signature-dish"
import { MenuFooter }   from "@/components/menu-footer"
import { TagFilter }    from "@/components/tag-filter"
import type { MenuCategory } from "@/lib/get-menu"
import type { SiteConfig }   from "@/lib/get-config"

export function MenuClient({ menu, config }: { menu: MenuCategory[]; config: SiteConfig }) {
  const [activeTags, setActiveTags] = useState<string[]>([])

  const toggleTag = useCallback((tag: string) => {
    setActiveTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    )
  }, [])

  const clearTags = useCallback(() => setActiveTags([]), [])

  const specialItem     = menu.flatMap((c) => c.items).find((i) => i.especial)
  const half            = Math.ceil(menu.length / 2)
  const firstCategoryId = menu[0]?.id

  const allTags = [...new Set(
    menu.flatMap((c) => c.items.flatMap((i) => i.tags ?? []))
  )].sort()

  return (
    <>
      {/* DarkToggle vive dentro de MenuHero */}
      <MenuHero config={config} firstCategoryId={firstCategoryId} />

      <MenuNav
        categories={menu}
        tags={allTags}
        activeTags={activeTags}
        onToggleTag={toggleTag}
        onClearTags={clearTags}
      />

      {activeTags.length > 0 && (
        <TagFilter categories={menu} activeTags={activeTags} />
      )}

      {activeTags.length === 0 && (
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
