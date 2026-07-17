"use client"

import { useState, useEffect } from "react"
import type { MenuCategory } from "@/lib/get-menu"

interface TagFilterProps {
  tags: string[]
  categories: MenuCategory[]
}

export function TagFilter({ tags, categories }: TagFilterProps) {
  const [active, setActive] = useState<string | null>(null)

  useEffect(() => {
    for (const cat of categories) {
      const section = document.getElementById(cat.id)
      if (!section) continue

      // Los <li> son hijos directos del <ul> — sin wrapper intermedio
      const items = section.querySelectorAll<HTMLLIElement>("li[data-tags]")
      let visibleCount = 0

      for (const li of items) {
        const itemTags = (li.dataset.tags ?? "")
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean)

        // Sin tag activo ("Todos") → mostrar siempre
        // Con tag activo → mostrar solo si el item lo tiene
        const show = active === null || itemTags.includes(active)
        li.style.display = show ? "" : "none"
        if (show) visibleCount++
      }

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
