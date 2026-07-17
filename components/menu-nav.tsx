"use client"

import { useEffect, useState } from "react"
import type { MenuCategory } from "@/lib/get-menu"

interface MenuNavProps {
  categories: Pick<MenuCategory, "id" | "label">[]
}

export function MenuNav({ categories }: MenuNavProps) {
  const [activeId, setActiveId] = useState(categories[0]?.id ?? "")
  const [dark, setDark]         = useState(false)

  // Inicializa dark mode
  useEffect(() => {
    const stored = localStorage.getItem("theme")
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    const isDark = stored ? stored === "dark" : prefersDark
    setDark(isDark)
    document.documentElement.classList.toggle("dark", isDark)
  }, [])

  function toggleDark() {
    const next = !dark
    setDark(next)
    document.documentElement.classList.toggle("dark", next)
    localStorage.setItem("theme", next ? "dark" : "light")
  }

  // IntersectionObserver para sección activa
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

  return (
    <nav
      aria-label="Categorías del menú"
      className="sticky top-0 z-20 border-b border-border bg-background/95 backdrop-blur"
    >
      {/* Fila principal: scroll horizontal de links + toggle fijo a la derecha */}
      <div className="relative flex items-center">

        {/* Scroll horizontal — solo los links de categorías */}
        <div className="relative min-w-0 flex-1">
          {/* Degradado hint scroll */}
          <div
            className="pointer-events-none absolute right-0 top-0 h-full w-8 bg-gradient-to-l from-background to-transparent z-10"
            aria-hidden="true"
          />
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

        {/* Toggle dark mode — fijo fuera del scroll, siempre visible */}
        <div className="shrink-0 border-l border-border px-3 py-3">
          <button
            onClick={toggleDark}
            aria-label={dark ? "Modo claro" : "Modo oscuro"}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary active:scale-95"
          >
            {dark ? (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <circle cx="12" cy="12" r="5"/>
                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
              </svg>
            ) : (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            )}
          </button>
        </div>
      </div>
    </nav>
  )
}
