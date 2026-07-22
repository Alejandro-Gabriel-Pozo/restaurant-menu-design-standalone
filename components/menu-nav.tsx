"use client"

import { useEffect, useRef, useState } from "react"
import type { MenuCategory } from "@/lib/get-menu"

interface MenuNavProps {
  categories: Pick<MenuCategory, "id" | "label">[]
  tags?: string[]
  onTagChange?: (tags: Set<string>) => void
  activeTags?: Set<string>
}

export function MenuNav({
  categories,
  tags = [],
  onTagChange,
  activeTags = new Set(),
}: MenuNavProps) {
  const [activeId, setActiveId] = useState(categories[0]?.id ?? "")
  const itemRefs = useRef<Map<string, HTMLAnchorElement>>(new Map())

  // ── Observer robusto: trackea TODAS las secciones y elige la más alta visible ──
  useEffect(() => {
    const sections = categories
      .map((c) => document.getElementById(c.id))
      .filter(Boolean) as HTMLElement[]
    if (!sections.length) return

    // Mapa id → ratio de intersección actual, persiste entre callbacks
    const ratioMap = new Map<string, number>(sections.map((s) => [s.id, 0]))

    const pick = () => {
      // Prefer the topmost section with ratio > 0;
      // fall back to the section with the highest ratio
      const visible = sections.filter((s) => (ratioMap.get(s.id) ?? 0) > 0)
      if (visible.length) {
        setActiveId(visible[0].id)
        return
      }
      // Si ninguna sección está visible (scroll rápido), buscar la más cercana
      const best = sections.reduce((a, b) =>
        (ratioMap.get(a.id) ?? 0) >= (ratioMap.get(b.id) ?? 0) ? a : b
      )
      setActiveId(best.id)
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => ratioMap.set(e.target.id, e.intersectionRatio))
        pick()
      },
      // rootMargin generoso: detecta secciones que ocupan poca altura en pantalla
      { rootMargin: "0px 0px -30% 0px", threshold: Array.from({ length: 11 }, (_, i) => i / 10) }
    )
    sections.forEach((s) => observer.observe(s))
    return () => observer.disconnect()
  }, [categories])

  // ── Scroll automático del tab activo al centro ───────────────────────────
  useEffect(() => {
    itemRefs.current.get(activeId)?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    })
  }, [activeId])

  const hasTags = tags.length > 0

  // ── Toggle multi-tag ──────────────────────────────────────────────────
  const toggleTag = (tag: string) => {
    const next = new Set(activeTags)
    if (next.has(tag)) next.delete(tag)
    else next.add(tag)
    onTagChange?.(next)
  }

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

      {/* ── Fila 2: Filtros multi-tag ─────────────────────────────────────── */}
      {hasTags && (
        <div className="border-t border-border/50">
          <div className="mx-auto flex max-w-4xl items-center gap-1.5 overflow-x-auto px-4 py-2 scrollbar-none">
            <span className="mr-2 shrink-0 font-sans text-xs font-light uppercase tracking-[0.3em] text-muted-foreground">
              Filtrar
            </span>

            {/* Limpiar — solo visible cuando hay tags activos */}
            {activeTags.size > 0 && (
              <button
                onClick={() => onTagChange?.(new Set())}
                className="shrink-0 rounded-none border border-foreground/40 bg-foreground/5 px-2 py-1 font-sans text-xs font-light uppercase tracking-wider text-foreground transition-colors hover:bg-foreground/10"
              >
                × Limpiar
              </button>
            )}

            {tags.map((tag) => {
              const isActive = activeTags.has(tag)
              return (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
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
