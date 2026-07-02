"use client"

import type { MenuCategory } from "@/lib/get-menu"

interface MenuNavProps {
  categories: Pick<MenuCategory, "id" | "label">[]
}

export function MenuNav({ categories }: MenuNavProps) {
  return (
    <nav
      aria-label="Categorías del menú"
      className="sticky top-0 z-20 border-b border-border bg-background/90 backdrop-blur"
    >
      <div className="mx-auto flex max-w-4xl items-center gap-1 overflow-x-auto px-4 py-3">
        <span className="mr-2 shrink-0 font-serif text-lg font-medium text-primary">
          Menú
        </span>
        {categories.map((category) => (
          <a
            key={category.id}
            href={`#${category.id}`}
            className="shrink-0 rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            {category.label}
          </a>
        ))}
      </div>
    </nav>
  )
}
