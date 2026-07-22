"use client"

import { useEffect, useRef, useState } from "react"
import type { MenuCategory } from "@/lib/get-menu"

interface MenuNavProps {
  categories: Pick<MenuCategory, "id" | "label">[]
  tags?: string[]
  activeTags?: string[]
  onToggleTag?: (tag: string) => void
  onClearTags?: () => void
}

export function MenuNav({
  categories,
  tags = [],
  activeTags = [],
  onToggleTag,
  onClearTags,
}: MenuNavProps) {
  const [activeId, setActiveId] = useState(categories[0]?.id ?? "")
  const itemRefs = useRef<Map<string, HTMLAnchorElement>>(new Map())
  const rafRef   = useRef<number | null>(null)

  // ── Scroll listener con rAF ───────────────────────────────────────
  useEffect(() => {
    const getActiveId = () => {
      const offset = 112 // scroll-mt-28
      let current = categories[0]?.id ?? ""
      for (const cat of categories) {
        const el = document.getElementById(cat.id)
        if (!el) continue
        if (el.getBoundingClientRect().top <= offset) current = cat.id
      }
      return current
    }

    const onScroll = () => {
      if (rafRef.current !== null) return
      rafRef.current = requestAnimationFrame(() => {
        setActiveId(getActiveId())
        rafRef.current = null
      })
    }

    setActiveId(getActiveId())
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", onScroll)
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    }
  }, [categories])

  // ── Centra el tab activo ───────────────────────────────────────
  useEffect(() => {
    itemRefs.current.get(activeId)?.scrollIntoView({
      behavior: "smooth", block: "nearest", inline: "center",
    })
  }, [activeId])

  const hasTags = tags.length > 0

  return (
    <nav
      aria-label="Navegación del menú"
      className="sticky top-0 z-20 border-b border-border bg-background/95 backdrop-blur"
    >
      {/* ── Fila 1: Categorías ────────────────────────────────────────── */}
      <div className="relative">
        <div className="pointer-events-none absolute right-0 top-0 h-full w-8 bg-gradient-to-l from-background to-transparent z-10" aria-hidden="true" />
        <div className="pointer-events-none absolute left-0 top-0 h-full w-8 bg-gradient-to-r from-background to-transparent z-10" aria-hidden="true" />
        <div className="mx-auto flex max-w-4xl items-center gap-0.5 overflow-x-auto px-4 py-3 scrollbar-none">
          <span className="mr-3 shrink-0 font-sans text-xs font-light uppercase tracking-[0.3em] text-primary">Menú</span>
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
                  isActive ? "bg-accent/40 text-foreground" : "text-muted-foreground hover:bg-accent/30 hover:text-foreground",
                ].join(" ")}
              >
                {category.label}
              </a>
            )
          })}
        </div>
      </div>

      {/* ── Fila 2: Filtros ─────────────────────────────────────────── */}
      {hasTags && (
        <div className="border-t border-border/50">
          <div className="mx-auto flex max-w-4xl items-center gap-1.5 overflow-x-auto px-4 py-2 scrollbar-none">
            <span className="mr-2 shrink-0 font-sans text-xs font-light uppercase tracking-[0.3em] text-muted-foreground">Filtrar</span>
            {activeTags.length > 0 && (
              <button
                onClick={onClearTags}
                className="shrink-0 rounded-none border border-foreground/40 bg-foreground/5 px-2 py-1 font-sans text-xs font-light uppercase tracking-wider text-foreground transition-colors hover:bg-foreground/10"
              >
                × Limpiar
              </button>
            )}
            {tags.map((tag) => {
              const isActive = activeTags.includes(tag)
              return (
                <button
                  key={tag}
                  onClick={() => onToggleTag?.(tag)}
                  aria-pressed={isActive}
                  className={[
                    "shrink-0 rounded-none border px-3 py-1 font-sans text-xs font-light uppercase tracking-wider transition-colors duration-200",
                    isActive
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-primary/30 text-primary hover:border-primary hover:bg-primary/10",
                  ].join(" ")}
                >
                  {tag}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </nav>
  )
}
