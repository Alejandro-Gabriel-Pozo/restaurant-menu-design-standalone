"use client"

import { useRef, useState, useCallback, useEffect, type ReactNode } from "react"
import Link from "next/link"
import { DarkToggle } from "@/components/dark-toggle"

interface Props {
  children: ReactNode
  /** page id del índice para el botón "Volver" */
  indexPageId?: string
}

export function CartaControls({ children, indexPageId = "indice-0" }: Props) {
  const sliderRef = useRef<HTMLDivElement>(null)
  const [current, setCurrent] = useState(0)
  const [total,   setTotal]   = useState(0)
  const [pages,   setPages]   = useState<string[]>([])

  useEffect(() => {
    const els = Array.from(sliderRef.current?.querySelectorAll<HTMLElement>("[data-page]") ?? [])
    setTotal(els.length)
    setPages(els.map(el => el.dataset.page ?? ""))
  }, [])

  const onScroll = useCallback(() => {
    const el = sliderRef.current
    if (!el) return
    setCurrent(Math.round(el.scrollLeft / el.clientWidth))
  }, [])

  const goTo = useCallback((idx: number) => {
    const el = sliderRef.current
    if (!el) return
    el.scrollTo({ left: idx * el.clientWidth, behavior: "smooth" })
  }, [])

  const goToId = useCallback((id: string) => {
    const idx = pages.indexOf(id)
    if (idx !== -1) goTo(idx)
  }, [pages, goTo])

  const prev = () => goTo(Math.max(0, current - 1))
  const next = () => goTo(Math.min(total - 1, current + 1))

  // ¿La página actual es una categoría (no portada ni índice)?
  const isCategory = pages[current] && !pages[current].startsWith("portada") && !pages[current].startsWith("indice")

  return (
    <div className="relative h-svh w-full overflow-hidden bg-background">

      {/* ── Barra superior ── */}
      <div className="absolute left-0 right-0 top-0 z-30 flex items-center justify-between px-5 py-3 print:hidden">
        <Link href="/" className="font-sans text-[10px] font-light uppercase tracking-[0.35em] text-foreground/60 hover:text-foreground transition-colors">
          ← Menú
        </Link>
        <div className="flex items-center gap-4">
          <button onClick={() => window.print()} className="font-sans text-[10px] font-light uppercase tracking-[0.35em] text-foreground/60 hover:text-foreground transition-colors">
            Imprimir
          </button>
          <DarkToggle />
        </div>
      </div>

      {/* ── Slider ── */}
      <div
        ref={sliderRef}
        onScroll={onScroll}
        className="carta-slider h-full w-full"
        style={{
          display: "flex",
          overflowX: "auto",
          overflowY: "hidden",
          scrollSnapType: "x mandatory",
          scrollBehavior: "smooth",
          WebkitOverflowScrolling: "touch",
          msOverflowStyle: "none",
          scrollbarWidth: "none",
        }}
      >
        {children}
      </div>

      {/* ── Barra de navegación inferior (FUERA del área de contenido) ── */}
      {total > 1 && (
        <div className="absolute bottom-0 left-0 right-0 z-30 flex h-12 items-center justify-between bg-background/80 px-4 backdrop-blur-sm print:hidden">

          {/* Flecha izquierda */}
          <button
            onClick={prev}
            disabled={current === 0}
            aria-label="Página anterior"
            className="flex h-8 w-8 items-center justify-center rounded-full text-foreground/50 transition-colors hover:text-foreground disabled:opacity-20"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>

          {/* Centro: puntos + botón volver al índice si es categoría */}
          <div className="flex flex-col items-center gap-1">
            {isCategory && (
              <button
                onClick={() => goToId(indexPageId)}
                className="font-sans text-[9px] font-light uppercase tracking-[0.35em] text-primary hover:text-primary/70 transition-colors"
              >
                ↑ Índice
              </button>
            )}
            <div className="flex gap-1.5">
              {Array.from({ length: total }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  aria-label={`Ir a página ${i + 1}`}
                  className="h-1 rounded-full transition-all duration-300"
                  style={{
                    width: i === current ? "1.25rem" : "0.3rem",
                    backgroundColor: i === current ? "var(--color-primary, #E8B84B)" : "oklch(0.5 0 0 / 0.25)",
                  }}
                />
              ))}
            </div>
          </div>

          {/* Flecha derecha */}
          <button
            onClick={next}
            disabled={current === total - 1}
            aria-label="Página siguiente"
            className="flex h-8 w-8 items-center justify-center rounded-full text-foreground/50 transition-colors hover:text-foreground disabled:opacity-20"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>
      )}
    </div>
  )
}
