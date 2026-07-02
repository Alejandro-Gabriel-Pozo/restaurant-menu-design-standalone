"use client"

import type { MenuCategory } from "@/lib/get-menu"

interface MenuNavProps {
  categories: Pick<MenuCategory, "id" | "label">[]
}

export function MenuNav({ categories }: MenuNavProps) {
  return (
    <nav
      aria-label="Categorías del menú"
      className="sticky top-0 z-20 border-b border-border bg-background/95 backdrop-blur"
    >
      <div className="mx-auto flex max-w-4xl items-center gap-0.5 overflow-x-auto px-4 py-3">
        <span className="mr-3 shrink-0 font-sans text-xs font-light uppercase tracking-[0.3em] text-primary">
          Menú
        </span>
        {categories.map((category) => (
          <a
            key={category.id}
            href={`#${category.id}`}
            className="shrink-0 rounded-none px-3 py-2 font-sans text-xs font-light uppercase tracking-wider text-muted-foreground transition-colors hover:bg-accent/30 hover:text-foreground"
          >
            {category.label}
          </a>
        ))}
      </div>
    </nav>
  )
}
