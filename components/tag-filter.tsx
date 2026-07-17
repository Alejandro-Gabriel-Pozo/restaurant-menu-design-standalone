"use client"

import { useState, useEffect } from "react"
import type { MenuCategory } from "@/lib/get-menu"

interface TagFilterProps {
  tags: string[]
  categories: MenuCategory[]
}

/**
 * Barra de filtro por tag. Cuando se selecciona un tag:
 * - Muestra solo los items que lo tienen
 * - Oculta secciones que quedan sin items visibles
 * Opera sobre el DOM para no re-renderizar el árbol completo.
 */
export function TagFilter({ tags, categories }: TagFilterProps) {
  const [active, setActive] = useState<string | null>(null)

  useEffect(() => {
    // Aplica visibilidad sobre los <li> y <section> del DOM
    for (const cat of categories) {
      const section = document.getElementById(cat.id)
      if (!section) continue

      let visibleCount = 0
      const items = section.querySelectorAll<HTMLLIElement>("ul > li[data-tags]")

      for (const li of items) {
        const itemTags = (li.dataset.tags ?? "").split(",").map((t) => t.trim())
        const show = !active || itemTags.includes(active)
        li.style.display = show ? "" : "none"
        if (show) visibleCount++
      }

      // Oculta la section entera si no tiene items visibles
      section.style.display = visibleCount === 0 ? "none" : ""
    }
  }, [active, categories])

  if (!tags.length) return null

  return (
    <div
      aria-label="Filtrar por etiqueta"
      className="mx-auto max-w-4xl px-6 pt-8 pb-2"
    >
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setActive(null)}
          aria-pressed={active === null}
          className={[
            "rounded-none border px-3 py-1 font-sans text-xs font-light uppercase tracking-wider transition-colors",
            active === null
              ? "border-foreground bg-foreground text-background"
              : "border-border text-muted-foreground hover:border-foreground hover:text-foreground",
          ].join(" ")}
        >
          Todos
        </button>
        {tags.map((tag) => (
          <button
            key={tag}
            onClick={() => setActive(active === tag ? null : tag)}
            aria-pressed={active === tag}
            className={[
              "rounded-none border px-3 py-1 font-sans text-xs font-light uppercase tracking-wider transition-colors",
              active === tag
                ? "border-primary bg-primary text-primary-foreground"
                : "border-primary/30 text-primary hover:border-primary hover:bg-primary/10",
            ].join(" ")}
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  )
}
