"use client"

import {
  useRef, useState, useCallback, useEffect,
  type ReactNode,
} from "react"
import type { MenuCategory } from "@/lib/get-menu"
import type { SiteConfig }   from "@/lib/get-config"
import { CartaTopbar }       from "./carta-topbar"
import { CartaNav }          from "./carta-nav"

interface Props {
  children: ReactNode
  menu:     MenuCategory[]
  config:   SiteConfig
}

export function CartaControls({ children, menu: _menu, config }: Props) {
  const sliderRef  = useRef<HTMLDivElement>(null)
  const [current,  setCurrent]  = useState(0)
  const [total,    setTotal]    = useState(0)
  const [pages,    setPages]    = useState<string[]>([])
  const [printing, setPrinting] = useState(false)

  useEffect(() => {
    const els = Array.from(
      sliderRef.current?.querySelectorAll<HTMLElement>("[data-page]") ?? []
    )
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

  const handleIndexClick = useCallback((e: React.MouseEvent) => {
    const btn = (e.target as HTMLElement).closest<HTMLElement>("[data-goto]")
    if (btn?.dataset.goto) goToId(btn.dataset.goto)
  }, [goToId])

  const handlePrint = useCallback(() => {
    setPrinting(true)
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        window.print()
        setPrinting(false)
      })
    })
  }, [])

  return (
    <div
      className={`relative h-svh w-full overflow-hidden bg-background${
        printing ? " carta-printing" : ""
      }`}
    >
      <CartaTopbar onPrint={handlePrint} config={config} />

      {/* Slider */}
      <div
        ref={sliderRef}
        onScroll={onScroll}
        onClick={handleIndexClick}
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

      <CartaNav
        current={current}
        total={total}
        pages={pages}
        config={config}
        onPrev={() => goTo(Math.max(0, current - 1))}
        onNext={() => goTo(Math.min(total - 1, current + 1))}
        onGoToId={goToId}
      />

      <style>{`
        @media print {
          #carta-topbar, #carta-nav { display: none !important; }
          .relative.h-svh { height: auto !important; overflow: visible !important; }
          .carta-slider {
            display: block !important;
            overflow: visible !important;
            height: auto !important;
            scroll-snap-type: none !important;
          }
          .carta-page {
            width: 100% !important;
            min-width: unset !important;
            height: auto !important;
            min-height: unset !important;
            scroll-snap-align: none !important;
            page-break-after: always;
            break-after: page;
          }
          .section-header-band { height: 80px !important; }
          body, .bg-background { background: white !important; color: black !important; }
        }
      `}</style>
    </div>
  )
}
