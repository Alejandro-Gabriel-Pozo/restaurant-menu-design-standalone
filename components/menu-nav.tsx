"use client"

import { useEffect, useRef, useState } from "react"
import type { MenuCategory } from "@/lib/get-menu"

interface MenuNavProps {
  categories: Pick<MenuCategory, "id" | "label">[]
  tags?: string[]
  onTagChange?: (tag: string | null) => void
  activeTag?: string | null
}

export function MenuNav({ categories, tags = [], onTagChange, activeTag = null }: MenuNavProps) {
  const [activeId, setActiveId] = useState(categories[0]?.id ?? "")
  const itemRefs = useRef<Map<string, HTMLAnchorElement>>(new Map())

  // ── Detectar sección visible ───────────────────────────────────────────────
  useEffect(() => {
    const sections = categories
      .map((c) => document.getElementById(c.id))
      .filter(Boolean) as HTMLElement[]
    if (!sections.length) return
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        if (visible[0]?.target?.id) setActiveId(visible[0].target.id)
      },
      { rootMargin: "-25% 0px -55% 0px", threshold: [0.1, 0.25, 0.5] }
    )
    sections.forEach((s) => observer.observe(s))
    return () => observer.disconnect()
  }, [categories])

  // ── Scroll automático del tab activo al centro ───────────────────────────
  useEffect(() => {
    const activeEl = itemRefs.current.get(activeId)
    if (!activeEl) return
    activeEl.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" })
  }, [activeId])

  const hasTags = tags.length > 0

  return (
    <nav
      aria-label="Navegación del menú"
      className="sticky top-0 z-20 border-b border-border bg-background/95 backdrop-blur"
    >
      {/* ── Fila 1: Categorías ───────────────────────────────────────────── */}
      <div className="relative">
        <div className="pointer-events-none absolute right-0 top-0 h-full w-8 bg-gradient-to-l from-background to-transparent z-10" aria-hidden="true" />
        <div className="pointer-events-none absolute left-0 top-0 h-full w-8 bg-gradient-to-r from-background to-transparent z-10" aria-hidden="true" />
        <div className="mx-auto flex max-w-4xl items-center gap-0.5 overflow-x-auto px-4 py-3 scrollbar-none">
          <span className="mr-3 shrink-0 font-sans text-xs font-light uppercase tracking-[0.3em] text-primary">
            Menú
          </span>
          {categories.map((category) => {
            const isActive = activeId === category.id
            return (
              <a
                key={category.id}
                href={`#${category.id}`}
                aria-current={isActive ? "true" : undefined}
                ref={(el) => {
                  if (el) itemRefs.current.set(category.id, el)
                  else itemRefs.current.delete(category.id)
                }}
                className={[
                  "shrink-0 rounded-none px-3 py-2 font-sans text-xs font-light uppercase tracking-wider transition-colors",
                  isActive
                    ? "bg-accent/40 text-foreground"
                    : "text-muted-foreground hover:bg-accent/30 hover:text-foreground",
                ].join(" ")}
              >
                {category.label}
              </a>
            )
          })}
        </div>
      </div>

      {/* ── Fila 2: Filtros de tag (solo si hay tags) ─────────────────────── */}
      {hasTags && (
        <div className="border-t border-border/50">
          <div className="mx-auto flex max-w-4xl items-center gap-0.5 overflow-x-auto px-4 py-2 scrollbar-none">
            <span className="mr-3 shrink-0 font-sans text-xs font-light uppercase tracking-[0.3em] text-muted-foreground">
              Filtrar
            </span>

            {/* Botón Todos */}
            <button
              onClick={() => onTagChange?.(null)}
              aria-pressed={activeTag === null}
              className={[
                "shrink-0 rounded-none border px-3 py-1 font-sans text-xs font-light uppercase tracking-wider transition-colors duration-200",
                activeTag === null
                  ? "border-foreground bg-foreground text-background"
                  : "border-border text-muted-foreground hover:border-foreground hover:text-foreground",
              ].join(" ")}
            >
              Todos
            </button>

            {tags.map((tag) => (
              <button
                key={tag}
                onClick={() => onTagChange?.(activeTag === tag ? null : tag)}
                aria-pressed={activeTag === tag}
                className={[
                  "shrink-0 rounded-none border px-3 py-1 font-sans text-xs font-light uppercase tracking-wider transition-colors duration-200",
                  activeTag === tag
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-primary/30 text-primary hover:border-primary hover:bg-primary/10",
                ].join(" ")}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}
